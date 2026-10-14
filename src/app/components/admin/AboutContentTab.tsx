import { useState, useEffect } from 'react';
import {
  Award, Save, Eye
} from 'lucide-react';
import { useAboutContent, updateAboutContent, type AboutContent } from '../../lib/api';

export function AboutContentTab() {
  const { data: content, mutate, isLoading } = useAboutContent();
  const [formData, setFormData] = useState<Partial<AboutContent>>({});
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (content) {
      setFormData({
        heroTagline: content.heroTagline || "People · Planet · Resilient Bangladesh",
        heroTagline_bn: content.heroTagline_bn || "মানুষ · পৃথিবী · সহনশীল বাংলাদেশ",
        heroTitle: content.heroTitle || "About YCN Bangladesh",
        heroTitle_bn: content.heroTitle_bn || "ওয়াইসিএন বাংলাদেশ সম্পর্কে",
        heroSubtitle: content.heroSubtitle || "A youth-led network working for a cleaner, greener and more resilient Bangladesh.",
        heroSubtitle_bn: content.heroSubtitle_bn || "একটি যুব-নেতৃত্বাধীন নেটওয়ার্ক যা আরও পরিষ্কার, সবুজ এবং জলবায়ু-সহনশীল বাংলাদেশের জন্য কাজ করছে।",

        missionTitle: content.missionTitle || "Our Mission",
        missionTitle_bn: content.missionTitle_bn || "আমাদের মিশন",
        missionDesc: content.missionDesc || "Empowering youth for a climate-resilient Bangladesh.",
        missionDesc_bn: content.missionDesc_bn || "জলবায়ু-সহনশীল বাংলাদেশের জন্য তরুণদের ক্ষমতায়ন।",
        missionColor: content.missionColor || "#1A6B3C",
        missionIcon: content.missionIcon || "Target",

        visionTitle: content.visionTitle || "Our Vision",
        visionTitle_bn: content.visionTitle_bn || "আমাদের ভিশন",
        visionDesc: content.visionDesc || "A sustainable, just and climate-resilient Bangladesh.",
        visionDesc_bn: content.visionDesc_bn || "একটি টেকসই, ন্যায়সঙ্গত এবং জলবায়ু-সহনশীল বাংলাদেশ।",
        visionColor: content.visionColor || "#E8521A",
        visionIcon: content.visionIcon || "Eye",

        approachTitle: content.approachTitle || "Our Approach",
        approachTitle_bn: content.approachTitle_bn || "আমাদের পদ্ধতি",
        approachDesc: content.approachDesc || "Youth leadership, collaboration and evidence-based action.",
        approachDesc_bn: content.approachDesc_bn || "যুব নেতৃত্ব, সহযোগিতা এবং প্রমাণ-ভিত্তিক কর্মপদ্ধতি।",
        approachColor: content.approachColor || "#0E7490",
        approachIcon: content.approachIcon || "Users",

        valuesTitle: content.valuesTitle || "Our Values",
        valuesTitle_bn: content.valuesTitle_bn || "আমাদের মূল্যবোধ",
        valuesDesc: content.valuesDesc || "Inclusivity, integrity, innovation and impact.",
        valuesDesc_bn: content.valuesDesc_bn || "অন্তর্ভুক্তি, সততা, উদ্ভাবন এবং ইতিবাচক প্রভাব।",
        valuesColor: content.valuesColor || "#7C3AED",
        valuesIcon: content.valuesIcon || "Heart",

        ctaTitle: content.ctaTitle || "Join the Youth Climate Movement",
        ctaTitle_bn: content.ctaTitle_bn || "যুব জলবায়ু আন্দোলনে যোগ দিন",
        ctaDesc: content.ctaDesc || "Whether as a volunteer, partner, researcher, or supporter — there is a place for you in building a resilient Bangladesh.",
        ctaDesc_bn: content.ctaDesc_bn || "স্বেচ্ছাসেবক, অংশীদার, গবেষক বা সমর্থক হিসেবে — একটি সহনশীল বাংলাদেশ গঠনে আপনার ভূমিকা রয়েছে।",
        ctaButton1Text: content.ctaButton1Text || "Get Involved",
        ctaButton1Text_bn: content.ctaButton1Text_bn || "যুক্ত হোন",
        ctaButton1Link: content.ctaButton1Link || "/get-involved",
        ctaButton2Text: content.ctaButton2Text || "Support Our Work",
        ctaButton2Text_bn: content.ctaButton2Text_bn || "আমাদের সমর্থন করুন",
        ctaButton2Link: content.ctaButton2Link || "/contact",
      });
    }
  }, [content]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMsg(null);
      await updateAboutContent(formData);
      await mutate();
      setStatusMsg({ text: 'About page content saved successfully!', type: 'success' });
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-400">Loading About configuration...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED]">
            <Award size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              About Page Content & Core Pillars
            </h1>
            <p className="text-xs text-gray-500">
              Control the About page hero heading, 4 core value pillars (Mission, Vision, Approach, Values), and CTA banner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Eye size={14} /> Preview /about
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl text-white shadow-md transition-all hover:scale-105"
            style={{ backgroundColor: '#1A6B3C' }}
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* ── SECTION 1: HERO BANNER ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A6B3C]" />
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-poppins">
              1. Hero Banner Section
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Tagline / Pill Badge (EN)</label>
              <input
                type="text"
                value={formData.heroTagline || ''}
                onChange={e => setFormData({ ...formData, heroTagline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="People · Planet · Resilient Bangladesh"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Tagline / Pill Badge (BN)</label>
              <input
                type="text"
                value={formData.heroTagline_bn || ''}
                onChange={e => setFormData({ ...formData, heroTagline_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="মানুষ · পৃথিবী · সহনশীল বাংলাদেশ"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Main Heading (EN) *</label>
              <input
                type="text"
                required
                value={formData.heroTitle || ''}
                onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white font-bold"
                placeholder="About YCN Bangladesh"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Main Heading (BN)</label>
              <input
                type="text"
                value={formData.heroTitle_bn || ''}
                onChange={e => setFormData({ ...formData, heroTitle_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white font-bold"
                placeholder="ওয়াইসিএন বাংলাদেশ সম্পর্কে"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle / Summary (EN) *</label>
              <textarea
                rows={3}
                required
                value={formData.heroSubtitle || ''}
                onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="A youth-led network working for a cleaner, greener and more resilient Bangladesh."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle / Summary (BN)</label>
              <textarea
                rows={3}
                value={formData.heroSubtitle_bn || ''}
                onChange={e => setFormData({ ...formData, heroSubtitle_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="একটি যুব-নেতৃত্বাধীন নেটওয়ার্ক যা আরও পরিষ্কার..."
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: 4 CORE PILLARS ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8521A]" />
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-poppins">
              2. Four Core Pillars (Mission, Vision, Approach, Values)
            </h3>
          </div>

          {/* Pillar 1: Mission */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-800">Pillar 1: Mission</span>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-500">Color:</label>
                <input
                  type="color"
                  value={formData.missionColor || '#1A6B3C'}
                  onChange={e => setFormData({ ...formData, missionColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title (EN) e.g. Our Mission"
                value={formData.missionTitle || ''}
                onChange={e => setFormData({ ...formData, missionTitle: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Title (BN) যেমন: আমাদের মিশন"
                value={formData.missionTitle_bn || ''}
                onChange={e => setFormData({ ...formData, missionTitle_bn: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea
                rows={2}
                placeholder="Description (EN)"
                value={formData.missionDesc || ''}
                onChange={e => setFormData({ ...formData, missionDesc: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <textarea
                rows={2}
                placeholder="Description (BN)"
                value={formData.missionDesc_bn || ''}
                onChange={e => setFormData({ ...formData, missionDesc_bn: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Pillar 2: Vision */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-orange-800">Pillar 2: Vision</span>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-500">Color:</label>
                <input
                  type="color"
                  value={formData.visionColor || '#E8521A'}
                  onChange={e => setFormData({ ...formData, visionColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title (EN) e.g. Our Vision"
                value={formData.visionTitle || ''}
                onChange={e => setFormData({ ...formData, visionTitle: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Title (BN) যেমন: আমাদের ভিশন"
                value={formData.visionTitle_bn || ''}
                onChange={e => setFormData({ ...formData, visionTitle_bn: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea
                rows={2}
                placeholder="Description (EN)"
                value={formData.visionDesc || ''}
                onChange={e => setFormData({ ...formData, visionDesc: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <textarea
                rows={2}
                placeholder="Description (BN)"
                value={formData.visionDesc_bn || ''}
                onChange={e => setFormData({ ...formData, visionDesc_bn: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Pillar 3: Approach */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-cyan-800">Pillar 3: Approach</span>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-500">Color:</label>
                <input
                  type="color"
                  value={formData.approachColor || '#0E7490'}
                  onChange={e => setFormData({ ...formData, approachColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title (EN) e.g. Our Approach"
                value={formData.approachTitle || ''}
                onChange={e => setFormData({ ...formData, approachTitle: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Title (BN) যেমন: আমাদের পদ্ধতি"
                value={formData.approachTitle_bn || ''}
                onChange={e => setFormData({ ...formData, approachTitle_bn: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea
                rows={2}
                placeholder="Description (EN)"
                value={formData.approachDesc || ''}
                onChange={e => setFormData({ ...formData, approachDesc: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <textarea
                rows={2}
                placeholder="Description (BN)"
                value={formData.approachDesc_bn || ''}
                onChange={e => setFormData({ ...formData, approachDesc_bn: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Pillar 4: Values */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-purple-800">Pillar 4: Values</span>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-500">Color:</label>
                <input
                  type="color"
                  value={formData.valuesColor || '#7C3AED'}
                  onChange={e => setFormData({ ...formData, valuesColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title (EN) e.g. Our Values"
                value={formData.valuesTitle || ''}
                onChange={e => setFormData({ ...formData, valuesTitle: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Title (BN) যেমন: আমাদের মূল্যবোধ"
                value={formData.valuesTitle_bn || ''}
                onChange={e => setFormData({ ...formData, valuesTitle_bn: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea
                rows={2}
                placeholder="Description (EN)"
                value={formData.valuesDesc || ''}
                onChange={e => setFormData({ ...formData, valuesDesc: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
              <textarea
                rows={2}
                placeholder="Description (BN)"
                value={formData.valuesDesc_bn || ''}
                onChange={e => setFormData({ ...formData, valuesDesc_bn: e.target.value })}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: BOTTOM CALL-TO-ACTION (CTA) BANNER ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E7490]" />
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-poppins">
              3. Bottom Call-to-Action (CTA) Banner
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Headline (EN)</label>
              <input
                type="text"
                value={formData.ctaTitle || ''}
                onChange={e => setFormData({ ...formData, ctaTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                placeholder="Join the Youth Climate Movement"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Headline (BN)</label>
              <input
                type="text"
                value={formData.ctaTitle_bn || ''}
                onChange={e => setFormData({ ...formData, ctaTitle_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                placeholder="যুব জলবায়ু আন্দোলনে যোগ দিন"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Description (EN)</label>
              <textarea
                rows={2}
                value={formData.ctaDesc || ''}
                onChange={e => setFormData({ ...formData, ctaDesc: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Description (BN)</label>
              <textarea
                rows={2}
                value={formData.ctaDesc_bn || ''}
                onChange={e => setFormData({ ...formData, ctaDesc_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Button 1 Label & Destination</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Label: Get Involved"
                  value={formData.ctaButton1Text || ''}
                  onChange={e => setFormData({ ...formData, ctaButton1Text: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Link: /get-involved"
                  value={formData.ctaButton1Link || ''}
                  onChange={e => setFormData({ ...formData, ctaButton1Link: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Button 2 Label & Destination</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Label: Support Our Work"
                  value={formData.ctaButton2Text || ''}
                  onChange={e => setFormData({ ...formData, ctaButton2Text: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Link: /contact"
                  value={formData.ctaButton2Link || ''}
                  onChange={e => setFormData({ ...formData, ctaButton2Link: e.target.value })}
                  className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button floating/bottom */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 text-xs font-semibold rounded-xl text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#1A6B3C' }}
          >
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
