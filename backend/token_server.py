# backend/token_server.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from livekit.api import AccessToken, VideoGrants
import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "https://your-livekit-host")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
    raise RuntimeError("Set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in backend/.env")

# Initialize FastAPI app
app = FastAPI(title="Token Server for LiveKit")

# Allow requests from the frontend
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

# POST endpoint to get a token
@app.post("/api/get-token")
def get_token(req: TokenRequest):
    """
    Request body: { "room": "room-name", "identity": "user-123", "name": "Optional name" }
    Response: { "token": "<jwt>", "url": "<livekit_url>" }
    """
    try:
        # Create a grant allowing the user to join a room
        grant = VideoGrants(room_join=True, room=req.room)

        # Build the access token
        token_obj = AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
        token_obj.identity = req.identity
        if req.name:
            token_obj.name = req.name
        token_obj.add_grant(grant)

        jwt = token_obj.to_jwt()

        return {"token": jwt, "url": LIVEKIT_URL}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token generation failed: {e}")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
