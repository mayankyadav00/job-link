'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export default function SystemCheck() {
  const [status, setStatus] = useState({
    envVars: 'Checking...',
    supabaseConnection: 'Checking...',
    googleMapsKey: 'Checking...',
  });

  useEffect(() => {
    checkSystem();
  }, []);

  const checkSystem = async () => {
    const newStatus = {};

    // 1. CHECK ENVIRONMENT VARIABLES
    const vars = {
      URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      MAPS: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      AI: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    };

    const missing = Object.keys(vars).filter(key => !vars[key]);
    if (missing.length > 0) {
      newStatus.envVars = `❌ Missing: ${missing.join(', ')}`;
    } else {
      newStatus.envVars = '✅ All Variables Loaded';
    }

    // 2. CHECK GOOGLE MAPS KEY FORMAT
    if (vars.MAPS && vars.MAPS.startsWith('AIza')) {
      newStatus.googleMapsKey = '✅ Valid Format (Starts with AIza)';
    } else {
      newStatus.googleMapsKey = '❌ Invalid Format (Should start with AIza)';
    }

    // 3. CHECK SUPABASE CONNECTION
    if (!supabase) {
      newStatus.supabaseConnection = '❌ Client init failed (Missing URL/Key)';
    } else {
      try {
        const { data, error } = await supabase.from('jobs').select('count', { count: 'exact', head: true });
        if (error) throw error;
        newStatus.supabaseConnection = '✅ Connected to Database';
      } catch (err) {
        newStatus.supabaseConnection = `❌ Connection Failed: ${err.message}`;
      }
    }

    setStatus(newStatus);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>System Diagnostic 🩺</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', background: '#f9f9f9' }}>
        <h3>1. Environment Variables</h3>
        <p style={{ fontWeight: 'bold', color: status.envVars.includes('✅') ? 'green' : 'red' }}>
          {status.envVars}
        </p>

        <h3>2. Database Connection</h3>
        <p style={{ fontWeight: 'bold', color: status.supabaseConnection.includes('✅') ? 'green' : 'red' }}>
          {status.supabaseConnection}
        </p>

        <h3>3. Google Maps Key</h3>
        <p style={{ fontWeight: 'bold', color: status.googleMapsKey.includes('✅') ? 'green' : 'red' }}>
          {status.googleMapsKey}
        </p>
      </div>

      <p style={{ marginTop: '20px', color: '#666' }}>
        If Environment Variables are missing:<br/>
        1. Localhost: Check <code>.env.local</code> file.<br/>
        2. Vercel: Check Settings -> Environment Variables.
          
      </p>
    </div>
  );
}
