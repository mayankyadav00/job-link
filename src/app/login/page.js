'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Toggle State: True = Sign Up, False = Login
  const [isSignUp, setIsSignUp] = useState(true);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Only for Signup
  const [phone, setPhone] = useState('');       // Only for Signup

  // 1. Detect User Intent (Default to 'seeker' if unknown)
  const userType = searchParams.get('type') || 'seeker'; 

  // Helper: Where to go after success
  const getRedirectUrl = () => {
    return userType === 'provider' ? '/provider/dashboard' : '/seeker/dashboard';
  };

  // --- HANDLER: GOOGLE AUTH ---
  const handleGoogle = async () => {
    try {
      setLoading(true);
      const origin = window.location.origin;
      const target = getRedirectUrl();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}${target}`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (error) {
      alert("Google Error: " + error.message);
      setLoading(false);
    }
  };

  // --- HANDLER: EMAIL AUTH ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Save Name/Phone in metadata so we don't lose it
            data: { full_name: fullName, phone: phone, role: userType },
            emailRedirectTo: `${window.location.origin}${getRedirectUrl()}`,
          },
        });
        
        if (error) throw error;
        
        alert("Signup successful! Please check your email to verify your account.");
        setIsSignUp(false); // Switch to login view

      } else {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // If successful, manual redirect
        router.push(getRedirectUrl());
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        
        {/* Header Text Changes based on Action */}
        <h2 style={{ marginBottom: '5px', color: '#333' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.9rem' }}>
          {isSignUp 
            ? `Sign up to ${userType === 'provider' ? 'post jobs' : 'find work'}` 
            : 'Login to access your dashboard'}
        </p>

        {/* GOOGLE BUTTON (Available for Both) */}
        <button 
          onClick={handleGoogle} 
          disabled={loading}
          style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <span style={{ color: '#4285F4', fontSize: '1.2rem', fontWeight: 'bold' }}>G</span> 
          <span>Continue with Google</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#888' }}>
          <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>OR VIA EMAIL</span>
          <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
        </div>

        {/* EMAIL FORM */}
        <form onSubmit={handleEmailAuth} style={{ textAlign: 'left' }}>
          
          {/* Extra Fields ONLY for Sign Up */}
          {isSignUp && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#555', display: 'block', marginBottom: '5px' }}>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#555', display: 'block', marginBottom: '5px' }}>Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            </>
          )}

          {/* Standard Fields */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.9rem', color: '#555', display: 'block', marginBottom: '5px' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '0.9rem', color: '#555', display: 'block', marginBottom: '5px' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '8px', background: '#333', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login')}
          </button>
        </form>

        {/* Toggle Logic */}
        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
          {isSignUp ? "Already have an account?" : "New to JobLink?"} 
          <span 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={{ color: '#0070f3', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
          >
            {isSignUp ? "Login here" : "Sign up here"}
          </span>
        </p>

        <Link href="/" style={{ display: 'block', marginTop: '20px', color: '#888', textDecoration: 'none', fontSize: '0.8rem' }}>
          ← Back to Landing Page
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
