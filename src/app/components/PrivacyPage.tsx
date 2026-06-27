import { Shield, Eye, Lock, FileText, CheckCircle2, AlertCircle, Heart } from 'lucide-react';
import { SEO } from './ui/SEO';
import { useLanguage } from '../lib/LanguageContext';

export function PrivacyPage() {
  const { t } = useLanguage();
  const lastUpdated = t("May 20, 2026", "২০ মে, ২০২৬");

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>
      <SEO title="Privacy Policy" />
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 50% 50%, #E8521A 0%, transparent 45%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Trust & Transparency', 'বিশ্বাস ও স্বচ্ছতা')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Privacy Policy', 'গোপনীয়তা নীতি')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0' }}>
            {t(
              'At Youth Climate Network, we are dedicated to protecting your personal information and ensuring your trust is protected when working with us for climate advocacy.',
              'ইয়ুথ ক্লাইমেট নেটওয়ার্কে, আমরা আপনার ব্যক্তিগত তথ্য রক্ষা করতে এবং জলবায়ু অ্যাডভোকেসির জন্য আমাদের সাথে কাজ করার সময় আপনার বিশ্বাস বজায় রাখতে প্রতিশ্রুতিবদ্ধ।'
            )}
          </p>
          <p className="mt-4 text-xs font-semibold" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif' }}>
            {t('Last Updated', 'সর্বশেষ আপডেট')}: {lastUpdated}
          </p>
        </div>
      </section>

      {/* SVG Wave Transition */}
      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,40 C360,0 1080,60 1440,20 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-5 rounded-2xl border border-gray-100 flex flex-col gap-3" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                  <Shield size={20} />
                </div>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  {t('Data Protection', 'ডেটা সুরক্ষা')}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  {t('We encrypt and safeguard all volunteer, donor, and member profile details.', 'আমরা সমস্ত স্বেচ্ছাসেবক, দাতা এবং সদস্যের প্রোফাইলের তথ্য এনক্রিপ্ট ও সুরক্ষিত রাখি।')}
                </p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-100 flex flex-col gap-3" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                  <Eye size={20} />
                </div>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  {t('Zero Sharing', 'কোনো শেয়ারিং নেই')}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  {t('We do not sell, rent, or trade your personal information to third-party advertisers.', 'আমরা কোনো তৃতীয় পক্ষের বিজ্ঞাপনদাতার কাছে আপনার ব্যক্তিগত তথ্য বিক্রি, ভাড়া বা বিনিময় করি না।')}
                </p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-100 flex flex-col gap-3" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                  <Lock size={20} />
                </div>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  {t('Your Rights', 'আপনার অধিকার')}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  {t('Easily request details access, account updates, or deletion anytime.', 'যেকোনো সময় সহজেই আপনার তথ্যে প্রবেশ, অ্যাকাউন্ট আপডেট বা মুছে ফেলার অনুরোধ করুন।')}
                </p>
              </div>
            </div>

            {/* Document Sections */}
            <div className="space-y-10" style={{ fontFamily: 'Inter, sans-serif', color: '#4B5563' }}>
              
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <FileText className="text-[#E8521A]" size={20} /> {t('1. Information We Collect', '১. আমরা যে তথ্য সংগ্রহ করি')}
                </h2>
                <p className="text-sm leading-relaxed mb-4">
                  {t(
                    'We collect information that you voluntarily provide to us when you register to volunteer, sign up for campaigns, make donations, or subscribe to YCN newsletters. This includes:',
                    'আপনি যখন স্বেচ্ছাসেবক হিসেবে নিবন্ধন করেন, প্রচারণায় অংশ নেন, অনুদান দেন বা ওয়াইসিএন নিউজলেটারে সাবস্ক্রাইব করেন, তখন স্বেচ্ছায় যে তথ্যগুলো দেন তা আমরা সংগ্রহ করি। এর মধ্যে রয়েছে:'
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    <strong>{t('Personal Information:', 'ব্যক্তিগত তথ্য:')}</strong> {t('Name, email address, phone number, physical address, age, gender, and school or organization.', 'নাম, ইমেইল ঠিকানা, ফোন নম্বর, ঠিকানা, বয়স, লিঙ্গ এবং শিক্ষা প্রতিষ্ঠান বা সংস্থা।')}
                  </li>
                  <li>
                    <strong>{t('Payment Details:', 'পেমেন্টের বিবরণ:')}</strong> {t('For donations or merchandise purchases, payment transactions are handled through secure third-party processors. We do not store credit card details on YCN servers.', 'অনুদান বা কেনাকাটার ক্ষেত্রে পেমেন্টগুলো নিরাপদ তৃতীয় পক্ষের প্রসেসরের মাধ্যমে সম্পন্ন হয়। আমরা আমাদের সার্ভারে কোনো ক্রেডিট কার্ডের তথ্য সংরক্ষণ করি না।')}
                  </li>
                  <li>
                    <strong>{t('Participation Records:', 'অংশগ্রহণের রেকর্ড:')}</strong> {t('Details about workshops, community cleanups, planting drives, or advocacy campaigns you register for or attend.', 'আপনি যে সমস্ত কর্মশালা, সামাজিক পরিচ্ছন্নতা, গাছ রোপণ বা অ্যাডভোকেসি প্রচারণায় অংশ নেন তার বিবরণ।')}
                  </li>
                </ul>
              </div>

              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <CheckCircle2 className="text-[#1A6B3C]" size={20} /> {t('2. How We Use Your Information', '২. আমরা কীভাবে আপনার তথ্য ব্যবহার করি')}
                </h2>
                <p className="text-sm leading-relaxed mb-4">
                  {t(
                    'Your data helps us drive impact and organize climate campaigns effectively across Bangladesh. Specifically, we use it to:',
                    'আপনার তথ্য আমাদের জলবায়ু ক্যাম্পেইনগুলো কার্যকরভাবে পরিচালনা করতে এবং বাংলাদেশে প্রভাব তৈরি করতে সাহায্য করে। বিশেষ করে, আমরা এটি ব্যবহার করি:'
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>{t('Coordinate local climate action campaigns, regional divisions, and volunteer shifts.', 'স্থানীয় জলবায়ু অ্যাকশন ক্যাম্পেইন, আঞ্চলিক শাখা এবং স্বেচ্ছাসেবকদের কাজের সমন্বয় করতে।')}</li>
                  <li>{t('Send urgent climate advocacy notices, petition updates, event announcements, and newsletters.', 'জরুরি জলবায়ু অ্যাডভোকেসি নোটিশ, পিটিশন আপডেট, ইভেন্ট ঘোষণা এবং নিউজলেটার পাঠাতে।')}</li>
                  <li>{t('Process donations, provide official tax-exempt receipts, and deliver registered campaigner packages.', 'অনুদান প্রক্রিয়া সম্পন্ন করতে, অফিশিয়াল রসিদ দিতে এবং নিবন্ধিত ক্যাম্পেইনারদের প্যাকেজ সরবরাহ করতে।')}</li>
                  <li>{t('Analyze volunteer participation patterns to measure the collective impact of YCN campaigns.', 'ওয়াইসিএন প্রচারণার সম্মিলিত প্রভাব পরিমাপ করতে স্বেচ্ছাসেবীদের অংশগ্রহণের ধরণ বিশ্লেষণ করতে।')}</li>
                  <li>{t('Ensure the safety, compliance, and security of all YCN operations and digital platforms.', 'ওয়াইসিএন-এর সমস্ত কার্যক্রম এবং ডিজিটাল প্ল্যাটফর্মের নিরাপত্তা ও সম্মতি নিশ্চিত করতে।')}</li>
                </ul>
              </div>

              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <AlertCircle className="text-amber-600" size={20} /> {t('3. Data Sharing & Third-Party Services', '৩. ডেটা শেয়ারিং এবং তৃতীয় পক্ষের পরিষেবা')}
                </h2>
                <p className="text-sm leading-relaxed mb-3">
                  {t(
                    'We honor your trust. Youth Climate Network will never sell or rent your personal information.',
                    'আমরা আপনার বিশ্বাসকে সম্মান করি। ইয়ুথ ক্লাইমেট নেটওয়ার্ক কখনই আপনার ব্যক্তিগত তথ্য বিক্রি বা ভাড়া দেবে না।'
                  )}
                </p>
                <p className="text-sm leading-relaxed mb-3">
                  {t('We share your data only in the following controlled scenarios:', 'আমরা কেবল নিম্নলিখিত নিয়ন্ত্রিত ক্ষেত্রগুলোতে আপনার ডেটা শেয়ার করি:')}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    <strong>{t('Trusted NGO Affiliates:', 'বিশ্বস্ত এনজিও সহযোগী:')}</strong> {t('Collaborative campaign partners who are contractually obligated to maintain YCN data protection standards.', 'যৌথ প্রচারণার অংশীদার যারা ওয়াইসিএন-এর ডেটা সুরক্ষা মান বজায় রাখতে চুক্তিবদ্ধভাবে বাধ্য।')}
                  </li>
                  <li>
                    <strong>{t('Service Providers:', 'পরিষেবা প্রদানকারী:')}</strong> {t('Secure platform systems that process emails, maintain community directories, or process secure donor payments.', 'নিরাপদ প্ল্যাটফর্ম সিস্টেম যা ইমেইল প্রসেস করে, কমিউনিটি ডিরেক্টরি বজায় রাখে বা দাতার পেমেন্ট পরিচালনা করে।')}
                  </li>
                  <li>
                    <strong>{t('Legal Requirement:', 'আইনি প্রয়োজনীয়তা:')}</strong> {t("When required by Bangladesh national law to protect active community safety, comply with registration standards, or address security issues.", 'জননিরাপত্তা রক্ষা, সরকারি নিবন্ধন মান বজায় রাখা বা আইনি জটিলতা নিরসনে বাংলাদেশের আইন দ্বারা বাধ্য হলে।')}
                  </li>
                </ul>
              </div>

              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <Lock className="text-blue-600" size={20} /> {t('4. Data Security & Storage', '৪. ডেটা নিরাপত্তা ও সংরক্ষণ')}
                </h2>
                <p className="text-sm leading-relaxed mb-3">
                  {t(
                    'We use advanced organizational, administrative, and technological safety measures to keep your data secure. Standard web encryption protocol (SSL) secures all submissions, data transfer flows, and back-end directories.',
                    'আপনার ডেটা সুরক্ষিত রাখতে আমরা উন্নত সাংগঠনিক, প্রশাসনিক এবং প্রযুক্তিগত নিরাপত্তা ব্যবস্থা ব্যবহার করি। স্ট্যান্ডার্ড ওয়েব এনক্রিপশন প্রোটোকল (SSL) আমাদের সমস্ত সাবমিশন, ডেটা স্থানান্তর প্রবাহ এবং ব্যাক-এন্ড ডিরেক্টরিগুলোকে সুরক্ষিত রাখে।'
                  )}
                </p>
                <p className="text-sm leading-relaxed">
                  {t(
                    'Data is retained only as long as you remain an active volunteer, campaigner, or donor with YCN, or as necessary for legal audits and reporting.',
                    'আপনি যতদিন ওয়াইসিএন-এর একজন সক্রিয় স্বেচ্ছাসেবক, ক্যাম্পেইনার বা দাতা থাকবেন, অথবা আইনি অডিট ও রিপোর্টিংয়ের জন্য যতদিন প্রয়োজন হবে, কেবল ততদিনই আপনার তথ্য সংরক্ষণ করা হবে।'
                  )}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <Heart className="text-[#E8521A]" size={20} /> {t('5. Your Choices & Rights', '৫. আপনার পছন্দ ও অধিকার')}
                </h2>
                <p className="text-sm leading-relaxed mb-4">
                  {t('You retain complete authority over your personal information. You have the right to:', 'আপনার ব্যক্তিগত তথ্যের ওপর আপনার সম্পূর্ণ অধিকার রয়েছে। আপনার অধিকারগুলো হলো:')}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm mb-6">
                  <li>{t('Opt out of newsletters or volunteer SMS notifications at any time by clicking the "unsubscribe" link.', 'যেকোনো সময় নিউজলেটার বা স্বেচ্ছাসেবক এসএমএস নোটিফিকেশন থেকে নিজেকে প্রত্যাহার করতে "আনসাবস্ক্রাইব" লিঙ্কে ক্লিক করুন।')}</li>
                  <li>{t('Request a full copy of the data YCN holds about your profile or volunteer service records.', 'ওয়াইসিএন-এর কাছে আপনার প্রোফাইল বা স্বেচ্ছাসেবামূলক কাজের যে সমস্ত তথ্য রয়েছে তার একটি অনুলিপি অনুরোধ করতে পারেন।')}</li>
                  <li>{t('Request the immediate, permanent correction or deletion of your profile database details.', 'আপনার প্রোফাইলের তথ্য অবিলম্বে সংশোধন বা স্থায়ীভাবে মুছে ফেলার অনুরোধ করতে পারেন।')}</li>
                </ul>
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    <strong>{t('Questions or Requests?', 'যেকোনো প্রশ্ন বা অনুরোধ?')}</strong> {t("Please contact YCN's dedicated Data Protection Lead at", 'অনুগ্রহ করে ওয়াইসিএন-এর ডেটা সুরক্ষা প্রধানের সাথে যোগাযোগ করুন এই ইমেইলে:')} <a href="mailto:privacy@ycnbd.org" className="underline font-semibold hover:text-[#E8521A]">privacy@ycnbd.org</a> {t('or visit our central office in Khulna Division, Bangladesh.', 'অথবা আমাদের বাংলাদেশের খুলনা বিভাগের প্রধান কার্যালয়ে সরাসরি যোগাযোগ করুন।')}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
