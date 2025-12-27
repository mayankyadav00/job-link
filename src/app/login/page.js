// src/app/login/page.js
'use client';
import Link from 'next/link';
import { supabase } from '../../lib/supabase'; // Import Supabase

export default function LoginPage() {

  const handleGoogleLogin = async () => {
    try {
      // Supabase handles the Google Popup for us
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${job-link-black.vercel.app.location.origin}/seeker/dashboard`, // Where to go after login
        },
      });

      if (error) throw error;
      
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ marginBottom: '20px' }}>Welcome Back</h2>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" className="input-field" />
          <input type="password" placeholder="Enter password" className="input-field" />
          <button className="login-btn">Login</button>
        </form>

        <div style={{ margin: '15px 0', color: '#888' }}>OR</div>

        {/* GOOGLE BUTTON */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          <span style={{ fontWeight: 'bold', color: '#4285F4' }}>G</span> 
          Sign in with Google
        </button>

        <Link href="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

