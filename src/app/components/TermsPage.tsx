import { Scale, FileText, CheckCircle2, UserCheck, AlertTriangle, HelpCircle } from 'lucide-react';
import { SEO } from './ui/SEO';
import { useLanguage } from '../lib/LanguageContext';

export function TermsPage() {
  const { t } = useLanguage();
  const lastUpdated = t("May 20, 2026", "২০ মে, ২০২৬");

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>
      <SEO title="Terms of Service" />
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 50% 50%, #E8521A 0%, transparent 45%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('YCN Operations Guide', 'ওয়াইসিএন পরিচালনা নির্দেশিকা')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Terms of Use', 'ব্যবহারের শর্তাবলী')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0' }}>
            {t(
              'Please read these terms carefully before participating in Youth Climate Network campaigns, registering as a volunteer, or using our websites.',
              'অনুগ্রহ করে ইয়ুথ ক্লাইমেট নেটওয়ার্কের প্রচারণায় অংশ নেওয়ার, স্বেচ্ছাসেবক হিসেবে নিবন্ধন করার বা আমাদের ওয়েবসাইট ব্যবহার করার আগে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।'
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
                  <UserCheck size={20} />
                </div>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  {t('Volunteer Code', 'স্বেচ্ছাসেবক কোড')}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  {t('Every YCN campaigner agrees to respectful community advocacy guidelines.', 'প্রতিটি ওয়াইসিএন ক্যাম্পেইনার পারস্পরিক শ্রদ্ধাশীল সামাজিক অ্যাডভোকেসি নির্দেশিকা মেনে চলতে সম্মত হন।')}
                </p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-100 flex flex-col gap-3" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                  <Scale size={20} />
                </div>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  {t('Content Rights', 'বিষয়বস্তুর অধিকার')}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  {t('YCN campaign resources, reports, and imagery are free for educational use.', 'ওয়াইসিএন-এর ক্যাম্পেইন উপকরণ, রিপোর্ট এবং ছবি শিক্ষামূলক ব্যবহারের জন্য সম্পূর্ণ উন্মুক্ত।')}
                </p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-100 flex flex-col gap-3" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                  <HelpCircle size={20} />
                </div>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  {t('Safe Donations', 'নিরাপদ অনুদান')}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  {t('Secure transactions with clear receipt auditing for every single donation.', 'প্রতিটি অনুদানের জন্য স্বচ্ছ রসিদ এবং নিরাপদ লেনদেন ব্যবস্থা নিশ্চিত করা হয়।')}
                </p>
              </div>
            </div>

            {/* Document Sections */}
            <div className="space-y-10" style={{ fontFamily: 'Inter, sans-serif', color: '#4B5563' }}>
              
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <FileText className="text-[#E8521A]" size={20} /> {t('1. Acceptance of Terms', '১. শর্তাবলীর স্বীকৃতি')}
                </h2>
                <p className="text-sm leading-relaxed mb-3">
                  {t(
                    "By accessing ycnbd.org or registering as a volunteer or donor, you agree to comply with and be bound by these Terms of Use and all applicable laws of the People's Republic of Bangladesh.",
                    'ycnbd.org ওয়েবসাইটে প্রবেশ করে অথবা একজন স্বেচ্ছাসেবক বা দাতা হিসেবে নিবন্ধন করে, আপনি এই ব্যবহারের শর্তাবলী এবং গণপ্রজাতন্ত্রী বাংলাদেশের সমস্ত প্রযোজ্য আইন মেনে চলতে সম্মত হন।'
                  )}
                </p>
                <p className="text-sm leading-relaxed">
                  {t(
                    'If you do not agree to these terms, please do not utilize our digital platforms or register for official YCN campaigns.',
                    'যদি আপনি এই শর্তাবলীতে একমত না হন, তবে অনুগ্রহ করে আমাদের ডিজিটাল প্ল্যাটফর্ম ব্যবহার করবেন না বা ওয়াইসিএন-এর অফিসিয়াল প্রচারণায় নিবন্ধন করবেন না।'
                  )}
                </p>
              </div>

              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <UserCheck className="text-[#1A6B3C]" size={20} /> {t('2. Volunteer & Campaigner Code of Conduct', '২. স্বেচ্ছাসেবক ও ক্যাম্পেইনারদের আচরণবিধি')}
                </h2>
                <p className="text-sm leading-relaxed mb-4">
                  {t(
                    'Youth Climate Network is built on respect, inclusivity, and non-violent environmental advocacy. All registered volunteers must adhere to the following principles:',
                    'ইয়ুথ ক্লাইমেট নেটওয়ার্ক পারস্পরিক শ্রদ্ধা, অন্তর্ভুক্তি এবং অহিংস পরিবেশগত অ্যাডভোকেসির ওপর ভিত্তি করে গড়ে উঠেছে। সমস্ত নিবন্ধিত স্বেচ্ছাসেবকদের নিম্নলিখিত নীতিগুলো মেনে চলতে হবে:'
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    <strong>{t('Respectful Interaction:', 'শ্রদ্ধাশীল আচরণ:')}</strong> {t('Treat fellow volunteers, community members, and public officials with dignity and respect. Any form of harassment, discrimination, or hate speech will lead to instant termination.', 'সহকর্মী স্বেচ্ছাসেবক, সমাজের অন্যান্য মানুষ এবং সরকারি কর্মকর্তাদের সাথে মর্যাদাপূর্ণ ও শ্রদ্ধাশীল আচরণ করুন। যেকোনো ধরণের হয়রানি, বৈষম্য বা উস্কানিমূলক বক্তব্য অবিলম্বে বহিষ্কারের কারণ হবে।')}
                  </li>
                  <li>
                    <strong>{t('Representing YCN:', 'ওয়াইসিএন-এর প্রতিনিধিত্ব:')}</strong> {t('You may not issue press releases, enter into official agreements, or speak to national media on behalf of YCN without written permission from the Board of Directors.', 'পরিচালনা পর্ষদের লিখিত অনুমতি ছাড়া ওয়াইসিএন-এর পক্ষ থেকে কোনো প্রেস রিলিজ প্রকাশ, চুক্তি সম্পাদন বা জাতীয় গণমাধ্যমে কথা বলা যাবে না।')}
                  </li>
                  <li>
                    <strong>{t('Safety First:', 'নিরাপত্তাই প্রথম:')}</strong> {t('Prioritize physical safety at coastal cleanup drives, tree plantings, or policy advocacy meetings. Comply with instructions given by YCN Regional Division Coordinators.', 'উপকূলীয় পরিচ্ছন্নতা অভিযান, বৃক্ষরোপণ বা নীতি নির্ধারণী মিটিংগুলোতে শারীরিক নিরাপত্তাকে সর্বোচ্চ অগ্রাধিকার দিন। ওয়াইসিএন-এর আঞ্চলিক সমন্বয়কারীদের দেওয়া নির্দেশাবলী মেনে চলুন।')}
                  </li>
                </ul>
              </div>

              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <Scale className="text-amber-600" size={20} /> {t('3. Intellectual Property Rights', '৩. বুদ্ধিবৃত্তিক সম্পত্তির অধিকার')}
                </h2>
                <p className="text-sm leading-relaxed mb-3">
                  {t(
                    'All digital assets, logos, design code, articles, advocacy reports, and photographs published on YCN platforms are owned by Youth Climate Network, unless specified otherwise.',
                    'অন্য কোনো ঘোষণা না থাকলে, ওয়াইসিএন প্ল্যাটফর্মে প্রকাশিত সমস্ত ডিজিটাল কন্টেন্ট, লোগো, ডিজাইন কোড, আর্টিকেল, অ্যাডভোকেসি রিপোর্ট এবং ছবি ইয়ুথ ক্লাইমেট নেটওয়ার্কের মালিকানাধীন।'
                  )}
                </p>
                <p className="text-sm leading-relaxed">
                  <strong>{t('Permissible Use:', 'অনুমতিযোগ্য ব্যবহার:')}</strong> {t('You are encouraged to print, share, or download YCN climate advocacy materials, brochures, and research papers for non-commercial educational purposes, provided you credit "Youth Climate Network" as the source.', 'অবাণিজ্যিক শিক্ষামূলক উদ্দেশ্যে ওয়াইসিএন-এর জলবায়ু অ্যাডভোকেসি উপকরণ, ব্রোশিওর এবং গবেষণা পত্রগুলো প্রিন্ট করতে, শেয়ার করতে বা ডাউনলোড করতে উৎসাহিত করা হচ্ছে, তবে উৎস হিসেবে "ইয়ুথ ক্লাইমেট নেটওয়ার্ক" উল্লেখ করতে হবে।')}
                </p>
              </div>

              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <CheckCircle2 className="text-blue-600" size={20} /> {t('4. Donor Commitments & Refund Policy', '৪. দাতার প্রতিশ্রুতি ও রিফান্ড নীতি')}
                </h2>
                <p className="text-sm leading-relaxed mb-3">
                  {t(
                    'All donations processed through the YCN website support climate resilience and youth training initiatives in Bangladesh. YCN is fully audited and registered under registration number DYD/Khulna/Reg-104.',
                    'ওয়াইসিএন ওয়েবসাইটের মাধ্যমে প্রাপ্ত সমস্ত অনুদান বাংলাদেশে জলবায়ু সহনশীলতা এবং তরুণদের প্রশিক্ষণ কার্যক্রমে ব্যবহৃত হয়। ওয়াইসিএন সম্পূর্ণরূপে অডিটকৃত এবং নিবন্ধন নম্বর DYD/Khulna/Reg-104 এর অধীনে নিবন্ধিত।'
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    <strong>{t('Donation Purpose:', 'অনুদিনের উদ্দেশ্য:')}</strong> {t('Funds will be directed to designated YCN projects (e.g. tree plantations, WASH services, coastal youth centers).', 'তহবিল সরাসরি নির্দিষ্ট ওয়াইসিএন প্রকল্পে ব্যবহৃত হবে (যেমন বৃক্ষরোপণ, ওয়াশ কার্যক্রম, উপকূলীয় যুব কেন্দ্র)।')}
                  </li>
                  <li>
                    <strong>{t('Receipts:', 'রসিদসমূহ:')}</strong> {t("Donors will receive a formal digital donation receipt containing YCN's official registration license and details.", 'দাতাগণ ওয়াইসিএন-এর অফিসিয়াল নিবন্ধন লাইসেন্স এবং বিবরণ সম্বলিত একটি ডিজিটাল অনুদান রসিদ পাবেন।')}
                  </li>
                  <li>
                    <strong>{t('Refund Policy:', 'রিফান্ড নীতি:')}</strong> {t('If a donation was made in error, please contact YCN finance within 7 working days at youthclimatenetworkbd@gmail.com to request a review and refund.', 'যদি ভুলবশত অনুদান দেওয়া হয়ে থাকে, তবে অনুগ্রহ করে ৭ কার্যদিবসের মধ্যে ওয়াইসিএন ফাইন্যান্স বিভাগে youthclimatenetworkbd@gmail.com ইমেইলে রিফান্ড ও পর্যালোচনার জন্য অনুরোধ করুন।')}
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                  <AlertTriangle className="text-[#E8521A]" size={20} /> {t('5. Limitation of Liability & Governance', '৫. দায়বদ্ধতার সীমাবদ্ধতা ও পরিচালনা')}
                </h2>
                <p className="text-sm leading-relaxed mb-4">
                  {t(
                    'Youth Climate Network strives to provide accurate environmental data and policy updates. However, we do not guarantee the completeness or absolute timeliness of external links or resources.',
                    'ইয়ুথ ক্লাইমেট নেটওয়ার্ক সঠিক পরিবেশগত তথ্য ও পলিসি আপডেট দিতে সচেষ্ট। তবে, আমরা বাইরের কোনো লিঙ্ক বা রিসোর্সের সম্পূর্ণতা বা সঠিকতার গ্যারান্টি দেই না।'
                  )}
                </p>
                <p className="text-sm leading-relaxed mb-4">
                  {t(
                    'These Terms of Use shall be governed by, construed, and enforced in accordance with the laws of Bangladesh. Any dispute arising from these terms shall be subject to the exclusive jurisdiction of the courts located in Khulna Division, Bangladesh.',
                    'এই ব্যবহারের শর্তাবলী বাংলাদেশের আইন দ্বারা পরিচালিত ও নিয়ন্ত্রিত হবে। এই শর্তাবলী থেকে উদ্ভূত যেকোনো বিরোধ খুলনা বিভাগ, বাংলাদেশের আদালতের একচেটিয়া এখতিয়ারের অধীন হবে।'
                  )}
                </p>
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    <strong>{t('Have Questions About YCN Terms?', 'ওয়াইসিএন শর্তাবলী সম্পর্কে প্রশ্ন আছে?')}</strong> {t('Get in touch with our legal compliance lead at', 'আমাদের আইনি প্রধানের সাথে এই ইমেইলে যোগাযোগ করুন:')} <a href="mailto:youthclimatenetworkbd@gmail.com" className="underline font-semibold hover:text-[#E8521A]">youthclimatenetworkbd@gmail.com</a>.
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
