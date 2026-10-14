import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { SEO } from './ui/SEO';
import {
  Sprout, Users, MapPin, Trees,
  Megaphone, FileText, Play, X, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { useOurWork, usePrograms } from '../lib/api';

export function OurWorkDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();
  const { data: ourWorkItems = [] } = useOurWork();
  const { data: allPrograms = [] } = usePrograms();
  const [videoOpen, setVideoOpen] = useState(false);

  const programsData: Record<string, any> = {
    'climate-action': {
      title: 'Climate Action',
      title_bn: 'জলবায়ু কার্যক্রম',
      tagline: 'Empowering youth to take local action for a global impact.',
      heroImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80',
      overviewHeading: 'Youth-Led Solutions for a Resilient Tomorrow',
      overviewText:
        'Our Climate Action program empowers young people across Bangladesh to lead local initiatives, raise awareness and advocate for sustainable solutions. Through community engagement, campaigns and on-the-ground activities, we work towards a cleaner, greener and more climate-resilient Bangladesh.',
      videoThumbnail: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
      initiatives: [
        {
          title: 'Tree Planting & Ecosystem Restoration',
          desc: 'Restoring forests, mangroves and urban green spaces.',
          icon: Trees,
        },
        {
          title: 'Awareness Campaigns',
          desc: 'Engaging youth and communities on climate issues.',
          icon: Megaphone,
        },
        {
          title: 'Youth Climate Leadership',
          desc: 'Building the next generation of climate leaders.',
          icon: Users,
        },
        {
          title: 'Policy Advocacy',
          desc: 'Amplifying youth voices in climate policy discussions.',
          icon: FileText,
        },
      ],
      impactStats: [
        { value: '10,000+', label: 'Trees planted', icon: Trees },
        { value: '60+', label: 'Youth volunteers', icon: Users },
        { value: '20+', label: 'Communities reached', icon: MapPin },
        { value: '15+', label: 'Campaigns and initiatives', icon: Sprout },
      ],
    },
  };

  const matchedWork = ourWorkItems.find(w => w.slug === id || w.id === id);
  const matchedProgram = allPrograms.find(p => p.slug === id || p.id === id);
  const dynamicItem = matchedWork || matchedProgram;

  const defaultProgram = programsData[id || 'climate-action'] || {
    title: id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Climate Action',
    tagline: 'Empowering youth to take local action for a global impact.',
    heroImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80',
    overviewHeading: 'Youth-Led Solutions for a Resilient Tomorrow',
    overviewText:
      'Empowering young people across Bangladesh to lead local initiatives, raise awareness and advocate for sustainable solutions.',
    videoThumbnail: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
    initiatives: [
      { title: 'Tree Planting & Ecosystem Restoration', desc: 'Restoring forests and mangroves.', icon: Trees },
      { title: 'Awareness Campaigns', desc: 'Engaging youth and communities.', icon: Megaphone },
      { title: 'Youth Climate Leadership', desc: 'Building next generation leaders.', icon: Users },
      { title: 'Policy Advocacy', desc: 'Amplifying youth voices in climate discussions.', icon: FileText },
    ],
    impactStats: [
      { value: '10,000+', label: 'Trees planted', icon: Trees },
      { value: '60+', label: 'Youth volunteers', icon: Users },
      { value: '20+', label: 'Communities reached', icon: MapPin },
      { value: '15+', label: 'Campaigns and initiatives', icon: Sprout },
    ],
  };

  const program = dynamicItem ? {
    title: lang === 'bn' && dynamicItem.title_bn ? dynamicItem.title_bn : dynamicItem.title,
    tagline: (dynamicItem as any).theme || defaultProgram.tagline,
    heroImage: dynamicItem.image || defaultProgram.heroImage,
    overviewHeading: lang === 'bn' ? (dynamicItem.title_bn || dynamicItem.title) : `${dynamicItem.title} Initiatives`,
    overviewText: lang === 'bn' && (dynamicItem.desc_bn || (dynamicItem as any).description_bn)
      ? (dynamicItem.desc_bn || (dynamicItem as any).description_bn)
      : (dynamicItem.desc || (dynamicItem as any).description || defaultProgram.overviewText),
    videoThumbnail: defaultProgram.videoThumbnail,
    initiatives: (dynamicItem as any).keyPrograms && (dynamicItem as any).keyPrograms.length > 0
      ? (dynamicItem as any).keyPrograms.map((kp: string) => ({
          title: kp.split('—')[0] || kp,
          desc: kp.split('—')[1] || 'Dedicated initiative advancing climate resilience and youth empowerment.',
          icon: Sprout
        }))
      : defaultProgram.initiatives,
    impactStats: defaultProgram.impactStats
  } : defaultProgram;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      <SEO
        title={`${program.title} | Youth Climate Network`}
        description={program.overviewText}
      />

      {/* Hero Section matching Image 1 Right */}
      <section className="relative min-h-[420px] flex items-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={program.heroImage}
            alt={program.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062416]/95 via-[#0A3320]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-emerald-200/80 mb-6">
            <Link to="/" className="hover:underline text-white">Home</Link>
            <ChevronRight size={12} />
            <Link to="/our-work" className="hover:underline text-white">Programs</Link>
            <ChevronRight size={12} />
            <span className="text-emerald-300 font-semibold">{program.title}</span>
          </nav>

          <div className="max-w-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2">
              <Sprout size={24} />
            </div>

            <h1
              className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {program.title}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl">
              {program.tagline}
            </p>

            <div className="pt-2">
              <Link
                to="/get-involved"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: '#E8521A' }}
              >
                {t('Get Involved', 'যুক্ত হোন')} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Split Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <span
              className="text-xs font-bold tracking-widest uppercase block"
              style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}
            >
              {t('OVERVIEW', 'সংক্ষিপ্ত বিবরণ')}
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {program.overviewHeading}
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {program.overviewText}
            </p>
          </div>

          {/* Right Video / Image */}
          <div className="lg:col-span-5">
            <div
              onClick={() => setVideoOpen(true)}
              className="group relative rounded-3xl overflow-hidden aspect-[16/10] shadow-md cursor-pointer border border-gray-100"
            >
              <img
                src={program.videoThumbnail}
                alt="Program Overview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md text-gray-900 shadow-xl group-hover:scale-110 transition-transform">
                  <div className="w-7 h-7 rounded-full bg-[#E8521A] flex items-center justify-center text-white">
                    <Play size={13} fill="white" className="ml-0.5" />
                  </div>
                  <span className="text-xs font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Watch Our Work
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Initiatives Section (4 Cards) */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <span
              className="text-xs font-bold tracking-widest uppercase block mb-1"
              style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}
            >
              {t('KEY INITIATIVES', 'মূল উদ্যোগসমূহ')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {program.initiatives.map((item: any, idx: number) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center">
                  <item.icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact So Far Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <span
            className="text-xs font-bold tracking-widest uppercase block mb-1"
            style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}
          >
            {t('IMPACT SO FAR', 'এখন পর্যন্ত প্রভাব')}
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('Creating Change on the Ground', 'মাঠপর্যায়ে দৃশ্যমান পরিবর্তন সৃষ্টি')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          {/* Photo */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
              alt="Youth researchers"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 4 Stats Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {program.impactStats.map((stat: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1A6B3C] flex items-center justify-center">
                  <stat.icon size={16} />
                </div>
                <p
                  className="text-2xl font-black text-gray-900 tracking-tight"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner (Image 1 Right Bottom) */}
      <section className="bg-[#0A3320] py-14 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase">
              {t('BE PART OF THE SOLUTION', 'সমাধানের অংশ হোন')}
            </span>
            <h3
              className="text-2xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('Take Action for Our Climate', 'আমাদের জলবায়ুর জন্য কার্যকর পদক্ষেপ নিন')}
            </h3>
            <p className="text-xs text-emerald-200/80 max-w-xl">
              {t(
                'Join our youth-led initiatives and help build a greener, more resilient Bangladesh.',
                'আমাদের যুব-নেতৃত্বাধীন উদ্যোগে যোগ দিন এবং একটি পরিচ্ছন্ন ও সবুজ বাংলাদেশ গড়তে সহায়তা করুন।'
              )}
            </p>
          </div>

          <Link
            to="/get-involved"
            className="px-6 py-3 rounded-full text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 flex-shrink-0"
            style={{ backgroundColor: '#E8521A' }}
          >
            {t('Get Involved', 'যুক্ত হোন')} &rarr;
          </Link>
        </div>
      </section>

      {/* Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-black"
            >
              <X size={18} />
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Program Overview Video"
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
