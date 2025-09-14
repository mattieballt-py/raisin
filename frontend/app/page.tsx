'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffffff',
        fontFamily: "'Nunito Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0',
        padding: '0',
      }}
    >
      <Image
        src="/Assets/raisinlogo.png"
        alt="Raisin Logo"
        width={72}
        height={72}
        style={{ marginBottom: 24 }}
      />
      <h1
        style={{
          fontFamily: "'Merriweather', serif",
          fontSize: 32,
          marginBottom: 16,
          color: '#222',
        }}
      >
        Welcome to Raisin
      </h1>
      <p
        style={{
          maxWidth: 400,
          textAlign: 'center',
          fontSize: 18,
          marginBottom: 24,
          color: '#444',
        }}
      >
        Your personal helper for clear, step-by-step guidance online.
      </p>
      <Link
        href="/agent"
        style={{
          background: '#222',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Begin
      </Link>
    </div>
  );
}
