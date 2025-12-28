'use client';
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X, Filter, Map, List } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import JobMap from '../../../components/JobMap';
import AIChatBot from '../../../components/AIChatBot';
import OnboardingForm from '../../../components/OnboardingForm'; // <--- ADDED THIS IMPORT

// --- 1. SETUP DATABASE CONNECTION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HomeTab() {
  
  // 2. STATE: Store Real Jobs from Database
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);               // <--- ADDED
  const [showOnboarding, setShowOnboarding] = useState(false); // <--- ADDED

  // 3. STATE: Filter UI visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 4. STATE: View Mode (List or Map)
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  // 5. STATE: Store selected options
  const [selectedFilters, setSelectedFilters] = useState({
    workMode: [],
    department: [],
    duration: []
  });

  // --- EFFECT: FETCH REAL JOBS & CHECK USER ON LOAD ---
  useEffect(() => {
    const initData = async () => {
        // A. Check User Profile (For Signup Form)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            // Check if profile exists and has data
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            // If no profile or no skills saved, show the form
            if (!profile || !profile.skills) {
                setShowOnboarding(true);
            }
        }

        // B. Fetch Jobs
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setJobs(data);
        setLoading(false);
    };

    initData();
  }, []);

  // --- LOGIC: CHECKBOX HANDLER ---
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

  // --- LOGIC: MASTER FILTER ---
  const filteredJobs = jobs.filter((job) => {
    // 1. Check Work Mode (Using location/address as proxy)
    if (selectedFilters.workMode.length > 0) {
       const match = selectedFilters.workMode.some(filter => 
         (job.location_name || '').includes(filter) || (job.work_mode || '').includes(filter)
       );
       if (!match) return false;
    }
    
    // 2. Check Department (Using title/description match)
    if (selectedFilters.department.length > 0) {
       const match = selectedFilters.department.some(filter => 
         job.title.toLowerCase().includes(filter.toLowerCase()) || 
         (job.description || '').toLowerCase().includes(filter.toLowerCase())
       );
       if (!match) return false;
    }
    
    // 3. Check Duration (Using job_type)
    if (selectedFilters.duration.length > 0) {
       const match = selectedFilters.duration.some(filter => {
         if (filter === "Short time (hours)") return job.job_type === "Daily Wage";
         if (filter === "One day") return job.job_type === "Contract";
         if (filter === "Long term") return job.job_type === "Full-time";
         return job.job_type === filter;
       });
       if (!match) return false;
    }

    return true;
  });

  // CATEGORY LISTS
  const filterOptions = {
    workMode: ["Work from home", "Remote Area", "Patna", "Kankarbagh"], 
    department: ["Plumber", "Electrician", "Cleaner", "Helper"],
    duration: ["Short time (hours)", "One day", "Long term"]
  };

  return (
    <div style={{ paddingBottom: '80px', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      
      {/* --- ADDED: ONBOARDING POPUP --- */}
      {showOnboarding && (
        <OnboardingForm 
          user={user} 
          role="seeker" 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}

      {/* HEADER */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: '#4285F4', borderRadius: '50%' }}></div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>JobLink</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* VIEW TOGGLE BUTTONS */}
          <div style={{ display: 'flex', background: '#f1f3f4', borderRadius: '20px', padding: '4px' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{ padding: '6px 12px', border: 'none', background: viewMode === 'list' ? 'white' : 'transparent', borderRadius: '16px', cursor: 'pointer', boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ padding: '6px 12px', border: 'none', background: viewMode === 'map' ? 'white' : 'transparent', borderRadius: '16px', cursor: 'pointer', boxShadow: viewMode === 'map' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Map size={16} />
            </button>
          </div>

          {/* FILTER BUTTON */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', 
              background: '#f1f3f4', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' 
            }}
          >
            <span>Filter</span>
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA (List vs Map) --- */}
      {viewMode === 'list' ? (
        /* LIST VIEW */
        <div style={{ padding: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
            {loading ? "Loading jobs..." : `Found ${filteredJobs.length} jobs nearby.`}
          </p>

          {filteredJobs.length === 0 && !loading ? (
             <div style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
               <p>No jobs match these filters.</p>
               <button onClick={() => setSelectedFilters({ workMode: [], department: [], duration: [] })} style={{ color: '#4285F4', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>Clear all filters</button>
             </div>
          ) : (
            filteredJobs.map((job) => (
              <Link href={`/seeker/job/${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  border: '1px solid #eee', borderRadius: '12px', padding: '15px', marginBottom: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: 'white'
                }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{job.title}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                    {job.job_type || 'General'} • {job.location_name || 'Patna'}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {job.job_type}
                    </span>
                    <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {job.pay_rate}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        /* MAP VIEW */
        <div style={{ padding: '20px', height: 'calc(100vh - 150px)' }}>
          <JobMap jobs={filteredJobs} />
        </div>
      )}

      {/* --- FILTER POPUP (Modal) --- */}
      {isFilterOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
          display: 'flex', justifyContent: 'flex-end'
        }}>
          <div style={{
            width: '85%', maxWidth: '400px', height: '100%', backgroundColor: 'white',
            padding: '25px', overflowY: 'auto', animation: 'slideIn 0.3s ease-out'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0 }}>Listing Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category} style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '15px', textTransform: 'capitalize' }}>
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                {options.map(option => (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedFilters[category].includes(option)}
                      onChange={() => handleCheckboxChange(category, option)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ color: '#555' }}>{option}</span>
                  </label>
                ))}
              </div>
            ))}

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
      
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <AIChatBot />
    </div>
  );
}

