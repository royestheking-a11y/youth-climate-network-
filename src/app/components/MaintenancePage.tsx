import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wrench, Mail, Phone, MessageCircle, ExternalLink,
  Sparkles, CheckCircle2, RefreshCw, Lock, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import type { SiteSettings } from '../lib/storage';
import logo from '../../imports/Asset_1.webp';

interface MaintenancePageProps {
  settings?: SiteSettings | null;
  isPreview?: boolean;
}

export function MaintenancePage({ settings, isPreview = false }: MaintenancePageProps) {
  const { lang, setLanguage, t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dynamic values with fallback defaults
  const title = lang === 'bn' && settings?.maintenanceTitle_bn
    ? settings.maintenanceTitle_bn
    : settings?.maintenanceTitle || "We're Upgrading Our Platform for Climate Impact";

  const message = lang === 'bn' && settings?.maintenanceMessage_bn
    ? settings.maintenanceMessage_bn
    : settings?.maintenanceMessage || "Youth Climate Network is currently undergoing scheduled platform upgrades to bring you an improved experience with new grassroots tools, enhanced data security, and interactive resources. We will be back online shortly.";

  const notice = lang === 'bn' && settings?.maintenanceNotice_bn
    ? settings.maintenanceNotice_bn
    : settings?.maintenanceNotice || "Scheduled System Maintenance in Progress";

  const email = settings?.email || 'youthclimatenetworkbd@gmail.com';
  const phone = settings?.phone || '+88 01911 368538';
  const whatsapp = settings?.whatsappLink || 'https://whatsapp.com/channel/0029VbDURgAADTOEJvOAEX2z';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#04190F] text-white relative overflow-hidden flex flex-col justify-between select-none">
      {/* ── TOP PREVIEW BAR (if opened via ?preview_maintenance=true) ── */}
      {isPreview && (
        <div className="relative z-50 bg-gradient-to-r from-amber-500 via-[#E8521A] to-amber-600 text-white px-4 py-2.5 text-xs font-bold font-inter flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="animate-spin" />
              <span>{t('ADMIN PREVIEW: Maintenance Mode is active for public visitors.', 'অ্যাডমিন প্রিভিউ: সাধারণ দর্শনার্থীদের জন্য রক্ষণাবেক্ষণ পেজটি প্রদর্শিত হচ্ছে।')}</span>
            </span>
            <a
              href="/admin/settings"
              className="px-3 py-1 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-all font-semibold flex items-center gap-1 shadow-sm"
            >
              <span>{t('Return to Settings', 'সেটিংসে ফিরে যান')}</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      )}

      {/* ── ATMOSPHERIC GLOW & GRID EFFECTS ── */}
      <div className="absolute inset-0 bg-[radial-gradient(#1A6B3C_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.06] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#E8521A]/15 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none" />

      {/* ── HEADER NAVIGATION BAR ── */}
      <header className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/15 shadow-xl flex items-center justify-center">
            <img src={logo} alt="Youth Climate Network" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight font-poppins text-[#F0ECD8] leading-none">
              Youth Climate Network
            </h1>
            <p className="text-[10px] sm:text-xs text-emerald-400/80 font-inter font-medium tracking-wide mt-0.5">
              Bangladesh Youth Climate Platform
            </p>
          </div>
        </div>

        {/* Language Switcher Pill */}
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/15">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer font-inter ${
              lang === 'en'
                ? 'bg-[#E8521A] text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('bn')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer font-inter ${
              lang === 'bn'
                ? 'bg-[#E8521A] text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            বাংলা
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT HERO SECTION ── */}
      <main className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center">
        {/* Live Status Beacon */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold font-inter shadow-xl text-emerald-200 mb-8"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <span>{notice}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-300 text-xs flex items-center gap-1 font-mono">
            <RefreshCw size={11} className="animate-spin text-emerald-400" />
            98.4%
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black font-poppins text-[#F0ECD8] tracking-tight leading-[1.15] max-w-3xl drop-shadow-2xl"
        >
          {title}
        </motion.h2>

        {/* Explanatory Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-emerald-100/80 font-inter max-w-2xl leading-relaxed font-normal"
        >
          {message}
        </motion.p>

        {/* Estimated Completion Timer / Badge (if configured) */}
        {settings?.maintenanceEndTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono"
          >
            <Clock size={12} className="text-[#E8521A]" />
            <span>{t('Estimated Return:', 'সম্ভাব্য প্রত্যাবর্তনের সময়:')}</span>
            <strong className="text-white font-semibold">{settings.maintenanceEndTime}</strong>
          </motion.div>
        )}

        {/* ── LIVE SYSTEM PROGRESS MODULE ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 w-full max-w-xl bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 font-inter">
              <Wrench size={13} className="text-[#E8521A]" />
              {t('System Upgrade Status', 'সিস্টেম উন্নয়ন অগ্রগতি')}
            </span>
            <span className="text-xs font-semibold text-gray-400 font-mono">
              {t('Step 2 of 3', 'পর্যায় ২ / ৩')}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-5">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '92%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#1A6B3C] via-emerald-400 to-[#E8521A] rounded-full"
            />
          </div>

          {/* Milestone List */}
          <div className="space-y-3 font-inter text-xs">
            <div className="flex items-center justify-between text-gray-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                <span>{t('Core Platform Architecture & Engine', 'কোর প্ল্যাটফর্ম আর্কিটেকচার ও ইঞ্জিন')}</span>
              </span>
              <span className="text-emerald-400 font-bold font-mono text-[11px]">{t('Completed', 'সম্পন্ন')}</span>
            </div>

            <div className="flex items-center justify-between text-white font-medium">
              <span className="flex items-center gap-2">
                <RefreshCw size={14} className="text-amber-400 animate-spin flex-shrink-0" />
                <span>{t('Database Security & Resource Optimization', 'ডাটাবেস সুরক্ষা ও রিসোর্স অপটিমাইজেশন')}</span>
              </span>
              <span className="text-amber-400 font-bold font-mono text-[11px]">{t('In Progress', 'চলমান')}</span>
            </div>

            <div className="flex items-center justify-between text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border border-gray-500/50 flex-shrink-0" />
                <span>{t('Global CDN Cache Sync & Final Audit', 'গ্লোবাল সিডিএন ক্যাশ সিঙ্ক ও চূড়ান্ত নিরীক্ষা')}</span>
              </span>
              <span className="text-gray-500 font-mono text-[11px]">{t('Pending', 'অপেক্ষমান')}</span>
            </div>
          </div>
        </motion.div>

        {/* ── URGENT CONTACT & HOTLINE CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl"
        >
          {/* Email Card */}
          <div className="bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between group">
            <div>
              <div className="w-8 h-8 rounded-xl bg-[#E8521A]/20 text-[#E8521A] flex items-center justify-center mb-2.5">
                <Mail size={15} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-inter">
                {t('Emergency Email', 'জরুরি ইমেইল')}
              </p>
              <p className="text-xs text-white font-semibold truncate mt-0.5 font-inter">
                {email}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <a
                href={`mailto:${email}`}
                className="text-[11px] font-bold text-[#E8521A] hover:underline flex items-center gap-1 font-inter"
              >
                <span>{t('Send Email', 'ইমেইল করুন')}</span>
                <ExternalLink size={10} />
              </a>
              <span className="text-gray-600">•</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-[11px] text-gray-400 hover:text-white cursor-pointer font-inter"
              >
                {copiedEmail ? t('Copied!', 'কপি হয়েছে!') : t('Copy', 'কপি')}
              </button>
            </div>
          </div>

          {/* Hotline Phone Card */}
          <a
            href={`tel:${phone}`}
            className="bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5">
                <Phone size={15} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-inter">
                {t('Secretariat Hotline', 'সচিবালয় হটলাইন')}
              </p>
              <p className="text-xs text-white font-semibold mt-0.5 font-inter">
                {phone}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-400 group-hover:underline font-inter">
              <span>{t('Call Secretariat', 'সরাসরি কল')}</span>
              <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          {/* WhatsApp Channel Card */}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center mb-2.5">
                <MessageCircle size={15} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-inter">
                {t('WhatsApp Updates', 'হোয়াটসঅ্যাপ আপডেট')}
              </p>
              <p className="text-xs text-white font-semibold mt-0.5 font-inter">
                {t('YCN Community', 'ওয়াইসিএন কমিউনিটি')}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-green-400 group-hover:underline font-inter">
              <span>{t('Join Channel', 'চ্যানেলে যুক্ত হন')}</span>
              <ExternalLink size={10} />
            </div>
          </a>
        </motion.div>
      </main>

      {/* ── FOOTER BAR ── */}
      <footer className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-inter">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} Youth Climate Network (YCN). All Rights Reserved. Reg. No. S-13962/2023.
        </p>

        {/* Admin Staff Access Pill */}
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all text-[11px] font-semibold"
          >
            <Lock size={11} className="text-emerald-400" />
            <span>{t('Staff & Admin Login', 'টিম লগইন')}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

// Simple Clock helper for estimated time badge
function Clock(props: { size?: number; className?: string }) {
  return (
    <svg
      width={props.size || 16}
      height={props.size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
