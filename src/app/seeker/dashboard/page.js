'use client';
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState, useEffect } from 'react'; 
import { X, Filter, Sun, Moon } from 'lucide-react'; 

export default function HomeTab() {
  
  // --- 1. THEME STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- 2. FILTER & MODAL STATES ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    workMode: [], department: [], duration: []
  });

  // --- 3. GOOGLE TRANSLATE & LOCALSTORAGE SYNC ---
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true);

    const addScript = () => {
      if (document.getElementById('google-translate-script')) return;
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      };
    };
    addScript();
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // --- 4. THEME STYLING OBJECT ---
  const theme = {
    bg: isDarkMode ? '#1a1a1a' : '#f4f4f4',
    navBg: isDarkMode ? '#2d2d2d' : 'white',
    cardBg: isDarkMode ? '#333333' : 'white',
    textMain: isDarkMode ? '#ffffff' : '#333333',
    textSub: isDarkMode ? '#bbbbbb' : '#666666',
    border: isDarkMode ? '#444444' : '#eee',
    filterBtn: isDarkMode ? '#444' : '#f1f3f4'
  };

  // --- 5. JOB DATA & FILTERING LOGIC ---
  const jobs = [
    { id: 1, title: "Urgent Plumber Needed", pay: "₹500/visit", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
    { id: 2, title: "Home Electrician", pay: "₹800/day", workMode: "Patna Junction", department: "Electrician", duration: "One day" },
    { id: 3, title: "Full Time Cleaner", pay: "₹12k/mo", workMode: "Work from home", department: "Cleaner", duration: "Long term" },
    { id: 4, title: "Remote Support Staff", pay: "₹15k/mo", workMode: "Remote Area", department: "Electrician", duration: "Long term" },
    { id: 5, title: "Pipe Fitting Helper", pay: "₹300/hour", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
  ];

  const handleCheckboxChange = (category, value) => {
    setSelectedFilters(prev => {
      const list = prev[category];
      const newList = list.includes(value) ? list.filter(i => i !== value) : [...list, value];
      return { ...prev, [category]: newList };
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
    <div style={{ paddingBottom: '80px', fontFamily: 'Arial, sans-serif', backgroundColor: theme.bg, minHeight: '100vh', color: theme.textMain, transition: '0.3s' }}>
      
      {/* HEADER */}
      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.navBg, boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#4285F4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>J</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>JobLink</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Google Translate Dropdown Container */}
          <div id="google_translate_element" style={{ maxHeight: '36px', minWidth: '130px' }}> ENG/HIND</div>

          <button onClick={toggleTheme} style={{ background: 'transparent', border: `1px solid ${theme.border}`, width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: theme.textMain, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={() => setIsFilterOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 15px', height: '36px', background: theme.filterBtn, border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', color: theme.textMain }}>
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* JOB LIST */}
      <div style={{ padding: '20px' }}>
        <p style={{ color: theme.textSub, fontSize: '0.9rem', marginBottom: '15px' }}>Found {filteredJobs.length} jobs.</p>

        {filteredJobs.map((job) => (
          <Link href={`/seeker/job/${job.id}`} key={job.id} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px', marginBottom: '15px', background: theme.cardBg, transition: '0.2s' }}>
              <h3 style={{ margin: '0 0 8px 0', color: theme.textMain }}>{job.title}</h3>
              <p style={{ margin: '0 0 12px 0', color: theme.textSub, fontSize: '0.9rem' }}>{job.department} • {job.workMode}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: isDarkMode ? '#1e3a5f' : '#e3f2fd', color: isDarkMode ? '#6ab7ff' : '#1565c0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{job.duration}</span>
                <span style={{ background: isDarkMode ? '#1b3320' : '#e8f5e9', color: isDarkMode ? '#81c784' : '#2e7d32', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{job.pay}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* FILTER MODAL */}
      {isFilterOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '85%', maxWidth: '380px', height: '100%', backgroundColor: theme.navBg, color: theme.textMain, padding: '25px', overflowY: 'auto', boxShadow: '-5px 0 20px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0 }}>Filters</h2>
              <X onClick={() => setIsFilterOpen(false)} style={{ cursor: 'pointer' }} size={24} />
            </div>

            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category} style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '10px', textTransform: 'capitalize' }}>{category}</h3>
                {options.map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedFilters[category].includes(opt)} onChange={() => handleCheckboxChange(category, opt)} />
                    <span style={{ color: theme.textSub }}>{opt}</span>
                  </label>
                ))}
              </div>
            ))}

            <button onClick={() => setIsFilterOpen(false)} style={{ width: '100%', padding: '16px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <BottomNav />

      {/* FIXED CSS FOR GOOGLE TRANSLATE OVERLAYS */}
      <style jsx global>{`
        /* 1. Prevent Google from pushing the body down or covering the header */
        iframe.goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-te-gadget {
          font-family: Arial, sans-serif !important;
        }

        /* 2. Style the dropdown button to fit your design */
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: 1px solid ${isDarkMode ? '#444' : '#ccc'} !important;
          padding: 4px 8px !important;
          border-radius: 20px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
        }

        /* 3. Hide the Google Logo/Icon inside the button */
        .goog-te-gadget-icon {
          display: none !important;
        }

        /* 4. Fix for dropdown disappearing - ensuring z-index visibility */
        .goog-te-menu-frame {
          z-index: 999999 !important;
        }
      `}</style>
    </div>
  );
}

