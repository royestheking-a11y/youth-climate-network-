import { Link } from 'react-router';
import { SEO } from './ui/SEO';
import logo1 from '../../imports/Asset_1.webp';
import { useLanguage } from '../lib/LanguageContext';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A3320' }}>
      <SEO title="404 - Not Found" />
      <div className="text-center px-4">
        <img src={logo1} alt="YCN" className="h-24 w-auto mx-auto mb-8 opacity-70" />
        <div className="text-8xl font-bold mb-4" style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}>
          {t('404', '৪০৪')}
        </div>
        <h2 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#F0ECD8' }}>
          {t('Page Not Found', 'পৃষ্ঠাটি পাওয়া যায়নি')}
        </h2>
        <p className="mb-8 max-w-md mx-auto" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>
          {t(
            "The page you're looking for doesn't exist. Perhaps you were looking for one of our programs or would like to get involved?",
            'আপনি যে পৃষ্ঠাটি খুঁজছেন তার অস্তিত্ব নেই। সম্ভবত আপনি আমাদের কার্যক্রম বা যুক্ত হওয়ার পাতাগুলো খুঁজছিলেন?'
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: '#E8521A', color: '#fff', fontFamily: 'Inter, sans-serif' }}
          >
            {t('Go Home', 'হোমে ফিরে যান')}
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ border: '1.5px solid rgba(240,236,216,0.3)', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
          >
            {t('Contact Us', 'যোগাযোগ করুন')}
          </Link>
        </div>
      </div>
    </div>
  );
}
