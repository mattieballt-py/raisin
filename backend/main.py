import argparse
import sys
from functools import partial
from typing import Optional
import asyncio
import time
import base64
import io
import pyautogui
from PIL import Image
import openai
import os
import concurrent.futures

from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    WorkerType,
    cli,
)
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import bey, openai as openai_plugin

# ---------- Config ----------
SCREEN_INTERVAL_SEC = 6      # how often to refresh screenshots
CTX_MAX_CHARS = 1200         # keep system prompt short & snappy

BASE_INSTRUCTIONS = """You are a helpful AI assistant that can see the user's screen and hear their voice in real-time.

Important: Before each response, you will receive a SCREEN_CONTEXT message that tells you what the user is currently viewing. Always use this latest screen context to inform your responses.

Respond naturally and conversationally. You can:
- Comment on what you see on their screen in detail, so tell exactly what page/app they are using
- Help with applications or content they're viewing  
- Answer questions about what's displayed
- Provide assistance based on their current context

Keep responses concise and helpful.
"""

# ---------- Screenshot manager ----------
class ScreenshotContextManager:
    """Manages screenshot context for the realtime conversation"""

    def __init__(self, interval: int = SCREEN_INTERVAL_SEC):
        self.interval = interval
        self.current_screenshot_description = ""
        self.running = False
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set!")
        self.openai_client = openai.OpenAI(api_key=api_key)
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)
        pyautogui.FAILSAFE = False
        print("✅ Screenshot context manager initialized")

    async def start(self):
        self.running = True
        asyncio.create_task(self.screenshot_analysis_loop())
        print("📸 Screenshot context manager started")

    async def stop(self):
        self.running = False
        self.executor.shutdown(wait=False)

    async def screenshot_analysis_loop(self):
        while self.running:
            try:
                print("📸 Taking and analyzing screenshot...")

                # Take screenshot
                screenshot = pyautogui.screenshot()

                # Convert RGBA to RGB if needed
                if screenshot.mode == "RGBA":
                    screenshot = screenshot.convert("RGB")

                # Resize for efficiency
                if screenshot.width > 1024:
                    ratio = 1024 / screenshot.width
                    new_height = int(screenshot.height * ratio)
                    screenshot = screenshot.resize((1024, new_height), Image.Resampling.LANCZOS)

                # Convert to base64
                buffer = io.BytesIO()
                screenshot.save(buffer, format='JPEG', quality=85)
                image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
                screenshot_url = f"data:image/jpeg;base64,{image_base64}"

                # Analyze screenshot with GPT-4o (run sync call in a thread)
                description = await self.analyze_screenshot(screenshot_url)
                self.current_screenshot_description = description

                print(f"🖼️ Screenshot analyzed: {description[:100]}...")

                await asyncio.sleep(self.interval)

            except Exception as e:
                print(f"❌ Screenshot analysis error: {e}")
                await asyncio.sleep(1)

    def _analyze_screenshot_sync(self, screenshot_url: str) -> str:
        """Synchronous screenshot analysis (runs in thread pool)"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": (
                                    "Analyze this screenshot briefly:\n"
                                    "- What specific app/website is visible?\n"
                                    "- What is the user likely doing?\n"
                                    "- Any notable content, text, or interface elements?\n"
                                    "Be specific about app names and content. Keep it concise - 2-3 sentences max."
                                ),
                            },
                            {"type": "image_url", "image_url": {"url": screenshot_url}},
                        ],
                    }
                ],
                max_tokens=150,
            )
            return response.choices[0].message.content or "No description."
        except Exception as e:
            print(f"❌ Sync screenshot analysis error: {e}")
            return "Unable to analyze current screen content."

    async def analyze_screenshot(self, screenshot_url: str) -> str:
        """Async wrapper: run sync OpenAI call in a thread"""
        try:
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(
                self.executor, self._analyze_screenshot_sync, screenshot_url
            )
        except Exception as e:
            print(f"❌ Screenshot analysis error: {e}")
            return "Unable to analyze current screen content."

    def get_current_context(self) -> str:
        if self.current_screenshot_description:
            return self.current_screenshot_description.strip()
        return "Screen content not yet captured."

# ---------- Context-Aware Agent ----------
class ContextAwareAgent(Agent):
    def __init__(self, screenshot_manager: ScreenshotContextManager):
        self.screenshot_manager = screenshot_manager
        super().__init__(instructions=BASE_INSTRUCTIONS)

# ---------- Entrypoint ----------
async def entrypoint(ctx: JobContext, avatar_id: Optional[str]) -> None:
    print("🚀 Starting realtime agent with screenshot context...")

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    print("✅ Connected to room")

    # Start screenshots
    screenshot_manager = ScreenshotContextManager()
    await screenshot_manager.start()

    # Wait a moment for first screenshot
    await asyncio.sleep(2)

    # Create our context-aware agent
    agent = ContextAwareAgent(screenshot_manager=screenshot_manager)

    # Realtime LLM session
    local_agent_session = AgentSession(
        llm=openai_plugin.realtime.RealtimeModel(
            model="gpt-4o-realtime-preview",
            voice="cedar",
        )
    )
    print("✅ Realtime agent session created")

    # Track last context sent to avoid spam
    last_context_sent = ""

    async def inject_screen_context():
        """Inject current screen context as a user message"""
        nonlocal last_context_sent
        
        current_context = agent.screenshot_manager.get_current_context()
        context_message = f"SCREEN_CONTEXT: {current_context}"
        
        # Only send if context has changed significantly
        if context_message != last_context_sent:
            last_context_sent = context_message
            
            try:
                # Try to inject context by sending a system-style message
                llm = local_agent_session.llm
                
                # Method 1: Try to add conversation item
                if hasattr(llm, '_conversation') and hasattr(llm._conversation, 'add_item'):
                    llm._conversation.add_item({
                        "type": "message",
                        "role": "user",
                        "content": [{"type": "text", "text": context_message}]
                    })
                    print("✅ Context injected via conversation")
                    return True
                    
                # Method 2: Try to send via WebSocket
                if hasattr(llm, '_client') and llm._client:
                    await llm._client.send({
                        "type": "conversation.item.create",
                        "item": {
                            "type": "message", 
                            "role": "user",
                            "content": [{"type": "text", "text": context_message}]
                        }
                    })
                    print("✅ Context sent via WebSocket")
                    return True
                    
                # Method 3: Try to add to session somehow
                if hasattr(llm, 'add_user_message'):
                    await llm.add_user_message(context_message)
                    print("✅ Context added via add_user_message")
                    return True
                    
            except Exception as e:
                print(f"❌ Context injection failed: {e}")
                
            print(f"🔍 Context to inject: {context_message[:100]}...")
            return False

    # Log when user speaks and inject context
    @local_agent_session.on("transcription")
    def _(evt):
        if evt.is_final:
            print(f"📝 User said: {evt.text}")
            # Inject context before agent responds
            asyncio.create_task(inject_screen_context())

    # Also inject context when agent starts speaking
    @local_agent_session.on("agent_speech_started")
    def _(evt):
        print("🎤 Agent starting to speak - injecting latest context")
        asyncio.create_task(inject_screen_context())

    # Log agent responses
    @local_agent_session.on("agent_speech")
    def _(evt):
        print(f"🤖 Agent response: {evt.text[:100]}...")

    # (Optional) observe avatar media
    @ctx.room.on("track_subscribed")
    def _(track, pub, participant):
        try:
            kind = getattr(track.kind, "name", str(track.kind))
        except Exception:
            kind = str(track.kind)
        print(f"✅ subscribed to {participant.identity} {kind}")

    # Avatar hookup
    bey_avatar_session = bey.AvatarSession(avatar_id=avatar_id) if avatar_id else bey.AvatarSession()
    await bey_avatar_session.start(local_agent_session, room=ctx.room)
    print("✅ Bey avatar session started")

    # Periodic context injection
    async def periodic_context_injection():
        await asyncio.sleep(5)  # Wait for session to be established
        while True:
            await inject_screen_context()
            await asyncio.sleep(10)  # Less frequent periodic updates

    asyncio.create_task(periodic_context_injection())

    # Start the agent with our context-aware agent
    await local_agent_session.start(agent=agent, room=ctx.room)
    print("✅ Context-aware agent started — listening & seeing your screen")
    
    # Log the initial context
    print(f"🔍 Initial screen context: {agent.screenshot_manager.get_current_context()}")

# ---------- CLI ----------
if __name__ == "__main__":
    load_dotenv()

    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY environment variable not found!")
        print("Please set it with: export OPENAI_API_KEY='your-api-key-here'")
        sys.exit(1)
    else:
        print("✅ OPENAI_API_KEY found")

    parser = argparse.ArgumentParser(description="Run realtime agent with screenshot context.")
    parser.add_argument("--avatar-id", type=str, help="Avatar ID to use.")
    args = parser.parse_args()

    # LiveKit dev runner
    sys.argv = [sys.argv[0], "dev"]
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=partial(entrypoint, avatar_id=args.avatar_id),
            worker_type=WorkerType.ROOM,
        )
    )