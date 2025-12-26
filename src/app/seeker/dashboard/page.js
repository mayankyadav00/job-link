'use client';
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState, useEffect } from 'react'; 
import { X, Filter, Sun, Moon, Globe } from 'lucide-react'; 

export default function HomeTab() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  // --- SYNC WITH PREVIOUS PAGE ---
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

  // --- FILTER LOGIC ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ workMode: [], department: [], duration: [] });

  const jobs = [
    { id: 1, title: isHindi ? "तत्काल प्लंबर" : "Urgent Plumber", pay: "₹500", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
    { id: 2, title: isHindi ? "इलेक्ट्रीशियन" : "Electrician", pay: "₹800", workMode: "Patna Junction", department: "Electrician", duration: "One day" },
  ];

  const filterOptions = {
    workMode: [{ en: "Work from home", hi: "घर से कार्य" }, { en: "Patna Junction", hi: "पटना जंक्शन" }],
    department: [{ en: "Plumber", hi: "प्लंबर" }, { en: "Electrician", hi: "इलेक्ट्रीशियन" }],
    duration: [{ en: "One day", hi: "एक दिन" }, { en: "Long term", hi: "लंबे समय" }]
  };

  const handleCheckboxChange = (category, value) => {
    setSelectedFilters(prev => {
      const list = prev[category];
      return { ...prev, [category]: list.includes(value) ? list.filter(i => i !== value) : [...list, value] };
    });
  };

  const filteredJobs = jobs.filter(job => {
    if (selectedFilters.workMode.length > 0 && !selectedFilters.workMode.includes(job.workMode)) return false;
    if (selectedFilters.department.length > 0 && !selectedFilters.department.includes(job.department)) return false;
    if (selectedFilters.duration.length > 0 && !selectedFilters.duration.includes(job.duration)) return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', transition: '0.3s', paddingBottom: '80px' }}>
      <nav style={{ background: theme.navBg, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>JobLink</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={toggleLanguage} style={{ background: isHindi ? '#4285F4' : theme.filterBtn, color: isHindi ? 'white' : theme.textMain, border: 'none', padding: '8px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Globe size={14} style={{ marginRight: '5px' }} /> {isHindi ? "HI" : "EN"}
          </button>
          <button onClick={toggleTheme} style={{ background: theme.filterBtn, border: 'none', padding: '8px', borderRadius: '50%', color: theme.textMain, cursor: 'pointer' }}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setIsFilterOpen(true)} style={{ background: theme.filterBtn, border: 'none', padding: '8px 15px', borderRadius: '20px', color: theme.textMain, fontWeight: 'bold', cursor: 'pointer' }}>
            {isHindi ? "फ़िल्टर" : "Filter"} <Filter size={16} />
          </button>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        <p style={{ color: theme.textSub }}>{isHindi ? `कुल ${filteredJobs.length} नौकरियां मिलीं` : `Found ${filteredJobs.length} jobs`}</p>
        {filteredJobs.map(job => (
          <div key={job.id} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>{job.title}</h3>
            <p style={{ color: theme.textSub, fontSize: '0.9rem' }}>{job.department} • {job.workMode}</p>
          </div>
        ))}
      </div>

      {isFilterOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '80%', maxWidth: '350px', backgroundColor: theme.navBg, padding: '25px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2>{isHindi ? "फिल्टर" : "Filters"}</h2>
              <X onClick={() => setIsFilterOpen(false)} style={{ cursor: 'pointer' }} />
            </div>
            {Object.entries(filterOptions).map(([key, options]) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <h4 style={{ textTransform: 'capitalize' }}>{key}</h4>
                {options.map(opt => (
                  <label key={opt.en} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <input type="checkbox" checked={selectedFilters[key].includes(opt.en)} onChange={() => handleCheckboxChange(key, opt.en)} />
                    <span style={{ color: theme.textSub }}>{isHindi ? opt.hi : opt.en}</span>
                  </label>
                ))}
              </div>
            ))}
            <button onClick={() => setIsFilterOpen(false)} style={{ width: '100%', padding: '15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
              {isHindi ? "लागू करें" : "Apply"}
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
