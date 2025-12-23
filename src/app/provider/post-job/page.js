// src/app/provider/post-job/page.js
'use client';
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';
import { useState } from 'react';

export default function PostJobPage() {
  const [desc, setDesc] = useState('');

  const handleGemini = () => {
    setDesc("Looking for a reliable worker for [Task Name]. Must be punctual and hard-working. Payment will be made daily. (Auto-generated)");
  };

  return (
    <div style={{ paddingBottom: '80px', backgroundColor: 'white', minHeight: '100vh' }}>
      
      <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
        <h2 style={{ margin: 0 }}>Post a New Job</h2>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Job Title</label>
          <input type="text" placeholder="e.g. Driver Needed" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
        </div>

        {/* Location & Pay (Row) */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Location</label>
            <input type="text" placeholder="Area Name" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Pay</label>
            <input type="text" placeholder="₹ Amount" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
        </div>

        {/* Description with Gemini */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Description</label>
            <button onClick={handleGemini} style={{ background: 'linear-gradient(45deg, #4285F4, #9b59b6)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', cursor: 'pointer' }}>
              ✨ Auto-Write
            </button>
          </div>
          <textarea 
            rows="6" 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
            placeholder="Explain the work..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button style={{ width: '100%', padding: '15px', background: '#34A853', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Post Job Now
        </button>

      </div>

      <ProviderBottomNav />
    </div>
  );
}