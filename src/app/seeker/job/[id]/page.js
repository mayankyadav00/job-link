'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, DollarSign, CheckCircle, Briefcase } from 'lucide-react';
import { BottomNav } from '../../../../components/BottomNav';
import JobMap from '../../../../components/JobMap'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function JobDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    console.log("🔍 Fetching details for Job ID:", id);

    // 1. Get Job Info
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

    // 2. Check if User already applied
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: appData } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', id)
        .eq('seeker_id', user.id)
        .maybeSingle(); 
      
      if (appData) setHasApplied(true);
    }
    setLoading(false);
  };

  const handleApply = async () => {
    setApplying(true);
    
    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    // 2. Safety Check: Does Profile Exist?
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        alert("Please complete your Profile (Name & Skills) before applying!");
        router.push('/seeker/profile'); // Redirect to profile to fix it
        return;
    }

    // 3. Insert Application
    const { error } = await supabase.from('applications').insert({
      job_id: id,
      seeker_id: user.id, 
      status: 'pending'
    });

    if (error) {
      if (error.code === '23505') { 
          setHasApplied(true);
          alert("You have already applied to this job.");
      } else {
          alert("Failed to apply: " + error.message);
      }
    } else {
      setHasApplied(true);
      alert("Application Sent Successfully! 🎉");
    }
    setApplying(false);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Job Details...</div>;
  if (!job) return null;

  return (
    <div style={{ paddingBottom: '90px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* HEADER */}
      <div style={{ background: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/seeker/dashboard" style={{ color: '#334155' }}>
          <ArrowLeft size={24} />
        </Link>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Job Details</h2>
      </div>

      {/* JOB CONTENT */}
      <div style={{ padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: '#0f172a' }}>{job.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#64748b' }}>
             <MapPin size={18} /> {job.location_name || 'Patna'}
          </div>

          {/* MAP */}
          {(job.latitude && job.longitude) ? (
            <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
               <JobMap jobs={[job]} />
            </div>
          ) : (
            <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '12px', marginBottom: '25px', color: '#666', textAlign: 'center' }}>
               Map location not available.
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 25px 0' }} />

          {/* DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={detailBoxStyle}>
               <DollarSign size={20} color="#059669" />
               <div><span style={labelStyle}>Pay Rate</span><div style={valueStyle}>{job.pay_rate}</div></div>
            </div>
            <div style={detailBoxStyle}>
               <Clock size={20} color="#2563eb" />
               <div><span style={labelStyle}>Job Type</span><div style={valueStyle}>{job.job_type}</div></div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Description</h3>
          <p style={{ color: '#475569', lineHeight: '1.6' }}>{job.description || "No description provided."}</p>

        </div>
      </div>

      {/* APPLY BUTTON */}
      <div style={{ position: 'fixed', bottom: '80px', left: 0, width: '100%', padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
        {hasApplied ? (
          <button disabled style={{ width: '100%', maxWidth: '400px', padding: '16px', borderRadius: '12px', border: 'none', background: '#dcfce7', color: '#166534', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <CheckCircle size={20} /> Applied
          </button>
        ) : (
          <button onClick={handleApply} disabled={applying} style={{ width: '100%', maxWidth: '400px', padding: '16px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: applying ? 0.7 : 1 }}>
            {applying ? 'Sending...' : 'Apply Now'}
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

const detailBoxStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#f8fafc', borderRadius: '12px' };
const labelStyle = { display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' };
const valueStyle = { fontWeight: 'bold', color: '#334155' };
