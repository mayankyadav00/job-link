'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function OnboardingForm({ user, role, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    business_name: '', // Only for Provider
    skills: '',        // Only for Seeker
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updates = {
      id: user.id,
      email: user.email,
      full_name: formData.full_name,
      phone: formData.phone,
      address: formData.address,
      updated_at: new Date(),
    };

    if (role === 'provider') {
      updates.business_name = formData.business_name;
    } else {
      updates.skills = formData.skills;
    }

    // Upsert = Update if exists, Insert if new
    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert('Error saving profile: ' + error.message);
    } else {
      onComplete(); // Tell the Dashboard "We are done!"
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px' }}>
        <h2 style={{ marginTop: 0 }}>Finish Setup 🚀</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Please complete your <b>{role === 'provider' ? 'Business' : 'Worker'}</b> profile.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input 
            placeholder="Full Name" 
            value={formData.full_name}
            onChange={e => setFormData({...formData, full_name: e.target.value})}
            style={inputStyle} required 
          />
          
          <input 
            placeholder="Phone Number" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            style={inputStyle} required 
          />
          
          <input 
            placeholder="Address / Location" 
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            style={inputStyle} required 
          />

          {role === 'provider' ? (
            <input 
              placeholder="Business Name (e.g. Gupta Construction)" 
              value={formData.business_name}
              onChange={e => setFormData({...formData, business_name: e.target.value})}
              style={inputStyle} required 
            />
          ) : (
            <input 
              placeholder="Skills (e.g. Plumbing, Driving)" 
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
              style={inputStyle} required 
            />
          )}

          <button type="submit" disabled={loading} style={{
            padding: '15px', background: '#333', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold'
          }}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' };
