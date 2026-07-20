import { useEffect, useState } from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Hard force scroll to top on route change to guarantee it works even with smooth scrolling
  useEffect(() => {
    const forceScroll = () => {
      // Temporarily disable smooth scrolling at the root level if it exists
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    
    // Fire immediately on route change
    forceScroll();
    
    // Fire again slightly after to catch any delayed layout shifts (e.g. image loads)
    const id = setTimeout(() => {
      forceScroll();
      // Remove the inline style so CSS takes over again
      document.documentElement.style.scrollBehavior = '';
    }, 100);
    
    return () => clearTimeout(id);
  }, [location.pathname]);
  // Back to top visibility listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once to set initial state if page is loaded while scrolled down
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F3F4F6' }}>
      {!isAdmin && <Navbar />}
      <ScrollRestoration />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      
      {/* Premium Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="backToTop"
            initial={{ opacity: 0, y: 40, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.5 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer group"
            style={{ 
              background: 'linear-gradient(135deg, #0A3320 0%, #1A6B3C 100%)', 
              boxShadow: '0 10px 40px rgba(10,51,32,0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              outline: 'none' 
            }}
            aria-label="Back to top"
          >
            {/* Inner glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
            
            {/* Animated Arrow */}
            <ArrowUp 
              size={28} 
              className="text-[#E8521A] group-hover:-translate-y-1 transition-transform duration-300" 
              strokeWidth={3} 
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
