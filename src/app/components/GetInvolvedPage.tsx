import { useState } from 'react';
import { SEO } from './ui/SEO';

import {
  HandCoins, Users, Briefcase, Handshake, CheckCircle, ArrowRight,
  Loader2, AlertCircle, Eye, X, Clock, MapPin, Sparkles
} from 'lucide-react';
import { apiVolunteerApps, apiPartnershipInquiries, apiInternshipApps, useInternshipPosts, useVolunteerTracks } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';

type Tab = 'volunteer' | 'internship' | 'partner';

interface VolunteerTrack {
  id: string;
  title: string;
  title_bn: string;
  badge: string;
  commitment: string;
  location: string;
  description: string;
  description_bn: string;
  responsibilities: string[];
  responsibilities_bn: string[];
  skills: string[];
  benefits: string[];
}

const VOLUNTEER_TRACKS: VolunteerTrack[] = [
  {
    id: 'grassroots-mobilizer',
    title: 'Grassroots Climate Mobilizer',
    title_bn: 'তৃণমূল জলবায়ু সমন্বয়কারী',
    badge: 'Field & Community',
    commitment: '4–6 hrs / week',
    location: 'Coastal & Delta Districts / Local Chapters',
    description: 'Engage frontline youth, organize community dialogues, and lead environmental awareness workshops in vulnerable regions.',
    description_bn: 'উপকূলীয় ও দুর্যোগপ্রবণ এলাকায় তরুণদের উদ্বুদ্ধকরণ, সচেতনতামূলক কর্মশালা এবং স্থানীয় জলবায়ু কর্মসূচি পরিচালনা।',
    responsibilities: [
      'Organize localized climate awareness sessions in schools & communities',
      'Coordinate tree plantation drives and community clean-up campaigns',
      'Liaise with local youth groups and community elders',
      'Document local climate vulnerability case studies'
    ],
    responsibilities_bn: [
      'স্কুল ও সমাজে স্থানীয় জলবায়ু সচেতনতা সেশন আয়োজন',
      'বৃক্ষরোপণ কর্মসূচি এবং পরিচ্ছন্নতা অভিযান সমন্বয়',
      'স্থানীয় যুবসমাজ ও গণ্যমান্য ব্যক্তিদের সাথে যোগাযোগ রক্ষা',
      'স্থানীয় জলবায়ু ঝুঁকিপূর্ণ ঘটনা ও কেস স্টাডি নথিভুক্তকরণ'
    ],
    skills: ['Communication', 'Community Engagement', 'Leadership', 'Empathy'],
    benefits: ['Official Volunteer Certificate', 'Leadership Training Workshops', 'YCN National Alumni Network']
  },
  {
    id: 'wash-advocate',
    title: 'WASH & Clean Water Campaigner',
    title_bn: 'পানি ও স্বাস্থ্যবিধি (WASH) প্রচারক',
    badge: 'Public Health',
    commitment: '3–5 hrs / week',
    location: 'Saline-Prone Coastal Belts & Remote Areas',
    description: 'Promote safe drinking water access, menstrual hygiene equity, and water testing drives across saline-affected communities.',
    description_bn: 'লবণাক্ততা কবলিত এলাকায় নিরাপদ খাবার পানি, হাইজিন সচেতনতা এবং পানি বিশুদ্ধকরণ কর্মসূচি প্রচার।',
    responsibilities: [
      'Assist in household salinity testing and rainwater harvesting awareness',
      'Distribute hygiene kits and facilitate school WASH sessions',
      'Advocate for equitable clean water infrastructure in rural areas'
    ],
    responsibilities_bn: [
      'লবণাক্ততা পরীক্ষা এবং বৃষ্টির পানি সংরক্ষণ সচেতনতায় সহায়তা',
      'হাইজিন কিট বিতরণ এবং বিদ্যালয়ে WASH সেশন পরিচালনা',
      'গ্রামীণ এলাকায় নিরাপদ পানির অবকাঠামোর জন্য প্রচারণা'
    ],
    skills: ['Public Health Interest', 'Organizing', 'Field Mobilization'],
    benefits: ['Water Security Specialization Certificate', 'Community Health Experience']
  },
  {
    id: 'drr-responder',
    title: 'Disaster Risk & Emergency First Responder',
    title_bn: 'দুর্যোগ ঝুঁকি ও জরুরি সাড়াদানকারী',
    badge: 'Disaster Response',
    commitment: 'Flexible / On-call during cyclone seasons',
    location: 'Coastal High-Risk Zones',
    description: 'Serve as youth first responders trained in cyclone early warnings, shelter management, and emergency flood relief.',
    description_bn: 'ঘূর্ণিঝড় ও বন্যায় দ্রুত সাড়াদান, জরুরি সতর্কতা প্রচার এবং আশ্রয়কেন্দ্র ব্যবস্থাপনায় নিয়োজিত যুব স্বেচ্ছাসেবী দল।',
    responsibilities: [
      'Disseminate early warning signals in vulnerable villages',
      'Assist vulnerable families with safe evacuation to cyclone shelters',
      'Coordinate emergency relief distribution and post-storm damage surveys'
    ],
    responsibilities_bn: [
      'ঝুঁকিপূর্ণ গ্রামে আগাম সতর্কবার্তা প্রচার',
      'ঘূর্ণিঝড় আশ্রয়কেন্দ্রে নিরাপদ স্থানান্তর সহায়তা',
      'জরুরি ত্রাণ সামগ্রী বিতরণ ও ক্ষয়ক্ষতি জরিপ সমন্বয়'
    ],
    skills: ['Physical Stamina', 'Emergency Preparedness', 'Teamwork'],
    benefits: ['Disaster Management Training Certificate', 'First-Aid Certification Eligibility']
  },
  {
    id: 'media-storyteller',
    title: 'Digital Media & Climate Storyteller',
    title_bn: 'ডিজিটাল মিডিয়া ও জলবায়ু গল্পকার',
    badge: 'Remote & Creative',
    commitment: '3–5 hrs / week',
    location: 'Remote / Anywhere',
    description: 'Amplify frontline voices through photo essays, short-form reels, graphics, and compelling articles that bridge local realities with global audiences.',
    description_bn: 'ছবি, ভিডিও, তথ্যচিত্র ও লেখার মাধ্যমে ফ্রন্টলাইনের জলবায়ু বাস্তবতা বৈশ্বিক দরবারে তুলে ধরা।',
    responsibilities: [
      'Create social media reels and graphics highlighting climate issues',
      'Interview youth activists and frontline climate survivors',
      'Draft case stories for YCN blog and international newsletter'
    ],
    responsibilities_bn: [
      'জলবায়ু সংকট নিয়ে সোশ্যাল মিডিয়া রিল ও গ্রাফিক্স তৈরি',
      'স্থানীয় তরুণ কর্মী এবং ক্ষতিগ্রস্ত মানুষের সাক্ষাৎকার গ্রহণ',
      'ওয়াইসিএন ব্লগ ও নিউজের জন্য স্টোরি ড্রাফট করা'
    ],
    skills: ['Photography/Videography', 'Social Media', 'Content Writing', 'Canva/Design'],
    benefits: ['Byline on YCN Publication', 'Media Portfolio Building', 'Global Network Exposure']
  }
];

