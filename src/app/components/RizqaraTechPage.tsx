import { SEO } from './ui/SEO';
import { ExternalLink, Mail, Code, ShieldCheck, Cpu, Zap, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function RizqaraTechPage() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Code,
      title: t('Full-Stack Web & App Development', 'ফুল-স্ট্যাক ওয়েব ও অ্যাপ ডেভেলপমেন্ট'),
      desc: t(
        'Building modern, accessible, and high-performance web applications tailored to amplify climate action and youth mobilization.',
        'জলবায়ু কার্যক্রম এবং যুব নেটওয়ার্ককে প্রসারিত করতে আধুনিক ও উচ্চ-ক্ষমতাসম্পন্ন ওয়েব অ্যাপ্লিকেশন তৈরি।'
      ),
      color: '#1A6B3C',
      bg: '#E8F5EE',
    },
    {
      icon: ShieldCheck,
      title: t('Security & Infrastructure', 'নিরাপত্তা ও পরিকাঠামো'),
      desc: t(
        'Ensuring enterprise-grade security, data privacy, and reliable cloud hosting for all Youth Climate Network platforms.',
        'ওয়াইসিএন-এর সকল ডিজিটাল প্ল্যাটফর্মের জন্য সর্বোচ্চ স্তরের সাইবার নিরাপত্তা এবং ডাটা সুরক্ষা নিশ্চিতকরণ।'
      ),
      color: '#0E7490',
      bg: '#E0F7FA',
    },
    {
      icon: Cpu,
      title: t('Digital Innovation & Automation', 'ডিজিটাল উদ্ভাবন ও অটোমেশন'),
      desc: t(
        'Leveraging cutting-edge tools and automated workflows to streamline operations, registrations, and communication.',
        'কার্যক্রম, নিবন্ধন এবং যোগাযোগকে সহজতর করতে আধুনিক ডিজিটাল টুলস ও স্বয়ংক্রিয় কাজের পদ্ধতি বাস্তবায়ন।'
      ),
      color: '#E8521A',
      bg: '#FFF3EE',
    },
    {
      icon: Zap,
      title: t('24/7 Technical Support & Maintenance', '২৪/৭ কারিগরি সহায়তা ও রক্ষণাবেক্ষণ'),
      desc: t(
        'Providing round-the-clock technical assistance, regular updates, and continuous platform optimization.',
        'সার্বক্ষণিক প্রযুক্তিগত সহায়তা, নিয়মিত আপডেট এবং নিরবচ্ছিন্ন ওয়েবসাইট রক্ষণাবেক্ষণ।'
      ),
      color: '#D97706',
      bg: '#FFF8E1',
    },
  ];

  return (
    <div>
      <SEO
        title="Youth Climate Network X Tech Partner Rizqara Tech"
        description="Official Technology & Innovation Partnership between Youth Climate Network and Rizqara Tech. Powering climate action with world-class digital solutions."
        keywords="youth climate network, rizqara tech, tech partner, digital innovation, web development bangladesh, climate tech"
      />

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="pt-32 pb-20 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        {/* Background glow & mesh */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(circle at 50% 30%, #E8521A 0%, rgba(26,107,60,0.4) 50%, transparent 80%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-8"
            style={{
              backgroundColor: 'rgba(232,82,26,0.15)',
              color: '#E8521A',
              border: '1px solid rgba(232,82,26,0.3)',
            }}
          >
            <Sparkles size={14} />
            {t('Official Technology & Innovation Partner', 'অফিশিয়াল টেকনোলজি ও ইনোভেশন পার্টনার')}
          </div>

          {/* Logos Collaboration Header */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10 flex-wrap">
            <div className="bg-[#0A3320] p-4 sm:p-5 rounded-2xl border border-white/20 shadow-xl transition-transform hover:scale-105">
              <img
                src="/ycnmain.png"
                alt="Youth Climate Network"
                className="h-14 sm:h-20 object-contain"
                onError={(e) => (e.currentTarget.src = '/YCN Main Logo .png')}
              />
            </div>

            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 text-white font-bold text-lg sm:text-xl border border-white/20">
              ✕
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl transition-transform hover:scale-105">
              <img
                src="/Rizqaratech.png"
                alt="Rizqara Tech"
                className="h-14 sm:h-20 object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1
            className="mb-6 font-bold leading-tight"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
              color: '#F0ECD8',
            }}
          >
            Youth Climate Network <span style={{ color: '#E8521A' }}>✕</span> Rizqara Tech
          </h1>

          <p
            className="max-w-3xl mx-auto leading-relaxed mb-10 text-base sm:text-xl"
            style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0' }}
          >
            {t(
              'Empowering youth-led climate resilience through state-of-the-art software engineering, secure infrastructure, and digital innovation.',
              'আধুনিক সফটওয়্যার ইঞ্জিনিয়ারিং, নিরাপদ ডিজিটাল পরিকাঠামো এবং প্রযুক্তির মাধ্যমে যুব-নেতৃত্বাধীন জলবায়ু আন্দোলনকে শক্তিশালীকরণ।'
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.rizqara.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                backgroundColor: '#E8521A',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Globe size={18} />
              {t('Visit Rizqara Tech Website', 'রিজকারা টেক ওয়েবসাইট ভিজিট করুন')}
              <ExternalLink size={14} />
            </a>

            <a
              href="mailto:rizqaratech@gmail.com"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#F0ECD8',
                borderColor: 'rgba(255,255,255,0.2)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Mail size={18} style={{ color: '#E8521A' }} />
              {t('Contact Rizqara Tech', 'যোগাযোগ করুন')}
            </a>
          </div>
        </div>
      </section>

      {/* Wave Separator */}
      <div style={{ lineHeight: 0, backgroundColor: '#F9FAFB' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          ABOUT THE PARTNERSHIP
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-lg border border-gray-100">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: '#E8F5EE' }}
              >
                <Code size={28} style={{ color: '#1A6B3C' }} />
              </div>
              <h2
                className="text-2xl sm:text-4xl font-bold mb-5"
                style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}
              >
                {t('Powering Climate Action With Technology', 'প্রযুক্তির ছোঁয়ায় জলবায়ু আন্দোলনকে ত্বরান্বিত করা')}
              </h2>
              <p
                className="text-gray-600 leading-relaxed text-base sm:text-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {t(
                  'At Youth Climate Network (YCN), we believe that fighting the climate crisis requires not only passionate grassroots leadership, but also cutting-edge digital infrastructure. Rizqara Tech stands as our official technology partner, managing and supporting all web development, platform security, and technical solutions for YCN.',
                  'ওয়াইসিএন-এ আমরা বিশ্বাস করি যে জলবায়ু সংকট মোকাবেলায় মাঠপর্যায়ের নেতৃত্বের পাশাপাশি সর্বাধুনিক ডিজিটাল পরিকাঠামো প্রয়োজন। রিজকারা টেক আমাদের অফিশিয়াল টেকনোলজি পার্টনার হিসেবে ওয়াইসিএন-এর সমস্ত ওয়েব ডেভেলপমেন্ট, সিকিউরিটি এবং কারিগরি সমাধান পরিচালনা করে।'
                )}
              </p>
            </div>

            {/* Supporting Box */}
            <div
              className="rounded-2xl p-6 sm:p-8 text-center mb-14"
              style={{
                background: 'linear-gradient(135deg, #0A3320 0%, #1A6B3C 100%)',
                color: '#F0ECD8',
              }}
            >
              <h3
                className="font-bold text-xl sm:text-2xl mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {t('We Are Supporting Youth Climate Network for All Tech Issues', 'আমরা ওয়াইসিএন-এর সমস্ত টেকনিক্যাল সহযোগিতায় পাশে আছি')}
              </h3>
              <p
                className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
                style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}
              >
                {t(
                  'From website architectural design to system maintenance, data integrity, and feature additions, Rizqara Tech ensures YCN’s digital presence remains smooth, fast, secure, and accessible to millions of youth across Bangladesh and the globe.',
                  'ওয়েবসাইটের ডিজাইন থেকে শুরু করে ডাটা নিরাপত্তা, প্ল্যাটফর্ম অপটিমাইজেশন এবং সার্বক্ষণিক টেকনিক্যাল সাপোর্ট প্রদানে রিজকারা টেক নিরবচ্ছিন্নভাবে কাজ করে চলেছে।'
                )}
              </p>
            </div>

            {/* Services Grid */}
            <h3
              className="text-center font-bold mb-8 text-xl"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}
            >
              {t('Core Tech Capabilities Delivered', 'প্রদানকৃত মূল প্রযুক্তি সুবিধাসমূহ')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map(({ icon: Icon, title, desc, color, bg }) => (
                <div
                  key={title}
                  className="p-6 rounded-2xl transition-all duration-300 hover:shadow-md border border-gray-100"
                  style={{ backgroundColor: bg }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: color }}
                  >
                    <Icon size={22} color="#fff" />
                  </div>
                  <h4
                    className="font-bold text-base mb-2"
                    style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}
                  >
                    {title}
                  </h4>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT & DIRECTORY CARD
      ══════════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)' }}
          >
            <div
              className="absolute right-0 bottom-0 w-96 h-96 opacity-10 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #E8521A 0%, transparent 70%)',
              }}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="bg-white p-3 rounded-2xl flex-shrink-0 shadow-md">
                  <img src="/Rizqaratech.png" alt="Rizqara Tech Logo" className="w-16 h-16 object-contain" />
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold mb-1"
                    style={{ fontFamily: 'Poppins, sans-serif', color: '#fff' }}
                  >
                    Rizqara Tech
                  </h3>
                  <p className="text-sm text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {t('Digital Solutions & Tech Partnership Agency', 'ডিজিটাল সলিউশন ও টেক পার্টনারশিপ এজেন্সি')}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Globe size={14} style={{ color: '#E8521A' }} /> www.rizqara.tech
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} style={{ color: '#E8521A' }} /> rizqaratech@gmail.com
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a
                  href="https://www.rizqara.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                  style={{ backgroundColor: '#E8521A', color: '#fff' }}
                >
                  {t('Visit Website', 'ওয়েবসাইট ভিজিট করুন')}
                  <ArrowRight size={16} />
                </a>

                <a
                  href="mailto:rizqaratech@gmail.com"
                  className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all border border-gray-600 hover:bg-white/10"
                  style={{ color: '#fff' }}
                >
                  <Mail size={16} />
                  {t('Email Us', 'ইমেইল করুন')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
