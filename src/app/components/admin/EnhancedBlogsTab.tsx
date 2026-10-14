import { useState } from 'react';
import {
  FileText, Plus, Edit3, Trash2, Eye, X, Search,
  User, HelpCircle,
  Image as ImageIcon, Upload, Globe
} from 'lucide-react';
import {
  useBlogs, apiBlog, BlogPost, useAuthors, useSDGs, uploadFile, uploadMultipleFiles
} from '../../lib/api';
import { AuthorsTab } from './AuthorsTab';

export function EnhancedBlogsTab() {
  const [subTab, setSubTab] = useState<'posts' | 'authors' | 'sdgs'>('posts');
  const { data: posts = [], mutate: mutatePosts } = useBlogs();
  const { data: authors = [] } = useAuthors();
  const { data: sdgs = [] } = useSDGs();

  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{ available?: boolean; message?: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const blankPost: Partial<BlogPost> = {
    title: '',
    title_bn: '',
    slug: '',
    excerpt: '',
    excerpt_bn: '',
    content: '',
    content_bn: '',
    image: '',
    gallery: [],
    authorId: authors[0]?.id || '',
    category: 'Climate Action',
    tags: ['Climate Action', 'Youth Leadership'],
    sdgIds: [13],
    date: new Date().toISOString(),
    readTime: '6 min read',
    published: true,
    featured: false,
    views: 0,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    ogImage: '',
    noIndex: false,
    geoEntity: 'Youth Climate Network Bangladesh',
    geoSummary: '',
    faqs: [
      { question: 'What is the main goal of this initiative?', answer: 'To build community-level resilience through active youth participation.' }
    ],
    inboundLinks: [],
    outboundLinks: [],
  };

  const handleSlugChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setEditingPost((prev: any) => ({ ...prev, slug: formatted }));
    setSlugStatus(null);
  };

  const checkSlugAvailability = async () => {
    if (!editingPost?.slug) return;
    try {
      setSlugChecking(true);
      const res = await apiBlog.validateSlug(editingPost.slug, editingPost.id);
      setSlugStatus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSlugChecking(false);
    }
  };

  const handleSingleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadingImage(true);
        const url = await uploadFile(e.target.files[0]);
        setEditingPost((prev: any) => ({ ...prev, image: url }));
      } catch (err) {
        alert('Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        setUploadingGallery(true);
        const urls = await uploadMultipleFiles(e.target.files);
        setEditingPost((prev: any) => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...urls]
        }));
      } catch (err) {
        alert('Multiple images upload failed');
      } finally {
        setUploadingGallery(false);
      }
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setEditingPost((prev: any) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_: any, idx: number) => idx !== indexToRemove)
    }));
  };

  const toggleSdg = (sdgNum: number) => {
    const current = editingPost?.sdgIds || [];
    if (current.includes(sdgNum)) {
      setEditingPost({ ...editingPost, sdgIds: current.filter((id: number) => id !== sdgNum) });
    } else {
      setEditingPost({ ...editingPost, sdgIds: [...current, sdgNum] });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      setSaving(true);
      if (isNew) {
        await apiBlog.create(editingPost);
      } else {
        await apiBlog.update(editingPost.id, editingPost);
      }
      mutatePosts();
      setEditingPost(null);
      setIsNew(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await apiBlog.delete(id);
      mutatePosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Sub Tabs Bar */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex gap-2">
          {[
            { key: 'posts', label: 'All Articles', count: posts.length, icon: FileText },
            { key: 'authors', label: 'Author Profiles', count: authors.length, icon: User },
            { key: 'sdgs', label: 'SDGs Reference', count: 17, icon: Globe },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key as any)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                subTab === tab.key
                  ? 'bg-[#0A3320] text-[#F0ECD8] shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-current">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {subTab === 'posts' && (
          <button
            onClick={() => {
              setEditingPost(blankPost);
              setIsNew(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#E8521A] text-white hover:bg-[#c94514] shadow-sm"
          >
            <Plus size={15} /> Write New Article
          </button>
        )}
      </div>

      {/* Render Authors Tab */}
      {subTab === 'authors' && <AuthorsTab />}

      {/* Render SDGs Reference */}
      {subTab === 'sdgs' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">United Nations Sustainable Development Goals (SDGs)</h3>
            <p className="text-xs text-gray-500">
              The 17 global goals supported by YCN Bangladesh programs and articles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sdgs.map(s => (
              <div
                key={s.number}
                className="p-3.5 rounded-xl border border-gray-100 flex items-center gap-3 text-white shadow-sm"
                style={{ backgroundColor: s.color }}
              >
                <span className="text-xl font-black opacity-90">{s.number}</span>
                <span className="text-xs font-bold leading-tight">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Posts List & Form */}
      {subTab === 'posts' && !editingPost && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title or slug..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Article</th>
                  <th className="px-4 py-3.5">Author</th>
                  <th className="px-4 py-3.5">SDGs</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map(post => {
                  const author = authors.find(a => a.id === post.authorId);
                  return (
                    <tr key={post.id} className="hover:bg-gray-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.image || '/placeholder.png'}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block line-clamp-1">{post.title}</span>
                            <span className="text-emerald-700 font-mono text-[11px]">/blog/{post.slug || post.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600 font-medium">{author?.name || 'YCN Team'}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(post.sdgIds || []).map(sdgNum => (
                            <span
                              key={sdgNum}
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                              style={{ backgroundColor: sdgs.find(s => s.number === sdgNum)?.color || '#1A6B3C' }}
                            >
                              SDG {sdgNum}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <a
                          href={`/blog/${post.slug || post.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded inline-block mr-1"
                          title="View live"
                        >
                          <Eye size={15} />
                        </a>
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setIsNew(false);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mr-1"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full-featured Article Editor Form */}
      {subTab === 'posts' && editingPost && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isNew ? 'Create New Article' : 'Edit Article & SEO Settings'}
              </h2>
              <p className="text-xs text-gray-500">Configure content, media, authors, SDGs, and SEO/GEO/AEO properties</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setIsNew(false);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Content Area */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Article Title (English)</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={e => {
                    const title = e.target.value;
                    setEditingPost((prev: any) => ({
                      ...prev,
                      title,
                      slug: isNew && !prev.slug ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
                    }));
                  }}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  placeholder="E.g., Youth Leading Change in Climate-Vulnerable Coastal Communities"
                  required
                />
              </div>

              {/* URL Slug Field with Live Validation */}
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>URL Slug (Individual shareable URL)</span>
                  </label>
                  <button
                    type="button"
                    onClick={checkSlugAvailability}
                    disabled={slugChecking || !editingPost.slug}
                    className="text-[11px] font-semibold text-emerald-800 hover:underline disabled:opacity-50"
                  >
                    {slugChecking ? 'Checking...' : 'Check Availability'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">/blog/</span>
                  <input
                    type="text"
                    value={editingPost.slug || ''}
                    onChange={e => handleSlugChange(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-white border border-gray-200 rounded-lg focus:outline-none"
                    placeholder="youth-leading-change"
                    required
                  />
                </div>
                {slugStatus && (
                  <p className={`text-[11px] font-semibold mt-1.5 ${slugStatus.available ? 'text-emerald-700' : 'text-red-600'}`}>
                    {slugStatus.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Article Excerpt (English)</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt}
                  onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="Short introductory summary shown on cards..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Article Body (Markdown / HTML)</label>
                <textarea
                  rows={14}
                  value={editingPost.content}
                  onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono leading-relaxed"
                  placeholder="Write the full article content here. Use ## Headings for Table of Contents..."
                  required
                />
              </div>

              {/* Multiple Image Gallery Management */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-emerald-700" />
                      <span>Article Image Gallery (Multiple Image Uploads)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500">Upload multiple photo assets to display in article carousels</p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A6B3C] text-white hover:bg-[#14532D]">
                    <Upload size={13} />
                    <span>{uploadingGallery ? 'Uploading...' : 'Add Images'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>

                {editingPost.gallery && editingPost.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {editingPost.gallery.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-white">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                          title="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No gallery images uploaded yet.</p>
                )}
              </div>

              {/* AEO: Answer Engine FAQs */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle size={15} className="text-amber-700" />
                    <h4 className="text-xs font-bold text-amber-900">AEO: Question & Answer Accordion (Featured Snippets)</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost((prev: any) => ({
                        ...prev,
                        faqs: [...(prev.faqs || []), { question: '', answer: '' }]
                      }));
                    }}
                    className="text-[11px] font-semibold text-amber-800 hover:underline"
                  >
                    + Add Q&A Pair
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingPost.faqs || []).map((faq: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={e => {
                            const updated = [...editingPost.faqs];
                            updated[idx].question = e.target.value;
                            setEditingPost({ ...editingPost, faqs: updated });
                          }}
                          placeholder="Question (e.g., How can youth join coastal mangrove restoration?)"
                          className="w-full text-xs font-semibold px-2 py-1 border-b focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingPost.faqs.filter((_: any, i: number) => i !== idx);
                            setEditingPost({ ...editingPost, faqs: updated });
                          }}
                          className="text-gray-400 hover:text-red-600 ml-2"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={e => {
                          const updated = [...editingPost.faqs];
                          updated[idx].answer = e.target.value;
                          setEditingPost({ ...editingPost, faqs: updated });
                        }}
                        placeholder="Concise, authoritative answer optimized for search engine featured snippets..."
                        className="w-full text-xs px-2 py-1 bg-gray-50 rounded border border-gray-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Controls: Author, SDGs, SEO, Image */}
            <div className="md:col-span-4 space-y-4">
              {/* Featured Image */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-700">Featured Cover Image</label>
                {editingPost.image && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <img src={editingPost.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingPost.image || ''}
                    onChange={e => setEditingPost({ ...editingPost, image: e.target.value })}
                    placeholder="Image URL..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                    required
                  />
                  <label className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold bg-gray-200 hover:bg-gray-300 rounded-lg">
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleSingleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Author Selector */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-700">Assigned Author</label>
                <select
                  value={editingPost.authorId || ''}
                  onChange={e => setEditingPost({ ...editingPost, authorId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg"
                  required
                >
                  <option value="">Select Author</option>
                  {authors.map(a => (
                    <option key={a.id} value={a.id}>{a.name} — {a.role}</option>
                  ))}
                </select>
              </div>

              {/* SDGs Selection */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Select Relevant UN SDGs (SDG 1 - 17)
                </label>
                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {sdgs.map(s => {
                    const isSelected = (editingPost.sdgIds || []).includes(s.number);
                    return (
                      <button
                        type="button"
                        key={s.number}
                        onClick={() => toggleSdg(s.number)}
                        title={`SDG ${s.number}: ${s.title}`}
                        className={`h-9 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                          isSelected ? 'ring-2 ring-black scale-105 shadow-sm text-white' : 'opacity-40 hover:opacity-80 text-white'
                        }`}
                        style={{ backgroundColor: s.color }}
                      >
                        {s.number}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dedicated SEO Settings */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <Globe size={14} className="text-emerald-700" />
                  <span>SEO & Social Sharing Metadata</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">SEO Title Tag</label>
                  <input
                    type="text"
                    value={editingPost.metaTitle || ''}
                    onChange={e => setEditingPost({ ...editingPost, metaTitle: e.target.value })}
                    placeholder="Custom SEO Title (defaults to article title)"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={editingPost.metaDescription || ''}
                    onChange={e => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                    placeholder="150-160 characters search preview..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Canonical URL</label>
                  <input
                    type="url"
                    value={editingPost.canonicalUrl || ''}
                    onChange={e => setEditingPost({ ...editingPost, canonicalUrl: e.target.value })}
                    placeholder="https://youthclimatenetwork.org/blog/..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="noIndex"
                    checked={editingPost.noIndex || false}
                    onChange={e => setEditingPost({ ...editingPost, noIndex: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-red-600"
                  />
                  <label htmlFor="noIndex" className="text-xs text-gray-700 cursor-pointer">
                    NoIndex (Hide from Google Search)
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C] shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
