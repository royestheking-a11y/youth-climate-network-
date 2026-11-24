import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail, Phone, MessageCircle, ExternalLink,
  Sparkles, ArrowRight, Clock, Check
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import type { SiteSettings } from '../lib/storage';

interface MaintenancePageProps {
  settings?: SiteSettings | null;
  isPreview?: boolean;
}

const DEFAULT_NATURE_BG = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2560&q=85';

export function MaintenancePage({ settings, isPreview = false }: MaintenancePageProps) {
  const { lang, setLanguage, t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dynamic values with fallback defaults
  const title = lang === 'bn' && settings?.maintenanceTitle_bn
    ? settings.maintenanceTitle_bn
    : settings?.maintenanceTitle || "We'll Be Back Soon";

  const message = lang === 'bn' && settings?.maintenanceMessage_bn
    ? settings.maintenanceMessage_bn
    : settings?.maintenanceMessage || "Youth Climate Network is taking a brief pause for scheduled improvements. We are enhancing our grassroots tools and digital platform to better serve youth climate leaders across Bangladesh. We will be back online shortly.";

  const notice = lang === 'bn' && settings?.maintenanceNotice_bn
    ? settings.maintenanceNotice_bn
    : settings?.maintenanceNotice || "Website Under Maintenance";

  const bgImage = settings?.maintenanceBgImage || DEFAULT_NATURE_BG;
  const email = settings?.email || 'youthclimatenetworkbd@gmail.com';
  const phone = settings?.phone || '+88 01911 368538';
  const whatsapp = settings?.whatsappLink || 'https://whatsapp.com/channel/0029VbDURgAADTOEJvOAEX2z';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden text-white select-none">
      {/* ── NATURAL VIEW BACKGROUND WITH GENTLE KEN-BURNS SCALE ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.img
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          src={bgImage}
          alt="Natural Landscape"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft cinematic vignette overlays for contrast and depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03140C]/75 via-[#03140C]/55 to-[#03140C]/85 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,20,12,0.6)_100%)]" />
      </div>

      {/* ── TOP PREVIEW BAR (if opened via ?preview_maintenance=true) ── */}
      {isPreview && (
        <div className="relative z-50 bg-gradient-to-r from-amber-500 via-[#E8521A] to-amber-600 text-white px-4 py-2.5 text-xs font-bold font-inter shadow-xl">
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="animate-spin" />
              <span>{t('ADMIN PREVIEW: Maintenance Mode is active for public visitors.', 'অ্যাডমিন প্রিভিউ: সাধারণ দর্শনার্থীদের জন্য রক্ষণাবেক্ষণ পেজটি প্রদর্শিত হচ্ছে।')}</span>
            </span>
            <a
              href="/admin/siteSettings"
              className="px-3.5 py-1 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-all font-semibold flex items-center gap-1 shadow-sm"
            >
              <span>{t('Return to Settings', 'সেটিংসে ফিরে যান')}</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      )}

      {/* ── TOP HEADER / BRAND & LANGUAGE TOGGLE ── */}
      <header className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/ycnmain.png"
            alt="Youth Climate Network Bangladesh"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Language Switcher Pill */}
        <div className="flex items-center gap-1 bg-black/35 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
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

      {/* ── CENTER FLOATING MAINTENANCE CARD ── */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative max-w-xl sm:max-w-2xl w-full bg-[#0A3320]/65 hover:bg-[#0A3320]/75 backdrop-blur-2xl border border-white/20 rounded-[32px] sm:rounded-[40px] p-7 sm:p-12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] text-center transition-all duration-300"
        >
          {/* Subtle Ambient Radial Glow inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-emerald-400/15 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -bottom-10 right-10 w-60 h-40 bg-[#E8521A]/15 blur-3xl pointer-events-none rounded-full" />

          {/* Card Top Icon & Status Pill */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Emblem */}
            <div className="mb-6 flex justify-center">
              <img
                src="/ycnmain.png"
                alt="Youth Climate Network"
                className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-200 text-xs font-semibold font-inter shadow-inner mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>{notice}</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-poppins text-[#F0ECD8] tracking-tight leading-[1.18] drop-shadow-lg">
              {title}
            </h2>

            {/* Reassuring, Inspiring Message */}
            <p className="mt-5 text-sm sm:text-base text-gray-200/95 font-inter leading-relaxed max-w-lg">
              {message}
            </p>

            {/* Estimated Completion Time (if specified) */}
            {settings?.maintenanceEndTime && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-200 font-mono">
                <Clock size={13} className="text-[#E8521A]" />
                <span className="text-gray-300 font-inter">{t('Estimated Return:', 'সম্ভাব্য সময়:')}</span>
                <span className="font-bold text-white">{settings.maintenanceEndTime}</span>
              </div>
            )}

            {/* ── ACTION / CONTACT SHORTCUTS ── */}
            <div className="mt-8 pt-7 border-t border-white/15 w-full">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300/90 font-inter mb-4">
                {t('Need Immediate Assistance?', 'জরুরি প্রয়োজনে যোগাযোগ করুন')}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Email Action */}
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-[#E8521A] text-white backdrop-blur-md border border-white/20 text-xs font-semibold font-inter transition-all duration-300 shadow-md group cursor-pointer"
                >
                  <Mail size={14} className="text-[#E8521A] group-hover:text-white transition-colors" />
                  <span>{email}</span>
                </a>

                {/* Call Secretariat */}
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-[#1A6B3C] text-white backdrop-blur-md border border-white/20 text-xs font-semibold font-inter transition-all duration-300 shadow-md group cursor-pointer"
                >
                  <Phone size={14} className="text-emerald-400 group-hover:text-white transition-colors" />
                  <span>{phone}</span>
                </a>

                {/* WhatsApp Community */}
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 text-xs font-semibold font-inter transition-all duration-300 shadow-md group cursor-pointer"
                >
                  <MessageCircle size={14} className="text-green-400 group-hover:text-white transition-colors" />
                  <span>{t('WhatsApp Channel', 'হোয়াটসঅ্যাপ চ্যানেল')}</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
              </div>

              {/* Quick Copy Email helper */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="mt-3 text-[11px] text-gray-300 hover:text-white underline decoration-white/40 cursor-pointer font-inter transition-colors inline-flex items-center gap-1"
              >
                {copiedEmail ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span>{t('Email address copied to clipboard!', 'ইমেইল কপি করা হয়েছে!')}</span>
                  </>
                ) : (
                  <span>{t('Click here to copy email address', 'ইমেইল এড্রেস কপি করতে ক্লিক করুন')}</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── FOOTER / COPYRIGHT ── */}
      <footer className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-center text-xs text-gray-300/80 font-inter">
        <p className="text-center drop-shadow">
          © {new Date().getFullYear()} Youth Climate Network (YCN) • Reg. No. S-13962/2023
        </p>
      </footer>
    </div>
  );
}
