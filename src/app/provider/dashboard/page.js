'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';
import OnboardingForm from '../../../components/OnboardingForm'; // Import New Component

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false); // State for popup

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    // 1. Get Auth User
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) { router.push('/login'); return; }
    setUser(user);

    // 2. CHECK PROFILE (The Magic Step)
    const { data: profile } = await supabase.from('profiles').select('business_name').eq('id', user.id).single();
    
    // If profile missing OR business_name is empty -> Show Form
    if (!profile || !profile.business_name) {
      setShowOnboarding(true);
    }

    // 3. Fetch Jobs
    fetchJobs(user.id);
  };

  const fetchJobs = async (userId) => {
    // Note: We use provider_id (which is now linked to profiles)
    const { data } = await supabase.from('jobs').select('*').eq('provider_id', userId);
    if (data) setJobs(data);
  };

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from('jobs').delete().eq('id', jobId);
    fetchJobs(user?.id);
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* SHOW ONBOARDING IF NEEDED */}
      {showOnboarding && (
        <OnboardingForm 
          user={user} 
          role="provider" 
          onComplete={() => { setShowOnboarding(false); checkUser(); }} 
        />
      )}

      <h1 style={{ fontSize: '1.8rem' }}>Provider Dashboard</h1>
      
      {/* ... (Keep your existing Job Card UI here) ... */}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#666' }}>Your Posted Jobs</h2>
        {jobs.length === 0 ? <p>No active jobs.</p> : jobs.map(job => (
             <div key={job.id} style={{ padding: '15px', background: 'white', margin: '10px 0', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
               <h3>{job.title}</h3>
               <p>{job.pay_rate}</p>
               <button onClick={() => handleDelete(job.id)} style={{ color: 'red', background: 'none', border: 'none' }}>Delete</button>
             </div>
        ))}
      </div>

      <ProviderBottomNav />
    </div>
  );
}
