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
    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);

    // 2. Check if they have a profile in 'seekers' table
    const { data: profileData } = await supabase
      .from('seekers')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      fetchJobs(); // Load jobs if profile exists
    } else {
      setLoading(false); // Stop loading, show form
    }
  };

  const fetchJobs = async () => {
    // Fetch the Mock Data jobs we added earlier
    const { data, error } = await supabase.from('jobs').select('*');
    if (data) setJobs(data);
    setLoading(false);
  };

  const handleFileUpload = async (file, bucket) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;

    // Get Public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let resumeUrl = null;
      let avatarUrl = null;

      // Upload Files if selected
      if (resumeFile) resumeUrl = await handleFileUpload(resumeFile, 'resumes');
      if (avatarFile) avatarUrl = await handleFileUpload(avatarFile, 'avatars');

      // Convert skills string "React, Node" to Array ["React", "Node"]
      const skillsArray = formData.skills.split(',').map(s => s.trim());

      // Insert into Database
      const { error } = await supabase.from('seekers').insert({
        id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        academic_qualifications: formData.qualifications,
        skills: skillsArray,
        resume_url: resumeUrl,
        profile_pic_url: avatarUrl
      });

      if (error) throw error;

      alert("Profile Created!");
      window.location.reload(); // Reload to show dashboard

    } catch (error) {
      alert("Error creating profile: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading your workspace...</div>;

  // --- VIEW 1: ONBOARDING FORM (If no profile) ---
  if (!profile) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Complete Your Profile</h2>
        <form onSubmit={handleSubmitProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input type="text" placeholder="Full Name" required 
            value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          
          <input type="tel" placeholder="Phone Number" required 
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />

          <textarea placeholder="Your Address (for local matching)" required 
            value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />

          <input type="text" placeholder="Academic Qualifications (e.g., 10th Pass, B.Tech)" required 
            value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />

          <input type="text" placeholder="Skills (comma separated, e.g., Painting, Driving, Java)" required 
            value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Upload Resume (PDF/Doc)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Profile Picture</label>
            <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} />
          </div>

          <button type="submit" disabled={uploading} style={{ padding: '15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            {uploading ? 'Saving Profile...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    );
  }

  // --- VIEW 2: JOB DASHBOARD (If profile exists) ---
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Find Work</h1>
          <p style={{ color: '#666' }}>Welcome back, {profile.full_name}</p>
        </div>
        {profile.profile_pic_url && (
          <img src={profile.profile_pic_url} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
        )}
      </header>

      {/* JOB FEED */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {jobs.map((job) => (
          <div key={job.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>{job.title}</h3>
            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{job.job_type}</span>
            <p style={{ color: '#555', fontSize: '0.9rem', margin: '10px 0' }}>{job.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888' }}>
              <span>📍 {job.location_name}</span>
              <span style={{ color: '#16a34a', fontWeight: 'bold' }}>💰 {job.pay_rate}</span>
            </div>
            <button style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
