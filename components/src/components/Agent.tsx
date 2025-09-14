"use client"; // needed if using Next.js App Router

import { useEffect, useRef } from "react";

export default function Agent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;

      const iframe = document.createElement("iframe");
      iframe.src = "https://bey.chat/68a6ac04-f61e-4a53-be42-b83fc75f8677";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.allow = "camera; microphone; fullscreen";
      iframe.allowFullscreen = true;

      container.appendChild(iframe);

      const handleResize = () => {
        // Optional: any resize logic if needed
        const containerWidth = container.clientWidth;
      };

      window.addEventListener("resize", handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener("resize", handleResize);
        container.removeChild(iframe);
      };
    }
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "600px" }} />;
}
