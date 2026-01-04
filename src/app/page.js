
"use client"; 

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 1. ADD STATE FOR LANGUAGE
  const [isHindi, setIsHindi] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 2. TOGGLE LANGUAGE FUNCTION
  const toggleLanguage = () => {
    setIsHindi(!isHindi);
  };

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
      backgroundColor: theme.bg, 
      color: theme.textMain,     
      transition: 'all 0.3s ease' 
    }}>
      
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px', 
        background: theme.navBg, 
        boxShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
        transition: 'background 0.3s ease'
      }}>
        
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  {/* LOGO ADDED BELOW */}
  <div className="hover" style={{ 
    width: '32px', 
    height: '32px', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden' // Ensures logo stays inside the box
  }}>
    <img 
      src="/logo.png" 
      alt="JobLink Logo" 
      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
    />
  </div>
  <span className="hover" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.textMain }}>JobLink</span>
</div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          
          <button className="hover"
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

          {/* 3. UPDATED LANGUAGE BUTTON */}
          <button 
            className="hover" 
            onClick={toggleLanguage} // Call toggle function
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px', 
              padding: '8px 12px', 
              border: `1px solid ${theme.border}`, 
              borderRadius: '20px', 
              background: isHindi ? '#4285F4' : theme.navBg, // Changes color when active
              color: isHindi ? 'white' : theme.textMain,
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            <span>🌐</span>
            <span>{isHindi ? 'HI / EN' : 'EN / HI'}</span>
          </button>

          <Link className="hover" href="/login">
            <button style={{ 
              background: isDarkMode ? '#f4f4f4' : '#333', 
              color: isDarkMode ? '#333' : 'white', 
              border: 'none', 
              padding: '8px 20px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {isHindi ? 'लॉगिन' : 'Login'}
            </button>
          </Link>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
          {/* 4. TRANSLATED TITLES */}
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: theme.textMain }}>
            {isHindi ? 'काम खोजें।' : 'Find Work.'} <span style={{ color: '#34A853' }}>{isHindi ? 'स्थानीय नियुक्त करें।' : 'Hire Local.'}</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.1rem' }}>
            {isHindi ? 'स्थानीय श्रमिकों और दैनिक जरूरतों के बीच का सेतु।' : 'The bridge between local workers and daily needs.'}
          </p>
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
            <h2 style={{ marginBottom: '10px', color: theme.textMain }}>
                {isHindi ? 'मुझे काम चाहिए' : 'I Need Work'}
            </h2>
            <p style={{ color: theme.textSub, marginBottom: '20px' }}>
                {isHindi ? 'दैनिक शिफ्ट, पार्ट-टाइम काम या फुल-टाइम नौकरियां खोजें।' : 'Find daily shifts, part-time tasks, or full-time jobs.'}
            </p>
            <Link href="/login?type=seeker">
              <button className="hover" style={{ width: '100%', padding: '15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {isHindi ? 'नौकरियां खोजें' : 'Find Jobs'}
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
            <h2 style={{ marginBottom: '10px', color: theme.textMain }}>
                {isHindi ? 'मुझे वर्कर चाहिए' : 'I Need Workers'}
            </h2>
            <p style={{ color: theme.textSub, marginBottom: '20px' }}>
                {isHindi ? 'अपने दुकान, घर या ऑफिस के लिए तुरंत मदद लें।' : 'Hire help for your shop, home, or office instantly.'}
            </p>
            <Link href="/login?type=provider">
              <button className="hover" style={{ width: '100%', padding: '15px', background: '#34A853', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {isHindi ? 'काम पोस्ट करें' : 'Post a Job'}
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', color: theme.textSub, fontSize: '0.8rem' }}>
        {isHindi ? 'Falcons द्वारा संचालित' : 'Powered by Falcons'}
      </footer>
    </div>
  );
}
