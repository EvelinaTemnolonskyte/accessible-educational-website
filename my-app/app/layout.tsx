import './globals.css';
import Providers from '@/app/components/Providers';
import { TTSProvider } from '@/app/context/TTSContext';
import Header from '@/app/components/Header';
import SettingsPanel from '@/app/components/SettingsPanel';
import BreadcrumbBar from '@/app/components/BreadcrumbBar';
import SkipToMain from '@/app/components/SkipToMain';
import TTSPlayerBar from '@/app/components/TTSPlayerBar';
import PathnameWatcher from './components/PathnameWatcher';
import StickyShell from './components/StickyShell';


export default function RootLayout({ children }: { children: React.ReactNode }) { 
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>UniVerse | Accessibility Learning Platform</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />

        <script dangerouslySetInnerHTML={{ __html: `(function(){
          try {
            var s = JSON.parse(localStorage.getItem('universe-settings') || '{}');
            var root = document.documentElement;
            if (s.theme) root.setAttribute('data-theme', s.theme);
            else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme','dark');
            if (s.textSize) root.style.setProperty('--text-scale', String(s.textSize / 100));
            if (s.contrast) root.style.setProperty('--contrast-scale', String(s.contrast / 100));
          } catch(e) {}
        })();` }} />

        <script dangerouslySetInnerHTML={{ __html: `
         window.MathJax = {
          options: {
            menuOptions: {
              settings: {
                speech: false,
                braille: false,
                assistiveMml: true,   
              }
            }
          }
        };
        ` }} />
        <script async src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js" />
      </head>
 
      <body suppressHydrationWarning tabIndex={-1} style={{ outline: 'none' }}>
        <Providers>
          <TTSProvider>
            <PathnameWatcher />
            <SkipToMain />
            <StickyShell>
                <Header />
                  <SettingsPanel />
                  <BreadcrumbBar />
            </StickyShell>
 
            <main
              id="main-content"
              tabIndex={-1}
              style={{
                outline: 'none',
                margin: '0 auto',
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                width: '90%',
                maxWidth: '1000px',
              }}
            >
              {children}
            </main>

            <StickyShell position='bottom'>
              <TTSPlayerBar />
            </StickyShell>
          </TTSProvider>
        </Providers>
      </body>
    </html>
  );
}