// src/hooks/useLiveKit.ts
import { useEffect, useState } from "react";
import { Room } from "livekit-client";

export function useLiveKit(roomName: string, identity: string) {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const connect = async () => {
      // Fetch token from backend
      const res = await fetch(
        `http://localhost:8000/get-token?identity=${identity}&room=${roomName}`
      );
      const data = await res.json();
      const token = data.token;

      // Create and connect to LiveKit room
      const newRoom = new Room();
      await newRoom.connect("wss://your-livekit-server-url", token);
      setRoom(newRoom);
    };

    connect();

    return () => {
      room?.disconnect();
    };
  }, [roomName, identity]);

  return { room };
}
