# backend/token_server.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import jwt  # Use pyjwt for token generation
import os
import time
from dotenv import load_dotenv

# Load .env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "https://your-livekit-host")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
    raise RuntimeError("Set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in backend/.env")

app = FastAPI(title="Token Server for LiveKit")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenRequest(BaseModel):
    room: str
    identity: str
    name: Optional[str] = None

@app.post("/api/get-token")
def get_token(req: TokenRequest):
    try:
        # Current time
        now = int(time.time())

        # Token payload
        payload = {
            "iss": LIVEKIT_API_KEY,  # API Key
            "exp": now + 3600,  # Token expiration (1 hour)
            "nbf": now,  # Not valid before now
            "video": {
                "room": req.room,
                "participant_identity": req.identity,
                "participant_name": req.name,
            },
        }

        # Generate JWT token
        token = jwt.encode(payload, LIVEKIT_API_SECRET, algorithm="HS256")

        return {"token": token, "url": LIVEKIT_URL}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token generation failed: {e}")

@app.get("/")
def root():
    return {"message": "Backend is running!"}
