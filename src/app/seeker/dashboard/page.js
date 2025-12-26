'use client';
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState, useEffect } from 'react'; 
import { X, Filter, Sun, Moon } from 'lucide-react'; 

export default function HomeTab() {
  
  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 1. Sync Theme with localStorage
    if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true);

    // 2. GOOGLE TRANSLATE SCRIPT INJECTION
    const addGoogleTranslateScript = () => {
      // Avoid duplicate script injection
      if (document.getElementById('google-translate-script')) return;

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi', // Limits options to English and Hindi
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
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
    cardBg: isDarkMode ? '#333333' : 'white',
    textMain: isDarkMode ? '#ffffff' : '#333333',
    textSub: isDarkMode ? '#bbbbbb' : '#666666',
    border: isDarkMode ? '#444444' : '#eee',
    filterBtn: isDarkMode ? '#444' : '#f1f3f4'
  };

  // --- FILTER STATES ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    workMode: [], department: [], duration: []
  });

  const jobs = [
    { id: 1, title: "Urgent Plumber Needed", pay: "₹500/visit", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
    { id: 2, title: "Home Electrician", pay: "₹800/day", workMode: "Patna Junction", department: "Electrician", duration: "One day" },
    { id: 3, title: "Full Time Cleaner", pay: "₹12k/mo", workMode: "Work from home", department: "Cleaner", duration: "Long term" },
    { id: 4, title: "Remote Support Staff", pay: "₹15k/mo", workMode: "Remote Area", department: "Electrician", duration: "Long term" },
    { id: 5, title: "Pipe Fitting Helper", pay: "₹300/hour", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
  ];

  const handleCheckboxChange = (category, value) => {
    setSelectedFilters(prev => {
      const categoryList = prev[category];
      if (categoryList.includes(value)) {
        return { ...prev, [category]: categoryList.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...categoryList, value] };
      }
    });
  };

  const filteredJobs = jobs.filter((job) => {
    if (selectedFilters.workMode.length > 0 && !selectedFilters.workMode.includes(job.workMode)) return false;
    if (selectedFilters.department.length > 0 && !selectedFilters.department.includes(job.department)) return false;
    if (selectedFilters.duration.length > 0 && !selectedFilters.duration.includes(job.duration)) return false;
    return true;
  });

  const filterOptions = {
    workMode: ["Work from home", "Remote Area", "Area around NIT Patna", "Patna Junction"],
    department: ["Plumber", "Electrician", "Cleaner"],
    duration: ["Short time (hours)", "One day", "Long term"]
  };

  return (
    <div style={{ 
      paddingBottom: '80px', 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: theme.bg,
      minHeight: '100vh',
      color: theme.textMain,
      transition: 'all 0.3s ease'
    }}>
      
      {/* HEADER */}
      <div style={{ 
        padding: '12px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: theme.navBg, 
        boxShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#4285F4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>J</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>JobLink</span>
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          {/* THE GOOGLE TRANSLATE TARGET ELEMENT */}
          <div id="google_translate_element" style={{
            maxHeight: '36px',
            overflow: 'hidden'
          }}></div>

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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            onClick={() => setIsFilterOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0 15px', 
              height: '36px',
              background: theme.filterBtn, 
              border: 'none', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              color: theme.textMain
            }}
          >
            <Filter size={16} />
            <span className="notranslate">Filter</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        <p style={{ color: theme.textSub, fontSize: '0.9rem', marginBottom: '15px' }}>
          Found {filteredJobs.length} jobs based on your preferences.
        </p>

        {filteredJobs.map((job) => (
          <div key={job.id} style={{
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '15px',
            background: theme.cardBg,
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: theme.textMain }}>{job.title}</h3>
            <p style={{ margin: '0 0 12px 0', color: theme.textSub, fontSize: '0.9rem' }}>
              {job.department} • {job.workMode}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: isDarkMode ? '#1e3a5f' : '#e3f2fd', color: isDarkMode ? '#6ab7ff' : '#1565c0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{job.duration}</span>
              <span style={{ background: isDarkMode ? '#1b3320' : '#e8f5e9', color: isDarkMode ? '#81c784' : '#2e7d32', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{job.pay}</span>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />

      {/* CSS to hide Google Translate Bar and Banner */}
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
        body { top: 0px !important; }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: 1px solid #ccc !important;
          padding: 5px !important;
          border-radius: 20px !important;
          font-size: 12px !important;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
