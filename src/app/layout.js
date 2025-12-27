import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '@/components/Navbar'; // We will create this next

export const metadata = {
  title: 'JobLink - Find Work in Patna',
  description: 'Connecting seekers and providers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Translate Script */}
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
        <ThemeProvider>
          <div id="app-wrapper">
             <Navbar /> 
             {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
