// src/app/provider/profile/page.js
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';
import Link from 'next/link';

export default function ProviderProfile() {
  return (
    <div style={{ paddingBottom: '80px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ background: 'white', padding: '40px 20px', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: '80px', height: '80px', background: '#34A853', borderRadius: '50%', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>
          🏢
        </div>
        <h2 style={{ margin: 0 }}>Sharma Traders</h2>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Job Provider</p>
      </div>

      {/* Menu */}
      <div style={{ background: 'white' }}>
        {['Company Details', 'Payment Methods', 'Verification Status', 'Support'].map((item) => (
          <div key={item} style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <span>{item}</span>
            <span style={{ color: '#ccc' }}>›</span>
          </div>
        ))}
        
        <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '20px', color: 'red', fontWeight: 'bold' }}>
            Log Out
            </div>
        </Link>
      </div>

      <ProviderBottomNav />
    </div>
  );
}