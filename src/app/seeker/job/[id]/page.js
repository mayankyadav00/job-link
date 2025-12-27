'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, MapPin, Clock, DollarSign, Briefcase, CheckCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function JobDetailsPage({ params }) {
  // Unwrap params (Next.js 15+ requirement)
  const { id } = use(params);
  
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get User
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // 2. Fetch Job Details
      const { data: jobData, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        alert("Job not found!");
        router.push('/seeker/dashboard');
        return;
      }
      setJob(jobData);

      // 3. Check if already applied
      if (user) {
        const { data: appData } = await supabase
          .from('applications')
          .select('*')
          .eq('job_id', id)
          .eq('seeker_id', user.id)
          .single();
        
        if (appData) setHasApplied(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const handleApply = async () => {
    if (!user) return router.push('/login');
    setApplying(true);

    try {
      const { error } = await supabase.from('applications').insert({
        job_id: id,
        seeker_id: user.id
      });

      if (error) throw error;
      
      setHasApplied(true);
      alert("Application Sent! The provider will contact you.");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading job details...</div>;
  if (!job) return null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* HEADER */}
      <div style={{ background: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #eee' }}>
        <Link href="/seeker/dashboard">
          <ArrowLeft size={24} color="#333" />
        </Link>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Job Details</h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* MAIN CARD */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
            {job.job_type}
          </span>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>{job.title}</h2>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#64748b', marginBottom: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} /> {job.location_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={18} /> {new Date(job.created_at).toLocaleDateString()}</div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '20px 0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
              <DollarSign size={28} />
              {job.pay_rate}
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>Description</h3>
          <p style={{ lineHeight: '1.6', color: '#475569', fontSize: '1rem' }}>
            {job.description}
          </p>
        </div>

        {/* APPLY BUTTON (Fixed at bottom on mobile, or inline on desktop) */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'white', padding: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'center' }}>
          {hasApplied ? (
            <button disabled style={{ width: '100%', maxWidth: '500px', padding: '16px', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <CheckCircle size={24} />
              Application Sent
            </button>
          ) : (
            <button 
              onClick={handleApply}
              disabled={applying}
              style={{ width: '100%', maxWidth: '500px', padding: '16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
            >
              {applying ? 'Sending...' : 'Apply Now'}
            </button>
          )}
        </div>

      </div>
      <div style={{ height: '80px' }}></div> {/* Spacer for fixed button */}
    </div>
  );
}
