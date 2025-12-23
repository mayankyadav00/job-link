// src/app/provider/dashboard/page.js
'use client';
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';
import Link from 'next/link';

export default function ProviderDashboard() {
  
  // Mock Data
  const myJobs = [
    { id: 1, title: "Shop Helper", applicants: 5, status: "Active", loc: "Kankarbagh" },
    { id: 2, title: "Delivery Boy", applicants: 12, status: "Closed", loc: "Patna City" }
  ];

  return (
    <div style={{ paddingBottom: '80px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ padding: '20px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>My Listings</h1>
        <div style={{ width: '30px', height: '30px', background: '#34A853', borderRadius: '50%' }}></div>
      </div>

      {/* STATS ROW */}
      <div style={{ display: 'flex', gap: '15px', padding: '20px' }}>
        <div style={{ flex: 1, background: '#34A853', padding: '15px', borderRadius: '12px', color: 'white' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>2</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Active Jobs</div>
        </div>
        <div style={{ flex: 1, background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #eee' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>17</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Applicants</div>
        </div>
      </div>

      {/* JOB LIST */}
      <div style={{ padding: '0 20px' }}>
        <h3 style={{ color: '#666', marginTop: '10px' }}>Recent Posts</h3>
        
        {myJobs.map((job) => (
          <div key={job.id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            borderLeft: job.status === 'Active' ? '5px solid #34A853' : '5px solid #ccc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{job.title}</h3>
              <span style={{ 
                background: job.status === 'Active' ? '#e8f5e9' : '#eee', 
                color: job.status === 'Active' ? '#2e7d32' : '#666',
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' 
              }}>
                {job.status}
              </span>
            </div>
            
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0 15px 0' }}>📍 {job.loc}</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#f1f8e9', color: '#2e7d32', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                {job.applicants} Applicants
              </button>
              <button style={{ padding: '10px 15px', background: '#eee', border: 'none', borderRadius: '8px' }}>⚙️</button>
            </div>
          </div>
        ))}
      </div>

      <ProviderBottomNav />
    </div>
  );
}