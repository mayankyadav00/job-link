// src/components/BottomNav.js
import Link from 'next/link';

export function BottomNav() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'white',
      borderTop: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-around', // Spreads items evenly
      padding: '10px 0',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    }}>
      
      {/* 1. HOME TAB */}
      <Link href="/seeker/dashboard" style={{ textDecoration: 'none', color: '#333', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>🏠</div>
        <span style={{ fontSize: '0.8rem' }}>Home</span>
      </Link>

      {/* 2. SEARCH TAB */}
      <Link href="/seeker/search" style={{ textDecoration: 'none', color: '#333', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>🔍</div>
        <span style={{ fontSize: '0.8rem' }}>Search</span>
      </Link>

      {/* 3. PROFILE TAB */}
      <Link href="/seeker/profile" style={{ textDecoration: 'none', color: '#333', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>👤</div>
        <span style={{ fontSize: '0.8rem' }}>Profile</span>
      </Link>

    </div>
  );
}