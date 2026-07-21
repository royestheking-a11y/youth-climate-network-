import { useState } from 'react';
import { SEO } from './ui/SEO';

import { HandCoins, Users, Briefcase, Handshake, CheckCircle, ArrowRight } from 'lucide-react';
import { addVolunteerApp, addPartnershipInquiry, addInternshipApp } from '../lib/storage';
import { useLanguage } from '../lib/LanguageContext';

type Tab = 'volunteer' | 'internship' | 'partner';

export function GetInvolvedPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('volunteer');
  const [volSuccess, setVolSuccess] = useState(false);
  const [partSuccess, setPartSuccess] = useState(false);
  const [internSuccess, setInternSuccess] = useState(false);


  const [volForm, setVolForm] = useState({ name: '', email: '', phone: '', interest: '', skills: '', message: '' });

  const [partForm, setPartForm] = useState({ name: '', org: '', email: '', phone: '', type: '', message: '' });
  const [internForm, setInternForm] = useState({ name: '', email: '', phone: '', program: '', university: '', skills: '', message: '' });

  const tabs: { key: Tab; label: string; icon: React.FC<{ size?: number; style?: React.CSSProperties }> }[] = [
    { key: 'volunteer', label: t('Volunteer', 'স্বেচ্ছাসেবক'), icon: Users },
    { key: 'internship', label: t('Internship / Academy', 'ইন্টার্নশিপ / একাডেমি'), icon: Briefcase },

    { key: 'partner', label: t('Partner With Us', 'অংশীদারিত্ব'), icon: Handshake },
  ];

  const volunteerAreas = [
    t('Climate Justice & Advocacy', 'জলবায়ু ন্যায়বিচার ও অ্যাডভোকেসি'),
    t('Education & Research', 'শিক্ষা ও গবেষণা'),
    t('WASH Program', 'পানি, স্যানিটেশন ও স্বাস্থ্যবিধি (WASH)'),
    t('Disaster Response', 'দুর্যোগ প্রস্তুতি ও প্রতিক্রিয়া'),
    t('Renewable Energy', 'নবায়নযোগ্য শক্তি'),
    t('Youth Leadership', 'যুব নেতৃত্ব ও উন্নয়ন'),
    t('Women Empowerment', 'নারী ক্ষমতায়ন ও অধিকার'),
    t('Communications & Media', 'যোগাযোগ ও গণমাধ্যম'),
    t('Finance & Admin', 'অর্থ ও প্রশাসন'),
    t('Field Coordination', 'মাঠপর্যায়ের সমন্বয়'),
  ];



  const handleVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    addVolunteerApp(volForm);
    setVolSuccess(true);
    setVolForm({ name: '', email: '', phone: '', interest: '', skills: '', message: '' });
    setTimeout(() => setVolSuccess(false), 6000);
  };



  const handlePartner = (e: React.FormEvent) => {
    e.preventDefault();
    addPartnershipInquiry(partForm);
    setPartSuccess(true);
    setPartForm({ name: '', org: '', email: '', phone: '', type: '', message: '' });
    setTimeout(() => setPartSuccess(false), 6000);
  };

  const handleInternship = (e: React.FormEvent) => {
    e.preventDefault();
    addInternshipApp(internForm);
    setInternSuccess(true);
    setInternForm({ name: '', email: '', phone: '', program: '', university: '', skills: '', message: '' });
    setTimeout(() => setInternSuccess(false), 6000);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";
  const inputStyle = {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    color: '#1F2937',
    fontFamily: 'Inter, sans-serif',
  };
  const inputFocusStyle = { border: '1px solid #1A6B3C' };

  return (
    <div>
      <SEO 
        title="Get Involved" 
        description="Join the Youth Climate Network as a volunteer, partner, or advocate. Take real action towards climate solutions and become an environmental leader."
        keywords="volunteer youth climate network, climate action volunteer, environmental partnership, join climate ngo, become climate advocate"
      />
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 70% 50%, #E8521A 0%, transparent 45%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Take Action', 'পদক্ষেপ নিন')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Get Involved', 'আমাদের সাথে যুক্ত হোন')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.05rem' }}>
            {t(
              'Whether you volunteer your time, contribute financially, join our Youth Leadership Academy, or partner with us — every action drives climate justice forward.',
              'আপনি স্বেচ্ছাসেবী হিসেবে সময় দিন, আর্থিক অবদান রাখুন, যুব নেতৃত্ব একাডেমিতে যোগ দিন, কিংবা আমাদের অংশীদার হোন — আপনার প্রতিটি কাজ জলবায়ু ন্যায়বিচারকে ত্বরান্বিত করবে।'
            )}
          </p>
        </div>
      </section>

      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,20 C360,60 1080,0 1440,40 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      {/* Why get involved */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: t('Join the Network', 'নেটওয়ার্কে যোগ দিন'), desc: t('Connect with 850+ youth climate advocates across Bangladesh and South Asia.', 'বাংলাদেশ ও দক্ষিণ এশিয়ার ৮৫০ জনেরও বেশি জলবায়ু যুব কর্মীদের সাথে সংযুক্ত হোন।'), color: '#1A6B3C', bg: '#E8F5EE' },
              { icon: HandCoins, title: t('Make Real Impact', 'প্রকৃত প্রভাব ফেলুন'), desc: t('Your support directly reaches frontline communities facing climate devastation.', 'আপনার অবদান সরাসরি জলবায়ু ধ্বংসের মুখোমুখি উপকূলীয় এবং প্রান্তিক মানুষের কাছে পৌঁছায়।'), color: '#E8521A', bg: '#FFF3EE' },
              { icon: Briefcase, title: t('Build Your Skills', 'দক্ষতা তৈরি করুন'), desc: t('Gain hands-on experience in climate advocacy, community development, and leadership.', 'জলবায়ু অ্যাডভোকেসি, সামাজিক উন্নয়ন এবং নেতৃত্বে বাস্তব অভিজ্ঞতা অর্জন করুন।'), color: '#0E7490', bg: '#E0F7FA' },
              { icon: Handshake, title: t('Collaborate Globally', 'বৈশ্বিকভাবে কাজ করুন'), desc: t('Work alongside UN agencies, INGOs, and youth networks across Asia Pacific.', 'জাতিসংঘের বিভিন্ন সংস্থা, আইএনজিও এবং এশিয়া প্যাসিফিক অঞ্চলের যুব নেটওয়ার্কের সাথে একসাথে কাজ করুন।'), color: '#7B1FA2', bg: '#F3E5F5' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl text-center" style={{ backgroundColor: bg }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: color }}>
                  <Icon size={22} color="#fff" />
                </div>
                <h4 className="font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Tab nav */}
          <div
            className="flex rounded-2xl p-1.5 mb-10 overflow-x-auto"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center whitespace-nowrap"
                style={{
                  backgroundColor: activeTab === key ? '#0A3320' : 'transparent',
                  color: activeTab === key ? '#F0ECD8' : '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* VOLUNTEER TAB */}
          {activeTab === 'volunteer' && (
            <div>
              <h2 className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' }}>
                {t('Volunteer With YCN', 'স্বেচ্ছাসেবক হিসেবে যোগ দিন')}
              </h2>
              <p className="mb-8 text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'Join our volunteer network and contribute your skills to climate justice work across Bangladesh. We welcome volunteers of all backgrounds, from field coordination to digital communications.',
                  'আমাদের স্বেচ্ছাসেবক নেটওয়ার্কে যোগ দিন এবং বাংলাদেশ জুড়ে জলবায়ু ন্যায়বিচারের কাজে আপনার দক্ষতা অবদান রাখুন। আমরা সকল ব্যাকগ্রাউন্ডের স্বেচ্ছাসেবকদের স্বাগত জানাই।'
                )}
              </p>
              {volSuccess ? (
                <div className="text-center py-16">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#1A6B3C' }} />
                  <h3 className="font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                    {t('Application Submitted!', 'আবেদন সফলভাবে জমা হয়েছে!')}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {t(
                      'Thank you for your interest in volunteering with YCN. Our team will review your application and contact you within 5 business days.',
                      'ওয়াইসিএন-এর সাথে স্বেচ্ছাসেবক হিসেবে আগ্রহ প্রকাশের জন্য আপনাকে ধন্যবাদ। আমাদের টিম আপনার আবেদনটি পর্যালোচনা করবে এবং ৫ কার্যদিবসের মধ্যে যোগাযোগ করবে।'
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVolunteer} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Full Name *', 'পূর্ণ নাম *')}
                      </label>
                      <input
                        className={inputCls}
                        style={inputStyle}
                        value={volForm.name}
                        onChange={e => setVolForm(f => ({ ...f, name: e.target.value }))}
                        onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={e => Object.assign(e.target.style, { border: '1px solid #E5E7EB' })}
                        placeholder={t("Your full name", "আপনার পূর্ণ নাম লিখুন")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Email Address *', 'ইমেইল ঠিকানা *')}
                      </label>
                      <input
                        type="email"
                        className={inputCls}
                        style={inputStyle}
                        value={volForm.email}
                        onChange={e => setVolForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Phone Number', 'ফোন নম্বর')}
                      </label>
                      <input
                        className={inputCls}
                        style={inputStyle}
                        value={volForm.phone}
                        onChange={e => setVolForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+880 XXX XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Area of Interest *', 'আগ্রহের ক্ষেত্র *')}
                      </label>
                      <select
                        className={inputCls}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        value={volForm.interest}
                        onChange={e => setVolForm(f => ({ ...f, interest: e.target.value }))}
                        required
                      >
                        <option value="">{t('Select a program area', 'একটি প্রোগ্রাম ক্ষেত্র নির্বাচন করুন')}</option>
                        {volunteerAreas.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {t('Your Skills & Background', 'আপনার দক্ষতা ও ব্যাকগ্রাউন্ড')}
                    </label>
                    <input
                      className={inputCls}
                      style={inputStyle}
                      value={volForm.skills}
                      onChange={e => setVolForm(f => ({ ...f, skills: e.target.value }))}
                      placeholder={t("E.g. research, data analysis, community outreach, social media...", "যেমন: গবেষণা, সামাজিক কাজ, মিডিয়া, ডিজাইন ইত্যাদি")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {t('Why do you want to volunteer with YCN?', 'আপনি কেন ওয়াইসিএন-এর সাথে যুক্ত হতে চান?')}
                    </label>
                    <textarea
                      className={inputCls}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      rows={4}
                      value={volForm.message}
                      onChange={e => setVolForm(f => ({ ...f, message: e.target.value }))}
                      placeholder={t("Tell us about your motivation...", "আপনার প্রেরণা এবং আপনি কীভাবে ভূমিকা রাখতে পারেন তা জানান...")}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01]"
                    style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                  >
                    {t('Submit Volunteer Application', 'স্বেচ্ছাসেবক আবেদন জমা দিন')}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* INTERNSHIP TAB */}
          {activeTab === 'internship' && (
            <div>
              <h2 className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' }}>
                {t('Internship & Youth Academy', 'ইন্টার্নশিপ ও যুব একাডেমি')}
              </h2>
              <p className="mb-8 text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'YCN offers structured internships across all program areas and our flagship Youth Leadership Academy for aspiring climate leaders aged 18–30.',
                  'ওয়াইসিএন ১৮-৩০ বছর বয়সী ভবিষ্যৎ জলবায়ু নেতাদের জন্য সকল প্রোগ্রাম ক্ষেত্রে ইন্টার্নশিপ এবং আমাদের ফ্ল্যাগশিপ যুব নেতৃত্ব একাডেমি অফার করে।'
                )}
              </p>
              {internSuccess ? (
                <div className="text-center py-16">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#1A6B3C' }} />
                  <h3 className="font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                    {t('Application Received!', 'আবেদন প্রাপ্ত হয়েছে!')}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {t(
                      'Thank you for applying to the YCN Internship/Academy program. Our team will review your application and get back to you soon.',
                      'ওয়াইসিএন প্রোগ্রামে আবেদন করার জন্য ধন্যবাদ। আমাদের টিম আপনার আবেদন পর্যালোচনা করে শীঘ্রই যোগাযোগ করবে।'
                    )}
                  </p>
                  <button onClick={() => setInternSuccess(false)} className="mt-6 px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ backgroundColor: '#0A3320', color: '#F0ECD8' }}>
                    {t('Apply for Another Program', 'অন্য প্রোগ্রামে আবেদন করুন')}
                  </button>
                </div>
              ) : internForm.program ? (
                <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{t('Application Form', 'আবেদন ফর্ম')}</h3>
                      <p className="text-sm" style={{ color: '#E8521A', fontWeight: 600 }}>{internForm.program}</p>
                    </div>
                    <button onClick={() => setInternForm(f => ({...f, program: ''}))} className="text-sm font-semibold hover:underline" style={{ color: '#6B7280' }}>
                      {t('Cancel', 'বাতিল করুন')}
                    </button>
                  </div>
                  <form onSubmit={handleInternship} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Full Name *', 'পূর্ণ নাম *')}</label>
                        <input className={inputCls} style={inputStyle} value={internForm.name} onChange={e => setInternForm(f => ({ ...f, name: e.target.value }))} placeholder={t("Your full name", "আপনার পূর্ণ নাম")} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Email Address *', 'ইমেইল ঠিকানা *')}</label>
                        <input type="email" className={inputCls} style={inputStyle} value={internForm.email} onChange={e => setInternForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Phone Number', 'ফোন নম্বর')}</label>
                        <input className={inputCls} style={inputStyle} value={internForm.phone} onChange={e => setInternForm(f => ({ ...f, phone: e.target.value }))} placeholder="+880 XXX XXXXXXX" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('University / Institution *', 'বিশ্ববিদ্যালয় / শিক্ষাপ্রতিষ্ঠান *')}</label>
                        <input className={inputCls} style={inputStyle} value={internForm.university} onChange={e => setInternForm(f => ({ ...f, university: e.target.value }))} placeholder={t("Where do you study?", "কোথায় পড়াশোনা করছেন?")} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Relevant Skills & Background', 'প্রাসঙ্গিক দক্ষতা ও ব্যাকগ্রাউন্ড')}</label>
                      <input className={inputCls} style={inputStyle} value={internForm.skills} onChange={e => setInternForm(f => ({ ...f, skills: e.target.value }))} placeholder={t("e.g. Research, Graphic Design", "উদাঃ গবেষণা, গ্রাফিক ডিজাইন")} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Why do you want to join? *', 'কেন যুক্ত হতে চান? *')}</label>
                      <textarea className={inputCls} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={internForm.message} onChange={e => setInternForm(f => ({ ...f, message: e.target.value }))} placeholder={t("Tell us about your motivation...", "আপনার আগ্রহের কথা আমাদের জানান...")} required />
                    </div>
                    <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01]" style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}>
                      {t('Submit Application', 'আবেদন জমা দিন')}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                      {
                        title: t('Youth Leadership Academy', 'যুব নেতৃত্ব একাডেমি'),
                        badge: t('Flagship Program', 'ফ্ল্যাগশিপ প্রোগ্রাম'),
                        badgeColor: '#E8521A',
                        duration: t('6 months · Intensive training', '৬ মাস · নিবিড় বহুমুখী প্রশিক্ষণ'),
                        desc: t(
                          'Our flagship leadership development program covering climate science, community organizing, policy advocacy, digital communications, and social entrepreneurship. 60 places annually for youth aged 18–30.',
                          'আমাদের প্রধান নেতৃত্ব বিকাশ কর্মসূচী যা জলবায়ু বিজ্ঞান, সামাজিক সংগঠন, নীতি অ্যাডভোকেসি, ডিজিটাল যোগাযোগ এবং সামাজিক উদ্যোক্তা কভার করে। প্রতি বছর ১৮-৩০ বছর বয়সীদের জন্য ৬০টি আসন।'
                        ),
                        requirements: [
                          t('Aged 18–30', 'বয়স ১৮-৩০ বছর'),
                          t('Commit to 3 days/week minimum', 'সপ্তাহে কমপক্ষে ৩ দিন সময় দিতে হবে'),
                          t('Basic English or Bangla literacy', 'প্রাথমিক ইংরেজি বা বাংলা সাক্ষরতা'),
                          t('Passion for climate justice', 'জলবায়ু ন্যায়বিচারের প্রতি আগ্রহ'),
                        ],
                      },
                      {
                        title: t('Program Internships', 'প্রোগ্রাম ইন্টার্নশিপ'),
                        badge: t('3–6 months', '৩–৬ মাস'),
                        badgeColor: '#1A6B3C',
                        duration: t('Flexible · 3–5 days per week', 'নমনীয় সময় · সপ্তাহে ৩–৫ দিন'),
                        desc: t(
                          'Hands-on internships across all 15 program pillars — from field coordination and research to communications and advocacy. Ideal for university students and recent graduates.',
                          'ফিল্ড কোঅর্ডিনেশন ও গবেষণা থেকে শুরু করে মিডিয়া এবং অ্যাডভোকেসি — আমাদের সকল কার্যক্রমে সরাসরি ইন্টার্নশিপ করার সুযোগ। বিশ্ববিদ্যালয় শিক্ষার্থী এবং সদ্য স্নাতকদের জন্য আদর্শ।'
                        ),
                        requirements: [
                          t('University student or graduate', 'বিশ্ববিদ্যালয় শিক্ষার্থী বা স্নাতক সম্পন্ন'),
                          t('Available 3–5 days/week', 'সপ্তাহে ৩-৫ দিন উপলব্ধ থাকতে হবে'),
                          t('Relevant academic background', 'প্রাসঙ্গিক প্রাতিষ্ঠানিক ব্যাকগ্রাউন্ড'),
                          t('Ability to work independently', 'স্বাধীনভাবে কাজ করার ক্ষমতা'),
                        ],
                      },
                    ].map((program) => (
                      <div key={program.title} className="p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all flex flex-col h-full" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{program.title}</h3>
                            <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: program.badgeColor }}>{program.badge}</span>
                          </div>
                          <p className="text-xs font-medium mb-3" style={{ color: '#E8521A' }}>{program.duration}</p>
                          <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>{program.desc}</p>
                          <div className="mb-5">
                            <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>{t('Requirements:', 'যোগ্যতা/প্রয়োজনীয়তা:')}</p>
                            <ul className="space-y-1">
                              {program.requirements.map(r => (
                                <li key={r} className="flex items-center gap-2 text-xs" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                  <CheckCircle size={11} style={{ color: '#1A6B3C' }} /> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <button
                          onClick={() => setInternForm(f => ({ ...f, program: program.title }))}
                          className="w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 mt-auto"
                          style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                        >
                          {t('Apply Now', 'আবেদন করুন')} <ArrowRight size={14} className="inline ml-1" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 rounded-xl" style={{ backgroundColor: '#E8F5EE', border: '1px solid #A8C4B020' }}>
                    <p className="text-sm font-medium mb-2" style={{ color: '#1A6B3C', fontFamily: 'Poppins, sans-serif' }}>
                      {t('Applications for Youth Leadership Academy 2025 are now open', 'যুব নেতৃত্ব একাডেমি ২০২৫-এর জন্য আবেদন প্রক্রিয়া চলমান')}
                    </p>
                    <p className="text-xs" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
                      {t(
                        'Deadline: 31 March 2025 · 60 places available · Cohort begins May 2025. Contact us at youthclimatenetworkbd@gmail.com with your CV and a 300-word motivation statement.',
                        'সময়সীমা: ৩১ মার্চ ২০২৫ · ৬০টি আসন উপলব্ধ · ব্যাচ শুরু মে ২০২৫। আপনার সিভি এবং ৩০০ শব্দের মোটিভেশন স্টেইটমেন্ট সহ youthclimatenetworkbd@gmail.com এ আমাদের সাথে যোগাযোগ করুন।'
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}


          {/* PARTNER TAB */}
          {activeTab === 'partner' && (
            <div>
              <h2 className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' }}>
                {t('Partner With YCN', 'আমাদের অংশীদার হোন')}
              </h2>
              <p className="mb-8 text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'We seek strategic partners — government agencies, NGOs, academic institutions, the private sector, and international organizations — who share our commitment to climate justice and youth empowerment.',
                  'আমরা কৌশলগত অংশীদার খুঁজছি — সরকারি সংস্থা, এনজিও, শিক্ষাপ্রতিষ্ঠান, বেসরকারি খাত এবং আন্তর্জাতিক সংস্থা — যারা জলবায়ু ন্যায়বিচার এবং যুব ক্ষমতায়নে প্রতিশ্রুতিবদ্ধ।'
                )}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  t('Government', 'সরকারি সংস্থা'),
                  t('NGO / INGO', 'এনজিও / আইএনজিও'),
                  t('Academic', 'শিক্ষাপ্রতিষ্ঠান'),
                  t('Private Sector', 'বেসরকারি খাত'),
                  t('UN / Multilateral', 'জাতিসংঘ / বহুপাক্ষিক সংস্থা'),
                  t('Media', 'গণমাধ্যম'),
                  t('Donor / Funder', 'দাতা সংস্থা'),
                  t('Youth Network', 'যুব নেটওয়ার্ক'),
                ].map(type => (
                  <div key={type} className="p-3 rounded-xl text-center text-xs font-medium" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C', fontFamily: 'Inter, sans-serif' }}>
                    {type}
                  </div>
                ))}
              </div>
              {partSuccess ? (
                <div className="text-center py-16">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#1A6B3C' }} />
                  <h3 className="font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                    {t('Partnership Inquiry Received!', 'অংশীদারিত্ব প্রস্তাব প্রাপ্ত হয়েছে!')}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    {t(
                      'Thank you for your interest in partnering with YCN. Our partnerships team will reach out within 3–5 business days.',
                      'ওয়াইসিএন-এর সাথে অংশীদারিত্বে আগ্রহী হওয়ার জন্য ধন্যবাদ। আমাদের টিম আগামী ৩-৫ কার্যদিবসের মধ্যে আপনার সাথে যোগাযোগ করবে।'
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePartner} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Contact Name *', 'যোগাযোগকারীর নাম *')}
                      </label>
                      <input className={inputCls} style={inputStyle} value={partForm.name} onChange={e => setPartForm(f => ({ ...f, name: e.target.value }))} placeholder={t("Your full name", "আপনার পূর্ণ নাম")} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Organization Name *', 'সংস্থার নাম *')}
                      </label>
                      <input className={inputCls} style={inputStyle} value={partForm.org} onChange={e => setPartForm(f => ({ ...f, org: e.target.value }))} placeholder={t("Your organization", "আপনার সংস্থা")} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Email *', 'ইমেইল *')}
                      </label>
                      <input type="email" className={inputCls} style={inputStyle} value={partForm.email} onChange={e => setPartForm(f => ({ ...f, email: e.target.value }))} placeholder="contact@org.com" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {t('Partnership Type *', 'অংশীদারিত্বের ধরণ *')}
                      </label>
                      <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }} value={partForm.type} onChange={e => setPartForm(f => ({ ...f, type: e.target.value }))} required>
                        <option value="">{t('Select type', 'ধরণ নির্বাচন করুন')}</option>
                        {[
                          { key: 'Government', label: t('Government', 'সরকারি সংস্থা') },
                          { key: 'NGO / INGO', label: t('NGO / INGO', 'এনজিও / আইএনজিও') },
                          { key: 'Academic', label: t('Academic', 'শিক্ষাপ্রতিষ্ঠান') },
                          { key: 'Private Sector', label: t('Private Sector', 'বেসরকারি খাত') },
                          { key: 'UN / Multilateral', label: t('UN / Multilateral', 'জাতিসংঘ / বহুপাক্ষিক সংস্থা') },
                          { key: 'Media', label: t('Media', 'গণমাধ্যম') },
                          { key: 'Donor / Funder', label: t('Donor / Funder', 'দাতা সংস্থা') },
                          { key: 'Youth Network', label: t('Youth Network', 'যুব নেটওয়ার্ক') },
                        ].map(op => <option key={op.key} value={op.key}>{op.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {t('Message / Partnership Proposal *', 'বার্তা / অংশীদারিত্বের প্রস্তাব *')}
                    </label>
                    <textarea
                      className={inputCls}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      rows={5}
                      value={partForm.message}
                      onChange={e => setPartForm(f => ({ ...f, message: e.target.value }))}
                      placeholder={t("Describe the type of partnership you're proposing...", "প্রস্তাবিত অংশীদারিত্বের ধরণ এবং কীভাবে তা আমাদের লক্ষ্যের সাথে মেলে তা আলোচনা করুন...")}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01]"
                    style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                  >
                    {t('Submit Partnership Inquiry', 'অংশীদারিত্ব প্রস্তাব জমা দিন')}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

