"use client";

import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X, Filter, Sun, Moon } from 'lucide-react'; 

export default function HomeTab() {
  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true);

    const addGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) return;

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
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
    { id: 1, title: "Urgent Plumber Needed", pay: "₹500/visit", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
    { id: 2, title: "Home Electrician", pay: "₹800/day", workMode: "Patna Junction", department: "Electrician", duration: "One day" },
    { id: 3, title: "Full Time Cleaner", pay: "₹12k/mo", workMode: "Work from home", department: "Cleaner", duration: "Long term" },
    { id: 4, title: "Remote Support Staff", pay: "₹15k/mo", workMode: "Remote Area", department: "Electrician", duration: "Long term" },
    { id: 5, title: "Pipe Fitting Helper", pay: "₹300/hour", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
  ];

  const handleCheckboxChange = (category, value) => {
    setSelectedFilters((prev) => {
      const alreadySelected = prev[category].includes(value);
      return {
        ...prev,
        [category]: alreadySelected
          ? prev[category].filter((v) => v !== value)
          : [...prev[category], value],
      };
    });
  };

  const filterOptions = {
    workMode: ["Work from home", "Remote Area", "Area around NIT Patna", "Patna Junction"],
    department: ["Plumber", "Electrician", "Cleaner"],
    duration: ["Short time (hours)", "One day", "Long term"],
  };

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

        <div id="google_translate_element" />

        <button onClick={toggleTheme}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button onClick={() => setIsFilterOpen(true)}>
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* MAIN */}
      <div style={{ padding: '20px' }}>
        <p>
          Found {filteredJobs.length} jobs based on your preferences.
        </p>

        {filteredJobs.map((job) => (
          <div key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.department} • {job.workMode}</p>
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
