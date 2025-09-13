'use client';

import { useState, useEffect, useRef } from 'react';
import { startRecording, sendAudioToAgent } from '../../lib/voice';

export default function AgentPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [agentResponses, setAgentResponses] = useState<string[]>([]);
  const responseRef = useRef<HTMLDivElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let mounted = true;
    console.log('[AgentPage] mount - initializing agent');

    const initializeAgent = async () => {
      try {
        console.log('[AgentPage] fetching ephemeral token from /api/openai/token');
        const resp = await fetch('/api/openai/token');
        console.log('[AgentPage] token response status', resp.status);
        const json = await resp.json().catch((e) => {
          console.error('[AgentPage] failed parsing token JSON', e);
          return null;
        });
        console.log('[AgentPage] token response JSON', json);
        const ephemeralToken = json?.value;
        if (!ephemeralToken) {
          console.error('[AgentPage] no ephemeral token received');
          return;
        }
        console.log('[AgentPage] ephemeral token received (length)', ephemeralToken.length);

        // Create WebRTC peer connection
        const peerConnection = new RTCPeerConnection();
        peerConnectionRef.current = peerConnection;

        // Create audio element for playing AI responses
        const audioElement = document.createElement('audio');
        audioElement.autoplay = true;
        audioElementRef.current = audioElement;
        document.body.appendChild(audioElement);

        // Handle incoming audio tracks from OpenAI
        peerConnection.ontrack = (event) => {
          console.log('[AgentPage] received audio track from OpenAI');
          if (audioElementRef.current) {
            audioElementRef.current.srcObject = event.streams[0];
          }
        };

        // Create data channel for sending messages to OpenAI
        const dataChannel = peerConnection.createDataChannel('oai-events');
        dataChannelRef.current = dataChannel;

        dataChannel.addEventListener('open', () => {
          console.log('[AgentPage] data channel opened');
          setIsConnected(true);
          
          // Send session update with instructions
          const sessionUpdate = {
            type: 'session.update',
            session: {
              instructions: 'You are a helpful assistant named Raisin. Be friendly and conversational.',
              voice: 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              turn_detection: {
                type: 'server_vad'
              }
            }
          };
          dataChannel.send(JSON.stringify(sessionUpdate));
        });

        dataChannel.addEventListener('message', (event) => {
          try {
            const response = JSON.parse(event.data);
            console.log('[AgentPage] received message from OpenAI:', response);
            
            // Handle different types of responses
            if (response.type === 'response.audio_transcript.delta' && response.delta) {
              setAgentResponses(prev => [...prev, response.delta]);
            } else if (response.type === 'response.audio_transcript.done' && response.text) {
              setAgentResponses(prev => [...prev, response.text]);
            } else if (response.type === 'response.text.delta' && response.delta) {
              setAgentResponses(prev => [...prev, response.delta]);
            } else if (response.type === 'response.text.done' && response.text) {
              setAgentResponses(prev => [...prev, response.text]);
            }
          } catch (error) {
            console.error('[AgentPage] error parsing message:', error);
          }
        });

        // Get user media for microphone input
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = mediaStream.getAudioTracks()[0];
        peerConnection.addTrack(audioTrack);

        // Create offer and establish connection
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send offer to OpenAI
        const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
          method: 'POST',
          body: offer.sdp,
          headers: {
            'Authorization': `Bearer ${ephemeralToken}`,
            'Content-Type': 'application/sdp',
          },
        });

        if (!sdpResponse.ok) {
          throw new Error(`Failed to connect to OpenAI: ${sdpResponse.status}`);
        }

        // Set remote description with OpenAI's answer
        const answer = {
          type: 'answer',
          sdp: await sdpResponse.text()
        };
        await peerConnection.setRemoteDescription(answer);

        console.log('[AgentPage] WebRTC connection established with OpenAI');
      } catch (err) {
        console.error('[AgentPage] initializeAgent error', err);
      }
    };

    initializeAgent();

    return () => {
      console.log('[AgentPage] cleanup - closing connections');
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (audioElementRef.current) {
        audioElementRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    console.log('[AgentPage] agentResponses changed, count =', agentResponses.length);
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [agentResponses]);

  const handleRecord = async () => {
    console.log('[AgentPage] handleRecord called, isConnected=', isConnected);
    if (!isConnected || !dataChannelRef.current) {
      console.warn('[AgentPage] not connected to OpenAI yet');
      return;
    }
    setIsRecording(true);

    try {
      const recorder = await startRecording(async (audioBlob: Blob) => {
        try {
          console.log('[AgentPage] recorded audio blob, size:', audioBlob.size);
          const result = await sendAudioToAgent(dataChannelRef.current!, audioBlob);
          console.log('[AgentPage] sendAudioToAgent result', result);
        } catch (e) {
          console.error('[AgentPage] error sending audio to agent', e);
        } finally {
          setIsRecording(false);
        }
      });

      // Stop automatically after 5 seconds
      setTimeout(() => {
        try {
          recorder.stop();
          console.log('[AgentPage] recorder.stop() called');
        } catch (e) {
          console.error('[AgentPage] recorder.stop() error', e);
        }
      }, 5000);
    } catch (e) {
      console.error('[AgentPage] startRecording error', e);
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '420px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem', background: '#0f172a', color: '#fff', fontWeight: 700 }}>
          Raisin — realtime debug
        </div>

        <div
          ref={responseRef}
          style={{ maxHeight: 320, overflowY: 'auto', padding: '1rem', borderBottom: '1px solid #eee' }}
        >
          {agentResponses.length === 0 ? (
            <p style={{ color: '#666' }}>
              {isConnected ? 'Connected! Click "Talk" to start a conversation.' : 'Connecting to OpenAI...'}
            </p>
          ) : (
            agentResponses.map((r, i) => (
              <div key={i} style={{ background: '#f7fafc', margin: '8px 0', padding: '10px', borderRadius: 8 }}>
                {r}
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleRecord}
            disabled={isRecording || !isConnected}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: isRecording ? '#9ca3af' : isConnected ? '#0f172a' : '#6b7280',
              color: '#fff',
              border: 'none',
              cursor: isRecording || !isConnected ? 'not-allowed' : 'pointer',
            }}
          >
            {isRecording ? 'Recording…' : isConnected ? 'Talk (5s)' : 'Connecting…'}
          </button>
        </div>
      </div>
    </div>
  );
}
