'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';
import { getCoordinatesFromAddress } from '../../actions'; // Import Server Action

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  const [form, setForm] = useState({
    title: '', description: '', pay_rate: '', job_type: 'Daily Wage', location: 'Patna'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('Checking User...');
    
    try {
      // 1. Check User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // 2. GET COORDS (Via Server Action)
      setStatusMsg('Getting Location...');
      let lat = null, lng = null;
      
      const coords = await getCoordinatesFromAddress(form.location);
      
      if (coords.error) {
        console.warn("Geocoding failed:", coords.error);
        // We continue anyway, just without coordinates
      } else {
        lat = coords.lat;
        lng = coords.lng;
        console.log("📍 Got Coords:", lat, lng);
      }

      // 3. Save to DB
      setStatusMsg('Saving...');
      const { error } = await supabase.from('jobs').insert({
        provider_id: user.id,
        title: form.title,
        description: form.description,
        pay_rate: `₹${form.pay_rate}`,
        job_type: form.job_type,
        location_name: form.location,
        latitude: lat,
        longitude: lng,
        status: 'open'
      });

      if (error) throw error;
      
      alert("Job Posted!");
      router.push('/provider/dashboard');

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (Keep your JSX form exactly the same as before) ...
    <div style={{ padding: '20px', paddingBottom: '80px', fontFamily: 'Arial, sans-serif' }}>
       <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Post a New Job</h1>
       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
         
         <div>
           <label style={{display:'block', fontWeight:'bold'}}>Title</label>
           <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} />
         </div>

         <div>
           <label style={{display:'block', fontWeight:'bold'}}>Description</label>
           <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...inputStyle, minHeight:'100px'}} />
         </div>

         <div>
           <label style={{display:'block', fontWeight:'bold'}}>Pay Rate (₹)</label>
           <input required type="number" value={form.pay_rate} onChange={e => setForm({...form, pay_rate: e.target.value})} style={inputStyle} />
         </div>

         <div style={{display:'flex', gap:'10px'}}>
            <div style={{flex:1}}>
              <label style={{display:'block', fontWeight:'bold'}}>Type</label>
              <select value={form.job_type} onChange={e => setForm({...form, job_type: e.target.value})} style={inputStyle}>
                <option>Daily Wage</option><option>Contract</option><option>Full-time</option>
              </select>
            </div>
            <div style={{flex:1}}>
              <label style={{display:'block', fontWeight:'bold'}}>Location</label>
              <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={inputStyle} />
            </div>
         </div>

         <p style={{textAlign:'center', color:'#666'}}>{statusMsg}</p>
         <button disabled={loading} style={{padding:'15px', background:'#333', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>
           {loading ? 'Processing...' : 'Post Job'}
         </button>
       </form>
       <ProviderBottomNav />
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', marginTop:'5px' };
