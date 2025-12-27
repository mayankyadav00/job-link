'use client';
import { useState } from 'react';
import Link from 'next/link';
// ✅ CHANGED: Import directly from the package, not your local file
import { createClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  // ✅ Initialize Supabase right here (Bypasses the "Module Not Found" error)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const currentURL = window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentURL}/seeker/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
    } catch (error) {
      alert("Login Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '10px', color: '#333' }}>Welcome to JobLink</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Sign in to find work or hire help.</p>
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '30px', background: 'white', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer' }}
        >
          <span style={{ color: '#4285F4', fontWeight: 'bold', marginRight: '8px' }}>G</span> 
          {loading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <Link href="/" style={{ display: 'block', marginTop: '20px', color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Landing Page
        </Link>
      </div>
    </div>
  );
}
