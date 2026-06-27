import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect, useState } from 'react';
import { initializeStorage } from './lib/storage';
import { LanguageProvider } from './lib/LanguageContext';
import { SplashScreen } from './components/ui/SplashScreen';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <HelmetProvider>
      <LanguageProvider>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <RouterProvider router={router} />
      </LanguageProvider>
    </HelmetProvider>
  );
}
