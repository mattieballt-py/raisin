export class RealtimeAgent {
  name: string;
  instructions: string;
  ephemeralToken: string;

  constructor({ name, instructions, ephemeralToken }: any) {
    this.name = name;
    this.instructions = instructions;
    this.ephemeralToken = ephemeralToken;
  }
}

export class RealtimeSession {
  agent: RealtimeAgent;
  constructor(agent: RealtimeAgent) {
    this.agent = agent;
  }
  close() {
    console.log("Session closed");
  }
}

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

export function sendAudioToAgent(session: RealtimeSession, audio: Blob) {
  console.log("Sending audio to agent...", session, audio);
}
