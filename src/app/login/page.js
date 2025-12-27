'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Ensure this path matches your folder structure

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // 1. Get the current website URL (works for localhost AND Vercel automatically)
      const currentURL = window.location.origin;

      // 2. Trigger the Google Login
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirects to /seeker/dashboard after login
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
        
        {/* GOOGLE BUTTON */}
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px', 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '30px', 
            background: 'white', 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {/* Simple "G" Icon */}
          <span style={{ color: '#4285F4', fontSize: '1.2rem', fontWeight: 'bold' }}>G</span> 
          <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <div style={{ margin: '20px 0', borderTop: '1px solid #eee' }}></div>

        <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Landing Page
        </Link>
      </div>
    </div>
  );
}


