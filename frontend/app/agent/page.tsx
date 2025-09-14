'use client';

import { useState, useRef, useEffect } from 'react';
import { Room } from 'livekit-client';

export default function AgentPage() {
  const [error, setError] = useState('');
  const roomRef = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const connectToRoom = async () => {
      const url = 'wss://raisin-i4jg1gak.livekit.cloud';
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc4NTQzOTUsImlkZW50aXR5IjoidGVzdCIsImlzcyI6IkFQSTZmWGFwZ1E4Z0JaUCIsIm5iZiI6MTc1Nzg0NTM5NSwic3ViIjoidGVzdCIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsImhpZGRlbiI6dHJ1ZSwicm9vbSI6InRlc3Qtcm9vbSIsInJvb21Kb2luIjp0cnVlfH0.eEqj1ZZlcJLOeeEZ5dPakHO8YZYABUoAplW0SZMV13M';

      try {
        const room = new Room();
        roomRef.current = room;

        await room.connect(url, token);
        console.log('Connected to LiveKit room');
      } catch (err) {
        console.error('Error connecting to LiveKit room:', err);
        setError(`Failed to connect to LiveKit room: ${err.message}`);
      }
    };

    connectToRoom();

    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        fontFamily: "'Nunito Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <h2
        style={{
          fontFamily: "'Merriweather', serif",
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#333',
        }}
      >
        LiveKit Room
      </h2>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div
          style={{
            flex: 1,
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%' }} />
          <p
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              color: '#fff',
              fontSize: '0.9rem',
            }}
          >
            You
          </p>
        </div>

        <div
          style={{
            flex: 1,
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%' }} />
          <p
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              color: '#fff',
              fontSize: '0.9rem',
            }}
          >
            Remote Participant
          </p>
        </div>
      </div>
    </div>
  );
}