export function GetInvolvedPage() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('volunteer');
  const [volSuccess, setVolSuccess] = useState(false);
  const [partSuccess, setPartSuccess] = useState(false);
  const [internSuccess, setInternSuccess] = useState(false);

  const [selectedVolunteerRole, setSelectedVolunteerRole] = useState<VolunteerTrack | null>(null);
  const [submittedVolunteerData, setSubmittedVolunteerData] = useState<any>(null);
  const [showSubmittedDetailsModal, setShowSubmittedDetailsModal] = useState(false);

  const [volLoading, setVolLoading] = useState(false);
  const [partLoading, setPartLoading] = useState(false);
  const [internLoading, setInternLoading] = useState(false);

  const [volError, setVolError] = useState('');
  const [partError, setPartError] = useState('');
  const [internError, setInternError] = useState('');

  const { data: internshipPosts = [] } = useInternshipPosts();
  const { data: apiTracks = [] } = useVolunteerTracks();
  const volunteerTracks = apiTracks.length > 0 ? (apiTracks as any[]) : VOLUNTEER_TRACKS;

  const [volForm, setVolForm] = useState({ name: '', email: '', phone: '', interest: '', skills: '', message: '' });
  const [partForm, setPartForm] = useState({ name: '', org: '', email: '', phone: '', type: '', message: '' });
  const [internForm, setInternForm] = useState({ name: '', email: '', phone: '', program: '', university: '', skills: '', message: '' });

  const tabs: { key: Tab; label: string; icon: React.FC<{ size?: number; style?: React.CSSProperties }> }[] = [
    { key: 'volunteer', label: t('Volunteer', 'স্বেচ্ছাসেবক'), icon: Users },
    { key: 'internship', label: t('Internship / Academy', 'ইন্টার্নশিপ / একাডেমি'), icon: Briefcase },
    { key: 'partner', label: t('Partner With Us', 'অংশীদারিত্ব'), icon: Handshake },
  ];

  const volunteerAreas = [
    t('Climate Justice & Advocacy', 'জলবায়ু ন্যায়বিচার ও অ্যাডভোকেসি'),
    t('Education & Research', 'শিক্ষা ও গবেষণা'),
    t('WASH Program', 'পানি, স্যানিটেশন ও স্বাস্থ্যবিধি (WASH)'),
    t('Disaster Response', 'দুর্যোগ প্রস্তুতি ও প্রতিক্রিয়া'),
    t('Renewable Energy', 'নবায়নযোগ্য শক্তি'),
    t('Youth Leadership', 'যুব নেতৃত্ব ও উন্নয়ন'),
    t('Women Empowerment', 'নারী ক্ষমতায়ন ও অধিকার'),
    t('Communications & Media', 'যোগাযোগ ও গণমাধ্যম'),
    t('Finance & Admin', 'অর্থ ও প্রশাসন'),
    t('Field Coordination', 'মাঠপর্যায়ের সমন্বয়'),
  ];

  const handleVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setVolLoading(true);
      setVolError('');
      const payload = {
        ...volForm,
        date: new Date().toISOString(),
        status: 'pending' as const
      };
      await apiVolunteerApps.create(payload);
      setSubmittedVolunteerData(payload);
      setVolSuccess(true);
      setVolForm({ name: '', email: '', phone: '', interest: '', skills: '', message: '' });
    } catch (err: any) {
      setVolError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setVolLoading(false);
    }
  };

  const handlePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPartLoading(true);
      setPartError('');
      await apiPartnershipInquiries.create({
        ...partForm,
        date: new Date().toISOString(),
        status: 'pending'
      });
      setPartSuccess(true);
      setPartForm({ name: '', org: '', email: '', phone: '', type: '', message: '' });
      setTimeout(() => setPartSuccess(false), 8000);
    } catch (err: any) {
      setPartError(err.message || 'Failed to submit partner inquiry. Please try again.');
    } finally {
      setPartLoading(false);
    }
  };

  const handleInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setInternLoading(true);
      setInternError('');
      await apiInternshipApps.create({
        ...internForm,
        date: new Date().toISOString(),
        status: 'pending'
      });
      setInternSuccess(true);
      setInternForm({ name: '', email: '', phone: '', program: '', university: '', skills: '', message: '' });
      setTimeout(() => setInternSuccess(false), 8000);
    } catch (err: any) {
      setInternError(err.message || 'Failed to submit intern application. Please try again.');
    } finally {
      setInternLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";
  const inputStyle = {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    color: '#1F2937',
    fontFamily: 'Inter, sans-serif',
  };
  const inputFocusStyle = { border: '1px solid #1A6B3C' };

  return (
    <div>
      <SEO 
        title="Get Involved" 
        description="Join the Youth Climate Network as a volunteer, partner, or advocate. Take real action towards climate solutions and become an environmental leader."
        keywords="volunteer youth climate network, climate action volunteer, environmental partnership, join climate ngo, become climate advocate"
      />
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 70% 50%, #E8521A 0%, transparent 45%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Take Action', 'পদক্ষেপ নিন')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Get Involved', 'আমাদের সাথে যুক্ত হোন')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.05rem' }}>
            {t(
              'Whether you volunteer your time, contribute financially, join our Youth Leadership Academy, or partner with us — every action drives climate justice forward.',
              'আপনি স্বেচ্ছাসেবী হিসেবে সময় দিন, আর্থিক অবদান রাখুন, যুব নেতৃত্ব একাডেমিতে যোগ দিন, কিংবা আমাদের অংশীদার হোন — আপনার প্রতিটি কাজ জলবায়ু ন্যায়বিচারকে ত্বরান্বিত করবে।'
            )}
          </p>
        </div>
      </section>

      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,20 C360,60 1080,0 1440,40 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      {/* Why get involved */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: t('Join the Network', 'নেটওয়ার্কে যোগ দিন'), desc: t('Connect with 850+ youth climate advocates across Bangladesh and South Asia.', 'বাংলাদেশ ও দক্ষিণ এশিয়ার ৮৫০ জনেরও বেশি জলবায়ু যুব কর্মীদের সাথে সংযুক্ত হোন।'), color: '#1A6B3C', bg: '#E8F5EE' },
              { icon: HandCoins, title: t('Make Real Impact', 'প্রকৃত প্রভাব ফেলুন'), desc: t('Your support directly reaches frontline communities facing climate devastation.', 'আপনার অবদান সরাসরি জলবায়ু ধ্বংসের মুখোমুখি উপকূলীয় এবং প্রান্তিক মানুষের কাছে পৌঁছায়।'), color: '#E8521A', bg: '#FFF3EE' },
              { icon: Briefcase, title: t('Build Your Skills', 'দক্ষতা তৈরি করুন'), desc: t('Gain hands-on experience in climate advocacy, community development, and leadership.', 'জলবায়ু অ্যাডভোকেসি, সামাজিক উন্নয়ন এবং নেতৃত্বে বাস্তব অভিজ্ঞতা অর্জন করুন।'), color: '#0E7490', bg: '#E0F7FA' },
              { icon: Handshake, title: t('Collaborate Globally', 'বৈশ্বিকভাবে কাজ করুন'), desc: t('Work alongside UN agencies, INGOs, and youth networks across Asia Pacific.', 'জাতিসংঘের বিভিন্ন সংস্থা, আইএনজিও এবং এশিয়া প্যাসিফিক অঞ্চলের যুব নেটওয়ার্কের সাথে একসাথে কাজ করুন।'), color: '#7B1FA2', bg: '#F3E5F5' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl text-center" style={{ backgroundColor: bg }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: color }}>
                  <Icon size={22} color="#fff" />
                </div>
                <h4 className="font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Tab nav */}
          <div
            className="flex rounded-2xl p-1.5 mb-10 overflow-x-auto"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center whitespace-nowrap"
                style={{
                  backgroundColor: activeTab === key ? '#0A3320' : 'transparent',
                  color: activeTab === key ? '#F0ECD8' : '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* VOLUNTEER TAB */}
          {activeTab === 'volunteer' && (
            <div className="space-y-12">
              <div>
                <h2 className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' }}>
                  {t('Volunteer With YCN', 'স্বেচ্ছাসেবক হিসেবে যোগ দিন')}
                </h2>
                <p className="mb-8 text-sm max-w-3xl" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  {t(
                    'Join our grassroots volunteer network and contribute your skills to climate justice and community resilience across Bangladesh. Explore open volunteer roles below, view their details, or send your volunteer request directly.',
                    'আমাদের তৃণমূলের স্বেচ্ছাসেবী নেটওয়ার্কে যোগ দিন এবং বাংলাদেশ জুড়ে জলবায়ু ন্যায়বিচার ও স্থিতিস্থাপকতার কাজে আপনার দক্ষতা অবদান রাখুন। উন্মুক্ত সুযোগগুলো দেখুন, বিস্তারিত জানুন অথবা সরাসরি আপনার আবেদন পাঠান।'
                  )}
                </p>

                {/* ── 1. OPEN VOLUNTEER OPPORTUNITIES ── */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 font-poppins flex items-center gap-2">
                        <Sparkles size={16} className="text-[#E8521A]" />
                        {t('Featured Volunteer Tracks', 'বিশেষ স্বেচ্ছাসেবী ক্ষেত্রসমূহ')}
                      </h3>
                      <p className="text-xs text-gray-500 font-inter">
                        {t('Click "View Details" to see specific responsibilities and volunteer benefits.', 'নির্দিষ্ট দায়িত্ব ও সুবিধা দেখতে "View Details" এ ক্লিক করুন।')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {volunteerTracks.map((track: any) => {
                      const title = lang === 'bn' ? track.title_bn : track.title;
                      const desc = lang === 'bn' ? track.description_bn : track.description;
                      return (
                        <div
                          key={track.id}
                          className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#1A6B3C] border border-emerald-200">
                                {track.badge}
                              </span>
                              <span className="text-[11px] text-gray-400 font-inter flex items-center gap-1">
                                <Clock size={11} /> {track.commitment}
                              </span>
                            </div>

                            <h4 className="font-bold text-base text-gray-900 mb-2 group-hover:text-[#1A6B3C] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {title}
                            </h4>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 font-inter">
                              <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                              <span className="truncate">{track.location}</span>
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4 font-inter">
                              {desc}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-2">
                            {/* VIEW DETAILS BUTTON */}
                            <button
                              type="button"
                              onClick={() => setSelectedVolunteerRole(track)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-[#1A6B3C] hover:border-emerald-200 border border-transparent transition-all cursor-pointer"
                            >
                              <Eye size={13} />
                              <span>{t('View Details', 'বিস্তারিত দেখুন')}</span>
                            </button>

                            {/* APPLY NOW BUTTON */}
                            <button
                              type="button"
                              onClick={() => {
                                setVolForm(f => ({ ...f, interest: title }));
                                const el = document.getElementById('volunteer-request-form');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-[#0A3320] text-white hover:bg-[#13532e] transition-all shadow-sm cursor-pointer"
                            >
                              <span>{t('Apply', 'আবেদন')}</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── 2. SEND VOLUNTEER REQUEST FORM ── */}
              <div id="volunteer-request-form" className="bg-[#F9FAFB] rounded-3xl p-6 sm:p-8 border border-gray-200">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#E8521A]" />
                    <span className="text-xs font-bold tracking-widest text-[#E8521A] uppercase font-inter">
                      {t('VOLUNTEER APPLICATION', 'স্বেচ্ছাসেবক আবেদনপত্র')}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 font-poppins">
                    {t('Send Volunteer Request', 'স্বেচ্ছাসেবক আবেদন জমা দিন')}
                  </h3>
                  <p className="text-xs text-gray-500 font-inter mt-1">
                    {t('Fill in your background and motivations. Our recruitment team reviews submissions weekly.', 'আপনার তথ্য ও আগ্রহের বিবরণ লিখুন। আমাদের টিম প্রতি সপ্তাহে আবেদন পর্যালোচনা করে।')}
                  </p>
                </div>

                {volSuccess ? (
                  <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <CheckCircle size={44} className="mx-auto mb-3 text-[#1A6B3C]" />
                    <h3 className="font-bold text-lg mb-2 text-gray-900 font-poppins">
                      {t('Volunteer Request Submitted!', 'স্বেচ্ছাসেবক আবেদন সফলভাবে জমা হয়েছে!')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6 font-inter leading-relaxed">
                      {t(
                        'Thank you for stepping up for climate action. Your application is saved under review. You can review your sent request details below.',
                        'জলবায়ু ন্যায়বিচারের জন্য এগিয়ে আসার জন্য ধন্যবাদ। আপনার আবেদন পর্যালোচনার জন্য সংরক্ষিত হয়েছে। আপনি নিচে আপনার প্রেরিত আবেদনের বিবরণ দেখতে পারেন।'
                      )}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {/* VIEW SUBMITTED DETAILS BUTTON */}
                      <button
                        type="button"
                        onClick={() => setShowSubmittedDetailsModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-[#1A6B3C] border border-emerald-200 hover:bg-emerald-100 transition-all shadow-sm"
                      >
                        <Eye size={14} />
                        <span>{t('View Request Details', 'আবেদনের বিবরণ দেখুন')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVolSuccess(false);
                          setSubmittedVolunteerData(null);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0A3320] text-white hover:bg-[#13532e] transition-all shadow-sm"
                      >
                        {t('Send Another Request', 'আরেকটি আবেদন পাঠান')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleVolunteer} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-gray-700 font-inter">
                          {t('Full Name *', 'পূর্ণ নাম *')}
                        </label>
                        <input
                          className={inputCls}
                          style={inputStyle}
                          value={volForm.name}
                          onChange={e => setVolForm(f => ({ ...f, name: e.target.value }))}
                          onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={e => Object.assign(e.target.style, { border: '1px solid #E5E7EB' })}
                          placeholder={t("Your full name", "আপনার পূর্ণ নাম লিখুন")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-gray-700 font-inter">
                          {t('Email Address *', 'ইমেইল ঠিকানা *')}
                        </label>
                        <input
                          type="email"
                          className={inputCls}
                          style={inputStyle}
                          value={volForm.email}
                          onChange={e => setVolForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-gray-700 font-inter">
                          {t('Phone Number', 'ফোন নম্বর')}
                        </label>
                        <input
                          className={inputCls}
                          style={inputStyle}
                          value={volForm.phone}
                          onChange={e => setVolForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="+880 XXX XXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-gray-700 font-inter">
                          {t('Area of Interest / Volunteer Role *', 'আগ্রহের ক্ষেত্র বা পদবী *')}
                        </label>
                        <select
                          className={inputCls}
                          style={{ ...inputStyle, cursor: 'pointer' }}
                          value={volForm.interest}
                          onChange={e => setVolForm(f => ({ ...f, interest: e.target.value }))}
                          required
                        >
                          <option value="">{t('Select a program area or role', 'একটি ক্ষেত্র বা পদবী নির্বাচন করুন')}</option>
                          {volunteerTracks.map((vt: any) => (
                            <option key={vt.id || vt.slug} value={lang === 'bn' ? vt.title_bn : vt.title}>
                              ★ {lang === 'bn' ? vt.title_bn : vt.title} ({vt.badge})
                            </option>
                          ))}
                          {volunteerAreas.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-gray-700 font-inter">
                        {t('Your Skills & Background', 'আপনার দক্ষতা ও ব্যাকগ্রাউন্ড')}
                      </label>
                      <input
                        className={inputCls}
                        style={inputStyle}
                        value={volForm.skills}
                        onChange={e => setVolForm(f => ({ ...f, skills: e.target.value }))}
                        placeholder={t("E.g. research, community mobilization, social media, photography, translation...", "যেমন: গবেষণা, সামাজিক কাজ, মিডিয়া, ডিজাইন ইত্যাদি")}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-gray-700 font-inter">
                        {t('Why do you want to volunteer with YCN?', 'আপনি কেন ওয়াইসিএন-এর সাথে যুক্ত হতে চান?')}
                      </label>
                      <textarea
                        className={inputCls}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        rows={4}
                        value={volForm.message}
                        onChange={e => setVolForm(f => ({ ...f, message: e.target.value }))}
                        placeholder={t("Tell us about your motivation...", "আপনার প্রেরণা এবং আপনি কীভাবে ভূমিকা রাখতে পারেন তা জানান...")}
                      />
                    </div>

                    {volError && (
                      <div className="p-3.5 rounded-xl text-xs flex items-center gap-2 bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span>{volError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={volLoading}
                      className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-md"
                      style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                    >
                      {volLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>{t('Sending Request...', 'অনুরোধ পাঠানো হচ্ছে...')}</span>
                        </>
                      ) : (
                        t('Send Volunteer Request', 'স্বেচ্ছাসেবক আবেদন জমা দিন')
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* ── MODAL 1: VOLUNTEER ROLE DETAILS MODAL ── */}
              {selectedVolunteerRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                    <button
                      onClick={() => setSelectedVolunteerRole(null)}
                      className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                    >
                      <X size={16} />
                    </button>

                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#1A6B3C] border border-emerald-200">
                          {selectedVolunteerRole.badge}
                        </span>
                        <span className="text-xs text-gray-400 font-inter flex items-center gap-1">
                          <Clock size={12} /> {selectedVolunteerRole.commitment}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 font-poppins">
                        {lang === 'bn' ? selectedVolunteerRole.title_bn : selectedVolunteerRole.title}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 font-inter">
                        <MapPin size={12} className="text-gray-400" />
                        <span>{selectedVolunteerRole.location}</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs font-inter text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{t('Role Overview', 'কাজের বিবরণ')}</h4>
                        <p>{lang === 'bn' ? selectedVolunteerRole.description_bn : selectedVolunteerRole.description}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">{t('Key Responsibilities', 'মূল দায়িত্বসমূহ')}</h4>
                        <ul className="space-y-1.5">
                          {(lang === 'bn' ? selectedVolunteerRole.responsibilities_bn : selectedVolunteerRole.responsibilities).map((resp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle size={14} className="text-[#1A6B3C] flex-shrink-0 mt-0.5" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">{t('Key Skills & Profile', 'প্রয়োজনীয় দক্ষতা')}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedVolunteerRole.skills.map((sk, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">{t('Volunteer Benefits', 'স্বেচ্ছাসেবক সুবিধাসমূহ')}</h4>
                        <ul className="space-y-1.5">
                          {selectedVolunteerRole.benefits.map((ben, i) => (
                            <li key={i} className="flex items-center gap-2 text-emerald-800 font-medium">
                              <Sparkles size={13} className="text-[#E8521A] flex-shrink-0" />
                              <span>{ben}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100 mt-6">
                      <button
                        type="button"
                        onClick={() => setSelectedVolunteerRole(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        {t('Close', 'বন্ধ করুন')}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const chosenTitle = lang === 'bn' ? selectedVolunteerRole.title_bn : selectedVolunteerRole.title;
                          setVolForm(f => ({ ...f, interest: chosenTitle }));
                          setSelectedVolunteerRole(null);
                          const el = document.getElementById('volunteer-request-form');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#0A3320] text-white text-xs font-semibold hover:bg-[#13532e] inline-flex items-center gap-1.5 shadow-md"
                      >
                        <span>{t('Apply for this Role', 'এই পদের জন্য আবেদন করুন')}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MODAL 2: SUBMITTED VOLUNTEER REQUEST DETAILS MODAL ── */}
              {showSubmittedDetailsModal && submittedVolunteerData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
                    <button
                      onClick={() => setShowSubmittedDetailsModal(false)}
                      className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                    >
                      <X size={16} />
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center">
                        <CheckCircle size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 font-poppins">{t('Your Submitted Request Details', 'আপনার জমা দেওয়া আবেদনের বিবরণ')}</h3>
                        <p className="text-[11px] text-gray-400 font-inter">Status: Pending Review</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 text-xs font-inter border-y border-gray-100 py-4 my-4">
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-400 font-semibold">{t('Full Name:', 'পূর্ণ নাম:')}</span>
                        <span className="font-bold text-gray-900">{submittedVolunteerData.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-400 font-semibold">{t('Email:', 'ইমেইল:')}</span>
                        <span className="font-medium text-gray-800">{submittedVolunteerData.email}</span>
                      </div>
                      {submittedVolunteerData.phone && (
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-400 font-semibold">{t('Phone:', 'ফোন:')}</span>
                          <span className="font-medium text-gray-800">{submittedVolunteerData.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-400 font-semibold">{t('Area of Interest:', 'আগ্রহের ক্ষেত্র:')}</span>
                        <span className="font-bold text-[#E8521A]">{submittedVolunteerData.interest}</span>
                      </div>
                      {submittedVolunteerData.skills && (
                        <div className="py-1 border-b border-gray-50">
                          <span className="text-gray-400 font-semibold block mb-1">{t('Skills & Background:', 'দক্ষতা ও ব্যাকগ্রাউন্ড:')}</span>
                          <span className="text-gray-700 bg-gray-50 p-2 rounded-lg block">{submittedVolunteerData.skills}</span>
                        </div>
                      )}
                      {submittedVolunteerData.message && (
                        <div className="py-1">
                          <span className="text-gray-400 font-semibold block mb-1">{t('Motivation Statement:', 'প্রেরণার বিবরণ:')}</span>
                          <span className="text-gray-700 bg-gray-50 p-2.5 rounded-lg block italic">"{submittedVolunteerData.message}"</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSubmittedDetailsModal(false)}
                        className="px-5 py-2 rounded-xl bg-[#0A3320] text-white text-xs font-semibold hover:bg-[#13532e]"
                      >
                        {t('Close', 'বন্ধ করুন')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INTERNSHIP TAB */}
          {activeTab === 'internship' && (
            <div>
              <h2 className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' }}>
                {t('Internship & Youth Academy', 'ইন্টার্নশিপ ও যুব একাডেমি')}
              </h2>
              <p className="mb-8 text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'YCN offers structured internships across all program areas and our flagship Youth Leadership Academy for aspiring climate leaders aged 18–30.',
                  'ওয়াইসিএন ১৮-৩০ বছর বয়সী ভবিষ্যৎ জলবায়ু নেতাদের জন্য সকল প্রোগ্রাম ক্ষেত্রে ইন্টার্নশিপ এবং আমাদের ফ্ল্যাগশিপ যুব নেতৃত্ব একাডেমি অফার করে।'
                )}
              </p>
              {internSuccess ? (
                <div className="text-center py-16">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#1A6B3C' }} />
                  <h3 className="font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                    {t('Application Received!', 'আবেদন প্রাপ্ত হয়েছে!')}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {t(
                      'Thank you for applying to the YCN Internship/Academy program. Our team will review your application and get back to you soon.',
                      'ওয়াইসিএন প্রোগ্রামে আবেদন করার জন্য ধন্যবাদ। আমাদের টিম আপনার আবেদন পর্যালোচনা করে শীঘ্রই যোগাযোগ করবে।'
                    )}
                  </p>
                  <button onClick={() => setInternSuccess(false)} className="mt-6 px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>
                    {t('Apply for Another Program', 'অন্য প্রোগ্রামে আবেদন করুন')}
                  </button>
                </div>
              ) : internForm.program ? (
                <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{t('Application Form', 'আবেদন ফর্ম')}</h3>
                      <p className="text-sm" style={{ color: '#E8521A', fontWeight: 600 }}>{internForm.program}</p>
                    </div>
                    <button onClick={() => setInternForm(f => ({...f, program: ''}))} className="text-sm font-semibold hover:underline" style={{ color: '#6B7280' }}>
                      {t('Cancel', 'বাতিল করুন')}
                    </button>
                  </div>
                  <form onSubmit={handleInternship} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Full Name *', 'পূর্ণ নাম *')}</label>
                        <input className={inputCls} style={inputStyle} value={internForm.name} onChange={e => setInternForm(f => ({ ...f, name: e.target.value }))} placeholder={t("Your full name", "আপনার পূর্ণ নাম")} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Email Address *', 'ইমেইল ঠিকানা *')}</label>
                        <input type="email" className={inputCls} style={inputStyle} value={internForm.email} onChange={e => setInternForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Phone Number', 'ফোন নম্বর')}</label>
                        <input className={inputCls} style={inputStyle} value={internForm.phone} onChange={e => setInternForm(f => ({ ...f, phone: e.target.value }))} placeholder="+880 XXX XXXXXXX" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('University / Institution *', 'বিশ্ববিদ্যালয় / শিক্ষাপ্রতিষ্ঠান *')}</label>
                        <input className={inputCls} style={inputStyle} value={internForm.university} onChange={e => setInternForm(f => ({ ...f, university: e.target.value }))} placeholder={t("Where do you study?", "কোথায় পড়াশোনা করছেন?")} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Relevant Skills & Background', 'প্রাসঙ্গিক দক্ষতা ও ব্যাকগ্রাউন্ড')}</label>
                      <input className={inputCls} style={inputStyle} value={internForm.skills} onChange={e => setInternForm(f => ({ ...f, skills: e.target.value }))} placeholder={t("e.g. Research, Graphic Design", "উদাঃ গবেষণা, গ্রাফিক ডিজাইন")} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Why do you want to join? *', 'কেন যুক্ত হতে চান? *')}</label>
                      <textarea className={inputCls} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={internForm.message} onChange={e => setInternForm(f => ({ ...f, message: e.target.value }))} placeholder={t("Tell us about your motivation...", "আপনার আগ্রহের কথা আমাদের জানান...")} required />
                    </div>
                    {internError && (
                      <div className="p-3.5 rounded-xl text-xs flex items-center gap-2 bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span>{internError}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={internLoading}
                      className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                      style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                    >
                      {internLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>{t('Submitting...', 'জমা দেওয়া হচ্ছে...')}</span>
                        </>
                      ) : (
                        t('Submit Application', 'আবেদন জমা দিন')
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {internshipPosts.filter(p => p.active).map((program) => (
                      <div key={program.title} className="p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all flex flex-col h-full" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{lang === 'bn' && program.title_bn ? program.title_bn : program.title}</h3>
                            {program.badgeColor && <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: program.badgeColor }}>Open</span>}
                          </div>
                          <p className="text-xs font-medium mb-3" style={{ color: '#E8521A' }}>{lang === 'bn' && program.duration_bn ? program.duration_bn : program.duration}</p>
                          <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>{lang === 'bn' && program.desc_bn ? program.desc_bn : program.desc}</p>
                          <div className="mb-5">
                            <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>{t('Requirements:', 'যোগ্যতা/প্রয়োজনীয়তা:')}</p>
                            <ul className="space-y-1">
                              {(lang === 'bn' && program.requirements_bn && program.requirements_bn.length > 0 ? program.requirements_bn : program.requirements).map((r: string) => (
                                <li key={r} className="flex items-center gap-2 text-xs" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                  <CheckCircle size={11} style={{ color: '#1A6B3C' }} /> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <button
                          onClick={() => setInternForm(f => ({ ...f, program: program.title }))}
                          className="w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 mt-auto"
                          style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                        >
                          {t('Apply Now', 'আবেদন করুন')} <ArrowRight size={14} className="inline ml-1" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 rounded-xl" style={{ backgroundColor: '#E8F5EE', border: '1px solid #A8C4B020' }}>
                    <p className="text-sm font-medium mb-2" style={{ color: '#1A6B3C', fontFamily: 'Poppins, sans-serif' }}>
                      {t('Applications for Youth Leadership Academy 2025 are now open', 'যুব নেতৃত্ব একাডেমি ২০২৫-এর জন্য আবেদন প্রক্রিয়া চলমান')}
                    </p>
                    <p className="text-xs" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
                      {t(
                        'Deadline: 31 March 2025 · 60 places available · Cohort begins May 2025. Contact us at youthclimatenetworkbd@gmail.com with your CV and a 300-word motivation statement.',
                        'সময়সীমা: ৩১ মার্চ ২০২৫ · ৬০টি আসন উপলব্ধ · ব্যাচ শুরু মে ২০২৫। আপনার সিভি এবং ৩০০ শব্দের মোটিভেশন স্টেইটমেন্ট সহ youthclimatenetworkbd@gmail.com এ আমাদের সাথে যোগাযোগ করুন।'
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}


          {/* PARTNER TAB */}
          {activeTab === 'partner' && (
            <div>
              <h2 className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' }}>
                {t('Partner With YCN', 'আমাদের অংশীদার হোন')}
              </h2>
              <p className="mb-8 text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'We seek strategic partners — government agencies, NGOs, academic institutions, the private sector, and international organizations — who share our commitment to climate justice and youth empowerment.',
                  'আমরা কৌশলগত অংশীদার খুঁজছি — সরকারি সংস্থা, এনজিও, শিক্ষাপ্রতিষ্ঠান, বেসরকারি খাত এবং আন্তর্জাতিক সংস্থা — যারা জলবায়ু ন্যায়বিচার এবং যুব ক্ষমতায়নে প্রতিশ্রুতিবদ্ধ।'
                )}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  t('Government', 'সরকারি সংস্থা'),
                  t('NGO / INGO', 'এনজিও / আইএনজিও'),
                  t('Academic', 'শিক্ষাপ্রতিষ্ঠান'),
                  t('Private Sector', 'বেসরকারি খাত'),
                  t('UN / Multilateral', 'জাতিসংঘ / বহুপাক্ষিক সংস্থা'),
                  t('Media', 'গণমাধ্যম'),
                  t('Donor / Funder', 'দাতা সংস্থা'),
                  t('Youth Network', 'যুব নেটওয়ার্ক'),
                ].map(type => (
                  <div key={type} className="p-3 rounded-xl text-center text-xs font-medium" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C', fontFamily: 'Inter, sans-serif' }}>
                    {type}
                  </div>
                ))}
              </div>
              {partSuccess ? (
                <div className="text-center py-16">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#1A6B3C' }} />
                  <h3 className="font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                    {t('Partnership Inquiry Received!', 'অংশীদারিত্ব প্রস্তাব প্রাপ্ত হয়েছে!')}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {t(
                      'Thank you for your interest in partnering with YCN. Our partnerships team will reach out within 3–5 business days.',
                      'ওয়াইসিএন-এর সাথে অংশীদারিত্বে আগ্রহী হওয়ার জন্য ধন্যবাদ। আমাদের টিম আগামী ৩-৫ কার্যদিবসের মধ্যে আপনার সাথে যোগাযোগ করবে।'
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePartner} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Contact Name *', 'যোগাযোগকারীর নাম *')}
                      </label>
                      <input className={inputCls} style={inputStyle} value={partForm.name} onChange={e => setPartForm(f => ({ ...f, name: e.target.value }))} placeholder={t("Your full name", "আপনার পূর্ণ নাম")} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Organization Name *', 'সংস্থার নাম *')}
                      </label>
                      <input className={inputCls} style={inputStyle} value={partForm.org} onChange={e => setPartForm(f => ({ ...f, org: e.target.value }))} placeholder={t("Your organization", "আপনার সংস্থা")} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Email *', 'ইমেইল *')}
                      </label>
                      <input type="email" className={inputCls} style={inputStyle} value={partForm.email} onChange={e => setPartForm(f => ({ ...f, email: e.target.value }))} placeholder="contact@org.com" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Partnership Type *', 'অংশীদারিত্বের ধরণ *')}
                      </label>
                      <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }} value={partForm.type} onChange={e => setPartForm(f => ({ ...f, type: e.target.value }))} required>
                        <option value="">{t('Select type', 'ধরণ নির্বাচন করুন')}</option>
                        {[
                          { key: 'Government', label: t('Government', 'সরকারি সংস্থা') },
                          { key: 'NGO / INGO', label: t('NGO / INGO', 'এনজিও / আইএনজিও') },
                          { key: 'Academic', label: t('Academic', 'শিক্ষাপ্রতিষ্ঠান') },
                          { key: 'Private Sector', label: t('Private Sector', 'বেসরকারি খাত') },
                          { key: 'UN / Multilateral', label: t('UN / Multilateral', 'জাতিসংঘ / বহুপাক্ষিক সংস্থা') },
                          { key: 'Media', label: t('Media', 'গণমাধ্যম') },
                          { key: 'Donor / Funder', label: t('Donor / Funder', 'দাতা সংস্থা') },
                          { key: 'Youth Network', label: t('Youth Network', 'যুব নেটওয়ার্ক') },
                        ].map(op => <option key={op.key} value={op.key}>{op.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {t('Message / Partnership Proposal *', 'বার্তা / অংশীদারিত্বের প্রস্তাব *')}
                    </label>
                    <textarea
                      className={inputCls}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      rows={5}
                      value={partForm.message}
                      onChange={e => setPartForm(f => ({ ...f, message: e.target.value }))}
                      placeholder={t("Describe the type of partnership you're proposing...", "প্রস্তাবিত অংশীদারিত্বের ধরণ এবং কীভাবে তা আমাদের লক্ষ্যের সাথে মেলে তা আলোচনা করুন...")}
                      required
                    />
                  </div>
                  {partError && (
                    <div className="p-3.5 rounded-xl text-xs flex items-center gap-2 bg-red-50 text-red-700 border border-red-200">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{partError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={partLoading}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                  >
                    {partLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t('Submitting...', 'জমা দেওয়া হচ্ছে...')}</span>
                      </>
                    ) : (
                      t('Submit Partnership Inquiry', 'অংশীদারিত্ব প্রস্তাব জমা দিন')
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

