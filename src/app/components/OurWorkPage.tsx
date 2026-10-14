import { SEO } from './ui/SEO';
import { Link } from 'react-router';
import * as LucideIcons from 'lucide-react';
import {
  Sprout, Users, Globe, Trees, ArrowRight,
  Droplets, ShieldAlert, Sun, BookOpen
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { useOurWork } from '../lib/api';

function getWorkIcon(item: any) {
  if (item.icon && typeof item.icon !== 'string') return item.icon;
  if (item.iconName && (LucideIcons as any)[item.iconName]) {
    return (LucideIcons as any)[item.iconName];
  }
  return Sprout;
}

export function OurWorkPage() {
  const { t } = useLanguage();
  const { data: apiWork = [] } = useOurWork();

  const defaultFocusPrograms = [
    {
      id: 'climate-action',
      title: 'Climate Action',
      title_bn: 'জলবায়ু কার্যক্রম',
      desc: 'Advocacy, awareness and on-ground climate initiatives.',
      desc_bn: 'অ্যাডভোকেসি, সচেতনতা ও মাঠপর্যায়ের জলবায়ু উদ্যোগ।',
      icon: Sprout,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      link: '/our-work/climate-action',
    },
    {
      id: 'education-research',
      title: 'Education & Research',
      title_bn: 'শিক্ষা ও গবেষণা',
      desc: 'Building climate knowledge and youth leadership.',
      desc_bn: 'জলবায়ু জ্ঞান ও যুব নেতৃত্ব বিকাশ।',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      link: '/our-work/education-research',
    },
    {
      id: 'wash',
      title: 'WASH',
      title_bn: 'ওয়াশ (পানি ও স্যানিটেশন)',
      desc: 'Promoting clean water, sanitation and hygiene.',
      desc_bn: 'নিরাপদ পানি, স্যানিটেশন ও স্বাস্থ্যবিধি নিশ্চিতকরণ।',
      icon: Droplets,
      image: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=800&q=80',
      link: '/our-work/wash',
    },
    {
      id: 'disaster-risk-reduction',
      title: 'Disaster Risk Reduction',
      title_bn: 'দুর্যোগ ঝুঁকি হ্রাস',
      desc: 'Stronger communities through preparedness.',
      desc_bn: 'পূর্বপ্রস্তুতির মাধ্যমে দুর্যোগ সহনশীল সমাজ গঠন।',
      icon: ShieldAlert,
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      link: '/our-work/disaster-risk-reduction',
    },
    {
      id: 'livelihoods-agriculture',
      title: 'Livelihoods & Agriculture',
      title_bn: 'জীবিকা ও কৃষি',
      desc: 'Climate-resilient and sustainable livelihoods.',
      desc_bn: 'জলবায়ু সহনশীল ও টেকসই কৃষিজীবিকা।',
      icon: Trees,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      link: '/our-work/livelihoods-agriculture',
    },
    {
      id: 'renewable-energy',
      title: 'Renewable Energy',
      title_bn: 'নবায়নযোগ্য শক্তি',
      desc: 'Supporting clean and sustainable energy solutions.',
      desc_bn: 'স্বচ্ছ ও টেকসই জ্বালানি প্রযুক্তির সম্প্রসারণ।',
      icon: Sun,
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
      link: '/our-work/renewable-energy',
    },
  ];

  const focusPrograms = (apiWork && apiWork.length > 0)
    ? apiWork.map(w => ({
        id: w.slug || w.id || (w as any)._id,
        title: w.title,
        title_bn: w.title_bn || w.title,
        desc: w.desc || '',
        desc_bn: w.desc_bn || w.desc || '',
        icon: getWorkIcon(w),
        image: w.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        link: w.link || `/our-work/${w.slug || w.id || (w as any)._id}`,
      }))
    : defaultFocusPrograms;


  return (
    <div className="min-h-screen bg-[#FBFBFB] text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      <SEO
        title="Our Programs | Turning Ideas Into Impact"
        description="Youth-led programs for a cleaner, greener and more resilient Bangladesh. Explore climate action, WASH, research, and livelihoods."
      />

      {/* Hero Section matching Image 1 Left */}
      <section className="relative min-h-[520px] flex items-center pt-28 pb-20 overflow-hidden">
        {/* Background photo of youth tree planting */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80"
            alt="Youth climate tree planting"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#062416]/95 via-[#0A3320]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl space-y-5">
            <span
              className="text-xs font-bold tracking-widest uppercase block"
              style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}
            >
              {t('OUR PROGRAMS', 'আমাদের কার্যক্রমসমূহ')}
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('Turning Ideas Into Impact', 'ধারণা থেকে বাস্তব প্রভাব সৃষ্টি')}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl">
              {t(
                'Youth-led programs for a cleaner, greener and more resilient Bangladesh.',
                'একটি পরিচ্ছন্ন, সবুজ ও জলবায়ু-সহনশীল বাংলাদেশের জন্য যুব-নেতৃত্বাধীন উদ্যোগ।'
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#focus-areas"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: '#E8521A' }}
              >
                {t('Explore Our Programs', 'আমাদের কার্যক্রম দেখুন')} &rarr;
              </a>
              <a
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-white border border-white/40 hover:bg-white/10 transition-colors"
              >
                {t('Our Approach', 'আমাদের দৃষ্টিভঙ্গি')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Value Pillars (White Bar) */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center flex-shrink-0">
                <Sprout size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('Youth-Led', 'যুব-নেতৃত্ব')}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('Driven by young changemakers', 'তরুণ পরিবর্তনের অগ্রদূত')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center flex-shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('Community Focused', 'কমিউনিটি কেন্দ্রিক')}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('Solutions from the ground up', 'তৃণমূল থেকে সমাধান')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center flex-shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('Evidence-Based', 'গবেষণা ও প্রমাণ-ভিত্তিক')}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('Research and real impact', 'গবেষণা ও বাস্তব প্রভাব')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center flex-shrink-0">
                <Trees size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('A Greener Future', 'সবুজ ভবিষ্যৎ')}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('For a resilient Bangladesh', 'একটি সহনশীল বাংলাদেশের জন্য')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas Section (6 Cards Grid) */}
      <section id="focus-areas" className="py-20 max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span
            className="text-xs font-bold tracking-widest uppercase block mb-2"
            style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}
          >
            {t('OUR FOCUS AREAS', 'আমাদের মূল কাজের ক্ষেত্র')}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('Programs for a Climate-Resilient Bangladesh', 'জলবায়ু সহনশীল বাংলাদেশের জন্য কর্মসূচি')}
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
            {t(
              'We work across key areas to empower youth, strengthen communities and create lasting environmental impact.',
              'আমরা যুবকদের ক্ষমতায়ন, সম্প্রদায়ের সক্ষমতা বৃদ্ধি এবং দীর্ঘস্থায়ী পরিবেশগত প্রভাব তৈরিতে কাজ করি।'
            )}
          </p>
        </div>

        {/* 2 Rows x 3 Columns Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusPrograms.map(item => (
            <Link
              key={item.id}
              to={item.link || `/our-work/${item.id}`}
              className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <item.icon size={16} />
                  </div>
                  <h3
                    className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {t(item.title, item.title_bn)}
                  </h3>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {t(item.desc, item.desc_bn)}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8521A] transition-colors">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner (Image 1 Left bottom) */}
      <section className="bg-[#0A3320] py-14 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase">
              {t('GET INVOLVED', 'যোগ দিন')}
            </span>
            <h3
              className="text-2xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('Support Our Programs', 'আমাদের কার্যক্রমে যুক্ত হোন')}
            </h3>
            <p className="text-xs text-emerald-200/80 max-w-xl">
              {t(
                'Whether you want to volunteer, partner or support our work, there are many ways to make a difference.',
                'আপনি স্বেচ্ছাসেবক, অংশীদার বা সহযোগী যেভাবেই হোক না কেন, একটি টেকসই ভবিষ্যতের পরিবর্তনে অবদান রাখতে পারেন।'
              )}
            </p>
          </div>

          <Link
            to="/get-involved"
            className="px-6 py-3 rounded-full text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 flex-shrink-0"
            style={{ backgroundColor: '#E8521A' }}
          >
            {t('Join the Network', 'নেটওয়ার্কে যুক্ত হোন')} &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
