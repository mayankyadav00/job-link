// src/app/seeker/profile/page.js
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';

export default function ProfileTab() {
  return (
    <div style={{ paddingBottom: '80px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* 1. Header with Avatar */}
      <div style={{ background: 'white', padding: '30px 20px', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ 
          width: '80px', height: '80px', background: '#ccc', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' 
        }}>
          👤
        </div>
        <h2 style={{ margin: 0 }}>Mayank Yadav</h2>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Job Seeker</p>
      </div>

      {/* 2. Menu Options */}
      <div style={{ background: 'white' }}>
       {['Account Details', 'Login Info', 'Resume / CV', 'Help & Support'].map((item) => (
          <div key={item} style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <span>{item}</span>
            <span style={{ color: '#ccc' }}>›</span>
          </div>
        ))}
<span>Account Details</span>
<span>Login Info</span>
        {/* Log Out */}
        <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '20px', color: 'red', fontWeight: 'bold' }}>
            Log Out
            </div>
        </Link>
      </div>

      <BottomNav />
    </div>
  );

}

