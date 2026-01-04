'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Save, Trash2, CheckCircle, XCircle, Briefcase } from 'lucide-react';

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
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    console.log("Fetching Manager Data for Job:", id);

    // 1. Fetch Job Info
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (jobError) {
      console.error("Job Error:", jobError);
      return;
    }
    setJob(jobData);

    // 2. Fetch Applicants (THE IMPORTANT FIX)
    // We fetch the application AND the seeker's profile data in one go.
    // Note: We use 'profiles!seeker_id' or just 'profiles' depending on your FK setup.
    // This query is the safest version:
    const { data: appData, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        seeker:profiles!seeker_id ( full_name, phone, skills, address ) 
      `)
      .eq('job_id', id);

    if (appError) {
      console.error("Fetch Apps Error:", appError);
    } else {
      console.log("Applicants Loaded:", appData);
      setApplications(appData || []);
    }
    setLoading(false);
  };

  const updateJob = async () => {
    const { error } = await supabase.from('jobs').update({
      title: job.title,
      pay_rate: job.pay_rate,
      status: job.status
    }).eq('id', id);

    if (error) alert("Error updating: " + error.message);
    else alert("Job Details Updated!");
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    // 1. Optimistic Update (Change UI instantly)
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));

    // 2. Send to DB
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId);

    if (error) {
      console.error("Status Update Failed:", error);
      alert("Failed to update status");
      // Revert if failed (optional, but good practice)
      fetchData(); 
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Manager...</div>;
  if (!job) return <div style={{ padding: '40px' }}>Job not found.</div>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', paddingBottom: '50px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #eee' }}>
        <button onClick={() => router.push('/provider/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft /></button>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Manage Job</h2>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* --- SECTION 1: EDIT JOB DETAILS --- */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
          <h3 style={{ marginTop: 0, color: '#334155' }}>Job Settings</h3>
          
          <label style={labelStyle}>Job Title</label>
          <input 
            value={job.title} 
            onChange={e => setJob({...job, title: e.target.value})}
            style={inputStyle}
          />

          <label style={{ ...labelStyle, marginTop: '15px' }}>Pay Rate</label>
          <input 
            value={job.pay_rate} 
            onChange={e => setJob({...job, pay_rate: e.target.value})}
            style={inputStyle}
          />

          <label style={{ ...labelStyle, marginTop: '15px' }}>Status</label>
          <select 
            value={job.status} 
            onChange={e => setJob({...job, status: e.target.value})}
            style={inputStyle}
          >
            <option value="open">Open (Accepting)</option>
            <option value="closed">Closed (Hidden)</option>
          </select>

          <button onClick={updateJob} style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Save size={18} /> Save Changes
          </button>
        </div>

        {/* --- SECTION 2: APPLICANTS LIST --- */}
        <h3 style={{ marginLeft: '5px', color: '#334155', display:'flex', justifyContent:'space-between' }}>
          Applicants 
          <span style={{background:'#e2e8f0', padding:'2px 8px', borderRadius:'10px', fontSize:'0.9rem'}}>{applications.length}</span>
        </h3>
        
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <p>No applications yet.</p>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} style={{ 
              background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '15px', 
              borderLeft: `5px solid ${getStatusColor(app.status)}`, 
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
            }}>
              
              {/* Applicant Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                    {app.seeker?.full_name || 'Unknown User'}
                  </h4>
                  <p style={{ margin: '5px 0', color: '#64748b', fontSize: '0.9rem', display:'flex', alignItems:'center', gap:'5px' }}>
                    <Briefcase size={14} /> {app.seeker?.skills || 'No skills listed'}
                  </p>
                </div>
                {/* Call Button (Only if accepted or pending) */}
                {app.seeker?.phone && (
                  <a href={`tel:${app.seeker.phone}`} style={{ padding: '10px', background: '#dcfce7', borderRadius: '50%', color: '#166534', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Phone size={20} />
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: getStatusColor(app.status), textTransform: 'uppercase' }}>
                  Status: {app.status}
                </span>

                {app.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => updateApplicationStatus(app.id, 'rejected')} style={{ padding: '8px 12px', border: '1px solid #ef4444', background: 'white', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight:'bold' }}>Reject</button>
                    <button onClick={() => updateApplicationStatus(app.id, 'accepted')} style={{ padding: '8px 12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight:'bold' }}>Accept</button>
                  </div>
                )}
                
                {app.status === 'accepted' && (
                   <div style={{color:'#166534', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>
                      <CheckCircle size={16} /> Hired
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

// Helper Styles & Functions
const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#64748b', fontWeight:'bold' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline:'none' };

function getStatusColor(status) {
  if (status === 'accepted') return '#22c55e'; // Green
  if (status === 'rejected') return '#ef4444'; // Red
  return '#f59e0b'; // Orange (Pending)
}
