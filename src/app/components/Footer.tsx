import { useState } from 'react';
import { Link } from 'react-router';
import { apiNewsletter } from '../lib/api';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight, MessageCircle, Globe } from 'lucide-react';
// removed unused logo import
import footerBg from '../../imports/image-4.webp';
import { useLanguage } from '../lib/LanguageContext';

const quickLinks = [
  { label: 'About YCN', path: '/about' },
  { label: 'Our Work', path: '/our-work' },
  { label: 'Impact & Stories', path: '/impact' },
  { label: 'Get Involved', path: '/get-involved' },
  { label: 'Advocacy & Policy', path: '/advocacy' },
  { label: 'Media Center', path: '/media' },
  { label: 'Contact Us', path: '/contact' },
];

const programLinks = [
  { label: 'Climate Justice', path: '/our-work' },
  { label: 'Education & Research', path: '/our-work' },
  { label: 'WASH Programs', path: '/our-work' },
  { label: 'Disaster Risk Mgmt', path: '/our-work' },
  { label: 'Renewable Energy', path: '/our-work' },
  { label: 'Youth Development', path: '/our-work' },
  { label: 'Women Empowerment', path: '/our-work' },
  { label: 'Financial Inclusion', path: '/our-work' },
];

const socials = [
  { Icon: Facebook, href: 'https://www.facebook.com/youthclimatenetwork', label: 'Facebook' },
  { Icon: Twitter, href: 'https://x.com/ycnorgbd', label: 'Twitter' },
  { Icon: Instagram, href: 'https://www.instagram.com/youthclimatenetworkbd/', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/youth-climate-network', label: 'LinkedIn' },
  { Icon: Youtube, href: 'https://www.youtube.com/@YouthClimateNetwork', label: 'YouTube' },
];

export function Footer() {
  const { lang, toggleLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<null | 'success' | 'exists'>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await apiNewsletter.create({ email, date: new Date().toISOString() });
      setSubStatus('success');
      setEmail('');
    } catch (err: any) {
      if (err.message && err.message.includes('409')) {
        setSubStatus('exists');
      } else {
        setSubStatus('exists');
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubStatus(null), 4000);
    }
  };

  return (
    <footer style={{ backgroundColor: '#071E13', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle brand image background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `url(${footerBg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.04 }}
      />
      {/* Top accent wave */}
      <div style={{ lineHeight: 0, position: 'relative', zIndex: 1 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block' }}>
          <path
            d="M0,50 C360,10 720,80 1080,40 C1260,20 1380,50 1440,30 L1440,0 L0,0 Z"
            fill="#F3F4F6"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand col */}
          <div className="lg:col-span-4">
            <img src="/ycnmain.png" alt="Youth Climate Network" className="h-16 lg:h-20 w-auto mb-6 object-contain" />
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#F0ECD8', opacity: 0.9, maxWidth: 280 }}>
              {t(
                'A grassroots, youth-led non-profit driving climate justice across Bangladesh, South Asia and Asia Pacific since 2022.',
                '২০২২ সাল থেকে বাংলাদেশ, দক্ষিণ এশিয়া এবং এশিয়া প্যাসিফিক অঞ্চল জুড়ে জলবায়ু ন্যায়বিচার বাস্তবায়নে নিয়োজিত একটি তৃণমূল, যুব নেতৃত্বাধীন অলাভজনক সংস্থা।'
              )}
            </p>
            {/* Socials */}
            <div className="flex flex-wrap gap-2 mb-6">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#F0ECD8', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#E8521A';
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                    (e.currentTarget as HTMLElement).style.borderColor = '#E8521A';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.color = '#F0ECD8';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            {/* WhatsApp */}
            <a
              href="https://whatsapp.com/channel/0029VbDURgAADTOEJvOAEX2z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'rgba(37,211,102,0.12)',
                color: '#25D366',
                border: '1px solid rgba(37,211,102,0.25)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <MessageCircle size={16} />
              {t('Join WhatsApp Community', 'হোয়াটসঅ্যাপ কমিউনিটিতে যোগ দিন')}
            </a>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold mb-5 uppercase tracking-widest" style={{ color: '#E8521A' }}>
              {t('Explore')}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm flex items-center gap-2 group transition-all duration-150"
                    style={{ color: '#F0ECD8' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#7FAF8A'; (e.currentTarget as HTMLElement).style.paddingLeft = '6px'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#F0ECD8'; (e.currentTarget as HTMLElement).style.paddingLeft = '0'; }}
                  >
                    <ArrowRight size={12} style={{ opacity: 0.5 }} />
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language Toggle */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200 w-full"
                style={{
                  color: '#A8C4B0',
                  border: '1px solid rgba(168,196,176,0.15)',
                  fontFamily: 'Inter, sans-serif',
                  background: 'rgba(255,255,255,0.03)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,82,26,0.4)';
                  (e.currentTarget as HTMLElement).style.color = '#F0ECD8';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(232,82,26,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,196,176,0.15)';
                  (e.currentTarget as HTMLElement).style.color = '#A8C4B0';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <Globe size={12} />
                {lang === 'en' ? 'বাংলা' : 'English'}
              </button>
            </div>
          </div>

          {/* Programs */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold mb-5 uppercase tracking-widest" style={{ color: '#E8521A' }}>
              {t('Programs')}
            </h4>
            <ul className="space-y-2.5">
              {programLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm flex items-center gap-2 transition-all duration-150"
                    style={{ color: '#F0ECD8' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#7FAF8A'; (e.currentTarget as HTMLElement).style.paddingLeft = '6px'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#F0ECD8'; (e.currentTarget as HTMLElement).style.paddingLeft = '0'; }}
                  >
                    <ArrowRight size={12} style={{ opacity: 0.5 }} />
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Registration */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold mb-5 uppercase tracking-widest" style={{ color: '#E8521A' }}>
              {t('Get in Touch')}
            </h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(232,82,26,0.12)' }}>
                  <MapPin size={14} style={{ color: '#E8521A' }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#F0ECD8' }}>
                  {t('15/KA, Shyamoli, Mirpur Road')}<br />
                  <span className="text-xs opacity-75">{t('Dhaka-1207, Bangladesh', 'ঢাকা-১২০৭, বাংলাদেশ')}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(232,82,26,0.12)' }}>
                  <Mail size={14} style={{ color: '#E8521A' }} />
                </div>
                <a href="mailto:youthclimatenetworkbd@gmail.com" className="text-sm transition-colors hover:text-[#E8521A]" style={{ color: '#F0ECD8' }}>
                  youthclimatenetworkbd@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(232,82,26,0.12)' }}>
                  <Phone size={14} style={{ color: '#E8521A' }} />
                </div>
                <span className="text-sm" style={{ color: '#F0ECD8' }}>+88 01911 368538</span>
              </div>
            </div>

            {/* Official Registration Card */}
            <div
              className="rounded-xl p-4 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(26,107,60,0.3) 0%, rgba(10,51,32,0.5) 100%)',
                border: '1px solid rgba(26,107,60,0.3)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4ADE80' }} />
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#4ADE80' }}>
                  {t('Official Registration', 'সরকারিভাবে নিবন্ধিত')}
                </p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#A8C4B0' }}>
                {t('Reg No: DYD/Khulna/Reg-104')}<br />
                {t('Department of Youth Development', 'যুব উন্নয়ন অধিদপ্তর')}<br />
                {t('Ministry of Youth & Sports', 'যুব ও ক্রীড়া মন্ত্রণালয়')}<br />
                {t("Govt. of the People's Republic of Bangladesh")}
              </p>
            </div>

            {/* Newsletter Mini */}
            <h4 className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: '#E8521A' }}>
              {t('Newsletter')}
            </h4>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('Email address')}
                className="w-full pl-4 pr-[100px] py-2.5 rounded-xl text-sm focus:outline-none transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1 top-1 bottom-1 px-4 text-xs font-medium rounded-lg transition-colors flex items-center justify-center min-w-[80px]"
                style={{ backgroundColor: '#E8521A', color: '#fff' }}
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  t('Subscribe')
                )}
              </button>
            </form>
            {subStatus === 'success' && (
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> {t('Successfully subscribed!', 'সফলভাবে সাবস্ক্রাইব হয়েছে!')}
              </p>
            )}
            {subStatus === 'exists' && (
              <p className="text-xs text-[#E8521A] mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8521A]"></span> {t('You are already subscribed.', 'আপনি ইতিমধ্যে সাবস্ক্রাইব করেছেন।')}
              </p>
            )}

          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 mb-6" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs text-center sm:text-left" style={{ color: '#7FAF8A' }}>
              © {new Date().getFullYear()} Youth Climate Network (YCN). {t('All rights reserved.')}
            </p>
            <p className="text-xs text-center sm:text-left mt-0.5" style={{ color: '#5A8C6E' }}>
              {t('Est. 2022 · Bangladesh · South Asia · Asia Pacific', 'প্রতিষ্ঠিত ২০২২ · বাংলাদেশ · দক্ষিণ এশিয়া · এশিয়া প্যাসিফিক')}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/privacy"
              className="text-xs hover:text-[#7FAF8A] transition-colors"
              style={{ color: '#7FAF8A' }}
            >
              {t('Privacy Policy')}
            </Link>
            <span className="mx-2 text-xs" style={{ color: '#2A4A32' }}>·</span>
            <Link
              to="/terms"
              className="text-xs hover:text-[#7FAF8A] transition-colors"
              style={{ color: '#7FAF8A' }}
            >
              {t('Terms of Use')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
