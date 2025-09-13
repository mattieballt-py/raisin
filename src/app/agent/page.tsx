'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { RealtimeAgent, RealtimeSession, startRecording, sendAudioToAgent } from '../../lib/voice';

export default function AgentPage() {
  const [session, setSession] = useState<RealtimeSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const initializeAgent = async () => {
      const response = await fetch('/api/openai/token');
      const { value: ephemeralToken } = await response.json();

      const agent = new RealtimeAgent({
        name: 'Raisin',
        instructions: 'You are a helpful assistant.',
        ephemeralToken,
      });

      const newSession = new RealtimeSession(agent);
      setSession(newSession);
    };

    initializeAgent();

    return () => session?.close();
  }, []);

  const handleRecord = async () => {
    setIsRecording(true);
    const recorder = await startRecording((audioBlob: Blob) => {
      if (session) sendAudioToAgent(session, audioBlob);
      setIsRecording(false);
    });
    setTimeout(() => recorder.stop(), 5000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Nav + Agent UI + Instructions ... */}
      {/* Use your previous full JSX here */}
    </div>
  );
}
