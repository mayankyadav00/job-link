'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, Briefcase } from 'lucide-react';

// --- IMPORTS ---
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';
import AIChatBot from '../../../components/AIChatBot';
import OnboardingForm from '../../../components/OnboardingForm'; // <--- ADDED

// --- SUPABASE SETUP ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProviderDashboard() {
  const router = useRouter();
  
  // 1. STATE
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false); // <--- ADDED

  // --- EFFECT: CHECK USER & PROFILE ---
  useEffect(() => {
    const initData = async () => {
      // A. Check Auth
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // B. Check Profile (Does the provider have a Business Name?)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If profile is missing OR business_name is empty, show the popup
      if (!profile || !profile.business_name) {
        setShowOnboarding(true);
      }

      // C. Fetch Jobs
      fetchJobs(user.id);
    };

    initData();
  }, []);

  const fetchJobs = async (userId) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('provider_id', userId) // Only show MY jobs
      .order('created_at', { ascending: false });

    if (data) setJobs(data);
    setLoading(false);
  };

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    
    if (error) {
      alert("Failed to delete");
    } else {
      // Remove from UI immediately so it feels fast
      setJobs(prev => prev.filter(job => job.id !== jobId));
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading Dashboard...</div>;

  return (
    <div style={{ paddingBottom: '90px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* --- 1. ONBOARDING POPUP (If Profile Incomplete) --- */}
      {showOnboarding && (
        <OnboardingForm 
          user={user} 
          role="provider" 
          onComplete={() => { setShowOnboarding(false); }} 
        />
      )}

      {/* --- 2. HEADER --- */}
      <div style={{ background: 'white', padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: '#1e293b' }}>Provider Panel</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Manage your active listings</p>
        </div>
        {/* Post Job Button */}
        <Link href="/provider/post">
          <button style={{ 
            width: '45px', height: '45px', borderRadius: '50%', 
            background: '#4285F4', color: 'white', border: 'none', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            boxShadow: '0 4px 10px rgba(66, 133, 244, 0.3)', cursor: 'pointer' 
          }}>
            <Plus size={24} />
          </button>
        </Link>
      </div>

      {/* --- 3. JOB LIST --- */}
      <div style={{ padding: '20px' }}>
        
        {/* Call to Action Card (If no jobs) */}
        {jobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1', marginTop: '20px' }}>
            <Briefcase size={40} color="#94a3b8" style={{ marginBottom: '10px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#334155' }}>No active jobs</h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Post a new job to find workers quickly.</p>
            <Link href="/provider/post" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '12px 24px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                Post Your First Job
              </button>
            </Link>
          </div>
        )}

        {/* Job Cards */}
        {jobs.map((job) => (
          <div key={job.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '15px', border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative' }}>
            
            {/* Title & Pay */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{job.title}</h3>
              <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {job.pay_rate}
              </span>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' }}>
               <span>📍 {job.location_name || 'Patna'}</span>
               <span>🕒 {job.job_type}</span>
            </div>

            {/* Actions */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Posted on {new Date(job.created_at).toLocaleDateString()}
              </span>
              
              <button 
                onClick={() => handleDelete(job.id)}
                style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* --- 4. GLOBAL COMPONENTS --- */}
      <AIChatBot />
      <ProviderBottomNav />
    </div>
  );
}
