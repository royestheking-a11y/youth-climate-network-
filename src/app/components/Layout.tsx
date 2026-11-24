import { useEffect, useState } from 'react';
import { Outlet, useLocation, ScrollRestoration, Link } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ArrowUp, AlertTriangle, Eye, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteSettings } from '../lib/api';
import { checkAdminAuth } from '../lib/storage';
import { MaintenancePage } from './MaintenancePage';

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isPreview = location.search.includes('preview_maintenance=true');
  const { data: siteSettings } = useSiteSettings();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const isAuthenticatedAdmin = checkAdminAuth();
  const isMaintenanceActive = siteSettings?.maintenanceMode === true || isPreview;

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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── MAINTENANCE MODE HANDLING ──
  // 1. If viewing the admin panel, always allow through
  // 2. If previewing or maintenance is active for non-admin visitors, show MaintenancePage
  if (!isAdmin && (isPreview || (isMaintenanceActive && !isAuthenticatedAdmin))) {
    return <MaintenancePage settings={siteSettings} isPreview={isPreview} />;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F3F4F6' }}>
      {/* Admin Sticky Notice if Maintenance Mode is active while admin browses */}
      {!isAdmin && siteSettings?.maintenanceMode && isAuthenticatedAdmin && (
        <div className="bg-amber-500 text-gray-950 px-4 py-2 text-xs font-bold font-inter flex items-center justify-between z-[999] shadow-md sticky top-0">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-gray-950" />
              <span>
                <strong>Maintenance Mode Active:</strong> Public visitors currently see the maintenance screen. You have admin bypass.
              </span>
            </span>
            <div className="flex items-center gap-2">
              <a
                href="/?preview_maintenance=true"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-black/15 hover:bg-black/25 text-gray-950 font-semibold flex items-center gap-1 transition-all"
              >
                <Eye size={12} /> Preview
              </a>
              <Link
                to="/admin/settings"
                className="px-2.5 py-1 rounded-md bg-gray-900 text-white hover:bg-black font-semibold flex items-center gap-1 transition-all"
              >
                <Settings size={12} /> Manage in Settings
              </Link>
            </div>
          </div>
        </div>
      )}

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
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
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
