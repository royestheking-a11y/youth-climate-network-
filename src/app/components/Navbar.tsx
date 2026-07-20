import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, ChevronDown, HandCoins } from 'lucide-react';
// removed unused logo import
import { useLanguage } from '../lib/LanguageContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Our Work', path: '/our-work',
    dropdown: [
      { label: 'Climate Justice', path: '/our-work/climate-justice' },
      { label: 'Education & Research', path: '/our-work/education' },
      { label: 'WASH', path: '/our-work/wash' },
      { label: 'Disaster Risk Management', path: '/our-work/disaster-risk' },
      { label: 'Sustainable Livelihoods', path: '/our-work/sustainable-livelihoods' },
      { label: 'Renewable Energy', path: '/our-work/renewable-energy' },
      { label: 'Youth Development', path: '/our-work/youth-development' },
      { label: 'Women Empowerment', path: '/our-work/women-empowerment' },
      { label: 'Advocacy', path: '/our-work/advocacy' },
      { label: 'Mind Shantara', path: '/our-work/mind-shantara' },
    ],
  },
  { label: 'Stories of Change', path: '/impact' },
  { label: 'Get Involved', path: '/get-involved' },
  { label: 'Media', path: '/media' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { t } = useLanguage();
  const location = useLocation();
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled || mobileOpen ? 'rgba(10,51,32,0.98)' : 'rgba(10,51,32,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(232,82,26,0.15)' : '1px solid transparent',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[84px]">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group flex items-center">
              <img
                src="/ycnmain.png"
                alt="Youth Climate Network"
                className="h-12 lg:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div
                    key={link.path}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={link.path}
                      className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[13px] transition-all duration-200 relative group"
                      style={{
                        color: isActive(link.path) ? '#E8521A' : '#D4CDB8',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: isActive(link.path) ? 600 : 400,
                      }}
                    >
                      {isActive(link.path) && (
                        <span className="absolute inset-0 rounded-lg opacity-10" style={{ backgroundColor: '#E8521A' }} />
                      )}
                      {t(link.label)}
                      <ChevronDown
                        size={13}
                        className="transition-transform duration-200"
                        style={{ transform: activeDropdown === link.label ? 'rotate(180deg)' : 'none', opacity: 0.6 }}
                      />
                    </Link>
                    {/* Dropdown */}
                    <div
                      className="absolute top-full left-1/2 mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200"
                      style={{
                        transform: `translateX(-50%) ${activeDropdown === link.label ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.96)'}`,
                        opacity: activeDropdown === link.label ? 1 : 0,
                        pointerEvents: activeDropdown === link.label ? 'all' : 'none',
                        backgroundColor: '#0D3D25',
                        border: '1px solid rgba(232,82,26,0.2)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div className="py-2">
                        {link.dropdown.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.path}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm transition-all duration-150 group"
                            style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.backgroundColor = 'rgba(232,82,26,0.12)';
                              el.style.color = '#F0ECD8';
                              el.style.paddingLeft = '20px';
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.backgroundColor = 'transparent';
                              el.style.color = '#A8C4B0';
                              el.style.paddingLeft = '16px';
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#E8521A', opacity: 0.6 }}
                            />
                            {t(item.label)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-2.5 py-2 rounded-lg text-[13px] transition-all duration-200 relative"
                    style={{
                      color: isActive(link.path) ? '#E8521A' : '#D4CDB8',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: isActive(link.path) ? 600 : 400,
                    }}
                  >
                    {isActive(link.path) && (
                      <span className="absolute inset-0 rounded-lg opacity-10" style={{ backgroundColor: '#E8521A' }} />
                    )}
                    {t(link.label)}
                  </Link>
                )
              )}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link
                to="/donate"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #E8521A 0%, #C93F0A 100%)',
                  color: '#ffffff',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 15px rgba(232,82,26,0.35)',
                }}
              >
                <HandCoins size={15} />
                {t('Donate Now')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2.5 rounded-xl transition-all duration-200"
              style={{
                color: '#F0ECD8',
                backgroundColor: mobileOpen ? 'rgba(232,82,26,0.15)' : 'transparent',
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-300"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'all' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className="fixed top-[84px] bottom-0 left-0 right-0 z-40 lg:hidden overflow-y-auto"
        style={{
          backgroundColor: '#0A3320',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-10px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'all' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
          borderTop: '1px solid rgba(232,82,26,0.15)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="px-4 py-5 space-y-1">
          {navLinks.map((link) => (
            <div key={link.path}>
              <div className="flex items-center justify-between">
                <Link
                  to={link.path}
                  className="flex-1 flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    color: isActive(link.path) ? '#E8521A' : '#D4CDB8',
                    backgroundColor: isActive(link.path) ? 'rgba(232,82,26,0.1)' : 'transparent',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {isActive(link.path) && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#E8521A' }} />
                  )}
                  {t(link.label)}
                </Link>
                {link.dropdown && (
                  <button
                    className="p-3 rounded-xl transition-all duration-200"
                    style={{ color: '#A8C4B0' }}
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                  >
                    <ChevronDown
                      size={16}
                      style={{
                        transform: mobileExpanded === link.label ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>
                )}
              </div>
              {link.dropdown && mobileExpanded === link.label && (
                <div className="ml-4 mt-1 mb-2 space-y-0.5 pl-4" style={{ borderLeft: '2px solid rgba(232,82,26,0.25)' }}>
                  {link.dropdown.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
                      style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F0ECD8'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#A8C4B0'; }}
                    >
                      {t(item.label)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mobile bottom actions */}
          <div className="pt-4 pb-2 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Link
              to="/donate"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, #E8521A 0%, #C93F0A 100%)',
                color: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 15px rgba(232,82,26,0.35)',
              }}
            >
              <HandCoins size={15} />
              {t('Donate Now')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
