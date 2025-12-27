'use client';
import { useState, useEffect, Suspense } from 'react'; // Suspense needed for reading URL params safely
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase (Directly here to avoid import errors)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  
  // 1. Detect User Intent (Default to 'seeker' if they just went to /login directly)
  const userType = searchParams.get('type') || 'seeker'; 

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const origin = window.location.origin;

      // 2. Decide where to go based on intent
      // If they wanted to post a job, send to provider dashboard. Otherwise seeker.
      const targetPage = userType === 'provider' ? '/provider/dashboard' : '/seeker/dashboard';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}${targetPage}`, // The Magic Redirect
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
        
        <h2 style={{ marginBottom: '10px', color: '#333' }}>
          {userType === 'provider' ? 'Login to Hire' : 'Login to Find Work'}
        </h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          {userType === 'provider' ? 'Post jobs and find local talent.' : 'Sign in to access daily shifts.'}
        </p>
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '30px', background: 'white', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
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

// Wrap in Suspense to prevent Next.js Build Errors
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
