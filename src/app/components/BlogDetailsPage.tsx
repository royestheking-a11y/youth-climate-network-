import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { SEO } from './ui/SEO';
import { apiBlog } from '../lib/api';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await apiBlog.getAll();
      const found = data.find((b: any) => b.id === id);
      setBlog(found);
    } catch (error) {
      console.error('Error fetching blog details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lang === 'bn' && blog.title_bn ? blog.title_bn : blog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('Link copied to clipboard!', 'লিংক কপি করা হয়েছে!'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('Article not found', 'নিবন্ধটি পাওয়া যায়নি')}</h2>
        <Link to="/blog" className="text-orange-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> {t('Back to Blog', 'ব্লগে ফিরে যান')}
        </Link>
      </div>
    );
  }

  const title = lang === 'bn' && blog.title_bn ? blog.title_bn : blog.title;
  const content = lang === 'bn' && blog.content_bn ? blog.content_bn : blog.content;
  const excerpt = lang === 'bn' && blog.excerpt_bn ? blog.excerpt_bn : blog.excerpt;
  const dateObj = new Date(blog.date);

  return (
    <div className="min-h-screen pt-36 pb-20 bg-white">
      <SEO 
        title={title} 
        description={blog.metaDescription || excerpt || ''}
        keywords={blog.metaKeywords || ''}
      />
      
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 transition-colors mb-8">
          <ArrowLeft size={16} /> {t('Back to all articles', 'সকল নিবন্ধে ফিরে যান')}
        </Link>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h1>

        <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Calendar size={16} />
            <span>{dateObj.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors" title={t('Share', 'শেয়ার করুন')}>
            <Share2 size={18} />
          </button>
        </div>

        {blog.image && (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-sm">
            <img src={blog.image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          style={{ fontFamily: 'Inter, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
