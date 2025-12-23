// src/app/seeker/search/page.js
import { BottomNav } from '../../../components/BottomNav';

export default function SearchTab() {
  return (
    <div style={{ padding: '20px', paddingBottom: '80px' }}>
      
      <h2 style={{ marginBottom: '20px' }}>Search Jobs</h2>

      {/* 1. Search Bar */}
      <input 
        type="text" 
        placeholder="Search keywords (e.g. Driver)..." 
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          fontSize: '1rem',
          marginBottom: '20px'
        }}
      />

      {/* 2. Search History (Mock) */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Recent Searches</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['Plumber', 'Data Entry', 'Patna'].map(tag => (
            <span key={tag} style={{ background: '#f5f5f5', padding: '5px 10px', borderRadius: '5px', color: '#555' }}>
              🕒 {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3. MAP VIEW BUTTON (Big Card) */}
      <div style={{
        height: '150px',
        background: '#e8f0fe',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #4285F4',
        cursor: 'pointer'
      }}>
        <span style={{ fontSize: '2rem' }}>🗺️</span>
        <h3 style={{ color: '#4285F4', margin: '10px 0 0 0' }}>Tap to view Jobs on Map</h3>
      </div>

      <BottomNav />
    </div>
  );
}