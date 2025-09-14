'use client';

import { useState, useEffect, useRef } from 'react';
import { Room, RoomEvent, RemoteParticipant, Track } from 'livekit-client';

export default function AgentPage() {
  const [identity, setIdentity] = useState('');
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  const roomRef = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  /** Fetch token from Next.js API route */
  const fetchToken = async () => {
    try {
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, room: roomName }),
      });

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        return data.token;
      } else {
        throw new Error('Failed to get token');
      }
    } catch (err) {
      setError('Error fetching token');
      console.error(err);
    }
  };

  /** Connect to LiveKit Room */
  const connectToRoom = async () => {
    if (!identity || !roomName) {
      setError('Please enter both an identity and a room name.');
      return;
    }

    const token = await fetchToken();
    if (!token) return;

    try {
      const room = new Room();
      roomRef.current = room;

      // Handle participant events
      room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log(`Participant connected: ${participant.identity}`);
      });

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
          track.attach(remoteVideoRef.current);
        }
      });

      // Connect using the token
      await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL as string, token);

      // Publish local video
      await room.localParticipant.enableCameraAndMicrophone();
      const localTrack = room.localParticipant.getTrack(Track.Source.Camera);
      if (localTrack && localVideoRef.current) {
        localTrack.videoTrack?.attach(localVideoRef.current);
      }

      setIsConnected(true);
      setError('');
    } catch (err) {
      console.error('Error connecting to room:', err);
      setError('Failed to connect to the room.');
    }
  };

  /** Disconnect when component unmounts */
  useEffect(() => {
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
      {/* Connect Form */}
      {!isConnected && (
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
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
            Join a LiveKit Room
          </h2>

          <input
            type="text"
            placeholder="Your Name"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <button
            onClick={connectToRoom}
            style={{
              background: '#4A90E2',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.3s',
              width: '100%',
            }}
          >
            Connect
          </button>

          {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        </div>
      )}

      {/* Video Display */}
      {isConnected && (
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
      )}
    </div>
  );
}
