import Image from 'next/image';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f5f5f5',
      paddingTop: '40px'
    }}>
      {/* Square Image at the Top */}
      <div style={{
      width: 300,
      height: 300,
      position: 'relative',
      marginBottom: '24px'
      }}>
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
        boxSizing: 'border-box'
      }}
      />

      {/* White Box with Instructions */}
      <div style={{
      width: 340,
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: '32px 24px',
      textAlign: 'center'
      }}>
      <span style={{
        color: '#111',
        fontWeight: 600,
        fontSize: '20px'
      }}>
        hi, here are your instructions...
      </span>
      </div>
    </div>
)}