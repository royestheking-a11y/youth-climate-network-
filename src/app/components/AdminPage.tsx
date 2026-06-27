import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Newspaper, Users, Handshake, BarChart2,
  Mail, Heart, LogOut, Plus, Trash2, Edit3, Save, X, CheckCircle,
  Eye, EyeOff, TrendingUp, MessageSquare, Bell,
  Activity, ArrowUpRight, ArrowDownRight, Globe, TreePine, MapPin, Briefcase, Image as ImageIcon, Menu, Camera
} from 'lucide-react';
import {
  checkAdminAuth, adminLogin, adminLogout,
  getNews, saveNews, getTeam, saveTeam,
  getPartners, savePartners, getVolunteerApps, updateVolunteerStatus,
  getNewsletter, getContactMessages, markMessageRead, getDonations,
  getEvents, saveEvents, getDonationRequests, updateDonationRequestStatus,
  getPartnershipInquiries, updatePartnershipInquiryStatus, getInternshipApps, updateInternshipAppStatus,
  getCarouselItems, saveCarouselItems
} from '../lib/storage';
import type {
  ImpactStats, NewsItem, TeamMember, Partner, VolunteerApp, EventItem, PartnershipInquiry, InternshipApp, HeroCarouselItem, MediaItem
} from '../lib/storage';
import logo2 from '../../imports/image-2.webp';
import heroBg from '../../imports/image-4.webp';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Link } from 'react-router';

