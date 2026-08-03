import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { SEO } from './ui/SEO';
import { apiPartners } from '../lib/api';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function PartnerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartner();
  }, [id]);

  const fetchPartner = async () => {
    try {
      setLoading(true);
      const data = await apiPartners.getAll();
      const found = data.find((p: any) => p.id === id);
      setPartner(found);
    } catch (error) {
      console.error('Error fetching partner details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('Partner not found', 'অংশীদার পাওয়া যায়নি')}</h2>
        <Link to="/partners" className="text-orange-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> {t('Back to Partners', 'অংশীদারদের কাছে ফিরে যান')}
        </Link>
      </div>
    );
  }

  const details = lang === 'bn' && partner.details_bn ? partner.details_bn : partner.details;
  const description = lang === 'bn' && partner.description_bn ? partner.description_bn : partner.description;

  return (
    <div className="min-h-screen pt-36 pb-20 bg-white">
      <SEO 
        title={`${partner.name} - ${t('Partner', 'অংশীদার')}`} 
        description={description || `${partner.name} is a partner of Youth Climate Network`}
      />
      
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/partners" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={16} /> {t('Back to all partners', 'সকল অংশীদারে ফিরে যান')}
        </Link>

        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 md:gap-16 border border-gray-100">
          <div className="w-48 h-48 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center p-6 shadow-sm">
            {partner.logo ? (
              <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-4xl font-bold text-gray-300">{partner.name[0]}</span>
            )}
          </div>
          <div className="flex-grow text-center md:text-left">
            {partner.category && (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {partner.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {partner.name}
            </h1>
            {description && (
              <p className="text-lg text-gray-600 mb-6">
                {description}
              </p>
            )}
            {partner.url && (
              <a 
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                <Globe size={18} /> {t('Visit Website', 'ওয়েবসাইট ভিজিট করুন')} <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {details && (
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
              {t('About the Partnership', 'অংশীদারিত্ব সম্পর্কে')}
            </h2>
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: details }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
