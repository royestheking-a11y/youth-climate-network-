import { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText, Plus, Edit3, Trash2, Eye, X, Search,
  HelpCircle, Upload, Globe, User,
  Sparkles, RefreshCw, Check, AlertCircle,
  Bold, Italic, Underline,
  List, ListOrdered, Link2,
  Wand2, Camera, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  useBlogs, apiBlog, BlogPost, useAuthors, useSDGs, uploadFile, uploadMultipleFiles
} from '../../lib/api';
import { AuthorsTab } from './AuthorsTab';

/**
 * Intelligent content arranger & cleaner:
 * - Fixes paragraph breaks and line-by-line spacing
 * - Strips bad Word/Google Docs formatting and messy inline styles
 * - Converts plain text sections into structured Markdown/HTML
 * - Cleans and normalizes lists and quotes
 */
function smartArrangeContent(raw: string): string {
  if (!raw || !raw.trim()) return '';
  let text = raw.trim();

  const hasHtml = /<\s*(p|div|span|h[1-6]|ul|ol|li|table|blockquote|b|strong|i|em)\b/i.test(text);

  if (hasHtml) {
    // 1. Clean Word, Docs & Web artifact tags
    text = text.replace(/<!--[\s\S]*?-->/g, '');
    text = text.replace(/<\/?(?:o:p|font|span|center|xml)[^>]*>/gi, '');
    // Remove inline styles, classes, IDs, colors
    text = text.replace(/\s*(?:style|class|id|align|dir|face|size|color)=["'][^"']*["']/gi, '');
    text = text.replace(/&nbsp;/g, ' ');

    // Convert <div> into <p>
    text = text.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '<p>$1</p>');
    // Normalize multiple <br> into paragraph boundaries
    text = text.replace(/(?:<br\s*\/?>\s*){2,}/gi, '</p>\n\n<p>');

    // Convert <h1> to <h2>
    text = text.replace(/<h1([^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');

    // Clean empty <p> tags
    text = text.replace(/<p>\s*<\/p>/gi, '');

    // Normalize spacing around block elements
    text = text.replace(/<\/(p|h[2-4]|ul|ol|blockquote)>/gi, '</$1>\n\n');
    text = text.replace(/<(p|h[2-4]|ul|ol|blockquote)[^>]*>/gi, '\n<$1>');
  } else {
    // Plain text / Markdown
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // Normalize smart quotes
    text = text.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");

    const lines = text.split('\n');
    const arrangedBlocks: string[] = [];
    let currentParagraph: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        if (currentParagraph.length > 0) {
          arrangedBlocks.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        continue;
      }

      // Detect Headings (e.g., "## Heading", "Introduction:", "Key Challenges:", "1. Overview")
      const isMdHeading = /^#{1,4}\s+(.+)$/.test(line);
      const isNamedSection = /^(?:Introduction|Background|The Challenge|Key Challenge|Our Approach|Action Plan|Key Impacts?|Results?|What We Learned|Community Response|Call to Action|Conclusion|Summary|Recommendations?):?\s*$/i.test(line);
      const isNumberedHeading = /^(?:\d+\.|\bSection\s+\d+:?)\s+[A-Z][\w\s]{2,60}$/.test(line);

      if (isMdHeading || isNamedSection || isNumberedHeading) {
        if (currentParagraph.length > 0) {
          arrangedBlocks.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        const cleanHeading = line.replace(/^#{1,4}\s+/, '').replace(/:$/, '').trim();
        arrangedBlocks.push(`## ${cleanHeading}`);
        continue;
      }

      // Detect Bullet or Numbered Lists
      const isBullet = /^[-*•—–]\s+(.+)$/.test(line);
      const isNumberedList = /^\d+[\.)]\s+(.+)$/.test(line);

      if (isBullet || isNumberedList) {
        if (currentParagraph.length > 0) {
          arrangedBlocks.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        const bulletText = line.replace(/^[-*•—–]\s+/, '').replace(/^\d+[\.)]\s+/, '').trim();
        arrangedBlocks.push(`- ${bulletText}`);
        continue;
      }

      // Detect Blockquote
      if (/^>\s+(.+)$/.test(line)) {
        if (currentParagraph.length > 0) {
          arrangedBlocks.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        arrangedBlocks.push(line);
        continue;
      }

      currentParagraph.push(line);
    }

    if (currentParagraph.length > 0) {
      arrangedBlocks.push(currentParagraph.join(' '));
    }

    text = arrangedBlocks.join('\n\n');
  }

  // Ensure clean separation between blocks (max 2 newlines)
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Clean Word Paste HTML:
 * Strips Microsoft Word artifacts, Mso classes, conditional comments, and junk XML
 */
function cleanWordPasteHtml(html: string): string {
  if (!html) return '';
  let output = html;

  // Remove Word conditional comments <!--[if ...]>...<![endif]-->
  output = output.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
  output = output.replace(/<!--[\s\S]*?-->/g, '');

  // Remove Office XML tags <o:p>, <w:WordDocument>, <m:math>, etc.
  output = output.replace(/<\/?(?:o:p|w:[^>]+|m:[^>]+|v:[^>]+|xml|meta|link)[^>]*>/gi, '');

  // Remove Mso classes (e.g., class="MsoNormal", class="MsoListParagraph")
  output = output.replace(/\s*class=["']?Mso[a-zA-Z0-9_-]*["']?/gi, '');

  // Clean mso- inline styles
  output = output.replace(/\s*style=["']([^"']*)["']/gi, (_match, styleContent) => {
    const cleaned = styleContent
      .split(';')
      .map((s: string) => s.trim())
      .filter((s: string) => {
        if (!s) return false;
        if (/^mso-/i.test(s)) return false;
        if (/^font-family/i.test(s)) return false;
        if (/^line-height/i.test(s)) return false;
        return true;
      })
      .join('; ');
    return cleaned ? ` style="${cleaned}"` : '';
  });

  // Replace &nbsp;
  output = output.replace(/&nbsp;/g, ' ');
  output = output.replace(/<span\s*>(.*?)<\/span>/gi, '$1');
  output = output.replace(/<p\s*>\s*<\/p>/gi, '');

  return output.trim();
}

/**
 * Auto generate relevant tags based on title, excerpt, content, and category
 */
function generateAutoTags(title: string, excerpt: string = '', content: string = '', category: string = ''): string[] {
  const combined = `${title} ${excerpt} ${category} ${content.slice(0, 2000)}`.toLowerCase();
  const tags = new Set<string>();

  if (category && category !== 'All Stories') {
    tags.add(category);
  }

  const topicKeywords: { regex: RegExp; tag: string }[] = [
    { regex: /\b(youth|student|young|children|future leader)\b/i, tag: 'Youth Leadership' },
    { regex: /\b(climate|global warming|emissions?|carbon|greenhouse)\b/i, tag: 'Climate Action' },
    { regex: /\b(coast|coastal|salin(e|ity)|cyclone|sea level|storm surge)\b/i, tag: 'Coastal Resilience' },
    { regex: /\b(mangrove|sundarbans?|trees?|plant(ing|ation)|afforest)\b/i, tag: 'Mangrove Restoration' },
    { regex: /\b(renewable|solar|clean energy|wind)\b/i, tag: 'Renewable Energy' },
    { regex: /\b(cop\d+|negotiat|unfccc|treaty|policy|advocacy)\b/i, tag: 'Climate Policy' },
    { regex: /\b(loss and damage|compensation|climate finance)\b/i, tag: 'Loss & Damage' },
    { regex: /\b(justice|equity|human rights|vulnerable)\b/i, tag: 'Climate Justice' },
    { regex: /\b(water|drinking water|pond sand|sanitation|wash)\b/i, tag: 'Water Security' },
    { regex: /\b(communit(y|ies)|grassroots|village|indigenous)\b/i, tag: 'Community Adaptation' },
    { regex: /\b(disaster|flood|storm|emergency|resilien(ce|t))\b/i, tag: 'Disaster Preparedness' },
    { regex: /\b(biodiversity|wildlife|forest|ecology|ecosystem)\b/i, tag: 'Biodiversity' },
    { regex: /\b(sdgs?|sustainable development|united nations)\b/i, tag: 'UN SDGs' },
    { regex: /\b(bangladesh|dhaka|khulna|barishal|satkhira|cox'?s bazar|bagerhat)\b/i, tag: 'Bangladesh' },
    { regex: /\b(empower|training|workshop|capacity|volunteer)\b/i, tag: 'Youth Empowerment' },
  ];

  for (const item of topicKeywords) {
    if (item.regex.test(combined)) {
      tags.add(item.tag);
    }
  }

  // Extract strong words from title
  const words = title
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !/^(about|after|before|their|these|those|which|where|while|leading|building|toward|through|during|making)$/i.test(w));

  for (const w of words.slice(0, 2)) {
    const formatted = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    tags.add(formatted);
  }

  if (tags.size === 0) {
    tags.add('Climate Action');
    tags.add('Youth Leadership');
  }

  return Array.from(tags).slice(0, 6);
}

/**
 * Auto generate complete SEO and Social Sharing Metadata
 */
function generateAutoSEO(post: any) {
  const title = (post.title || '').trim();
  const excerpt = (post.excerpt || '').trim();
  const cleanContent = (post.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*`_>\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const slug = (post.slug || '').trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Meta / SEO Title (aim for 50-60 characters)
  let metaTitle = '';
  if (title) {
    if (title.length <= 42) {
      metaTitle = `${title} | Youth Climate Network`;
    } else if (title.length <= 58) {
      metaTitle = `${title} | YCN BD`;
    } else {
      metaTitle = `${title.slice(0, 56)}...`;
    }
  }

  // Meta Description (aim for 140-160 characters)
  let metaDescription = '';
  const sourceText = excerpt || cleanContent;
  if (sourceText) {
    if (sourceText.length <= 155) {
      metaDescription = sourceText;
    } else {
      const sliced = sourceText.slice(0, 152);
      const lastSpace = sliced.lastIndexOf(' ');
      metaDescription = (lastSpace > 110 ? sliced.slice(0, lastSpace) : sliced) + '...';
    }
  }

  // Meta Keywords
  const tagList = Array.isArray(post.tags) && post.tags.length > 0
    ? post.tags
    : generateAutoTags(title, excerpt, cleanContent, post.category);
  const metaKeywords = [...new Set([...tagList, post.category, 'Youth Climate Network', 'Bangladesh', 'Climate Action'])]
    .filter(Boolean)
    .join(', ');

  // Canonical URL
  const canonicalUrl = slug ? `https://youthclimatenetwork.org/blog/${slug}` : 'https://youthclimatenetwork.org/blog';

  // Social / OG Image defaults to cover image
  const ogImage = post.image || '';

  // Calculate Read Time
  const wordCount = cleanContent ? cleanContent.split(/\s+/).filter(Boolean).length : 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return {
    metaTitle,
    seoTitle: metaTitle,
    metaDescription,
    metaKeywords,
    canonicalUrl,
    ogImage,
    readTime,
  };
}

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

  // Rich Article Editor States
  const [editorMode, setEditorMode] = useState<'visual' | 'preview'>('visual');
  const [newTagInput, setNewTagInput] = useState('');
  const [editorLanguageTab, setEditorLanguageTab] = useState<'en' | 'bn'>('en');
  const [autoGenFeedback, setAutoGenFeedback] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Link Dialog
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Visual Word Document Ref
  const visualEditorRef = useRef<HTMLDivElement | null>(null);

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
    authorName: authors[0]?.name || 'Sadia Islam',
    authorRole: authors[0]?.role || 'Program Officer, YCN Bangladesh',
    authorImage: authors[0]?.avatar || authors[0]?.image || '/Formal Image -  Meet our team /5.  Puja Gain -  Volunteer Coordinator.png',
    category: 'Climate Action',
    tags: ['Climate Action', 'Youth Leadership', 'Coastal Resilience'],
    sdgIds: [13],
    date: new Date().toISOString(),
    readTime: '5 min read',
    published: true,
    featured: false,
    views: 0,
    metaTitle: '',
    seoTitle: '',
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
    keyMetrics: [],
    callout: { title: '', title_bn: '', text: '', text_bn: '' },
    inboundLinks: [],
    outboundLinks: [],
  };

  // Sync content into Visual Editor when editing post changes
  useEffect(() => {
    if (visualEditorRef.current && editingPost) {
      const activeContent = (editorLanguageTab === 'bn' ? editingPost.content_bn : editingPost.content) || '';
      if (visualEditorRef.current.innerHTML !== activeContent) {
        visualEditorRef.current.innerHTML = activeContent;
      }
    }
  }, [editingPost?.id, editorLanguageTab]);

  // Calculate live content stats (defined at top level to adhere to Rules of Hooks)
  const contentStats = useMemo(() => {
    if (!editingPost?.content) return { words: 0, chars: 0, readTime: '1 min' };
    const clean = editingPost.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = clean ? clean.split(' ').filter(Boolean).length : 0;
    const chars = clean.length;
    const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
    return { words, chars, readTime };
  }, [editingPost?.content]);

  // Synchronize visual editor input back to state
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const html = visualEditorRef.current.innerHTML;
      setEditingPost((prev: any) => ({
        ...prev,
        [editorLanguageTab === 'bn' ? 'content_bn' : 'content']: html,
      }));
    }
  };

  // Execute standard Word document command
  const executeWordCmd = (cmd: string, val: string | undefined = undefined) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
    }
    document.execCommand(cmd, false, val);
    handleVisualInput();
  };

  // Insert HTML snippet directly into Word document at cursor
  const insertHtmlSnippet = (html: string) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
    }
    document.execCommand('insertHTML', false, html);
    handleVisualInput();
  };

  // Convert title to URL slug
  const formatSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSlugChange = (val: string) => {
    const formatted = formatSlug(val);
    setEditingPost((prev: any) => ({ ...prev, slug: formatted }));
    setSlugStatus(null);
  };

  const handleSyncSlugFromTitle = () => {
    if (!editingPost?.title) return;
    const formatted = formatSlug(editingPost.title);
    setEditingPost((prev: any) => ({
      ...prev,
      slug: formatted,
      canonicalUrl: `https://youthclimatenetwork.org/blog/${formatted}`
    }));
    setSlugStatus(null);
    setAutoGenFeedback('Slug synchronized with article title!');
    setTimeout(() => setAutoGenFeedback(null), 3000);
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

  // Paste handler in Word document
  const handleWordPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const html = e.clipboardData.getData('text/html');
    const plain = e.clipboardData.getData('text/plain');

    if (html) {
      e.preventDefault();
      const cleaned = cleanWordPasteHtml(html);
      insertHtmlSnippet(cleaned);
      setAutoGenFeedback('Pasted Word content cleaned and formatted!');
      setTimeout(() => setAutoGenFeedback(null), 3500);
    } else if (plain) {
      e.preventDefault();
      const arranged = smartArrangeContent(plain);
      insertHtmlSnippet(arranged.replace(/\n\n/g, '<p></p>'));
      setAutoGenFeedback('Pasted text auto-spaced into paragraphs!');
      setTimeout(() => setAutoGenFeedback(null), 3500);
    }
  };

  // Auto-arrange whole content
  const handleAutoArrangeContent = () => {
    if (!editingPost?.content) return;
    const arranged = smartArrangeContent(editingPost.content);
    setEditingPost((prev: any) => ({ ...prev, content: arranged }));
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = arranged;
    }
    setAutoGenFeedback('Article content organized with clean paragraph line-spacing!');
    setTimeout(() => setAutoGenFeedback(null), 3500);
  };




  // Link Insertion
  const handleConfirmLink = () => {
    if (!linkUrl) return;
    const aTag = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-900">${linkText || linkUrl}</a>`;
    insertHtmlSnippet(aTag);
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Auto-generate Tags
  const handleAutoGenerateTags = () => {
    if (!editingPost) return;
    const generated = generateAutoTags(
      editingPost.title || '',
      editingPost.excerpt || '',
      editingPost.content || '',
      editingPost.category || ''
    );
    setEditingPost((prev: any) => ({ ...prev, tags: generated }));
    setAutoGenFeedback(`Auto-generated ${generated.length} relevant topic tags!`);
    setTimeout(() => setAutoGenFeedback(null), 3500);
  };

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed || !editingPost) return;
    const currentTags = editingPost.tags || [];
    if (!currentTags.includes(trimmed)) {
      setEditingPost({ ...editingPost, tags: [...currentTags, trimmed] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingPost) return;
    const currentTags = editingPost.tags || [];
    setEditingPost({ ...editingPost, tags: currentTags.filter((t: string) => t !== tagToRemove) });
  };

  // Auto-generate SEO
  const handleAutoGenerateSEO = () => {
    if (!editingPost) return;
    const seoData = generateAutoSEO(editingPost);
    setEditingPost((prev: any) => ({
      ...prev,
      ...seoData,
    }));
    setAutoGenFeedback('SEO Title, Meta Description, Keywords & Canonical URL auto-generated!');
    setTimeout(() => setAutoGenFeedback(null), 3500);
  };

  // Author Management
  const handleSelectAuthor = (authorId: string) => {
    const author = authors.find(a => a.id === authorId);
    if (author) {
      setEditingPost((prev: any) => ({
        ...prev,
        authorId: author.id,
        authorName: author.name,
        authorRole: author.role,
        authorImage: author.avatar || author.image || prev.authorImage
      }));
    } else {
      setEditingPost((prev: any) => ({ ...prev, authorId }));
    }
  };



  // Extract up to 4 article images (slot 0 = main cover, slots 1-3 = gallery photos)
  const getArticleImages = (post: any): string[] => {
    if (!post) return ['', '', '', ''];
    const list: string[] = [];
    if (post.image && typeof post.image === 'string' && post.image.trim()) {
      list.push(post.image.trim());
    }
    const gallery = post.galleryImages?.length ? post.galleryImages : (post.gallery?.length ? post.gallery : []);
    for (const img of gallery) {
      if (img && typeof img === 'string' && img.trim() && !list.includes(img.trim()) && list.length < 4) {
        list.push(img.trim());
      }
    }
    while (list.length < 4) {
      list.push('');
    }
    return list.slice(0, 4);
  };

  const handleUpdateImageSlot = (slotIdx: number, newUrl: string) => {
    const slots = getArticleImages(editingPost);
    slots[slotIdx] = newUrl.trim();
    const valid = slots.filter(Boolean).slice(0, 4);
    setEditingPost((prev: any) => ({
      ...prev,
      image: valid[0] || '',
      gallery: valid,
      galleryImages: valid,
      ogImage: prev.ogImage || valid[0] || '',
    }));
  };

  const handleRemoveImageSlot = (slotIdx: number) => {
    const slots = getArticleImages(editingPost);
    slots.splice(slotIdx, 1);
    const valid = slots.filter(Boolean).slice(0, 4);
    setEditingPost((prev: any) => ({
      ...prev,
      image: valid[0] || '',
      gallery: valid,
      galleryImages: valid,
      ogImage: valid[0] || '',
    }));
  };

  const handleUploadToSlot = async (slotIdx: number, file: File) => {
    try {
      setUploadingImage(true);
      const url = await uploadFile(file);
      handleUpdateImageSlot(slotIdx, url);
    } catch {
      alert('Photo upload failed. Please try a different image or enter image URL.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBulkUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploadingGallery(true);
      const currentValid = getArticleImages(editingPost).filter(Boolean);
      const remainingSlots = 4 - currentValid.length;
      if (remainingSlots <= 0) {
        alert('Maximum 4 photos allowed. Please remove a photo first if you want to replace it.');
        return;
      }
      const filesToUpload = Array.from(e.target.files).slice(0, remainingSlots);
      const urls = await uploadMultipleFiles(filesToUpload);
      const combined = [...currentValid, ...urls].slice(0, 4);
      setEditingPost((prev: any) => ({
        ...prev,
        image: combined[0] || prev.image || '',
        gallery: combined,
        galleryImages: combined,
        ogImage: prev.ogImage || combined[0] || '',
      }));
    } catch {
      alert('Photos upload failed. Please check file format and try again.');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };



  const toggleSdg = (sdgNum: number) => {
    const current = editingPost?.sdgIds || editingPost?.sdgs || [];
    if (current.includes(sdgNum)) {
      const updated = current.filter((id: number) => id !== sdgNum);
      setEditingPost({ ...editingPost, sdgIds: updated, sdgs: updated });
    } else {
      const updated = [...current, sdgNum];
      setEditingPost({ ...editingPost, sdgIds: updated, sdgs: updated });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (!editingPost.title || !editingPost.title.trim()) {
      alert('Please enter an Article Title before saving.');
      return;
    }

    try {
      setSaving(true);
      const validPhotos = getArticleImages(editingPost).filter(Boolean).slice(0, 4);
      const computedSlug = editingPost.slug && editingPost.slug.trim()
        ? formatSlug(editingPost.slug)
        : formatSlug(editingPost.title);

      const payload = {
        ...editingPost,
        slug: computedSlug,
        image: validPhotos[0] || editingPost.image || '',
        gallery: validPhotos,
        galleryImages: validPhotos,
        seoTitle: editingPost.seoTitle || editingPost.metaTitle || editingPost.title,
        metaTitle: editingPost.metaTitle || editingPost.seoTitle || editingPost.title,
        metaDescription: editingPost.metaDescription || editingPost.excerpt || '',
        ogImage: editingPost.ogImage || validPhotos[0] || editingPost.image || '',
        canonicalUrl: editingPost.canonicalUrl || `https://youthclimatenetwork.org/blog/${computedSlug}`,
        sdgs: editingPost.sdgIds || editingPost.sdgs || [13],
      };

      if (isNew) {
        await apiBlog.create(payload);
      } else {
        await apiBlog.update(editingPost.id, payload);
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
    return p.title.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q) || (p.authorName && p.authorName.toLowerCase().includes(q));
  });


  // Popular topic suggestions
  const popularTopics = [
    'Climate Action', 'Youth Leadership', 'Coastal Resilience',
    'Mangrove Restoration', 'Renewable Energy', 'Climate Policy',
    'Loss & Damage', 'Water Security', 'Community Adaptation', 'Bangladesh'
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {autoGenFeedback && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A3320] text-[#F0ECD8] text-xs font-semibold shadow-2xl border border-emerald-500/30">
          <Sparkles size={15} className="text-[#E8521A]" />
          <span>{autoGenFeedback}</span>
        </div>
      )}

      {/* Sub Tabs Bar */}
      <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-3">
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

        {subTab === 'posts' && !editingPost && (
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
                <span className="text-xs font-bold leading-tight">{s.title || s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Posts List */}
      {subTab === 'posts' && !editingPost && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title, slug, or author..."
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
                  <th className="px-4 py-3.5">Category & Tags</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No articles found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map(post => {
                    const author = authors.find(a => a.id === post.authorId);
                    const authorDisplayName = post.authorName || author?.name || 'YCN Contributor';
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
                        <td className="px-4 py-4 text-gray-600 font-medium">
                          <div className="flex items-center gap-2">
                            {post.authorImage && (
                              <img src={post.authorImage} alt="" className="w-5 h-5 rounded-full object-cover" />
                            )}
                            <span className="truncate max-w-[140px]">{authorDisplayName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {post.category || 'Climate'}
                            </span>
                            {(post.tags || []).slice(0, 2).map((tg: string, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">
                                #{tg}
                              </span>
                            ))}
                            {(post.tags || []).length > 2 && (
                              <span className="text-[10px] text-gray-400">+{(post.tags || []).length - 2}</span>
                            )}
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
                              const existingAuthor = authors.find(a => a.id === post.authorId);
                              setEditingPost({
                                ...post,
                                authorName: post.authorName || existingAuthor?.name || '',
                                authorRole: post.authorRole || existingAuthor?.role || '',
                                authorImage: post.authorImage || existingAuthor?.avatar || existingAuthor?.image || '',
                                metaTitle: post.metaTitle || post.seoTitle || '',
                                seoTitle: post.seoTitle || post.metaTitle || '',
                              });
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────
          EASY & INTUITIVE ARTICLE EDITOR (Simple for Non-Technical Users)
         ────────────────────────────────────────────────────────────── */}
      {subTab === 'posts' && editingPost && (() => {
        const currentPhotos = getArticleImages(editingPost);
        const validPhotosCount = currentPhotos.filter(Boolean).length;
        const activeTitle = (editorLanguageTab === 'bn' ? editingPost.title_bn : editingPost.title) || '';
        const activeExcerpt = (editorLanguageTab === 'bn' ? editingPost.excerpt_bn : editingPost.excerpt) || '';

        return (
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 space-y-6">
            
            {/* ── TOP HEADER & QUICK ACTIONS ── */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5 flex-wrap gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1A6B3C] border border-emerald-200 flex items-center justify-center shadow-xs">
                  <FileText size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 font-poppins">
                    {isNew ? 'Create New Article' : 'Edit Article'}
                  </h2>
                  <p className="text-xs text-gray-500 font-inter">
                    Simple 4-step editor. Just add your title, upload photos (up to 4), and write your story.
                  </p>
                </div>
              </div>

              {/* Language Switcher & Quick Save Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Language Tab */}
                <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditorLanguageTab('en')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-inter ${
                      editorLanguageTab === 'en'
                        ? 'bg-white text-gray-900 font-bold shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorLanguageTab('bn')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-inter ${
                      editorLanguageTab === 'bn'
                        ? 'bg-white text-gray-900 font-bold shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    বাংলা (Bengali)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
                    setIsNew(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-[#0A3320] hover:bg-[#1A6B3C] text-[#F0ECD8] shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : (isNew ? 'Publish Article' : 'Save Changes')}</span>
                </button>
              </div>
            </div>

            {/* Auto-gen / feedback banner if any */}
            {autoGenFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <Sparkles size={14} className="text-emerald-600" />
                <span>{autoGenFeedback}</span>
              </div>
            )}

            {/* ── STEP 1: ARTICLE BASICS (TITLE, CATEGORY, SUMMARY) ── */}
            <div className="bg-[#FAF9F5] p-5 sm:p-6 rounded-2xl border border-gray-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A6B3C] text-white text-xs font-bold flex items-center justify-center font-mono">1</span>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-inter">
                  Article Basics {editorLanguageTab === 'bn' ? '(প্রাথমিক তথ্য - বাংলা)' : '(Basic Info)'}
                </h3>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 font-inter">
                  Article Headline / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={activeTitle}
                  onChange={e => {
                    const val = e.target.value;
                    if (editorLanguageTab === 'bn') {
                      setEditingPost({ ...editingPost, title_bn: val });
                    } else {
                      setEditingPost((prev: any) => ({
                        ...prev,
                        title: val,
                        slug: isNew && (!prev.slug || prev.slug === formatSlug(prev.title)) ? formatSlug(val) : prev.slug,
                        canonicalUrl: isNew && (!prev.canonicalUrl || prev.canonicalUrl.includes('/blog/'))
                          ? `https://youthclimatenetwork.org/blog/${formatSlug(val)}`
                          : prev.canonicalUrl
                      }));
                    }
                  }}
                  className="w-full px-4 py-3 text-sm sm:text-base font-bold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A6B3C]/20 focus:border-[#1A6B3C] text-gray-900"
                  placeholder={editorLanguageTab === 'bn' ? 'নিবন্ধের শিরোনাম লিখুন (যেমন: উপকূলীয় যুবদের ম্যানগ্রোভ পুনরুজ্জীবন উদ্যোগ)' : 'e.g. Coastal Youth Lead Mangrove Reforestation in Khulna'}
                  required={editorLanguageTab === 'en'}
                />
              </div>

              {/* Category, Status & Feature toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-inter">
                    Article Category
                  </label>
                  <select
                    value={editingPost.category || 'Climate Action'}
                    onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-gray-300 rounded-xl focus:border-[#1A6B3C]"
                  >
                    <option value="Climate Action">🌱 Climate Action (জলবায়ু পদক্ষেপ)</option>
                    <option value="Youth Leadership">✊ Youth Leadership (যুব নেতৃত্ব)</option>
                    <option value="Coastal Resilience">🌊 Coastal Resilience (উপকূলীয় সহনশীলতা)</option>
                    <option value="Policy & Advocacy">📢 Policy & Advocacy (নীতি ও অ্যাডভোকেসি)</option>
                    <option value="Loss and Damage">⚖️ Loss and Damage (ক্ষয়ক্ষতি তহবিল)</option>
                    <option value="Renewable Energy">⚡ Renewable Energy (নবায়নযোগ্য শক্তি)</option>
                    <option value="Field Action">🌾 Field Action (মাঠ পর্যায়ের কাজ)</option>
                    <option value="Community Voices">🗣️ Community Voices (তৃণমূলের কথা)</option>
                  </select>
                </div>

                <div className="sm:col-span-6 flex items-center gap-5 sm:pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingPost.published !== false}
                      onChange={e => setEditingPost({ ...editingPost, published: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1A6B3C] accent-[#1A6B3C]"
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingPost.featured || false}
                      onChange={e => setEditingPost({ ...editingPost, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#E8521A] accent-[#E8521A]"
                    />
                    <span>Highlight as Featured Article</span>
                  </label>
                </div>
              </div>

              {/* Short Summary (Excerpt) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-inter">
                  Short Article Summary / Excerpt (1-2 sentences)
                </label>
                <textarea
                  rows={2}
                  value={activeExcerpt}
                  onChange={e => {
                    const val = e.target.value;
                    if (editorLanguageTab === 'bn') {
                      setEditingPost({ ...editingPost, excerpt_bn: val });
                    } else {
                      setEditingPost({ ...editingPost, excerpt: val });
                    }
                  }}
                  className="w-full px-4 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:bg-white focus:border-[#1A6B3C] leading-relaxed"
                  placeholder={editorLanguageTab === 'bn' ? 'সংক্ষিপ্ত ১-২ লাইনের বিবরণ যা কার্ডে ও সোশ্যাল মিডিয়ায় প্রদর্শিত হবে...' : 'Short engaging introductory summary displayed on the blog card and social previews...'}
                />
              </div>
            </div>

            {/* ── STEP 2: ARTICLE PHOTOS (MAXIMUM 4 PHOTOS) ── */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A6B3C] text-white text-xs font-bold flex items-center justify-center font-mono">2</span>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-inter">
                      Article Photos (Maximum 4 Photos)
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 font-mono">
                      {validPhotosCount} / 4 Added
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-inter">
                    Photo 1 is the <strong>Main Cover Photo</strong> shown at the top of the article. Additional photos automatically create a photo gallery in the article.
                  </p>
                </div>

                {/* Bulk Upload Button */}
                {validPhotosCount < 4 && (
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1A6B3C] hover:bg-[#14532D] text-white shadow-xs transition-all">
                    <Upload size={14} />
                    <span>{uploadingGallery ? 'Uploading...' : '+ Upload Multiple Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleBulkUploadImages}
                      className="hidden"
                      disabled={uploadingGallery}
                    />
                  </label>
                )}
              </div>

              {/* 4 Photo Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const imgUrl = currentPhotos[slotIdx] || '';
                  const isCover = slotIdx === 0;

                  return (
                    <div
                      key={slotIdx}
                      className={`relative rounded-2xl border-2 transition-all p-3.5 flex flex-col justify-between ${
                        imgUrl
                          ? 'border-emerald-500/40 bg-emerald-50/20 shadow-xs'
                          : 'border-dashed border-gray-200 hover:border-emerald-400 bg-gray-50/50'
                      }`}
                    >
                      {/* Slot Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-inter ${
                          isCover
                            ? 'bg-[#E8521A] text-white shadow-2xs'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {isCover ? '⭐ Photo 1 (Main Cover)' : `Photo ${slotIdx + 1} (Gallery)`}
                        </span>
                        {imgUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImageSlot(slotIdx)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>

                      {/* Slot Body: Image Preview OR Upload Dropzone */}
                      {imgUrl ? (
                        <div className="space-y-2">
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-900 border border-gray-200 relative group shadow-inner">
                            <img
                              src={imgUrl}
                              alt={`Slot ${slotIdx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 pt-1">
                            <input
                              type="text"
                              value={imgUrl}
                              onChange={(e) => handleUpdateImageSlot(slotIdx, e.target.value)}
                              placeholder="Image URL..."
                              className="flex-1 text-[11px] px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 truncate"
                            />
                            <label className="cursor-pointer px-2 py-1 text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors whitespace-nowrap">
                              <span>Replace</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) handleUploadToSlot(slotIdx, e.target.files[0]);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 flex flex-col items-center justify-center text-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#1A6B3C] flex items-center justify-center mb-2">
                            <Camera size={18} />
                          </div>
                          <p className="text-xs font-bold text-gray-700 mb-0.5">
                            {isCover ? 'Add Cover Photo' : `Add Photo ${slotIdx + 1}`}
                          </p>
                          <p className="text-[10px] text-gray-400 mb-3">JPG, PNG, or WebP</p>
                          <div className="flex flex-col w-full gap-1.5">
                            <label className="cursor-pointer w-full py-1.5 px-2 rounded-lg bg-white border border-gray-300 hover:border-emerald-600 text-[11px] font-bold text-gray-800 hover:text-emerald-700 shadow-2xs transition-all flex items-center justify-center gap-1">
                              <Upload size={12} />
                              <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) handleUploadToSlot(slotIdx, e.target.files[0]);
                                }}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or paste image URL"
                              onBlur={(e) => {
                                if (e.target.value.trim()) handleUpdateImageSlot(slotIdx, e.target.value.trim());
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if ((e.target as HTMLInputElement).value.trim()) {
                                    handleUpdateImageSlot(slotIdx, (e.target as HTMLInputElement).value.trim());
                                  }
                                }
                              }}
                              className="w-full text-[10px] px-2 py-1 bg-white border border-gray-200 rounded text-center text-gray-600 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── STEP 3: ARTICLE STORY & WRITING CANVAS ── */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A6B3C] text-white text-xs font-bold flex items-center justify-center font-mono">3</span>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-inter">
                    Article Story / Content {editorLanguageTab === 'bn' ? '(নিবন্ধের বিস্তারিত বিষয়বস্তু)' : ''}
                  </h3>
                  <span className="text-[11px] text-gray-500 font-mono bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                    {contentStats.words} words · ~{contentStats.readTime}
                  </span>
                </div>

                {/* View Mode Toggle: Visual vs Live Preview */}
                <div className="flex rounded-lg bg-gray-100 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditorMode('visual')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                      editorMode === 'visual' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Edit3 size={13} className="text-emerald-700" />
                    <span>Visual Writer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                      editorMode === 'preview' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye size={13} />
                    <span>Live Preview</span>
                  </button>
                </div>
              </div>

              {/* Writing Canvas Container */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
                {/* Clean, Non-Technical Toolbar */}
                <div className="bg-gray-50/90 px-3 py-2 border-b border-gray-200 flex items-center justify-between flex-wrap gap-1.5 text-xs">
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Style selector */}
                    <select
                      onChange={e => {
                        const val = e.target.value;
                        if (val === 'p') executeWordCmd('formatBlock', '<p>');
                        else if (val === 'h2') executeWordCmd('formatBlock', '<h2>');
                        else if (val === 'h3') executeWordCmd('formatBlock', '<h3>');
                        else if (val === 'blockquote') executeWordCmd('formatBlock', '<blockquote>');
                      }}
                      className="px-2.5 py-1 text-xs bg-white border border-gray-200 rounded-lg font-semibold text-gray-800 focus:outline-none"
                      defaultValue="p"
                    >
                      <option value="p">Paragraph (সাধারণ লেখা)</option>
                      <option value="h2">Section Heading (মূল শিরোনাম)</option>
                      <option value="h3">Subsection (উপ-শিরোনাম)</option>
                      <option value="blockquote">Quote Block (উদ্ধৃতি)</option>
                    </select>

                    <div className="h-4 w-px bg-gray-200 mx-1" />

                    {/* Standard B, I, U */}
                    <button
                      type="button"
                      onClick={() => executeWordCmd('bold')}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold cursor-pointer"
                      title="Bold (Ctrl+B)"
                    >
                      <Bold size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('italic')}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                      title="Italic (Ctrl+I)"
                    >
                      <Italic size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('underline')}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                      title="Underline (Ctrl+U)"
                    >
                      <Underline size={15} />
                    </button>

                    <div className="h-4 w-px bg-gray-200 mx-1" />

                    {/* Lists */}
                    <button
                      type="button"
                      onClick={() => executeWordCmd('insertUnorderedList')}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                      title="Bullet List"
                    >
                      <List size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('insertOrderedList')}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                      title="Numbered List"
                    >
                      <ListOrdered size={15} />
                    </button>

                    {/* Link */}
                    <button
                      type="button"
                      onClick={() => setShowLinkDialog(!showLinkDialog)}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                      title="Insert Website Link"
                    >
                      <Link2 size={15} />
                    </button>
                  </div>

                  {/* Helpers: Space Formatting & Clean Word */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleAutoArrangeContent}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                      title="Automatically clean up line spacing between paragraphs"
                    >
                      <Sparkles size={12} className="text-emerald-700" />
                      <span>Clean Spacing</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (visualEditorRef.current) {
                          const cleaned = cleanWordPasteHtml(visualEditorRef.current.innerHTML);
                          visualEditorRef.current.innerHTML = cleaned;
                          handleVisualInput();
                          setAutoGenFeedback('Word styles cleaned!');
                          setTimeout(() => setAutoGenFeedback(null), 3000);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                      title="Remove weird Word or Docs formatting"
                    >
                      <Wand2 size={12} />
                      <span>Clean Word Text</span>
                    </button>
                  </div>
                </div>

                {/* Hyperlink Dialog */}
                {showLinkDialog && (
                  <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-2 flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <Link2 size={13} /> Link:
                    </span>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="px-2 py-1 text-xs bg-white border border-emerald-300 rounded focus:outline-none flex-1 max-w-xs"
                    />
                    <input
                      type="text"
                      value={linkText}
                      onChange={e => setLinkText(e.target.value)}
                      placeholder="Link display text"
                      className="px-2 py-1 text-xs bg-white border border-emerald-300 rounded focus:outline-none max-w-xs"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmLink}
                      className="px-2.5 py-1 rounded bg-[#1A6B3C] text-white font-bold hover:bg-[#14532D] cursor-pointer text-[11px]"
                    >
                      Add Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLinkDialog(false)}
                      className="p-1 rounded text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                {/* Writing Body */}
                <div className="max-h-[550px] overflow-y-auto">
                  {editorMode === 'visual' && (
                    <div
                      ref={visualEditorRef}
                      contentEditable
                      onInput={handleVisualInput}
                      onPaste={handleWordPaste}
                      spellCheck={true}
                      className="w-full min-h-[380px] bg-white p-6 sm:p-8 focus:outline-none font-inter text-gray-900 leading-relaxed text-[15px] space-y-4 [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-emerald-950 [&>h2]:font-poppins [&>h2]:mt-6 [&>h2]:mb-2.5 [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:font-poppins [&>h3]:mt-5 [&>h3]:mb-2 [&>p]:mb-4 [&>p]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-600 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:italic [&>blockquote]:bg-emerald-50/60 [&>blockquote]:rounded-r-xl [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5 [&>ul]:my-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-1.5 [&>ol]:my-4"
                    />
                  )}

                  {editorMode === 'preview' && (
                    <div className="w-full min-h-[380px] p-6 sm:p-8 bg-[#FAF9F5] overflow-y-auto">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b flex items-center justify-between">
                        <span>Live Reader Preview</span>
                        <span className="text-emerald-800 font-mono">/blog/{editingPost.slug || 'article'}</span>
                      </div>
                      {editingPost.content ? (
                        <div
                          className="prose prose-lg max-w-none text-gray-800 font-inter space-y-4 leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-950 [&>h2]:font-poppins [&>p]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-[#1A6B3C] [&>blockquote]:pl-6 [&>blockquote]:py-2.5 [&>blockquote]:italic [&>blockquote]:bg-emerald-50/50 [&>blockquote]:rounded-r-2xl"
                          dangerouslySetInnerHTML={{ __html: smartArrangeContent(editingPost.content) }}
                        />
                      ) : (
                        <p className="text-gray-400 italic text-center py-16">No content written yet. Switch to Visual Writer to begin.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── STEP 4: AUTHOR & UN SDGS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Author Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#1A6B3C] text-white text-xs font-bold flex items-center justify-center font-mono">4</span>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-inter">
                    Author Details
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Select From System Authors
                  </label>
                  <select
                    value={editingPost.authorId || ''}
                    onChange={e => handleSelectAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  >
                    <option value="">-- Choose Existing Team Author --</option>
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={editingPost.authorName || ''}
                      onChange={e => setEditingPost({ ...editingPost, authorName: e.target.value })}
                      placeholder="e.g. Sadia Islam"
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Author Role</label>
                    <input
                      type="text"
                      value={editingPost.authorRole || ''}
                      onChange={e => setEditingPost({ ...editingPost, authorRole: e.target.value })}
                      placeholder="e.g. Program Officer"
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* UN SDGs Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A6B3C] text-white text-xs font-bold flex items-center justify-center font-mono">5</span>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-inter">
                      UN SDGs (Click to Select)
                    </h3>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {(editingPost.sdgIds || editingPost.sdgs || []).length} selected
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-inter">
                  Select which UN Sustainable Development Goals this initiative aligns with.
                </p>

                <div className="grid grid-cols-6 sm:grid-cols-6 gap-1.5 pt-1 max-h-36 overflow-y-auto">
                  {sdgs.map(s => {
                    const isSelected = (editingPost.sdgIds || editingPost.sdgs || []).includes(s.number);
                    return (
                      <button
                        type="button"
                        key={s.number}
                        onClick={() => toggleSdg(s.number)}
                        title={`SDG ${s.number}: ${s.title || s.name}`}
                        className={`h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-black scale-105 shadow-sm text-white' : 'opacity-30 hover:opacity-80 text-white'
                        }`}
                        style={{ backgroundColor: s.color }}
                      >
                        {s.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── STEP 5: ADVANCED OPTIONS (COLLAPSIBLE ACCORDION, COLLAPSED BY DEFAULT) ── */}
            <div className="bg-gray-50/70 rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-100/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Globe size={18} className="text-emerald-700" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 font-inter">
                      Advanced Options (SEO, Custom URL Slug, Search Preview & Extra Features)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Optional: automatically generated from your title and summary if left blank.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <span>{showAdvancedSettings ? 'Hide Options' : 'Show Options'}</span>
                  {showAdvancedSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {showAdvancedSettings && (
                <div className="p-5 sm:p-6 border-t border-gray-200 bg-white space-y-6">
                  {/* Custom URL Slug */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800">
                        Custom Web Address (URL Slug)
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSyncSlugFromTitle}
                          className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <RefreshCw size={11} /> Sync from Title
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={checkSlugAvailability}
                          disabled={slugChecking || !editingPost.slug}
                          className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer disabled:opacity-50"
                        >
                          {slugChecking ? 'Checking...' : 'Check Availability'}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        https://youthclimatenetwork.org/blog/
                      </span>
                      <input
                        type="text"
                        value={editingPost.slug || ''}
                        onChange={e => handleSlugChange(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A6B3C]"
                        placeholder="article-slug"
                      />
                    </div>
                    {slugStatus && (
                      <div className={`flex items-center gap-1.5 text-[11px] font-semibold pt-1 ${
                        slugStatus.available ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {slugStatus.available ? <Check size={13} /> : <AlertCircle size={13} />}
                        <span>{slugStatus.message || (slugStatus.available ? 'Slug is available!' : 'Slug is taken')}</span>
                      </div>
                    )}
                  </div>

                  {/* SEO Metadata */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800">
                        Google Search & Social Sharing SEO
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateSEO}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <Sparkles size={11} className="text-amber-500" />
                        <span>Auto-Generate SEO from Content</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Google Search Title (Meta Title)
                        </label>
                        <input
                          type="text"
                          value={editingPost.metaTitle || editingPost.seoTitle || ''}
                          onChange={e => setEditingPost({ ...editingPost, metaTitle: e.target.value, seoTitle: e.target.value })}
                          placeholder="Custom Google title (defaults to article headline)"
                          className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Google Search Description (Meta Description)
                        </label>
                        <input
                          type="text"
                          value={editingPost.metaDescription || ''}
                          onChange={e => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                          placeholder="1-2 sentences shown on Google search results"
                          className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Topic Tags */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-700">
                        Search Tags & Topics
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateTags}
                        className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <Sparkles size={11} className="text-amber-500" /> Auto-Suggest Tags
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(editingPost.tags || []).map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-gray-400 hover:text-red-600 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={e => setNewTagInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(newTagInput);
                          }
                        }}
                        placeholder="Type a tag and press Enter..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag(newTagInput)}
                        className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg cursor-pointer"
                      >
                        Add Tag
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[10px] text-gray-400">Popular:</span>
                      {popularTopics.slice(0, 6).map(pt => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => handleAddTag(pt)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-600 transition-colors"
                        >
                          +{pt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AEO Q&A FAQs */}
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <HelpCircle size={14} className="text-amber-700" />
                        <span>Optional Q&A FAQs for this Article</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost((prev: any) => ({
                            ...prev,
                            faqs: [...(prev.faqs || []), { question: '', answer: '' }]
                          }));
                        }}
                        className="text-[11px] font-semibold text-amber-900 hover:underline cursor-pointer"
                      >
                        + Add Question
                      </button>
                    </div>

                    {(editingPost.faqs || []).map((faq: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-amber-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={e => {
                              const updated = [...editingPost.faqs];
                              updated[idx].question = e.target.value;
                              setEditingPost({ ...editingPost, faqs: updated });
                            }}
                            placeholder="Question..."
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
                            <X size={13} />
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
                          placeholder="Authoritative answer..."
                          className="w-full text-xs px-2 py-1 bg-gray-50 rounded border border-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── BOTTOM ACTIONS ── */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setIsNew(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0A3320] hover:bg-[#1A6B3C] text-[#F0ECD8] shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Check size={14} />
                <span>{saving ? 'Saving Article...' : (isNew ? 'Publish Article' : 'Save Changes')}</span>
              </button>
            </div>
          </form>
        );
      })()}
    </div>
  );
}
