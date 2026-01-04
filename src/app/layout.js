import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'JobLink',
  description: 'Blue Collar Job Matching App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ 
        /* 1. LAYOUT POSITIONING */
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        
        /* 2. PHONE SIMULATION (The "Box") */
        maxWidth: '480px',           // Maximum width of a large phone
        width: '100%',               // Full width on small screens
        marginInline: 'auto',        // Centers the box horizontally
        
        /* 3. VISUAL STYLE */
        backgroundColor: '#ffffff',  // The App background is white
        boxShadow: '0 0 40px rgba(0,0,0,0.1)', // Nice shadow to separate from background
        borderLeft: '1px solid #e2e8f0', // Subtle borders
        borderRight: '1px solid #e2e8f0',
        
        /* 4. BEHAVIOR */
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* MAIN CONTENT AREA */}
        <main style={{ flex: 1, position: 'relative' }}>
          {children}
        </main>

        {/* --- GLOBAL MAP SCRIPT --- */}
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&loading=async`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
