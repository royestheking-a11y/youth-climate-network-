import { SEO } from './ui/SEO';
import { Download, Heart, Brain, Leaf, ArrowRight } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function MindShantaraPage() {
  const { t } = useLanguage();

  return (
    <div>
      <SEO 
        title="Mind Shantara" 
        description="Bangladesh’s First Climate Anxiety & Mental Health Wellbeing platform."
        keywords="mind shantara, climate anxiety, mental health bangladesh, youth climate network, wellbeing"
      />
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 30% 60%, #E8521A 0%, transparent 45%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Mental Health Wellbeing', 'মানসিক স্বাস্থ্য সুরক্ষা')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            Mind Shantara
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.25rem' }}>
            {t(
              "Bangladesh’s First Climate Anxiety & Mental Health Wellbeing platform.",
              "বাংলাদেশের প্রথম জলবায়ু উদ্বেগ এবং মানসিক স্বাস্থ্য সুরক্ষা প্ল্যাটফর্ম।"
            )}
          </p>
          <a
            href="/MindShantara_Startup_Plan_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#E8521A', color: '#fff', fontFamily: 'Inter, sans-serif' }}
          >
            <Download size={18} /> {t('Download Startup Plan 2026', 'স্টার্টআপ প্ল্যান ২০২৬ ডাউনলোড করুন')}
          </a>
        </div>
      </section>

      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#E8F5EE' }}>
              <Brain size={32} style={{ color: '#1A6B3C' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
              {t('Healing the Mind, Healing the Earth', 'মন সুস্থ থাকলে, পৃথিবী সুস্থ থাকবে')}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              {t(
                'Climate change is not just an environmental crisis—it is a deeply emotional and psychological one. Mind Shantara is dedicated to addressing eco-anxiety and providing a safe space for youth and frontline communities to find mental health support.',
                'জলবায়ু পরিবর্তন শুধুমাত্র একটি পরিবেশগত সংকট নয়—এটি একটি গভীর মানসিক সংকটও। মাইন্ড শান্তারা ইকো-অ্যাংজাইটি (পরিবেশগত উদ্বেগ) মোকাবেলা করতে এবং তরুণদের জন্য মানসিক স্বাস্থ্য সহায়তা প্রদানের জন্য নিবেদিত।'
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                <Heart size={20} className="mb-2" style={{ color: '#E8521A' }} />
                <h4 className="font-semibold mb-1" style={{ color: '#1F2937' }}>{t('Emotional Resilience', 'মানসিক দৃঢ়তা')}</h4>
                <p className="text-sm text-gray-500">{t('Building psychological strength to face climate realities.', 'জলবায়ু বাস্তবতার মুখোমুখি হতে মানসিক শক্তি বৃদ্ধি।')}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                <Leaf size={20} className="mb-2" style={{ color: '#1A6B3C' }} />
                <h4 className="font-semibold mb-1" style={{ color: '#1F2937' }}>{t('Eco-Therapy', 'ইকো-থেরাপি')}</h4>
                <p className="text-sm text-gray-500">{t('Connecting with nature as a profound healing process.', 'নিরাময় প্রক্রিয়া হিসেবে প্রকৃতির সাথে সংযোগ স্থাপন।')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
