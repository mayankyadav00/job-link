'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Phone, FileText, Check, X as XIcon, Trash2 } from 'lucide-react'; // Icons

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProviderDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myJobs, setMyJobs] = useState([]);
  
  // State for the "Post Job" form
  const [jobForm, setJobForm] = useState({ title: '', description: '', pay_rate: '', job_type: 'Daily Wage' });
  const [posting, setPosting] = useState(false);

  // State for viewing applicants
  const [applicants, setApplicants] = useState({}); // Stores applicants by Job ID
  const [expandedJobId, setExpandedJobId] = useState(null); // Which job's applicants are open?

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        fetchMyJobs(user.id);
      }
    };
    init();
  }, []);

  const fetchMyJobs = async (userId) => {
    const { data } = await supabase
      .from('jobs')
      .select('*, applications(count)') // Get job + count of applicants
      .eq('provider_id', userId)
      .order('created_at', { ascending: false });
    if (data) setMyJobs(data);
    setLoading(false);
  };

  // --- NEW: Fetch Applicants for a specific job ---
  const fetchApplicants = async (jobId) => {
    // Toggle close if already open
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }

    const { data } = await supabase
      .from('applications')
      .select('*, seekers(full_name, phone, resume_url, academic_qualifications)')
      .eq('job_id', jobId);

    if (data) {
      setApplicants(prev => ({ ...prev, [jobId]: data }));
      setExpandedJobId(jobId);
    }
  };

  // --- NEW: Hire or Reject Action ---
  const handleStatusUpdate = async (appId, newStatus, jobId) => {
    await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
    // Refresh the list locally
    fetchApplicants(jobId); 
    alert(`Applicant ${newStatus}!`);
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.pay_rate) return alert("Please fill details");
    setPosting(true);
    
    try {
      const { error } = await supabase.from('jobs').insert({
        provider_id: user.id,
        ...jobForm,
        location_name: "Patna (Default)", 
        status: 'open'
      });
      if (error) throw error;
      
      alert("Job Posted!");
      setJobForm({ title: '', description: '', pay_rate: '', job_type: 'Daily Wage' });
      fetchMyJobs(user.id);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if(!confirm("Delete this job?")) return;
    await supabase.from('jobs').delete().eq('id', jobId);
    fetchMyJobs(user.id);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Provider Dashboard</h1>
        <p style={{ color: '#666' }}>Manage your jobs and hire talent.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        
        {/* LEFT: Post Job Form */}
        <div style={{ background: '#f9fafb', padding: '25px', borderRadius: '15px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>📢 Post New Job</h2>
          <form onSubmit={handlePostJob} style={{ display: 'grid', gap: '15px' }}>
            <input 
              placeholder="Job Title (e.g. Need Plumber)" 
              value={jobForm.title} 
              onChange={e => setJobForm({...jobForm, title: e.target.value})}
              style={inputStyle} 
            />
            <textarea 
              placeholder="Job Description..." 
              value={jobForm.description} 
              onChange={e => setJobForm({...jobForm, description: e.target.value})}
              style={{ ...inputStyle, minHeight: '80px' }} 
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                placeholder="Pay (e.g. 500/day)" 
                value={jobForm.pay_rate} 
                onChange={e => setJobForm({...jobForm, pay_rate: e.target.value})}
                style={inputStyle} 
              />
              <select 
                value={jobForm.job_type} 
                onChange={e => setJobForm({...jobForm, job_type: e.target.value})}
                style={inputStyle}
              >
                <option>Daily Wage</option>
                <option>Contract</option>
                <option>Part-time</option>
                <option>Full-time</option>
              </select>
            </div>
            <button type="submit" disabled={posting} style={buttonStyle}>
              {posting ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </div>

        {/* RIGHT: Active Jobs List */}
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Your Active Jobs ({myJobs.length})</h2>
          
          {myJobs.length === 0 ? <p style={{ color: '#888' }}>No active jobs. Post one to get started.</p> : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {myJobs.map(job => (
              <div key={job.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
                
                {/* Job Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>{job.title}</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{job.pay_rate} • {job.job_type}</p>
                  </div>
                  <button onClick={() => handleDeleteJob(job.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Job Footer & Actions */}
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', color: job.applications[0].count > 0 ? '#16a34a' : '#888', fontWeight: 'bold' }}>
                    {job.applications[0].count} Applicants
                  </span>
                  
                  <button 
                    onClick={() => fetchApplicants(job.id)}
                    style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Users size={16} /> 
                    {expandedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
                  </button>
                </div>

                {/* --- APPLICANT LIST (Collapsible) --- */}
                {expandedJobId === job.id && (
                  <div style={{ marginTop: '15px', background: '#f8fafc', padding: '15px', borderRadius: '10px' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: '#475569' }}>Applicants for this job:</h4>
                    
                    {(!applicants[job.id] || applicants[job.id].length === 0) ? (
                      <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>No applications yet.</p>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {applicants[job.id].map(app => (
                          <div key={app.id} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            
                            {/* Applicant Details */}
                            <div>
                              <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>{app.seekers.full_name}</p>
                              <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Phone size={12} /> {app.seekers.phone}
                                </span>
                                {app.seekers.resume_url && (
                                  <a href={app.seekers.resume_url} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', textDecoration: 'none' }}>
                                    <FileText size={12} /> Resume
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Status Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {app.status === 'pending' && (
                                <>
                                  <button onClick={() => handleStatusUpdate(app.id, 'accepted', job.id)} title="Hire" style={{ ...actionBtnStyle, background: '#dcfce7', color: '#166534' }}><Check size={16} /></button>
                                  <button onClick={() => handleStatusUpdate(app.id, 'rejected', job.id)} title="Reject" style={{ ...actionBtnStyle, background: '#fee2e2', color: '#991b1b' }}><XIcon size={16} /></button>
                                </>
                              )}
                              {app.status === 'accepted' && <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.9rem' }}>Hired!</span>}
                              {app.status === 'rejected' && <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '0.9rem' }}>Rejected</span>}
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* End Applicant List */}

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Styles
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' };
const buttonStyle = { width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const actionBtnStyle = { border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
