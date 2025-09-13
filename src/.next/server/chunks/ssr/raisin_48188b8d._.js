module.exports = [
"[project]/raisin/src/lib/voice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendAudioToAgent",
    ()=>sendAudioToAgent,
    "startRecording",
    ()=>startRecording
]);
async function startRecording(callback) {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    mediaRecorder.ondataavailable = (e)=>chunks.push(e.data);
    mediaRecorder.onstop = ()=>{
        const blob = new Blob(chunks, {
            type: "audio/wav"
        });
        callback(blob);
    };
    mediaRecorder.start();
    return mediaRecorder;
}
async function sendAudioToAgent(dataChannel, audio) {
    try {
        console.log("Sending audio to agent...", dataChannel, audio);
        if (!dataChannel || dataChannel.readyState !== 'open') {
            throw new Error("Data channel not available or not open");
        }
        // Convert blob to ArrayBuffer
        const arrayBuffer = await audio.arrayBuffer();
        // Convert to base64 for transmission
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        // Send audio to OpenAI Realtime API via data channel
        const audioEvent = {
            type: 'input_audio_buffer.append',
            audio: base64Audio
        };
        dataChannel.send(JSON.stringify(audioEvent));
        console.log("Audio sent successfully via data channel");
        return {
            success: true
        };
    } catch (error) {
        console.error("Error sending audio to agent:", error);
        return {
            success: false,
            error: error.message
        };
    }
}
}),
"[project]/raisin/src/app/agent/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgentPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/raisin/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/raisin/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$src$2f$lib$2f$voice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/raisin/src/lib/voice.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function AgentPage() {
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRecording, setIsRecording] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [agentResponses, setAgentResponses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const responseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const peerConnectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dataChannelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioElementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        console.log('[AgentPage] mount - initializing agent');
        const initializeAgent = async ()=>{
            try {
                console.log('[AgentPage] fetching ephemeral token from /api/openai/token');
                const resp = await fetch('/api/openai/token');
                console.log('[AgentPage] token response status', resp.status);
                const json = await resp.json().catch((e)=>{
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
                peerConnection.ontrack = (event)=>{
                    console.log('[AgentPage] received audio track from OpenAI');
                    if (audioElementRef.current) {
                        audioElementRef.current.srcObject = event.streams[0];
                    }
                };
                // Create data channel for sending messages to OpenAI
                const dataChannel = peerConnection.createDataChannel('oai-events');
                dataChannelRef.current = dataChannel;
                dataChannel.addEventListener('open', ()=>{
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
                dataChannel.addEventListener('message', (event)=>{
                    try {
                        const response = JSON.parse(event.data);
                        console.log('[AgentPage] received message from OpenAI:', response);
                        // Handle different types of responses
                        if (response.type === 'response.audio_transcript.delta' && response.delta) {
                            setAgentResponses((prev)=>[
                                    ...prev,
                                    response.delta
                                ]);
                        } else if (response.type === 'response.audio_transcript.done' && response.text) {
                            setAgentResponses((prev)=>[
                                    ...prev,
                                    response.text
                                ]);
                        } else if (response.type === 'response.text.delta' && response.delta) {
                            setAgentResponses((prev)=>[
                                    ...prev,
                                    response.delta
                                ]);
                        } else if (response.type === 'response.text.done' && response.text) {
                            setAgentResponses((prev)=>[
                                    ...prev,
                                    response.text
                                ]);
                        }
                    } catch (error) {
                        console.error('[AgentPage] error parsing message:', error);
                    }
                });
                // Get user media for microphone input
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
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
                        'Content-Type': 'application/sdp'
                    }
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
        return ()=>{
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log('[AgentPage] agentResponses changed, count =', agentResponses.length);
        if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [
        agentResponses
    ]);
    const handleRecord = async ()=>{
        console.log('[AgentPage] handleRecord called, isConnected=', isConnected);
        if (!isConnected || !dataChannelRef.current) {
            console.warn('[AgentPage] not connected to OpenAI yet');
            return;
        }
        setIsRecording(true);
        try {
            const recorder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$src$2f$lib$2f$voice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startRecording"])(async (audioBlob)=>{
                try {
                    console.log('[AgentPage] recorded audio blob, size:', audioBlob.size);
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$src$2f$lib$2f$voice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sendAudioToAgent"])(dataChannelRef.current, audioBlob);
                    console.log('[AgentPage] sendAudioToAgent result', result);
                } catch (e) {
                    console.error('[AgentPage] error sending audio to agent', e);
                } finally{
                    setIsRecording(false);
                }
            });
            // Stop automatically after 5 seconds
            setTimeout(()=>{
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: '#f5f5f5',
            fontFamily: "'Nunito Sans', sans-serif",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: '420px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '1rem',
                        background: '#0f172a',
                        color: '#fff',
                        fontWeight: 700
                    },
                    children: "Raisin — realtime debug"
                }, void 0, false, {
                    fileName: "[project]/raisin/src/app/agent/page.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: responseRef,
                    style: {
                        maxHeight: 320,
                        overflowY: 'auto',
                        padding: '1rem',
                        borderBottom: '1px solid #eee'
                    },
                    children: agentResponses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: '#666'
                        },
                        children: isConnected ? 'Connected! Click "Talk" to start a conversation.' : 'Connecting to OpenAI...'
                    }, void 0, false, {
                        fileName: "[project]/raisin/src/app/agent/page.tsx",
                        lineNumber: 223,
                        columnNumber: 13
                    }, this) : agentResponses.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: '#f7fafc',
                                margin: '8px 0',
                                padding: '10px',
                                borderRadius: 8
                            },
                            children: r
                        }, i, false, {
                            fileName: "[project]/raisin/src/app/agent/page.tsx",
                            lineNumber: 228,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/raisin/src/app/agent/page.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'center'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleRecord,
                        disabled: isRecording || !isConnected,
                        style: {
                            padding: '10px 18px',
                            borderRadius: 8,
                            background: isRecording ? '#9ca3af' : isConnected ? '#0f172a' : '#6b7280',
                            color: '#fff',
                            border: 'none',
                            cursor: isRecording || !isConnected ? 'not-allowed' : 'pointer'
                        },
                        children: isRecording ? 'Recording…' : isConnected ? 'Talk (5s)' : 'Connecting…'
                    }, void 0, false, {
                        fileName: "[project]/raisin/src/app/agent/page.tsx",
                        lineNumber: 236,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/raisin/src/app/agent/page.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/raisin/src/app/agent/page.tsx",
            lineNumber: 205,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/raisin/src/app/agent/page.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
}),
"[project]/raisin/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/raisin/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=raisin_48188b8d._.js.map