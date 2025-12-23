// src/components/Navbar.js
import Link from 'next/link';

// Notice we removed 'default'. Now it is a specific named export.
export function Navbar() {
  return (
    <nav style={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      background: 'white', 
      borderBottom: '1px solid #ddd',
      position: 'sticky',
      top: 0
    }}>
      
      {/* Logo Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: '#4285F4', 
          borderRadius: '5px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          fontWeight: 'bold' 
        }}>J</div>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>JobLink</span>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button style={{ background: 'none', border: '1px solid #ccc', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>
          EN / HI
        </button>
        <Link href="/login">
          <button style={{ 
            background: '#4285F4', 
            color: 'white', 
            border: 'none', 
            padding: '8px 20px', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}>
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}