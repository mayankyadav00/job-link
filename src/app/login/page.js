// src/app/login/page.js
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="login-container">
      
      <div className="login-box">
        <h2 style={{ marginBottom: '20px' }}>Welcome Back</h2>
        
        {/* Simple HTML Form */}
        <form>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="input-field" 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Enter password" 
            className="input-field" 
            required 
          />
          
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div style={{ margin: '15px 0', color: '#888' }}>OR</div>

        {/* The Google Sign-In Button (Hackathon Requirement) */}
        <button className="google-btn">
          {/* This is a simple Google 'G' icon made with text/css for now */}
          <span style={{ fontWeight: 'bold', color: '#4285F4' }}>G</span> 
          Sign in with Google
        </button>

        {/* Link back to home */}
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}