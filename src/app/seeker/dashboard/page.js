'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, Search, Briefcase, CheckCircle, XCircle, Clock3 } from 'lucide-react';

import { BottomNav } from '../../../components/BottomNav';
import AIChatBot from '../../../components/AIChatBot';
import OnboardingForm from '../../../components/OnboardingForm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- PART 1: THE MAIN LOGIC COMPONENT ---
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // This causes the pre-render error if not suspended
  
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('find'); 
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Check URL for ?view=applied
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'applied') {
      setActiveTab('applied');
    }
  }, [searchParams]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) { router.push('/login'); return; }
    setUser(user);

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile || !profile.full_name) setShowOnboarding(true);

    fetchJobs();
    fetchMyApplications(user.id);
  };

  const fetchJobs = async () => {
    let query = supabase.from('jobs').select('*').eq('status', 'open').order('created_at', { ascending: false });
    if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);
    const { data } = await query;
    if (data) setJobs(data);
    setLoading(false);
  };

  const fetchMyApplications = async (userId) => {
    const uid = userId || user?.id;
    if (!uid) return;

    const { data } = await supabase
      .from('applications')
      .select(`*, job:jobs ( title, pay_rate, location_name, provider_id )`)
      .eq('seeker_id', uid)
      .order('created_at', { ascending: false });

    if (data) setApplications(data);
  };

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'applied') fetchMyApplications(user.id);
  };

  const getStatusBadge = (status) => {
    if (status === 'accepted') return <span style={{ ...badgeStyle, background: '#dcfce7', color: '#166534' }}><CheckCircle size={14} /> Accepted</span>;
    if (status === 'rejected') return <span style={{ ...badgeStyle, background: '#fee2e2', color: '#ef4444' }}><XCircle size={14} /> Rejected</span>;
    return <span style={{ ...badgeStyle, background: '#ffedd5', color: '#c2410c' }}><Clock3 size={14} /> Pending</span>;
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ paddingBottom: '90px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      {showOnboarding && <OnboardingForm user={user} role="seeker" onComplete={() => setShowOnboarding(false)} />}

      {/* HEADER */}
      <div style={{ background: 'white', padding: '20px 20px 10px 20px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1e293b' }}>JobLink</h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Find work nearby</p>
        
        {/* TABS */}
        <div style={{ display: 'flex', marginTop: '20px', background: '#f1f5f9', padding: '5px', borderRadius: '12px' }}>
          <button onClick={() => handleTabSwitch('find')} style={{ ...tabStyle, background: activeTab === 'find' ? 'white' : 'transparent', color: activeTab === 'find' ? '#0f172a' : '#64748b', boxShadow: activeTab === 'find' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}>Find Jobs</button>
          <button onClick={() => handleTabSwitch('applied')} style={{ ...tabStyle, background: activeTab === 'applied' ? 'white' : 'transparent', color: activeTab === 'applied' ? '#0f172a' : '#64748b', boxShadow: activeTab === 'applied' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}>
            My Applications {applications.length > 0 && `(${applications.length})`}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {activeTab === 'find' && (
          <>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Search size={20} style={{ position: 'absolute', left: '15px', top: '12px', color: '#94a3b8' }} />
              <input placeholder="Search (e.g. Driver, Cook)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && fetchJobs()} style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} />
            </div>
            {jobs.map(job => (
              <Link href={`/seeker/job/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                <div style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>{job.title}</h3>
                    <span style={{ fontWeight: 'bold', color: '#166534', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>{job.pay_rate}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.9rem', marginTop: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {job.location_name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {job.job_type}</span>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {activeTab === 'applied' && (
          <>
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <Briefcase size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p>You haven't applied to any jobs yet.</p>
              </div>
            ) : (
              applications.map(app => (
                <div key={app.id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>{app.job?.title || 'Job Deleted'}</h3>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{app.job?.location_name}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  {app.status === 'accepted' && (
                    <div style={{ marginTop: '15px', padding: '10px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.9rem', color: '#15803d' }}>
                      🎉 <b>Congratulations!</b> The provider has accepted your application.
                    </div>
                  )}
                  {app.status === 'rejected' && (
                    <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#94a3b8' }}>
                      Application closed.
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>

      <AIChatBot />
      <BottomNav />
    </div>
  );
}

// --- PART 2: THE SUSPENSE WRAPPER (Fixes Prerender Error) ---
export default function SeekerDashboard() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

const tabStyle = { flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' };
const cardStyle = { background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const badgeStyle = { display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' };

