'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { User, MapPin, Phone, Building2, LogOut, Save } from 'lucide-react'; // Building Icon
import { ProviderBottomNav } from '../../../components/ProviderBottomNav'; // Note the Provider Nav

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProviderProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    business_name: '',
    phone: '',
    address: '',
    email: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) setProfile(data);
    setLoading(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      business_name: profile.business_name,
      phone: profile.phone,
      address: profile.address,
      updated_at: new Date()
    }).eq('id', user.id);

    if (error) alert("Error saving");
    else alert("Profile Updated! ✅");
    
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Profile...</div>;

  return (
    <div style={{ paddingBottom: '90px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header */}
      <div style={{ background: 'white', padding: '30px 20px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#0284c7', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Building2 size={40} />
        </div>
        <h2 style={{ margin: 0 }}>{profile.business_name || 'My Business'}</h2>
        <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Provider Account</p>
      </div>

      {/* Form */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}><Building2 size={16} /> Business Name</label>
          <input 
            value={profile.business_name || ''} 
            onChange={(e) => setProfile({...profile, business_name: e.target.value})}
            style={inputStyle} 
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}><User size={16} /> Contact Person Name</label>
          <input 
            value={profile.full_name || ''} 
            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
            style={inputStyle} 
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}><Phone size={16} /> Phone</label>
          <input 
            value={profile.phone || ''} 
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            style={inputStyle} 
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}><MapPin size={16} /> Address</label>
          <input 
            value={profile.address || ''} 
            onChange={(e) => setProfile({...profile, address: e.target.value})}
            style={inputStyle} 
          />
        </div>

        <button 
          onClick={handleUpdate}
          disabled={saving}
          style={{ padding: '15px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}
        >
          {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>

        <button 
          onClick={handleLogout}
          style={{ padding: '15px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <LogOut size={18} /> Logout
        </button>

      </div>

      <ProviderBottomNav />
    </div>
  );
}

const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b', fontWeight: 'bold' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem' };
