'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SeekerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    qualifications: '',
    skills: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);

    // Check if profile exists
    const { data: profileData } = await supabase
      .from('seekers')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      fetchJobs();
    } else {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    const { data } = await supabase.from('jobs').select('*');
    if (data) setJobs(data);
    setLoading(false);
  };

  const handleFileUpload = async (file, bucket) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let resumeUrl = null;
      let avatarUrl = null;

      if (resumeFile) resumeUrl = await handleFileUpload(resumeFile, 'resumes');
      if (avatarFile) avatarUrl = await handleFileUpload(avatarFile, 'avatars');

      const skillsArray = formData.skills.split(',').map(s => s.trim());

      const newProfile = {
        id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        academic_qualifications: formData.qualifications,
        skills: skillsArray,
        resume_url: resumeUrl,
        profile_pic_url: avatarUrl
      };

      const { error } = await supabase.from('seekers').insert(newProfile);

      if (error) throw error;

      // SUCCESS: Update state immediately (No reload needed)
      setProfile(newProfile);
      fetchJobs();

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner"></div>
      <style jsx>{`
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  // --- VIEW 1: BEAUTIFUL ONBOARDING FORM ---
  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'white', maxWidth: '700px', width: '100%', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Complete Your Profile</h1>
            <p style={{ color: '#64748b' }}>Tell us about yourself so we can find the best jobs for you.</p>
          </div>

          <form onSubmit={handleSubmitProfile} style={{ display: 'grid', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" required style={inputStyle} placeholder="Rahul Kumar"
                  value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" required style={inputStyle} placeholder="98765 43210"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Current Address</label>
              <input type="text" required style={inputStyle} placeholder="e.g. Kankarbagh, Patna"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div>
              <label style={labelStyle}>Academic Qualifications</label>
              <input type="text" required style={inputStyle} placeholder="e.g. 10th Pass, B.A. History"
                value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})} />
            </div>

            <div>
              <label style={labelStyle}>Skills (Keywords)</label>
              <input type="text" required style={inputStyle} placeholder="Cooking, Driving, Python, Accounting"
                value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
            </div>

            <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '8px', marginTop: '10px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{...labelStyle, marginBottom: '8px'}}>Upload Resume (Optional)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} style={{ display: 'block', width: '100%', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{...labelStyle, marginBottom: '8px'}}>Profile Picture</label>
                <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} style={{ display: 'block', width: '100%', fontSize: '0.9rem' }} />
              </div>
            </div>

            <button type="submit" disabled={uploading} 
              style={{ 
                marginTop: '10px', padding: '16px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', 
                color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', 
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' 
              }}>
              {uploading ? 'Creating Profile...' : 'Save Profile & Continue →'}
            </button>

          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD (Now uses cleaner layout) ---
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <header style={{ background: 'white', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>Job Feed</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Welcome back, <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{profile.full_name}</span></p>
          </div>
          {profile.profile_pic_url ? (
            <img src={profile.profile_pic_url} alt="Profile" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid #e2e8f0', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
              {profile.full_name.charAt(0)}
            </div>
          )}
        </header>

        {/* JOBS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {jobs.length === 0 ? (
            <p style={{ color: '#666', gridColumn: '1/-1', textAlign: 'center' }}>No jobs found nearby.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #f1f5f9', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1e293b', margin: 0 }}>{job.title}</h3>
                  <span style={{ background: '#ecf9f1', color: '#15803d', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>
                    {job.job_type}
                  </span>
                </div>
                
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px', minHeight: '40px' }}>
                  {job.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>📍 {job.location_name}</span>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' }}>₹{job.pay_rate}</span>
                  <button style={{ padding: '10px 20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    Apply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

// Consistent Styles
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' };
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' };
