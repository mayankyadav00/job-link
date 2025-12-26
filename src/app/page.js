"use client"; // Required for interactivity in Next.js

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  // 1. State to track theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 2. Toggle function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 3. Define Theme Styles
  const theme = {
    bg: isDarkMode ? '#1a1a1a' : '#f4f4f4',
    navBg: isDarkMode ? '#2d2d2d' : 'white',
    cardBg: isDarkMode ? '#333333' : 'white',
    textMain: isDarkMode ? '#ffffff' : '#333333',
    textSub: isDarkMode ? '#bbbbbb' : '#666666',
    border: isDarkMode ? '#444444' : '#eeeeee'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: theme.bg, // Dynamic Background
      color: theme.textMain,     // Dynamic Text
      transition: 'all 0.3s ease' // Smooth transition
    }}>
      
      {/* --- HEADER --- */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px', 
        background: theme.navBg, 
        boxShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
        transition: 'background 0.3s ease'
      }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#4285F4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>J</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.textMain }}>JobLink</span>
        </div>

        {/* Right Side Tools */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          
          {/* THE WORKING TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            style={{
              background: isDarkMode ? '#444' : '#eee',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            padding: '8px 12px', 
            border: `1px solid ${theme.border}`, 
            borderRadius: '20px', 
            background: theme.navBg, 
            color: theme.textMain,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}>
            <span>🌐</span>
            <span>EN / HI</span>
          </button>

          <Link href="/login">
            <button style={{ 
              background: isDarkMode ? '#f4f4f4' : '#333', 
              color: isDarkMode ? '#333' : 'white', 
              border: 'none', 
              padding: '8px 20px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: theme.textMain }}>
            Find Work. <span style={{ color: '#34A853' }}>Hire Local.</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.1rem' }}>The bridge between local workers and daily needs.</p>
        </div>

        <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '800px', flexWrap: 'wrap' }}>
          
          {/* SEEKER CARD */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            background: theme.cardBg, 
            padding: '40px', 
            borderRadius: '20px', 
            textAlign: 'center', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
            borderTop: '5px solid #4285F4',
            transition: 'background 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
            <h2 style={{ marginBottom: '10px', color: theme.textMain }}>I Need Work</h2>
            <p style={{ color: theme.textSub, marginBottom: '20px' }}>Find daily shifts, part-time tasks, or full-time jobs.</p>
            <Link href="/seeker/dashboard">
              <button style={{ width: '100%', padding: '15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Find Jobs
              </button>
            </Link>
          </div>

          {/* PROVIDER CARD */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            background: theme.cardBg, 
            padding: '40px', 
            borderRadius: '20px', 
            textAlign: 'center', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
            borderTop: '5px solid #34A853',
            transition: 'background 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📢</div>
            <h2 style={{ marginBottom: '10px', color: theme.textMain }}>I Need Workers</h2>
            <p style={{ color: theme.textSub, marginBottom: '20px' }}>Hire help for your shop, home, or office instantly.</p>
            <Link href="/provider/dashboard">
              <button style={{ width: '100%', padding: '15px', background: '#34A853', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Post a Job
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', color: theme.textSub, fontSize: '0.8rem' }}>
        Powered by Falcons
      </footer>
    </div>
  );
}
