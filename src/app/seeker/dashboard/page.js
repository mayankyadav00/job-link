// src/app/seeker/dashboard/page.js
'use client';
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';
import { useState } from 'react'; // ✅ 1. Import useState to manage memory

export default function HomeTab() {
  
  // ✅ 2. Create a "State" to remember the active filter. 
  // Default is 'All' so we see everything at start.
  const [activeFilter, setActiveFilter] = useState('All');

  // Mock Data (I added a 'type' to every job to match the filters)
  const jobs = [
    { id: 1, title: "Dishwasher", pay: "₹400/day", type: "One Day", loc: "Patna" },
    { id: 2, title: "React Dev", pay: "₹25k/mo", type: "Remote", loc: "Remote" },
    { id: 3, title: "Delivery", pay: "₹100/trip", type: "Part Time", loc: "Local" },
    { id: 4, title: "Painter", pay: "₹800/day", type: "One Day", loc: "Kankarbagh" },
    { id: 5, title: "Content Writer", pay: "₹5k/project", type: "Remote", loc: "Remote" },
  ];

  // ✅ 3. The Logic: Filter the jobs based on the state
  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === 'All') return true; // Show all if 'All' is selected
    return job.type === activeFilter; // Otherwise, only show matches
  });

  // The list of filter buttons we want
  const filters = ['All', 'Remote', 'One Day', 'Part Time'];

  return (
    <div style={{ paddingBottom: '80px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: '#4285F4', borderRadius: '50%' }}></div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>JobLink</h1>
        </div>
        <button style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: '15px', background: 'white', fontSize: '0.8rem' }}>
            🌐 EN / HI
        </button>
      </div>

      {/* ✅ 4. FILTERS SECTION (Interactive) */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        overflowX: 'auto', 
        padding: '0 20px 20px 20px',
        whiteSpace: 'nowrap'
      }}>
        {filters.map((filterName) => (
          <button 
            key={filterName} 
            // ✅ When clicked, update the state variable
            onClick={() => setActiveFilter(filterName)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              // ✅ Change color if this button is active
              border: activeFilter === filterName ? '2px solid #4285F4' : '1px solid #ccc',
              background: activeFilter === filterName ? '#e8f0fe' : 'white',
              color: activeFilter === filterName ? '#4285F4' : '#333',
              fontWeight: activeFilter === filterName ? 'bold' : 'normal',
              flexShrink: 0,
              cursor: 'pointer'
            }}>
            {filterName}
          </button>
        ))}
      </div>

      {/* ✅ 5. JOB LIST (Show 'filteredJobs' instead of 'jobs') */}
      <div style={{ padding: '0 20px' }}>
        
        {/* Helper text to show what is happening */}
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
            Showing: <strong>{activeFilter} Jobs</strong> ({filteredJobs.length} found)
        </p>

        {filteredJobs.length === 0 ? (
            <p>No jobs found for this category.</p>
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
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#666' }}>
                    <span>📍 {job.loc}</span>
                    <span>💰 {job.pay}</span>
                </div>
                <span style={{ 
                    display: 'inline-block', 
                    marginTop: '10px', 
                    fontSize: '0.8rem', 
                    background: '#e3f2fd', 
                    color: '#1565c0', 
                    padding: '4px 8px', 
                    borderRadius: '4px' 
                }}>
                    {job.type}
                </span>
                </div>
            </Link>
            ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
