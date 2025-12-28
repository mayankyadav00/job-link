'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ProviderBottomNav } from '../../../components/ProviderBottomNav';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Install: npm install @google/generative-ai

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    pay_rate: '',
    job_type: 'Daily Wage',
    location: 'Patna' // Default
  });

  // --- GEMINI AI MAGIC ---
  const handleAutoWrite = async () => {
    if (!form.title) return alert("Please enter a Job Title first!");
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return alert("Missing API Key! Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local");

    setAiLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Write a short, professional job description (max 40 words) for a "${form.title}" role in Patna. Keep it simple and inviting for daily workers.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setForm(prev => ({ ...prev, description: text }));
    } catch (error) {
      alert("AI Error: " + error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const { error } = await supabase.from('jobs').insert({
      provider_id: user.id,
      title: form.title,
      description: form.description,
      pay_rate: `₹${form.pay_rate}`, // Adding Symbol Logic
      job_type: form.job_type,
      location_name: form.location,
      status: 'open'
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Job Posted Successfully!");
      router.push('/provider/dashboard');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#333' }}>Post a New Job</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* TITLE */}
        <div>
          <label style={labelStyle}>Job Title</label>
          <input 
            type="text" 
            placeholder="e.g. Need Plumber Urgent" 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            style={inputStyle}
            required 
          />
        </div>

        {/* DESCRIPTION + AI BUTTON */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={labelStyle}>Description</label>
            <button 
              type="button" 
              onClick={handleAutoWrite}
              disabled={aiLoading}
              style={{ 
                background: 'linear-gradient(45deg, #6200ea, #b388ff)', 
                color: 'white', border: 'none', padding: '5px 12px', borderRadius: '15px', 
                fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' 
              }}
            >
              {aiLoading ? '✨ Thinking...' : '✨ Auto-Write'}
            </button>
          </div>
          <textarea 
            placeholder="Describe the work..." 
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            style={{ ...inputStyle, minHeight: '100px' }}
            required 
          />
        </div>

        {/* PAY RATE (WITH RUPEE SYMBOL) */}
        <div>
          <label style={labelStyle}>Pay Rate</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '15px', top: '13px', color: '#666', fontSize: '1.1rem' }}>₹</span>
            <input 
              type="number" 
              placeholder="500" 
              value={form.pay_rate}
              onChange={e => setForm({...form, pay_rate: e.target.value})}
              style={{ ...inputStyle, paddingLeft: '35px' }} // Space for symbol
              required 
            />
          </div>
        </div>

        {/* DETAILS ROW */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Type</label>
            <select 
              value={form.job_type}
              onChange={e => setForm({...form, job_type: e.target.value})}
              style={inputStyle}
            >
              <option>Daily Wage</option>
              <option>Contract</option>
              <option>Full-time</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Location</label>
            <input 
              type="text" 
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: '10px', padding: '15px', background: '#333', color: 'white', 
            border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' 
          }}
        >
          {loading ? 'Posting...' : 'Post Job Now'}
        </button>

      </form>
      <ProviderBottomNav />
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' };
