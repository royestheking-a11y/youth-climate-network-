import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = 'Youth Climate Network',
  description = 'Youth Climate Network is a youth-led organization empowering young people to take action against climate change in Bangladesh and beyond.',
  keywords = 'youth climate network, climate change, bangladesh, youth action, environmental organization, sustainability, climate advocacy',
  image = 'https://res.cloudinary.com/dwyx449il/image/upload/v1/ycn/Asset_1_webp',
  url = 'https://youthclimatenetwork.org',
  type = 'website'
}: SEOProps) {
  const { lang } = useLanguage();

  const formattedTitle = title === 'Youth Climate Network' 
    ? (lang === 'bn' ? 'ইয়ুথ ক্লাইমেট নেটওয়ার্ক' : 'Youth Climate Network')
    : `${title} | ${lang === 'bn' ? 'ইয়ুথ ক্লাইমেট নেটওয়ার্ক' : 'Youth Climate Network'}`;

  const formattedDescription = lang === 'bn' && description.includes('Youth Climate Network is a')
    ? 'ইয়ুথ ক্লাইমেট নেটওয়ার্ক হলো একটি যুব-নেতৃত্বাধীন সংস্থা যা তরুণদের জলবায়ু পরিবর্তনের বিরুদ্ধে কাজ করতে ক্ষমতায়ন করে।'
    : description;

  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={formattedDescription} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={formattedDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={formattedDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
