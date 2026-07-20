import { useState, useEffect, useRef } from 'react';
import { SEO } from './ui/SEO';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Scale, BookOpen, Droplets, Shield, Leaf, Zap,
  ArrowRight, Calendar, MapPin, TreePine, Globe, Heart, Users,
  Brain, Waves, Building2, Bird
} from 'lucide-react';
import { apiNewsletter } from '../lib/api';
import { useStats, useNews, useEvents, useCarousel } from '../lib/api';
import type { NewsItem, EventItem, HeroCarouselItem } from '../lib/storage';
import { CarouselSkeleton, CardSkeleton } from './ui/Skeletons';
import logo1 from '../../imports/Asset_1.webp';
import heroBgOrange from '../../imports/image-3.webp';
import { useLanguage } from '../lib/LanguageContext';

/* ───── COUNTER HOOK ───── */
function useCountUp(end: number, duration = 2200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let t = 0;
    const step = (ts: number) => {
      if (!t) t = ts;
      const p = Math.min((ts - t) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);
  return { count, ref };
}

/* ───── FADE VARIANTS ───── */
const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ───── DATA ───── */
const programs = [
  { icon: Scale, title: 'Climate Justice & Advocacy', desc: 'Representing frontline youth at UNFCCC/COP and driving systemic policy change.', color: '#1A6B3C', light: '#E8F5EE', path: '/our-work/climate-justice' },
  { icon: BookOpen, title: 'Education & Research', desc: 'Building climate literacy from classrooms to communities, producing policy-shaping research.', color: '#0E7490', light: '#E0F7FA', path: '/our-work/education' },
  { icon: Droplets, title: 'WASH', desc: 'Safe drinking water, dignified sanitation, and hygiene education for coastal communities.', color: '#1565C0', light: '#E3F2FD', path: '/our-work/wash' },
  { icon: Shield, title: 'Disaster Risk Management', desc: 'Community preparedness and rapid response for climate-induced floods and cyclones.', color: '#7B1FA2', light: '#F3E5F5', path: '/our-work/disaster-risk' },
  { icon: Leaf, title: 'Sustainable Livelihoods', desc: 'Climate-smart agriculture, alternative incomes, and resilient food systems.', color: '#2E7D32', light: '#E8F5E9', path: '/our-work/sustainable-livelihoods' },
  { icon: Zap, title: 'Renewable Energy', desc: 'Solar & biogas access for off-grid households while tackling plastic and e-waste.', color: '#E65100', light: '#FFF3E0', path: '/our-work/renewable-energy' },
  { icon: TreePine, title: 'Biodiversity in Action', desc: 'Protecting natural habitats, large-scale afforestation, and preserving biodiversity.', color: '#33691E', light: '#F1F8E9', path: '/our-work/biodiversity' },
  { icon: Bird, title: 'Wildlife & Welfare', desc: 'Protecting endangered species and ensuring welfare for wildlife in climate-vulnerable zones.', color: '#827717', light: '#F9FBE7', path: '/our-work/wildlife' },
  { icon: Brain, title: 'Mental Health & Psychosocial Support', desc: 'Connecting survivors to psychosocial support and specialized climate-anxiety care.', color: '#00695C', light: '#E0F2F1', path: '/our-work/mental-health' },
  { icon: Waves, title: 'Coastal & Marine Ecosystem Protection', desc: 'Restoring mangrove forests and protecting fragile coastlines from cyclones and tidal surges.', color: '#0277BD', light: '#E1F5FE', path: '/our-work/coastal-marine' },
  { icon: Building2, title: 'Urban Climate Resilience', desc: 'Building resilience against urban flooding, heat stress, and infrastructure strain in cities.', color: '#EF6C00', light: '#FFF3E0', path: '/our-work/urban-climate' },
];

const partners = [
  'ICCCAD', 'Shuloban', 'Humanity Public Library', 'RizQara Tech', 'EDS',
  'শিশুদের জন্য আমরা', 'Youth for coastal Resilience (YCR)', 'Dept of Youth Development',
  'Initiative of coastal development - ICD', 'Moner Alo', 'Rohingya Green Nature Society (RGNS)'
];

/* ───── SUB-COMPONENTS ───── */
function StatCounter({ value, label, suffix = '+', delay = 0 }: { value: number; label: string; suffix?: string; delay?: number }) {
  const { count, ref } = useCountUp(value);
  const { t, lang } = useLanguage();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="text-center py-6 px-4 group"
    >
      <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 900, fontFamily: 'Poppins, sans-serif', color: '#E8521A', lineHeight: 1, whiteSpace: 'nowrap' }}>
        {lang === 'en' ? count.toLocaleString() : count.toLocaleString('bn-BD')}{suffix}
      </div>
      <div className="mt-2 uppercase tracking-widest" style={{ fontSize: '0.6rem', color: '#8AB49A', fontFamily: 'Inter, sans-serif', fontWeight: 500, lineHeight: 1.4 }}>
        {t(label)}
      </div>
    </motion.div>
  );
}

