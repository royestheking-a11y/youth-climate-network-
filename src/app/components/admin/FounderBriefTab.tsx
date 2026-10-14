import { useState, useEffect } from 'react';
import { Award, Save, Eye, Play, ExternalLink, Image as ImageIcon, BookOpen, X } from 'lucide-react';
import { useFounderBrief, updateFounderBrief, uploadFile } from '../../lib/api';

export function FounderBriefTab() {
  const { data: brief, mutate, isLoading } = useFounderBrief();
  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    subtitle: '',
    subtitle_bn: '',
    content: '',
    content_bn: '',
    quote: '',
    quote_bn: '',
    founderName: '',
    founderRole: '',
    founderImage: '',
    videoUrl: '',
    articleLink: '',
    buttonText: 'Read the Full Founder’s Story',
    buttonText_bn: 'প্রতিষ্ঠাতার পূর্ণাঙ্গ গল্প পড়ুন',
    fullStory: '',
    fullStory_bn: '',
  });

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showModalPreview, setShowModalPreview] = useState(false);

  useEffect(() => {
    if (brief) {
      setFormData({
        title: brief.title || 'From a Simple Belief to a Growing Movement',
        title_bn: brief.title_bn || 'একটি সাধারণ বিশ্বাস থেকে ক্রমবর্ধমান আন্দোলন',
        subtitle: brief.subtitle || "FOUNDER'S STORY",
        subtitle_bn: brief.subtitle_bn || 'প্রতিষ্ঠাতার গল্প',
        content: brief.content || 'YCN Bangladesh began with a simple belief — that young people can drive real change for our climate, communities and future. Our founder’s journey reflects this belief and the story behind the network.',
        content_bn: brief.content_bn || 'ওয়াইসিএন বাংলাদেশ একটি সাধারণ বিশ্বাসের মধ্য দিয়ে শুরু হয়েছিল — যে তরুণরা আমাদের জলবায়ু, সম্প্রদায় এবং ভবিষ্যতের জন্য প্রকৃত পরিবর্তন আনতে পারে।',
        quote: brief.quote || 'We are not just protecting our environment today — we are building a safer, stronger future for our communities.',
        quote_bn: brief.quote_bn || 'আমরা কেবল আজকের পরিবেশ রক্ষা করছি না — আমাদের সম্প্রদায়ের জন্য আরও নিরাপদ ও শক্তিশালী ভবিষ্যৎ গড়ে তুলছি।',
        founderName: brief.founderName || brief.author || 'Arafat Hossain Akash',
        founderRole: brief.founderRole || brief.authorRole || 'Founder & Executive Director, Youth Climate Network',
        founderImage: brief.founderImage || brief.image || '/Arafat Hossain Akash - Founder & Executive Director.jpg',
        videoUrl: brief.videoUrl || '',
        articleLink: brief.articleLink || brief.articleUrl || '/about',
        buttonText: brief.buttonText || brief.readMoreText || 'Read the Full Founder’s Story',
        buttonText_bn: brief.buttonText_bn || 'প্রতিষ্ঠাতার পূর্ণাঙ্গ গল্প পড়ুন',
        fullStory: brief.fullStory || `On 25 May 2009, Cyclone Aila struck the coast of Bangladesh. Our home, everything we had — washed away in hours. I was nine years old, and I lost my school before I ever fully understood what I was losing. That was not the only storm of my childhood.

I grew up watching cyclone after cyclone tear through our coast — Sidr, Aila, Fani, Amphan — each one arriving with a different name but the same devastating signature: homes destroyed, harvests lost, children pulled out of school, families pushed deeper into hardship. Year after year, I watched the same communities rebuild, only to be struck down again.

That repetition — of suffering, survival, and starting over — moved something in me that has never left. In 2021, that conviction led me to establish Humanity Public Library, and subsequently the Youth Climate Network (YCN).

Our Mission is to mobilize, equip, and amplify the power of young people to drive transformative action on climate change, environmental justice, and sustainable development — building the capacity of youth leaders and frontline communities, so that no community is left behind.`,
        fullStory_bn: brief.fullStory_bn || '',
      });
    }
  }, [brief]);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadingImage(true);
        const url = await uploadFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, founderImage: url }));
      } catch (err: any) {
        console.error('Image upload failed:', err);
        alert('Image upload failed: ' + (err.message || 'Unknown error'));
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMsg(null);
      await updateFounderBrief({
        ...formData,
        author: formData.founderName,
        authorRole: formData.founderRole,
        image: formData.founderImage,
        articleUrl: formData.articleLink,
        readMoreText: formData.buttonText,
      });
      await mutate();
      setStatusMsg({ text: 'Founder’s Story & Brief successfully saved!', type: 'success' });
    } catch (err: any) {
      console.error('Save failed:', err);
      setStatusMsg({ text: err.message || 'Failed to save changes', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading Founder’s Brief configuration...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#E8521A]">
            <Award size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Our Story / Founder's Brief Management
            </h1>
            <p className="text-xs text-gray-500">
              Control the Founder's section on Homepage & About page, plus the Full Founder's Story modal popup
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowModalPreview(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <BookOpen size={14} /> Preview Full Story Modal
          </button>

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
            style={{ backgroundColor: '#E8521A' }}
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

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ── SECTION 1: BRIEF SECTION ON HOMEPAGE & ABOUT PAGE ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8521A]" />
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-poppins">
              1. Section Header & Introduction
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Section Subtitle / Eyebrow (EN)</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="FOUNDER'S STORY"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Section Subtitle / Eyebrow (BN)</label>
              <input
                type="text"
                value={formData.subtitle_bn}
                onChange={e => setFormData({ ...formData, subtitle_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="প্রতিষ্ঠাতার গল্প"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Headline / Title (EN) *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white font-bold"
                placeholder="From a Simple Belief to a Growing Movement"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Headline / Title (BN)</label>
              <input
                type="text"
                value={formData.title_bn}
                onChange={e => setFormData({ ...formData, title_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white font-bold"
                placeholder="একটি সাধারণ বিশ্বাস থেকে ক্রমবর্ধমান আন্দোলন"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Brief Summary Message (EN) *</label>
              <textarea
                rows={3}
                required
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="YCN Bangladesh began with a simple belief..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Brief Summary Message (BN)</label>
              <textarea
                rows={3}
                value={formData.content_bn}
                onChange={e => setFormData({ ...formData, content_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="ওয়াইসিএন বাংলাদেশ একটি সাধারণ বিশ্বাসের মধ্য দিয়ে শুরু হয়েছিল..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Inspirational Quote (EN)</label>
              <textarea
                rows={2}
                value={formData.quote}
                onChange={e => setFormData({ ...formData, quote: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white italic"
                placeholder="We are not just protecting our environment today..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Inspirational Quote (BN)</label>
              <textarea
                rows={2}
                value={formData.quote_bn}
                onChange={e => setFormData({ ...formData, quote_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white italic"
                placeholder="আমরা কেবল আজকের পরিবেশ রক্ষা করছি না..."
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: FOUNDER DETAILS, PHOTO & VIDEO ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A6B3C]" />
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-poppins">
              2. Founder Profile, Photo & Media Links
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Founder Name *</label>
              <input
                type="text"
                required
                value={formData.founderName}
                onChange={e => setFormData({ ...formData, founderName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="Arafat Hossain Akash"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Founder Title / Designation *</label>
              <input
                type="text"
                required
                value={formData.founderRole}
                onChange={e => setFormData({ ...formData, founderRole: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="Founder & Executive Director, Youth Climate Network"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Founder Portrait Photo</label>
            {formData.founderImage && (
              <div className="relative mb-3 rounded-2xl overflow-hidden aspect-[16/9] max-h-56 border border-gray-200 bg-gray-50 max-w-sm">
                <img src={formData.founderImage} alt="Founder" className="w-full h-full object-cover object-top" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.founderImage}
                onChange={e => setFormData({ ...formData, founderImage: e.target.value })}
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="Paste photo URL..."
              />
              <label className="cursor-pointer px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-1.5 flex-shrink-0">
                <ImageIcon size={14} />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Founder Video URL (Optional)</label>
              <div className="relative">
                <Play size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Read More / Article Link</label>
              <div className="relative">
                <ExternalLink size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.articleLink}
                  onChange={e => setFormData({ ...formData, articleLink: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  placeholder="/about"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text (EN)</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="Read the Full Founder’s Story"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text (BN)</label>
              <input
                type="text"
                value={formData.buttonText_bn}
                onChange={e => setFormData({ ...formData, buttonText_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                placeholder="প্রতিষ্ঠাতার পূর্ণাঙ্গ গল্প পড়ুন"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: FULL FOUNDER STORY (MODAL CONTENT) ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-poppins">
                3. Full Founder's Story (Modal Popup Content)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowModalPreview(true)}
              className="text-xs font-semibold text-[#E8521A] hover:underline"
            >
              Preview Modal
            </button>
          </div>

          <p className="text-xs text-gray-500">
            This detailed story is displayed in the popup modal when visitors click "Read the Full Founder's Story" on the About page or Homepage. Separate paragraphs with blank lines.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Story Paragraphs (EN)</label>
              <textarea
                rows={10}
                value={formData.fullStory}
                onChange={e => setFormData({ ...formData, fullStory: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white leading-relaxed font-inter"
                placeholder="Write the complete journey and story of the founder..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Story Paragraphs (BN / বাংলা)</label>
              <textarea
                rows={10}
                value={formData.fullStory_bn}
                onChange={e => setFormData({ ...formData, fullStory_bn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white leading-relaxed font-inter"
                placeholder="প্রতিষ্ঠাতার সম্পূর্ণ যাত্রা ও অভিজ্ঞতা বাংলায় লিখুন..."
              />
            </div>
          </div>
        </div>

        {/* Save button bottom */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 text-xs font-semibold rounded-xl text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#E8521A' }}
          >
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </form>

      {/* Modal Preview */}
      {showModalPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 relative shadow-2xl">
            <button
              onClick={() => setShowModalPreview(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-4 font-inter text-gray-700 leading-relaxed text-sm">
              <span className="text-xs font-bold text-[#E8521A] uppercase tracking-wider block">
                {formData.subtitle || "FOUNDER'S STORY"} (Modal Preview)
              </span>
              <h3 className="text-2xl font-bold text-gray-900 font-poppins">
                {formData.title || "From a Simple Belief to a Growing Movement"}
              </h3>
              <p className="text-gray-500 text-xs italic">
                By {formData.founderName}, {formData.founderRole}
              </p>

              <div className="pt-4 space-y-4 text-gray-600 border-t border-gray-100">
                {(formData.fullStory || '').split('\n\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowModalPreview(false)}
                  className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
