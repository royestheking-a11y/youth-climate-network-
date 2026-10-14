import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { useNavigation } from '../lib/api';

const DEFAULT_NAV_LINKS = [
  { label: 'Home', label_bn: 'হোম', path: '/' },
  { label: 'About', label_bn: 'আমাদের সম্পর্কে', path: '/about' },
  {
    label: 'Our Work', label_bn: 'আমাদের কাজ', path: '/our-work',
    dropdown: [
      { label: 'Climate Justice', label_bn: 'জলবায়ু ন্যায়বিচার', path: '/our-work/climate-justice' },
      { label: 'Education & Research', label_bn: 'শিক্ষা ও গবেষণা', path: '/our-work/education' },
      { label: 'WASH', label_bn: 'পানি ও স্বাস্থ্যবিধি', path: '/our-work/wash' },
      { label: 'Disaster Risk Management', label_bn: 'দুর্যোগ ব্যবস্থাপনা', path: '/our-work/disaster-risk' },
      { label: 'Sustainable Livelihoods', label_bn: 'টেকসই জীবিকা', path: '/our-work/sustainable-livelihoods' },
      { label: 'Renewable Energy', label_bn: 'নবায়নযোগ্য শক্তি', path: '/our-work/renewable-energy' },
      { label: 'Youth Development', label_bn: 'যুব উন্নয়ন', path: '/our-work/youth-development' },
      { label: 'Women Empowerment', label_bn: 'নারী ক্ষমতায়ন', path: '/our-work/women-empowerment' },
      { label: 'Advocacy', label_bn: 'অ্যাডভোকেসি', path: '/our-work/advocacy' },
      { label: 'Mind Shantara', label_bn: 'মাইন্ড শান্তরা', path: '/our-work/mind-shantara' },
    ],
  },
  { label: 'Programs', label_bn: 'প্রোগ্রামসমূহ', path: '/programs' },
  { label: 'Stories', label_bn: 'গল্প ও ব্লগ', path: '/blog' },
  { label: 'Get Involved', label_bn: 'যুক্ত হোন', path: '/get-involved' },
  { label: 'Contact', label_bn: 'যোগাযোগ', path: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { t, lang, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: dynamicNav = [] } = useNavigation();

  // Filter active items from DB, or fallback to default
  const navLinks = dynamicNav && dynamicNav.length > 0
    ? dynamicNav.filter(item => item.isActive !== false)
    : DEFAULT_NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
    setSearchOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 140);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled || mobileOpen ? 'rgba(8, 38, 24, 0.95)' : 'rgba(10, 51, 32, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.35)' : 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group flex items-center gap-3">
              <img
                src="/ycnmain.png"
                alt="Youth Climate Network Bangladesh"
                className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link: any) => {
                const labelText = lang === 'bn' && link.label_bn ? link.label_bn : link.label;
                const active = isActive(link.path);

                if (link.dropdown && link.dropdown.length > 0) {
                  return (
                    <div
                      key={link.path + link.label}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        to={link.path}
                        className="flex items-center gap-1 px-3.5 py-2.5 text-[14px] transition-all duration-200 relative group font-medium"
                        style={{
                          color: active ? '#ffffff' : '#D4CDB8',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        <span>{labelText}</span>
                        <ChevronDown
                          size={13}
                          className="transition-transform duration-200 opacity-70"
                          style={{ transform: activeDropdown === link.label ? 'rotate(180deg)' : 'none' }}
                        />
                        {active && (
                          <span
                            className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full transition-all duration-300"
                            style={{ backgroundColor: '#E8521A' }}
                          />
                        )}
                      </Link>

                      {/* Dropdown Menu */}
                      <div
                        className="absolute top-full left-1/2 mt-2 w-64 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200"
                        style={{
                          transform: `translateX(-50%) ${activeDropdown === link.label ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.97)'}`,
                          opacity: activeDropdown === link.label ? 1 : 0,
                          pointerEvents: activeDropdown === link.label ? 'all' : 'none',
                          backgroundColor: '#0D3D25',
                          border: '1px solid rgba(232,82,26,0.25)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        }}
                      >
                        <div className="py-2.5">
                          {link.dropdown.map((sub: any, idx: number) => {
                            const subText = lang === 'bn' && sub.label_bn ? sub.label_bn : sub.label;
                            return (
                              <Link
                                key={idx}
                                to={sub.path}
                                className="flex items-center gap-2.5 px-4 py-2 text-sm transition-all duration-150"
                                style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.backgroundColor = 'rgba(232,82,26,0.15)';
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
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#E8521A]" />
                                {subText}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return link.isExternal ? (
                  <a
                    key={link.path + link.label}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 text-[14px] transition-all duration-200 relative font-medium"
                    style={{ color: '#D4CDB8', fontFamily: 'Inter, sans-serif' }}
                  >
                    {labelText}
                  </a>
                ) : (
                  <Link
                    key={link.path + link.label}
                    to={link.path}
                    className="px-3.5 py-2.5 text-[14px] transition-all duration-200 relative font-medium group"
                    style={{
                      color: active ? '#ffffff' : '#D4CDB8',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <span>{labelText}</span>
                    {active && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#E8521A' }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right actions: Search, Lang, Join the Network CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search Toggle */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    searchOpen
                      ? 'bg-[#E8521A] text-white shadow-lg scale-105'
                      : 'text-gray-300 hover:text-white bg-black/20 hover:bg-black/40'
                  }`}
                  aria-label="Search"
                >
                  {searchOpen ? <X size={18} /> : <Search size={18} />}
                </button>
                {searchOpen && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-14 w-80 sm:w-[440px] bg-[#0A3320]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2.5 z-50 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <Search size={18} className="text-gray-400 ml-2.5 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={t('Search stories, programs & topics...', 'গল্প, প্রোগ্রাম ও বিষয় অনুসন্ধান করুন...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent px-2 py-2.5 text-sm sm:text-base text-white placeholder-gray-400 outline-none font-inter"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-gray-400 hover:text-white p-1 transition-colors"
                        title="Clear"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="w-10 h-10 rounded-xl bg-[#E8521A] hover:bg-[#d44512] transition-all flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 flex-shrink-0"
                      title="Search"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </form>
                )}
              </div>

              {/* Language Switcher */}
              <div className="flex items-center bg-[#072416] rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${lang === 'en' ? 'bg-[#1A6B3C] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${lang === 'bn' ? 'bg-[#1A6B3C] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  বাং
                </button>
              </div>

              {/* Join the Network button */}
              <Link
                to="/get-involved"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: '#E8521A',
                  color: '#ffffff',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 18px rgba(232,82,26,0.4)',
                }}
              >
                <span>{t('Join the Network', 'নেটওয়ার্কে যোগ দিন')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2.5">
              <div className="flex items-center bg-[#072416] rounded-xl p-0.5 border border-white/10">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${lang === 'en' ? 'bg-[#1A6B3C] text-white' : 'text-gray-400'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${lang === 'bn' ? 'bg-[#1A6B3C] text-white' : 'text-gray-400'}`}
                >
                  বাং
                </button>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0A3320] border-t border-white/10 px-5 py-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 duration-300">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder={t('Search stories, programs & topics...', 'গল্প, প্রোগ্রাম ও বিষয় অনুসন্ধান করুন...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-[#E8521A] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 bg-[#E8521A] hover:bg-[#d44512] text-white rounded-lg transition-colors flex items-center justify-center shadow"
              >
                <Search size={16} />
              </button>
            </form>

            <div className="space-y-1">
              {navLinks.map((link: any) => {
                const labelText = lang === 'bn' && link.label_bn ? link.label_bn : link.label;
                const active = isActive(link.path);

                if (link.dropdown && link.dropdown.length > 0) {
                  const isOpen = mobileExpanded === link.label;
                  return (
                    <div key={link.path + link.label} className="border-b border-white/5 pb-1">
                      <button
                        onClick={() => setMobileExpanded(isOpen ? null : link.label)}
                        className="w-full flex items-center justify-between py-2.5 text-base font-medium text-left"
                        style={{ color: active ? '#E8521A' : '#F0ECD8' }}
                      >
                        <span>{labelText}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="pl-4 py-2 space-y-2 bg-black/15 rounded-xl mb-2">
                          {link.dropdown.map((sub: any, idx: number) => (
                            <Link
                              key={idx}
                              to={sub.path}
                              className="block py-1.5 text-sm text-gray-300 hover:text-white"
                            >
                              {lang === 'bn' && sub.label_bn ? sub.label_bn : sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.path + link.label}
                    to={link.path}
                    className="block py-2.5 text-base font-medium border-b border-white/5"
                    style={{ color: active ? '#E8521A' : '#F0ECD8' }}
                  >
                    {labelText}
                  </Link>
                );
              })}
            </div>

            <Link
              to="/get-involved"
              className="w-full py-3.5 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: '#E8521A', color: '#ffffff' }}
            >
              <span>{t('Join the Network', 'নেটওয়ার্কে যোগ দিন')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
