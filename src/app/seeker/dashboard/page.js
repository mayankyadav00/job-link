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
      { en: "Short time (hours)", hi: "
