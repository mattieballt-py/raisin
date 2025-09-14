# backend/token_server.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from livekit.api import AccessToken, VideoGrant  # Corrected import
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

# POST endpoint to get a LiveKit token
@app.post("/api/get-token")
def get_token(req: TokenRequest):
    """
    Request body: { "room": "room-name", "identity": "user-123", "name": "Optional name" }
    Response: { "token": "<jwt>", "url": "<livekit_url>" }
    """
    try:
        # Create a VideoGrant
        grant = VideoGrant(room_join=True, room=req.room)

        # Create AccessToken with the grant
        token_obj = AccessToken(
            api_key=LIVEKIT_API_KEY,
            api_secret=LIVEKIT_API_SECRET,
            grants=[grant],         # Pass grants as a list
            identity=req.identity,  # Required
            name=req.name           # Optional
        )

        jwt = token_obj.to_jwt()
        return {"token": jwt, "url": LIVEKIT_URL}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token generation failed: {e}")

# Optional: simple root endpoint to test server
@app.get("/")
def root():
    return {"message": "Backend is running!"}
