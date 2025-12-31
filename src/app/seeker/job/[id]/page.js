'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { BottomNav } from '../../../../components/BottomNav';

const JobMap = dynamic(
  () => import('../../../../components/JobMap'),
  { ssr: false }
);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Supabase env variables missing');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function JobDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    const { data: jobData, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      router.push('/seeker/dashboard');
      return;
    }

    setJob(jobData);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('seeker_id', user.id)
        .maybeSingle();

      if (data) setHasApplied(true);
    }

    setLoading(false);
  };

  const handleApply = async () => {
    setApplying(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('applications').insert({
      job_id: id,
      seeker_id: user.id,
      status: 'pending',
    });

    if (!error) setHasApplied(true);
    setApplying(false);
  };

  if (loading) return null;
  if (!job) return null;

  return (
    <div style={{ paddingBottom: '90px' }}>
      <Link href="/seeker/dashboard">
        <ArrowLeft />
      </Link>

      <h1>{job.title}</h1>

      <div style={{ height: 180 }}>
        <JobMap jobs={[job]} />
      </div>

      <p>{job.description}</p>

      {hasApplied ? (
        <button disabled>
          <CheckCircle /> Applied
        </button>
      ) : (
        <button onClick={handleApply} disabled={applying}>
          Apply
        </button>
      )}

      <BottomNav />
    </div>
  );
}
