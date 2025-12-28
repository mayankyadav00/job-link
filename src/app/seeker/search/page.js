'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Search, X, Clock, MapPin } from 'lucide-react';
import JobMap from '../../../components/JobMap'; // Importing your Map Component
import { BottomNav } from '../../../components/BottomNav';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load History & Jobs on Mount
  useEffect(() => {
    // Load History from LocalStorage
    const savedHistory = localStorage.getItem('jobSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Fetch All Jobs (Optimized for small/medium apps)
    const fetchJobs = async () => {
      const { data } = await supabase.from('jobs').select('*');
      if (data) {
        setJobs(data);
        setFilteredJobs(data); // Show all initially
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // 2. Handle Search Logic
  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    // Filter Logic
    const lowerTerm = searchTerm.toLowerCase();
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(lowerTerm) ||
      job.location_name.toLowerCase().includes(lowerTerm) ||
      job.description.toLowerCase().includes(lowerTerm)
    );
    setFilteredJobs(results);
  };

  // 3. Save to History (on Enter or Button Click)
  const saveToHistory = () => {
    if (!query.trim()) return;
    
    // Avoid duplicates
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5); // Keep top 5
    setSearchHistory(newHistory);
    localStorage.setItem('jobSearchHistory', JSON.stringify(newHistory));
  };

  // 4. Delete from History
  const deleteHistoryItem = (itemToDelete) => {
    const newHistory = searchHistory.filter(item => item !== itemToDelete);
    setSearchHistory(newHistory);
    localStorage.setItem('jobSearchHistory', JSON.stringify(newHistory));
  };

  return (
    <div style={{ paddingBottom: '80px', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* SEARCH HEADER */}
      <div style={{ background: 'white', padding: '20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px' }}>Explore Jobs</h1>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={20} color="#64748b" style={{ position: 'absolute', left: '15px' }} />
          <input 
            type="text" 
            placeholder="Search role, location, or skill..." 
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveToHistory()}
            style={{ 
              width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', 
              background: '#f1f5f9', fontSize: '1rem', outline: 'none' 
            }}
          />
          {query && (
            <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} color="#94a3b8" />
            </button>
          )}
        </div>

        {/* RECENT HISTORY CHIPS */}
        {searchHistory.length > 0 && !query && (
          <div style={{ marginTop: '15px' }}>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} /> Recent Searches
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {searchHistory.map((term, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '6px 12px', fontSize: '0.9rem', color: '#334155' }}>
                  <span onClick={() => handleSearch(term)} style={{ cursor: 'pointer', marginRight: '6px' }}>{term}</span>
                  <X 
                    size={14} 
                    color="#cbd5e1" 
                    style={{ cursor: 'pointer' }} 
                    onClick={(e) => { e.stopPropagation(); deleteHistoryItem(term); }} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* MAP SECTION (Only shows if there are results) */}
        {filteredJobs.length > 0 && (
          <div style={{ marginBottom: '25px', height: '200px' }}>
            <JobMap jobs={filteredJobs} />
          </div>
        )}

        {/* RESULTS LIST */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', color: '#1e293b' }}>
          {query ? `Results for "${query}"` : 'All Jobs'}
        </h3>

        {filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>
            No jobs found matching "{query}"
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredJobs.map(job => (
              <Link href={`/seeker/job/${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{job.title}</h4>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {job.location_name}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                      {job.pay_rate}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
