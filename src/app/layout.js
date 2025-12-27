import './globals.css';

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
