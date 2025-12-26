'use client';
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState, useEffect } from 'react'; 
import { X, Filter, Sun, Moon, Globe } from 'lucide-react'; 

export default function HomeTab() {
  
  // --- THEME & LANGUAGE STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  // Sync with localStorage on load to match the Landing Page
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true);
    if (localStorage.getItem('language') === 'hindi') setIsHindi(true);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const next = !isHindi;
    setIsHindi(next);
    localStorage.setItem('language', next ? 'hindi' : 'english');
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
    workMode: [],
    department: [],
    duration: []
  });

  // MOCK DATA (With Title Translations)
  const jobs = [
    { id: 1, title: isHindi ? "तत्काल प्लंबर की आवश्यकता" : "Urgent Plumber Needed", pay: "₹500/visit", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
    { id: 2, title: isHindi ? "घरेलू इलेक्ट्रीशियन" : "Home Electrician", pay: "₹800/day", workMode: "Patna Junction", department: "Electrician", duration: "One day" },
    { id: 3, title: isHindi ? "फुल टाइम क्लीनर" : "Full Time Cleaner", pay: "₹12k/mo", workMode: "Work from home", department: "Cleaner", duration: "Long term" },
    { id: 4, title: isHindi ? "रिमोट सपोर्ट स्टाफ" : "Remote Support Staff", pay: "₹15k/mo", workMode: "Remote Area", department: "Electrician", duration: "Long term" },
    { id: 5, title: isHindi ? "पाइप फिटिंग हेल्पर" : "Pipe Fitting Helper", pay: "₹300/hour", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
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
    workMode: [
      { en: "Work from home", hi: "घर से कार्य" },
      { en: "Remote Area", hi: "रिमोट एरिया" },
      { en: "Area around NIT Patna", hi: "NIT पटना के पास" },
      { en: "Patna Junction", hi: "पटना जंक्शन" }
    ],
    department: [
      { en: "Plumber", hi: "प्लंबर" },
      { en: "Electrician", hi: "इलेक्ट्रीशियन" },
      { en: "Cleaner", hi: "क्लीनर" }
    ],
    duration: [
      { en: "Short time (hours)", hi: "कम समय (घंटे)" },
      { en: "One day", hi: "एक दिन" },
      { en: "Long term", hi: "लंबे समय" }
    ]
  };

  return (
    <div style={{ 
      paddingBottom: '80px', 
      fontFamily: 'Arial, sans-serif', 
      position: 'relative',
      backgroundColor: theme.bg,
      minHeight: '100vh',
      color: theme.textMain,
      transition: 'all 0.3s ease'
    }}>
      
      {/* HEADER */}
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: theme.navBg, 
        boxShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#4285F4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>J</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.textMain }}>JobLink</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          {/* LANGUAGE TOGGLE BUTTON */}
          <button 
            onClick={toggleLanguage}
            style={{
              background: isHindi ? '#4285F4' : theme.filterBtn,
              border: 'none',
              padding: '8px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              color: isHindi ? 'white' : theme.textMain,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            <Globe size={14} />
            {isHindi ? "HI" : "EN"}
          </button>

          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            style={{
              background: theme.filterBtn,
              border: 'none',
              padding: '8px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: theme.textMain,
              display: 'flex'
            }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* FILTER TRIGGER BUTTON */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 15px', 
              background: theme.filterBtn, 
              border: 'none', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              color: theme.textMain
            }}
          >
            <span>{isHindi ? "फ़िल्टर" : "Filter"}</span>
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* JOB LIST */}
      <div style={{ padding: '20px' }}>
        <p style={{ color: theme.textSub, fontSize: '0.9rem', marginBottom: '15px' }}>
          {isHindi 
            ? `आपकी पसंद के आधार पर ${filteredJobs.length} नौकरियां मिलीं।` 
            : `Found ${filteredJobs.length} jobs based on your preferences.`}
        </p>

        {filteredJobs.length === 0 ? (
           <div style={{ textAlign: 'center', marginTop: '50px', color: theme.textSub }}>
             <p>{isHindi ? "कोई नौकरी मेल नहीं खाती।" : "No jobs match these filters."}</p>
             <button onClick={() => setSelectedFilters({ workMode: [], department: [], duration: [] })} style={{ color: '#4285F4', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>
                {isHindi ? "फ़िल्टर साफ़ करें" : "Clear all filters"}
             </button>
           </div>
        ) : (
          filteredJobs.map((job) => (
            <Link href={`/seeker/job/${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px',
                boxShadow: isDarkMode ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                background: theme.cardBg,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{ margin: '0 0 5px 0', color: theme.textMain }}>{job.title}</h3>
                <p style={{ margin: '0 0 10px 0', color: theme.textSub, fontSize: '0.9rem' }}>
                  {job.department} • {job.workMode}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ background: isDarkMode ? '#1e3a5f' : '#e3f2fd', color: isDarkMode ? '#6ab7ff' : '#1565c0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{job.duration}</span>
                  <span style={{ background: isDarkMode ? '#1b3320' : '#e8f5e9', color: isDarkMode ? '#81c784' : '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{job.pay}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* --- FILTER POPUP (MODAL) --- */}
      {isFilterOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', 
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            width: '85%', maxWidth: '400px', height: '100%',
            backgroundColor: theme.navBg,
            color: theme.textMain,
            padding: '25px',
            overflowY: 'auto',
            boxShadow: '-5px 0 15px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0 }}>{isHindi ? "फ़िल्टर" : "Listing Filters"}</h2>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMain }}>
                <X size={24} />
              </button>
            </div>

            {/* Filter Sections */}
            {[
              { title: isHindi ? "कार्य मोड" : "Work Mode", key: "workMode", options: filterOptions.workMode },
              { title: isHindi ? "विभाग" : "Department", key: "department", options: filterOptions.department },
              { title: isHindi ? "अवधि" : "Duration", key: "duration", options: filterOptions.duration }
            ].map((section) => (
              <div key={section.key} style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>{section.title}</h3>
                {section.options.map(option => (
                  <label key={option.en} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedFilters[section.key].includes(option.en)}
                      onChange={() => handleCheckboxChange(section.key, option.en)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ color: theme.textSub }}>{isHindi ? option.hi : option.en}</span>
                  </label>
                ))}
              </div>
            ))}

            <button 
              onClick={() => setIsFilterOpen(false)}
              style={{ width: '100%', padding: '15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isHindi ? "फिल्टर लागू करें" : "Apply Filters"}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
      
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
