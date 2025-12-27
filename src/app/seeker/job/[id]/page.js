// src/app/seeker/job/[id]/page.js
'use client'; // This is required because we use 'useParams'

import Navbar from '@/components/Navbar';
import { useParams } from 'next/navigation'; // Hook to read the [id] from URL
import Link from 'next/link';

// 1. Same Mock Data as before (In a real app, we fetch this from Database)
const allJobs = [
  {
    id: 2,
    title: "React JS Developer",
    location: "Remote",
    pay: "₹25,000 / month",
    description: "We are looking for a beginner React developer to help build a dashboard. Must know JavaScript and CSS.",
    requirements: ["React.js", "HTML/CSS", "Git"],
    isUrgent: false
  },
  {
    id: 1,
    title: "Dishwasher Needed",
    location: "Sharma Dhaba, Patna (2km away)",
    pay: "₹400 / day",
    description: "Urgent requirement for a dishwasher for 3 days. Morning shift only. Cash payment daily.",
    requirements: ["Hardworking", "Punctual"],
    isUrgent: true
  },
  {
    id: 3,
    title: "Data Entry Operator",
    location: "Civil Lines, Office No. 4",
    pay: "₹8,000 / project",
    description: "Digitize 500 pages of handwritten notes into Excel. Accuracy is key.",
    requirements: ["Typing Speed 40wpm", "Excel"],
    isUrgent: false
  },
  {
    id: 4,
    title: "Plumber for Urgent Repair",
    location: "Kankarbagh Colony",
    pay: "Negotiable",
    description: "Leakage in main water tank. Need immediate repair.",
    requirements: ["Plumbing Tools", "Experience"],
    isUrgent: true
  },
  {
    id: 5,
    title: "Shop Staff",
    location: "Ashok Rajpath",
    pay: "Negotiable",
    description: "Need a skilled staff for grocery store for two days.",
    requirements: ["Communication", "Packing skill", "Avioding skill for  negotation"],
    isUrgent: true
  }
];

export default function JobDetailsPage() {
  const params = useParams(); // Get the ID from the URL
  const jobId = parseInt(params.id); // Convert "1" (string) to 1 (number)

  // Find the specific job from our list
  const job = allJobs.find(j => j.id === jobId);

  // If job not found (e.g. user types random ID)
  if (!job) {
    return <div style={{ padding: 50, textAlign: 'center' }}>Job not found!</div>;
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Navbar />

      <main className="job-details-container">
        
        {/* Header */}
        <div className="details-header">
           {/* Back Button */}
           <Link href="/seeker/dashboard" style={{ textDecoration: 'none', color: '#666', marginBottom: '10px', display: 'block' }}>
            ← Back to Jobs
          </Link>
          
          <h1 className="big-title">{job.title}</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>📍 {job.location}</p>
          <span className="pay-badge">{job.pay}</span>
        </div>

        {/* Description */}
        <div>
          <h3 className="section-title">Job Description</h3>
          <p className="description-text">{job.description}</p>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="section-title">Requirements</h3>
          <ul style={{ paddingLeft: '20px', color: '#555' }}>
            {job.requirements.map((req, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Google Map Placeholder (We will hook the API here later) */}
        <div>
           <h3 className="section-title">Location Map</h3>
           <div className="map-placeholder">
              Google Map will load here...
           </div>
        </div>

        {/* Action Buttons */}
        <div className="action-area">
          <button className="btn-save">Save for Later</button>
          
          {/* This is where we will hook up Gemini Resume Matching later */}
          <button className="btn-apply" onClick={() => alert('Application Sent! (This will be connected to database later)')}>
            Apply Now
          </button>
        </div>

      </main>
    </div>
  );

}


