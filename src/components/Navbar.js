'use client';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="logo">JobLink</div>
      
      <div className="nav-actions">
        {/* Language Switcher Placeholder */}
        <div id="google_translate_element"></div>

        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      
      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-bottom: 1px solid #ccc;
        }
        .navbar.dark {
          background: #1a1a1a;
          color: white;
          border-bottom: 1px solid #333;
        }
        .theme-toggle {
          padding: 5px 10px;
          border-radius: 20px;
          cursor: pointer;
          border: 1px solid currentColor;
          background: transparent;
          color: inherit;
        }
      `}</style>
    </nav>
  );
}

