"use client";

import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X, Filter, Sun, Moon } from 'lucide-react';

export default function HomeTab() {
  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Sync theme
    if (localStorage.getItem('theme') === 'dark') {
      setIsDarkMode(true);
    }

    // GOOGLE TRANSLATE SCRIPT
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = function () {
        if (!window.google || !window.google.translate) return;

        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      };
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    }
  };

  const theme = {
    bg: isDarkMode ? '#1a1a1a' : '#f4f4f4',
    navBg: isDarkMode ? '#2d2d2d' : 'white',
    cardBg: isDarkMode ? '#2a2a2a' : 'white',
    textMain: isDarkMode ? '#fff' : '#000',
    textSub: isDarkMode ? '#bbb' : '#555',
    border: isDarkMode ? '#444' : '#ddd',
    filterBtn: isDarkMode ? '#333' : '#eee',
  };

  // --- FILTER STATES ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    workMode: [],
    department: [],
    duration: [],
  });

  const jobs = [
    {
      id: 1,
      title: 'Urgent Plumber Needed',
      pay: '₹500/visit',
      workMode: 'Area around NIT Patna',
      department: 'Plumber',
      duration: 'Short time (hours)',
    },
    {
      id: 2,
      title: 'Home Electrician',
      pay: '₹800/day',
      workMode: 'Patna Junction',
      department: 'Electrician',
      duration: 'One day',
    },
    {
      id: 3,
      title: 'Full Time Cleaner',
      pay: '₹12k/mo',
      workMode: 'Work from home',
      department: 'Cleaner',
      duration: 'Long term',
    },
    {
      id: 4,
      title: 'Remote Support Staff',
      pay: '₹15k/mo',
      workMode: 'Remote Area',
      department: 'Electrician',
      duration: 'Long term',
    },
    {
      id: 5,
      title: 'Pipe Fitting Helper',
      pay: '₹300/hour',
      workMode: 'Area around NIT Patna',
      department: 'Plumber',
      duration: 'Short time (hours)',
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    return (
      (selectedFilters.workMode.length === 0 ||
        selectedFilters.workMode.includes(job.workMode)) &&
      (selectedFilters.department.length === 0 ||
        selectedFilters.department.includes(job.department)) &&
      (selectedFilters.duration.length === 0 ||
        selectedFilters.duration.includes(job.duration))
    );
  });

  return (
    <div
      style={{
        paddingBottom: '80px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: theme.bg,
        minHeight: '100vh',
        color: theme.textMain,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: theme.navBg,
          boxShadow: isDarkMode
            ? '0 2px 10px rgba(0,0,0,0.3)'
            : '0 2px 5px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: '#4285F4',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            J
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            JobLink
          </span>
        </div>

        <div
          id="google_translate_element"
          style={{ maxHeight: '36px', overflow: 'hidden' }}
        />

        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: `1px solid ${theme.border}`,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            color: theme.textMain,
          }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: '20px' }}>
        <p style={{ color: theme.textSub, fontSize: '0.9rem' }}>
          Found {filteredJobs.length} jobs based on your preferences.
        </p>

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '15px',
              background: theme.cardBg,
            }}
          >
            <h3 style={{ margin: '0 0 8px 0' }}>{job.title}</h3>
            <p style={{ color: theme.textSub }}>
              {job.department} • {job.workMode}
            </p>
          </div>
        ))}
      </div>

      <BottomNav />

      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate,
        .goog-te-gadget-icon {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
      `}</style>
    </div>
  );
}
