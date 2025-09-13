import React, { useEffect, useState } from 'react';
import { connect, Room, RemoteParticipant } from 'livekit-client';

function LiveStream() {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    async function joinRoom() {
      try {
        // 1️⃣ Get token from your Python backend
        const res = await fetch('http://localhost:8000/token'); // backend endpoint
        const data = await res.json();
        const token = data.token;

        // 2️⃣ Connect to LiveKit room
        const room = await connect('wss://your-livekit-server-url', token, {
          audio: true,
          video: false, // hide your own video
        });
        setRoom(room);

        // 3️⃣ Hide all participants except the avatar
        room.participants.forEach(handleParticipant);
        room.on('participantConnected', handleParticipant);

      } catch (err) {
        console.error('Failed to join LiveKit room', err);
      }
    }

    function handleParticipant(participant: RemoteParticipant) {
      // Hide video for humans (you and AI agent)
      const isAvatar = participant.identity === 'avatar';
      if (!isAvatar) {
        participant.setSubscribedTracks({ video: false, audio: true });
      }
    }

    joinRoom();

    return () => {
      room?.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Live Avatar Stream</h1>
      <div id="avatar-container">
        {/* LiveKit JS will attach avatar video element here */}
      </div>
    </div>
  );
}

export default LiveStream;
