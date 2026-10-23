import { useState } from 'react';
import { Link } from 'react-router';
import { SEO } from './ui/SEO';
import * as LucideIcons from 'lucide-react';
import {
  ArrowRight, Heart, Users, Target, Eye, Sparkles,
  Play, Linkedin
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { useTeam, useFounderBrief, useBlogs, useAboutContent } from '../lib/api';

function resolvePillarIcon(name?: string, fallback = Target) {
  if (name && (LucideIcons as any)[name]) return (LucideIcons as any)[name];
  return fallback;
}

interface MemberCardProps {
  member: {
    id?: string;
    name: string;
    name_bn?: string;
    role: string;
    role_bn?: string;
    department?: string;
    department_bn?: string;
    bio?: string;
    email?: string;
    image?: string;
    linkedin?: string;
    number?: number;
    type?: string;
  };
}

function MemberCard({ member }: MemberCardProps) {
  const [imgError, setImgError] = useState(false);
  const { lang } = useLanguage();

  const name = lang === 'bn' && member.name_bn ? member.name_bn : member.name;
  const role = lang === 'bn' && member.role_bn ? member.role_bn : member.role;
  const dept = lang === 'bn' && member.department_bn ? member.department_bn : (member.department || 'Climate Action');
  const initials = member.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2);

  // Department Badge color palette matching design reference
  const getDeptColor = (d: string) => {
    const ld = d.toLowerCase();
    if (ld.includes('program') || ld.includes('leadership')) return { bg: '#EBF5EE', text: '#1A6B3C', border: '#C6E7D2' };
    if (ld.includes('research') || ld.includes('policy')) return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
    if (ld.includes('communication') || ld.includes('media')) return { bg: '#FDF2F8', text: '#BE185D', border: '#FBCFE8' };
    if (ld.includes('operation') || ld.includes('logistics')) return { bg: '#EFF6FF', text: '#0284C7', border: '#BAE6FD' };
    if (ld.includes('finance') || ld.includes('fundraising')) return { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' };
    if (ld.includes('volunteer')) return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
    return { bg: '#E8F5EE', text: '#1A6B3C', border: '#C6E7D2' };
  };

  const deptStyle = getDeptColor(dept);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full group hover:-translate-y-1 relative">

      {/* Image container */}
      <div className="aspect-[4/4.5] w-full rounded-xl overflow-hidden bg-gray-100 mb-4 relative flex items-center justify-center">
        {member.image && !imgError ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-emerald-200 text-2xl font-bold font-poppins">
            {initials || 'YCN'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-[16px] leading-snug mb-1 group-hover:text-[#1A6B3C] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {name}
          </h3>
          <p className="text-xs text-gray-500 font-medium mb-3 line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {role}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
          <span
            className="text-[11px] font-medium px-2.5 py-1 rounded-full border max-w-[80%] truncate"
            style={{
              backgroundColor: deptStyle.bg,
              color: deptStyle.text,
              borderColor: deptStyle.border,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {dept}
          </span>

          <a
            href={member.linkedin || 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#0A66C2] bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 transition-colors flex-shrink-0"
            title="LinkedIn profile"
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export function AboutPage() {
  const { t, lang } = useLanguage();
  const { data: team = [] } = useTeam();
  const { data: founderBrief } = useFounderBrief();
  const { data: aboutContent } = useAboutContent();
  const { data: blogs = [] } = useBlogs();

  const [activeDepartment, setActiveDepartment] = useState('All');
  const [showAllAdvisors, setShowAllAdvisors] = useState(false);
  const [showFullFounderModal, setShowFullFounderModal] = useState(false);

  // Group team members
  const advisors = team.filter(m => m.type === 'advisor');
  const directors = team.filter(m => m.type === 'director');
  const members = team.filter(m => m.type !== 'advisor' && m.type !== 'director');

  // Filtered members by department
  const filteredMembers = members.filter(m => {
    if (activeDepartment === 'All') return true;
    const dept = (m.department || '').toLowerCase();
    return dept.includes(activeDepartment.toLowerCase());
  });

  const departmentTabs = [
    { key: 'All', label: t('All', 'সব') },
    { key: 'Programs', label: t('Programs', 'প্রোগ্রাম') },
    { key: 'Research', label: t('Research', 'গবেষণা') },
    { key: 'Communications', label: t('Communications', 'যোগাযোগ') },
    { key: 'Operations', label: t('Operations', 'অপারেশনস') },
    { key: 'Finance', label: t('Finance', 'অর্থ ও তহবিল') },
    { key: 'Volunteers', label: t('Volunteers', 'স্বেচ্ছাসেবক') },
  ];

  const displayedAdvisors = showAllAdvisors ? advisors : advisors.slice(0, 6);

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="About Us | Youth Climate Network Bangladesh"
        description="A youth-led network working for a cleaner, greener and more resilient Bangladesh. Meet our advisory board, leadership, and changemakers."
        keywords="about YCN Bangladesh, climate advisory board, executive directors, climate youth team, grassroots climate action"
      />

      {/* ── 1. HERO SECTION ── */}
      <section className="pt-36 pb-20 relative overflow-hidden" style={{ backgroundColor: '#072416' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 40%, #E8521A 0%, transparent 40%), radial-gradient(circle at 80% 30%, #1A6B3C 0%, transparent 45%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs font-medium text-emerald-300/80 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white">About</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0ECD8] mb-4 tracking-tight leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {lang === 'bn' && aboutContent?.heroTitle_bn ? aboutContent.heroTitle_bn : (aboutContent?.heroTitle || t('About YCN Bangladesh', 'ওয়াইসিএন বাংলাদেশ সম্পর্কে'))}
              </h1>
              <p className="text-base sm:text-xl text-[#A8C4B0] font-normal leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                {lang === 'bn' && aboutContent?.heroSubtitle_bn ? aboutContent.heroSubtitle_bn : (aboutContent?.heroSubtitle || t('A youth-led network working for a cleaner, greener and more resilient Bangladesh.', 'একটি যুব-নেতৃত্বাধীন নেটওয়ার্ক যা আরও পরিষ্কার, সবুজ এবং জলবায়ু-সহনশীল বাংলাদেশের জন্য কাজ করছে।'))}
              </p>
            </div>

            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={14} className="text-[#E8521A]" />
              <span>{lang === 'bn' && aboutContent?.heroTagline_bn ? aboutContent.heroTagline_bn : (aboutContent?.heroTagline || "People · Planet · Resilient Bangladesh")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FOUR CORE PILLARS / VALUES (Dynamic from Admin) ── */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: resolvePillarIcon(aboutContent?.missionIcon, Target),
                title: lang === 'bn' && aboutContent?.missionTitle_bn ? aboutContent.missionTitle_bn : (aboutContent?.missionTitle || t('Our Mission', 'আমাদের মিশন')),
                desc: lang === 'bn' && aboutContent?.missionDesc_bn ? aboutContent.missionDesc_bn : (aboutContent?.missionDesc || t('Empowering youth for a climate-resilient Bangladesh.', 'জলবায়ু-সহনশীল বাংলাদেশের জন্য তরুণদের ক্ষমতায়ন।')),
                color: aboutContent?.missionColor || '#1A6B3C',
              },
              {
                icon: resolvePillarIcon(aboutContent?.visionIcon, Eye),
                title: lang === 'bn' && aboutContent?.visionTitle_bn ? aboutContent.visionTitle_bn : (aboutContent?.visionTitle || t('Our Vision', 'আমাদের ভিশন')),
                desc: lang === 'bn' && aboutContent?.visionDesc_bn ? aboutContent.visionDesc_bn : (aboutContent?.visionDesc || t('A sustainable, just and climate-resilient Bangladesh.', 'একটি টেকসই, ন্যায়সঙ্গত এবং জলবায়ু-সহনশীল বাংলাদেশ।')),
                color: aboutContent?.visionColor || '#E8521A',
              },
              {
                icon: resolvePillarIcon(aboutContent?.approachIcon, Users),
                title: lang === 'bn' && aboutContent?.approachTitle_bn ? aboutContent.approachTitle_bn : (aboutContent?.approachTitle || t('Our Approach', 'আমাদের পদ্ধতি')),
                desc: lang === 'bn' && aboutContent?.approachDesc_bn ? aboutContent.approachDesc_bn : (aboutContent?.approachDesc || t('Youth leadership, collaboration and evidence-based action.', 'যুব নেতৃত্ব, সহযোগিতা এবং প্রমাণ-ভিত্তিক কর্মপদ্ধতি।')),
                color: aboutContent?.approachColor || '#0E7490',
              },
              {
                icon: resolvePillarIcon(aboutContent?.valuesIcon, Heart),
                title: lang === 'bn' && aboutContent?.valuesTitle_bn ? aboutContent.valuesTitle_bn : (aboutContent?.valuesTitle || t('Our Values', 'আমাদের মূল্যবোধ')),
                desc: lang === 'bn' && aboutContent?.valuesDesc_bn ? aboutContent.valuesDesc_bn : (aboutContent?.valuesDesc || t('Inclusivity, integrity, innovation and impact.', 'অন্তর্ভুক্তি, সততা, উদ্ভাবন এবং ইতিবাচক প্রভাব।')),
                color: aboutContent?.valuesColor || '#7C3AED',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-gray-100 bg-[#FAFAFA] hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15`, color }}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-inter">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ADVISORY BOARD SECTION (Top of Team Sections) ── */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase mb-1 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('OUR GUIDING VOICES', 'আমাদের দিকনির্দেশক কণ্ঠস্বর')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('Advisory Board', 'উপদেষ্টা পরিষদ')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl font-inter">
                {t(
                  'Our advisors provide strategic guidance, sector expertise and support to strengthen our mission and impact.',
                  'আমাদের উপদেষ্টামণ্ডলী কৌশলগত দিকনির্দেশনা, খাতভিত্তিক দক্ষতা এবং আমাদের লক্ষ্য ও প্রভাবকে শক্তিশালী করতে সহায়তা প্রদান করেন।'
                )}
              </p>
            </div>

            {advisors.length > 6 && (
              <button
                onClick={() => setShowAllAdvisors(!showAllAdvisors)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:text-[#1A6B3C] hover:border-[#1A6B3C] transition-all bg-white shadow-sm flex-shrink-0"
              >
                <span>{showAllAdvisors ? t('Show Less', 'কম দেখুন') : t('View All Advisors', 'সকল উপদেষ্টা দেখুন')}</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {displayedAdvisors.map((advisor) => (
              <MemberCard key={advisor.id || advisor.name} member={advisor} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FOUNDER'S BRIEF SECTION (Immediately after Advisor Section) ── */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F9FAFB] rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left text */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase block" style={{ fontFamily: 'Inter, sans-serif' }}>
                {lang === 'bn' && founderBrief?.subtitle_bn ? founderBrief.subtitle_bn : (founderBrief?.subtitle || t("FOUNDER'S STORY", 'প্রতিষ্ঠাতার গল্প'))}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {lang === 'bn' && founderBrief?.title_bn ? founderBrief.title_bn : (founderBrief?.title || t('From a Simple Belief to a Growing Movement', 'একটি সাধারণ বিশ্বাস থেকে ক্রমবর্ধমান আন্দোলন'))}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-inter">
                {lang === 'bn' && founderBrief?.content_bn ? founderBrief.content_bn : (founderBrief?.content || t(
                  'YCN Bangladesh began with a simple belief — that young people can drive real change for our climate, communities and future. Our founder’s journey reflects this belief and the story behind the network.',
                  'ওয়াইসিএন বাংলাদেশ একটি সাধারণ বিশ্বাসের মধ্য দিয়ে শুরু হয়েছিল — যে তরুণরা আমাদের জলবায়ু, সম্প্রদায় এবং ভবিষ্যতের জন্য প্রকৃত পরিবর্তন আনতে পারে।'
                ))}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setShowFullFounderModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                  style={{ backgroundColor: '#E8521A' }}
                >
                  <span>{lang === 'bn' && founderBrief?.buttonText_bn ? founderBrief.buttonText_bn : (founderBrief?.buttonText || t('Read the Full Founder\'s Story', 'প্রতিষ্ঠাতার পূর্ণাঙ্গ গল্প পড়ুন'))}</span>
                  <ArrowRight size={15} />
                </button>
                {(founderBrief?.articleLink || founderBrief?.articleUrl) && (
                  <Link
                    to={founderBrief.articleLink || founderBrief.articleUrl || '/blog'}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 border"
                    style={{ borderColor: '#E8521A', color: '#E8521A', backgroundColor: 'transparent' }}
                  >
                    <span>{lang === 'bn' ? 'প্রতিষ্ঠাতার লেখা পড়ুন' : (founderBrief?.readMoreText || 'Read Founder\'s Article')}</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>

            {/* Right photo / video player */}
            <div className="lg:col-span-5 relative group">
              <div className="aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-xl relative bg-black/5">
                <img
                  src={founderBrief?.founderImage || "/Arafat Hossain Akash - Founder & Executive Director.jpg"}
                  alt={founderBrief?.founderName || "Founder"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/Formal Image -  Meet our team /1. Arafat Hossain Akash - Founder & Executive Director .png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setShowFullFounderModal(true)}
                    className="w-14 h-14 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group-hover:bg-[#E8521A] group-hover:text-white"
                    aria-label="Play Founder Story"
                  >
                    <Play size={20} className="ml-1 fill-current" />
                  </button>
                </div>

                {/* Subtitle bottom banner */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-bold text-sm font-poppins">{founderBrief?.founderName || "Arafat Hossain Akash"}</p>
                  <p className="text-[11px] text-gray-300 font-inter">{founderBrief?.founderRole || "Founder & Executive Director, YCN"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. EXECUTIVE DIRECTORS SECTION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase mb-1 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('OUR LEADERSHIP', 'আমাদের নেতৃত্ব')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('Executive Directors', 'নির্বাহী পরিচালকবৃন্দ')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl font-inter">
                {t(
                  'Our Executive Directors lead the strategic direction and day-to-day operations of YCN Bangladesh.',
                  'আমাদের নির্বাহী পরিচালকবৃন্দ ওয়াইসিএন বাংলাদেশের কৌশলগত দিকনির্দেশনা ও সার্বিক কার্যক্রম পরিচালনা করেন।'
                )}
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:text-[#1A6B3C] hover:border-[#1A6B3C] transition-all bg-white shadow-sm flex-shrink-0"
            >
              <span>{t('View Leadership Team', 'নেতৃত্ব টিম দেখুন')}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {directors.map((director) => (
              <MemberCard key={director.id || director.name} member={director} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. MEET THE TEAM SECTION (With Chronological Numbering & Department Filter) ── */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase mb-1 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('OUR TEAM', 'আমাদের টিম')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('Meet the Team', 'দলের সাথে পরিচিত হোন')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl font-inter">
                {t(
                  'A diverse group of young changemakers working together for climate action across Bangladesh.',
                  'বাংলাদেশজুড়ে জলবায়ু পদক্ষেপের জন্য কাজ করা তরুণ পরিবর্তনের এক প্রতিশ্রুতিশীল দল।'
                )}
              </p>
            </div>

            <div className="text-xs text-gray-500 font-semibold bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex-shrink-0">
              {filteredMembers.length} {t('Members', 'সদস্য')}
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {departmentTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveDepartment(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeDepartment === tab.key
                    ? 'bg-[#E8521A] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id || member.name}
                member={member}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. LATEST STORIES & UPDATES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase mb-1 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('LATEST FROM YCN', 'ওয়াইসিএন-এর সাম্প্রতিক আপডেট')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('Recent Stories & Updates', 'সাম্প্রতিক গল্প ও আপডেট')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 font-inter">
                {t('Explore our latest news, field stories, events and announcements.', 'আমাদের সাম্প্রতিক সংবাদ, মাঠপর্যায়ের গল্প, ইভেন্ট এবং ঘোষণা অন্বেষণ করুন।')}
              </p>
            </div>

            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:text-[#1A6B3C] hover:border-[#1A6B3C] transition-all bg-white shadow-sm flex-shrink-0"
            >
              <span>{t('View All Stories', 'সকল গল্প দেখুন')}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog) => (
              <Link
                key={blog.id || blog.slug}
                to={`/blog/${blog.slug || blog.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                  <img
                    src={blog.image || "/Formal Image -  Meet our team /1. Arafat Hossain Akash - Founder & Executive Director .png"}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {blog.category || 'Story'}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-[#1A6B3C] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 font-inter">
                      {blog.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs text-gray-400">
                    <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-[#1A6B3C] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CALL TO ACTION BANNER ── */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#072416' }}>
        <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(circle at 70% 50%, #E8521A 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8521A] mb-2 block">
            {lang === 'bn' ? 'আমাদের যাত্রার সঙ্গী হোন' : 'BE PART OF OUR JOURNEY'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#F0ECD8] mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {lang === 'bn' && aboutContent?.ctaTitle_bn ? aboutContent.ctaTitle_bn : (aboutContent?.ctaTitle || t('Join Us for a Greener, More Resilient Bangladesh', 'একটি সবুজ, আরও সহনশীল বাংলাদেশের জন্য আমাদের সাথে যুক্ত হোন'))}
          </h2>
          <p className="max-w-2xl mx-auto text-base text-[#A8C4B0] leading-relaxed mb-10 font-inter">
            {lang === 'bn' && aboutContent?.ctaDesc_bn ? aboutContent.ctaDesc_bn : (aboutContent?.ctaDesc || t(
              'Whether you want to volunteer, partner or support our work, there are many ways to make a difference.',
              'আপনি স্বেচ্ছাসেবক হতে চান, অংশীদার হতে চান বা আমাদের কাজে সহায়তা করতে চান — ইতিবাচক পরিবর্তন আনার অনেক উপায় রয়েছে।'
            ))}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={aboutContent?.ctaButton1Link || "/get-involved"}
              className="px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: '#E8521A' }}
            >
              {lang === 'bn' && aboutContent?.ctaButton1Text_bn ? aboutContent.ctaButton1Text_bn : (aboutContent?.ctaButton1Text || t('Get Involved', 'যুক্ত হোন'))}
            </Link>
            <Link
              to={aboutContent?.ctaButton2Link || "/contact"}
              className="px-8 py-3.5 rounded-full text-sm font-semibold text-[#F0ECD8] border border-white/20 hover:border-white/40 transition-all bg-white/5 backdrop-blur-md"
            >
              {lang === 'bn' && aboutContent?.ctaButton2Text_bn ? aboutContent.ctaButton2Text_bn : (aboutContent?.ctaButton2Text || t('Support Our Work', 'আমাদের সমর্থন করুন'))}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FULL FOUNDER STORY MODAL ── */}
      {showFullFounderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 relative shadow-2xl">
            <button
              onClick={() => setShowFullFounderModal(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            <div className="space-y-4 font-inter text-gray-700 leading-relaxed text-sm sm:text-base">
              <span className="text-xs font-bold text-[#E8521A] uppercase tracking-wider block">
                {lang === 'bn' && founderBrief?.subtitle_bn ? founderBrief.subtitle_bn : (founderBrief?.subtitle || "Founder's Message")}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 font-poppins">
                {lang === 'bn' && founderBrief?.title_bn ? founderBrief.title_bn : (founderBrief?.title || "From a Simple Belief to a Growing Movement")}
              </h3>
              <p className="text-gray-500 text-xs italic">
                By {founderBrief?.founderName || "Arafat Hossain Akash"}, {founderBrief?.founderRole || "Founder & Executive Director"}
              </p>
              
              <div className="pt-4 space-y-4 text-gray-600 border-t border-gray-100">
                {((lang === 'bn' && founderBrief?.fullStory_bn ? founderBrief.fullStory_bn : founderBrief?.fullStory) || `On 25 May 2009, Cyclone Aila struck the coast of Bangladesh. Our home, everything we had — washed away in hours. I was nine years old, and I lost my school before I ever fully understood what I was losing. That was not the only storm of my childhood.

I grew up watching cyclone after cyclone tear through our coast — Sidr, Aila, Fani, Amphan — each one arriving with a different name but the same devastating signature: homes destroyed, harvests lost, children pulled out of school, families pushed deeper into hardship. Year after year, I watched the same communities rebuild, only to be struck down again.

That repetition — of suffering, survival, and starting over — moved something in me that has never left. In 2021, that conviction led me to establish Humanity Public Library, and subsequently the Youth Climate Network (YCN).

Our Mission is to mobilize, equip, and amplify the power of young people to drive transformative action on climate change, environmental justice, and sustainable development — building the capacity of youth leaders and frontline communities, so that no community is left behind.`)
                  .split('\n\n')
                  .filter(Boolean)
                  .map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowFullFounderModal(false)}
                  className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