function ProgramCard({ program }: { program: typeof programs[0] }) {
  const { t } = useLanguage();
  const Icon = program.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.10)' }}
    >
      <Link
        to={program.path}
        className="flex flex-col h-full rounded-2xl overflow-hidden group"
        style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0', transition: 'all 0.3s ease' }}
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${program.color}, ${program.color}60)` }} />
        <div className="p-6 flex flex-col flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: program.light }}
          >
            <Icon size={22} style={{ color: program.color }} />
          </div>
          <h3 className="mb-3 leading-snug" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
            {t(program.title)}
          </h3>
          <p className="text-sm leading-relaxed flex-1" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{t(program.desc)}</p>
          <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold transition-all group-hover:gap-2.5" style={{ color: program.color }}>
            {t('Learn more')} <ArrowRight size={13} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const { t, lang } = useLanguage();
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0', transition: 'box-shadow 0.3s ease' }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          style={{ transition: 'transform 0.6s ease' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
        <span
          className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: '#E8521A', color: '#fff', fontFamily: 'Inter, sans-serif' }}
        >
          {t(item.category)}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs mb-2" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
          {new Date(item.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h3 className="font-semibold mb-3 flex-1 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#111827', fontSize: '0.97rem', lineHeight: 1.5 }}>
          {t(item.title)}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
          {t(item.excerpt)}
        </p>
        <Link
          to="/impact"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif' }}
        >
          {t('Read more')} <ArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

function EventRow({ event }: { event: EventItem }) {
  const { t, lang } = useLanguage();
  const d = new Date(event.date);
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:shadow-md transition-all duration-200 group" style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0' }}>
      <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0A3320, #1A6B3C)' }}>
        <span className="text-xs font-bold" style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}>{d.toLocaleDateString(lang === 'en' ? 'en' : 'bn-BD', { month: 'short' })}</span>
        <span style={{ color: '#F0ECD8', fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.2rem', lineHeight: 1 }}>
          {lang === 'en' ? d.getDate() : d.getDate().toLocaleString('bn-BD')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{t(event.type)}</span>
        <p className="text-sm font-semibold mt-1.5 leading-snug" style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}>{t(event.title)}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} style={{ color: '#9CA3AF' }} />
          <span className="text-xs" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>{t(event.location)}</span>
        </div>
      </div>
      <ArrowRight size={16} className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#E8521A' }} />
    </div>
  );
}

/* ───── HERO ACCORDION ───── */

function HeroAccordion() {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [heroCards, setHeroCards] = useState<HeroCarouselItem[]>([]);
  const { t } = useLanguage();
  const { data: carouselData, isLoading } = useCarousel();

  useEffect(() => {
    if (carouselData) setHeroCards(carouselData);
  }, [carouselData]);

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  return (
    <section className="relative w-full h-[85svh] sm:h-[90svh] min-h-[560px] sm:min-h-[600px] flex items-center justify-center bg-[#0A3320] p-4 sm:p-8 pt-24 sm:pt-32 pb-8 sm:pb-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #082819 0%, #0A3320 50%, #0D3E27 100%)' }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto flex flex-col sm:flex-row gap-2 sm:gap-4">
        {heroCards.map((card, index) => {
          const isActive = hoveredIndex === index;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(index)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer ${
                isActive ? 'min-h-0 sm:min-w-0' : 'min-h-[48px] sm:min-h-0 min-w-0 sm:min-w-[clamp(40px,10vw,70px)]'
              }`}
              style={{
                flex: isActive ? 12 : 1,
                transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt={t(card.titleEn, card.titleBn)}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: isActive ? 'brightness(0.9) saturate(1.1)' : 'brightness(0.5) grayscale(30%)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
              
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0" 
                style={{ 
                  background: isActive 
                    ? 'linear-gradient(to right, rgba(10,51,32,0.95) 0%, rgba(10,51,32,0.5) 45%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(10,51,32,0.9) 0%, transparent 100%)',
                  transition: 'background 0.8s ease'
                }} 
              />

              {/* Collapsed State Text */}
              <div
                className="absolute inset-0 flex items-center justify-center sm:items-end sm:justify-center sm:pb-8"
                style={{
                  opacity: isActive ? 0 : 1,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: isActive ? 'none' : 'auto'
                }}
              >
                {/* Desktop Vertical Text */}
                <span
                  className="hidden sm:block text-white font-bold tracking-widest uppercase whitespace-nowrap"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(0.7rem, 1vw, 1rem)'
                  }}
                >
                  {t(card.titleEn, card.titleBn)}
                </span>
                {/* Mobile Horizontal Text */}
                <span
                  className="sm:hidden text-white font-bold tracking-widest uppercase whitespace-nowrap"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem'
                  }}
                >
                  {t(card.titleEn, card.titleBn)}
                </span>
              </div>

              {/* Expanded Content */}
              <div
                className="absolute inset-0 p-4 sm:p-12 flex flex-col justify-end sm:justify-center"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.6s ease 0.2s',
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: 'rgba(232,82,26,0.15)', border: '1px solid rgba(232,82,26,0.3)', backdropFilter: 'blur(8px)' }}>
                    <span style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                      {t(card.tag, card.tag)}
                    </span>
                  </div>
                  
                  <h2 style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(1.4rem, 5vw, 4rem)',
                    color: '#F0ECD8',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem'
                  }}>
                    {t(card.headlineEn, card.headlineBn)}
                  </h2>
                  
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)',
                    color: '#A8E6BB',
                    lineHeight: 1.5,
                    marginBottom: '1.5rem',
                    maxWidth: '480px'
                  }}>
                    {t(card.descEn, card.descBn)}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/our-work"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #E8521A, #D97706)', color: '#fff', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 20px rgba(232,82,26,0.4)' }}
                    >
                      {t('Explore Our Work', 'আমাদের কার্যক্রম দেখুন')} <ArrowRight size={15} />
                    </Link>
                    <Link
                      to="/get-involved"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all hover:scale-105 hover:bg-white/10"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#F0ECD8', border: '1px solid rgba(255,255,255,0.18)', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(8px)' }}
                    >
                      {t('Get Involved', 'যুক্ত হোন')}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      

    </section>
  );
}

