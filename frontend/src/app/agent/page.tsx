'use client';

import { useState, useEffect, useRef } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import { startRecording, sendAudioToAgent } from '@/lib/voice';

export default function AgentPage() {
  const [session, setSession] = useState<RealtimeSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [instructions, setInstructions] = useState<string[]>([]);
  const sessionRef = useRef<RealtimeSession | null>(null);

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        const response = await fetch('/api/openai/token');
        const { value: ephemeralToken } = await response.json();

        const agent = new RealtimeAgent({
          name: 'Raisin',
          instructions: 'You are a helpful assistant. Provide step-by-step instructions.',
          ephemeralToken,
        });

        const newSession = new RealtimeSession(agent);
        sessionRef.current = newSession;
        setSession(newSession);

        // Listen for responses from the agent
        newSession.on('response', (payload: any) => {
          const text = payload?.text;
          if (text) {
            setInstructions((prev) => [...prev, text]);
          }
        });
      } catch (error) {
        console.error('[AgentPage] Error initializing agent:', error);
      }
    };

    initializeAgent();

    return () => {
      sessionRef.current?.close();
    };
  }, []);

  const handleRecord = async () => {
    if (!sessionRef.current) return;

    setIsRecording(true);

    try {
      const recorder = await startRecording(async (audioBlob: Blob) => {
        await sendAudioToAgent(sessionRef.current as any, audioBlob);
        setIsRecording(false);
      });

      // Stop recording after 5 seconds
      setTimeout(() => recorder.stop(), 5000);
    } catch (error) {
      console.error('[AgentPage] Error during recording:', error);
      setIsRecording(false);
    }
  };

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
      {/* Voice Recording Box */}
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
          Talk to Raisin
        </h2>
        <button
          onClick={handleRecord}
          disabled={isRecording || !session}
          style={{
            background: isRecording ? '#ccc' : '#4A90E2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: isRecording || !session ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
          }}
        >
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
      </div>

      {/* Instructions Box */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
        }}
      >
        <h3
          style={{
            fontFamily: "'Merriweather', serif",
            fontSize: '1.25rem',
            marginBottom: '1rem',
            color: '#333',
          }}
        >
          Instructions
        </h3>
        {instructions.length === 0 ? (
          <p style={{ color: '#666' }}>No instructions yet. Speak to Raisin to get started.</p>
        ) : (
          <div
            style={{
              color: '#333',
              fontSize: '1rem',
              lineHeight: '1.5',
            }}
          >
            {instructions.map((instruction, index) => (
              <p key={index} style={{ marginBottom: '0.5rem' }}>
                • {instruction}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
