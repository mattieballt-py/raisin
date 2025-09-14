'use client';

import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';

export default function AgentPage() {
  const [error, setError] = useState('');
  const roomRef = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  /** Automatically connect to LiveKit room */
  useEffect(() => {
    const connectToRoom = async () => {
      try {
        // Fetch token and wsURL from the backend
        const response = await fetch('/api/livekit-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room: 'default-room', identity: 'auto-user' }),
        });

        const data = await response.json();
        if (!data.token || !data.url) {
          throw new Error('Failed to fetch token or URL');
        }

        const { token, url } = data;

        // Create a new LiveKit room
        const room = new Room();
        roomRef.current = room;

        // Handle participant events
        room.on(RoomEvent.ParticipantConnected, (participant) => {
          console.log(`Participant connected: ${participant.identity}`);
        });

        room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
            track.attach(remoteVideoRef.current);
          }
        });

        // Connect to the LiveKit room
        await room.connect(url, token);

        // Publish local video
        await room.localParticipant.enableCameraAndMicrophone();
        const localTrack = room.localParticipant.getTrack(Track.Source.Camera);
        if (localTrack && localVideoRef.current) {
          localTrack.videoTrack?.attach(localVideoRef.current);
        }

        console.log('Connected to LiveKit room');
      } catch (err) {
        console.error('Error connecting to LiveKit room:', err);
        setError('Failed to connect to the LiveKit room.');
      }
    };

    connectToRoom();

    // Cleanup on component unmount
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
