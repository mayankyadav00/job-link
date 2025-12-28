'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(''); // For debugging feedback
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    pay_rate: '',
    job_type: 'Daily Wage',
    location: 'Patna' 
  });

  // --- SAFE GEOCODING (With Timeout) ---
  const getCoordinates = async (address) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      console.warn("No Google Maps API Key found. Skipping geocoding.");
      return null;
    }

    try {
      console.log("Fetching coordinates for:", address);
      
      // Create a timeout so the app doesn't freeze if Google is slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      const data = await response.json();
      console.log("Google API Response:", data);

      if (data.status === 'OK' && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error("Geocoding Status:", data.status);
      }
    } catch (error) {
      console.error("Geocoding Failed (Network/Timeout):", error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('Checking User...');
    
    try {
      // 1. Check User
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert("You are not logged in!");
        router.push('/login');
        return;
      }

      // 2. Get Coords (Don't let this block the whole process)
      setStatusMsg('Getting Location...');
      let lat = null;
      let lng = null;
      const coords = await getCoordinates(form.location);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      }

      // 3. Save to DB
      setStatusMsg('Saving to Database...');
      console.log("Attempting INSERT with:", {
        provider_id: user.id,
        title: form.title,
        ...form
      });

      const { data, error: dbError } = await supabase.from('jobs').insert({
        provider_id: user.id,
        title: form.title,
        description: form.description,
        pay_rate: `₹${form.pay_rate}`, 
        job_type: form.job_type,
        location_name: form.location,
        latitude: lat,
        longitude: lng,
        status: 'open'
      }).select(); // .select() returns the inserted data so we can check it

      if (dbError) {
        console.error("Database Insert Error:", dbError);
        throw dbError;
      }

      console.log("Success! Data:", data);
      alert("Job Posted Successfully!");
      router.push('/provider/dashboard');

    } catch (error) {
      alert("Failed: " + error.message);
      setStatusMsg('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#333' }}>Post a New Job</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* TITLE */}
        <div>
          <label style={labelStyle}>Job Title</label>
          <input 
            type="text" 
            placeholder="e.g. Need Plumber Urgent" 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            style={inputStyle}
            required 
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea 
            placeholder="Describe the work..." 
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            style={{ ...inputStyle, minHeight: '100px' }}
            required 
          />
        </div>

        {/* PAY RATE */}
        <div>
          <label style={labelStyle}>Pay Rate</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '15px', top: '13px', color: '#666', fontSize: '1.1rem' }}>₹</span>
            <input 
              type="number" 
              placeholder="500" 
              value={form.pay_rate}
              onChange={e => setForm({...form, pay_rate: e.target.value})}
              style={{ ...inputStyle, paddingLeft: '35px' }} 
              required 
            />
          </div>
        </div>

        {/* DETAILS ROW */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Type</label>
            <select 
              value={form.job_type}
              onChange={e => setForm({...form, job_type: e.target.value})}
              style={inputStyle}
            >
              <option>Daily Wage</option>
              <option>Contract</option>
              <option>Full-time</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Location</label>
            <input 
              type="text" 
              placeholder="e.g. Boring Road, Patna"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
        </div>

        {statusMsg && <p style={{color: '#666', fontSize: '0.9rem', textAlign: 'center'}}>{statusMsg}</p>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: '10px', padding: '15px', background: '#333', color: 'white', 
            border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Processing...' : 'Post Job Now'}
        </button>

      </form>
      <ProviderBottomNav />
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' };
