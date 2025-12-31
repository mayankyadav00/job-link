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
        margin: 0, 
        padding: 0, 
        maxWidth: '480px',       // Forces it to look like a phone
        marginInline: 'auto',    // Centers it
        minHeight: '100vh',
        backgroundColor: '#f8fafc', 
        boxShadow: '0 0 50px rgba(0,0,0,0.1)', // Adds the "app" shadow
        position: 'relative',
        overflowX: 'hidden',
        borderLeft: '1px solid #e2e8f0',
        borderRight: '1px solid #e2e8f0',
      }}>
        {children}
        
        {/* --- GLOBAL GOOGLE MAPS SCRIPT --- */}
        {/* This loads the map engine once for the whole app */}
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&loading=async`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
