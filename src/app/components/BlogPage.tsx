import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { SEO } from './ui/SEO';
import {
  Search, ArrowRight, BookOpen, Droplets, Calendar,
  Sprout, Users, Mail, Loader2
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { useBlogs, apiNewsletter } from '../lib/api';

export function BlogPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('All Stories');
  const [activeSDG, setActiveSDG] = useState<number | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [nlStatus, setNlStatus] = useState<'idle' | 'success' | 'exists' | 'error'>('idle');

  const { data: blogs = [], isLoading } = useBlogs();

  const categories = [
    { key: 'All Stories', label: t('All Stories', 'সব গল্প') },
    { key: 'Climate Action', label: t('Climate Action', 'জলবায়ু পদক্ষেপ') },
    { key: 'Education & Research', label: t('Education & Research', 'শিক্ষা ও গবেষণা') },
    { key: 'WASH', label: t('WASH', 'পানি ও স্যানিটেশন') },
    { key: 'Events', label: t('Events', 'ইভেন্ট') },
  ];

  const topics = [
    { name: 'Climate Action', icon: Sprout, color: '#1A6B3C', label: t('Climate Action', 'জলবায়ু পদক্ষেপ') },
    { name: 'Education & Research', icon: BookOpen, color: '#D97706', label: t('Education & Research', 'শিক্ষা ও গবেষণা') },
    { name: 'WASH', icon: Droplets, color: '#0E7490', label: t('WASH', 'পানি ও স্বাস্থ্যবিধি') },
    { name: 'Livelihoods & Agriculture', icon: Users, color: '#16A34A', label: t('Livelihoods & Agriculture', 'জীবিকা ও কৃষি') },
    { name: 'Events', icon: Calendar, color: '#EA580C', label: t('Events', 'ইভেন্ট ও সম্মেলন') },
  ];

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Category filter
      if (activeCategory !== 'All Stories' && blog.category !== activeCategory) {
        return false;
      }
      // SDG filter
      if (activeSDG !== null && (!blog.sdgs || !blog.sdgs.includes(activeSDG))) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (blog.title || '').toLowerCase().includes(q) || (blog.title_bn || '').toLowerCase().includes(q);
        const excerptMatch = (blog.excerpt || '').toLowerCase().includes(q) || (blog.excerpt_bn || '').toLowerCase().includes(q);
        const tagMatch = blog.tags?.some(tag => tag.toLowerCase().includes(q));
        if (!titleMatch && !excerptMatch && !tagMatch) return false;
      }
      return true;
    });
  }, [blogs, activeCategory, activeSDG, searchQuery]);

  const featuredStory = useMemo(() => {
    return blogs.find(b => b.featured) || blogs[0];
  }, [blogs]);

  const regularStories = useMemo(() => {
    if (activeCategory === 'All Stories' && !searchQuery.trim() && activeSDG === null && featuredStory) {
      return filteredBlogs.filter(b => (b.slug || b.id) !== (featuredStory.slug || featuredStory.id));
    }
    return filteredBlogs;
  }, [filteredBlogs, featuredStory, activeCategory, searchQuery, activeSDG]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    try {
      setNlLoading(true);
      await apiNewsletter.create({ email: newsletterEmail, date: new Date().toISOString() });
      setNlStatus('success');
      setNewsletterEmail('');
    } catch (err: any) {
      if (err.message && (err.message.includes('409') || err.message.includes('already_subscribed'))) {
        setNlStatus('exists');
      } else {
        setNlStatus('error');
      }
    } finally {
      setNlLoading(false);
      setTimeout(() => setNlStatus('idle'), 6000);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      <SEO
        title="Stories, Insights & Climate Action | YCN Bangladesh"
        description="Real stories from young people, communities and partners building a cleaner, greener and more resilient Bangladesh."
        keywords="youth climate stories, bangladesh climate insights, mangrove restoration, youth climate action news"
      />

      {/* ── HERO SECTION ── */}
      <section className="pt-36 pb-16 bg-[#072416] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 75% 30%, #E8521A 0%, transparent 40%), radial-gradient(circle at 20% 70%, #1A6B3C 0%, transparent 50%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase mb-2 block font-inter">
            {t('OUR STORIES', 'আমাদের গল্প')}
          </span>
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F0ECD8] mb-4 tracking-tight leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('Stories, Insights & Climate Action', 'গল্প, অন্তর্দৃষ্টি ও জলবায়ু পদক্ষেপ')}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-[#A8C4B0] font-inter leading-relaxed mb-8">
            {t(
              'Real stories from young people, communities and partners building a more resilient Bangladesh.',
              'একটি আরও সহনশীল বাংলাদেশ বিনির্মাণে তরুণ, সমাজ এবং অংশীদারদের বাস্তব গল্প ও কার্যক্রম।'
            )}
          </p>

          {/* Search bar matching Image 4 */}
          <div className="max-w-2xl mx-auto relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearchParams(searchQuery ? { q: searchQuery } : {});
              }}
              className="bg-white rounded-full p-2 pl-6 shadow-2xl flex items-center gap-3 border border-emerald-900/20"
            >
              <Search size={20} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={t('Search stories, topics or keywords...', 'গল্প, বিষয় বা কিওয়ার্ড খুঁজুন...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-gray-800 text-sm placeholder-gray-400 outline-none font-inter"
              />
              <button
                type="submit"
                className="w-11 h-11 rounded-full bg-[#E8521A] text-white flex items-center justify-center hover:bg-[#d0420f] transition-colors flex-shrink-0"
                aria-label="Submit search"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Filter pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setActiveSDG(null);
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.key && activeSDG === null
                    ? 'bg-[#E8521A] text-white shadow-lg shadow-orange-950/20'
                    : 'bg-white/10 text-[#D4CDB8] hover:bg-white/20 hover:text-white backdrop-blur-md'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── FEATURED STORY (When on 'All Stories' & no active search) ── */}
        {activeCategory === 'All Stories' && !searchQuery.trim() && activeSDG === null && featuredStory && (
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase block font-inter">
                {t('FEATURED STORY', 'বিশেষ গল্প')}
              </span>
              <h2
                className="text-2xl sm:text-4xl font-extrabold text-gray-950 leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <Link to={`/blog/${featuredStory.slug || featuredStory.id}`} className="hover:text-[#1A6B3C] transition-colors">
                  {featuredStory.title}
                </Link>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-inter">
                {featuredStory.excerpt}
              </p>

              {/* Author bar */}
              <div className="flex items-center gap-4 pt-2">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={featuredStory.authorImage || "/Formal Image -  Meet our team /5.  Puja Gain -  Volunteer Coordinator.png"}
                    alt={featuredStory.authorName || "Author"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-gray-500 font-inter">
                  <p className="font-semibold text-gray-900">{featuredStory.authorName || 'Sadia Islam'}</p>
                  <p>
                    {new Date(featuredStory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {featuredStory.readTime || '6 min read'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/blog/${featuredStory.slug || featuredStory.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#E8521A] hover:bg-[#d0420f] transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                  <span>{t('Read Full Story', 'সম্পূর্ণ গল্প পড়ুন')}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:col-span-6 aspect-[16/11] lg:aspect-auto lg:h-full relative overflow-hidden bg-gray-100">
              <img
                src={featuredStory.image || "/Formal Image -  Meet our team /1. Arafat Hossain Akash - Founder & Executive Director .png"}
                alt={featuredStory.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                People · Planet · Resilient Bangladesh
              </div>
            </div>
          </div>
        )}

        {/* ── LATEST STORIES GRID ── */}
        <div>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {activeCategory === 'All Stories' && !searchQuery.trim() && activeSDG === null
                  ? t('Latest Stories', 'সর্বশেষ গল্পসমূহ')
                  : t('Filtered Articles', 'ফিল্টারকৃত নিবন্ধ')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-inter">
                {t('Explore the latest updates, field stories and insights from our network.', 'আমাদের নেটওয়ার্কের সর্বশেষ আপডেট, ফিল্ড স্টোরি এবং অন্তর্দৃষ্টি অন্বেষণ করুন।')}
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              {regularStories.length} {t('Articles', 'নিবন্ধ')}
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 size={32} className="animate-spin text-[#1A6B3C]" />
            </div>
          ) : regularStories.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 max-w-lg mx-auto">
              <BookOpen size={40} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-bold text-gray-800 text-lg mb-2">{t('No articles found', 'কোনো নিবন্ধ পাওয়া যায়নি')}</h3>
              <p className="text-xs text-gray-500 mb-6 font-inter">
                {t('Try adjusting your search query or filters to discover other stories.', 'অন্যান্য গল্প দেখতে আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করুন।')}
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All Stories');
                  setSearchQuery('');
                  setActiveSDG(null);
                }}
                className="px-5 py-2.5 rounded-full bg-[#1A6B3C] text-white text-xs font-semibold"
              >
                {t('Reset Filters', 'সব ফিল্টার মুছুন')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularStories.map((story) => (
                <div
                  key={story.id || story.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  {/* Image container */}
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    <img
                      src={story.image || "/Formal Image -  Meet our team /1. Arafat Hossain Akash - Founder & Executive Director .png"}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-900/80 backdrop-blur-md text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                      {story.category || 'Climate Action'}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-[#1A6B3C] transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        <Link to={`/blog/${story.slug || story.id}`}>
                          {story.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-inter line-clamp-3 mb-6">
                        {story.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-inter">
                        {new Date(story.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <Link
                        to={`/blog/${story.slug || story.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#E8521A] group-hover:translate-x-1 transition-transform"
                      >
                        <span>{t('Read Story', 'গল্প পড়ুন')}</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── BROWSE BY TOPIC ── */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('Browse by Topic', 'বিষয়ভিত্তিক অন্বেষণ করুন')}
            </h2>
            <p className="text-xs text-gray-500 font-inter mt-1">
              {t('Explore stories by the issues that matter most.', 'সবচেয়ে গুরুত্বপূর্ণ বিষয়গুলির ভিত্তিতে গল্পগুলি আবিষ্কার করুন।')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {topics.map((tItem) => {
              const Icon = tItem.icon;
              const isSelected = activeCategory === tItem.name;
              return (
                <button
                  key={tItem.name}
                  onClick={() => {
                    setActiveCategory(isSelected ? 'All Stories' : tItem.name);
                    setActiveSDG(null);
                  }}
                  className={`p-6 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1A6B3C] shadow-lg scale-105'
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tItem.color}15`, color: tItem.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="font-semibold text-xs text-gray-800 font-inter">{tItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── NEWSLETTER SUBSCRIPTION SECTION (Matching design reference) ── */}
        <div className="bg-[#072416] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle at 80% 50%, #E8521A 0%, transparent 50%)',
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-[#E8521A]">
              <Mail size={22} />
            </div>
            <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase block font-inter">
              {t('STAY CONNECTED', 'সংযুক্ত থাকুন')}
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F0ECD8]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('Get the Latest Stories & Updates', 'সর্বশেষ গল্প ও আপডেট পান')}
            </h3>
            <p className="text-sm text-[#A8C4B0] font-inter max-w-xl mx-auto leading-relaxed">
              {t(
                'Subscribe to our newsletter for new stories, events, opportunities and ways to take climate action in Bangladesh.',
                'নতুন গল্প, ইভেন্ট, সুযোগ এবং বাংলাদেশে জলবায়ু পদক্ষেপ গ্রহণের উপায়ের জন্য আমাদের নিউজলেটারে সাবস্ক্রাইব করুন।'
              )}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto pt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={t('Enter your email address...', 'আপনার ইমেইল ঠিকানা দিন...')}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full bg-white/10 text-white placeholder-gray-400 text-xs outline-none border border-white/20 focus:border-[#E8521A] transition-colors font-inter"
                required
              />
              <button
                type="submit"
                disabled={nlLoading}
                className="px-7 py-3.5 rounded-full bg-[#E8521A] text-white text-xs font-semibold hover:bg-[#d0420f] transition-all disabled:opacity-50 cursor-pointer shadow-lg whitespace-nowrap"
              >
                {nlLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('Subscribe →', 'সাবস্ক্রাইব →')}
              </button>
            </form>

            {nlStatus === 'success' && (
              <p className="text-xs text-emerald-300 font-semibold pt-2">
                ✓ {t('Thank you for subscribing! You are now on our list.', 'সাবস্ক্রাইব করার জন্য ধন্যবাদ!')}
              </p>
            )}
            {nlStatus === 'exists' && (
              <p className="text-xs text-orange-300 font-semibold pt-2">
                {t('This email is already subscribed.', 'এই ইমেইলটি ইতিমধ্যে সাবস্ক্রাইব করা রয়েছে।')}
              </p>
            )}
            {nlStatus === 'error' && (
              <p className="text-xs text-red-300 font-semibold pt-2">
                {t('Subscription failed. Please check your email and try again.', 'ব্যর্থ হয়েছে। আবার চেষ্টা করুন।')}
              </p>
            )}
          </div>
        </div>

        {/* ── CALL TO ACTION BOTTOM BANNER ── */}
        <div className="bg-[#072416] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <span className="text-xs font-bold text-[#E8521A] uppercase tracking-widest block mb-2 font-inter">
            {t('BE PART OF THE CHANGE', 'পরিবর্তনের অংশ হোন')}
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F0ECD8] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('Join Us for a Greener, More Resilient Bangladesh', 'একটি সবুজ, আরও সহনশীল বাংলাদেশের জন্য আমাদের সাথে যুক্ত হোন')}
          </h3>
          <p className="text-sm text-[#A8C4B0] font-inter max-w-2xl mx-auto mb-8 leading-relaxed">
            {t(
              'Whether you want to volunteer, partner or support our work, there are many ways to make a difference.',
              'আপনি স্বেচ্ছাসেবক হতে চান, অংশীদার হতে চান বা আমাদের কাজে সহায়তা করতে চান — ইতিবাচক পরিবর্তন আনার অনেক উপায় রয়েছে।'
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/get-involved"
              className="px-8 py-3.5 rounded-full text-xs font-semibold bg-[#E8521A] text-white hover:bg-[#d0420f] transition-all shadow-md"
            >
              {t('Get Involved →', 'যুক্ত হোন →')}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full text-xs font-semibold border border-white/20 text-[#F0ECD8] hover:bg-white/10 transition-all"
            >
              {t('Support Our Work', 'আমাদের কাজ সমর্থন করুন')}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
