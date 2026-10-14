import { useState, useEffect } from 'react';
import {
  Settings, Phone, Mail, MapPin, MessageCircle,
  ShieldCheck, CreditCard, Building2, Save, Eye, CheckCircle2,
  Share2, AlertCircle, FileText, Brain, Upload, Loader2
} from 'lucide-react';
import { useSiteSettings, updateSiteSettings, uploadFile, type SiteSettings } from '../../lib/api';

export function SiteSettingsTab() {
  const { data: settings, mutate, isLoading } = useSiteSettings();
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingPlan, setUploadingPlan] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'contact' | 'socials' | 'donations' | 'registration' | 'mindShantaraLegal'>('contact');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        phone: settings.phone || '+88 01911 368538',
        email: settings.email || 'youthclimatenetworkbd@gmail.com',
        addressDhaka: settings.addressDhaka || '15/KA, Shyamoli, Mirpur Road\nDhaka-1207, Bangladesh',
        addressDhaka_bn: settings.addressDhaka_bn || '১৫/ক, শ্যামলী, মিরপুর রোড\nঢাকা-১২০৭, বাংলাদেশ',
        addressKhulna: settings.addressKhulna || 'Village + Post: Nalian 9273\nUnion: Sutrakhali, Dacope, Khulna',
        addressKhulna_bn: settings.addressKhulna_bn || 'গ্রাম + ডাক: নলিয়ান ৯২৭৩\nইউনিয়ন: সুতারখালী, দাকোপ, খুলনা',
        whatsappLink: settings.whatsappLink || 'https://whatsapp.com/channel/0029VbDURgAADTOEJvOAEX2z',
        facebookUrl: settings.facebookUrl || 'https://www.facebook.com/youthclimatenetwork',
        twitterUrl: settings.twitterUrl || 'https://x.com/ycnorgbd',
        instagramUrl: settings.instagramUrl || 'https://www.instagram.com/youthclimatenetworkbd/',
        linkedinUrl: settings.linkedinUrl || 'https://www.linkedin.com/company/youth-climate-network',
        youtubeUrl: settings.youtubeUrl || 'https://www.youtube.com/@YouthClimateNetwork',
        registrationNumber: settings.registrationNumber || 'Reg. No. S-13962/2023',
        registrationAuthority: settings.registrationAuthority || 'Registrar of Joint Stock Companies and Firms, Government of Bangladesh',
        registrationAuthority_bn: settings.registrationAuthority_bn || 'যৌথ মূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তর, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
        bkashNumber: settings.bkashNumber || '+880 1911-368538',
        bkashType: settings.bkashType || 'Personal',
        nagadNumber: settings.nagadNumber || '+880 1911-368538',
        nagadType: settings.nagadType || 'Personal',
        bankName: settings.bankName || 'Bangladesh Krishi Bank',
        bankAccountName: settings.bankAccountName || 'Youth Climate Network',
        bankAccountNumber: settings.bankAccountNumber || '1322 0311100509',
        bankRoutingNumber: settings.bankRoutingNumber || '035471938',
        bankBranch: settings.bankBranch || 'Nalian sub branch, Dacope, Khulna',
        bankCell: settings.bankCell || '01730 708543',
        intlPaymentNote: settings.intlPaymentNote || 'Please contact us for PayPal or Western Union payment details.',
        intlPaymentNote_bn: settings.intlPaymentNote_bn || 'পেপ্যাল বা ওয়েস্টার্ন ইউনিয়ন পেমেন্টের জন্য সরাসরি যোগাযোগ করুন।',
        mindShantaraStartupPlanUrl: settings.mindShantaraStartupPlanUrl || '/MindShantara_Startup_Plan_2026.pdf',
        mindShantaraTitle: settings.mindShantaraTitle || 'Mind Shantara',
        mindShantaraTitle_bn: settings.mindShantaraTitle_bn || 'মাইন্ড শান্তারা',
        mindShantaraSubtitle: settings.mindShantaraSubtitle || "Bangladesh’s First Climate Anxiety & Mental Health Wellbeing platform.",
        mindShantaraSubtitle_bn: settings.mindShantaraSubtitle_bn || "বাংলাদেশের প্রথম জলবায়ু উদ্বেগ এবং মানসিক স্বাস্থ্য সুরক্ষা প্ল্যাটফর্ম।",
        mindShantaraDesc: settings.mindShantaraDesc || "Climate change is not just an environmental crisis—it is a deeply emotional and psychological one. Mind Shantara is dedicated to addressing eco-anxiety and providing a safe space for youth and frontline communities to find mental health support.",
        mindShantaraDesc_bn: settings.mindShantaraDesc_bn || "জলবায়ু পরিবর্তন শুধুমাত্র একটি পরিবেশগত সংকট নয়—এটি একটি গভীর মানসিক সংকটও। মাইন্ড শান্তারা ইকো-অ্যাংজাইটি (পরিবেশগত উদ্বেগ) মোকাবেলা করতে এবং তরুণদের জন্য মানসিক স্বাস্থ্য সহায়তা প্রদানের জন্য নিবেদিত।",
        privacyLastUpdated: settings.privacyLastUpdated || 'May 20, 2026',
        privacyLastUpdated_bn: settings.privacyLastUpdated_bn || '২০ মে, ২০২৬',
        termsLastUpdated: settings.termsLastUpdated || 'May 20, 2026',
        termsLastUpdated_bn: settings.termsLastUpdated_bn || '২০ মে, ২০২৬',
      });
    }
  }, [settings]);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      await updateSiteSettings(formData);
      await mutate();
      setStatusMsg({ text: 'Site settings updated successfully across the entire website!', type: 'success' });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to update site settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-100 rounded-xl" />
        <div className="h-32 w-full bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-9 h-9 rounded-xl bg-orange-50 text-[#E8521A] flex items-center justify-center">
              <Settings size={20} />
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 font-poppins">Site Settings & Global Info</h2>
          </div>
          <p className="text-xs text-gray-500 font-inter max-w-xl">
            Control global contact information, official registration, social channels, and donation payment accounts (bKash, Nagad, Bank). Updates reflect instantly across Header, Footer, Contact, and Donate pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-all"
          >
            <Eye size={14} /> Preview /contact
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0A3320] to-[#1A6B3C] text-white text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { key: 'contact', label: 'Contact & Addresses', icon: MapPin },
          { key: 'socials', label: 'Social Channels', icon: Share2 },
          { key: 'donations', label: 'Donation & Bank Details', icon: CreditCard },
          { key: 'registration', label: 'Official Registration', icon: ShieldCheck },
          { key: 'mindShantaraLegal', label: 'Mind Shantara & Legal', icon: Brain },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveSubTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeSubTab === tab.key
                ? 'bg-[#0A3320] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={15} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        {/* SUBTAB 1: CONTACT */}
        {activeSubTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-3 font-poppins flex items-center gap-2">
              <Phone size={16} className="text-[#1A6B3C]" /> Communication & Physical Addresses
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Primary Contact Phone
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="+88 01911 368538"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Primary Organization Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="youthclimatenetworkbd@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Community / Channel Link
                </label>
                <div className="relative">
                  <MessageCircle size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={formData.whatsappLink || ''}
                    onChange={e => handleChange('whatsappLink', e.target.value)}
                    placeholder="https://whatsapp.com/channel/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Dhaka Headquarters Address (English)
                </label>
                <textarea
                  rows={3}
                  value={formData.addressDhaka || ''}
                  onChange={e => handleChange('addressDhaka', e.target.value)}
                  placeholder="15/KA, Shyamoli, Mirpur Road, Dhaka-1207"
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Dhaka Headquarters Address (বাংলা)
                </label>
                <textarea
                  rows={3}
                  value={formData.addressDhaka_bn || ''}
                  onChange={e => handleChange('addressDhaka_bn', e.target.value)}
                  placeholder="১৫/ক, শ্যামলী, মিরপুর রোড, ঢাকা-১২০৭"
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Khulna Regional Office Address (English)
                </label>
                <textarea
                  rows={3}
                  value={formData.addressKhulna || ''}
                  onChange={e => handleChange('addressKhulna', e.target.value)}
                  placeholder="Village + Post: Nalian 9273, Sutrakhali, Dacope, Khulna"
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Khulna Regional Office Address (বাংলা)
                </label>
                <textarea
                  rows={3}
                  value={formData.addressKhulna_bn || ''}
                  onChange={e => handleChange('addressKhulna_bn', e.target.value)}
                  placeholder="গ্রাম + ডাক: নলিয়ান ৯২৭৩, সুতারখালী, দাকোপ, খুলনা"
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SOCIALS */}
        {activeSubTab === 'socials' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-3 font-poppins flex items-center gap-2">
              <Share2 size={16} className="text-[#1A6B3C]" /> Social Media & Online Profiles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl || ''}
                  onChange={e => handleChange('facebookUrl', e.target.value)}
                  placeholder="https://www.facebook.com/youthclimatenetwork"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Twitter / X Profile URL
                </label>
                <input
                  type="url"
                  value={formData.twitterUrl || ''}
                  onChange={e => handleChange('twitterUrl', e.target.value)}
                  placeholder="https://x.com/ycnorgbd"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl || ''}
                  onChange={e => handleChange('instagramUrl', e.target.value)}
                  placeholder="https://www.instagram.com/youthclimatenetworkbd/"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  LinkedIn Organization URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl || ''}
                  onChange={e => handleChange('linkedinUrl', e.target.value)}
                  placeholder="https://www.linkedin.com/company/youth-climate-network"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl || ''}
                  onChange={e => handleChange('youtubeUrl', e.target.value)}
                  placeholder="https://www.youtube.com/@YouthClimateNetwork"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: DONATIONS & BANK */}
        {activeSubTab === 'donations' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-3 font-poppins flex items-center gap-2">
              <CreditCard size={16} className="text-[#1A6B3C]" /> Mobile Financial Services & Bank Transfer Accounts
            </h3>

            {/* Mobile Banking Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* bKash */}
              <div className="p-5 rounded-2xl bg-[#FFF0F7] border border-[#E2136E]/20 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#E2136E]">
                  <CreditCard size={18} /> bKash Account Details
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">bKash Number</label>
                  <input
                    type="text"
                    value={formData.bkashNumber || ''}
                    onChange={e => handleChange('bkashNumber', e.target.value)}
                    placeholder="+880 1911-368538"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#E2136E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Account Type</label>
                  <input
                    type="text"
                    value={formData.bkashType || ''}
                    onChange={e => handleChange('bkashType', e.target.value)}
                    placeholder="Personal / Merchant"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Nagad */}
              <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#F7941D]/20 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#F7941D]">
                  <CreditCard size={18} /> Nagad Account Details
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nagad Number</label>
                  <input
                    type="text"
                    value={formData.nagadNumber || ''}
                    onChange={e => handleChange('nagadNumber', e.target.value)}
                    placeholder="+880 1911-368538"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Account Type</label>
                  <input
                    type="text"
                    value={formData.nagadType || ''}
                    onChange={e => handleChange('nagadType', e.target.value)}
                    placeholder="Personal / Merchant"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/50 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[#1565C0]">
                <Building2 size={18} /> Bank Transfer (EFT / NPSB / RTGS)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankName || ''}
                    onChange={e => handleChange('bankName', e.target.value)}
                    placeholder="Bangladesh Krishi Bank"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Account Name</label>
                  <input
                    type="text"
                    value={formData.bankAccountName || ''}
                    onChange={e => handleChange('bankAccountName', e.target.value)}
                    placeholder="Youth Climate Network"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Account Number</label>
                  <input
                    type="text"
                    value={formData.bankAccountNumber || ''}
                    onChange={e => handleChange('bankAccountNumber', e.target.value)}
                    placeholder="1322 0311100509"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Routing Number</label>
                  <input
                    type="text"
                    value={formData.bankRoutingNumber || ''}
                    onChange={e => handleChange('bankRoutingNumber', e.target.value)}
                    placeholder="035471938"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={formData.bankBranch || ''}
                    onChange={e => handleChange('bankBranch', e.target.value)}
                    placeholder="Nalian sub branch, Dacope, Khulna"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Contact Cell No.</label>
                  <input
                    type="text"
                    value={formData.bankCell || ''}
                    onChange={e => handleChange('bankCell', e.target.value)}
                    placeholder="01730 708543"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* International Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  International / PayPal Note (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.intlPaymentNote || ''}
                  onChange={e => handleChange('intlPaymentNote', e.target.value)}
                  placeholder="Please contact us for PayPal or Western Union payment details."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  International / PayPal Note (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={formData.intlPaymentNote_bn || ''}
                  onChange={e => handleChange('intlPaymentNote_bn', e.target.value)}
                  placeholder="পেপ্যাল বা ওয়েস্টার্ন ইউনিয়ন পেমেন্টের জন্য সরাসরি যোগাযোগ করুন।"
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: REGISTRATION */}
        {activeSubTab === 'registration' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-3 font-poppins flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#1A6B3C]" /> Legal Registration & Official Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber || ''}
                  onChange={e => handleChange('registrationNumber', e.target.value)}
                  placeholder="Reg. No. S-13962/2023"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Registration Authority (English)
                </label>
                <input
                  type="text"
                  value={formData.registrationAuthority || ''}
                  onChange={e => handleChange('registrationAuthority', e.target.value)}
                  placeholder="Registrar of Joint Stock Companies and Firms, Government of Bangladesh"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Registration Authority (বাংলা)
                </label>
                <input
                  type="text"
                  value={formData.registrationAuthority_bn || ''}
                  onChange={e => handleChange('registrationAuthority_bn', e.target.value)}
                  placeholder="যৌথ মূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তর, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── SUB TAB 5: MIND SHANTARA & LEGAL POLICIES ── */}
        {activeSubTab === 'mindShantaraLegal' && (
          <div className="space-y-6">
            {/* Mind Shantara Platform Settings */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Brain size={18} className="text-[#1A6B3C]" />
                <h3 className="font-bold text-sm text-gray-900 font-poppins">
                  Mind Shantara Platform Settings (/mind-shantara)
                </h3>
              </div>
              <p className="text-xs text-gray-500 font-inter">
                Configure the title, tagline, description and download plan for Bangladesh’s First Climate Anxiety & Mental Health platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Platform Title (English)
                  </label>
                  <input
                    type="text"
                    value={formData.mindShantaraTitle || ''}
                    onChange={e => handleChange('mindShantaraTitle', e.target.value)}
                    placeholder="Mind Shantara"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Platform Title (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.mindShantaraTitle_bn || ''}
                    onChange={e => handleChange('mindShantaraTitle_bn', e.target.value)}
                    placeholder="মাইন্ড শান্তারা"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Subtitle / Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={formData.mindShantaraSubtitle || ''}
                    onChange={e => handleChange('mindShantaraSubtitle', e.target.value)}
                    placeholder="Bangladesh’s First Climate Anxiety & Mental Health Wellbeing platform."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Subtitle / Tagline (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.mindShantaraSubtitle_bn || ''}
                    onChange={e => handleChange('mindShantaraSubtitle_bn', e.target.value)}
                    placeholder="বাংলাদেশের প্রথম জলবায়ু উদ্বেগ এবং মানসিক স্বাস্থ্য সুরক্ষা প্ল্যাটফর্ম।"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Startup Plan 2026 PDF Document File / URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.mindShantaraStartupPlanUrl || ''}
                      onChange={e => handleChange('mindShantaraStartupPlanUrl', e.target.value)}
                      placeholder="/MindShantara_Startup_Plan_2026.pdf"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer flex items-center gap-1.5 flex-shrink-0 transition-all">
                      {uploadingPlan ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      <span>{uploadingPlan ? 'Uploading...' : 'Upload PDF'}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        disabled={uploadingPlan}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingPlan(true);
                          try {
                            const url = await uploadFile(file);
                            handleChange('mindShantaraStartupPlanUrl', url);
                            setStatusMsg({ text: 'Startup plan PDF uploaded successfully', type: 'success' });
                          } catch (err: any) {
                            setStatusMsg({ text: err.message || 'Upload failed', type: 'error' });
                          } finally {
                            setUploadingPlan(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mission Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.mindShantaraDesc || ''}
                    onChange={e => handleChange('mindShantaraDesc', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mission Description (বাংলা)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.mindShantaraDesc_bn || ''}
                    onChange={e => handleChange('mindShantaraDesc_bn', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Legal Policies & Last Updated */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <FileText size={18} className="text-[#0E7490]" />
                <h3 className="font-bold text-sm text-gray-900 font-poppins">
                  Legal Policies Last Updated Dates (/privacy & /terms)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Privacy Policy Last Updated (English)
                  </label>
                  <input
                    type="text"
                    value={formData.privacyLastUpdated || ''}
                    onChange={e => handleChange('privacyLastUpdated', e.target.value)}
                    placeholder="May 20, 2026"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Privacy Policy Last Updated (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.privacyLastUpdated_bn || ''}
                    onChange={e => handleChange('privacyLastUpdated_bn', e.target.value)}
                    placeholder="২০ মে, ২০২৬"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Terms of Service Last Updated (English)
                  </label>
                  <input
                    type="text"
                    value={formData.termsLastUpdated || ''}
                    onChange={e => handleChange('termsLastUpdated', e.target.value)}
                    placeholder="May 20, 2026"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Terms of Service Last Updated (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.termsLastUpdated_bn || ''}
                    onChange={e => handleChange('termsLastUpdated_bn', e.target.value)}
                    placeholder="২০ মে, ২০২৬"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Click save to persist changes to database.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#0A3320] to-[#1A6B3C] text-white text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
