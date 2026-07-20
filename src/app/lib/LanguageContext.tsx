import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextProps {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (enOrKey: string, bn?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const dictionary: Record<string, { en: string; bn: string }> = {
  // Navigation Links
  'Home': { en: 'Home', bn: 'হোম' },
  'About': { en: 'About', bn: 'আমাদের সম্পর্কে' },
  'About YCN': { en: 'About YCN', bn: 'ওয়াইসিএন সম্পর্কে' },
  'Our Work': { en: 'Our Work', bn: 'আমাদের কার্যক্রম' },
  'Impact & Stories': { en: 'Impact & Stories', bn: 'প্রভাব ও গল্প' },
  'Get Involved': { en: 'Get Involved', bn: 'যুক্ত হোন' },
  'Advocacy & Policy': { en: 'Advocacy & Policy', bn: 'অ্যাডভোকেসি ও নীতি' },
  'Media Center': { en: 'Media Center', bn: 'মিডিয়া সেন্টার' },
  'Contact Us': { en: 'Contact Us', bn: 'যোগাযোগ' },
  'Impact': { en: 'Impact', bn: 'প্রভাব' },
  'Stories of Change': { en: 'Stories of Change', bn: 'পরিবর্তনের গল্প' },
  'Advocacy': { en: 'Advocacy', bn: 'অ্যাডভোকেসি' },
  'Media': { en: 'Media', bn: 'মিডিয়া' },
  'Contact': { en: 'Contact', bn: 'যোগাযোগ' },

  // Dropdown Sub-programs
  'Climate Justice': { en: 'Climate Justice', bn: 'জলবায়ু ন্যায়বিচার' },
  'Education & Research': { en: 'Education & Research', bn: 'শিক্ষা ও গবেষণা' },
  'WASH': { en: 'WASH', bn: 'ওয়াশ (WASH)' },
  'Disaster Risk Management': { en: 'Disaster Risk Management', bn: 'দুর্যোগ ঝুঁকি ব্যবস্থাপনা' },
  'Sustainable Livelihoods': { en: 'Sustainable Livelihoods', bn: 'টেকসই জীবিকা' },
  'Renewable Energy': { en: 'Renewable Energy', bn: 'নবায়নযোগ্য শক্তি' },
  'Youth Development': { en: 'Youth Development', bn: 'যুব উন্নয়ন' },
  'Women Empowerment': { en: 'Women Empowerment', bn: 'নারী ক্ষমতায়ন' },
  'Financial Inclusion': { en: 'Financial Inclusion', bn: 'আর্থিক অন্তর্ভুক্তি' },
  'WASH Programs': { en: 'WASH Programs', bn: 'ওয়াশ কার্যক্রম' },
  'Disaster Risk Mgmt': { en: 'Disaster Risk Mgmt', bn: 'দুর্যোগ ঝুঁকি ব্যবস্থাপনা' },

  // Program Card Details
  'Climate Justice & Advocacy': { en: 'Climate Justice & Advocacy', bn: 'জলবায়ু ন্যায়বিচার ও অ্যাডভোকেসি' },
  'Representing frontline youth at UNFCCC/COP and driving systemic policy change.': {
    en: 'Representing frontline youth at UNFCCC/COP and driving systemic policy change.',
    bn: 'ইউএনএফসিসিসি/কপ (UNFCCC/COP) সম্মেলনে ফ্রন্টলাইন যুবকদের প্রতিনিধিত্ব এবং পদ্ধতিগত নীতি পরিবর্তন আনা।'
  },
  'Building climate literacy from classrooms to communities, producing policy-shaping research.': {
    en: 'Building climate literacy from classrooms to communities, producing policy-shaping research.',
    bn: 'শ্রেণীকক্ষ থেকে শুরু করে বিভিন্ন সম্প্রদায়ের জলবায়ু সচেতনতা গড়ে তোলা ও নীতি-নির্ধারণী গবেষণামূলক কাজ পরিচালনা।'
  },
  'Safe drinking water, dignified sanitation, and hygiene education for coastal communities.': {
    en: 'Safe drinking water, dignified sanitation, and hygiene education for coastal communities.',
    bn: 'উপকূলীয় জনগোষ্ঠীর জন্য নিরাপদ খাবার জল, স্বাস্থ্যকর স্যানিটেশন ব্যবস্থা এবং স্বাস্থ্যবিধি শিক্ষার ব্যবস্থা।'
  },
  'Community preparedness and rapid response for climate-induced floods and cyclones.': {
    en: 'Community preparedness and rapid response for climate-induced floods and cyclones.',
    bn: 'জলবায়ু পরিবর্তনের কারণে সৃষ্ট বন্যা এবং ঘূর্ণিঝড়ের জন্য সামাজিক প্রস্তুতি ও দ্রুত সাড়াদান কর্মসূচি।'
  },
  'Climate-smart agriculture, alternative incomes, and resilient food systems.': {
    en: 'Climate-smart agriculture, alternative incomes, and resilient food systems.',
    bn: 'জলবায়ু-সহনশীল কৃষিকাজ, বিকল্প আয়ের উৎস তৈরি এবং টেকসই খাদ্য ব্যবস্থা গড়ে তোলা।'
  },
  'Solar & biogas access for off-grid households while tackling plastic and e-waste.': {
    en: 'Solar & biogas access for off-grid households while tackling plastic and e-waste.',
    bn: 'গ্রিড বহির্ভূত খানাগুলোতে সৌরশক্তি ও বায়োগ্যাস পৌঁছে দেওয়ার পাশাপাশি প্লাস্টিক ও ই-বর্জ্য মোকাবেলা।'
  },

  // Buttons & Actions
  'Join the Movement': { en: 'Join the Movement', bn: 'আন্দোলনে যোগ দিন' },
  'Partner With Us': { en: 'Partner With Us', bn: 'আমাদের অংশীদার হোন' },
  'Donate Now': { en: 'Donate Now', bn: 'অর্থায়ন করুন' },
  'Apply Now': { en: 'Apply Now', bn: 'আবেদন করুন' },
  'Submit Application': { en: 'Submit Application', bn: 'আবেদন জমা দিন' },
  'Submit': { en: 'Submit', bn: 'জমা দিন' },
  'Learn More': { en: 'Learn More', bn: 'আরও জানুন' },
  'Learn more': { en: 'Learn more', bn: 'আরও জানুন' },
  'Read more': { en: 'Read more', bn: 'বিস্তারিত পড়ুন' },
  'View All': { en: 'View All', bn: 'সব দেখুন' },
  'Download Paper': { en: 'Download Paper', bn: 'পেপার ডাউনলোড করুন' },

  // Stats
  'People Reached': { en: 'People Reached', bn: 'মানুষের কাছে পৌঁছেছি' },
  'Trees Planted': { en: 'Trees Planted', bn: 'রোপণকৃত বৃক্ষ' },
  'Volunteers': { en: 'Volunteers', bn: 'স্বেচ্ছাসেবক' },
  'Active Projects': { en: 'Active Projects', bn: 'চলতি প্রকল্পসমূহ' },
  'Partner Orgs': { en: 'Partner Orgs', bn: 'অংশীদার সংস্থা' },
  'Districts': { en: 'Districts', bn: 'জেলাসমূহ' },

  // Newsletter Section
  'Stay Informed': { en: 'Stay Informed', bn: 'যুক্ত থাকুন' },
  'Subscribe for climate updates, advocacy alerts, program news, and event invitations.': {
    en: 'Subscribe for climate updates, advocacy alerts, program news, and event invitations.',
    bn: 'জলবায়ু আপডেট, অ্যাডভোকেসি অ্যালার্ট, প্রোগ্রামের খবর এবং ইভেন্টের আমন্ত্রণের জন্য সাবস্ক্রাইব করুন।'
  },
  'Subscribe Free': { en: 'Subscribe Free', bn: 'ফ্রি সাবস্ক্রাইব করুন' },
  'your@email.com': { en: 'your@email.com', bn: 'আপনার@ইমেইল.কম' },
  "✓ You're subscribed! Thank you for joining.": {
    en: "✓ You're subscribed! Thank you for joining.",
    bn: '✓ আপনি সাবস্ক্রাইব করেছেন! যুক্ত হওয়ার জন্য ধন্যবাদ।'
  },
  'This email is already subscribed.': {
    en: 'This email is already subscribed.',
    bn: 'এই ইমেইলটি ইতিমধ্যে সাবস্ক্রাইব করা হয়েছে।'
  },

  // Footer Titles & Captions
  'Explore': { en: 'Explore', bn: 'অন্বেষণ করুন' },
  'Programs': { en: 'Programs', bn: 'প্রোগ্রামসমূহ' },
  'Get in Touch': { en: 'Get in Touch', bn: 'যোগাযোগ' },
  'Headquarters': { en: 'Headquarters', bn: 'প্রধান কার্যালয়' },
  'Khulna Division, Bangladesh': { en: 'Khulna Division, Bangladesh', bn: 'খুলনা বিভাগ, বাংলাদেশ' },
  'Official Registration': { en: 'Official Registration', bn: 'সরকারি নিবন্ধন' },
  "Govt. of the People's Republic of Bangladesh": {
    en: "Govt. of the People's Republic of Bangladesh",
    bn: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'
  },
  'Department of Youth Development': { en: 'Department of Youth Development', bn: 'যুব উন্নয়ন অধিদপ্তর' },
  'Reg No: DYD/Khulna/Reg-104': { en: 'Reg No: DYD/Khulna/Reg-104', bn: 'নিবন্ধন নং: DYD/Khulna/Reg-104' },
  'Privacy Policy': { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' },
  'Terms of Use': { en: 'Terms of Use', bn: 'ব্যবহারের শর্তাবলী' },
  'All rights reserved.': { en: 'All rights reserved.', bn: 'সর্বস্বত্ব সংরক্ষিত।' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('ycn_lang');
    return (saved === 'bn' ? 'bn' : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('ycn_lang', lang);
    document.documentElement.lang = lang;
    if (lang === 'bn') {
      document.documentElement.classList.add('lang-bn');
    } else {
      document.documentElement.classList.remove('lang-bn');
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLangState((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
  };

  // The translation helper t(enText, bnText) or t(key)
  const t = (enOrKey: string, bn?: string): string => {
    if (bn !== undefined) {
      return lang === 'bn' ? bn : enOrKey;
    }
    const entry = dictionary[enOrKey];
    if (entry) {
      return lang === 'bn' ? entry.bn : entry.en;
    }
    return enOrKey;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
