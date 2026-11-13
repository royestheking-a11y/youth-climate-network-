import { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText, Plus, Edit3, Trash2, Eye, X, Search,
  User, HelpCircle, Image as ImageIcon, Upload, Globe,
  Sparkles, RefreshCw, Check, AlertCircle,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Indent, Outdent,
  Highlighter, Type, Table, Quote, Minus, Link2,
  Eraser, Replace, Maximize2, Minimize2, Wand2, Zap,
  Info, Code
} from 'lucide-react';
import {
  useBlogs, apiBlog, BlogPost, useAuthors, apiAuthors, useSDGs, uploadFile, uploadMultipleFiles
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
  const { data: authors = [], mutate: mutateAuthors } = useAuthors();
  const { data: sdgs = [] } = useSDGs();

  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAuthorAvatar, setUploadingAuthorAvatar] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{ available?: boolean; message?: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Rich Article Editor States
  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoArrangeOnPaste, setAutoArrangeOnPaste] = useState(true);
  const [newTagInput, setNewTagInput] = useState('');
  const [editorLanguageTab, setEditorLanguageTab] = useState<'en' | 'bn'>('en');
  const [authorSaveStatus, setAuthorSaveStatus] = useState<string | null>(null);
  const [savingAuthorToSystem, setSavingAuthorToSystem] = useState(false);
  const [autoGenFeedback, setAutoGenFeedback] = useState<string | null>(null);

  // Find & Replace
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

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
    if (!autoArrangeOnPaste) return;
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      e.preventDefault();
      const cleaned = cleanWordPasteHtml(html);
      insertHtmlSnippet(cleaned);
      setAutoGenFeedback('Pasted Word content cleaned and formatted!');
      setTimeout(() => setAutoGenFeedback(null), 3500);
    } else if (text) {
      e.preventDefault();
      const arranged = smartArrangeContent(text);
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

  // Find and replace all
  const handleFindReplaceAll = () => {
    if (!findText) return;
    const activeKey = editorLanguageTab === 'bn' ? 'content_bn' : 'content';
    const current = editingPost[activeKey] || '';
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const count = (current.match(regex) || []).length;
    if (count === 0) {
      alert(`No matches found for "${findText}"`);
      return;
    }
    const updated = current.replace(regex, replaceText);
    setEditingPost((prev: any) => ({ ...prev, [activeKey]: updated }));
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = updated;
    }
    setAutoGenFeedback(`Replaced ${count} instance(s) of "${findText}"`);
    setTimeout(() => setAutoGenFeedback(null), 3500);
  };

  // Insert Table
  const handleInsertTable = (rows: number = 3, cols: number = 3) => {
    let tableHtml = '<table class="w-full my-4 border-collapse border border-gray-300 text-sm"><thead><tr class="bg-gray-100">';
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th class="border border-gray-300 p-2.5 font-bold text-left">Header ${c}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 1; r <= rows; r++) {
      tableHtml += '<tr>';
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td class="border border-gray-300 p-2.5">Row ${r} Col ${c}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p></p>';
    insertHtmlSnippet(tableHtml);
  };

  // Insert Callout Box
  const handleInsertCallout = (type: 'info' | 'climate' | 'warning' | 'quote') => {
    let calloutHtml = '';
    if (type === 'info') {
      calloutHtml = '<div class="my-5 p-4 rounded-xl bg-blue-50 border-l-4 border-blue-600 text-blue-950 font-inter"><p class="font-bold text-sm mb-1">Key Context & Information</p><p class="text-xs text-blue-900 leading-relaxed">Provide background research, policy context, or community statistics here...</p></div><p></p>';
    } else if (type === 'climate') {
      calloutHtml = '<div class="my-5 p-4 rounded-xl bg-emerald-50 border-l-4 border-[#1A6B3C] text-emerald-950 font-inter"><p class="font-bold text-sm mb-1">Climate Action Impact</p><p class="text-xs text-emerald-900 leading-relaxed">Over 15,000 mangrove seedlings planted across coastal embankment sites in Satkhira.</p></div><p></p>';
    } else if (type === 'warning') {
      calloutHtml = '<div class="my-5 p-4 rounded-xl bg-amber-50 border-l-4 border-amber-600 text-amber-950 font-inter"><p class="font-bold text-sm mb-1">Urgent Alert</p><p class="text-xs text-amber-900 leading-relaxed">Rising salinity levels threatening freshwater supplies in vulnerable delta villages.</p></div><p></p>';
    } else if (type === 'quote') {
      calloutHtml = '<blockquote class="my-6 pl-6 py-3 border-l-4 border-[#E8521A] bg-orange-50/50 rounded-r-2xl italic text-gray-900 font-poppins text-lg"><p>"Empowering youth is not just an alternative — it is our primary survival strategy against accelerating climate emergencies."</p><cite class="block text-xs font-bold text-gray-500 mt-2 not-italic">— Youth Climate Network Bangladesh</cite></blockquote><p></p>';
    }
    insertHtmlSnippet(calloutHtml);
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

  const handleSaveAuthorToSystem = async () => {
    if (!editingPost?.authorName) {
      alert('Please enter an Author Name first.');
      return;
    }
    try {
      setSavingAuthorToSystem(true);
      const newAuthor = await apiAuthors.create({
        name: editingPost.authorName,
        role: editingPost.authorRole || 'YCN Contributor',
        avatar: editingPost.authorImage || '',
        image: editingPost.authorImage || '',
      });
      await mutateAuthors();
      setEditingPost((prev: any) => ({ ...prev, authorId: newAuthor.id }));
      setAuthorSaveStatus('Author profile saved to system!');
      setTimeout(() => setAuthorSaveStatus(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to save author to system');
    } finally {
      setSavingAuthorToSystem(false);
    }
  };

  // Image Uploads
  const handleSingleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadingImage(true);
        const url = await uploadFile(e.target.files[0]);
        setEditingPost((prev: any) => ({
          ...prev,
          image: url,
          ogImage: prev.ogImage || url
        }));
      } catch {
        alert('Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleAuthorAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadingAuthorAvatar(true);
        const url = await uploadFile(e.target.files[0]);
        setEditingPost((prev: any) => ({ ...prev, authorImage: url }));
      } catch {
        alert('Avatar upload failed');
      } finally {
        setUploadingAuthorAvatar(false);
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
          gallery: [...(prev.gallery || []), ...urls],
          galleryImages: [...(prev.galleryImages || []), ...urls],
        }));
      } catch {
        alert('Multiple images upload failed');
      } finally {
        setUploadingGallery(false);
      }
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setEditingPost((prev: any) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_: any, idx: number) => idx !== indexToRemove),
      galleryImages: (prev.galleryImages || []).filter((_: any, idx: number) => idx !== indexToRemove),
    }));
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

    try {
      setSaving(true);
      const payload = {
        ...editingPost,
        seoTitle: editingPost.seoTitle || editingPost.metaTitle || editingPost.title,
        metaTitle: editingPost.metaTitle || editingPost.seoTitle || editingPost.title,
        ogImage: editingPost.ogImage || editingPost.image,
        galleryImages: editingPost.gallery || editingPost.galleryImages || [],
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

  // Calculate live content stats
  const contentStats = useMemo(() => {
    if (!editingPost?.content) return { words: 0, chars: 0, readTime: '1 min' };
    const clean = editingPost.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = clean ? clean.split(' ').filter(Boolean).length : 0;
    const chars = clean.length;
    const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
    return { words, chars, readTime };
  }, [editingPost?.content]);

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
          FULL-FEATURED ARTICLE EDITOR FORM
         ────────────────────────────────────────────────────────────── */}
      {subTab === 'posts' && editingPost && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {isNew ? 'Create New Article' : 'Edit Article, Author & SEO'}
                </h2>
                <p className="text-xs text-gray-500">
                  Rich WYSIWYG article editor, automated topic tags, one-click SEO & social sharing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-gray-100 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEditorLanguageTab('en')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    editorLanguageTab === 'en' ? 'bg-white shadow text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setEditorLanguageTab('bn')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    editorLanguageTab === 'bn' ? 'bg-white shadow text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
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
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Close editor"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* ── LEFT COLUMN (Main Content Area) ── */}
            <div className="md:col-span-8 space-y-5">
              
              {/* Title & Auto Slug Section */}
              <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-800">
                      Article Title {editorLanguageTab === 'bn' ? '(বাংলা)' : '(English)'}
                    </label>
                    <span className="text-[11px] text-gray-400">
                      {(editingPost[editorLanguageTab === 'bn' ? 'title_bn' : 'title'] || '').length} characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editorLanguageTab === 'bn' ? (editingPost.title_bn || '') : editingPost.title}
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
                    className="w-full px-4 py-2.5 text-sm font-semibold bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A6B3C]/20 focus:border-[#1A6B3C]"
                    placeholder={editorLanguageTab === 'bn' ? 'নিবন্ধের শিরোনাম লিখুন...' : 'E.g., Coastal Youth Mobilize for Climate Resilience & Mangrove Defense'}
                    required={editorLanguageTab === 'en'}
                  />
                </div>

                {/* URL Slug with Auto-generate & Live Check */}
                <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                      <Globe size={13} className="text-emerald-700" />
                      <span>URL Slug (Unique shareable address)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSyncSlugFromTitle}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                        title="Re-generate slug directly from article title"
                      >
                        <RefreshCw size={11} />
                        <span>Sync from Title</span>
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={checkSlugAvailability}
                        disabled={slugChecking || !editingPost.slug}
                        className="text-[11px] font-semibold text-emerald-800 hover:underline disabled:opacity-50"
                      >
                        {slugChecking ? 'Checking...' : 'Check Availability'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1.5 rounded border border-gray-200">
                      https://youthclimatenetwork.org/blog/
                    </span>
                    <input
                      type="text"
                      value={editingPost.slug || ''}
                      onChange={e => handleSlugChange(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-mono bg-emerald-50/40 border border-emerald-300 rounded focus:bg-white focus:outline-none"
                      placeholder="youth-climate-action"
                      required
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
              </div>

              {/* Excerpt Section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">
                    Article Excerpt / Summary {editorLanguageTab === 'bn' ? '(বাংলা)' : '(English)'}
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {(editingPost[editorLanguageTab === 'bn' ? 'excerpt_bn' : 'excerpt'] || '').length} characters
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={editorLanguageTab === 'bn' ? (editingPost.excerpt_bn || '') : editingPost.excerpt}
                  onChange={e => {
                    const val = e.target.value;
                    if (editorLanguageTab === 'bn') {
                      setEditingPost({ ...editingPost, excerpt_bn: val });
                    } else {
                      setEditingPost({ ...editingPost, excerpt: val });
                    }
                  }}
                  className="w-full px-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  placeholder="Short engaging introductory paragraph shown on blog cards and search snippets..."
                  required={editorLanguageTab === 'en'}
                />
              </div>

              {/* ──────────────────────────────────────────────────────────────
                  RICH ARTICLE CONTENT EDITOR (Modern CMS Style)
                 ────────────────────────────────────────────────────────────── */}
              <div className={`space-y-0 border border-gray-200 rounded-2xl overflow-hidden shadow-xs bg-white transition-all ${
                isFullscreen ? 'fixed inset-4 z-50 flex flex-col shadow-2xl' : 'relative'
              }`}>
                {/* Editor Top Bar: Title, Stats & View Mode Tabs */}
                <div className="bg-gray-50/90 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-gray-900 font-inter">
                      Article Content {editorLanguageTab === 'bn' ? '(বাংলা)' : '(English)'}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
                      {contentStats.words} words · ~{contentStats.readTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Mode Switcher */}
                    <div className="flex rounded-lg bg-gray-200/80 p-0.5 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setEditorMode('visual')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                          editorMode === 'visual' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Edit3 size={13} className="text-emerald-700" />
                        <span>Visual Editor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode('code')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                          editorMode === 'code' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Code size={13} />
                        <span>HTML / Markdown</span>
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

                    {/* Fullscreen Focus Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Writing Mode'}
                    >
                      {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    </button>
                  </div>
                </div>

                {/* Unified Modern Toolbar */}
                <div className="bg-white px-3 py-2 border-b border-gray-200 flex items-center justify-between flex-wrap gap-1.5 text-xs">
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Style selector */}
                    <select
                      onChange={e => {
                        const val = e.target.value;
                        if (val === 'p') executeWordCmd('formatBlock', '<p>');
                        else if (val === 'h2') executeWordCmd('formatBlock', '<h2>');
                        else if (val === 'h3') executeWordCmd('formatBlock', '<h3>');
                        else if (val === 'blockquote') executeWordCmd('formatBlock', '<blockquote>');
                        else if (val === 'pre') executeWordCmd('formatBlock', '<pre>');
                      }}
                      className="px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded-md font-semibold text-gray-800 focus:outline-none"
                      defaultValue="p"
                    >
                      <option value="p">Paragraph</option>
                      <option value="h2">Heading 2 (Section)</option>
                      <option value="h3">Heading 3 (Subsection)</option>
                      <option value="blockquote">Quote Block</option>
                      <option value="pre">Code Block</option>
                    </select>

                    <div className="h-4 w-px bg-gray-200 mx-1" />

                    {/* Basic Formatting: B, I, U, S */}
                    <button
                      type="button"
                      onClick={() => executeWordCmd('bold')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 font-bold cursor-pointer"
                      title="Bold (Ctrl+B)"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('italic')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Italic (Ctrl+I)"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('underline')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Underline (Ctrl+U)"
                    >
                      <Underline size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('strikeThrough')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Strikethrough"
                    >
                      <Strikethrough size={14} />
                    </button>

                    <div className="h-4 w-px bg-gray-200 mx-1" />

                    {/* Colors */}
                    <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                      <Type size={12} className="text-gray-500" />
                      <select
                        onChange={e => executeWordCmd('foreColor', e.target.value)}
                        className="text-[11px] font-semibold bg-transparent border-0 focus:outline-none"
                        defaultValue="#111827"
                      >
                        <option value="#111827">Dark</option>
                        <option value="#1A6B3C">Green</option>
                        <option value="#E8521A">Orange</option>
                        <option value="#DC2626">Red</option>
                        <option value="#2563EB">Blue</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                      <Highlighter size={12} className="text-amber-500" />
                      <select
                        onChange={e => executeWordCmd('hiliteColor', e.target.value)}
                        className="text-[11px] font-semibold bg-transparent border-0 focus:outline-none"
                        defaultValue="transparent"
                      >
                        <option value="transparent">None</option>
                        <option value="#FEF08A">Yellow</option>
                        <option value="#A7F3D0">Green</option>
                        <option value="#BAE6FD">Cyan</option>
                        <option value="#FED7AA">Orange</option>
                      </select>
                    </div>

                    <div className="h-4 w-px bg-gray-200 mx-1" />

                    {/* Alignment */}
                    <button
                      type="button"
                      onClick={() => executeWordCmd('justifyLeft')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Align Left"
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('justifyCenter')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Align Center"
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('justifyRight')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Align Right"
                    >
                      <AlignRight size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('justifyFull')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Justify"
                    >
                      <AlignJustify size={14} />
                    </button>

                    <div className="h-4 w-px bg-gray-200 mx-1" />

                    {/* Lists */}
                    <button
                      type="button"
                      onClick={() => executeWordCmd('insertUnorderedList')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Bulleted List"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('insertOrderedList')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Numbered List"
                    >
                      <ListOrdered size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('outdent')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Decrease Indent"
                    >
                      <Outdent size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('indent')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Increase Indent"
                    >
                      <Indent size={14} />
                    </button>

                    <div className="h-4 w-px bg-gray-200 mx-1" />

                    {/* Insert Elements */}
                    <button
                      type="button"
                      onClick={() => setShowLinkDialog(!showLinkDialog)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Insert Link"
                    >
                      <Link2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertTable(3, 3)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Insert Table (3x3)"
                    >
                      <Table size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertCallout('climate')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Insert Climate Box"
                    >
                      <Info size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertCallout('quote')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Insert Pullquote"
                    >
                      <Quote size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHtmlSnippet('<hr class="my-6 border-t border-gray-200" /><p></p>')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                      title="Horizontal Divider"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeWordCmd('removeFormat')}
                      className="p-1.5 hover:bg-gray-100 rounded text-red-600 cursor-pointer"
                      title="Clear Formatting"
                    >
                      <Eraser size={14} />
                    </button>
                  </div>

                  {/* Right side helper actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleAutoArrangeContent}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                      title="Automatically arrange lines & paragraphs with proper spacing"
                    >
                      <Sparkles size={12} className="text-emerald-700" />
                      <span>Format & Space</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (visualEditorRef.current) {
                          const cleaned = cleanWordPasteHtml(visualEditorRef.current.innerHTML);
                          visualEditorRef.current.innerHTML = cleaned;
                          handleVisualInput();
                          setAutoGenFeedback('Pasted Word styles cleaned into neat HTML!');
                          setTimeout(() => setAutoGenFeedback(null), 3000);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                      title="Strip messy Word formatting"
                    >
                      <Wand2 size={12} />
                      <span>Clean Word Junk</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFindReplace(!showFindReplace)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                      title="Find & Replace"
                    >
                      <Replace size={14} />
                    </button>
                  </div>
                </div>

                {/* Find & Replace bar */}
                {showFindReplace && (
                  <div className="bg-amber-50/80 border-b border-amber-200 px-3 py-2 flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-amber-950 flex items-center gap-1">
                      <Search size={13} /> Find:
                    </span>
                    <input
                      type="text"
                      value={findText}
                      onChange={e => setFindText(e.target.value)}
                      placeholder="Find text..."
                      className="px-2 py-0.5 text-xs bg-white border border-amber-300 rounded focus:outline-none"
                    />
                    <span className="font-bold text-amber-950 flex items-center gap-1">
                      <Replace size={13} /> Replace:
                    </span>
                    <input
                      type="text"
                      value={replaceText}
                      onChange={e => setReplaceText(e.target.value)}
                      placeholder="Replace with..."
                      className="px-2 py-0.5 text-xs bg-white border border-amber-300 rounded focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleFindReplaceAll}
                      className="px-2.5 py-0.5 rounded bg-emerald-800 text-white font-bold hover:bg-emerald-900 cursor-pointer text-[11px]"
                    >
                      Replace All
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFindReplace(false)}
                      className="p-1 rounded text-gray-500 hover:text-gray-800"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                {/* Hyperlink input bar */}
                {showLinkDialog && (
                  <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-2 flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <Link2 size={13} /> Link URL:
                    </span>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="px-2 py-0.5 text-xs bg-white border border-emerald-300 rounded focus:outline-none flex-1 max-w-xs"
                    />
                    <input
                      type="text"
                      value={linkText}
                      onChange={e => setLinkText(e.target.value)}
                      placeholder="Link display text"
                      className="px-2 py-0.5 text-xs bg-white border border-emerald-300 rounded focus:outline-none max-w-xs"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmLink}
                      className="px-2.5 py-0.5 rounded bg-[#1A6B3C] text-white font-bold hover:bg-[#14532D] cursor-pointer text-[11px]"
                    >
                      Insert Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLinkDialog(false)}
                      className="p-1 rounded text-gray-500 hover:text-gray-800"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                {/* Main Typing Canvas */}
                <div className={`overflow-y-auto ${isFullscreen ? 'flex-1' : 'max-h-[600px]'}`}>
                  {/* Visual Editor (Direct writing canvas, no gray background or fake margins) */}
                  {editorMode === 'visual' && (
                    <div
                      ref={visualEditorRef}
                      contentEditable
                      onInput={handleVisualInput}
                      onPaste={handleWordPaste}
                      spellCheck={true}
                      className="w-full min-h-[440px] bg-white p-6 sm:p-8 focus:outline-none font-inter text-gray-900 leading-relaxed text-[15px] space-y-4 [&>h1]:text-2xl [&>h1]:font-black [&>h1]:text-gray-950 [&>h1]:font-poppins [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-emerald-950 [&>h2]:font-poppins [&>h2]:mt-6 [&>h2]:mb-2.5 [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:font-poppins [&>h3]:mt-5 [&>h3]:mb-2 [&>p]:mb-4 [&>p]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-600 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:italic [&>blockquote]:bg-emerald-50/60 [&>blockquote]:rounded-r-xl [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5 [&>ul]:my-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-1.5 [&>ol]:my-4 [&>table]:w-full [&>table]:border-collapse [&>table]:my-4 [&>table]:border [&>table]:border-gray-300 [&_th]:border [&_th]:border-gray-300 [&_th]:p-2.5 [&_th]:bg-gray-100 [&_th]:font-bold [&_td]:border [&_td]:border-gray-300 [&_td]:p-2.5"
                    />
                  )}

                  {/* Code Editor */}
                  {editorMode === 'code' && (
                    <textarea
                      rows={18}
                      value={editorLanguageTab === 'bn' ? (editingPost.content_bn || '') : (editingPost.content || '')}
                      onChange={e => {
                        const val = e.target.value;
                        if (editorLanguageTab === 'bn') {
                          setEditingPost({ ...editingPost, content_bn: val });
                        } else {
                          setEditingPost({ ...editingPost, content: val });
                        }
                        if (visualEditorRef.current) {
                          visualEditorRef.current.innerHTML = val;
                        }
                      }}
                      className="w-full h-full min-h-[440px] p-5 text-xs bg-gray-900 text-emerald-400 font-mono leading-relaxed focus:outline-none"
                      placeholder="Write or edit raw HTML / Markdown here..."
                    />
                  )}

                  {/* Reader Live Preview */}
                  {editorMode === 'preview' && (
                    <div className="w-full min-h-[440px] p-6 sm:p-8 bg-[#FAF9F5] overflow-y-auto">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b flex items-center justify-between">
                        <span>Live Reader Preview</span>
                        <span className="text-emerald-800 font-mono">/blog/{editingPost.slug || 'slug'}</span>
                      </div>
                      {editingPost.content ? (
                        <div
                          className="prose prose-lg max-w-none text-gray-800 font-inter space-y-4 leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-950 [&>h2]:font-poppins [&>h2]:mt-6 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>p]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-[#1A6B3C] [&>blockquote]:pl-6 [&>blockquote]:py-2.5 [&>blockquote]:italic [&>blockquote]:bg-emerald-50/50 [&>blockquote]:rounded-r-2xl"
                          dangerouslySetInnerHTML={{ __html: smartArrangeContent(editingPost.content) }}
                        />
                      ) : (
                        <p className="text-gray-400 italic text-center py-16">No content entered yet. Switch to Visual Editor to start writing.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Minimalist Bottom Bar */}
                <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center justify-between flex-wrap text-[11px] text-gray-500">
                  <div className="flex items-center gap-3 font-mono">
                    <span>{contentStats.words} words</span>
                    <span>·</span>
                    <span>{contentStats.chars} chars</span>
                    <span>·</span>
                    <span>{contentStats.readTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                      <Zap size={12} className="text-emerald-700" />
                      <input
                        type="checkbox"
                        checked={autoArrangeOnPaste}
                        onChange={e => setAutoArrangeOnPaste(e.target.checked)}
                        className="w-3 h-3 rounded text-emerald-600"
                      />
                      <span>Auto-clean on paste</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────────
                  SMART TOPIC TAGS & CATEGORIZATION
                 ────────────────────────────────────────────────────────────── */}
              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Globe size={15} className="text-emerald-700" />
                    <h4 className="text-xs font-bold text-emerald-950">Article Tags & Topic Categorization</h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoGenerateTags}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#1A6B3C] text-white hover:bg-[#14532D] shadow-sm cursor-pointer transition-all"
                  >
                    <Sparkles size={12} className="text-amber-300" />
                    <span>Auto-Generate Tags</span>
                  </button>
                </div>

                {/* Current Active Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(editingPost.tags || []).map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-emerald-900 border border-emerald-300 shadow-2xs"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-red-600 rounded-full"
                        title="Remove tag"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(editingPost.tags || []).length === 0 && (
                    <span className="text-xs text-gray-400 italic">No tags added yet. Click &apos;Auto-Generate Tags&apos; or add below.</span>
                  )}
                </div>

                {/* Add Tag Input & Suggested Pills */}
                <div className="flex items-center gap-2 pt-1">
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
                    placeholder="+ Type custom tag and press Enter..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(newTagInput)}
                    className="px-3 py-1.5 text-xs font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Suggested Quick Add Chips */}
                <div className="space-y-1 pt-1">
                  <p className="text-[11px] font-semibold text-gray-500">Quick Suggested Topics (Click to add):</p>
                  <div className="flex flex-wrap gap-1">
                    {popularTopics.map(pt => {
                      const isAdded = (editingPost.tags || []).includes(pt);
                      return (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => isAdded ? handleRemoveTag(pt) : handleAddTag(pt)}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                            isAdded
                              ? 'bg-emerald-700 text-white font-bold'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {isAdded ? `✓ ${pt}` : `+ ${pt}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Multiple Image Gallery Management */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-emerald-700" />
                      <span>Article Image Gallery (Field Carousel)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500">Upload multiple photos from the field for the story carousel</p>
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
                    <h4 className="text-xs font-bold text-amber-900">AEO: Question & Answer FAQs (Featured Snippets)</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost((prev: any) => ({
                        ...prev,
                        faqs: [...(prev.faqs || []), { question: '', answer: '' }]
                      }));
                    }}
                    className="text-[11px] font-semibold text-amber-800 hover:underline cursor-pointer"
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

            {/* ── RIGHT COLUMN (Sidebar Controls: Author, SEO, SDGs, Cover) ── */}
            <div className="md:col-span-4 space-y-4">
              
              {/* Featured Cover Image */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-700">Featured Cover Image</label>
                {editingPost.image && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-white">
                    <img src={editingPost.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingPost.image || ''}
                    onChange={e => {
                      const img = e.target.value;
                      setEditingPost((prev: any) => ({
                        ...prev,
                        image: img,
                        ogImage: prev.ogImage || img
                      }));
                    }}
                    placeholder="Image URL..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                    required
                  />
                  <label className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold bg-gray-200 hover:bg-gray-300 rounded-lg whitespace-nowrap">
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleSingleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────────
                  ASSIGNED AUTHOR SYSTEM (Editable, Selectable, Addable)
                 ────────────────────────────────────────────────────────────── */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <User size={15} className="text-emerald-700" />
                    <label className="text-xs font-bold text-gray-900">Assigned Author</label>
                  </div>
                  {authorSaveStatus && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <Check size={11} /> {authorSaveStatus}
                    </span>
                  )}
                </div>

                {/* Quick select from existing authors */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Select From System Profiles
                  </label>
                  <select
                    value={editingPost.authorId || ''}
                    onChange={e => handleSelectAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  >
                    <option value="">-- Choose Existing Author Profile --</option>
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Details - Direct Editing on the Post */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                      {editingPost.authorImage ? (
                        <img src={editingPost.authorImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Author Photo</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingPost.authorImage || ''}
                          onChange={e => setEditingPost({ ...editingPost, authorImage: e.target.value })}
                          placeholder="Avatar URL..."
                          className="flex-1 px-2 py-1 text-[11px] bg-white border border-gray-200 rounded"
                        />
                        <label className="cursor-pointer px-2 py-1 text-[11px] font-semibold bg-gray-200 hover:bg-gray-300 rounded whitespace-nowrap">
                          <span>{uploadingAuthorAvatar ? '...' : 'Upload'}</span>
                          <input type="file" accept="image/*" onChange={handleAuthorAvatarUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Author Full Name</label>
                    <input
                      type="text"
                      value={editingPost.authorName || ''}
                      onChange={e => setEditingPost({ ...editingPost, authorName: e.target.value })}
                      placeholder="e.g. Sadia Islam or Dr. Monirul Islam"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Author Role / Designation</label>
                    <input
                      type="text"
                      value={editingPost.authorRole || ''}
                      onChange={e => setEditingPost({ ...editingPost, authorRole: e.target.value })}
                      placeholder="e.g. Program Officer, YCN Bangladesh"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                    />
                  </div>

                  {/* Save as new author profile in system */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleSaveAuthorToSystem}
                      disabled={savingAuthorToSystem || !editingPost.authorName}
                      className="w-full py-1.5 px-3 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-colors disabled:opacity-50"
                    >
                      {savingAuthorToSystem ? 'Saving...' : '+ Save as New Author in System'}
                    </button>
                  </div>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────────
                  SEO & SOCIAL SHARING METADATA (Auto-generate & Full Edit)
                 ────────────────────────────────────────────────────────────── */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <Globe size={15} className="text-emerald-700" />
                    <span>SEO & Social Sharing</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSEO}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#1A6B3C] text-white hover:bg-[#14532D] shadow-2xs transition-all cursor-pointer"
                    title="Auto generate SEO Title, Meta Description, Keywords, and Canonical URL from article content"
                  >
                    <Sparkles size={11} className="text-amber-300" />
                    <span>Auto-Generate SEO</span>
                  </button>
                </div>

                {/* SEO Title Tag */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-gray-700">SEO / Meta Title</label>
                    <span className={`text-[10px] font-mono ${
                      (editingPost.metaTitle || editingPost.seoTitle || '').length > 60
                        ? 'text-amber-600 font-bold'
                        : 'text-gray-400'
                    }`}>
                      {(editingPost.metaTitle || editingPost.seoTitle || '').length}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingPost.metaTitle || editingPost.seoTitle || ''}
                    onChange={e => setEditingPost({
                      ...editingPost,
                      metaTitle: e.target.value,
                      seoTitle: e.target.value
                    })}
                    placeholder="Custom SEO Title (defaults to article title)"
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-gray-700">Meta Description</label>
                    <span className={`text-[10px] font-mono ${
                      (editingPost.metaDescription || '').length > 160
                        ? 'text-amber-600 font-bold'
                        : 'text-gray-400'
                    }`}>
                      {(editingPost.metaDescription || '').length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={editingPost.metaDescription || ''}
                    onChange={e => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                    placeholder="140-160 characters summary displayed on Google search results..."
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  />
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Search Keywords (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingPost.metaKeywords || ''}
                    onChange={e => setEditingPost({ ...editingPost, metaKeywords: e.target.value })}
                    placeholder="climate change, coastal resilience, youth leadership..."
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  />
                </div>

                {/* Social Sharing Image (OG Image) */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Social Sharing Image (OG Image)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingPost.ogImage || ''}
                      onChange={e => setEditingPost({ ...editingPost, ogImage: e.target.value })}
                      placeholder="https://... cover for Facebook / LinkedIn"
                      className="flex-1 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingPost((prev: any) => ({ ...prev, ogImage: prev.image }))}
                      className="px-2 py-1.5 text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded whitespace-nowrap cursor-pointer"
                      title="Use featured cover image as social share image"
                    >
                      Use Cover
                    </button>
                  </div>
                </div>

                {/* Canonical URL */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Canonical URL</label>
                  <input
                    type="url"
                    value={editingPost.canonicalUrl || ''}
                    onChange={e => setEditingPost({ ...editingPost, canonicalUrl: e.target.value })}
                    placeholder="https://youthclimatenetwork.org/blog/..."
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  />
                </div>

                {/* NoIndex & Read Time row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="noIndex"
                      checked={editingPost.noIndex || false}
                      onChange={e => setEditingPost({ ...editingPost, noIndex: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-red-600"
                    />
                    <label htmlFor="noIndex" className="text-[11px] text-gray-700 cursor-pointer">
                      NoIndex (Hide from Google)
                    </label>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">Read Time:</span>
                    <input
                      type="text"
                      value={editingPost.readTime || '5 min read'}
                      onChange={e => setEditingPost({ ...editingPost, readTime: e.target.value })}
                      className="w-20 px-1.5 py-0.5 text-[11px] text-center bg-gray-50 border border-gray-200 rounded"
                    />
                  </div>
                </div>

                {/* SERP Search Preview Box */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Google Search Preview
                  </span>
                  <div className="text-[11px] text-emerald-800 font-mono truncate">
                    youthclimatenetwork.org › blog › {editingPost.slug || 'article-slug'}
                  </div>
                  <div className="text-xs font-bold text-[#1a0dab] line-clamp-1">
                    {editingPost.metaTitle || editingPost.seoTitle || editingPost.title || 'Article Title'}
                  </div>
                  <div className="text-[11px] text-gray-600 line-clamp-2 leading-tight">
                    {editingPost.metaDescription || editingPost.excerpt || 'Article summary will appear here in search engine results...'}
                  </div>
                </div>
              </div>

              {/* Category & Status */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Article Category</label>
                  <select
                    value={editingPost.category || 'Climate Action'}
                    onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg"
                  >
                    <option value="Climate Action">Climate Action</option>
                    <option value="Youth Leadership">Youth Leadership</option>
                    <option value="Coastal Resilience">Coastal Resilience</option>
                    <option value="Policy & Advocacy">Policy & Advocacy</option>
                    <option value="Loss and Damage">Loss and Damage</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="Field Action">Field Action</option>
                    <option value="Community Voices">Community Voices</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPost.featured || false}
                      onChange={e => setEditingPost({ ...editingPost, featured: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-[#E8521A]"
                    />
                    <span>Featured Article</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPost.published !== false}
                      onChange={e => setEditingPost({ ...editingPost, published: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-[#1A6B3C]"
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>

              {/* SDGs Selection */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Select UN SDGs (SDG 1 - 17)
                </label>
                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {sdgs.map(s => {
                    const isSelected = (editingPost.sdgIds || editingPost.sdgs || []).includes(s.number);
                    return (
                      <button
                        type="button"
                        key={s.number}
                        onClick={() => toggleSdg(s.number)}
                        title={`SDG ${s.number}: ${s.title || s.name}`}
                        className={`h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-black scale-105 shadow-sm text-white' : 'opacity-35 hover:opacity-80 text-white'
                        }`}
                        style={{ backgroundColor: s.color }}
                      >
                        {s.number}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C] shadow-sm disabled:opacity-50 cursor-pointer transition-all"
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
