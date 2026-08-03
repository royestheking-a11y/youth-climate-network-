import { useState, useEffect } from 'react';
import { SEO } from './ui/SEO';
import { Link } from 'react-router';
import { apiProgram } from '../lib/api';
import * as Icons from 'lucide-react';
import { ArrowRight, Search, X } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function OurWorkPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await apiProgram.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const titleEn = (program.title || '').toLowerCase();
    const titleBn = (program.title_bn || '').toLowerCase();
    const descEn = (program.description || '').toLowerCase();
    const descBn = (program.description_bn || '').toLowerCase();
    const themeEn = (program.theme || '').toLowerCase();
    const themeBn = (program.theme_bn || '').toLowerCase();
    
    return (
      titleEn.includes(query) ||
      titleBn.includes(query) ||
      descEn.includes(query) ||
      descBn.includes(query) ||
      themeEn.includes(query) ||
      themeBn.includes(query)
    );
  });

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F3F4F6' }}>
      <SEO 
        title="Our Work" 
        description="Learn about the Youth Climate Network's key thematic areas: Sustainable Energy, Environmental Education, Disaster Resilience, and Climate Tech."
        keywords="youth climate network projects, sustainable energy bangladesh, environmental education, disaster resilience, climate tech, youth environmental work"
      />
      {/* Hero Section */}
      <section
        className="pt-32 pb-20 relative overflow-hidden"
        style={{ backgroundColor: '#0A3320' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #E8521A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1A6B3C 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Our Work', 'আমাদের কাজ')}
          </div>
          <h1
            className="mb-6"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: '#F0ECD8' }}
          >
            {t('Our Work & Thematic Areas', 'আমাদের কাজ ও থিম্যাটিক ক্ষেত্রসমূহ')}
          </h1>
          <p
            className="max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.1rem' }}
          >
            {t(
              'From grassroots community adaptation to international policy advocacy, our interventions are designed to build resilience and champion climate justice across 15 core thematic areas.',
              'তৃণমূল পর্যায়ের সামাজিক অভিযোজন থেকে শুরু করে আন্তর্জাতিক নীতি নির্ধারণী অ্যাডভোকেসি পর্যন্ত, আমাদের কার্যক্রমগুলো ১৫টি প্রধান থিম্যাটিক ক্ষেত্রে সহনশীলতা তৈরি এবং জলবায়ু ন্যায়বিচার নিশ্চিত করতে ডিজাইন করা হয়েছে।'
            )}
          </p>
        </div>
      </section>

      {/* Wave */}
      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,40 C360,0 1080,60 1440,20 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">


        {/* Bilingual Search Bar */}
        <div className="max-w-md mx-auto mb-16 relative group">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={t('Search thematic areas...', 'থিম্যাটিক ক্ষেত্র খুঁজুন...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 pr-12 rounded-2xl text-sm border outline-none transition-all duration-300 shadow-sm"
              style={{
                backgroundColor: '#ffffff',
                borderColor: searchQuery ? '#E8521A' : '#E5E7EB',
                color: '#1F2937',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#E8521A';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(232,82,26,0.12), 0 8px 10px -6px rgba(232,82,26,0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = searchQuery ? '#E8521A' : '#E5E7EB';
                e.currentTarget.style.boxShadow = searchQuery ? '0 10px 25px -5px rgba(232,82,26,0.12)' : 'none';
              }}
            />
            <Search className="absolute left-4 text-gray-400 group-hover:text-orange-600 transition-colors" size={18} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Grid and Empty State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm max-w-xl mx-auto">
            <Search size={48} className="mx-auto mb-4 text-gray-300 animate-pulse" />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
              {t('No results found', 'কোনো ফলাফল পাওয়া যায়নি')}
            </h3>
            <p className="text-sm mb-6 px-4" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
              {t(
                `We couldn't find any thematic areas matching "${searchQuery}".`,
                `"${searchQuery}" এর সাথে মিল রয়েছে এমন কোনো থিম্যাটিক ক্ষেত্র পাওয়া যায়নি।`
              )}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}
            >
              {t('Reset Search', 'অনুসন্ধান রিসেট করুন')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrograms.map((program) => {
              const title = t(program.title, program.title_bn);
              const description = t(program.description, program.description_bn);
              const IconComponent = (Icons as any)[program.iconName || 'Box'] || Icons.Box;
              
              return (
                <div
                  key={program.id || program.slug}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full hover:-translate-y-1"
                  style={{ borderTop: `4px solid ${program.color}` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: program.bg }}>
                    <IconComponent size={24} style={{ color: program.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {description?.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/our-work/${program.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
                    style={{ color: program.color, fontFamily: 'Inter, sans-serif' }}
                  >
                    {t('Explore Details', 'বিস্তারিত দেখুন')} <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
