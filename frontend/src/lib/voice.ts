export async function startRecording(callback: (audioBlob: Blob) => void) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/wav" });
    callback(blob);
  };
  mediaRecorder.start();
  return mediaRecorder;
}

export async function sendAudioToAgent(dataChannel: RTCDataChannel, audio: Blob) {
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
    return { success: true };
  } catch (error) {
    console.error("Error sending audio to agent:", error);
    return { success: false, error: error.message };
  }
}
