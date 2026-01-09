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
        minHeight: '100vh',
        backgroundColor: '#f8fafc', // Light grey background
        fontFamily: 'Arial, sans-serif',
        position: 'relative'
      }}>
        {/* Main Content fills the screen now */}
        <main>
          {children}
        </main>
        
        {/* --- GLOBAL GOOGLE MAPS SCRIPT --- */}
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&loading=async`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