/* ───── MAIN COMPONENT ───── */
export function HomePage() {
  const { t } = useLanguage();
  const { data: stats = { peopleReached: 0, treesPlanted: 0, volunteers: 0, projects: 0, partners: 0, districts: 0 } as any } = useStats();
  const { data: allNews, isLoading: newsLoading } = useNews();
  const { data: allEvents, isLoading: eventsLoading } = useEvents();
  
  const news = allNews ? allNews.slice(0, 3) : [];
  const events = allEvents ? allEvents.slice(0, 4) : [];
  
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
        // If it's a generic error but we still want to show exists
        setSubStatus('exists');
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubStatus(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Youth Climate Network" 
        description="Join the Youth Climate Network in our mission to empower young leaders, advocate for sustainable policies, and drive climate action in Bangladesh and globally."
        keywords="youth climate network, climate action bangladesh, youth leadership, sustainable energy, environmental advocacy, climate change solutions, youth empowerment"
      />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <HeroAccordion />

      {/* ══════════════════════════════════════════
          MARQUEE PARTNERS STRIP
      ══════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden py-3.5"
        style={{ background: 'linear-gradient(135deg, #E8521A 0%, #D97706 100%)' }}
      >
        <div className="flex marquee-track" style={{ width: 'max-content', gap: '3rem' }}>
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="whitespace-nowrap text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}>
              {p} <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '1rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          IMPACT STATS
      ══════════════════════════════════════════ */}
      <section className="relative py-20" style={{ backgroundColor: '#0A3320' }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-3" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              {t('Our Reach Since 2022', '২০২২ সাল থেকে আমাদের অবদান')}
            </motion.p>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', color: '#F0ECD8', letterSpacing: '-0.02em' }}>
              {t('Impact at Scale', 'ব্যাপক পরিসরে প্রভাব')}
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { v: stats.districts, l: 'District', d: 0 },
              { v: stats.partners, l: 'Partner Org', d: 0.08 },
              { v: stats.projects, l: 'Completed Project', d: 0.16 },
              { v: stats.volunteers, l: 'Volunteer', d: 0.24 },
              { v: stats.treesPlanted, l: 'Trees plantation', d: 0.32 },
              { v: stats.peopleReached, l: 'People reached', d: 0.4 },
            ].map(({ v, l, d }) => (
              <div key={l} className="rounded-2xl py-5 px-2 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', minWidth: 0 }}>
                <StatCounter value={v} label={l} delay={d} />
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Thin orange brand strip separator */}
      <div style={{ lineHeight: 0, height: '12px' }} className="relative overflow-hidden w-full">
        <img src={heroBgOrange} alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,51,32,0.3) 0%, transparent 50%, rgba(10,51,32,0.3) 100%)' }} />
      </div>

      {/* ══════════════════════════════════════════
          WHO WE ARE
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-3" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{t('01 — Who We Are', '০১ — আমরা কে')}</motion.p>
              <motion.h2 variants={fadeUp} className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {t('Youth-Led. Justice-Driven.', 'যুব-নেতৃত্বাধীন। ন্যায়বিচার-চালিত।')}<br /><span style={{ color: '#1A6B3C' }}>{t('Community-Owned.', 'জনগণের মালিকানাধীন।')}</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-5" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
                {t('Youth Climate Network (YCN) is a grassroots, youth-led non-profit established in Bangladesh — operating at the forefront of climate justice and environmental advocacy across Asia Pacific and South Asia.', 'ইয়ুথ ক্লাইমেট নেটওয়ার্ক (ওয়াইসিএন) হল বাংলাদেশে প্রতিষ্ঠিত একটি তৃণমূল, যুব-নেতৃত্বাধীন অলাভজনক সংস্থা — যা এশিয়া প্যাসিফিক এবং দক্ষিণ এশিয়া জুড়ে জলবায়ু ন্যায়বিচার এবং পরিবেশগত অ্যাডভোকেসির অগ্রভাগে কাজ করছে।')}
              </motion.p>
              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-8" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
                {t('We bridge the gap between local grassroots action and regional policy platforms, ensuring frontline youth voices are heard where decisions are made. Bangladesh contributes less than 0.5% of global emissions yet faces existential climate threats — we advocate fiercely for those bearing the greatest burden.', 'আমরা স্থানীয় তৃণমূলের পদক্ষেপ এবং আঞ্চলিক নীতি নির্ধারণী প্ল্যাটফর্মের মধ্যে ব্যবধান দূর করি, এটি নিশ্চিত করে যে সিদ্ধান্ত গ্রহণের স্থানগুলোতে ফ্রন্টলাইন তরুণদের কণ্ঠস্বর শোনা যায়। বাংলাদেশ বৈশ্বিক নির্গমনের ০.৫%-এরও কম অবদান রাখে অথচ অস্তিত্বের জলবায়ু হুমকির সম্মুখীন — আমরা সবচেয়ে বেশি বোঝা বহনকারীদের পক্ষে জোরালোভাবে কথা বলি।')}
              </motion.p>
              <motion.div variants={stagger} className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { l: '15 Program Pillars', bnL: '১৫টি প্রোগ্রাম পিলার', d: 'All dimensions of climate vulnerability', bnD: 'জলবায়ু ঝুঁকির সমস্ত মাত্রা' },
                  { l: 'Asia Pacific Reach', bnL: 'এশিয়া প্যাসিফিক জুড়ে সম্প্রসারণ', d: 'Regional representation at global forums', bnD: 'বিশ্ব দরবারে আঞ্চলিক প্রতিনিধিত্ব' },
                  { l: 'Youth-Led Governance', bnL: 'যুব-নেতৃত্বাধীন পরিচালনা', d: 'Democratic, transparent, accountable', bnD: 'গণতান্ত্রিক, স্বচ্ছ, দায়বদ্ধ' },
                  { l: 'Officially Registered', bnL: 'অফিসিয়ালি নিবন্ধিত', d: 'DYD/Khulna/Reg-104, GoB', bnD: 'ডিওয়াইডি/খুলনা/নিবন্ধন-১০৪, বাংলাদেশ সরকার' },
                ].map(({ l, bnL, d, bnD }) => (
                  <motion.div key={l} variants={fadeUp} className="p-4 rounded-xl bg-white" style={{ border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#111827' }}>{t(l, bnL)}</p>
                    <p className="text-xs leading-snug" style={{ color: '#6B7280' }}>{t(d, bnD)}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0A3320, #1A6B3C)', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                >
                  {t('Learn More About YCN', 'ওয়াইসিএন সম্পর্কে আরও জানুন')} <ArrowRight size={15} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — Dark card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0A3320 0%, #0D4028 100%)', boxShadow: '0 32px 64px rgba(10,51,32,0.3)' }}>
                {/* Decorative ring */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(#E8521A, transparent 70%)', transform: 'translate(30%, -30%)' }} />

                <div className="flex justify-center mb-8">
                  <img src={logo1} alt="YCN" style={{ height: 110, width: 'auto', filter: 'drop-shadow(0 0 20px rgba(232,82,26,0.2))' }} />
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Globe, label: 'Our Vision', bnL: 'আমাদের ভিশন', text: 'A climate-resilient, environmentally just South Asia & Asia Pacific where every young person can shape a thriving planet.', bnT: 'একটি জলবায়ু-সহনশীল, পরিবেশগতভাবে ন্যায়সঙ্গত দক্ষিণ এশিয়া এবং এশিয়া প্যাসিফিক যেখানে প্রতিটি তরুণ একটি সমৃদ্ধ পৃথিবী গড়ে তুলতে পারে।' },
                    { icon: TreePine, label: 'Our Mission', bnL: 'আমাদের মিশন', text: 'Mobilize, equip, and amplify youth power to drive transformative climate action and sustainable development.', bnT: 'রূপান্তরমূলক জলবায়ু পদক্ষেপ এবং টেকসই উন্নয়ন পরিচালনার জন্য তরুণদের একত্রিত, সজ্জিত এবং তাদের কণ্ঠকে প্রসারিত করা।' },
                    { icon: Heart, label: 'Our Values', bnL: 'আমাদের মূল্যবোধ', text: 'Climate Justice · Youth Leadership · Inclusivity · Community Ownership · Transparency · Science', bnT: 'জলবায়ু ন্যায়বিচার · যুব নেতৃত্ব · অন্তর্ভুক্তি · জনগণের মালিকানা · স্বচ্ছতা · বিজ্ঞান' },
                  ].map(({ icon: Icon, label, bnL, text, bnT }) => (
                    <div key={label} className="flex gap-3.5 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(232,82,26,0.15)' }}>
                        <Icon size={16} style={{ color: '#E8521A' }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#F0ECD8', fontFamily: 'Poppins, sans-serif' }}>{t(label, bnL)}</p>
                        <p className="text-xs leading-relaxed" style={{ color: '#7A9E8A', fontFamily: 'Inter, sans-serif' }}>{t(text, bnT)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating dots decoration */}
              <div className="absolute -bottom-5 -right-5 w-28 h-28 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #E8521A 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Thin orange brand strip separator */}
      <div style={{ lineHeight: 0, height: '12px' }} className="relative overflow-hidden w-full">
        <img src={heroBgOrange} alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,51,32,0.3) 0%, transparent 50%, rgba(10,51,32,0.3) 100%)' }} />
      </div>

      {/* ══════════════════════════════════════════
          FEATURED PROGRAMS
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-3" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{t('02 — Our Work', '০২ — আমাদের কাজ')}</motion.p>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', color: '#111827', letterSpacing: '-0.02em' }}>
              {t('15 Program Pillars', '১৫টি প্রোগ্রাম পিলার')}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-xl mx-auto" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.7 }}>
              {t('Six featured focus areas addressing key dimensions of climate vulnerability and sustainable development from our 15 strategic program pillars.', 'আমাদের ১৫টি কৌশলগত প্রোগ্রাম পিলারের মধ্য থেকে জলবায়ু ঝুঁকি এবং টেকসই উন্নয়নের প্রধান মাত্রাগুলো মোকাবেলায় ছয়টি বিশেষ ফোকাস ক্ষেত্র।')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {programs.map((p) => <ProgramCard key={p.title} program={p} />)}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-10"
          >
            <Link
              to="/our-work"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #0A3320, #1A6B3C)', color: '#F0ECD8', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 16px rgba(10,51,32,0.2)' }}
            >
              {t('View All 15 Programs', 'সকল ১৫টি প্রোগ্রাম দেখুন')} <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Thin orange brand strip separator */}
      <div style={{ lineHeight: 0, height: '12px' }} className="relative overflow-hidden w-full">
        <img src={heroBgOrange} alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,51,32,0.3) 0%, transparent 50%, rgba(10,51,32,0.3) 100%)' }} />
      </div>

      {/* ══════════════════════════════════════════
          NEWS & EVENTS
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-2" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{t('03 — Latest News', '০৩ — সর্বশেষ খবর')}</motion.p>
              <motion.h2 variants={fadeUp} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: '#111827', letterSpacing: '-0.02em' }}>
                {t('News & Stories', 'খবর ও কাহিনী')}
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link to="/impact" className="inline-flex items-center gap-1.5 text-sm font-semibold group" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif' }}>
                {t('View all news', 'সব খবর দেখুন')} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* News grid */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
          >
            {newsLoading ? (
              Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
            ) : news.map((item) => <NewsCard key={item.id} item={item} />)}
          </motion.div>

          {/* Events */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-2"
            >
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-2" style={{ color: '#D97706', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{t('04 — Calendar', '০৪ — ক্যালেন্ডার')}</motion.p>
              <motion.h2 variants={fadeUp} className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2,-rem)', color: '#111827', letterSpacing: '-0.02em' }}>
                {t('Upcoming Events', 'আগামী ইভেন্টসমূহ')}
              </motion.h2>
              <motion.p variants={fadeUp} className="mb-8" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
                {t("Join YCN's workshops, advocacy forums, campaigns, and leadership training programs across 2025.", '২০২৫ সাল জুড়ে ওয়াইসিএন-এর কর্মশালা, অ্যাডভোকেসি ফোরাম, প্রচারাভিযান এবং নেতৃত্ব প্রশিক্ষণ কর্মসূচিতে যোগ দিন।')}
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/get-involved"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #E8521A, #D97706)', color: '#fff', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 16px rgba(232,82,26,0.3)' }}
                >
                  <Calendar size={15} /> {t('Register for Events', 'ইভেন্টের জন্য নিবন্ধন করুন')}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              variants={stagger}
              className="lg:col-span-3 space-y-3"
            >
              {eventsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-[120px] bg-white rounded-2xl p-4 flex gap-4">
                    <div className="w-[80px] h-full bg-gray-100 rounded-xl animate-pulse" />
                    <div className="flex-1 flex flex-col justify-center gap-2">
                      <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
                      <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse mt-2" />
                    </div>
                  </div>
                ))
              ) : events.map(ev => (
                <motion.div key={ev.id} variants={fadeUp}>
                  <EventRow event={ev} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Thin orange brand strip separator */}
      <div style={{ lineHeight: 0, height: '12px' }} className="relative overflow-hidden w-full">
        <img src={heroBgOrange} alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,51,32,0.3) 0%, transparent 50%, rgba(10,51,32,0.3) 100%)' }} />
      </div>

      {/* ══════════════════════════════════════════
          QUOTE / MISSION CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#061912' }}>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,25,18,0.95) 0%, rgba(10,51,32,0.80) 50%, rgba(6,25,18,0.95) 100%)' }} />

        {/* Faded YCN logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <img
            src={logo1}
            alt=""
            className="select-none"
            style={{
              width: 'clamp(280px, 45vw, 500px)',
              height: 'clamp(280px, 45vw, 500px)',
              objectFit: 'contain',
              opacity: 0.05,
              filter: 'brightness(2) saturate(0)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} style={{ fontSize: '3.5rem', color: '#E8521A', fontFamily: 'Georgia, serif', lineHeight: 1 }} className="mb-4">"</motion.div>
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(1rem, 2.5vw, 1.45rem)',
                color: '#E8E0CC',
                lineHeight: 1.65,
                letterSpacing: '-0.01em',
              }}
            >
              {t(
                'The climate crisis is the defining challenge of our generation. But it is also the greatest opportunity — to reimagine our relationship with the earth, to build more just and equitable societies, and to demonstrate that when young people are given the tools and the trust, they can change the world.',
                'জলবায়ু সংকট আমাদের প্রজন্মের সবচেয়ে বড় চ্যালেঞ্জ। তবে এটি একটি অনন্য সুযোগও — পৃথিবীর সাথে আমাদের সম্পর্ককে নতুন করে সাজানোর, আরও ন্যায়পরায়ণ ও সমতাভিত্তিক সমাজ গড়ে তোলার এবং এটি প্রমাণ করার যে তরুণদের যখন উপযুক্ত সুযোগ ও বিশ্বাস দেওয়া হয়, তখন তারা বিশ্বকে পরিবর্তন করতে পারে।'
              )}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-5 mb-10" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.04em' }}>
              — {t('YOUTH CLIMATE NETWORK', 'ইয়ুথ ক্লাইমেট নেটওয়ার্ক')}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/get-involved"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #E8521A, #D97706)', color: '#fff', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 20px rgba(232,82,26,0.35)' }}
              >
                {t('Join the Movement', 'আন্দোলনে যোগ দিন')} <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
              >
                {t('Partner With Us', 'আমাদের সাথে অংশীদার হন')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Thin orange brand strip separator */}
      <div style={{ lineHeight: 0, height: '12px' }} className="relative overflow-hidden w-full">
        <img src={heroBgOrange} alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,51,32,0.3) 0%, transparent 50%, rgba(10,51,32,0.3) 100%)' }} />
      </div>

      {/* ══════════════════════════════════════════
          NEWSLETTER (STAY INFORMED)
      ══════════════════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="relative overflow-hidden rounded-3xl p-10 sm:p-20 shadow-2xl border border-white/50 text-center"
            style={{
              backgroundColor: '#0A3320',
              boxShadow: '0 25px 60px rgba(10,51,32,0.2)',
            }}
          >
            {/* Ambient orange glow inside card */}
            <div className="absolute inset-0 pointer-events-none opacity-15" style={{ background: 'radial-gradient(circle at 50% 50%, #E8521A 0%, transparent 60%)' }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-8 border transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(232,82,26,0.25) 0%, rgba(232,82,26,0.05) 100%)',
                  borderColor: 'rgba(232,82,26,0.4)',
                  boxShadow: '0 0 20px rgba(232,82,26,0.2)'
                }}
              >
                <Users size={24} style={{ color: '#E8521A' }} />
              </motion.div>

              <motion.h3
                variants={fadeUp}
                className="mb-4"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 4.5vw, 2.75rem)',
                  color: '#F0ECD8',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15
                }}
              >
                {t('Stay Informed', 'সবসময় অবগত থাকুন')}
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="mb-10 text-base sm:text-lg leading-relaxed"
                style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}
              >
                {t('Subscribe for climate updates, advocacy alerts, program news, and event invitations.', 'জলবায়ু আপডেট, অ্যাডভোকেসি অ্যালার্ট, প্রোগ্রাম সংবাদ এবং ইভেন্ট আমন্ত্রণের জন্য সাবস্ক্রাইব করুন।')}
              </motion.p>

              <motion.form variants={fadeUp} onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder={t('your@email.com')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4.5 rounded-xl text-base outline-none transition-all duration-200 border"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.1)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4.5 rounded-xl text-base font-semibold transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center min-w-[140px]"
                  style={{
                    background: 'linear-gradient(135deg, #E8521A, #D97706)',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 6px 20px rgba(232,82,26,0.35)'
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    t('Subscribe Free', 'বিনামূল্যে সাবস্ক্রাইব করুন')
                  )}
                </button>
              </motion.form>

              {subStatus === 'success' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm font-medium" style={{ color: '#8AB49A' }}>
                  ✓ {t("You're subscribed! Thank you for joining.", '✓ আপনি সাবস্ক্রাইব করেছেন! যুক্ত হওয়ার জন্য ধন্যবাদ।')}
                </motion.p>
              )}
              {subStatus === 'exists' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm font-medium" style={{ color: '#E8521A' }}>
                  {t('This email is already subscribed.', 'এই ইমেলটি ইতিপূর্বে সাবস্ক্রাইব করা হয়েছে।')}
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


