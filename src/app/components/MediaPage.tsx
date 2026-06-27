import { useState } from 'react';
import { SEO } from './ui/SEO';
import { Play, Camera, Newspaper, Download, ExternalLink, ThumbsUp, MessageCircle, Share2, Facebook, Instagram } from 'lucide-react';
import banner4 from '../../imports/Asset_4.webp';
import banner3 from '../../imports/Asset_3.webp';
import { useLanguage } from '../lib/LanguageContext';
import { useMedia } from '../lib/api';
import { MediaSkeleton, VideoSkeleton } from './ui/Skeletons';

export function MediaPage() {
  const { t } = useLanguage();
  const [activePhotoCategory, setActivePhotoCategory] = useState(t('All', 'সব'));
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const { data: mediaItems = [], isLoading } = useMedia();

  const photoGallery = mediaItems.filter(m => m.type === 'image');
  const videoItems = mediaItems.filter(m => m.type === 'video');

  const pressItems = [
    { outlet: t('The Daily Star', 'দ্য ডেইলি স্টার'), title: t("Youth climate activists push for Bangladesh voices at COP29", "কপ-২৯ সম্মেলনে বাংলাদেশের কণ্ঠস্বর তুলে ধরছেন তরুণ জলবায়ু কর্মীরা"), date: t('Nov 2024', 'নভেম্বর ২০২৪'), type: t('Print / Online', 'প্রিন্ট / অনলাইন') },
    { outlet: t('Prothom Alo', 'প্রথম আলো'), title: t('তরুণদের জলবায়ু নেটওয়ার্ক বৈশ্বিক মঞ্চে বাংলাদেশের কণ্ঠস্বর', 'তরুণদের জলবায়ু নেটওয়ার্ক বৈশ্বিক মঞ্চে বাংলাদেশের কণ্ঠস্বর'), date: t('Nov 2024', 'নভেম্বর ২০২৪'), type: t('Print / Online', 'প্রিন্ট / অনলাইন') },
    { outlet: t('Dhaka Tribune', 'ঢাকা ট্রিবিউন'), title: t("YCN solar project powers 500 homes in Khulna's coastal belt", "খুলনার উপকূলীয় এলাকার ৫০০ বাড়িতে আলো ছড়াচ্ছে ওয়াইসিএন সোলার প্রকল্প"), date: t('Oct 2024', 'অক্টোবর ২০২৪'), type: t('Online', 'অনলাইন') },
    { outlet: t('Climate Home News', 'ক্লাইমেট হোম নিউজ'), title: t('Bangladeshi youth group demands climate reparations at COP29', 'কপ-২৯ সম্মেলনে জলবায়ু ক্ষতিপূরণের দাবি বাংলাদেশি যুব দলের'), date: t('Nov 2024', 'নভেম্বর ২০২৪'), type: t('Online', 'অনলাইন') },
    { outlet: t('Asia Pacific Report', 'এশিয়া প্যাসিফিক রিপোর্ট'), title: t('South Asian youth networks amplify loss and damage demands', 'ক্ষয়ক্ষতি ও ক্ষতিপূরণ দাবি জোরালো করছে দক্ষিণ এশিয়ার যুব নেটওয়ার্কগুলো'), date: t('Dec 2024', 'ডিসেম্বর ২০২৪'), type: t('Online', 'অনলাইন') },
  ];

  const pressKitItems = [
    { title: t('YCN Press Kit 2024', 'ওয়াইসিএন প্রেস কিট ২০২৪'), desc: t('Brand guidelines, logos, key facts, leadership bios', 'ব্র্যান্ড নির্দেশিকা, লোগো, প্রধান তথ্য এবং নেতৃত্বের বিবরণ'), size: t('12 MB', '১২ মেগাবাইট') },
    { title: t('High-Resolution Logos', 'উচ্চ-রেজোলিউশন লোগোসমূহ'), desc: t('PNG, SVG, and PDF formats in all color variants', 'সকল রঙের পিএনজি, এসভিজি এবং পিডিএফ ফরম্যাট লোগো'), size: t('5 MB', '৫ মেগাবাইট') },
    { title: t('Organization Profile — One Pager', 'অর্গানাইজেশন প্রোফাইল — ওয়ান পেজার'), desc: t('One-page overview of YCN for media and partners', 'মিডিয়া ও অংশীদারদের জন্য ওয়াইসিএন-এর এক পৃষ্ঠার রূপরেখা'), size: t('2 MB', '২ মেগাবাইট') },
    { title: t('Impact Photography Collection', 'কার্যক্রমের ছবি সংগ্রহ'), desc: t('50+ high-resolution field photos for editorial use', 'সম্পাদনা ব্যবহারের জন্য ৫০টিরও বেশি মাঠপর্যায়ের ছবি'), size: t('85 MB', '৮৫ মেগাবাইট') },
  ];

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
            ) : videoItems.map((video) => (
              <div key={video.id} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className="relative" style={{ aspectRatio: '16/9' }}>
                  <img src={video.thumbnail || video.url || 'https://via.placeholder.com/400x225?text=Video'} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(10,51,32,0.4)' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: '#E8521A' }}>
                      <Play size={18} color="#fff" fill="#fff" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs text-white font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    {video.duration}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>{t(video.category || '', video.category_bn || video.category || '')}</span>
                  <p className="text-sm font-medium mt-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{t(video.title || '', video.title_bn || video.title || '')}</p>
                </div>
              </div>
            ))}
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
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4">
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
                </div>
                <ExternalLink size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Feed */}
      <section className="py-16" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="flex items-center gap-2 mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#1F2937' }}>
                <span className="text-lg">📱</span> {t('Social Media Feed', 'সোশ্যাল মিডিয়া ফিড')}
              </h2>
              <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {t("Latest from YCN's social channels — follow us for real-time updates", 'ওয়াইসিএন সোশ্যাল পেজের সাম্প্রতিক খবরাখবর — সর্বশেষ আপডেটের জন্য যুক্ত থাকুন')}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="#"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#1877F2', color: '#fff', fontFamily: 'Inter, sans-serif' }}
              >
                <Facebook size={15} /> Facebook
              </a>
              <a
                href="#"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff', fontFamily: 'Inter, sans-serif' }}
              >
                <Instagram size={15} /> Instagram
              </a>
            </div>
          </div>

          {/* Mock social posts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                platform: 'Facebook',
                handle: '@YouthClimateNetworkBD',
                time: t('2 hours ago', '২ ঘণ্টা আগে'),
                content: t(
                  '🌱 Day 2 of our Youth Leadership Academy! 45 young climate champions from 8 districts are learning negotiation, advocacy, and community mobilization skills. Proud of every single one of them. #YCN #ClimateLeaders #Bangladesh',
                  '🌱 আমাদের যুব নেতৃত্ব একাডেমির ২য় দিন! ৮টি জেলার ৪৫ জন তরুণ জলবায়ু চ্যাম্পিয়ন আজ সমঝোতা, অ্যাডভোকেসি ও সামাজিক সংগঠনের দক্ষতা শিখছেন। আমরা তাদের নিয়ে গর্বিত। #YCN #ClimateLeaders #Bangladesh'
                ),
                likes: 284,
                comments: 38,
                shares: 67,
                image: 'https://images.unsplash.com/photo-1573906094214-194b33da6acc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
                color: '#1877F2',
                Icon: Facebook,
              },
              {
                platform: 'Instagram',
                handle: '@ycn_bangladesh',
                time: t('5 hours ago', '৫ ঘণ্টা আগে'),
                content: t(
                  '🌊 The Sundarbans mangroves are fighting for survival — and so are we. Our volunteers planted 2,000 saplings today in Dacope, Khulna. Every tree is a shield for coastal communities against storm surges. 🌿 #Sundarbans #MangroveRestore #ClimateAction',
                  '🌊 সুন্দরবনের ম্যানগ্রোভ অস্তিত্ব রক্ষার লড়াইয়ে লড়ছে — আমরাও লড়ছি। খুলনার দাকোপে আজ আমাদের স্বেচ্ছাসেবকরা ২,০০০ চারা রোপণ করেছেন। প্রতিটি গাছ উপকূলীয় এলাকার মানুষের জন্য একটি ঢালস্বরূপ। 🌿 #Sundarbans #MangroveRestore #ClimateAction'
                ),
                likes: 512,
                comments: 45,
                shares: 89,
                image: 'https://images.unsplash.com/photo-1682778556316-ff439b06a1ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
                color: '#E1306C',
                Icon: Instagram,
              },
              {
                platform: 'Facebook',
                handle: '@YouthClimateNetworkBD',
                time: t('1 day ago', '১ দিন আগে'),
                content: t(
                  '📣 YCN submitted its official position paper on Loss & Damage Finance to the UNFCCC Secretariat ahead of the pre-sessional consultations. Read the full paper on our website. Bangladesh\'s frontline communities deserve justice. #COP30 #LossAndDamage #ClimateJustice',
                  '📣 জলবায়ু পরিবর্তনের ক্ষয়ক্ষতি ও ক্ষতিপূরণ তহবিলের ওপর ওয়াইসিএন তার অফিসিয়াল অবস্থানপত্র ইউএনএফসিসিসি সচিবালয়ে জমা দিয়েছে। আমাদের ওয়েবসাইটে অবস্থানপত্রটি ডাউনলোড করা যাবে। উপকূলীয় মানুষের ন্যায়বিচার প্রাপ্য। #COP30 #LossAndDamage #ClimateJustice'
                ),
                likes: 389,
                comments: 71,
                shares: 134,
                image: 'https://images.unsplash.com/photo-1636304182456-5c25a53856a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
                color: '#1877F2',
                Icon: Facebook,
              },
              {
                platform: 'Instagram',
                handle: '@ycn_bangladesh',
                time: t('2 days ago', '২ দিন আগে'),
                content: t(
                  '💧 Clean water is a human right. Our WASH team just completed installation of 12 arsenic-free tube wells in Shyamnagar, benefiting 840 households. Huge thanks to all volunteers and community members who made this happen! 🙌',
                  '💧 নিরাপদ পানি একটি মৌলিক অধিকার। আমাদের ওয়াশ টিম আজ শ্যামনগরে ১২টি আর্সেনিকমুক্ত টিউবওয়েল স্থাপন সম্পন্ন করেছে, যা ৮৪০টি পরিবারের উপকারে আসবে। স্বেচ্ছাসেবক এবং এলাকাবাসীকে অসংখ্য ধন্যবাদ! 🙌'
                ),
                likes: 467,
                comments: 53,
                shares: 92,
                image: 'https://images.unsplash.com/photo-1582783681787-2503399778d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
                color: '#E1306C',
                Icon: Instagram,
              },
              {
                platform: 'Facebook',
                handle: '@YouthClimateNetworkBD',
                time: t('3 days ago', '৩ দিন আগে'),
                content: t(
                  '☀️ Milestone alert! 500 off-grid families in Khulna\'s coastal belt now have solar home systems through our Renewable Energy program! That\'s 500 families with light, phone charging, and clean energy — a step toward a just transition. 🌍',
                  '☀️ বিরাট সাফল্য! আমাদের নবায়নযোগ্য শক্তি কার্যক্রমের মাধ্যমে খুলনার উপকূলীয় এলাকার ৫০০টি গ্রিড-বহির্ভূত পরিবার এখন সৌর বিদ্যুতের আলো পেয়েছে! ৫০০টি পরিবারে এখন আলো, ফোন চার্জিং এবং বিদ্যুৎ সুবিধা জ্বলজ্বল করছে। 🌍'
                ),
                likes: 621,
                comments: 84,
                shares: 178,
                image: 'https://images.unsplash.com/photo-1758599668360-48ba8ba71b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
                color: '#1877F2',
                Icon: Facebook,
              },
              {
                platform: 'Instagram',
                handle: '@ycn_bangladesh',
                time: t('4 days ago', '৪ দিন আগে'),
                content: t(
                  '👩‍🎓 Meet Rohima — fisherman\'s wife, climate leader, community champion. Through our Women\'s Climate Leadership Program, she now leads a 20-member savings group helping families recover from climate disasters. Stories like hers are why we do this work. ❤️',
                  '👩‍🎓 রহিমা খাতুনের সাথে পরিচিত হোন — মৎস্যজীবীর স্ত্রী, জলবায়ু নেত্রী, সামাজিক চ্যাম্পিয়ন। আমাদের নারীদের জলবায়ু নেতৃত্ব কর্মসূচির মাধ্যমে তিনি এখন ২০ সদস্যের একটি সঞ্চয় দলের নেতৃত্ব দিচ্ছেন যা দুর্যোগ কাটিয়ে উঠতে পরিবারকে সাহায্য করে। তার মতো মানুষদের গল্পই আমাদের কাজের অনুপ্রেরণা। ❤️'
                ),
                likes: 834,
                comments: 97,
                shares: 203,
                image: 'https://images.unsplash.com/photo-1731010228061-c50a53176311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
                color: '#E1306C',
                Icon: Instagram,
              },
            ].map((post, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid #F3F4F6', backgroundColor: '#fff' }}
              >
                {/* Post header */}
                <div className="flex items-center gap-3 p-4 pb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: post.color + '15' }}
                  >
                    <post.Icon size={18} style={{ color: post.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1F2937', fontFamily: 'Inter, sans-serif' }}>{post.handle}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>{post.time} · {post.platform}</p>
                  </div>
                  <a href="#" className="flex-shrink-0">
                    <ExternalLink size={14} style={{ color: '#9CA3AF' }} />
                  </a>
                </div>
                {/* Post image */}
                <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
                {/* Post content */}
                <div className="p-4">
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    {post.content}
                  </p>
                  {/* Engagement */}
                  <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <button className="flex items-center gap-1.5 text-xs transition-all hover:scale-110" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      <ThumbsUp size={14} />
                      {t(post.likes.toLocaleString(), post.likes.toLocaleString().replace(/0/g, '০').replace(/1/g, '১').replace(/2/g, '২').replace(/3/g, '৩').replace(/4/g, '৪').replace(/5/g, '৫').replace(/6/g, '৬').replace(/7/g, '৭').replace(/8/g, '৮').replace(/9/g, '৯'))}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs transition-all hover:scale-110" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      <MessageCircle size={14} />
                      {t(post.comments.toLocaleString(), post.comments.toLocaleString().replace(/0/g, '০').replace(/1/g, '১').replace(/2/g, '২').replace(/3/g, '৩').replace(/4/g, '৪').replace(/5/g, '৫').replace(/6/g, '৬').replace(/7/g, '৭').replace(/8/g, '৮').replace(/9/g, '৯'))}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs transition-all hover:scale-110" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      <Share2 size={14} />
                      {t(post.shares.toLocaleString(), post.shares.toLocaleString().replace(/0/g, '০').replace(/1/g, '১').replace(/2/g, '২').replace(/3/g, '৩').replace(/4/g, '৪').replace(/5/g, '৫').replace(/6/g, '৬').replace(/7/g, '৭').replace(/8/g, '৮').replace(/9/g, '৯'))}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
            >
              {t('View All Social Posts', 'সব সোশ্যাল পোস্ট দেখুন')} <ExternalLink size={14} />
            </a>
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
            <div className="flex flex-wrap gap-4">
              <a href="mailto:media@ycnbd.org" className="text-sm font-medium hover:underline" style={{ color: '#E8521A' }}>media@ycnbd.org</a>
              <span className="text-sm" style={{ color: '#A8C4B0' }}>
                {t('Priya Saha — Communications & Media Manager', 'প্রিয়া সাহা — যোগাযোগ ও মিডিয়া ব্যবস্থাপক')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