type AdminTab = 'dashboard' | 'stats' | 'carousel' | 'media' | 'news' | 'events' | 'team' | 'partners' | 'volunteers' | 'internships' | 'partnershipInquiries' | 'newsletter' | 'messages' | 'donations';

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(() => localStorage.getItem('ycn_admin_email') || '');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(() => !!localStorage.getItem('ycn_admin_email'));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (adminLogin(password)) {
        if (remember) localStorage.setItem('ycn_admin_email', email);
        else localStorage.removeItem('ycn_admin_email');
        onLogin();
      } else {
        setError('Incorrect credentials. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#040F08', fontFamily: 'Inter, sans-serif' }}>

      {/* ── LEFT PANEL (brand visual) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col">
        {/* Brand background */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,15,8,0.85) 0%, rgba(10,51,32,0.6) 50%, rgba(4,15,8,0.9) 100%)' }} />
        {/* Orange glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(232,82,26,0.25) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(26,107,60,0.2) 0%, transparent 70%)', transform: 'translate(-20%, 20%)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12 justify-between">
          {/* Top: logo + org name */}
          <div className="flex items-center gap-3">
            <img src={logo2} alt="YCN" className="h-10 w-auto" style={{ filter: 'drop-shadow(0 0 12px rgba(232,82,26,0.4))' }} />
            <div>
              <p style={{ color: '#F0ECD8', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9rem' }}>Youth Climate Network</p>
              <p style={{ color: '#5A8A6A', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Portal</p>
            </div>
          </div>

          {/* Center: headline */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(232,82,26,0.12)', border: '1px solid rgba(232,82,26,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
              <span style={{ color: '#E8521A', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Secure Access Only</span>
            </div>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#F0ECD8', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Control &<br />
              <span style={{ background: 'linear-gradient(90deg, #E8521A, #D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Manage</span><br />
              YCN Platform
            </h1>
            <p className="mt-4" style={{ color: '#5A8A6A', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 340 }}>
              Full control over content, impact stats, volunteers, donations, and team — all in one secured dashboard.
            </p>
          </div>

          {/* Bottom: reg badge */}
          <div className="flex items-center gap-3">
            <div className="w-px h-10" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <p style={{ color: '#3A5A42', fontSize: '0.72rem', lineHeight: 1.6 }}>
              Reg. DYD/Khulna/Reg-104<br />
              Est. 2022 · Bangladesh
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (login form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Back to homepage */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#7FAF8A', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'Inter, sans-serif' }}
          >
            <span style={{ fontSize: '0.8rem' }}>←</span> Back to Homepage
          </Link>
          {/* Mobile logo */}
          <img src={logo2} alt="YCN" className="h-8 w-auto lg:hidden" />
        </div>

        {/* Form card */}
        <div className="w-full max-w-sm">
          {/* Logo + Header */}
          <div className="mb-8 text-center">
            <img src={logo2} alt="YCN" className="h-20 w-auto mx-auto mb-5" style={{ filter: 'drop-shadow(0 0 16px rgba(232,82,26,0.35))' }} />
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#F0ECD8', fontSize: '1.35rem', letterSpacing: '-0.01em' }}>Admin Sign In</h2>
            <p style={{ color: '#4A7A5A', fontSize: '0.78rem', marginTop: 4 }}>Youth Climate Network · Secure Portal</p>
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(232,82,26,0.35), transparent)', marginTop: 20 }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block mb-1.5" style={{ color: '#6B9B7A', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(232,82,26,0.5)'; (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                placeholder="admin@ycnbd.org"
                required
              />
            </div>
            {/* Password field */}
            <div>
              <label className="block mb-1.5" style={{ color: '#6B9B7A', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)'}`, color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(232,82,26,0.5)'; (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                  onBlur={e => { (e.target as HTMLElement).style.borderColor = error ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)'; (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                  placeholder="Enter admin password"
                  required
                />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={15} style={{ color: '#4A7A5A' }} /> : <Eye size={15} style={{ color: '#4A7A5A' }} />}
                </button>
              </div>
              {error && <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: '#F87171' }}><span>⚠</span> {error}</p>}
            </div>
            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#E8521A' }}
              />
              <span style={{ color: '#6B9B7A', fontSize: '0.8rem' }}>Remember my email</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: loading ? 'rgba(232,82,26,0.5)' : 'linear-gradient(135deg, #E8521A, #D97706)',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(232,82,26,0.35)',
                letterSpacing: '0.02em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Verifying...
                </>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: 'rgba(26,107,60,0.08)', border: '1px solid rgba(26,107,60,0.15)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#4A7A5A' }}>Demo Credentials</p>
            <p className="text-xs" style={{ color: '#4A7A5A' }}>
              Email: <span style={{ color: '#E8521A' }}>admin@ycnbd.org</span><br />
              Password:{' '}
              <span
                className="cursor-pointer font-mono font-semibold hover:text-orange-400 transition-colors"
                style={{ color: '#E8521A' }}
                onClick={() => { setEmail('admin@ycnbd.org'); setPassword('ycn@admin2024'); }}
              >
                ycn@admin2024
              </span>
              {' '}(click to fill)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const tabs: { key: AdminTab; label: string; icon: React.FC<{ size?: number; style?: React.CSSProperties }> }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'stats', label: 'Impact Stats', icon: BarChart2 },
  { key: 'carousel', label: 'Hero Carousel', icon: ImageIcon },
  { key: 'media', label: 'Media', icon: Camera },
  { key: 'news', label: 'News', icon: Newspaper },
  { key: 'events', label: 'Events', icon: Bell },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'partners', label: 'Partners', icon: Handshake },
  { key: 'volunteers', label: 'Volunteers', icon: Heart },
  { key: 'internships', label: 'Internships', icon: Briefcase },
  { key: 'partnershipInquiries', label: 'Partner Inqs', icon: Handshake },
  { key: 'newsletter', label: 'Newsletter', icon: Mail },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'donations', label: 'Donations', icon: TrendingUp },
];

import { 
  useStats, useVolunteerApps, useInternshipApps,
  usePartnershipInquiries, useContactMessages, useNewsletter,
  useDonations, useNews, useMedia, apiMedia, uploadFile
} from '../lib/api';

export function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setAuthed(checkAdminAuth());
  }, []);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const handleLogout = () => {
    adminLogout();
    setAuthed(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F3F4F6', fontFamily: 'Inter, sans-serif' }}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-300 z-50 fixed md:sticky top-0 h-screen ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{
          width: sidebarOpen ? 240 : 64,
          backgroundColor: '#0A3320',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {sidebarOpen ? (
            <img src={logo2} alt="YCN" className="h-9 w-auto" />
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#E8521A', color: '#fff' }}>YC</div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150"
                style={{
                  backgroundColor: isActive ? 'rgba(232,82,26,0.15)' : 'transparent',
                  color: isActive ? '#E8521A' : '#A8C4B0',
                  borderLeft: isActive ? '3px solid #E8521A' : '3px solid transparent',
                }}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span className="text-sm truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all"
            style={{ color: '#6B9B7A' }}
          >
            <span style={{ fontSize: 16 }}>{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span className="text-xs">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all hover:text-white"
            style={{ color: '#6B9B7A' }}
          >
            <LogOut size={16} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4" style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-1 text-gray-600">
              <Menu size={24} />
            </button>
            <h2 className="font-semibold truncate" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937', fontSize: '1.1rem' }}>
              {tabs.find(t => t.key === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="hidden sm:inline-block text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>Admin</span>
            <span className="hidden sm:inline-block text-xs" style={{ color: '#9CA3AF' }}>YCN Admin Panel</span>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardTab setActiveTab={setActiveTab} />}
          {activeTab === 'stats' && <StatsTab />}
          {activeTab === 'carousel' && <CarouselTab />}
          {activeTab === 'media' && <MediaTab />}
          {activeTab === 'news' && <NewsTab />}
          {activeTab === 'events' && <EventsTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'partners' && <PartnersTab />}
          {activeTab === 'volunteers' && <VolunteersTab />}
          {activeTab === 'internships' && <InternshipsTab />}
          {activeTab === 'partnershipInquiries' && <PartnershipInquiriesTab />}
          {activeTab === 'newsletter' && <NewsletterTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'donations' && <DonationsTab />}
        </div>
      </main>
    </div>
  );
}

/* ── DASHBOARD ── */
function DashboardTab({ setActiveTab }: { setActiveTab: (t: AdminTab) => void }) {
  const { data: statsData } = useStats();
  const { data: volunteersData } = useVolunteerApps();
  const { data: internshipsData } = useInternshipApps();
  const { data: partnershipsData } = usePartnershipInquiries();
  const { data: messagesData } = useContactMessages();
  const { data: newsletterData } = useNewsletter();
  const { data: donationsData } = useDonations();
  const { data: newsData } = useNews();
  
  const stats = statsData || { peopleReached: 0, treesPlanted: 0, volunteers: 0, projects: 0, partners: 0, districts: 0 } as any;
  const volunteers = volunteersData || [];
  const internships = internshipsData || [];
  const partnerships = partnershipsData || [];
  const messages = messagesData || [];
  const newsletter = newsletterData || [];
  const donations = donationsData || [];
  const news = newsData || [];

  const unread = messages.filter(m => !m.read).length;
  const pending = volunteers.filter(v => v.status === 'pending').length;
  const pendingInterns = internships.filter(v => v.status === 'pending').length;
  const pendingPartners = partnerships.filter(v => v.status === 'pending').length;
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  const analyticsData = [
    { name: 'Jan', visits: 4000, engagement: 2400 },
    { name: 'Feb', visits: 3000, engagement: 1398 },
    { name: 'Mar', visits: 2000, engagement: 9800 },
    { name: 'Apr', visits: 2780, engagement: 3908 },
    { name: 'May', visits: 1890, engagement: 4800 },
    { name: 'Jun', visits: 2390, engagement: 3800 },
    { name: 'Jul', visits: 3490, engagement: 4300 },
  ];

  const donationData = [
    { name: 'Q1', donations: 14000 },
    { name: 'Q2', donations: 32000 },
    { name: 'Q3', donations: 24000 },
    { name: 'Q4', donations: 47800 },
  ];

  const activeVolunteersCount = volunteers.filter(v => v.status === 'accepted').length;

  const metricCards = [
    { label: 'People Reached', value: stats.peopleReached.toLocaleString(), change: '+12%', up: true, color: '#1A6B3C', light: '#E8F5EE', tab: 'stats' as AdminTab, icon: Globe },
    { label: 'Active Volunteers', value: activeVolunteersCount.toString(), change: '+8%', up: true, color: '#E8521A', light: '#FFF3EE', tab: 'volunteers' as AdminTab, icon: Users },
    { label: 'Newsletter Subs', value: newsletter.length.toString(), change: `${newsletter.length} total`, up: true, color: '#0E7490', light: '#E0F7FA', tab: 'newsletter' as AdminTab, icon: Mail },
    { label: 'Total Donations', value: `৳${totalDonations.toLocaleString()}`, change: `${donations.length} donors`, up: true, color: '#D97706', light: '#FFF8E1', tab: 'donations' as AdminTab, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome bar */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, #0A3320 0%, #0D4A28 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#E8521A' }}>Welcome back, Admin</p>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#F0ECD8', fontSize: '1.1rem' }}>YCN Admin Dashboard</h2>
          <p className="text-xs mt-0.5" style={{ color: '#4A7A5A' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-3">
          {pending > 0 && (
            <button onClick={() => setActiveTab('volunteers')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A', border: '1px solid rgba(232,82,26,0.2)' }}>
              <Bell size={13} /> {pending} Pending
            </button>
          )}
          {unread > 0 && (
            <button onClick={() => setActiveTab('messages')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105" style={{ backgroundColor: 'rgba(14,116,144,0.15)', color: '#0E7490', border: '1px solid rgba(14,116,144,0.2)' }}>
              <MessageSquare size={13} /> {unread} Unread
            </button>
          )}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, change, up, color, light, tab, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveTab(tab)}
            className="p-5 rounded-2xl text-left hover:shadow-xl transition-all duration-200 group hover:-translate-y-0.5"
            style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: light }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-xs font-semibold flex items-center gap-0.5" style={{ color: up ? '#1A6B3C' : '#E8521A' }}>
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </span>
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: '#9CA3AF' }}>{label}</p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.4rem', color, lineHeight: 1 }}>{value}</p>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #F0F0F0' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>Traffic & Engagement</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Jan – Jul (demo data)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C', fontWeight: 600 }}>Live</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} id="area-chart">
                <defs key="defs">
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1" key="grad1">
                    <stop offset="5%" stopColor="#1A6B3C" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#1A6B3C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1" key="grad2">
                    <stop offset="5%" stopColor="#E8521A" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#E8521A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip key="tooltip" contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '12px' }} />
                <Legend key="legend" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area key="area1" type="monotone" dataKey="visits" name="Visits" stroke="#1A6B3C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" />
                <Area key="area2" type="monotone" dataKey="engagement" name="Engagement" stroke="#E8521A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEngage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #F0F0F0' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>Donations Overview</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Year to Date — quarterly</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: '#FFF8E1', color: '#D97706' }}>৳{totalDonations.toLocaleString()}</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} id="bar-chart">
                <defs key="barDefs">
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1" key="barGradDef">
                    <stop offset="0%" stopColor="#0E7490" />
                    <stop offset="100%" stopColor="#0891B2" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid2" strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis key="xaxis2" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis key="yaxis2" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip key="tooltip2" cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '12px' }} />
                <Bar key="bar1" dataKey="donations" name="Donations (৳)" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending actions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #F0F0F0' }}>
          <h3 className="font-semibold mb-4 text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>Action Required</h3>
          <div className="space-y-2.5">
            <button onClick={() => setActiveTab('volunteers')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left group" style={{ border: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: pending > 0 ? '#FFF3EE' : '#E8F5EE' }}>
                  <Heart size={13} style={{ color: pending > 0 ? '#E8521A' : '#1A6B3C' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#374151' }}>Volunteer Apps</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: pending > 0 ? '#FFF3EE' : '#E8F5EE', color: pending > 0 ? '#E8521A' : '#1A6B3C' }}>
                {pending} pending
              </span>
            </button>
            <button onClick={() => setActiveTab('internships')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left group" style={{ border: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: pendingInterns > 0 ? '#FFF3EE' : '#E8F5EE' }}>
                  <Briefcase size={13} style={{ color: pendingInterns > 0 ? '#E8521A' : '#1A6B3C' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#374151' }}>Internship Apps</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: pendingInterns > 0 ? '#FFF3EE' : '#E8F5EE', color: pendingInterns > 0 ? '#E8521A' : '#1A6B3C' }}>
                {pendingInterns} pending
              </span>
            </button>
            <button onClick={() => setActiveTab('partnershipInquiries')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left group" style={{ border: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: pendingPartners > 0 ? '#FFF3EE' : '#E8F5EE' }}>
                  <Handshake size={13} style={{ color: pendingPartners > 0 ? '#E8521A' : '#1A6B3C' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#374151' }}>Partner Inquiries</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: pendingPartners > 0 ? '#FFF3EE' : '#E8F5EE', color: pendingPartners > 0 ? '#E8521A' : '#1A6B3C' }}>
                {pendingPartners} pending
              </span>
            </button>
            <button onClick={() => setActiveTab('messages')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all text-left" style={{ border: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: unread > 0 ? '#FFF3EE' : '#E8F5EE' }}>
                  <MessageSquare size={13} style={{ color: unread > 0 ? '#E8521A' : '#1A6B3C' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#374151' }}>Unread Messages</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: unread > 0 ? '#FFF3EE' : '#E8F5EE', color: unread > 0 ? '#E8521A' : '#1A6B3C' }}>
                {unread} unread
              </span>
            </button>
          </div>
        </div>

        {/* Content overview */}
        <div className="bg-white rounded-2xl p-5 shadow-sm lg:col-span-2" style={{ border: '1px solid #F0F0F0' }}>
          <h3 className="font-semibold mb-4 text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>Content Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'News Articles', count: news.length, color: '#1A6B3C', bg: '#E8F5EE' },
              { label: 'Team Members', count: getTeam().length, color: '#0E7490', bg: '#E0F7FA' },
              { label: 'Partners', count: getPartners().length, color: '#D97706', bg: '#FFF8E1' },
              { label: 'Donations', count: donations.length, color: '#E8521A', bg: '#FFF3EE' },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className="p-3 rounded-xl text-center" style={{ backgroundColor: bg }}>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.6rem', color, lineHeight: 1 }}>{count}</p>
                <p className="text-xs mt-1.5" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── STATS ── */
function StatsTab() {
  const { data: initialStats, mutate } = useStats();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialStats && !stats) {
      setStats(initialStats);
    }
  }, [initialStats]);

  const handleSave = async () => {
    if (!stats) return;
    try {
      const { updateStats } = await import('../lib/api');
      await updateStats(stats);
      mutate(stats);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
      alert('Failed to save stats to server.');
    }
  };

  if (!stats) return <div className="p-8">Loading stats...</div>;

  const statConfig: Record<keyof ImpactStats, { label: string; icon: any; color: string; bg: string }> = {
    peopleReached: { label: 'People Reached', icon: Users, color: '#1A6B3C', bg: '#E8F5EE' },
    treesPlanted: { label: 'Trees Planted', icon: TreePine, color: '#2E7D32', bg: '#E8F5E9' },
    volunteers: { label: 'Volunteers', icon: Heart, color: '#E8521A', bg: '#FFF3EE' },
    projects: { label: 'Active Projects', icon: LayoutDashboard, color: '#0E7490', bg: '#E0F7FA' },
    partners: { label: 'Partners', icon: Handshake, color: '#D97706', bg: '#FFF8E1' },
    districts: { label: 'Districts Covered', icon: MapPin, color: '#6A1B9A', bg: '#F3E5F5' },
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: '1px solid #F3F4F6' }}>
          <div>
            <h3 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>Manage Impact Statistics</h3>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>These stats are displayed on the public frontend homepage and impact sections.</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg"
            style={{ backgroundColor: saved ? '#1A6B3C' : '#0A3320', color: '#F0ECD8' }}
          >
            {saved ? <><CheckCircle size={16} /> Successfully Saved</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(statConfig) as (keyof ImpactStats)[]).map(key => {
            const config = statConfig[key];
            const Icon = config.icon;
            return (
              <div key={key} className="p-5 rounded-2xl transition-all" style={{ border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: config.bg, color: config.color }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold" style={{ color: '#374151' }}>
                      {config.label}
                    </label>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>Enter total numbers</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-5 py-3 rounded-xl text-lg font-bold outline-none transition-all focus:ring-2"
                    style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', color: config.color, fontFamily: 'Poppins, sans-serif' }}
                    value={stats[key]}
                    onChange={e => setStats(s => s ? { ...s, [key]: parseInt(e.target.value) || 0 } : null)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
                    <Activity size={18} style={{ color: config.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── NEWS ── */
function NewsTab() {
  const [items, setItems] = useState<NewsItem[]>(getNews());
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const blank: NewsItem = { id: '', title: '', title_bn: '', excerpt: '', excerpt_bn: '', content: '', content_bn: '', date: new Date().toISOString().split('T')[0], category: 'Advocacy', category_bn: 'অ্যাডভোকেসি', image: '', featured: false };

  const save = () => {
    if (!editing) return;
    const updated = isNew
      ? [...items, { ...editing, id: Date.now().toString() }]
      : items.map(i => i.id === editing.id ? editing : i);
    setItems(updated);
    saveNews(updated);
    setEditing(null);
    setIsNew(false);
  };

  const del = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveNews(updated);
  };

  if (editing) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{isNew ? 'Add News Article' : 'Edit News Article'}</h3>
          <button onClick={() => { setEditing(null); setIsNew(false); }}><X size={18} style={{ color: '#9CA3AF' }} /></button>
        </div>
        <div className="space-y-4">
          <InputField label="Title" value={editing.title} onChange={v => setEditing(e => e ? { ...e, title: v } : null)} />
          <InputField label="Excerpt" value={editing.excerpt} onChange={v => setEditing(e => e ? { ...e, excerpt: v } : null)} multiline />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" type="date" value={editing.date} onChange={v => setEditing(e => e ? { ...e, date: v } : null)} />
            <SelectField label="Category" value={editing.category} options={['Advocacy', 'Renewable Energy', 'Youth Development', 'Environment', 'WASH', 'Women Empowerment', 'Disaster', 'Health', 'Other']} onChange={v => setEditing(e => e ? { ...e, category: v } : null)} />
          </div>
          <ImageUploader label="Article Image" value={editing.image} onChange={v => setEditing(e => e ? { ...e, image: v } : null)} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editing.featured} onChange={e => setEditing(ed => ed ? { ...ed, featured: e.target.checked } : null)} className="w-4 h-4 rounded" />
            <span className="text-sm" style={{ color: '#374151' }}>Featured article</span>
          </label>
          <button onClick={save} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>Save Article</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: '#6B7280' }}>{items.length} articles</p>
        <button onClick={() => { setEditing(blank); setIsNew(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>
          <Plus size={15} /> Add Article
        </button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4">
            {item.image && <img src={item.image} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{item.category}</span>
                {item.featured && <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFF8E1', color: '#D97706' }}>Featured</span>}
                <span className="text-xs" style={{ color: '#9CA3AF' }}>{item.date}</span>
              </div>
              <p className="text-sm font-medium truncate" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{item.title}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit3 size={14} style={{ color: '#6B7280' }} /></button>
              <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={14} style={{ color: '#EF4444' }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── EVENTS ── */
function EventsTab() {
  const [items, setItems] = useState<EventItem[]>(getEvents());
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const blank: EventItem = { id: '', title: '', title_bn: '', date: new Date().toISOString().split('T')[0], location: '', location_bn: '', description: '', description_bn: '', type: 'Workshop', type_bn: 'কর্মশালা' };

  const save = () => {
    if (!editing) return;
    const updated = isNew ? [...items, { ...editing, id: Date.now().toString() }] : items.map(i => i.id === editing.id ? editing : i);
    setItems(updated); saveEvents(updated); setEditing(null); setIsNew(false);
  };

  const del = (id: string) => {
    const updated = items.filter(i => i.id !== id); setItems(updated); saveEvents(updated);
  };

  if (editing) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{isNew ? 'Add Event' : 'Edit Event'}</h3>
          <button onClick={() => { setEditing(null); setIsNew(false); }}><X size={18} style={{ color: '#9CA3AF' }} /></button>
        </div>
        <div className="space-y-4">
          <InputField label="Title" value={editing.title} onChange={v => setEditing(e => e ? { ...e, title: v } : null)} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" type="date" value={editing.date} onChange={v => setEditing(e => e ? { ...e, date: v } : null)} />
            <SelectField label="Type" value={editing.type} options={['Workshop', 'Conference', 'Campaign', 'Program', 'Training', 'Other']} onChange={v => setEditing(e => e ? { ...e, type: v } : null)} />
          </div>
          <InputField label="Location" value={editing.location} onChange={v => setEditing(e => e ? { ...e, location: v } : null)} />
          <InputField label="Description" value={editing.description} onChange={v => setEditing(e => e ? { ...e, description: v } : null)} multiline />
          <button onClick={save} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>Save Event</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: '#6B7280' }}>{items.length} events</p>
        <button onClick={() => { setEditing(blank); setIsNew(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>
          <Plus size={15} /> Add Event
        </button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0A3320' }}>
              <span className="text-xs" style={{ color: '#E8521A' }}>{new Date(item.date).toLocaleDateString('en', { month: 'short' })}</span>
              <span className="font-bold" style={{ color: '#F0ECD8', fontFamily: 'Poppins, sans-serif' }}>{new Date(item.date).getDate()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{item.type}</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{item.title}</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{item.location}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit3 size={14} style={{ color: '#6B7280' }} /></button>
              <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={14} style={{ color: '#EF4444' }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TEAM ── */
function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>(getTeam());
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);

  const blank: TeamMember = { id: '', name: '', name_bn: '', role: '', role_bn: '', bio: '', bio_bn: '', email: '', image: '' };

  const save = () => {
    if (!editing) return;
    const updated = isNew ? [...members, { ...editing, id: Date.now().toString() }] : members.map(m => m.id === editing.id ? editing : m);
    setMembers(updated); saveTeam(updated); setEditing(null); setIsNew(false);
  };

  const del = (id: string) => {
    const updated = members.filter(m => m.id !== id); setMembers(updated); saveTeam(updated);
  };

  if (editing) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{isNew ? 'Add Team Member' : 'Edit Team Member'}</h3>
          <button onClick={() => { setEditing(null); setIsNew(false); }}><X size={18} style={{ color: '#9CA3AF' }} /></button>
        </div>
        <div className="space-y-4">
          <InputField label="Name" value={editing.name} onChange={v => setEditing(e => e ? { ...e, name: v } : null)} />
          <InputField label="Role / Title" value={editing.role} onChange={v => setEditing(e => e ? { ...e, role: v } : null)} />
          <InputField label="Email" type="email" value={editing.email} onChange={v => setEditing(e => e ? { ...e, email: v } : null)} />
          <InputField label="Bio" value={editing.bio} onChange={v => setEditing(e => e ? { ...e, bio: v } : null)} multiline />
          <ImageUploader label="Profile Picture" value={editing.image} onChange={v => setEditing(e => e ? { ...e, image: v } : null)} />
          <button onClick={save} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>Save Member</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: '#6B7280' }}>{members.length} members</p>
        <button onClick={() => { setEditing(blank); setIsNew(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>
          <Plus size={15} /> Add Member
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map(m => {
          const initials = m.name.split(' ').map(n => n[0]).join('').slice(0, 2);
          return (
            <div key={m.id} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
              {m.image ? (
                <img src={m.image} alt={m.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm" style={{ backgroundColor: '#0A3320', color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}>{initials}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{m.name}</p>
                <p className="text-xs" style={{ color: '#E8521A' }}>{m.role}</p>
                <p className="text-xs mt-1 truncate" style={{ color: '#9CA3AF' }}>{m.email}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => setEditing(m)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit3 size={13} style={{ color: '#6B7280' }} /></button>
                <button onClick={() => del(m.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={13} style={{ color: '#EF4444' }} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── PARTNERS ── */
function PartnersTab() {
  const [items, setItems] = useState<Partner[]>(getPartners());
  const [editing, setEditing] = useState<Partner | null>(null);
  const [isNew, setIsNew] = useState(false);

  const blank: Partner = { id: '', name: '', category: 'NGO', url: '', logo: '' };

  const save = () => {
    if (!editing) return;
    const updated = isNew ? [...items, { ...editing, id: Date.now().toString() }] : items.map(i => i.id === editing.id ? editing : i);
    setItems(updated); savePartners(updated); setEditing(null); setIsNew(false);
  };

  const del = (id: string) => {
    const updated = items.filter(i => i.id !== id); setItems(updated); savePartners(updated);
  };

  if (editing) {
    return (
      <div className="max-w-xl bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{isNew ? 'Add Partner' : 'Edit Partner'}</h3>
          <button onClick={() => { setEditing(null); setIsNew(false); }}><X size={18} style={{ color: '#9CA3AF' }} /></button>
        </div>
        <div className="space-y-4">
          <InputField label="Organization Name" value={editing.name} onChange={v => setEditing(e => e ? { ...e, name: v } : null)} />
          <SelectField label="Category" value={editing.category} options={['Government', 'NGO', 'UN Agency', 'Academic', 'Private Sector', 'Regional Network', 'Other']} onChange={v => setEditing(e => e ? { ...e, category: v } : null)} />
          <InputField label="Website URL" value={editing.url} onChange={v => setEditing(e => e ? { ...e, url: v } : null)} />
          <ImageUploader label="Partner Logo" value={editing.logo} onChange={v => setEditing(e => e ? { ...e, logo: v } : null)} />
          <button onClick={save} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>Save Partner</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: '#6B7280' }}>{items.length} partners</p>
        <button onClick={() => { setEditing(blank); setIsNew(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>
          <Plus size={15} /> Add Partner
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            {item.logo ? (
              <img src={item.logo} alt={item.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
            ) : (
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C', fontFamily: 'Poppins, sans-serif' }}>
                {item.name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{item.name}</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{item.category}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit3 size={13} style={{ color: '#6B7280' }} /></button>
              <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={13} style={{ color: '#EF4444' }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── VOLUNTEERS ── */
function VolunteersTab() {
  const [apps, setApps] = useState<VolunteerApp[]>(getVolunteerApps());

  const updateStatus = (id: string, status: VolunteerApp['status']) => {
    updateVolunteerStatus(id, status);
    setApps(getVolunteerApps());
  };

  const statusColors: Record<VolunteerApp['status'], { bg: string; color: string }> = {
    pending: { bg: '#FFF8E1', color: '#D97706' },
    reviewed: { bg: '#E0F7FA', color: '#0E7490' },
    accepted: { bg: '#E8F5EE', color: '#1A6B3C' },
    rejected: { bg: '#FFEBEE', color: '#C62828' },
  };

  if (apps.length === 0) {
    return <EmptyState icon={Heart} message="No volunteer applications yet. Applications submitted via the Get Involved page will appear here." />;
  }

  return (
    <div className="space-y-4">
      {apps.map(app => {
        const { bg, color } = statusColors[app.status];
        return (
          <div key={app.id} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <p className="font-semibold text-sm" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{app.name}</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color }}>{app.status}</span>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>{new Date(app.date).toLocaleDateString()}</span>
                </div>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>{app.email} · {app.phone}</p>
                <p className="text-xs font-medium mb-2" style={{ color: '#E8521A' }}>Interest: {app.interest}</p>
                {app.skills && <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Skills: {app.skills}</p>}
                {app.message && <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{app.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                {(['pending', 'reviewed', 'accepted', 'rejected'] as VolunteerApp['status'][]).filter(s => s !== app.status).map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(app.id, s)}
                    className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all hover:scale-105"
                    style={{ backgroundColor: statusColors[s].bg, color: statusColors[s].color }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── NEWSLETTER ── */
function NewsletterTab() {
  const subs = getNewsletter();
  if (subs.length === 0) {
    return <EmptyState icon={Mail} message="No newsletter subscribers yet. Signups from the website will appear here." />;
  }
  return (
    <div>
      <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{subs.length} subscribers</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#374151' }}>#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#374151' }}>Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#374151' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td className="px-4 py-3 text-xs" style={{ color: '#9CA3AF' }}>{i + 1}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#1F2937' }}>{s.email}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#9CA3AF' }}>{new Date(s.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── MESSAGES ── */
function MessagesTab() {
  const [messages, setMessages] = useState(getContactMessages());
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const refresh = () => setMessages(getContactMessages());

  const markRead = (id: string) => {
    markMessageRead(id);
    refresh();
  };

  const deleteMsg = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    localStorage.setItem('ycn_contact_messages', JSON.stringify(updated));
    setMessages(updated);
    if (selected === id) setSelected(null);
  };

  const markAllRead = () => {
    messages.filter(m => !m.read).forEach(m => markMessageRead(m.id));
    refresh();
  };

  const filtered = messages.filter(m =>
    filter === 'all' ? true : filter === 'unread' ? !m.read : m.read
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadCount = messages.filter(m => !m.read).length;
  const selectedMsg = messages.find(m => m.id === selected);

  const subjectColor: Record<string, string> = {
    'General Inquiry': '#0E7490',
    'Partnership Proposal': '#7B1FA2',
    'Media & Press Inquiry': '#D97706',
    'Program Information': '#1A6B3C',
    'Volunteer / Internship': '#E8521A',
    'Donation & Funding': '#C62828',
    'Academic / Research Collaboration': '#1565C0',
    'Other': '#6B7280',
  };

  if (messages.length === 0) {
    return <EmptyState icon={MessageSquare} message="No contact messages yet. Messages submitted via the Contact page will appear here." />;
  }

  return (
    <div className="space-y-4">
      {/* Stats + actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB' }}>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{messages.length}</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}>{unreadCount}</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Unread</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#1A6B3C', fontFamily: 'Poppins, sans-serif' }}>{messages.length - unreadCount}</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Read</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter pills */}
          {(['all', 'unread', 'read'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{ backgroundColor: filter === f ? '#0A3320' : '#F3F4F6', color: filter === f ? '#F0ECD8' : '#6B7280' }}>
              {f}
            </button>
          ))}
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 flex items-center gap-1.5"
              style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>
              <CheckCircle size={12} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* List + Detail split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Message list */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>No messages in this filter.</div>
          ) : filtered.map(msg => (
            <button
              key={msg.id}
              onClick={() => { setSelected(msg.id); if (!msg.read) markRead(msg.id); }}
              className="w-full text-left p-4 rounded-xl transition-all duration-150"
              style={{
                backgroundColor: selected === msg.id ? '#EBF5EE' : '#fff',
                border: `1px solid ${selected === msg.id ? '#1A6B3C' : '#E5E7EB'}`,
                borderLeft: `4px solid ${!msg.read ? '#E8521A' : '#E5E7EB'}`,
                boxShadow: selected === msg.id ? '0 2px 12px rgba(26,107,60,0.1)' : 'none',
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-sm truncate" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{msg.name}</p>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>{new Date(msg.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
              <p className="text-xs truncate mb-1" style={{ color: '#E8521A', fontWeight: 500 }}>{msg.subject}</p>
              <p className="text-xs truncate" style={{ color: '#6B7280' }}>{msg.message}</p>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {!selectedMsg ? (
            <div className="flex flex-col items-center justify-center h-full min-h-64 rounded-2xl" style={{ backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB' }}>
              <MessageSquare size={32} style={{ color: '#D1D5DB', marginBottom: 12 }} />
              <p className="text-sm" style={{ color: '#9CA3AF' }}>Select a message to view</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
              {/* Header */}
              <div className="p-5" style={{ borderBottom: '1px solid #F3F4F6', background: 'linear-gradient(135deg, #0A3320 0%, #0D4A28 100%)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold" style={{ color: '#F0ECD8', fontFamily: 'Poppins, sans-serif', fontSize: '1rem' }}>{selectedMsg.name}</p>
                    <a href={`mailto:${selectedMsg.email}`} className="text-xs hover:underline" style={{ color: '#A8C4B0' }}>{selectedMsg.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#F0ECD8' }}>
                      {new Date(selectedMsg.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#F0ECD8' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subjectColor[selectedMsg.subject] || '#6B7280' }} />
                  {selectedMsg.subject}
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.8 }}>
                  {selectedMsg.message}
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 pb-5 flex flex-wrap gap-2" style={{ borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #0A3320, #1A6B3C)', color: '#F0ECD8', boxShadow: '0 2px 8px rgba(10,51,32,0.2)' }}
                >
                  <Mail size={14} /> Reply via Email
                </a>
                {!selectedMsg.read && (
                  <button
                    onClick={() => markRead(selectedMsg.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}
                  >
                    <CheckCircle size={14} /> Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteMsg(selectedMsg.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── DONATIONS ── */
function DonationsTab() {
  const [requests, setRequests] = useState(getDonationRequests());
  const [donations, setDonations] = useState(getDonations());
  const [activeView, setActiveView] = useState<'pending'|'all'>('pending');

  const refresh = () => { setRequests(getDonationRequests()); setDonations(getDonations()); };

  const handleStatus = (id: string, status: 'approved' | 'rejected') => {
    updateDonationRequestStatus(id, status);
    refresh();
  };

  const pending = requests.filter(r => r.status === 'pending');
  const approved = requests.filter(r => r.status === 'approved');
  const rejected = requests.filter(r => r.status === 'rejected');
  const totalConfirmed = donations.reduce((s, d) => s + d.amount, 0);
  const methodColors: Record<string,string> = { bkash:'#E2136E', nagad:'#F7941D', bank:'#1565C0', international:'#1A6B3C' };
  const statusStyle: Record<string,{bg:string;color:string}> = {
    pending: { bg:'#FFF8F0', color:'#E8521A' },
    approved: { bg:'#E8F5EE', color:'#1A6B3C' },
    rejected: { bg:'#FEF2F2', color:'#DC2626' },
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Pending', val: pending.length, color:'#E8521A', bg:'#FFF3EE' },
          { label:'Approved', val: approved.length, color:'#1A6B3C', bg:'#E8F5EE' },
          { label:'Rejected', val: rejected.length, color:'#DC2626', bg:'#FEF2F2' },
          { label:'Total Confirmed', val: `৳${totalConfirmed.toLocaleString()}`, color:'#0E7490', bg:'#E0F7FA' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl" style={{ backgroundColor: s.bg, border: `1px solid ${s.color}20` }}>
            <p className="text-xs font-medium mb-1" style={{ color:'#6B7280' }}>{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily:'Poppins,sans-serif' }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(['pending','all'] as const).map(v => (
          <button key={v} onClick={() => setActiveView(v)}
            className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
            style={{ backgroundColor: activeView===v?'#0A3320':'#F3F4F6', color: activeView===v?'#F0ECD8':'#6B7280' }}>
            {v === 'pending' ? `Pending Requests (${pending.length})` : `All Requests (${requests.length})`}
          </button>
        ))}
      </div>

      {/* Pending requests */}
      {activeView === 'pending' && (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <EmptyState icon={CheckCircle} message="No pending payment requests. All caught up!" />
          ) : pending.map(r => (
            <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border:'1px solid #E5E7EB' }}>
              <div className="px-5 py-3 flex items-center justify-between" style={{ background:'linear-gradient(135deg,#0A3320,#0D4A28)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full uppercase" style={{ backgroundColor: methodColors[r.method]||'#6B7280', color:'#fff' }}>{r.method}</span>
                  <p className="text-sm font-bold" style={{ color:'#F0ECD8', fontFamily:'Poppins,sans-serif' }}>{r.name}</p>
                  <p className="text-xs" style={{ color:'#A8C4B0' }}>{r.email}</p>
                </div>
                <p className="text-xl font-bold" style={{ color:'#E8521A', fontFamily:'Poppins,sans-serif' }}>৳{r.amount.toLocaleString()}</p>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><p className="text-xs text-gray-400 mb-0.5">Phone</p><p className="text-sm font-medium text-gray-700">{r.phone||'—'}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">Type</p><p className="text-sm font-medium capitalize text-gray-700">{r.type}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">Transaction ID</p><p className="text-sm font-bold" style={{ fontFamily:'monospace', color:'#1F2937', letterSpacing:'0.04em' }}>{r.txnId}</p></div>
                <div><p className="text-xs text-gray-400 mb-0.5">Date</p><p className="text-sm text-gray-700">{new Date(r.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p></div>
                {r.note && <div className="col-span-2 sm:col-span-4"><p className="text-xs text-gray-400 mb-0.5">Donor Note</p><p className="text-sm text-gray-600 italic">{r.note}</p></div>}
              </div>
              <div className="px-5 pb-4 flex gap-3" style={{ borderTop:'1px solid #F3F4F6', paddingTop:12 }}>
                <button onClick={() => handleStatus(r.id,'approved')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background:'linear-gradient(135deg,#1A6B3C,#0A3320)', color:'#F0ECD8', boxShadow:'0 2px 12px rgba(26,107,60,0.25)' }}>
                  <CheckCircle size={14} /> Approve & Confirm
                </button>
                <button onClick={() => handleStatus(r.id,'rejected')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor:'#FEF2F2', color:'#DC2626' }}>
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All requests table */}
      {activeView === 'all' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border:'1px solid #E5E7EB' }}>
          {requests.length === 0 ? (
            <EmptyState icon={TrendingUp} message="No donation requests yet." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                  {['Donor','Amount','Method','TXN ID','Date','Status','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color:'#374151' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.slice().reverse().map(r => (
                  <tr key={r.id} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-sm" style={{ color:'#1F2937' }}>{r.name}</p>
                      <p className="text-xs" style={{ color:'#9CA3AF' }}>{r.email}</p>
                    </td>
                    <td className="px-4 py-3 font-bold" style={{ color:'#1A6B3C' }}>৳{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-full uppercase text-white" style={{ backgroundColor: methodColors[r.method]||'#6B7280' }}>{r.method}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color:'#374151' }}>{r.txnId}</td>
                    <td className="px-4 py-3 text-xs" style={{ color:'#9CA3AF' }}>{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full capitalize" style={{ backgroundColor: statusStyle[r.status]?.bg, color: statusStyle[r.status]?.color }}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'pending' && (
                        <div className="flex gap-1">
                          <button onClick={() => handleStatus(r.id,'approved')} className="p-1.5 rounded-lg" style={{ backgroundColor:'#E8F5EE' }} title="Approve"><CheckCircle size={13} style={{ color:'#1A6B3C' }} /></button>
                          <button onClick={() => handleStatus(r.id,'rejected')} className="p-1.5 rounded-lg" style={{ backgroundColor:'#FEF2F2' }} title="Reject"><X size={13} style={{ color:'#DC2626' }} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ── SHARED HELPERS ── */
function InputField({
  label, value, onChange, multiline, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string }) {
  const style = { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', color: '#1F2937', fontFamily: 'Inter, sans-serif' };
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>{label}</label>
      {multiline ? (
        <textarea
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ ...style, resize: 'vertical' }}
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={style}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function SelectField({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>{label}</label>
      <select
        className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
        style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', color: '#1F2937', fontFamily: 'Inter, sans-serif' }}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ComponentType<any>; message: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
      <Icon size={40} className="mx-auto mb-4" style={{ color: '#D1D5DB' }} />
      <p className="text-sm max-w-xs mx-auto" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>{message}</p>
    </div>
  );
}

function ImageUploader({
  label, value, onChange, placeholder = 'Or paste remote image URL...'
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold" style={{ color: '#374151' }}>{label}</label>
      <div 
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-3 bg-gray-50 ${dragActive ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}
        style={{ borderColor: dragActive ? '#1A6B3C' : '#E5E7EB', minHeight: '120px' }}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="relative w-full flex items-center justify-between p-2 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <img src={value} alt="Preview" className="w-16 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 truncate">Selected Image</p>
                <p className="text-xs font-mono text-gray-400 truncate max-w-[200px] sm:max-w-[300px]">{value.startsWith('data:') ? 'Local file uploaded' : value}</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => onChange('')} 
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500 mb-2">Drag & drop your image here, or</p>
            <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>
              Choose Image File
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={e => e.target.files && e.target.files[0] && handleFile(e.target.files[0])} 
              />
            </label>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-400 font-bold uppercase flex-shrink-0">OR</span>
        <input 
          type="text" 
          placeholder={placeholder} 
          value={value.startsWith('data:') ? '' : value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full px-4 py-2.5 rounded-xl text-xs outline-none bg-gray-50 border border-gray-200 focus:border-gray-300"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
      </div>
    </div>
  );
}

/* ── INTERNSHIPS ── */
function InternshipsTab() {
  const [apps, setApps] = useState<InternshipApp[]>(getInternshipApps());
  const [viewing, setViewing] = useState<InternshipApp | null>(null);

  const updateStatus = (id: string, st: InternshipApp['status']) => {
    updateInternshipAppStatus(id, st);
    setApps(getInternshipApps());
  };

  if (viewing) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>Internship Application Details</h3>
          <button onClick={() => setViewing(null)}><X size={18} style={{ color: '#9CA3AF' }} /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 mb-1">Name</p><p className="font-medium">{viewing.name}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Date</p><p className="font-medium">{new Date(viewing.date).toLocaleDateString()}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Email</p><p className="font-medium">{viewing.email}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Phone</p><p className="font-medium">{viewing.phone || 'N/A'}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Program</p><p className="font-medium">{viewing.program}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">University</p><p className="font-medium">{viewing.university}</p></div>
          </div>
          <div><p className="text-xs text-gray-500 mb-1">Skills & Background</p><p className="text-sm bg-gray-50 p-3 rounded-xl">{viewing.skills || 'None provided'}</p></div>
          <div><p className="text-xs text-gray-500 mb-1">Motivation / Message</p><p className="text-sm bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{viewing.message}</p></div>
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Update Status</p>
            <div className="flex gap-2">
              {(['pending', 'reviewed', 'accepted', 'rejected'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(viewing.id, s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    backgroundColor: viewing.status === s ? '#0A3320' : '#F3F4F6',
                    color: viewing.status === s ? '#F0ECD8' : '#4B5563',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Internship Applications</h3>
      <div className="space-y-3">
        {apps.length === 0 && <EmptyState icon={Briefcase} message="No internship applications found. Submissions from the website will appear here." />}
        {apps.slice().reverse().map(app => (
          <div key={app.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-700">
                <Briefcase size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{app.name}</p>
                <p className="text-xs text-gray-500">{app.program} · {new Date(app.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                app.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                app.status === 'accepted' ? 'bg-green-50 text-green-600' :
                app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                {app.status}
              </span>
              <button onClick={() => setViewing(app)} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600">
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PARTNERSHIPS ── */
function PartnershipInquiriesTab() {
  const [inqs, setInqs] = useState<PartnershipInquiry[]>(getPartnershipInquiries());
  const [viewing, setViewing] = useState<PartnershipInquiry | null>(null);

  const updateStatus = (id: string, st: PartnershipInquiry['status']) => {
    updatePartnershipInquiryStatus(id, st);
    setInqs(getPartnershipInquiries());
  };

  if (viewing) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>Partnership Inquiry Details</h3>
          <button onClick={() => setViewing(null)}><X size={18} style={{ color: '#9CA3AF' }} /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 mb-1">Contact Name</p><p className="font-medium">{viewing.name}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Date</p><p className="font-medium">{new Date(viewing.date).toLocaleDateString()}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Organization</p><p className="font-medium">{viewing.org}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Org Type</p><p className="font-medium">{viewing.type}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Email</p><p className="font-medium">{viewing.email}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Phone</p><p className="font-medium">{viewing.phone || 'N/A'}</p></div>
          </div>
          <div><p className="text-xs text-gray-500 mb-1">Message</p><p className="text-sm bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{viewing.message}</p></div>
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Update Status</p>
            <div className="flex gap-2">
              {(['pending', 'reviewed', 'accepted', 'rejected'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(viewing.id, s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    backgroundColor: viewing.status === s ? '#0A3320' : '#F3F4F6',
                    color: viewing.status === s ? '#F0ECD8' : '#4B5563',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Partnership Inquiries</h3>
      <div className="space-y-3">
        {inqs.length === 0 && <EmptyState icon={Handshake} message="No partnership inquiries found. Submissions from the website will appear here." />}
        {inqs.slice().reverse().map(inq => (
          <div key={inq.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-50 text-orange-600">
                <Handshake size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{inq.org}</p>
                <p className="text-xs text-gray-500">{inq.name} · {new Date(inq.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                inq.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                inq.status === 'accepted' ? 'bg-green-50 text-green-600' :
                inq.status === 'rejected' ? 'bg-red-50 text-red-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                {inq.status}
              </span>
              <button onClick={() => setViewing(inq)} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600">
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ── CAROUSEL ── */
function CarouselTab() {
  const [items, setItems] = useState<HeroCarouselItem[]>(getCarouselItems());
  const [editing, setEditing] = useState<HeroCarouselItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const blank: HeroCarouselItem = { id: '', titleEn: '', titleBn: '', image: '', tag: '', headlineEn: '', headlineBn: '', descEn: '', descBn: '' };

  const save = () => {
    if (!editing) return;
    const updated = isNew
      ? [...items, { ...editing, id: Date.now().toString() }]
      : items.map(i => i.id === editing.id ? editing : i);
    setItems(updated);
    saveCarouselItems(updated);
    setEditing(null);
    setIsNew(false);
  };

  const del = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveCarouselItems(updated);
  };

  if (editing) {
    return (
      <div className="max-w-2xl bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{isNew ? 'Add Carousel Item' : 'Edit Carousel Item'}</h3>
          <button onClick={() => { setEditing(null); setIsNew(false); }}><X size={18} style={{ color: '#9CA3AF' }} /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Title (English)" value={editing.titleEn} onChange={v => setEditing(e => e ? { ...e, titleEn: v } : null)} />
            <InputField label="Title (Bengali)" value={editing.titleBn} onChange={v => setEditing(e => e ? { ...e, titleBn: v } : null)} />
          </div>
          <InputField label="Tag" value={editing.tag} onChange={v => setEditing(e => e ? { ...e, tag: v } : null)} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Headline (English)" value={editing.headlineEn} onChange={v => setEditing(e => e ? { ...e, headlineEn: v } : null)} />
            <InputField label="Headline (Bengali)" value={editing.headlineBn} onChange={v => setEditing(e => e ? { ...e, headlineBn: v } : null)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Description (English)" value={editing.descEn} onChange={v => setEditing(e => e ? { ...e, descEn: v } : null)} multiline />
            <InputField label="Description (Bengali)" value={editing.descBn} onChange={v => setEditing(e => e ? { ...e, descBn: v } : null)} multiline />
          </div>
          <ImageUploader label="Background Image URL" value={editing.image} onChange={v => setEditing(e => e ? { ...e, image: v } : null)} />
          <button onClick={save} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>Save Carousel Item</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: '#6B7280' }}>{items.length} items</p>
        <button onClick={() => { setEditing(blank); setIsNew(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>
          <Plus size={15} /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && (
          <div className="col-span-full">
            <EmptyState icon={ImageIcon} message="No carousel items found. Add an item to display it in the hero section." />
          </div>
        )}
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-4">
            {item.image && <img src={item.image} alt="" className="w-full h-32 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{item.tag}</span>
              </div>
              <p className="text-sm font-medium truncate" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{item.titleEn}</p>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit3 size={14} style={{ color: '#6B7280' }} /></button>
              <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={14} style={{ color: '#EF4444' }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaTab() {
  const { data: items = [], mutate } = useMedia();
  const [editing, setEditing] = useState<Partial<MediaItem> | null>(null);
  const [uploading, setUploading] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      if (editing.id) {
        await apiMedia.update(editing.id, editing);
      } else {
        await apiMedia.create(editing as MediaItem);
      }
      mutate();
      setEditing(null);
    }
  };

  const del = async (id: string) => {
    if (confirm('Are you sure you want to delete this media item?')) {
      await apiMedia.delete(id);
      mutate();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const url = await uploadFile(file);
        setEditing({ ...editing, url });
      } catch (err) {
        alert('File upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-lg font-bold" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>Media Management</h3>
          <p className="text-sm" style={{ color: '#6B7280' }}>Manage photos and videos for the Media page.</p>
        </div>
        <button onClick={() => setEditing({ type: 'image' })} className="btn-primary text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5 flex items-center gap-2">
          <Plus size={18} /> <span className="hidden sm:inline">Add Media</span>
        </button>
      </div>

      {editing && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 relative">
          <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
          <h4 className="font-semibold mb-4 text-lg" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>
            {editing.id ? 'Edit Media Item' : 'New Media Item'}
          </h4>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="input-field w-full"
                value={editing.type}
                onChange={e => setEditing({ ...editing, type: e.target.value as any })}
                required
              >
                <option value="image">Image (Photo Gallery)</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label>
              <input type="text" className="input-field w-full" value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (BN)</label>
              <input type="text" className="input-field w-full" value={editing.title_bn || ''} onChange={e => setEditing({ ...editing, title_bn: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category (EN)</label>
              <input type="text" className="input-field w-full" value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category (BN)</label>
              <input type="text" className="input-field w-full" value={editing.category_bn || ''} onChange={e => setEditing({ ...editing, category_bn: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (Image/Video)</label>
              <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100" onChange={handleFileUpload} accept={editing.type === 'image' ? 'image/*' : 'video/*'} disabled={uploading} />
              {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Or enter URL directly</label>
              <input type="text" className="input-field w-full" value={editing.url || ''} onChange={e => setEditing({ ...editing, url: e.target.value })} required />
            </div>
            {editing.type === 'video' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g. 5:30)</label>
                <input type="text" className="input-field w-full" value={editing.duration || ''} onChange={e => setEditing({ ...editing, duration: e.target.value })} />
              </div>
            )}
            <div className="md:col-span-2 mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A6B3C] transition-colors shadow-sm">Cancel</button>
              <button type="submit" className="btn-primary flex items-center gap-2 text-sm px-5 py-2 shadow-sm" disabled={uploading}><Save size={16} /> Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.length === 0 && !editing && (
          <div className="col-span-full">
            <EmptyState icon={ImageIcon} message="No media items found. Add an item to display it in the gallery." />
          </div>
        )}
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-4 border border-gray-100">
            {item.url && item.type === 'image' && <img src={item.url} alt="" className="w-full h-40 rounded-lg object-cover bg-gray-50" />}
            {item.url && item.type === 'video' && (
               <div className="w-full h-40 rounded-lg bg-gray-100 flex items-center justify-center">
                 <span className="text-gray-500 font-medium">Video</span>
               </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{item.type}</span>
                {item.category && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{item.category}</span>}
              </div>
              <p className="text-sm font-semibold truncate" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{item.title}</p>
            </div>
            <div className="flex justify-end gap-2 mt-2 border-t border-gray-50 pt-3">
              <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit3 size={16} style={{ color: '#6B7280' }} /></button>
              <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={16} style={{ color: '#EF4444' }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
