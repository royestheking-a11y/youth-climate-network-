import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { SEO } from './ui/SEO';
import {
  Calendar, Clock, MapPin, Linkedin, Facebook, Twitter, Link as LinkIcon,
  ArrowRight, ArrowLeft, Lightbulb, Sprout, HelpCircle,
  ChevronDown, Check, Loader2, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { apiBlog, useBlogs } from '../lib/api';
import type { BlogPost } from '../lib/storage';

export function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const { data: allBlogs = [] } = useBlogs();

  useEffect(() => {
    if (id) {
      loadBlog(id);
    }
  }, [id]);

  const loadBlog = async (slugOrId: string) => {
    try {
      setLoading(true);
      const data = await apiBlog.getBySlugOrId(slugOrId);
      setBlog(data);
    } catch (err) {
      console.error('Failed to load blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog?.title || '')}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex justify-center items-center bg-[#FAF9F5]">
        <Loader2 size={36} className="animate-spin text-[#1A6B3C]" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col justify-center items-center bg-[#FAF9F5] text-center px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 font-poppins">{t('Article Not Found', 'নিবন্ধটি পাওয়া যায়নি')}</h2>
        <p className="text-gray-600 text-sm mb-8 font-inter">{t('The story you are looking for may have been moved or removed.', 'আপনার অনুসন্ধানকৃত গল্পটি হয়তো স্থানান্তরিত বা মুছে ফেলা হয়েছে।')}</p>
        <Link to="/blog" className="px-6 py-3 rounded-full bg-[#1A6B3C] text-white text-xs font-semibold inline-flex items-center gap-2">
          <ArrowLeft size={14} /> {t('Back to All Stories', 'সব গল্পে ফিরে যান')}
        </Link>
      </div>
    );
  }

  const title = lang === 'bn' && blog.title_bn ? blog.title_bn : blog.title;
  const content = lang === 'bn' && blog.content_bn ? blog.content_bn : blog.content;
  const excerpt = lang === 'bn' && blog.excerpt_bn ? blog.excerpt_bn : blog.excerpt;
  const category = lang === 'bn' && blog.category_bn ? blog.category_bn : (blog.category || 'Climate Action');

  const relatedBlogs = allBlogs
    .filter(b => (b.slug || b.id) !== (blog.slug || blog.id))
    .slice(0, 3);

  // Structured Data Schema for Article & FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': blog.schemaType || 'Article',
    headline: blog.seoTitle || title,
    description: blog.metaDescription || excerpt,
    image: blog.ogImage || blog.image,
    datePublished: blog.date,
    author: {
      '@type': 'Person',
      name: blog.authorName || 'YCN Bangladesh Contributor',
      jobTitle: blog.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Youth Climate Network Bangladesh',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ycnbd.org/ycnmain.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blog.canonicalUrl || window.location.href
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      <SEO
        title={blog.seoTitle || `${title} | YCN Bangladesh`}
        description={blog.metaDescription || excerpt || ''}
        keywords={blog.metaKeywords || blog.tags?.join(', ') || ''}
      />

      {/* JSON-LD Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── TOP BREADCRUMB & HEADER ── */}
      <div className="pt-32 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6 font-inter flex-wrap">
            <Link to="/" className="hover:text-[#1A6B3C] transition-colors">Home</Link>
            <span>&gt;</span>
            <Link to="/blog" className="hover:text-[#1A6B3C] transition-colors">Stories</Link>
            <span>&gt;</span>
            <span className="text-gray-400">{category}</span>
            <span>&gt;</span>
            <span className="text-gray-900 font-semibold truncate max-w-xs">{title}</span>
          </nav>

          {/* Category Pill */}
          <div className="mb-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EBF5EE] text-[#1A6B3C] border border-[#C6E7D2] inline-block font-inter">
              {category}
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-950 mb-4 leading-tight tracking-tight max-w-4xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {title}
          </h1>

          {/* Excerpt / Lead */}
          {excerpt && (
            <p className="text-base sm:text-lg text-gray-600 font-inter leading-relaxed max-w-3xl mb-8">
              {excerpt}
            </p>
          )}

          {/* Author bar & Social share icons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-gray-100">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                <img
                  src={blog.authorImage || "/Formal Image -  Meet our team /5.  Puja Gain -  Volunteer Coordinator.png"}
                  alt={blog.authorName || "Author"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs font-inter">
                <p className="font-bold text-gray-900 text-sm">
                  {t('By', 'লেখক:')} {blog.authorName || 'Sadia Islam'}
                </p>
                <div className="flex items-center gap-3 text-gray-500 mt-0.5 flex-wrap">
                  <span>{blog.authorRole || 'Program Officer, YCN Bangladesh'}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {blog.readTime || '6 min read'}
                  </span>
                  {blog.location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {blog.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 font-inter mr-1">{t('Share:', 'শেয়ার:')}</span>
              <button
                onClick={shareLinkedIn}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#0A66C2] hover:text-white text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Share on LinkedIn"
              >
                <Linkedin size={14} />
              </button>
              <button
                onClick={shareFacebook}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1877F2] hover:text-white text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Share on Facebook"
              >
                <Facebook size={14} />
              </button>
              <button
                onClick={shareTwitter}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Share on X"
              >
                <Twitter size={14} />
              </button>
              <button
                onClick={copyUrl}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-800 hover:text-white text-gray-600 flex items-center justify-center transition-colors cursor-pointer relative"
                title="Copy Link"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <LinkIcon size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── ARTICLE HERO IMAGE ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl bg-gray-100 relative">
          <img
            src={blog.image || "/Formal Image -  Meet our team /1. Arafat Hossain Akash - Founder & Executive Director .png"}
            alt={blog.imageAlt || title}
            className="w-full h-full object-cover"
          />
          {blog.location && (
            <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
              <MapPin size={13} className="text-[#E8521A]" />
              <span>{blog.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── ARTICLE MAIN CONTENT + SIDEBAR ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Rich Text Body */}
            <div
              className="prose prose-lg max-w-none text-gray-700 font-inter leading-relaxed space-y-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:font-poppins [&>h3]:mt-8 [&>h3]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-[#1A6B3C] [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:bg-emerald-50/50 [&>blockquote]:rounded-r-2xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Multiple Gallery Images if available */}
            {blog.galleryImages && blog.galleryImages.length > 0 && (
              <div className="pt-6">
                <h4 className="font-bold text-gray-900 text-lg mb-4 font-poppins">Field Gallery</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {blog.galleryImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <img src={img} alt={`Field photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Metrics Grid Matching Design Reference */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
              {[
                { count: '12,500+', label: t('Mangrove saplings planted by youth', 'ম্যানগ্রোভ চারা রোপণ') },
                { count: '850+', label: t('Community members reached in sessions', 'সচেতনতা সেশনে অংশগ্রহণকারী') },
                { count: '12', label: t('Coastal communities engaged in resilience', 'উপকূলীয় সম্প্রদায়') },
                { count: '30+', label: t('Youth volunteers leading local action', 'সক্রিয় যুব স্বেচ্ছাসেবক') },
              ].map((metric, i) => (
                <div key={i} className="text-center p-3">
                  <div className="text-2xl sm:text-3xl font-black text-[#E8521A] mb-1 font-poppins">{metric.count}</div>
                  <div className="text-xs text-gray-600 font-inter leading-tight">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Callout Card: A Youth-Led Solution */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF6F2] border border-[#FED7C7] flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8521A] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Lightbulb size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-1 font-poppins">
                  {t('A Youth-Led Solution', 'যুব-নেতৃত্বাধীন সমাধান')}
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed font-inter">
                  {t(
                    'By combining local traditional knowledge with modern climate education, youth volunteers are creating practical, community-driven solutions that work for their unique geographical context.',
                    'স্থানীয় সনাতন জ্ঞানের সাথে আধুনিক জলবায়ু শিক্ষার সমন্বয় ঘটিয়ে, তরুণ স্বেচ্ছাসেবকরা ব্যবহারিক এবং সম্প্রদায়-ভিত্তিক সমাধান তৈরি করছে যা তাদের নিজস্ব পরিবেশের জন্য উপযোগী।'
                  )}
                </p>
              </div>
            </div>

            {/* SDGs Badges */}
            {blog.sdgs && blog.sdgs.length > 0 && (
              <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-inter">
                  Sustainable Development Goals Addressed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {blog.sdgs.map(sdgNum => (
                    <span
                      key={sdgNum}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                      style={{
                        backgroundColor: sdgNum === 13 ? '#3F7E44' : sdgNum === 14 ? '#0A97D9' : sdgNum === 15 ? '#56C02B' : '#E8521A'
                      }}
                    >
                      <span>SDG {sdgNum}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AEO Frequently Asked Questions */}
            {blog.faqs && blog.faqs.length > 0 && (
              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle size={20} className="text-[#1A6B3C]" />
                  <h3 className="text-xl font-bold text-gray-900 font-poppins">
                    {t('Frequently Asked Questions', 'প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী')}
                  </h3>
                </div>
                <div className="space-y-3">
                  {blog.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full p-5 text-left font-bold text-sm text-gray-900 flex items-center justify-between hover:text-[#1A6B3C] transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      {activeFaq === idx && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed font-inter border-t border-gray-50 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inbound / Outbound Links */}
            {(blog.inboundLinks?.length || blog.outboundLinks?.length) ? (
              <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-inter">
                  Related References & Resources
                </h4>
                <div className="flex flex-wrap gap-3">
                  {blog.inboundLinks?.map((l, i) => (
                    <Link
                      key={i}
                      to={l.url}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EBF5EE] text-[#1A6B3C] hover:bg-[#d5ecd9] transition-colors"
                    >
                      <span>{l.text}</span>
                    </Link>
                  ))}
                  {blog.outboundLinks?.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target={l.openInNewTab ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <span>{l.text}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Tags & Bottom Social Share */}
            <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-gray-400 font-inter">Tags:</span>
                {blog.tags?.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-200 shadow-sm">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={shareLinkedIn} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors">
                  <Linkedin size={14} />
                </button>
                <button onClick={shareFacebook} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors">
                  <Facebook size={14} />
                </button>
                <button onClick={shareTwitter} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <Twitter size={14} />
                </button>
                <button onClick={copyUrl} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors">
                  {copied ? <Check size={14} className="text-green-600" /> : <LinkIcon size={14} />}
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Table of Contents card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 sticky top-28">
              <h4 className="font-bold text-gray-900 text-sm font-poppins">{t('Table of Contents', 'সূচিপত্র')}</h4>
              <ul className="space-y-3 text-xs text-gray-600 font-inter">
                <li className="flex items-center gap-2 text-[#1A6B3C] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A6B3C]" />
                  <span>Building Stronger Coasts</span>
                </li>
                <li className="flex items-center gap-2 hover:text-[#1A6B3C] transition-colors pl-3.5">
                  <span>Restoring Mangroves, Restoring Hope</span>
                </li>
                <li className="flex items-center gap-2 hover:text-[#1A6B3C] transition-colors pl-3.5">
                  <span>Raising Awareness for a Safer Tomorrow</span>
                </li>
                <li className="flex items-center gap-2 hover:text-[#1A6B3C] transition-colors pl-3.5">
                  <span>Looking Ahead</span>
                </li>
              </ul>

              {/* Related Topics */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm mb-3 font-poppins">{t('Related Topics', 'সম্পর্কিত বিষয়সমূহ')}</h4>
                <div className="flex flex-wrap gap-2">
                  {['Climate Action', 'Coastal Communities', 'Mangrove Restoration', 'Youth Leadership', 'Disaster Risk Reduction', 'Biodiversity'].map((top, idx) => (
                    <Link
                      key={idx}
                      to={`/blog?q=${encodeURIComponent(top)}`}
                      className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#FAF9F5] text-gray-700 hover:bg-[#E8521A] hover:text-white transition-colors"
                    >
                      {top}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Join the Movement Card */}
              <div className="p-6 rounded-2xl bg-[#072416] text-white relative overflow-hidden shadow-lg mt-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E8521A] mb-3">
                  <Sprout size={20} />
                </div>
                <h4 className="font-bold text-base text-[#F0ECD8] mb-1 font-poppins">{t('Join the Movement', 'আন্দোলনে যোগ দিন')}</h4>
                <p className="text-xs text-[#A8C4B0] font-inter leading-relaxed mb-4">
                  {t('Be part of a growing network of young changemakers working for a greener Bangladesh.', 'সবুজ বাংলাদেশের জন্য কাজ করা পরিবর্তনকারীদের অংশ হোন।')}
                </p>
                <Link
                  to="/get-involved"
                  className="w-full py-2.5 rounded-xl bg-[#E8521A] text-white text-xs font-semibold text-center block hover:bg-[#d0420f] transition-colors shadow-md"
                >
                  {t('Get Involved →', 'যুক্ত হোন →')}
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* ── RELATED STORIES ── */}
        <div className="pt-20 border-t border-gray-200 mt-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#E8521A] uppercase tracking-wider block font-inter">{t('MORE INSIGHTS', 'আরও অন্তর্দৃষ্টি')}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('Related Stories', 'সম্পর্কিত গল্পসমূহ')}
              </h2>
            </div>
            <Link to="/blog" className="text-xs font-semibold text-[#1A6B3C] hover:underline flex items-center gap-1 font-inter">
              {t('View All Stories', 'সব গল্প দেখুন')} <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map(rBlog => (
              <Link
                key={rBlog.id || rBlog.slug}
                to={`/blog/${rBlog.slug || rBlog.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                  <img src={rBlog.image || "/Formal Image -  Meet our team /1. Arafat Hossain Akash - Founder & Executive Director .png"} alt={rBlog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold">
                    {rBlog.category || 'Story'}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-[#1A6B3C] transition-colors font-poppins">
                    {rBlog.title}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[11px] text-gray-400 font-inter">
                    <span>{new Date(rBlog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-[#E8521A] font-semibold flex items-center gap-0.5">Read <ArrowRight size={11} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
