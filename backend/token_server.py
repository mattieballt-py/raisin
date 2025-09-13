# backend/token_server.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import os
from livekit import AccessToken, VideoGrant

# Load environment variables
from backend import __init__

app = FastAPI()

# Allow your frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

@app.get("/get-token")
async def get_token(identity: str = Query(...), room: str = Query(...)):
    """
    Generate a temporary LiveKit token for a user.
    - identity = unique user ID
    - room = which LiveKit room to join
    """
    grant = VideoGrant(room_join=True, room=room)
    at = AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
    at.identity = identity
    at.add_grant(grant)

    return {"token": at.to_jwt()}
