import { useState, useEffect, useRef } from 'react';
import { SEO } from './ui/SEO';
import { Link } from 'react-router';
import { Download, ArrowRight, TrendingUp } from 'lucide-react';
import { useStats, useNews } from '../lib/api';
import type { NewsItem } from '../lib/storage';
import { CardSkeleton } from './ui/Skeletons';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useLanguage } from '../lib/LanguageContext';

function useCountUp(end: number) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = 0;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 2000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end]);

  return { count, ref };
}

export function ImpactPage() {
  const { t } = useLanguage();
  const { data: stats = { peopleReached: 0, treesPlanted: 0, volunteers: 0, projects: 0, partners: 0, districts: 0 } as any } = useStats();
  const { data: news = [], isLoading: newsLoading } = useNews();
  
  const programImpact = [
    { name: t('Climate Justice', 'জলবায়ু ন্যায়বিচার'), value: 85 },
    { name: t('Education', 'শিক্ষা'), value: 92 },
    { name: t('WASH', 'ওয়াশ'), value: 78 },
    { name: t('Disaster Risk', 'দুর্যোগ ঝুঁকি'), value: 88 },
    { name: t('Livelihoods', 'জীবিকা'), value: 72 },
    { name: t('Energy', 'জ্বালানি'), value: 65 },
    { name: t('Youth Dev', 'যুব উন্নয়ন'), value: 95 },
    { name: t('Women', 'নারী'), value: 80 },
  ];

  const yearlyReach = [
    { year: t('2022', '২০২২'), people: 1200 },
    { year: t('2023', '২০২৩'), people: 4800 },
    { year: t('2024', '২০২৪'), people: 12500 },
    { year: t('2025*', '২০২৫*'), people: 25000 },
  ];

  const reports = [
    { title: t('YCN Annual Report 2024', 'ওয়াইসিএন বার্ষিক প্রতিবেদন ২০২৪'), date: t('January 2025', 'জানুয়ারি ২০২৫'), pages: t('48', '৪৮'), type: t('Annual Report', 'বার্ষিক প্রতিবেদন') },
    { title: t('Climate Impact Assessment 2024', 'জলবায়ু প্রভাব মূল্যায়ন ২০২৪'), date: t('December 2024', 'ডিসেম্বর ২০২৪'), pages: t('32', '৩২'), type: t('Research Report', 'গবেষণা প্রতিবেদন') },
    { title: t('Youth Leadership Academy Outcomes Report', 'যুব নেতৃত্ব একাডেমি ফলাফল প্রতিবেদন'), date: t('October 2024', 'অক্টোবর ২০২৪'), pages: t('24', '২৪'), type: t('Program Report', 'প্রোগ্রাম প্রতিবেদন') },
    { title: t('WASH Program Evaluation 2023–24', 'ওয়াশ কার্যক্রম মূল্যায়ন ২০২৩-২৪'), date: t('September 2024', 'সেপ্টেম্বর ২০২৪'), pages: t('36', '৩৬'), type: t('Evaluation', 'মূল্যায়ন') },
    { title: t('Sundarbans Mangrove Restoration Progress', 'সুন্দরবন ম্যানগ্রোভ পুনরুদ্ধার অগ্রগতি'), date: t('August 2024', 'আগস্ট ২০২৪'), pages: t('20', '২০'), type: t('Field Report', 'মাঠপর্যায়ের প্রতিবেদন') },
  ];

  const caseStudies = [
    {
      name: t('Rohima Khatun, 34', 'রহিমা খাতুন, ৩৪'),
      location: t('Shyamnagar, Satkhira', 'শ্যামনগর, সাতক্ষীরা'),
      program: t('Women Empowerment', 'নারী ক্ষমতায়ন'),
      story: t(
        'After joining YCN\'s Women\'s Climate Leadership Program, Rohima formed a 20-member savings group in her village. The group now manages a collective fund that helped 8 families recover after Cyclone Remal destroyed their crops.',
        'ওয়াইসিএন-এর নারীদের জলবায়ু নেতৃত্ব কর্মসূচিতে যোগদানের পর রহিমা তার গ্রামে ২০ সদস্যের একটি সঞ্চয় দল গঠন করেন। এই দলটি এখন একটি যৌথ তহবিল পরিচালনা করে যা ঘূর্ণিঝড় রেমালের পর ৮টি পরিবারকে তাদের ফসলহানি কাটিয়ে উঠতে সহায়তা করেছে।'
      ),
      impact: t('Led community climate resilience group · Secured BDT 80,000 emergency fund', 'সামাজিক জলবায়ু সহনশীলতা দলের নেতৃত্ব · ৮০,০০০ টাকা জরুরি তহবিল সংগ্রহ'),
      color: '#AD1457',
      bg: '#FCE4EC',
    },
    {
      name: t('Karim Uddin, 22', 'করিম উদ্দিন, ২২'),
      location: t('Dacope, Khulna', 'দাকোপ, খুলনা'),
      program: t('Youth Leadership Academy', 'যুব নেতৃত্ব একাডেমি'),
      story: t(
        'A fisherman\'s son who joined YCN\'s Youth Leadership Academy, Karim is now training 30 other young people in climate-smart fishing practices and coordinating the local youth disaster response team.',
        'জেলে পরিবারের সন্তান করিম ওয়াইসিএন-এর যুব নেতৃত্ব একাডেমিতে যোগ দেন। তিনি এখন অন্য ৩০ জন যুবককে জলবায়ু-সহনশীল মাছ ধরার বিষয়ে প্রশিক্ষণ দিচ্ছেন এবং স্থানীয় যুব দুর্যোগ সাড়াদান দলের সমন্বয় করছেন।'
      ),
      impact: t('Youth leader training 30 peers · Disaster response coordinator', '৩০ জন সহকর্মীকে প্রশিক্ষণ দেওয়া যুবনেতা · দুর্যোগ সাড়াদান সমন্বয়কারী'),
      color: '#E8521A',
      bg: '#FFF3EE',
    },
    {
      name: t('Fatema Akter, 16', 'ফাতেমা আক্তার, ১৬'),
      location: t('Mongla, Bagerhat', 'মোংলা, বাগেরহাট'),
      program: t('Girls\' Education', 'মেয়েদের শিক্ষা'),
      story: t(
        'Fatema was at risk of dropping out due to family financial pressure worsened by flooding. Through YCN\'s scholarship program and community mentoring, she has returned to school and joined the school climate club.',
        'বন্যার কারণে সৃষ্ট পারিবারিক আর্থিক সংকটে ফাতেমার স্কুল ছাড়ার উপক্রম হয়েছিল। ওয়াইসিএন-এর বৃত্তি কার্যক্রম এবং সামাজিক দিকনির্দেশনার মাধ্যমে সে আবার স্কুলে ফিরে গেছে এবং স্কুলের জলবায়ু ক্লাবে যোগ দিয়েছে।'
      ),
      impact: t('Returned to school · Climate club member · Academic scholarship recipient', 'স্কুলে প্রত্যাবর্তন · জলবায়ু ক্লাবের সদস্য · শিক্ষাবৃত্তি প্রাপ্তি'),
      color: '#1A6B3C',
      bg: '#E8F5EE',
    },
    {
      name: t('Abdul Malek, 55', 'আব্দুল মালেক, ৫৫'),
      location: t('Koyra, Khulna', 'কয়রা, খুলনা'),
      program: t('Resilience Agriculture', 'সহনশীল কৃষি'),
      story: t(
        'A farmer whose fields turned saline after cyclone storm surge, Abdul transitioned to floating garden farming through YCN\'s resilience agriculture program. His income has increased by 40% and he now mentors 12 other farmers.',
        'ঘূর্ণিঝড়ের জলোচ্ছ্বাসের পর চাষের জমি লবণাক্ত হয়ে যাওয়ায় আব্দুল চাষাবাদে বড় লোকসানে পড়েন। ওয়াইসিএন-এর সহনশীল কৃষি কর্মসূচির মাধ্যমে তিনি ভাসমান সবজি চাষ শুরু করেন। তার আয় ৪০% বৃদ্ধি পেয়েছে এবং এখন তিনি ১২ জন অন্য কৃষককে পরামর্শ দিচ্ছেন।'
      ),
      impact: t('40% income increase · Mentors 12 farmers · Climate-smart farmer advocate', '৪০% আয় বৃদ্ধি · ১২ জন কৃষককে পরামর্শ দান · জলবায়ু সহনশীল কৃষি প্রচারক'),
      color: '#0E7490',
      bg: '#E0F7FA',
    },
  ];

  function StatBig({ value, suffix = '+', label, sublabel }: { value: number; suffix?: string; label: string; sublabel?: string }) {
    const { count, ref } = useCountUp(value);
    const displayVal = t(count.toLocaleString(), count.toLocaleString().replace(/0/g, '০').replace(/1/g, '১').replace(/2/g, '২').replace(/3/g, '৩').replace(/4/g, '৪').replace(/5/g, '৫').replace(/6/g, '৬').replace(/7/g, '৭').replace(/8/g, '৮').replace(/9/g, '৯'));
    const displaySuffix = t(suffix, suffix === '+' ? '+' : suffix);

    return (
      <div ref={ref} className="p-4 sm:p-5 rounded-2xl text-center bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-center h-full min-w-0">
      <SEO title="Impact" />
        <div className="font-bold mb-1" style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)', fontFamily: 'Poppins, sans-serif', color: '#0A3320', lineHeight: 1.1, wordBreak: 'break-all' }}>
          {displayVal}{displaySuffix}
        </div>
        <div className="font-semibold mb-1 text-sm sm:text-base leading-snug" style={{ fontFamily: 'Inter, sans-serif', color: '#1F2937' }}>{label}</div>
        {sublabel && <div className="text-[11px] sm:text-xs" style={{ color: '#9CA3AF', lineHeight: 1.25 }}>{sublabel}</div>}
      </div>
    );
  }

  function NewsCard({ item }: { item: NewsItem }) {
    const displayDate = t(
      new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      new Date(item.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    );

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
        <div className="h-44 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full self-start mb-3" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{item.category}</span>
          <h3 className="font-semibold mb-2 flex-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937', fontSize: '0.95rem' }}>{item.title}</h3>
          <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>{displayDate}</p>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{item.excerpt.slice(0, 100)}...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 30% 50%, #E8521A 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Impact & Results', 'প্রভাব ও ফলাফল')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Our Impact & Stories', 'আমাদের প্রভাব ও অনন্য গল্প')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.05rem' }}>
            {t(
              'Measuring what matters — tracking real change in communities, ecosystems, and lives across Bangladesh and the region.',
              'প্রকৃত পরিবর্তনের সঠিক রূপরেখা — বাংলাদেশ এবং এই অঞ্চলের মানুষের জীবন, বাস্তুসংস্থান ও সমাজে পরিবর্তন ট্র্যাকিং করা হচ্ছে।'
            )}
          </p>
        </div>
      </section>

      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      {/* Stats Dashboard */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#1F2937' }}>
              <TrendingUp size={22} style={{ color: '#E8521A' }} /> {t('Impact Dashboard', 'প্রভাব ড্যাশবোর্ড')}
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              {t('Cumulative results since 2022 — verified through community-based monitoring', '২০২২ সাল থেকে পুঞ্জীভূত ফলাফল — সামাজিক পর্যবেক্ষণ দ্বারা যাচাইকৃত')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <StatBig value={stats.peopleReached} label={t("People Reached", "উপকৃত মানুষ")} sublabel={t("Direct beneficiaries", "সরাসরি উপকারভোগী")} />
            <StatBig value={stats.treesPlanted} label={t("Trees Planted", "রোপিত বৃক্ষ")} sublabel={t("50% survival rate+", "৫০%+ বেঁচে থাকার হার")} />
            <StatBig value={stats.volunteers} label={t("Volunteers", "স্বেচ্ছাসেবক")} sublabel={t("Active network", "সক্রিয় নেটওয়ার্ক")} />
            <StatBig value={stats.projects} label={t("Projects", "প্রকল্প")} sublabel={t("Across 8 districts", "৮টি জেলা জুড়ে")} />
            <StatBig value={stats.partners} label={t("Partners", "অংশীদার")} sublabel={t("Govt., NGO, UN", "সরকারি, এনজিও ও জাতিসংঘ")} />
            <StatBig value={stats.districts} label={t("Districts", "জেলাসমূহ")} sublabel={t("Bangladesh coverage", "বাংলাদেশ কভারেজ")} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                {t('Program Effectiveness Score (%)', 'প্রোগ্রাম কার্যকারিতা স্কোর (%)')}
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={programImpact}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280', fontFamily: 'Inter, sans-serif' }} />
                  <Radar name="Effectiveness" dataKey="value" stroke="#E8521A" fill="#E8521A" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                {t('Annual Community Reach (People)', 'বার্ষিক সামাজিক পৌঁছানো (মানুষ)')}
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={yearlyReach} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontFamily: 'Inter, sans-serif', fontSize: 12 }}
                    formatter={(v: number) => [v.toLocaleString(), t('People Reached', 'উপকৃত মানুষ')]}
                  />
                  <Bar dataKey="people" radius={[6, 6, 0, 0]}>
                    {yearlyReach.map((entry, i) => (
                      <Cell key={`cell-${entry.year}`} fill={i === 3 ? '#E8521A80' : '#0A3320'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>* {t('2025 projected target', '২০২৫ সালের লক্ষ্যমাত্রা')}</p>
            </div>
          </div>

          {/* KPIs by program */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
              {t('Key Performance Indicators', 'মূল কার্যকারিতা নির্দেশক (KPI)')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                    <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#1F2937', fontFamily: 'Inter, sans-serif' }}>
                      {t('Program Area', 'প্রোগ্রাম ক্ষেত্র')}
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#1F2937', fontFamily: 'Inter, sans-serif' }}>
                      {t('Key Indicators', 'প্রধান সূচকসমূহ')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { area: t('Climate Justice', 'জলবায়ু ন্যায়বিচার'), kpi: t('120 youth advocates trained · 8 policy submissions · 2 biodiversity sites protected', '১২০ জন যুব অ্যাডভোকেট প্রশিক্ষিত · ৮টি নীতি প্রস্তাব · ২টি জীববৈচিত্র্য সাইট সংরক্ষিত') },
                    { area: t('Education & Research', 'শিক্ষা ও গবেষণা'), kpi: t('3,500 students reached · 12 research papers · 25 schools with climate curriculum', '৩,৫০০ শিক্ষার্থী উপকৃত · ১২টি গবেষণা পত্র · ২৫টি স্কুলে জলবায়ু কারিকুলাম') },
                    { area: t('WASH', 'ওয়াশ'), kpi: t('3,000 households with clean water · 450 latrines constructed · 15% ODF reduction', '৩,০০০ পরিবারে নিরাপদ পানি সরবরাহ · ৪৫০টি ল্যাট্রিন নির্মাণ · ১৫% ওডিএফ হ্রাস') },
                    { area: t('Disaster Risk', 'দুর্যোগ ঝুঁকি'), kpi: t('400 volunteers trained · 12 communities with DRR plans · 5,000 people reached in relief', '৪০০ জন স্বেচ্ছাসেবক প্রশিক্ষিত · ১২টি সামাজিক দুর্যোগ ঝুঁকি হ্রাস পরিকল্পনা · ৫,০০০ পরিবারে ত্রাণ প্রদান') },
                    { area: t('Livelihoods', 'জীবিকা ও কৃষি'), kpi: t('800 farmers adopting climate-smart practices · 35% avg income increase', '৮০০ কৃষক জলবায়ু-সহনশীল কৃষি প্রযুক্তি গ্রহণ করেছেন · গড়ে ৩৫% আয় বৃদ্ধি') },
                    { area: t('Renewable Energy', 'নবায়নযোগ্য শক্তি'), kpi: t('500 solar households · 120 biogas units · 850 tonnes CO₂ avoided', '৫০০ সোলার চালিত বাড়ি · ১২০টি বায়োগ্যাস প্ল্যান্ট · ৮৫০ টন কার্বন নিঃসরণ হ্রাস') },
                    { area: t('Tree Plantation', 'বৃক্ষরোপণ'), kpi: t('50,000+ trees planted · 52% survival rate at 12 months · 18 ha ecosystem restored', '৫০,০০০+ গাছ রোপণ · ৫২% বেঁচে থাকার হার (১২ মাস) · ১৮ হেক্টর বাস্তুসংস্থান পুনরুদ্ধার') },
                    { area: t('Youth Development', 'যুব উন্নয়ন'), kpi: t('850 youth trained · 120 youth in leadership roles · 65% employed post-training', '৮৫০ জন যুব প্রশিক্ষিত · ১২০ জন যুব নেতৃস্থানীয় পদে · ৬৫% কর্মসংস্থান সৃষ্টি') },
                    { area: t('Women Empowerment', 'নারী ক্ষমতায়ন'), kpi: t('25 women\'s groups formed · 40 women in leadership · 180 girls retained in school', '২৫টি নারী দল গঠন · ৪০ জন নারী নেতৃস্থানীয় পদে · ১৮০ জন মেয়েকে ড্রপ-আউট থেকে রক্ষা') },
                    { area: t('Health & Nutrition', 'স্বাস্থ্য ও পুষ্টি'), kpi: t('200 community health volunteers · 12% malnutrition reduction · 4,000 households reached', '২০০ জন সামাজিক স্বাস্থ্য কর্মী · ১২% অপুষ্টি হ্রাস · ৪,০০০ পরিবারে স্বাস্থ্য সেবা') },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td className="py-3 pr-4 font-medium whitespace-nowrap" style={{ color: '#1F2937', fontFamily: 'Inter, sans-serif' }}>{row.area}</td>
                      <td className="py-3 text-xs leading-relaxed" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{row.kpi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>
              {t('Beneficiary Stories', 'উপকারভোগীদের গল্প')}
            </div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              {t('Voices from the Frontline', 'সম্মুখ সমরের মানুষের কণ্ঠস্বর')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((cs) => (
              <div key={cs.name} className="rounded-2xl p-6 hover:shadow-lg transition-all duration-300" style={{ backgroundColor: cs.bg, border: `1px solid ${cs.color}20` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{ backgroundColor: cs.color, color: '#fff', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {cs.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{cs.name}</h4>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{cs.location}</p>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: cs.color, color: '#fff' }}>{cs.program}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
                  "{cs.story}"
                </p>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: cs.color }}>{t('Impact:', 'প্রভাব:')}</p>
                  <p className="text-xs" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{cs.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Reports */}
      <section className="py-20" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: '#FFF8E1', color: '#D97706' }}>
              {t('Publications', 'প্রকাশনাসমূহ')}
            </div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              {t('Reports & Publications', 'প্রতিবেদন ও প্রকাশনাসমূহ')}
            </h2>
          </div>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.title}
                className="bg-white rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F5EE' }}>
                    <Download size={18} style={{ color: '#1A6B3C' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{report.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{report.type}</span>
                      <span className="text-xs" style={{ color: '#9CA3AF' }}>{report.date} · {report.pages} {t('pages', 'পৃষ্ঠা')}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-1.5 flex-shrink-0"
                  style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                >
                  <Download size={12} /> {t('Download', 'ডাউনলোড')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              {t('Latest News & Updates', 'সর্বশেষ সংবাদ ও আপডেট')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsLoading ? (
              Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
            ) : news.map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#0A3320' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#F0ECD8' }}>
            {t('Help us reach more communities', 'আরো বেশি মানুষের কাছে পৌঁছাতে সাহায্য করুন')}
          </h3>
          <p className="mb-8 text-sm" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>
            {t(
              'Every donation, volunteer hour, and partnership helps us expand our impact to more frontline communities.',
              'প্রতিটি অনুদান, স্বেচ্ছাসেবকের সময় এবং অংশীদারিত্ব আমাদের সাহায্য করে ফ্রন্টলাইন মানুষের মাঝে কাজ আরও ছড়িয়ে দিতে।'
            )}
          </p>
          <Link to="/get-involved" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ backgroundColor: '#E8521A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {t('Support Our Mission', 'আমাদের মিশন সফল করুন')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
