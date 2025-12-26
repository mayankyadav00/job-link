// src/app/page.js
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

toggleBtn.addEventListener('click', () => {
  // Check current theme
  const isDark = body.getAttribute('data-theme') === 'dark';
  
  // Toggle the attribute
  if (isDark) {
    body.removeAttribute('data-theme');
    toggleBtn.innerHTML = '☀️'; // Change icon to sun
  } else {
    body.setAttribute('data-theme', 'dark');
    toggleBtn.innerHTML = '🌙'; // Change icon to moon
  }
  
  // Optional: Save preference in local storage so it stays after refresh
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});
import Link from 'next/link';
import { Globe } from 'lucide-react'; // Optional: Remove if you don't have icons yet

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f4f4' }}>
      
      {/* --- HEADER WITH LANGUAGE TOGGLE --- */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px', 
        background: 'white', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div class="hover" style={{ width: '32px', height: '32px', background: '#4285F4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>J</div>
          <a id="joblinklogo" rel="" href="">
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>JobLink</span>
          </a>
        </div>

        {/* Right Side: Language & Login & darkmode */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
<button id="theme-toggle" class="mode-btn">
  <span class="icon">☀️</span>
</button>
          <script src="DOM.js"></script>
          {/* THE LANGUAGE TOGGLE */}
          <button class="hover" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            padding: '8px 12px', 
            border: '1px solid #ccc', 
            borderRadius: '20px', 
            background: 'white', 
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}>
            <span>🌐</span> {/* Using Emoji if Icon fails */}
            <span>EN / HI</span>
          </button>

          {/* Login Button */}
          <Link href="/login">
            <button class="hover" style={{ 
              background: '#333', 
              color: 'white', 
              border: 'none', 
              padding: '8px 20px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </Link>
        </div>
      </nav>


      {/* --- MAIN CONTENT (Split View) --- */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#333' }}>
            Find Work. <span style={{ color: '#34A853' }}>Hire Local.</span>
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>The bridge between local workers and daily needs.</p>
        </div>

        {/* The Two Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '800px', md: { flexDirection: 'row' } }}>
          
          {/* SEEKER CARD */}
          <div style={{ flex: 1, background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderTop: '5px solid #4285F4' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
            <h2 style={{ marginBottom: '10px' }}>I Need Work</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Find daily shifts, part-time tasks, or full-time jobs.</p>
            <Link href="/seeker/dashboard">
              <button class="hover" style={{ width: '100%', padding: '15px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Find Jobs
              </button>
            </Link>
          </div>

          {/* PROVIDER CARD */}
          <div style={{ flex: 1, background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderTop: '5px solid #34A853' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📢</div>
            <h2 style={{ marginBottom: '10px' }}>I Need Workers</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Hire help for your shop, home, or office instantly.</p>
            <Link href="/provider/dashboard">
              <button class="hover" style={{ width: '100%', padding: '15px', background: '#34A853', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Post a Job
              </button>
            </Link>
          </div>

        </div>

      </main>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '0.8rem' }}>
        Powered by Falcons
      </footer>
    </div>
  );
}
