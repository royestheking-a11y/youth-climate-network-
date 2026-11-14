import { useState, useEffect, useRef, useMemo } from 'react';
import { SEO } from './ui/SEO';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowRight, Calendar, MapPin, TreePine, Globe, Heart, Users,
  CheckCircle2, Handshake, ShieldCheck, Award, ChevronLeft, ChevronRight, Clock,
  ChevronDown, MessageCircle, Search, Sparkles
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { apiNewsletter, apiProgram } from '../lib/api';
import { useStats, useNews, useEvents, useCarousel, usePartners, useBlogs, useFaqs } from '../lib/api';
import type { NewsItem, EventItem, HeroCarouselItem, BlogPost, FaqItem } from '../lib/storage';
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
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ───── SUB-COMPONENTS ───── */
function StatCounter({ value, label, suffix = '+', delay = 0, icon: Icon }: { value: number; label: string; suffix?: string; delay?: number; icon?: React.ComponentType<any> }) {
  const { count, ref } = useCountUp(value);
  const { t, lang } = useLanguage();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-6 px-3 group flex flex-col items-center justify-center h-full relative"
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-white/[0.08] group-hover:bg-[#E8521A]/20 text-[#E8521A] flex items-center justify-center mb-3 transition-all duration-300 shadow-sm border border-white/10 group-hover:border-[#E8521A]/30 group-hover:scale-110">
          <Icon size={18} />
        </div>
      )}
      <div
        className="font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FBBF24]"
        style={{ fontSize: 'clamp(1.35rem, 2.6vw, 2.1rem)', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}
      >
        {lang === 'en' ? count.toLocaleString() : count.toLocaleString('bn-BD')}{suffix}
      </div>
      <div className="mt-2.5 uppercase tracking-wider text-[11px] font-semibold text-[#8AB49A] font-inter group-hover:text-white transition-colors duration-200 line-clamp-1">
        {t(label)}
      </div>
    </motion.div>
  );
}

