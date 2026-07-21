import { useState } from 'react';
import { SEO } from './ui/SEO';
import { Play, Camera, Newspaper, Download, ExternalLink } from 'lucide-react';
import banner4 from '../../imports/Asset_4.webp';
import banner3 from '../../imports/Asset_3.webp';
import { useLanguage } from '../lib/LanguageContext';
import { useMedia } from '../lib/api';
import { MediaSkeleton, VideoSkeleton } from './ui/Skeletons';

export const getYoutubeThumbnail = (url: string | undefined) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
};

export function MediaPage() {
  const { t } = useLanguage();
  const [activePhotoCategory, setActivePhotoCategory] = useState(t('All', 'সব'));
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const { data: mediaItems = [], isLoading } = useMedia();

  const photoGallery = mediaItems.filter(m => m.type === 'image');
  const videoItems = mediaItems.filter(m => m.type === 'video');
  const pressItems = mediaItems.filter(m => m.type === 'press');
  const pressKitItems = mediaItems.filter(m => m.type === 'pressKit');

  const photoCategories = [
    t('All', 'সব'),
    t('Advocacy', 'অ্যাডভোকেসি'),
    t('Environment', 'পরিবেশ'),
    t('Youth', 'যুবসমাজ'),
    t('Women Empowerment', 'নারী ক্ষমতায়ন'),
    t('WASH', 'ওয়াশ'),
    t('Energy', 'জ্বালানি')
  ];

  const filteredPhotos = activePhotoCategory === t('All', 'সব') ? photoGallery : photoGallery.filter(p => p.category === activePhotoCategory);

  return (
    <div>
      <SEO
        title="Media & Gallery"
        description="Explore the Youth Climate Network media gallery. View photos and videos of our climate campaigns, tree planting events, and community advocacy."
        keywords="youth climate network gallery, climate campaign photos, environmental media, youth action videos, tree planting pictures"
      />
      {/* Hero */}
      <section className="pt-32 pb-0 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${banner3})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,51,32,0.8), rgba(10,51,32,0.95))' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pb-20 pt-8">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Media Center', 'মিডিয়া সেন্টার')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Media Center', 'মিডিয়া সেন্টার')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.05rem' }}>
            {t(
              "Stories, images, videos, and press resources from YCN's work on the climate frontlines of Bangladesh, South Asia, and Asia Pacific.",
              'বাংলাদেশ, দক্ষিণ এশিয়া এবং এশিয়া প্যাসিফিকের জলবায়ু যুদ্ধের সম্মুখ সমরের গল্প, ছবি, ভিডিও এবং বিভিন্ন মিডিয়া রিসোর্স।'
            )}
          </p>
        </div>
      </section>

      {/* Orange banner decoration */}
      <div style={{ lineHeight: 0 }}>
        <img src={banner4} alt="" className="w-full" style={{ height: 80, objectFit: 'cover' }} />
      </div>

      {/* Photo Gallery */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Camera size={18} style={{ color: '#E8521A' }} />
                <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#1F2937' }}>
                  {t('Photo Gallery', 'ফটো গ্যালারি')}
                </h2>
              </div>
              <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {t('All photos available for editorial use with attribution to YCN', 'কৃতজ্ঞতা স্বীকার সাপেক্ষে সকল ছবি প্রকাশ ও ব্যবহারের জন্য উন্মুক্ত')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {photoCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActivePhotoCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: activePhotoCategory === cat ? '#0A3320' : '#fff',
                    color: activePhotoCategory === cat ? '#F0ECD8' : '#374151',
                    border: `1px solid ${activePhotoCategory === cat ? '#0A3320' : '#E5E7EB'}`,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => <MediaSkeleton key={i} />)
            ) : filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '4/3' }}
                onClick={() => setLightboxImg(photo.url || null)}
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-xs font-semibold text-white">{t(photo.title || '', photo.title_bn || photo.title || '')}</p>
                  <p className="text-xs text-white/70">{t(photo.location || '', photo.location_bn || photo.location || '')}</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'rgba(232,82,26,0.9)' }}>{t(photo.category || '', photo.category_bn || photo.category || '')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          onClick={() => setLightboxImg(null)}
        >
          <img src={lightboxImg} alt="Full size" className="max-w-full max-h-full rounded-xl shadow-2xl" />
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => setLightboxImg(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Videos */}
      <section className="py-16" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-8">
            <Play size={18} style={{ color: '#E8521A' }} />
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#1F2937' }}>
              {t('Video Gallery', 'ভিডিও গ্যালারি')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <VideoSkeleton key={i} />)
            ) : videoItems.map((video) => {
              const youtubeThumb = getYoutubeThumbnail(video.url);
              return (
              <a href={video.url} target="_blank" rel="noopener noreferrer" key={video.id} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer block">
                <div className="relative" style={{ aspectRatio: '16/9' }}>
                  <img src={video.thumbnail || youtubeThumb || video.url || 'https://via.placeholder.com/400x225?text=Video'} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(10,51,32,0.4)' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: '#E8521A' }}>
                      <Play size={18} color="#fff" fill="#fff" />
                    </div>
                  </div>
                  {video.duration && video.duration !== '0:00' && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs text-white font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                      {video.duration}
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{t(video.category || '', video.category_bn || video.category || '')}</span>
                  <p className="text-sm font-medium mt-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{t(video.title || '', video.title_bn || video.title || '')}</p>
                </div>
              </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-8">
            <Newspaper size={18} style={{ color: '#E8521A' }} />
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#1F2937' }}>
              {t('Press Coverage', 'মিডিয়া কভারেজ')}
            </h2>
          </div>
          <div className="space-y-4">
            {pressItems.map((item, i) => (
              <a href={item.url} target="_blank" rel="noopener noreferrer" key={i} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4 cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F5EE' }}>
                  <Newspaper size={16} style={{ color: '#1A6B3C' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif' }}>{item.outlet}</span>
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>{item.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>{item.type}</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{item.title}</p>
                  <span className="text-xs font-medium mt-2 inline-block hover:underline" style={{ color: '#0A3320' }}>{t('Read Full Article', 'পুরো আর্টিকেলটি পড়ুন')} →</span>
                </div>
                <ExternalLink size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Press Kit */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="mb-8" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#1F2937' }}>
            {t('Press Kit & Resources', 'প্রেস কিট ও তথ্যভাণ্ডার')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pressKitItems.map((item) => (
              <div key={item.title} className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F5EE' }}>
                  <Download size={16} style={{ color: '#1A6B3C' }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm mb-0.5" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{item.desc}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{item.size}</p>
                </div>
                <button className="text-xs font-semibold px-3 py-2 rounded-lg flex-shrink-0 transition-all hover:scale-105" style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}>
                  {t('Download', 'ডাউনলোড')}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-2xl" style={{ backgroundColor: '#0A3320' }}>
            <h4 className="font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#F0ECD8' }}>
              {t('Media Contact', 'মিডিয়া যোগাযোগ')}
            </h4>
            <p className="text-sm mb-4" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>
              {t(
                'For interview requests, broadcast media, photo permissions, or editorial inquiries, contact our Communications & Media team.',
                'সাক্ষাৎকার অনুরোধ, সম্প্রচার মিডিয়া, ছবির অনুমতি বা অন্যান্য মিডিয়া যোগাযোগের জন্য আমাদের মিডিয়া টিমের সাথে যোগাযোগ করুন।'
              )}
            </p>
            <div className="flex flex-col gap-2">
              <a href="mailto:info@youthclimatenetwork.org" className="text-sm font-medium hover:underline" style={{ color: '#E8521A' }}>
                info@youthclimatenetwork.org
              </a>
              <span className="text-sm" style={{ color: '#A8C4B0' }}>
                {t('Usha Bin Farid - Head of Communications & Content', 'উষা বিন ফরিদ - কমিউনিকেশন ও কনটেন্ট হেড')}
              </span>
              <a href="mailto:info@youthclimatenetwork.org" className="text-sm font-medium hover:underline mt-2" style={{ color: '#E8521A' }}>
                info@youthclimatenetwork.org
              </a>
              <span className="text-sm" style={{ color: '#A8C4B0' }}>
                {t('General Inquiries', 'সাধারণ জিজ্ঞাসা')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
