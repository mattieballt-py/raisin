import Image from 'next/image';
import Agent from '@/components/Agent';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
        paddingTop: '40px',
      }}
    >
      {/* Square Image at the Top */}
      <div
        style={{
          width: 300,
          height: 300,
          position: 'relative',
          marginBottom: '24px',
        }}
      >
        <Image
          src="/Assets/Screenshot 2025-09-10 at 15.30.15.png"
          alt="Screenshot"
          fill
          style={{ objectFit: 'cover', borderRadius: '12px' }}
        />
      </div>

      {/* Text Field Below Image */}
      <input
        type="text"
        placeholder="Type here..."
        style={{
          width: 300,
          padding: '12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '32px',
          boxSizing: 'border-box',
        }}
      />

      {/* White Box with Instructions */}
      <div
        style={{
          width: 340,
          background: '#FFF8F0',
          borderColor: '#A86448',
          borderWidth: '2px',
          borderRadius: '12px',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: '#111',
            fontWeight: 600,
            fontSize: '20px',
          }}
        >
          hi, here are your instructions...
        </span>
      </div>

      {/* Embedded Beyond Presence Agent */}
      <Agent />

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-3 w-full text-sm text-gray-800 mt-4">
        <p>Step 1: Open Gmail</p>
        <p>Step 2: Compose a new message</p>
        <p>Step 3: Type recipient and click send</p>
      </div>
    </div>
  );
}