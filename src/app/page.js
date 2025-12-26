"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  // Sync with localStorage on load
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true);
    if (localStorage.getItem('language') === 'hindi') setIsHindi(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const newLang = !isHindi;
    setIsHindi(newLang);
    localStorage.setItem('language', newLang ? 'hindi' : 'english');
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: theme.bg, color: theme.textMain, transition: 'all 0.3s ease' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: theme.navBg, boxShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#4285F4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>J</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>JobLink</span>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: isDarkMode ? '#444' : '#eee', border: 'none', padding: '8px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '1.2rem' }}>
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          <button onClick={toggleLanguage} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', border: `1px solid ${theme.border}`, borderRadius: '20px', background: isHindi ? '#4285F4' : theme.navBg, color: isHindi ? 'white' : theme.textMain, cursor: 'pointer', fontWeight: 'bold' }}>
            <span>🌐</span>
            <span>{isHindi ? 'HI / EN' : 'EN / HI'}</span>
          </button>

          <Link href="/login">
            <button style={{ background: isDarkMode ? '#f4f4f4' : '#333', color: isDarkMode ? '#333' : 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isHindi ? 'लॉगिन' : 'Login'}
            </button>
          </Link>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            {isHindi ? 'काम खोजें।' : 'Find Work.'} <span style={{ color: '#34A853' }}>{isHindi ? 'स्थानीय नियुक्त करें।' : 'Hire Local.'}</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.1rem' }}>{isHindi ? 'स्थानीय श्रमिकों और दैनिक जरूरतों के बीच का सेतु।' : 'The bridge between local workers and daily needs.'}</p>
        </div>

        <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '800px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', background: theme.cardBg, padding: '40px', borderRadius: '20px', textAlign: 'center', borderTop: '5px solid #4285F4' }}>
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <h2>{isHindi ? 'मुझे काम चाहिए' : 'I Need Work'}</h2>
            <Link href="/seeker/dashboard">
              <button style={{ width: '100%', padding: '15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
                {isHindi ? 'नौकरियां खोजें' : 'Find Jobs'}
              </button>
            </Link>
          </div>
          {/* Repeat for Provider Card if needed */}
        </div>
      </main>
    </div>
  );
}
