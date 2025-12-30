'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Save, Trash2, CheckCircle, XCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function JobManager() {
  const { id } = useParams();
  const router = useRouter();
  
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Fetch Job Info
    const { data: jobData } = await supabase.from('jobs').select('*').eq('id', id).single();
    setJob(jobData);

    // 2. Fetch Applicants (And their Profile Data)
    // Note: We use the relational query to get profile data inside the application
    const { data: appData, error } = await supabase
      .from('applications')
      .select(`
        *,
        profiles:seeker_id ( full_name, phone, skills, experience_years )
      `)
      .eq('job_id', id);

    if (appData) setApplications(appData);
    setLoading(false);
  };

  const updateJob = async () => {
    await supabase.from('jobs').update({
      title: job.title,
      pay_rate: job.pay_rate,
      status: job.status
    }).eq('id', id);
    alert("Job Updated!");
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
    // Refresh list locally
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', paddingBottom: '50px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #eee' }}>
        <button onClick={() => router.push('/provider/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft /></button>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Manage Job</h2>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* EDIT JOB SECTION */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Edit Details</h3>
          
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Job Title</label>
          <input 
            value={job.title} 
            onChange={e => setJob({...job, title: e.target.value})}
            style={inputStyle}
          />

          <label style={{ display: 'block', marginBottom: '5px', marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>Pay Rate</label>
          <input 
            value={job.pay_rate} 
            onChange={e => setJob({...job, pay_rate: e.target.value})}
            style={inputStyle}
          />

          <label style={{ display: 'block', marginBottom: '5px', marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>Status</label>
          <select 
            value={job.status} 
            onChange={e => setJob({...job, status: e.target.value})}
            style={inputStyle}
          >
            <option value="open">Open (Accepting)</option>
            <option value="closed">Closed</option>
          </select>

          <button onClick={updateJob} style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Save size={18} /> Update Job
          </button>
        </div>

        {/* APPLICANTS SECTION */}
        <h3 style={{ marginLeft: '5px' }}>Applicants ({applications.length})</h3>
        
        {applications.length === 0 ? (
          <p style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No one has applied yet.</p>
        ) : (
          applications.map(app => (
            <div key={app.id} style={{ background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '15px', borderLeft: `5px solid ${getStatusColor(app.status)}`, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{app.profiles?.full_name || 'Unknown User'}</h4>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>Skills: {app.profiles?.skills || 'N/A'}</p>
                </div>
                <a href={`tel:${app.profiles?.phone}`} style={{ padding: '8px', background: '#dcfce7', borderRadius: '50%', color: '#166534' }}>
                  <Phone size={18} />
                </a>
              </div>

              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: getStatusColor(app.status), textTransform: 'uppercase' }}>
                  {app.status}
                </span>

                {app.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => updateApplicationStatus(app.id, 'rejected')} style={{ padding: '8px 12px', border: '1px solid #ef4444', background: 'white', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>Reject</button>
                    <button onClick={() => updateApplicationStatus(app.id, 'accepted')} style={{ padding: '8px 12px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Accept</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' };

function getStatusColor(status) {
  if (status === 'accepted') return '#22c55e'; // Green
  if (status === 'rejected') return '#ef4444'; // Red
  return '#f59e0b'; // Orange (Pending)
}
