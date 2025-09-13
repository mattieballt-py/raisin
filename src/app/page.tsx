import Image from 'next/image';
import Agent from '@/components/Agent';

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        fontFamily: "'Nunito Sans', sans-serif",
      }}
    >
      {/* Fixed Nav Bar with Background Blur */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 64,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src="/Assets/raisinlogo.png"
            alt="Raisin Logo"
            width={36}
            height={36}
            style={{ borderRadius: 8 }}
            priority
          />
          <span
            style={{
              fontFamily: "'Merriweather', serif",
              fontWeight: 700,
              fontSize: 24,
              color: '#222',
              letterSpacing: '0.02em',
            }}
          >
            Raisin
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 96, // space for nav
          paddingLeft: 16,
          paddingRight: 16,
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        {/* Embedded Beyond Presence Agent */}
        <div
          style={{
            width: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            marginBottom: 32,
            background: '#fff',
          }}
        >
          <Agent />
        </div>

        {/* White Box with Welcome */}
        <div
          style={{
            width: '100%',
            background: '#FFF8F0',
            padding: '24px 20px',
            textAlign: 'center',
            marginBottom: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}
        >
          <span
            style={{
              color: '#111',
              fontWeight: 600,
              fontSize: 20,
              fontFamily: "'Merriweather', serif",
              lineHeight: 1.4,
            }}
          >
            Welcome to your personal helper.<br />
            Talk to receive support on anything you need.<br />
            Or, if you would rather, write your problem below:
          </span>
        </div>

        {/* Text Field Below Agent */}
        <input
          type="text"
          placeholder="Type here..."
          style={{
            width: '100%',
            maxWidth: 340,
            padding: '14px 16px',
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ccc',
            marginBottom: 28,
            boxSizing: 'border-box',
            fontFamily: "'Nunito Sans', sans-serif",
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />

        {/* White Box with Instructions */}
        <div
          style={{
            width: '100%',
            background: '#FFF8F0',
            padding: '20px 18px',
            textAlign: 'center',
            marginBottom: 18,
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}
        >
          <span
            style={{
              color: '#111',
              fontWeight: 600,
              fontSize: 20,
              fontFamily: "'Merriweather', serif",
            }}
          >
            hi, here are your instructions...
          </span>
        </div>

        {/* Instructions */}
        <div
          style={{
            background: '#f9fafb',
            borderRadius: 10,
            padding: '16px 18px',
            width: '100%',
            fontSize: 15,
            color: '#222',
            marginTop: 8,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            fontFamily: "'Nunito Sans', sans-serif",
            lineHeight: 1.7,
          }}
        >
          <p style={{ margin: 0, marginBottom: 4 }}>Step 1: Open Gmail</p>
          <p style={{ margin: 0, marginBottom: 4 }}>Step 2: Compose a new message</p>
          <p style={{ margin: 0 }}>Step 3: Type recipient and click send</p>
        </div>
      </main>
    </div>
  );
}