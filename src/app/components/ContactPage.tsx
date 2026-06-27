import { useState } from 'react';
import { SEO } from './ui/SEO';
import { Mail, Phone, MapPin, Clock, CheckCircle, MessageSquare, ExternalLink, MessageCircle, Users } from 'lucide-react';
import { addContactMessage, getTeam } from '../lib/storage';
import { useLanguage } from '../lib/LanguageContext';

export function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const team = getTeam().slice(0, 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactMessage(form);
    setSuccess(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSuccess(false), 6000);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";
  const inputStyle = { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', color: '#1F2937', fontFamily: 'Inter, sans-serif' };

  return (
    <div>
      <SEO 
        title="Contact" 
        description="Get in touch with the Youth Climate Network. We welcome questions, partnerships, and ideas from anyone passionate about climate action."
        keywords="contact youth climate network, climate organization contact, environmental partnership, reach out climate action, contact bangladesh climate ngo"
      />
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 50% 50%, #E8521A 0%, transparent 45%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Get in Touch', 'যোগাযোগ')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Contact Us', 'যোগাযোগ করুন')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.05rem' }}>
            {t(
              'Reach out for partnership inquiries, media requests, program information, or to join the YCN community.',
              'অংশীদারিত্বের অনুসন্ধান, মিডিয়া অনুরোধ, প্রোগ্রাম সম্পর্কিত তথ্য বা ওয়াইসিএন সম্প্রদায়ে যোগদানের জন্য যোগাযোগ করুন।'
            )}
          </p>
        </div>
      </section>

      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,40 C360,0 1080,60 1440,20 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      {/* Contact Info + Form */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left column: info */}
            <div className="lg:col-span-1 space-y-5">
              <div>
                <h2 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#1F2937' }}>
                  {t('Get in Touch', 'যোগাযোগ')}
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: t('Address', 'ঠিকানা'), text: t('Khulna Division, Bangladesh\n(Coastal Climate Frontline HQ)', 'খুলনা বিভাগ, বাংলাদেশ\n(উপকূলীয় জলবায়ু ফ্রন্টলাইন সদর দপ্তর)'), color: '#E8521A' },
                    { icon: Mail, label: t('Email', 'ইমেইল'), text: 'info@ycnbd.org\nadvocacy@ycnbd.org', color: '#1A6B3C', link: 'mailto:info@ycnbd.org' },
                    { icon: Phone, label: t('Phone', 'ফোন'), text: '+880-XXX-XXXXXXX', color: '#0E7490' },
                    { icon: Clock, label: t('Office Hours', 'অফিসের সময়'), text: t('Sunday – Thursday\n9:00 AM – 6:00 PM BST', 'রবিবার – বৃহস্পতিবার\nসকাল ৯:০০ – সন্ধ্যা ৬:০০ BST'), color: '#D97706' },
                  ].map(({ icon: Icon, label, text, color, link }) => (
                    <div key={label} className="flex gap-4 p-4 rounded-xl bg-white shadow-sm">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>{label}</p>
                        {link ? (
                          <a href={link} className="text-sm whitespace-pre-line hover:underline" style={{ color: '#1F2937', fontFamily: 'Inter, sans-serif' }}>{text}</a>
                        ) : (
                          <p className="text-sm whitespace-pre-line" style={{ color: '#1F2937', fontFamily: 'Inter, sans-serif' }}>{text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Community */}
              <div
                className="p-5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #1a472a 0%, #0D3320 100%)',
                  border: '1px solid rgba(37,211,102,0.25)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(37,211,102,0.15)' }}>
                    <MessageCircle size={18} style={{ color: '#25D366' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#F0ECD8', fontFamily: 'Poppins, sans-serif' }}>{t('WhatsApp Community', 'হোয়াটসঅ্যাপ গ্রুপ')}</p>
                    <p className="text-xs" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>{t('Join 500+ climate activists', '৫০০+ জলবায়ু কর্মীর সাথে যুক্ত হোন')}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>
                  {t(
                    "Connect with YCN's active WhatsApp community for real-time updates, campaigns, events, and peer networking across Bangladesh.",
                    'বাস্তব সময়ের আপডেট, প্রচারণা, ইভেন্ট এবং সারা বাংলাদেশে সমমনাদের সাথে নেটওয়ার্কিংয়ের জন্য ওয়াইসিএন-এর সক্রিয় হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন।'
                  )}
                </p>
                <a
                  href="https://wa.me/880XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
                  }}
                >
                  <MessageCircle size={16} />
                  {t('Join WhatsApp Group', 'হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন')}
                </a>
              </div>

              {/* Community Channels */}
              <div className="p-5 rounded-xl bg-white shadow-sm">
                <p className="text-xs font-semibold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                  <Users size={13} /> {t('Community Channels', 'কমিউনিটি চ্যানেলসমূহ')}
                </p>
                <div className="space-y-2.5">
                  {[
                    { platform: t('Facebook', 'ফেসবুক'), handle: '@YouthClimateNetworkBD', color: '#1877F2', bg: '#EBF5FF' },
                    { platform: t('Instagram', 'ইনস্টাগ্রাম'), handle: '@ycn_bangladesh', color: '#E1306C', bg: '#FFF0F5' },
                    { platform: t('Twitter / X', 'টুইটার / X'), handle: '@YCN_BD', color: '#1DA1F2', bg: '#EBF8FF' },
                    { platform: t('LinkedIn', 'লিঙ্কডইন'), handle: 'Youth Climate Network', color: '#0077B5', bg: '#EBF4FF' },
                    { platform: t('YouTube', 'ইউটিউব'), handle: 'YCN Bangladesh', color: '#FF0000', bg: '#FFF0F0' },
                  ].map(({ platform, handle, color, bg }) => (
                    <a
                      key={platform}
                      href="#"
                      className="flex items-center gap-3 py-2 px-3 rounded-lg transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: bg }}
                    >
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{platform}</span>
                        <span className="text-xs ml-2 truncate" style={{ color: '#9CA3AF' }}>{handle}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Registration */}
              <div className="p-5 rounded-xl" style={{ backgroundColor: '#0A3320' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif' }}>{t('Official Registration', 'অফিসিয়াল নিবন্ধন')}</p>
                <p className="text-sm" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
                  DYD/Khulna/Reg-104<br />
                  {t('Dept. of Youth Development', 'যুব উন্নয়ন অধিদপ্তর')}<br />
                  {t('Ministry of Youth and Sports', 'যুব ও ক্রীড়া মন্ত্রণালয়')}<br />
                  {t("Govt. of the People's Republic of Bangladesh", 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার')}
                </p>
              </div>
            </div>

            {/* Right column: form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare size={22} style={{ color: '#E8521A' }} />
                  <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#1F2937' }}>
                    {t('Send a Message', 'বার্তা পাঠান')}
                  </h2>
                </div>
                {success ? (
                  <div className="text-center py-16">
                    <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#1A6B3C' }} />
                    <h3 className="font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{t('Message Received!', 'বার্তা গ্রহণ করা হয়েছে!')}</h3>
                    <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      {t('Thank you for contacting YCN. We typically respond within 2–3 business days.', 'ওয়াইসিএন-এর সাথে যোগাযোগ করার জন্য আপনাকে ধন্যবাদ। আমরা সাধারণত ২-৩ কার্যদিবসের মধ্যে সাড়া দিয়ে থাকি।')}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Full Name *', 'সম্পূর্ণ নাম *')}</label>
                        <input
                          className={inputCls}
                          style={inputStyle}
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder={t('Your full name', 'আপনার সম্পূর্ণ নাম')}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Email Address *', 'ইমেইল ঠিকানা *')}</label>
                        <input
                          type="email"
                          className={inputCls}
                          style={inputStyle}
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Subject *', 'বিষয় *')}</label>
                      <select
                        className={inputCls}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        required
                      >
                        <option value="">{t('Select a subject', 'একটি বিষয় নির্বাচন করুন')}</option>
                        <option>{t('General Inquiry', 'সাধারণ জিজ্ঞাসা')}</option>
                        <option>{t('Partnership Proposal', 'অংশীদারিত্বের প্রস্তাব')}</option>
                        <option>{t('Media & Press Inquiry', 'মিডিয়া ও প্রেস জিজ্ঞাসা')}</option>
                        <option>{t('Program Information', 'কর্মসূচি সম্পর্কিত তথ্য')}</option>
                        <option>{t('Volunteer / Internship', 'স্বেচ্ছাসেবক / ইন্টার্নশিপ')}</option>
                        <option>{t('Donation & Funding', 'অনুদান ও অর্থায়ন')}</option>
                        <option>{t('Academic / Research Collaboration', 'একাডেমিক / গবেষণা সহযোগিতা')}</option>
                        <option>{t('Other', 'অন্যান্য')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151', fontFamily: 'Inter, sans-serif' }}>{t('Message *', 'বার্তা *')}</label>
                      <textarea
                        className={inputCls}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        rows={6}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder={t('Tell us how we can help or collaborate...', 'আমরা কীভাবে আপনাকে সাহায্য করতে পারি বা সহযোগিতা করতে পারি তা জানান...')}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01]"
                      style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                    >
                      {t('Send Message', 'বার্তা পাঠান')}
                    </button>
                  </form>
                )}
              </div>

              {/* Map placeholder */}
              <div
                className="mt-6 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ height: 220, backgroundColor: '#E8F5EE', border: '1px solid #C8E6C9' }}
              >
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2" style={{ color: '#1A6B3C' }} />
                  <p className="text-sm font-medium" style={{ color: '#1A6B3C', fontFamily: 'Poppins, sans-serif' }}>{t('YCN Headquarters', 'ওয়াইসিএন সদর দপ্তর')}</p>
                  <p className="text-xs" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{t('Khulna Division, Bangladesh', 'খুলনা বিভাগ, বাংলাদেশ')}</p>
                  <a
                    href="https://maps.google.com/?q=Khulna,Bangladesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-medium hover:underline"
                    style={{ color: '#E8521A' }}
                  >
                    {t('View on Google Maps', 'গুগল ম্যাপে দেখুন')} <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Directory */}
      <section className="py-16" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="mb-8" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#1F2937' }}>
            {t('Key Contacts', 'প্রধান যোগাযোগ')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member) => {
              const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              return (
                <div key={member.id} className="p-5 rounded-xl bg-white border hover:shadow-lg transition-all duration-300" style={{ border: '1px solid #E5E7EB' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-lg font-bold" style={{ backgroundColor: '#0A3320', color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}>
                    {initials}
                  </div>
                  <p className="font-semibold text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{member.name}</p>
                  <p className="text-xs mb-3" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif' }}>{member.role}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-xs flex items-center gap-1 hover:underline"
                    style={{ color: '#1A6B3C', fontFamily: 'Inter, sans-serif' }}
                  >
                    <Mail size={10} /> {member.email}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
