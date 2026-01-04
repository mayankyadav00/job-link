'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { User, MapPin, Phone, Briefcase, LogOut, Save, ChevronDown, List } from 'lucide-react';
import { BottomNav } from '../../../components/BottomNav';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SeekerProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appCount, setAppCount] = useState(0); // Store count here
  
  // Toggles for the sections
  const [showEdit, setShowEdit] = useState(true); 

  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    skills: '',
    email: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    // 1. Fetch Profile Info
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) setProfile(data);

    // 2. Fetch Application Count
    // count: 'exact' tells Supabase to just give us the number, not the data
    const { count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true }) 
      .eq('seeker_id', user.id);
    
    setAppCount(count || 0);
    setLoading(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
      skills: profile.skills,
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
        <div style={{ width: '80px', height: '80px', background: '#4285F4', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <User size={40} />
        </div>
        <h2 style={{ margin: 0 }}>{profile.full_name || 'My Profile'}</h2>
        <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>{profile.email}</p>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* --- OPTION 1: EDIT PROFILE --- */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {/* Title Bar (Click to toggle) */}
          <div 
            onClick={() => setShowEdit(!showEdit)}
            style={{ padding: '15px 20px', background: '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#334155' }}>
                <User size={18} /> Edit Profile
             </div>
             <ChevronDown size={18} style={{ transform: showEdit ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
          </div>

          {/* Form Content */}
          {showEdit && (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <input value={profile.full_name || ''} onChange={(e) => setProfile({...profile, full_name: e.target.value})} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Skills</label>
                <input value={profile.skills || ''} onChange={(e) => setProfile({...profile, skills: e.target.value})} placeholder="e.g. Driver, Plumber" style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Phone</label>
                <input value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Address</label>
                <input value={profile.address || ''} onChange={(e) => setProfile({...profile, address: e.target.value})} style={inputStyle} />
              </div>

              <button 
                onClick={handleUpdate}
                disabled={saving}
                style={{ padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '5px' }}
              >
                {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          )}
        </div>

        {/* --- OPTION 2: APPLICATIONS APPLIED --- */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
           <div style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Briefcase size={24} />
              </div>
              <div style={{ flex: 1 }}>
                 <h4 style={{ margin: 0, fontSize: '1rem', color: '#334155' }}>Jobs Applied</h4>
                 <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Check status in Dashboard</p>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                 {appCount}
              </div>
           </div>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          style={{ padding: '15px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <LogOut size={18} /> Logout
        </button>

      </div>

      <BottomNav />
    </div>
  );
}

const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.9rem', color: '#64748b', fontWeight: 'bold' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem' };
