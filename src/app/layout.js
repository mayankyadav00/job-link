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
        margin: 0, padding: 0, maxWidth: '480px', marginInline: 'auto', 
        minHeight: '100vh', backgroundColor: '#f8fafc', position: 'relative',
        borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0'
      }}>
        {children}
        
        {/* --- GLOBAL MAP SCRIPT --- */}
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&loading=async`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

export const metadata = {
  title: 'JobLink',
  description: 'Find Work. Hire Local.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Keeping your Google Translate Script if you want it globally, 
            otherwise remove these script tags too */}
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,hi', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
            }
          `
        }} />
      </head>
      <body>
        {/* Just render the page content, no forced Navbar */}
        {children}
      </body>
    </html>
  );
}
