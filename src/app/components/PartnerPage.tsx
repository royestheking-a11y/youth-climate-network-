import { useState, useEffect } from 'react';
import { SEO } from './ui/SEO';
import { Link } from 'react-router';
import { apiPartners } from '../lib/api';
import { Search, ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function PartnerPage() {
  const { t, lang } = useLanguage();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await apiPartners.getAll();
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(partner => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return partner.name.toLowerCase().includes(query) || 
           (partner.category && partner.category.toLowerCase().includes(query));
  });

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <SEO 
        title={t('Our Partners', 'আমাদের অংশীদার')} 
        description={t('Discover the organizations and networks that empower Youth Climate Network.', 'ইউথ ক্লাইমেট নেটওয়ার্ককে ক্ষমতায়নকারী সংস্থা এবং নেটওয়ার্কগুলি আবিষ্কার করুন।')}
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
            {t('Partners', 'অংশীদার')}
          </div>
          <h1
            className="mb-6"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: '#F0ECD8' }}
          >
            {t('Our Partners & Networks', 'আমাদের অংশীদার এবং নেটওয়ার্ক')}
          </h1>
          <p
            className="max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.1rem' }}
          >
            {t(
              'We believe in the power of collaboration. Discover the incredible organizations that work alongside us to drive climate justice.',
              'আমরা সহযোগিতার শক্তিতে বিশ্বাস করি। জলবায়ু ন্যায়বিচার প্রতিষ্ঠায় আমাদের সাথে কাজ করা অবিশ্বাস্য সংস্থাগুলি সম্পর্কে জানুন।'
            )}
          </p>
        </div>
      </section>

      {/* Wave */}
      <div style={{ lineHeight: 0, backgroundColor: '#F9FAFB' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,40 C360,0 1080,60 1440,20 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">

        {/* Search */}
        <div className="max-w-md mx-auto mb-16 relative group">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={t('Search partners...', 'অংশীদার খুঁজুন...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 rounded-2xl text-sm border outline-none transition-all duration-300 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
            <Search className="absolute left-4 text-gray-400" size={18} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm max-w-xl mx-auto">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {t('No partners found', 'কোনো অংশীদার পাওয়া যায়নি')}
            </h3>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-800 hover:bg-green-900 transition-colors"
            >
              {t('Clear Search', 'অনুসন্ধান মুছুন')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPartners.map((partner) => {
              const desc = lang === 'bn' && partner.description_bn ? partner.description_bn : partner.description;
              return (
                <div key={partner.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full hover:-translate-y-1 border border-gray-100">
                  <div className="h-32 flex items-center justify-center mb-6 p-4 rounded-xl bg-gray-50 group-hover:bg-green-50 transition-colors">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <span className="text-gray-400 font-bold text-xl">{partner.name[0]}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 text-center">
                    {partner.name}
                  </h3>
                  {partner.category && (
                    <div className="flex justify-center mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {partner.category}
                      </span>
                    </div>
                  )}
                  {desc && (
                    <p className="text-sm text-gray-500 mb-6 text-center line-clamp-3 flex-grow">
                      {desc}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-center gap-4">
                    <Link
                      to={`/partners/${partner.id}`}
                      className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors flex items-center gap-1"
                    >
                      {t('Details', 'বিস্তারিত')} <ArrowRight size={14} />
                    </Link>
                    {partner.url && (
                      <a 
                        href={partner.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-orange-600 transition-colors"
                        title={t('Visit Website', 'ওয়েবসাইট ভিজিট করুন')}
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
