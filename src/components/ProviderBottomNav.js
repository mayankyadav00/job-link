// src/components/ProviderBottomNav.js
import Link from 'next/link';

export function ProviderBottomNav() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'white',
      borderTop: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center', // Centers items vertically
      padding: '10px 0',
      zIndex: 1000
    }}>
      
      {/* 1. HOME (My Jobs) */}
      <Link href="/provider/dashboard" style={{ textDecoration: 'none', color: '#333', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>🏠</div>
        <span style={{ fontSize: '0.8rem' }}>My Jobs</span>
      </Link>

      {/* 2. POST JOB (Central Highlighted Button) */}
      <Link href="/provider/post-job">
        <div style={{
          width: '50px',
          height: '50px',
          backgroundColor: '#34A853', // Google Green
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          marginTop: '-25px', // Moves it slightly up
          boxShadow: '0 4px 10px rgba(52, 168, 83, 0.4)'
        }}>
          +
        </div>
      </Link>

      {/* 3. PROFILE */}
      <Link href="/provider/profile" style={{ textDecoration: 'none', color: '#333', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>👤</div>
        <span style={{ fontSize: '0.8rem' }}>Profile</span>
      </Link>

    </div>
  );

}

