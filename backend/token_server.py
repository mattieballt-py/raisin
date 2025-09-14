# backend/token_server.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

# Import LiveKit SDK
try:
    from livekit import AccessToken, VideoGrant
except ImportError:
    raise ImportError("Please install livekit-server-sdk: pip install livekit-server-sdk")

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "wss://raisin-i4jg1gak.livekit.cloud")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
    raise RuntimeError("Set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in backend/.env")

# Initialize FastAPI app
app = FastAPI(title="Token Server for LiveKit")

# Allow CORS from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body model
class TokenRequest(BaseModel):
    room: str
    identity: str
    name: Optional[str] = None

@app.post("/api/get-token")
def get_token(req: TokenRequest):
    """
    Request body: { "room": "room-name", "identity": "user-123", "name": "Optional name" }
    Response: { "token": "<jwt>", "url": "<livekit_url>" }
    """
    try:
        # Create room grant
        grant = VideoGrant(room_join=True, room=req.room)

        # Create access token
        token_obj = AccessToken(
            api_key=LIVEKIT_API_KEY,
            api_secret=LIVEKIT_API_SECRET,
            identity=req.identity,
            name=req.name
        )

        # Add the video grant
        token_obj.add_grant(grant)

        # Generate JWT
        jwt_token = token_obj.to_jwt()

        return {"token": jwt_token, "url": LIVEKIT_URL}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token generation failed: {e}")

@app.get("/")
def root():
    return {"message": "Backend is running!"}
