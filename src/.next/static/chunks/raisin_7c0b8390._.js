(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/raisin/src/lib/voice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/raisin/src/app/agent/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgentPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/raisin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/raisin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$src$2f$lib$2f$voice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/raisin/src/lib/voice.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function AgentPage() {
    _s();
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRecording, setIsRecording] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [agentResponses, setAgentResponses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const responseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const peerConnectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dataChannelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioElementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentPage.useEffect": ()=>{
            let mounted = true;
            console.log('[AgentPage] mount - initializing agent');
            const initializeAgent = {
                "AgentPage.useEffect.initializeAgent": async ()=>{
                    try {
                        console.log('[AgentPage] fetching ephemeral token from /api/openai/token');
                        const resp = await fetch('/api/openai/token');
                        console.log('[AgentPage] token response status', resp.status);
                        const json = await resp.json().catch({
                            "AgentPage.useEffect.initializeAgent": (e)=>{
                                console.error('[AgentPage] failed parsing token JSON', e);
                                return null;
                            }
                        }["AgentPage.useEffect.initializeAgent"]);
                        console.log('[AgentPage] token response JSON', json);
                        const ephemeralToken = json === null || json === void 0 ? void 0 : json.value;
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
                        peerConnection.ontrack = ({
                            "AgentPage.useEffect.initializeAgent": (event)=>{
                                console.log('[AgentPage] received audio track from OpenAI');
                                if (audioElementRef.current) {
                                    audioElementRef.current.srcObject = event.streams[0];
                                }
                            }
                        })["AgentPage.useEffect.initializeAgent"];
                        // Create data channel for sending messages to OpenAI
                        const dataChannel = peerConnection.createDataChannel('oai-events');
                        dataChannelRef.current = dataChannel;
                        dataChannel.addEventListener('open', {
                            "AgentPage.useEffect.initializeAgent": ()=>{
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
                            }
                        }["AgentPage.useEffect.initializeAgent"]);
                        dataChannel.addEventListener('message', {
                            "AgentPage.useEffect.initializeAgent": (event)=>{
                                try {
                                    const response = JSON.parse(event.data);
                                    console.log('[AgentPage] received message from OpenAI:', response);
                                    // Handle different types of responses
                                    if (response.type === 'response.audio_transcript.delta' && response.delta) {
                                        setAgentResponses({
                                            "AgentPage.useEffect.initializeAgent": (prev)=>[
                                                    ...prev,
                                                    response.delta
                                                ]
                                        }["AgentPage.useEffect.initializeAgent"]);
                                    } else if (response.type === 'response.audio_transcript.done' && response.text) {
                                        setAgentResponses({
                                            "AgentPage.useEffect.initializeAgent": (prev)=>[
                                                    ...prev,
                                                    response.text
                                                ]
                                        }["AgentPage.useEffect.initializeAgent"]);
                                    } else if (response.type === 'response.text.delta' && response.delta) {
                                        setAgentResponses({
                                            "AgentPage.useEffect.initializeAgent": (prev)=>[
                                                    ...prev,
                                                    response.delta
                                                ]
                                        }["AgentPage.useEffect.initializeAgent"]);
                                    } else if (response.type === 'response.text.done' && response.text) {
                                        setAgentResponses({
                                            "AgentPage.useEffect.initializeAgent": (prev)=>[
                                                    ...prev,
                                                    response.text
                                                ]
                                        }["AgentPage.useEffect.initializeAgent"]);
                                    }
                                } catch (error) {
                                    console.error('[AgentPage] error parsing message:', error);
                                }
                            }
                        }["AgentPage.useEffect.initializeAgent"]);
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
                                'Authorization': "Bearer ".concat(ephemeralToken),
                                'Content-Type': 'application/sdp'
                            }
                        });
                        if (!sdpResponse.ok) {
                            throw new Error("Failed to connect to OpenAI: ".concat(sdpResponse.status));
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
                }
            }["AgentPage.useEffect.initializeAgent"];
            initializeAgent();
            return ({
                "AgentPage.useEffect": ()=>{
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
                }
            })["AgentPage.useEffect"];
        }
    }["AgentPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentPage.useEffect": ()=>{
            console.log('[AgentPage] agentResponses changed, count =', agentResponses.length);
            if (responseRef.current) {
                responseRef.current.scrollTop = responseRef.current.scrollHeight;
            }
        }
    }["AgentPage.useEffect"], [
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
            const recorder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$src$2f$lib$2f$voice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startRecording"])(async (audioBlob)=>{
                try {
                    console.log('[AgentPage] recorded audio blob, size:', audioBlob.size);
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$src$2f$lib$2f$voice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendAudioToAgent"])(dataChannelRef.current, audioBlob);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: '#f5f5f5',
            fontFamily: "'Nunito Sans', sans-serif",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: '420px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: responseRef,
                    style: {
                        maxHeight: 320,
                        overflowY: 'auto',
                        padding: '1rem',
                        borderBottom: '1px solid #eee'
                    },
                    children: agentResponses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: '#666'
                        },
                        children: isConnected ? 'Connected! Click "Talk" to start a conversation.' : 'Connecting to OpenAI...'
                    }, void 0, false, {
                        fileName: "[project]/raisin/src/app/agent/page.tsx",
                        lineNumber: 223,
                        columnNumber: 13
                    }, this) : agentResponses.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'center'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(AgentPage, "NzljXrulVzgNy1aJylj5CL9iQWI=");
_c = AgentPage;
var _c;
__turbopack_context__.k.register(_c, "AgentPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/raisin/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/raisin/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/raisin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/raisin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$raisin$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/raisin/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/raisin/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=raisin_7c0b8390._.js.map