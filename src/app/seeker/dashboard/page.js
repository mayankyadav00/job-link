// src/app/seeker/home/page.js
'use client';
import { BottomNav } from '../../../components/BottomNav';
import Link from 'next/link';

export default function HomeTab() {
  
  // Mock Data
  const jobs = [
    { id: 1, title: "Dishwasher", pay: "₹400/day", type: "One Day", loc: "Patna" },
    { id: 2, title: "React JS Dev", pay: "₹25k/mo", type: "Long Term", loc: "Remote" },
    { id: 3, title: "Delivery", pay: "₹100/trip", type: "Part Time", loc: "Local" },
    { id: 4, title: "Painter", pay: "₹800/day", type: "One Day", loc: "Kankarbagh" },
    { id: 5, title: "Shop staff", pay: "₹500/day", type: "Two days", loc: "Ashok Rajpath" }
  ];

  return (
    <div style={{ paddingBottom: '80px', fontFamily: 'Arial, sans-serif' }}>
      
     {/* 1. HEADER (App Name + Logo + Language) */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div class="hover" style={{ width: '32px', height: '32px', background: '#4285F4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>J</div>
          <a id="joblinklogo" href="https://job-link-black.vercel.app/">
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>JobLink</span>
          </a>
        </div>

        {/* Right: Language Toggle */}
        <button class="hover" style={{ 
            padding: '5px 10px', 
            border: '1px solid #ccc', 
            borderRadius: '15px', 
            background: 'white', 
            fontSize: '0.8rem' 
        }}>
            🌐 EN / HI
        </button>
      </div>
      {/* 2. FILTERS (Horizontal Scroll) */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        overflowX: 'auto', // Allows scrolling sideways
        padding: '0 20px 20px 20px',
        whiteSpace: 'nowrap'
      }}>
        {/* Filter Chips */}
        {['Remote', 'Onsite', 'One Day', 'Long Term', 'Urgent','Remote', 'Onsite', 'One Day', 'Long Term', 'Urgent','Remote', 'Onsite', 'One Day', 'Long Term', 'Urgent','Remote', 'Onsite', 'One Day', 'Long Term', 'Urgent'].map((filter) => (
          <button key={filter} style={{
           /* padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            background: 'white',
            flexShrink: 0 // Prevents squishing*/
          }}>
            {filter}
          </button>
        ))}
      </div>
      {/* 3. JOB LIST */}
      <div style={{ padding: '0 20px' }}>
        {jobs.map((job) => (
          <Link href={`/seeker/job/${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              border: '1px solid #eee',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '15px',
              marginLeft: '50px',
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
        ))}
      </div>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );

}














