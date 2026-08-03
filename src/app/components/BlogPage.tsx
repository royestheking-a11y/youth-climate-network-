import { useState, useEffect } from 'react';
import { SEO } from './ui/SEO';
import { Link } from 'react-router';
import { apiBlog } from '../lib/api';
import { ArrowRight, Search, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function BlogPage() {
  const { t, lang } = useLanguage();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await apiBlog.getAll();
      // Sort by date descending
      data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const title = (lang === 'bn' && blog.title_bn ? blog.title_bn : blog.title).toLowerCase();
    const excerpt = (lang === 'bn' && blog.excerpt_bn ? blog.excerpt_bn : blog.excerpt || '').toLowerCase();
    
    return title.includes(query) || excerpt.includes(query);
  });

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <SEO 
        title={t('Blog & Insights', 'ব্লগ ও অন্তর্দৃষ্টি')} 
        description={t('Read the latest updates, stories, and insights from Youth Climate Network.', 'ইউথ ক্লাইমেট নেটওয়ার্কের সর্বশেষ আপডেট, গল্প এবং অন্তর্দৃষ্টি পড়ুন।')}
        keywords="youth climate network blog, climate change insights, stories, updates, YCN blog"
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
            {t('Insights', 'অন্তর্দৃষ্টি')}
          </div>
          <h1
            className="mb-6"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: '#F0ECD8' }}
          >
            {t('Our Blog', 'আমাদের ব্লগ')}
          </h1>
          <p
            className="max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.1rem' }}
          >
            {t(
              'Discover the latest stories, research, and updates from the frontlines of climate action.',
              'জলবায়ু পদক্ষেপের ফ্রন্টলাইন থেকে সর্বশেষ গল্প, গবেষণা এবং আপডেটগুলি আবিষ্কার করুন।'
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
              placeholder={t('Search articles...', 'নিবন্ধ খুঁজুন...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 rounded-2xl text-sm border outline-none transition-all duration-300 shadow-sm focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
            />
            <Search className="absolute left-4 text-gray-400" size={18} />
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm max-w-xl mx-auto">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {t('No articles found', 'কোনো নিবন্ধ পাওয়া যায়নি')}
            </h3>
            <p className="text-sm text-gray-500 mb-6 px-4">
              {t(`We couldn't find any articles matching "${searchQuery}".`, `"${searchQuery}" এর সাথে মিল রয়েছে এমন কোনো নিবন্ধ পাওয়া যায়নি।`)}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-800 hover:bg-green-900 transition-colors"
            >
              {t('Clear Search', 'অনুসন্ধান মুছুন')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => {
              const title = lang === 'bn' && blog.title_bn ? blog.title_bn : blog.title;
              const excerpt = lang === 'bn' && blog.excerpt_bn ? blog.excerpt_bn : blog.excerpt;
              const dateObj = new Date(blog.date);
              
              return (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {blog.image ? (
                      <img 
                        src={blog.image} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Tag size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-green-700 font-semibold mb-3">
                      <Calendar size={14} />
                      <span>{dateObj.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-3">
                      {excerpt}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 group-hover:gap-3 transition-all">
                      {t('Read More', 'আরও পড়ুন')} <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
