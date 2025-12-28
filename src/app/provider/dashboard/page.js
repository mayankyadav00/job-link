'use client';
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Phone, FileText, Check, X } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProviderDashboard() {
  
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, totalApplicants: 0 });
  
  // State to manage which job card is expanded to show applicants
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applicants, setApplicants] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Jobs + Applicant Counts
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (jobs) {
        setMyJobs(jobs);
        
        // 2. Calculate Stats
        const activeCount = jobs.filter(j => j.status === 'open').length;
        const totalApps = jobs.reduce((sum, job) => sum + (job.applications[0]?.count || 0), 0);
        setStats({ active: activeCount, totalApplicants: totalApps });
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Fetch Applicants when clicking the button
  const handleViewApplicants = async (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null); // Close if already open
      return;
    }

    const { data } = await supabase
      .from('applications')
      .select('*, seekers(full_name, phone, resume_url)')
      .eq('job_id', jobId);

    if (data) {
      setApplicants(prev => ({ ...prev, [jobId]: data }));
      setExpandedJobId(jobId);
    }
  };

  // Hire/Reject Logic
  const updateStatus = async (appId, status, jobId) => {
    await supabase.from('applications').update({ status }).eq('id', appId);
    handleViewApplicants(jobId); // Refresh list
    alert(`Applicant ${status}!`);
  };

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
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '-' : stats.active}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Active Jobs</div>
        </div>
        <div style={{ flex: 1, background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #eee' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{loading ? '-' : stats.totalApplicants}</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Applicants</div>
        </div>
      </div>

      {/* JOB LIST */}
      <div style={{ padding: '0 20px' }}>
        <h3 style={{ color: '#666', marginTop: '10px' }}>Recent Posts</h3>
        
        {loading ? <p>Loading jobs...</p> : myJobs.length === 0 ? <p style={{color:'#999'}}>No jobs posted yet.</p> : null}

        {myJobs.map((job) => (
          <div key={job.id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            borderLeft: job.status === 'open' ? '5px solid #34A853' : '5px solid #ccc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{job.title}</h3>
              <span style={{ 
                background: job.status === 'open' ? '#e8f5e9' : '#eee', 
                color: job.status === 'open' ? '#2e7d32' : '#666',
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'capitalize' 
              }}>
                {job.status}
              </span>
            </div>
            
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0 15px 0' }}>📍 {job.location_name}</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleViewApplicants(job.id)}
                style={{ flex: 1, padding: '10px', background: '#f1f8e9', color: '#2e7d32', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {job.applications[0].count} Applicants {expandedJobId === job.id ? '▲' : '▼'}
              </button>
              <button style={{ padding: '10px 15px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>⚙️</button>
            </div>

            {/* EXPANDED APPLICANT LIST (Inserts cleanly into your existing card) */}
            {expandedJobId === job.id && (
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                {applicants[job.id]?.length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>No applicants yet.</p>
                ) : (
                  applicants[job.id]?.map(app => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{app.seekers.full_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{app.seekers.phone}</div>
                        {app.seekers.resume_url && (
                          <a href={app.seekers.resume_url} target="_blank" style={{ fontSize: '0.8rem', color: '#34A853' }}>View Resume</a>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {app.status === 'pending' ? (
                          <>
                            <button onClick={() => updateStatus(app.id, 'accepted', job.id)} style={{ background: '#dcfce7', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', color: 'green' }}>✓</button>
                            <button onClick={() => updateStatus(app.id, 'rejected', job.id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', color: 'red' }}>✕</button>
                          </>
                        ) : (
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: app.status === 'accepted' ? 'green' : 'red' }}>{app.status}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <ProviderBottomNav />
    </div>
  );
}
