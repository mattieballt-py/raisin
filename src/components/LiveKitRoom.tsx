import React from "react";
import { useLiveKit } from "../hooks/useLiveKit";

export default function LiveKitRoom() {
  const { room } = useLiveKit("test-room", "user1");

  return (
    <div>
      <h1>LiveKit Room</h1>
      {room ? <p>Connected!</p> : <p>Connecting...</p>}
    </div>
  );
}