function ProgramCard({ program }: { program: any }) {
  const { t } = useLanguage();
  const Icon = (Icons as any)[program.iconName || 'Box'] || Icons.Box;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        to={`/our-work/${program.slug}`}
        className="flex flex-col h-full rounded-2xl overflow-hidden group bg-white border border-gray-100 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(26,107,60,0.08)] relative"
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${program.color || '#1A6B3C'}, ${program.color || '#1A6B3C'}60)` }} />
        <div className="p-6 sm:p-7 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm"
              style={{ backgroundColor: program.bg || '#E8F5EE' }}
            >
              <Icon size={22} style={{ color: program.color || '#1A6B3C' }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 group-hover:bg-emerald-50 group-hover:text-[#1A6B3C] transition-colors border border-gray-100">
              Pillar
            </span>
          </div>
          <h3 className="mb-2.5 leading-snug font-bold text-gray-900 group-hover:text-[#1A6B3C] transition-colors font-poppins text-lg">
            {t(program.title, program.title_bn)}
          </h3>
          <p className="text-sm leading-relaxed flex-1 text-gray-600 font-inter line-clamp-3">
            {t(program.description, program.description_bn)}
          </p>
          <div className="flex items-center gap-1.5 mt-6 text-xs font-bold transition-all group-hover:gap-2.5" style={{ color: program.color || '#1A6B3C' }}>
            <span>{t('Explore Program', 'প্রোগ্রাম দেখুন')}</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
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
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl overflow-hidden flex flex-col border border-gray-100 hover:border-emerald-500/20 shadow-sm hover:shadow-xl transition-all duration-300 group h-full"
    >
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <span
          className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm"
          style={{ backgroundColor: '#E8521A', fontFamily: 'Inter, sans-serif' }}
        >
          {t(item.category)}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-inter mb-2.5">
          <Calendar size={12} />
          <span>{new Date(item.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <h3 className="font-bold mb-3 flex-1 line-clamp-2 text-gray-900 group-hover:text-[#1A6B3C] transition-colors font-poppins text-base leading-snug">
          {t(item.title)}
        </h3>
        <p className="text-sm mb-5 line-clamp-2 text-gray-600 font-inter leading-relaxed">
          {t(item.excerpt)}
        </p>
        <Link
          to={item.category === 'Blog' ? `/blog` : `/impact`}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8521A] group-hover:text-[#c73e0d] transition-colors mt-auto font-inter"
        >
          <span>{t('Read story', 'পড়ুন')}</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

function HomeBlogCard({ blog }: { blog: BlogPost }) {
  const { t, lang } = useLanguage();
  const title = (lang === 'bn' && blog.title_bn ? blog.title_bn : blog.title) || '';
  const excerpt = (lang === 'bn' && blog.excerpt_bn ? blog.excerpt_bn : blog.excerpt) || '';
  const category = (lang === 'bn' && blog.category_bn ? blog.category_bn : blog.category) || 'Climate Action';
  const slugOrId = blog.slug || blog.id;

  return (
    <div className="bg-white rounded-3xl overflow-hidden flex flex-col border border-gray-100 hover:border-emerald-500/30 shadow-xs hover:shadow-xl transition-all duration-300 group h-full select-none">
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
        <img
          src={blog.image || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <span
          className="absolute top-3.5 left-3.5 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm"
          style={{ backgroundColor: '#E8521A', fontFamily: 'Inter, sans-serif' }}
        >
          {category}
        </span>
        {blog.readTime && (
          <span className="absolute bottom-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/60 text-white/95 backdrop-blur-xs flex items-center gap-1 font-inter">
            <Clock size={11} /> {blog.readTime}
          </span>
        )}
      </div>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-inter mb-2.5">
          <Calendar size={13} className="text-[#E8521A]" />
          <span>
            {new Date(blog.date || Date.now()).toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          {blog.authorName && (
            <span className="truncate max-w-[130px] text-gray-500 font-medium">
              • {blog.authorName}
            </span>
          )}
        </div>
        <h3 className="font-bold mb-2.5 flex-1 line-clamp-2 text-gray-900 group-hover:text-[#1A6B3C] transition-colors font-poppins text-base leading-snug">
          {title}
        </h3>
        <p className="text-sm mb-5 line-clamp-2 text-gray-600 font-inter leading-relaxed">
          {excerpt}
        </p>
        <Link
          to={`/blog/${slugOrId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8521A] group-hover:text-[#c73e0d] transition-colors mt-auto font-inter"
        >
          <span>{t('Read story', 'পড়ুন')}</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function BlogCarousel({ blogs, isLoading }: { blogs: BlogPost[]; isLoading: boolean }) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Smooth auto-cycle interval (rolls horizontally through cards)
  useEffect(() => {
    if (isLoading || blogs.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const cardWidth = 350;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isLoading, blogs.length, isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = 350;
    if (direction === 'left') {
      if (el.scrollLeft <= 20) {
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      }
    } else {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl bg-gray-50 border border-gray-100 mb-16">
        <p className="text-gray-500 font-inter text-sm mb-4">
          {t('No blog articles published yet.', 'এখনও কোনো ব্লগ প্রকাশিত হয়নি।')}
        </p>
        <Link to="/blog" className="px-5 py-2.5 rounded-xl bg-[#1A6B3C] text-white text-xs font-semibold inline-flex items-center gap-2">
          {t('Visit Blog Section', 'ব্লগ বিভাগ দেখুন')}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="relative mb-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/blog"
            className="text-xs font-bold text-[#E8521A] hover:text-[#c73e0d] transition-colors inline-flex items-center gap-1.5 mr-1 font-inter"
          >
            <span>{t('View all blogs', 'সব ব্লগ দেখুন')}</span>
            <ArrowRight size={13} />
          </Link>
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous blogs"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-emerald-600 hover:text-emerald-700 text-gray-700 flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next blogs"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-emerald-600 hover:text-emerald-700 text-gray-700 flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Auto-rolling Card Track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {blogs.map((blog) => (
          <div
            key={blog.id || blog.slug}
            className="w-[280px] sm:w-[320px] md:w-[350px] flex-shrink-0 snap-start"
          >
            <HomeBlogCard blog={blog} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeFaqSection({ faqs }: { faqs: FaqItem[] }) {
  const { t, lang } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach(f => { if (f.category) set.add(f.category); });
    return ['All', ...Array.from(set)];
  }, [faqs]);

  // Filter FAQs
  const displayFaqs = useMemo(() => {
    return faqs
      .filter(f => f.active !== false)
      .filter(f => {
        if (selectedCat !== 'All' && f.category !== selectedCat) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          f.question.toLowerCase().includes(q) ||
          (f.question_bn && f.question_bn.toLowerCase().includes(q)) ||
          f.answer.toLowerCase().includes(q) ||
          (f.answer_bn && f.answer_bn.toLowerCase().includes(q)) ||
          f.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [faqs, selectedCat, searchQuery]);

  // Set first item open by default
  useEffect(() => {
    if (displayFaqs.length > 0 && !activeId) {
      setActiveId(displayFaqs[0].id || displayFaqs[0]._id || '0');
    }
  }, [displayFaqs, activeId]);

  // Structured Data Schema for Google FAQPage
  const faqSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: displayFaqs.slice(0, 10).map(f => ({
        '@type': 'Question',
        name: lang === 'bn' && f.question_bn ? f.question_bn : f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: lang === 'bn' && f.answer_bn ? f.answer_bn : f.answer,
        }
      }))
    };
  }, [displayFaqs, lang]);

  if (faqs.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F5] relative overflow-hidden">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Decorative ambient background blur */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-[#E8521A]/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs uppercase tracking-widest mb-3 font-inter font-bold"
            style={{ color: '#E8521A' }}
          >
            {t('06 — Knowledge & Answers', '০৬ — সাধারণ জিজ্ঞাসা')}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', color: '#111827', letterSpacing: '-0.02em' }}
          >
            {t('Frequently Asked Questions', 'প্রচলিত প্রশ্ন ও উত্তর')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-gray-600 font-inter text-sm sm:text-base leading-relaxed"
          >
            {t(
              'Everything you need to know about our youth-led climate initiatives, volunteer opportunities, programs, governance, and community impact.',
              'আমাদের যুব-নেতৃত্বাধীন জলবায়ু উদ্যোগ, স্বেচ্ছাসেবক হওয়ার উপায়, কর্মসূচি, স্বচ্ছতা এবং কাজের প্রভাব সম্পর্কে আপনার প্রয়োজনীয় সকল তথ্য।'
            )}
          </motion.p>

          {/* Interactive Search & Filter Bar */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('Search questions or topics...', 'প্রশ্ন বা বিষয় অনুসন্ধান করুন...')}
                className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-white border border-gray-200 shadow-xs focus:border-[#1A6B3C] focus:ring-2 focus:ring-[#1A6B3C]/10 outline-none font-inter"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {categories.map(cat => {
                const isSelected = selectedCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold font-inter transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A3320] text-[#F0ECD8] shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200/80 hover:border-emerald-500/30 hover:text-gray-900'
                    }`}
                  >
                    {t(cat)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* FAQs Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Accordion List */}
          <div className="lg:col-span-8 space-y-3.5">
            {displayFaqs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-gray-200">
                <p className="text-sm text-gray-500 font-inter">
                  {t('No questions found matching your filter.', 'আপনার অনুসন্ধানের সাথে মিল রেখে কোনো প্রশ্ন পাওয়া যায়নি।')}
                </p>
              </div>
            ) : (
              displayFaqs.map((faq, idx) => {
                const id = faq.id || faq._id || String(idx);
                const isOpen = activeId === id;
                const question = lang === 'bn' && faq.question_bn ? faq.question_bn : faq.question;
                const answer = lang === 'bn' && faq.answer_bn ? faq.answer_bn : faq.answer;
                const category = lang === 'bn' && faq.category_bn ? faq.category_bn : faq.category;

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                      isOpen
                        ? 'bg-white border-[#1A6B3C]/30 shadow-lg ring-1 ring-[#1A6B3C]/10'
                        : 'bg-white/80 hover:bg-white border-gray-200/80 shadow-2xs hover:border-gray-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(isOpen ? null : id)}
                      className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-[#E8521A] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          {category && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8521A] block mb-1 font-inter">
                              {category}
                            </span>
                          )}
                          <h3
                            className={`font-poppins font-bold text-sm sm:text-base leading-snug transition-colors ${
                              isOpen ? 'text-[#0A3320]' : 'text-gray-900 hover:text-[#1A6B3C]'
                            }`}
                          >
                            {question}
                          </h3>
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 bg-emerald-50 text-[#1A6B3C]' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <ChevronDown size={17} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-[15px] text-gray-600 font-inter leading-relaxed border-t border-gray-100/80">
                        <p className="whitespace-pre-line pl-10 text-gray-700">
                          {answer}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Right Help Card / Contact CTA */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-gradient-to-br from-[#0A3320] via-[#0E422B] to-[#1A6B3C] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#E8521A] flex items-center justify-center mb-5 border border-white/10 shadow-inner">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-poppins font-bold text-xl text-[#F0ECD8] mb-2">
                {t('Have More Questions?', 'আরও কিছু জানার আছে?')}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed font-inter mb-6">
                {t(
                  "Can't find what you're looking for? Our dedicated team and community coordinators are here to assist you with inquiries, partnerships, or school programs.",
                  'আপনার প্রশ্নের উত্তর খুঁজে পাচ্ছেন না? অংশীদারিত্ব, শিক্ষামূলক কার্যক্রম বা যেকোনো তথ্যের জন্য সরাসরি আমাদের টিমের সাথে যোগাযোগ করুন।'
                )}
              </p>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="w-full py-3 px-5 rounded-xl bg-[#E8521A] hover:bg-[#d44814] text-white text-xs sm:text-sm font-bold text-center block transition-all shadow-md hover:shadow-lg font-inter"
                >
                  {t('Contact Community Team', 'যোগাযোগ করুন')}
                </Link>
                <Link
                  to="/get-involved"
                  className="w-full py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-[#F0ECD8] text-xs sm:text-sm font-semibold text-center block transition-colors border border-white/15 font-inter"
                >
                  {t('Explore Volunteer Roles', 'স্বেচ্ছাসেবক হিসেবে যোগ দিন')}
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-2xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8521A]/10 text-[#E8521A] flex items-center justify-center flex-shrink-0 font-bold">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900 font-poppins">
                  {t('Official Registration', 'সরকারি নিবন্ধন')}
                </h4>
                <p className="text-[11px] text-gray-500 font-inter">
                  {t('RJSC Reg. S-13962/2023 · Govt. of Bangladesh', 'আরজেএসসি নিবন্ধন: S-13962/2023 · বাংলাদেশ সরকার')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventRow({ event }: { event: EventItem }) {
  const { t, lang } = useLanguage();
  const d = new Date(event.date);
  return (
    <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 group">
      <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#0A3320] to-[#1A6B3C] text-white shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8521A] font-inter leading-none mb-1">
          {d.toLocaleDateString(lang === 'en' ? 'en' : 'bn-BD', { month: 'short' })}
        </span>
        <span className="font-black text-xl leading-none text-[#F0ECD8] font-poppins">
          {lang === 'en' ? d.getDate() : d.getDate().toLocaleString('bn-BD')}
        </span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#1A6B3C] border border-emerald-100">
            {t(event.type)}
          </span>
        </div>
        <p className="text-sm font-bold text-gray-900 group-hover:text-[#1A6B3C] transition-colors leading-snug truncate font-poppins">
          {t(event.title)}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400 font-inter">
          <MapPin size={12} className="text-[#E8521A]" />
          <span className="truncate">{t(event.location)}</span>
        </div>
      </div>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#E8521A] group-hover:text-white text-gray-400 transition-all self-center flex-shrink-0">
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}

/* ───── HERO ACCORDION ───── */
function HeroAccordion() {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heroCards, setHeroCards] = useState<HeroCarouselItem[]>([]);
  const { t } = useLanguage();
  const { data: carouselData, isLoading } = useCarousel();

  useEffect(() => {
    if (carouselData) setHeroCards(carouselData);
  }, [carouselData]);

  // Smooth auto-cycle timer
  useEffect(() => {
    if (heroCards.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setHoveredIndex(prev => (prev + 1) % heroCards.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [heroCards.length, isPaused]);

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[85svh] sm:h-[90svh] min-h-[580px] sm:min-h-[640px] flex items-center justify-center bg-[#072416] p-4 sm:p-8 pt-24 sm:pt-32 pb-8 sm:pb-16 overflow-hidden"
    >
      {/* Background decorations & atmospheric glow */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #051C12 0%, #0A3320 50%, #0D3E27 100%)' }} />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E8521A]/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto flex flex-col sm:flex-row gap-2.5 sm:gap-4">
        {heroCards.map((card, index) => {
          const isActive = hoveredIndex === index;
          return (
            <motion.div
              key={card.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => {
                if (isActive && card.link) {
                  if (card.link.startsWith('http')) {
                    window.open(card.link, '_blank');
                  } else {
                    window.location.href = card.link;
                  }
                } else if (!isActive) {
                  setHoveredIndex(index);
                }
              }}
              className={`relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl ${
                isActive ? 'min-h-0 sm:min-w-0' : 'min-h-[52px] sm:min-h-0 min-w-0 sm:min-w-[clamp(44px,8vw,72px)]'
              }`}
              style={{
                flex: isActive ? 12 : 1,
                transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.06)'
              }}
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt={t(card.titleEn, card.titleBn)}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: isActive ? 'brightness(0.92) saturate(1.15)' : 'brightness(0.45) grayscale(25%)',
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
              
              {/* Gradient Overlay for active card */}
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ 
                  background: isActive 
                    ? 'linear-gradient(to top, rgba(5,28,18,0.95) 0%, rgba(5,28,18,0.6) 40%, rgba(5,28,18,0.1) 75%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(10,51,32,0.92) 0%, transparent 100%)',
                  transition: 'background 0.8s ease'
                }} 
              />

              {/* ── ACTIVE CARD RICH CONTENT OVERLAY ── */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-20 pointer-events-none"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                <div className="max-w-2xl space-y-3 sm:space-y-4">
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#E8521A] animate-pulse" />
                    <span>{t('Climate Action', 'জলবায়ু পদক্ষেপ')} · {String(index + 1).padStart(2, '0')}/{String(heroCards.length).padStart(2, '0')}</span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-2xl sm:text-4xl md:text-5xl font-black text-[#F0ECD8] leading-tight tracking-tight drop-shadow-md font-poppins"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {t(card.titleEn, card.titleBn)}
                  </h2>

                  {/* Subtitle / mission snippet */}
                  <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed max-w-xl font-inter line-clamp-2 drop-shadow">
                    {t(
                      'Empowering youth across frontline coastal and vulnerable communities to drive sustainable grassroots climate action and resilience.',
                      'উপকূলীয় ও ঝুঁকিপূর্ণ সম্প্রদায়ের তরুণদের টেকসই তৃণমূল জলবায়ু পদক্ষেপ এবং সহনশীলতা গড়ে তুলতে ক্ষমতায়ন।'
                    )}
                  </p>

                  {/* Action CTA */}
                  <div className="pt-2 flex items-center gap-3">
                    {card.link && (
                      <span
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#E8521A] hover:bg-[#d0420f] transition-all hover:scale-105 active:scale-95 shadow-lg group/btn cursor-pointer"
                      >
                        <span>{t('Explore Initiative', 'বিস্তারিত দেখুন')}</span>
                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

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
                    fontSize: 'clamp(0.75rem, 1vw, 0.95rem)',
                    letterSpacing: '0.15em'
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

            </motion.div>
          );
        })}
      </div>

      {/* Slide Navigation Indicator Dots */}
      {heroCards.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {heroCards.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setHoveredIndex(dotIdx)}
              className={`transition-all duration-300 rounded-full ${
                hoveredIndex === dotIdx
                  ? 'w-7 h-2 bg-[#E8521A]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/80'
              }`}
              title={`Slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ───── MAIN COMPONENT ───── */
export function HomePage() {
  const { t } = useLanguage();
  const { data: stats = { peopleReached: 0, treesPlanted: 0, volunteers: 0, projects: 0, partners: 0, districts: 0 } as any } = useStats();
  const { data: allNews, isLoading: newsLoading } = useNews();
  const { data: allEvents, isLoading: eventsLoading } = useEvents();
  const { data: partnersData = [] } = usePartners();
  const { data: allBlogs = [], isLoading: blogsLoading } = useBlogs();
  const { data: faqsData = [] } = useFaqs();
  
  const news = allNews ? allNews.filter(n => n.category !== 'Blog').slice(0, 3) : [];
  const latestBlogs = useMemo(() => {
    return [...allBlogs]
      .filter(b => b.published !== false)
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [allBlogs]);
  const events = allEvents ? allEvents.slice(0, 4) : [];
  


  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<null | 'success' | 'exists'>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicPrograms, setDynamicPrograms] = useState<any[]>([]);

  useEffect(() => {
    apiProgram.getAll().then(data => {
      setDynamicPrograms(data.slice(0, 6)); // Display first 6 on homepage
    }).catch(console.error);
  }, []);

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
      <div className="relative overflow-hidden py-4 bg-gradient-to-r from-[#051C12] via-[#0A3320] to-[#051C12] border-y border-emerald-500/20 shadow-inner">
        {/* Soft edge gradient fade masks */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#051C12] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#051C12] to-transparent z-10 pointer-events-none" />

        <div className="flex marquee-track items-center" style={{ width: 'max-content', gap: '3.5rem' }}>
          {[...partnersData, ...partnersData, ...partnersData, ...partnersData].map((p, i) => (
            <a
              key={i}
              href={p.url || '#'}
              target={p.url && p.url !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group whitespace-nowrap text-xs sm:text-sm font-semibold flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-emerald-400/40 text-emerald-100/80 hover:text-white transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8521A] group-hover:scale-125 transition-transform" />
              <span>{p.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          IMPACT STATS
      ══════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-24 bg-[#072416] overflow-hidden">
        {/* Atmospheric glowing lighting */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#E8521A]/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#E8521A] text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E8521A]" />
              <span>{t('Our Reach Since 2022', '২০২২ সাল থেকে আমাদের অবদান')}</span>
            </motion.div>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#F0ECD8', letterSpacing: '-0.02em' }}>
              {t('Impact at Scale', 'ব্যাপক পরিসরে প্রভাব')}
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {[
              { v: stats.districts, l: 'District', d: 0, icon: MapPin },
              { v: stats.partners, l: 'Partner Org', d: 0.08, icon: Handshake },
              { v: stats.projects, l: 'Completed Project', d: 0.16, icon: CheckCircle2 },
              { v: stats.volunteers, l: 'Volunteer', d: 0.24, icon: Heart },
              { v: stats.treesPlanted, l: 'Trees plantation', d: 0.32, icon: TreePine },
              { v: stats.peopleReached, l: 'People reached', d: 0.4, icon: Globe },
            ].map(({ v, l, d, icon: IconComponent }) => (
              <div
                key={l}
                className="rounded-3xl overflow-hidden bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-emerald-400/40 hover:bg-white/[0.08] transition-all duration-300 min-w-0 shadow-lg hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <StatCounter value={v} label={l} delay={d} icon={IconComponent} />
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
      <section className="py-20 lg:py-28 bg-[#F8F9FA] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8521A]/10 border border-[#E8521A]/20 text-[#E8521A] text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8521A]" />
                <span>{t('01 — Who We Are', '০১ — আমরা কে')}</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="mb-6 font-extrabold text-gray-900 tracking-tight leading-tight" style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
                {t('Youth-Led. Justice-Driven.', 'যুব-নেতৃত্বাধীন। ন্যায়বিচার-চালিত।')}<br /><span className="text-[#1A6B3C]">{t('Community-Owned.', 'জনগণের মালিকানাধীন।')}</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-5 text-gray-600 font-inter">
                {t('Youth Climate Network (YCN) is a grassroots, youth-led non-profit established in Bangladesh — operating at the forefront of climate justice and environmental advocacy across Asia Pacific and South Asia.', 'ইয়ুথ ক্লাইমেট নেটওয়ার্ক (ওয়াইসিএন) হল বাংলাদেশে প্রতিষ্ঠিত একটি তৃণমূল, যুব-নেতৃত্বাধীন অলাভজনক সংস্থা — যা এশিয়া প্যাসিফিক এবং দক্ষিণ এশিয়া জুড়ে জলবায়ু ন্যায়বিচার এবং পরিবেশগত অ্যাডভোকেসির অগ্রভাগে কাজ করছে।')}
              </motion.p>
              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-8 text-gray-600 font-inter">
                {t('We bridge the gap between local grassroots action and regional policy platforms, ensuring frontline youth voices are heard where decisions are made. Bangladesh contributes less than 0.5% of global emissions yet faces existential climate threats — we advocate fiercely for those bearing the greatest burden.', 'আমরা স্থানীয় তৃণমূলের পদক্ষেপ এবং আঞ্চলিক নীতি নির্ধারণী প্ল্যাটফর্মের মধ্যে ব্যবধান দূর করি, এটি নিশ্চিত করে যে সিদ্ধান্ত গ্রহণের স্থানগুলোতে ফ্রন্টলাইন তরুণদের কণ্ঠস্বর শোনা যায়। বাংলাদেশ বৈশ্বিক নির্গমনের ০.৫%-এরও কম অবদান রাখে অথচ অস্তিত্বের জলবায়ু হুমকির সম্মুখীন — আমরা সবচেয়ে বেশি বোঝা বহনকারীদের পক্ষে জোরালোভাবে কথা বলি।')}
              </motion.p>
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                {[
                  { l: '20 Program Pillars', bnL: '২০টি প্রোগ্রাম পিলার', d: 'All dimensions of climate vulnerability', bnD: 'জলবায়ু ঝুঁকির সমস্ত মাত্রা', icon: Award },
                  { l: 'Asia Pacific Reach', bnL: 'এশিয়া প্যাসিফিক জুড়ে সম্প্রসারণ', d: 'Regional representation at global forums', bnD: 'বিশ্ব দরবারে আঞ্চলিক প্রতিনিধিত্ব', icon: Globe },
                  { l: 'Youth-Led Governance', bnL: 'যুব-নেতৃত্বাধীন পরিচালনা', d: 'Democratic, transparent, accountable', bnD: 'গণতান্ত্রিক, স্বচ্ছ, দায়বদ্ধ', icon: Users },
                  { l: 'Officially Registered', bnL: 'অফিসিয়ালি নিবন্ধিত', d: 'DYD/Khulna/Reg-104, GoB', bnD: 'ডিওয়াইডি/খুলনা/নিবন্ধন-১০৪, বাংলাদেশ সরকার', icon: ShieldCheck },
                ].map(({ l, bnL, d, bnD, icon: FeatureIcon }) => (
                  <motion.div
                    key={l}
                    variants={fadeUp}
                    whileHover={{ y: -3 }}
                    className="p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all duration-200 flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FeatureIcon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5 font-poppins">{t(l, bnL)}</p>
                      <p className="text-xs text-gray-500 leading-snug font-inter">{t(d, bnD)}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#0A3320] to-[#1A6B3C] hover:from-[#082819] hover:to-[#13532e] transition-all hover:scale-105 shadow-md hover:shadow-lg font-inter"
                >
                  <span>{t('Learn More About YCN', 'ওয়াইসিএন সম্পর্কে আরও জানুন')}</span>
                  <ArrowRight size={15} />
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
              <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#061F14] via-[#0A3320] to-[#0E4429] border border-emerald-500/20 shadow-2xl">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 bg-emerald-500/20 blur-3xl pointer-events-none" />

                <div className="flex justify-center mb-8">
                  <img src={logo1} alt="YCN" style={{ height: 110, width: 'auto', filter: 'drop-shadow(0 0 20px rgba(232,82,26,0.25))' }} />
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Globe, label: 'Our Vision', bnL: 'আমাদের ভিশন', text: 'A climate-resilient, environmentally just South Asia & Asia Pacific where every young person can shape a thriving planet.', bnT: 'একটি জলবায়ু-সহনশীল, পরিবেশগতভাবে ন্যায়সঙ্গত দক্ষিণ এশিয়া এবং এশিয়া প্যাসিফিক যেখানে প্রতিটি তরুণ একটি সমৃদ্ধ পৃথিবী গড়ে তুলতে পারে।' },
                    { icon: TreePine, label: 'Our Mission', bnL: 'আমাদের মিশন', text: 'Mobilize, equip, and amplify youth power to drive transformative climate action and sustainable development.', bnT: 'রূপান্তরমূলক জলবায়ু পদক্ষেপ এবং টেকসই উন্নয়ন পরিচালনার জন্য তরুণদের একত্রিত, সজ্জিত এবং তাদের কণ্ঠকে প্রসারিত করা।' },
                    { icon: Heart, label: 'Our Values', bnL: 'আমাদের মূল্যবোধ', text: 'Climate Justice · Youth Leadership · Inclusivity · Community Ownership · Transparency · Science', bnT: 'জলবায়ু ন্যায়বিচার · যুব নেতৃত্ব · অন্তর্ভুক্তি · জনগণের মালিকানা · স্বচ্ছতা · বিজ্ঞান' },
                  ].map(({ icon: Icon, label, bnL, text, bnT }) => (
                    <div key={label} className="flex gap-4 p-4 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-emerald-400/30 transition-colors">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#E8521A]/20 text-[#E8521A]">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#F0ECD8] mb-1 font-poppins">{t(label, bnL)}</p>
                        <p className="text-xs leading-relaxed text-[#8AB49A] font-inter">{t(text, bnT)}</p>
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
              {t('20 Program Pillars', '২০টি প্রোগ্রাম পিলার')}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-xl mx-auto" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.7 }}>
              {t('Six featured focus areas addressing key dimensions of climate vulnerability and sustainable development from our 20 strategic program pillars.', 'আমাদের ২০টি কৌশলগত প্রোগ্রাম পিলারের মধ্য থেকে জলবায়ু ঝুঁকি এবং টেকসই উন্নয়নের প্রধান মাত্রাগুলো মোকাবেলায় ছয়টি বিশেষ ফোকাস ক্ষেত্র।')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {dynamicPrograms.map((p) => <ProgramCard key={p.id} program={p} />)}
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
              {t('View All 20 Programs', 'সকল ২০টি প্রোগ্রাম দেখুন')} <ArrowRight size={15} />
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

          {/* Blogs section header */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
          >
            <div>
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-2" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{t('04 — Insights', '০৪ — অন্তর্দৃষ্টি')}</motion.p>
              <motion.h2 variants={fadeUp} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: '#111827', letterSpacing: '-0.02em' }}>
                {t('Latest Blogs', 'সাম্প্রতিক ব্লগ')}
              </motion.h2>
            </div>
          </motion.div>

          {/* Blogs auto-rolling carousel with real blog cards */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
          >
            <BlogCarousel blogs={latestBlogs} isLoading={blogsLoading} />
          </motion.div>

          {/* Events */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-2"
            >
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-2" style={{ color: '#D97706', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{t('05 — Calendar', '০৫ — ক্যালেন্ডার')}</motion.p>
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
      <section className="relative py-24 sm:py-28 overflow-hidden bg-[#051A11]">
        {/* Ambient lighting */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 rounded-full bg-[#E8521A]/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(5,26,17,0.95) 0%, rgba(10,51,32,0.82) 50%, rgba(5,26,17,0.95) 100%)' }} />

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
              opacity: 0.04,
              filter: 'brightness(2) saturate(0)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} style={{ fontSize: '4rem', color: '#E8521A', fontFamily: 'Georgia, serif', lineHeight: 1 }} className="mb-4">
              "
            </motion.div>
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(1.1rem, 2.5vw, 1.55rem)',
                color: '#E8E0CC',
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
              }}
            >
              {t(
                'The climate crisis is the defining challenge of our generation. But it is also the greatest opportunity — to reimagine our relationship with the earth, to build more just and equitable societies, and to demonstrate that when young people are given the tools and the trust, they can change the world.',
                'জলবায়ু সংকট আমাদের প্রজন্মের সবচেয়ে বড় চ্যালেঞ্জ। তবে এটি একটি অনন্য সুযোগও — পৃথিবীর সাথে আমাদের সম্পর্ককে নতুন করে সাজানোর, আরও ন্যায়পরায়ণ ও সমতাভিত্তিক সমাজ গড়ে তোলার এবং এটি প্রমাণ করার যে তরুণদের যখন উপযুক্ত সুযোগ ও বিশ্বাস দেওয়া হয়, তখন তারা বিশ্বকে পরিবর্তন করতে পারে।'
              )}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-6 mb-10 text-xs sm:text-sm uppercase tracking-widest font-bold text-[#E8521A] font-inter">
              — {t('YOUTH CLIMATE NETWORK', 'ইয়ুথ ক্লাইমেট নেটওয়ার্ক')}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/get-involved"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 shadow-xl hover:shadow-2xl bg-gradient-to-r from-[#E8521A] to-[#D97706] font-inter"
              >
                <span>{t('Join the Movement', 'আন্দোলনে যোগ দিন')}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-[#F0ECD8] border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all hover:scale-105 font-inter"
              >
                <span>{t('Partner With Us', 'আমাদের সাথে অংশীদার হন')}</span>
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
          06 — FREQUENTLY ASKED QUESTIONS (FAQ)
      ══════════════════════════════════════════ */}
      <HomeFaqSection faqs={faqsData} />

      {/* ══════════════════════════════════════════
          NEWSLETTER (STAY INFORMED)
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-[#F8F9FA] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="relative overflow-hidden rounded-3xl p-10 sm:p-16 lg:p-20 shadow-2xl border border-emerald-500/20 text-center bg-gradient-to-br from-[#061F14] via-[#0A3320] to-[#0D3823]"
          >
            {/* Ambient orange glow inside card */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, #E8521A 0%, transparent 65%)' }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-6 border transition-all duration-300 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(232,82,26,0.3) 0%, rgba(232,82,26,0.1) 100%)',
                  borderColor: 'rgba(232,82,26,0.4)',
                  boxShadow: '0 0 25px rgba(232,82,26,0.25)'
                }}
              >
                <Users size={24} style={{ color: '#E8521A' }} />
              </motion.div>

              <motion.h3
                variants={fadeUp}
                className="mb-4 font-black text-[#F0ECD8] tracking-tight leading-tight font-poppins"
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 2.75rem)',
                }}
              >
                {t('Stay Informed', 'সবসময় অবগত থাকুন')}
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="mb-10 text-base sm:text-lg leading-relaxed text-[#A8C4B0] font-inter"
              >
                {t('Subscribe for climate updates, advocacy alerts, program news, and event invitations.', 'জলবায়ু আপডেট, অ্যাডভোকেসি অ্যালার্ট, প্রোগ্রাম সংবাদ এবং ইভেন্ট আমন্ত্রণের জন্য সাবস্ক্রাইব করুন।')}
              </motion.p>

              <motion.form variants={fadeUp} onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3.5 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder={t('your@email.com')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-full text-base outline-none transition-all duration-200 border bg-white/[0.07] text-white border-white/15 focus:border-[#E8521A] focus:ring-2 focus:ring-[#E8521A]/30 font-inter placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-9 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center min-w-[140px] shadow-lg hover:shadow-xl bg-gradient-to-r from-[#E8521A] to-[#D97706] font-inter"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    t('Subscribe Free', 'বিনামূল্যে সাবস্ক্রাইব করুন')
                  )}
                </button>
              </motion.form>

              {subStatus === 'success' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm font-semibold text-[#8AB49A] font-inter">
                  ✓ {t("You're subscribed! Thank you for joining.", '✓ আপনি সাবস্ক্রাইব করেছেন! যুক্ত হওয়ার জন্য ধন্যবাদ।')}
                </motion.p>
              )}
              {subStatus === 'exists' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm font-semibold text-[#E8521A] font-inter">
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


