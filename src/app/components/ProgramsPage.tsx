import { useState, useMemo } from 'react';
import { SEO } from './ui/SEO';
import { Link } from 'react-router';
import { allPrograms } from '../lib/data';
import * as LucideIcons from 'lucide-react';
import {
  ArrowRight, Search, X, Sparkles, Filter,
  Layers, CheckCircle2, HeartHandshake, Compass
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { usePrograms } from '../lib/api';

function getProgramIcon(program: any) {
  if (program.icon && typeof program.icon !== 'string') return program.icon;
  if (program.iconName && (LucideIcons as any)[program.iconName]) {
    return (LucideIcons as any)[program.iconName];
  }
  return Compass;
}

export function ProgramsPage() {
  const { t, lang } = useLanguage();
  const { data: apiPrograms = [] } = usePrograms();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const sourcePrograms = useMemo(() => {
    if (apiPrograms && apiPrograms.length > 0) {
      return apiPrograms.map(p => ({
        ...p,
        id: p.slug || p.id || p._id,
        icon: getProgramIcon(p),
      }));
    }
    return allPrograms;
  }, [apiPrograms]);

  // Categories definition
  const categories = useMemo(() => [
    { key: 'All', label: t(`All Programs (${sourcePrograms.length})`, `সকল প্রোগ্রাম (${sourcePrograms.length})`), icon: Layers },
    { key: 'Climate', label: t('Climate & Ecology', 'জলবায়ু ও পরিবেশ'), icon: Compass },
    { key: 'Health', label: t('WASH & Public Health', 'পানি ও স্বাস্থ্যবিধি'), icon: Sparkles },
    { key: 'Disaster', label: t('Disaster & DRR', 'দুর্যোগ ব্যবস্থাপনা'), icon: Filter },
    { key: 'Youth', label: t('Youth & Leadership', 'যুব ও নেতৃত্ব'), icon: Layers },
    { key: 'Livelihoods', label: t('Livelihoods & Energy', 'জীবিকা ও শক্তি'), icon: Sparkles },
  ], [t, sourcePrograms.length]);

  // Filter programs by category and search
  const filteredPrograms = useMemo(() => {
    return sourcePrograms.filter(program => {
      // Category match
      let matchesCat = true;
      if (activeCategory !== 'All') {
        const theme = (program.theme || '').toLowerCase();
        const id = (program.id || '').toLowerCase();
        if (activeCategory === 'Climate') {
          matchesCat = theme.includes('climate') || theme.includes('nature') || theme.includes('coastal') || theme.includes('waste');
        } else if (activeCategory === 'Health') {
          matchesCat = theme.includes('health') || theme.includes('water') || theme.includes('wash') || theme.includes('mental');
        } else if (activeCategory === 'Disaster') {
          matchesCat = theme.includes('disaster') || theme.includes('resilience') || id.includes('disaster') || id.includes('urban');
        } else if (activeCategory === 'Youth') {
          matchesCat = theme.includes('youth') || theme.includes('women') || theme.includes('education');
        } else if (activeCategory === 'Livelihoods') {
          matchesCat = theme.includes('livelihood') || theme.includes('energy') || theme.includes('agriculture') || theme.includes('finance');
        }
      }

      // Search match
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const titleEn = (program.title || '').toLowerCase();
      const titleBn = (program.title_bn || '').toLowerCase();
      const descEn = (program.description || '').toLowerCase();
      const descBn = (program.description_bn || '').toLowerCase();
      const themeEn = (program.theme || '').toLowerCase();

      const matchesSearch =
        titleEn.includes(q) ||
        titleBn.includes(q) ||
        descEn.includes(q) ||
        descBn.includes(q) ||
        themeEn.includes(q);

      return matchesCat && matchesSearch;
    });
  }, [searchQuery, activeCategory, sourcePrograms]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <SEO
        title="Strategic Programs & Pillars | Youth Climate Network Bangladesh"
        description="Explore Youth Climate Network's 20 strategic program pillars addressing climate justice, clean water, disaster resilience, renewable energy, and youth leadership across Bangladesh."
        keywords="YCN programs, climate justice programs, 20 program pillars, youth leadership programs bangladesh, climate adaptation initiatives"
      />

      {/* ── 1. HERO BANNER ── */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-[#072416] text-white">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 15% 50%, #E8521A 0%, transparent 45%), radial-gradient(circle at 85% 30%, #1A6B3C 0%, transparent 50%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs font-medium text-emerald-300/80 mb-4 font-inter">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white">Programs</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-4">
              <Sparkles size={13} className="text-[#E8521A]" />
              <span>20 Strategic Program Pillars · Bangladesh & South Asia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0ECD8] mb-5 tracking-tight leading-tight font-poppins">
              {t('Our Strategic Programs & Action Pillars', 'আমাদের কৌশলগত প্রোগ্রাম ও কর্মপদ্ধতি')}
            </h1>

            <p className="text-base sm:text-lg text-[#A8C4B0] font-normal leading-relaxed font-inter mb-8">
              {t(
                'A comprehensive portfolio of 20 grassroots-to-policy program pillars engineered to tackle the multifaceted impacts of climate change, protect frontline delta communities, and cultivate youth leadership.',
                'জলবায়ু পরিবর্তনের বহুমুখী প্রভাব মোকাবেলা, উপকূলীয় ঝুঁকিপূর্ণ জনগোষ্ঠীকে সুরক্ষা প্রদান এবং তরুণ নেতৃত্ব বিকাশে প্রণীত ২০টি তৃণমূল-থেকে-নীতিভিত্তিক কৌশলগত কর্মসূচি।'
              )}
            </p>

            {/* Impact Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-emerald-800/60">
              {[
                { val: '20', label: t('Program Pillars', 'প্রোগ্রাম পিলার') },
                { val: '64', label: t('Districts Reached', 'জেলা আওতাধীন') },
                { val: '1,200+', label: t('Active Volunteers', 'সক্রিয় স্বেচ্ছাসেবক') },
                { val: '50K+', label: t('Frontline Beneficiaries', 'উপকৃত জনগোষ্ঠী') },
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-[#E8521A] font-poppins leading-none mb-1">
                    {m.val}
                  </div>
                  <div className="text-[11px] text-emerald-200/80 font-inter">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FILTER & SEARCH CONTROLS ── */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#0A3320] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80 flex-shrink-0">
              <input
                type="text"
                placeholder={t('Search 20 programs by keyword...', '২০টি প্রোগ্রামের মধ্যে খুঁজুন...')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1A6B3C] font-inter text-gray-800"
              />
              <Search size={14} className="absolute left-3 top-3 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. PROGRAMS GRID ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs font-semibold text-gray-500 font-inter">
              {t(
                `Showing ${filteredPrograms.length} of ${sourcePrograms.length} strategic programs`,
                `${sourcePrograms.length} টির মধ্যে ${filteredPrograms.length} টি প্রোগ্রাম প্রদর্শিত হচ্ছে`
              )}
            </p>

            {(searchQuery || activeCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-xs font-semibold text-[#E8521A] hover:underline"
              >
                {t('Reset Filters', 'ফিল্টার রিসেট করুন')}
              </button>
            )}
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto shadow-sm">
              <Search size={40} className="mx-auto mb-3 text-gray-300" />
              <h3 className="font-bold text-base text-gray-900 font-poppins mb-1">
                {t('No programs found', 'কোনো প্রোগ্রাম পাওয়া যায়নি')}
              </h3>
              <p className="text-xs text-gray-500 font-inter mb-5">
                {t(
                  `No programs matched "${searchQuery}". Try selecting another category or resetting filters.`,
                  `"${searchQuery}" এর সাথে কোনো প্রোগ্রাম মিলেনি। অন্য কোনো ক্যাটাগরি বেছে নিন বা রিসেট করুন।`
                )}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0A3320] text-white text-xs font-semibold hover:bg-[#13532e]"
              >
                {t('View All Programs', 'সকল প্রোগ্রাম দেখুন')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map(program => {
                const title = lang === 'bn' ? program.title_bn : program.title;
                const desc = lang === 'bn' ? program.description_bn : program.description;
                const keyPrograms = (lang === 'bn' ? program.keyPrograms_bn : program.keyPrograms) || [];
                const Icon = program.icon;

                return (
                  <div
                    key={program.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {/* Top Accent Strip */}
                      <div
                        className="h-1.5 w-full"
                        style={{
                          background: `linear-gradient(90deg, ${program.color}, ${program.color}50)`,
                        }}
                      />

                      <div className="p-6">
                        {/* Header icon & category badge */}
                        <div className="flex items-center justify-between gap-3 mb-5">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                            style={{ backgroundColor: program.bg }}
                          >
                            <Icon size={22} style={{ color: program.color }} />
                          </div>

                          <span
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                            style={{
                              backgroundColor: `${program.color}10`,
                              color: program.color,
                              borderColor: `${program.color}30`,
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {lang === 'bn' && program.theme_bn ? program.theme_bn : program.theme}
                          </span>
                        </div>

                        {/* Program Title */}
                        <h3
                          className="font-bold text-lg text-gray-900 mb-3 leading-snug group-hover:text-[#1A6B3C] transition-colors"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          {title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-5 font-inter">
                          {desc}
                        </p>

                        {/* Key initiatives bullet highlights */}
                        {keyPrograms.length > 0 && (
                          <div className="space-y-1.5 pt-4 border-t border-gray-100 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                              {t('Core Initiatives:', 'মূল কার্যক্রম:')}
                            </span>
                            {keyPrograms.slice(0, 2).map((kp: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-600 font-inter">
                                <CheckCircle2 size={12} className="text-[#1A6B3C] flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{kp.split('—')[0]}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                      <Link
                        to={`/our-work/${program.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2"
                        style={{ color: program.color, fontFamily: 'Inter, sans-serif' }}
                      >
                        <span>{t('Explore Details', 'বিস্তারিত দেখুন')}</span>
                        <ArrowRight size={13} />
                      </Link>

                      <Link
                        to="/get-involved"
                        className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        {t('Support Role', 'সহযোগিতা করুন')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ── 4. HOW OUR PROGRAMS OPERATE (Systemic Model) ── */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase mb-2 block font-inter">
              {t('OUR DELIVERY MODEL', 'আমাদের কাজের মডেল')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 font-poppins">
              {t('How We Deliver Impact Across 20 Pillars', '২০টি পিলারে আমরা যেভাবে কাজ করি')}
            </h2>
            <p className="mt-3 text-sm text-gray-600 font-inter">
              {t(
                'Each program integrates frontline local knowledge with rigorous youth mobilization and international advocacy.',
                'প্রতিটি কর্মসূচি তৃণমূলের স্থানীয় জ্ঞান, নিবেদিত যুব কর্মী এবং আন্তর্জাতিক অ্যাডভোকেসিকে একত্রিত করে পরিচালিত হয়।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: t('Frontline Research & Need Analysis', 'ফ্রন্টলাইন গবেষণা ও চাহিদা নিরূপণ'),
                desc: t(
                  'Community surveys, participatory vulnerability assessments, and climate impact monitoring across vulnerable delta villages.',
                  'উপকূলীয় গ্রামে সামাজিক জরিপ, অংশগ্রহণমূলক ঝুঁকি মূল্যায়ন এবং জলবায়ু প্রভাব নিবিড়ভাবে পর্যবেক্ষণ।'
                ),
              },
              {
                step: '02',
                title: t('Youth Chapter Mobilization', 'যুব চ্যাপ্টার ও তৃণমূল সংহতি'),
                desc: t(
                  'Deploying trained youth brigades, disaster first-responders, and community organizers equipped with localized action tools.',
                  'প্রশিক্ষিত তরুণ দল, জরুরি সাড়াদানকারী কর্মী এবং প্রয়োজনীয় সরঞ্জামে সজ্জিত স্বেচ্ছাসেবী নেটওয়ার্কের সরাসরি মাঠে ভূমিকা।'
                ),
              },
              {
                step: '03',
                title: t('Policy Advocacy & Global Linkages', 'নীতিগত অ্যাডভোকেসি ও বৈশ্বিক সংযোগ'),
                desc: t(
                  'Translating grassroots outcomes into regional policy briefs, national roundtables, and international UNFCCC/COP platforms.',
                  'তৃণমূলের সাফল্যগুলোকে জাতীয় পলিসি ব্রিফ ও আন্তর্জাতিক জলবায়ু ফোরামে তুলে ধরে দীর্ঘমেয়াদি পরিবর্তন নিশ্চিত করা।'
                ),
              },
            ].map((st, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#F8F9FA] border border-gray-200 relative group hover:border-[#1A6B3C] transition-all">
                <div className="text-4xl font-black text-[#E8521A]/20 font-poppins mb-4 group-hover:text-[#E8521A] transition-colors">
                  {st.step}
                </div>
                <h3 className="font-bold text-lg text-gray-900 font-poppins mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-gray-600 font-inter leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CALL TO ACTION BANNER ── */}
      <section className="py-16 bg-[#072416] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F0ECD8] font-poppins">
            {t('Want to Co-Design or Sponsor a Strategic Program?', 'আমাদের কোনো প্রোগ্রাম স্পনসর বা যুক্ত হতে চান?')}
          </h2>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto font-inter">
            {t(
              'We partner with philanthropic foundations, research institutions, and international organizations to scale community impact.',
              'আমরা সমাজসেবামূলক প্রতিষ্ঠান, গবেষণা সংস্থা এবং আন্তর্জাতিক সহযোগীদের সাথে যৌথভাবে কাজ করি।'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/get-involved"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-[#E8521A] text-white hover:scale-105 transition-transform shadow-lg"
            >
              <HeartHandshake size={15} />
              <span>{t('Partner With a Program', 'প্রোগ্রাম পার্টনার হোন')}</span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-white text-[#0A3320] hover:bg-emerald-50 transition-colors shadow-lg"
            >
              <span>{t('Contact Programs Team', 'যোগাযোগ করুন')}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
