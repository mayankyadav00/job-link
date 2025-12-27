// src/app/seeker/dashboard/page.js
'use client';
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState } from 'react';
import { X, Filter } from 'lucide-react'; // Make sure to install lucide-react if not already

export default function HomeTab() {
  
  // 1. STATE: Manage the visibility of the Filter Popup
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 2. STATE: Store multiple selected options
  const [selectedFilters, setSelectedFilters] = useState({
    workMode: [],
    department: [],
    duration: []
  });

  // MOCK DATA: Updated to match your specific categories
  const jobs = [
    { id: 1, title: "Urgent Plumber Needed", pay: "₹500/visit", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
    { id: 2, title: "Home Electrician", pay: "₹800/day", workMode: "Patna Junction", department: "Electrician", duration: "One day" },
    { id: 3, title: "Full Time Cleaner", pay: "₹12k/mo", workMode: "Work from home", department: "Cleaner", duration: "Long term" },
    { id: 4, title: "Remote Support Staff", pay: "₹15k/mo", workMode: "Remote Area", department: "Electrician", duration: "Long term" },
    { id: 5, title: "Pipe Fitting Helper", pay: "₹300/hour", workMode: "Area around NIT Patna", department: "Plumber", duration: "Short time (hours)" },
  ];

  // LOGIC: Handle checking/unchecking boxes
  const handleCheckboxChange = (category, value) => {
    setSelectedFilters(prev => {
      const categoryList = prev[category];
      if (categoryList.includes(value)) {
        // If already selected, remove it (Uncheck)
        return { ...prev, [category]: categoryList.filter(item => item !== value) };
      } else {
        // If not selected, add it (Check)
        return { ...prev, [category]: [...categoryList, value] };
      }
    });
  };

  // LOGIC: The Master Filter Function
  const filteredJobs = jobs.filter((job) => {
    // 1. Check Work Mode (If any are selected, job must match one of them)
    if (selectedFilters.workMode.length > 0 && !selectedFilters.workMode.includes(job.workMode)) return false;
    
    // 2. Check Department
    if (selectedFilters.department.length > 0 && !selectedFilters.department.includes(job.department)) return false;
    
    // 3. Check Duration
    if (selectedFilters.duration.length > 0 && !selectedFilters.duration.includes(job.duration)) return false;

    return true; // If it passes all checks, show it!
  });

  // CATEGORY LISTS (Exactly from your image)
  const filterOptions = {
    workMode: ["Work from home", "Remote Area", "Area around NIT Patna", "Patna Junction"],
    department: ["Plumber", "Electrician", "Cleaner"],
    duration: ["Short time (hours)", "One day", "Long term"]
  };

  return (
    <div style={{ paddingBottom: '80px', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      
      {/* HEADER */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: '#4285F4', borderRadius: '50%' }}></div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>JobLink</h1>
        </div>
        
        {/* THE NEW FILTER TRIGGER BUTTON */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 15px', 
            background: '#f1f3f4', 
            border: 'none', 
            borderRadius: '20px', 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <span>Filter</span>
          <Filter size={16} />
        </button>
      </div>

      {/* JOB LIST */}
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
          Found {filteredJobs.length} jobs based on your preferences.
        </p>

        {filteredJobs.length === 0 ? (
           <div style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
             <p>No jobs match these filters.</p>
             <button onClick={() => setSelectedFilters({ workMode: [], department: [], duration: [] })} style={{ color: '#4285F4', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>Clear all filters</button>
           </div>
        ) : (
          filteredJobs.map((job) => (
            <Link href={`/seeker/job/${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                background: 'white'
              }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{job.title}</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                  {job.department} • {job.workMode}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{job.duration}</span>
                  <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{job.pay}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* --- THE FILTER POPUP (MODAL) --- */}
      {isFilterOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'flex-end' // Slides in from right, or center
        }}>
          <div style={{
            width: '85%',
            maxWidth: '400px',
            height: '100%',
            backgroundColor: 'white',
            padding: '25px',
            overflowY: 'auto',
            animation: 'slideIn 0.3s ease-out'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0 }}>Listing Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* --- FILTER SECTION 1: Work Mode --- */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Work Mode</h3>
              {filterOptions.workMode.map(option => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedFilters.workMode.includes(option)}
                    onChange={() => handleCheckboxChange('workMode', option)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ color: '#555' }}>{option}</span>
                </label>
              ))}
            </div>

            {/* --- FILTER SECTION 2: Department --- */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Department</h3>
              {filterOptions.department.map(option => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedFilters.department.includes(option)}
                    onChange={() => handleCheckboxChange('department', option)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ color: '#555' }}>{option}</span>
                </label>
              ))}
            </div>

            {/* --- FILTER SECTION 3: Duration --- */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Duration</h3>
              {filterOptions.duration.map(option => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedFilters.duration.includes(option)}
                    onChange={() => handleCheckboxChange('duration', option)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ color: '#555' }}>{option}</span>
                </label>
              ))}
            </div>

            {/* Apply Button */}
            <button 
              onClick={() => setIsFilterOpen(false)}
              style={{ width: '100%', padding: '15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Apply Filters
            </button>

          </div>
        </div>
      )}

      <BottomNav />
      
      {/* Simple Keyframes for animation */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
