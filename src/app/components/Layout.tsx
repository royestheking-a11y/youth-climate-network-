import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  // Automatically scroll to the top of the window on every route change
  useEffect(() => {
    const htmlEl = document.documentElement;
    const prevScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    // Restore on next tick or instantly
    htmlEl.style.scrollBehavior = prevScrollBehavior;
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F3F4F6' }}>
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
