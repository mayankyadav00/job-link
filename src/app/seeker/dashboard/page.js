'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Filter, Map, List, Search } from 'lucide-react';

// --- IMPORTS (Make sure these files exist!) ---
import { BottomNav } from '../../../components/BottomNav';
import JobMap from '../../../components/JobMap';
import AIChatBot from '../../../components/AIChatBot';
import OnboardingForm from '../../../components/OnboardingForm';

// --- SUPABASE SETUP ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SeekerDashboard() {
  const router = useRouter();
  
  // 1. STATE: User & Profile
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // 2. STATE: Jobs Data
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // 3. STATE: UI Controls
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 4. STATE: Filters
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: [], // Daily Wage, Contract, etc.
  });

  // --- EFFECT: CHECK USER & PROFILE ---
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    // A. Check Auth
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      router.push('/login');
      return;
    }
    setUser(user);

    // B. Check Profile (Does the user have skills/name saved?)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // If profile is missing OR incomplete (no skills), show the popup
    if (!profile || !profile.skills) {
      setShowOnboarding(true);
    }

    setLoadingUser(false);
    fetchJobs();
  };

  // --- LOGIC: FETCH JOBS ---
  const fetchJobs = async () => {
    setLoadingJobs(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching jobs:", error);
    if (data) setJobs(data);
    setLoadingJobs(false);
  };

  // --- LOGIC: FILTERING ---
  const filteredJobs = jobs.filter((job) => {
    // 1. Search Text Match
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (job.location_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Filter Checkboxes
    if (selectedFilters.jobType.length > 0) {
      if (!selectedFilters.jobType.includes(job.job_type)) return false;
    }

    return true;
  });

  const handleCheckboxChange = (value) => {
    setSelectedFilters(prev => {
      const list = prev.jobType;
      if (list.includes(value)) return { jobType: list.filter(item => item !== value) };
      return { jobType: [...list, value] };
    });
  };

  if (loadingUser) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ paddingBottom: '90px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* --- 1. ONBOARDING POPUP (If Profile Incomplete) --- */}
      {showOnboarding && (
        <OnboardingForm 
          user={user} 
          role="seeker" 
          onComplete={() => { setShowOnboarding(false); checkUser(); }} 
        />
      )}

      {/* --- 2. HEADER & SEARCH --- */}
      <div style={{ background: 'white', padding: '20px', paddingBottom: '15px', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        {/* Top Row: Title + Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h1 style={{ fontSize: '1.4rem', margin: 0, color: '#1e293b' }}>Find Work 👷‍♂️</h1>
          
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '3px' }}>
            <button onClick={() => setViewMode('list')} style={{ ...toggleBtnStyle, background: viewMode === 'list' ? 'white' : 'transparent', boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}>
              <List size={18} />
            </button>
            <button onClick={() => setViewMode('map')} style={{ ...toggleBtnStyle, background: viewMode === 'map' ? 'white' : 'transparent', boxShadow: viewMode === 'map' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}>
              <Map size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar + Filter */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text" 
              placeholder="Search 'Driver', 'Patna'..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc' }}
            />
          </div>
          <button onClick={() => setIsFilterOpen(true)} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
            <Filter size={20} color="#64748b" />
          </button>
        </div>
      </div>

      {/* --- 3. MAIN CONTENT (List or Map) --- */}
      {viewMode === 'list' ? (
        <div style={{ padding: '20px' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' }}>
            {loadingJobs ? 'Looking for jobs...' : `Found ${filteredJobs.length} jobs near you.`}
          </p>
          
          {filteredJobs.length === 0 && !loadingJobs && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <p>No jobs found matching your search.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedFilters({jobType:[]}); }} style={{ color: '#2563eb', background: 'none', border: 'none', textDecoration: 'underline' }}>Clear Filters</button>
            </div>
          )}

          {filteredJobs.map((job) => (
             <Link href={`#`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
               <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '15px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div>
                     <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>{job.title}</h3>
                     <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{job.location_name || 'Patna'}</p>
                   </div>
                   <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                     {job.pay_rate}
                   </span>
                 </div>
                 <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                   <span style={tagStyle}>{job.job_type}</span>
                   <span style={tagStyle}>{job.status}</span>
                 </div>
               </div>
             </Link>
          ))}
        </div>
      ) : (
        /* MAP VIEW */
        <div style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
          <JobMap jobs={filteredJobs} />
        </div>
      )}

      {/* --- 4. FILTER MODAL --- */}
      {isFilterOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Filter Jobs</h2>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none' }}><X /></button>
            </div>
            
            <h4 style={{ marginBottom: '10px' }}>Job Type</h4>
            {['Daily Wage', 'Contract', 'Full-time'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
                <input 
                  type="checkbox" 
                  checked={selectedFilters.jobType.includes(type)}
                  onChange={() => handleCheckboxChange(type)}
                  style={{ width: '20px', height: '20px' }}
                />
                {type}
              </label>
            ))}

            <button onClick={() => setIsFilterOpen(false)} style={{ width: '100%', marginTop: '20px', padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold' }}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* --- 5. GLOBAL COMPONENTS --- */}
      <AIChatBot />
      <BottomNav />
    </div>
  );
}

// --- STYLES ---
const toggleBtnStyle = { padding: '8px 12px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const tagStyle = { background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' };
const modalContentStyle = { background: 'white', width: '100%', maxWidth: '480px', borderRadius: '20px 20px 0 0', padding: '25px', animation: 'slideUp 0.3s' };
