'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { X, Search, Clock, MapPin } from 'lucide-react';
import { BottomNav } from '../../../components/BottomNav';
import JobMap from '../../../components/JobMap'; // Importing your functional Map

// Initialize Database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SearchTab() {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load Data on Mount (Jobs + History)
  useEffect(() => {
    // Load History
    const savedHistory = localStorage.getItem('jobSearchHistory');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

    // Fetch Jobs
    const fetchJobs = async () => {
      const { data } = await supabase.from('jobs').select('*');
      if (data) {
        setJobs(data);
        setFilteredJobs(data);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // 2. Search Logic
  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(lower) ||
      job.location_name.toLowerCase().includes(lower) ||
      (job.description || '').toLowerCase().includes(lower)
    );
    setFilteredJobs(results);
  };

  // 3. Save History Logic
  const saveToHistory = () => {
    if (!query.trim()) return;
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('jobSearchHistory', JSON.stringify(newHistory));
  };

  // 4. Delete History Logic (Editing)
  const deleteHistoryItem = (item) => {
    const newHistory = searchHistory.filter(h => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem('jobSearchHistory', JSON.stringify(newHistory));
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', background: 'white' }}>
      
      <h2 style={{ marginBottom: '20px', fontSize: '1.8rem' }}>Search Jobs</h2>

      {/* 1. Functional Search Bar */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && saveToHistory()}
          placeholder="Search keywords (e.g. Driver, Patna)..." 
          style={{
            width: '100%',
            padding: '15px 40px 15px 15px', // Extra right padding for X button
            borderRadius: '10px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            outline: 'none',
            background: '#f9f9f9'
          }}
        />
        {/* Clear Button inside Input */}
        {query && (
          <button 
            onClick={() => handleSearch('')}
            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} color="#999" />
          </button>
        )}
      </div>

      {/* 2. Search History (Editable) */}
      {searchHistory.length > 0 && !query && (
        <div style={{ marginBottom: '30px' }}>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>Recent Searches</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {searchHistory.map((tag) => (
              <div key={tag} style={{ background: '#f5f5f5', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #eee' }}>
                <span onClick={() => handleSearch(tag)} style={{ cursor: 'pointer', color: '#555', fontSize: '0.9rem' }}>
                   🕒 {tag}
                </span>
                {/* Delete Button (X) */}
                <X 
                  size={14} 
                  color="#999" 
                  style={{ cursor: 'pointer' }} 
                  onClick={(e) => { e.stopPropagation(); deleteHistoryItem(tag); }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAP SECTION (Replaces the static card) */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', color: '#555', marginBottom: '10px' }}>
          {query ? `Found ${filteredJobs.length} Results` : 'Explore on Map'}
        </h3>
        <div style={{ height: '200px', width: '100%' }}>
          {/* This uses your functional Map Component */}
          <JobMap jobs={filteredJobs} />
        </div>
      </div>

      {/* 4. RESULTS LIST (So users can see details) */}
      {query && (
        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredJobs.map(job => (
            <Link href={`/seeker/job/${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{job.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'green', fontWeight: 'bold' }}>{job.pay_rate}</span>
                </div>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} /> {job.location_name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
