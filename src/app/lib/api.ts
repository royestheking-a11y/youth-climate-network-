import useSWR from 'swr';
import type {
  ImpactStats, NewsItem, EventItem, TeamMember, Partner,
  VolunteerApp, NewsletterSub, ContactMessage, DonationRecord,
  DonationRequest, HeroCarouselItem, AdvocacyItem,
  PartnershipInquiry, InternshipApp, InternshipPost, MediaItem, AdminUser,
  NavigationItem, FounderBriefData, AuthorItem, SDGItem, BlogPost, InquiryItem,
  OurWorkItem, AboutContent, SiteSettings, ImpactReport, CaseStudy, VolunteerTrack,
  CopHistoryItem, PolicyPositionItem
} from './storage';

export type {
  ImpactStats, NewsItem, EventItem, TeamMember, Partner,
  VolunteerApp, NewsletterSub, ContactMessage, DonationRecord,
  DonationRequest, HeroCarouselItem, AdvocacyItem,
  PartnershipInquiry, InternshipApp, InternshipPost, MediaItem, AdminUser,
  NavigationItem, FounderBriefData, AuthorItem, SDGItem, BlogPost, InquiryItem,
  OurWorkItem, AboutContent, SiteSettings, ImpactReport, CaseStudy, VolunteerTrack,
  CopHistoryItem, PolicyPositionItem
};

export const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
});

// SWR Hooks
export const useAdminUsers = () => useSWR<AdminUser[]>(`${API_URL}/admin-users`, fetcher);
export const useStats = () => useSWR<ImpactStats>(`${API_URL}/stats`, fetcher);
export const useNews = () => useSWR<NewsItem[]>(`${API_URL}/news`, fetcher);
export const useEvents = () => useSWR<EventItem[]>(`${API_URL}/events`, fetcher);
export const useTeam = (params?: { type?: string; department?: string }) => {
  const query = new URLSearchParams(params as any).toString();
  return useSWR<TeamMember[]>(`${API_URL}/team${query ? '?' + query : ''}`, fetcher);
};
export const usePartners = () => useSWR<Partner[]>(`${API_URL}/partners`, fetcher);
export const useVolunteerApps = () => useSWR<VolunteerApp[]>(`${API_URL}/volunteer-apps`, fetcher);
export const useNewsletter = () => useSWR<NewsletterSub[]>(`${API_URL}/newsletter`, fetcher);
export const useContactMessages = () => useSWR<ContactMessage[]>(`${API_URL}/contact-messages`, fetcher);
export const useDonations = () => useSWR<DonationRecord[]>(`${API_URL}/donations`, fetcher);
export const useDonationRequests = () => useSWR<DonationRequest[]>(`${API_URL}/donation-requests`, fetcher);
export const useCarousel = () => useSWR<HeroCarouselItem[]>(`${API_URL}/carousel`, fetcher);
export const useAdvocacy = () => useSWR<AdvocacyItem[]>(`${API_URL}/advocacy`, fetcher);
export const usePartnershipInquiries = () => useSWR<PartnershipInquiry[]>(`${API_URL}/partnership-inquiries`, fetcher);
export const useInternshipApps = () => useSWR<InternshipApp[]>(`${API_URL}/internship-apps`, fetcher);
export const useInternshipPosts = () => useSWR<InternshipPost[]>(`${API_URL}/internship-posts`, fetcher);
export const useMedia = () => useSWR<MediaItem[]>(`${API_URL}/media`, fetcher);

// New Feature Hooks
export const useNavigation = () => useSWR<NavigationItem[]>(`${API_URL}/navigation`, fetcher);
export const useFounderBrief = () => useSWR<FounderBriefData>(`${API_URL}/founder-brief`, fetcher);
export const useAuthors = () => useSWR<AuthorItem[]>(`${API_URL}/authors`, fetcher);
export const useSDGs = () => useSWR<SDGItem[]>(`${API_URL}/sdgs`, fetcher);
export const useBlogs = (params?: { category?: string; featured?: boolean; sdg?: number }) => {
  const query = new URLSearchParams(params as any).toString();
  return useSWR<BlogPost[]>(`${API_URL}/blogs${query ? '?' + query : ''}`, fetcher);
};
export const useInquiries = (params?: { type?: string; status?: string; search?: string } | string) => {
  const query = typeof params === 'string' ? params : params ? new URLSearchParams(params as any).toString() : '';
  return useSWR<InquiryItem[]>(`${API_URL}/inquiries${query ? '?' + query : ''}`, fetcher);
};
export const useRobots = () => useSWR<{ content: string }>(`${API_URL}/robots`, fetcher);
export const usePageSchemas = () => useSWR<{ page: string; structuredData: string; schemaType?: string }[]>(`${API_URL}/page-schemas`, fetcher);
export const usePrograms = () => useSWR<any[]>(`${API_URL}/programs`, fetcher);
export const useOurWork = () => useSWR<OurWorkItem[]>(`${API_URL}/our-work`, fetcher);
export const useAboutContent = () => useSWR<AboutContent>(`${API_URL}/about-content`, fetcher);
export const useSiteSettings = () => useSWR<SiteSettings>(`${API_URL}/site-settings`, fetcher);
export const useImpactReports = () => useSWR<ImpactReport[]>(`${API_URL}/impact-reports`, fetcher);
export const useCaseStudies = () => useSWR<CaseStudy[]>(`${API_URL}/case-studies`, fetcher);
export const useVolunteerTracks = () => useSWR<VolunteerTrack[]>(`${API_URL}/volunteer-tracks`, fetcher);
export const useCopHistory = () => useSWR<CopHistoryItem[]>(`${API_URL}/cop-history`, fetcher);
export const usePolicyPositions = () => useSWR<PolicyPositionItem[]>(`${API_URL}/policy-positions`, fetcher);


// Generic factory for simple entities
const createApiClient = <T extends { id?: string }>(path: string) => ({
  getAll: async (params?: Record<string, any>): Promise<T[]> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_URL}/${path}${query}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return res.json();
  },
  getOne: async (id: string): Promise<T> => {
    const res = await fetch(`${API_URL}/${path}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}/${id}`);
    return res.json();
  },
  create: async (data: any): Promise<T> => {
    const res = await fetch(`${API_URL}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Failed to create in ${path}`);
    }
    return res.json();
  },
  update: async (id: string, data: any): Promise<T> => {
    const res = await fetch(`${API_URL}/${path}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Failed to update ${path}/${id}`);
    }
    return res.json();
  },
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${path}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete ${path}/${id}`);
  },
  reorder: async (items: { id: string; order: number }[]): Promise<void> => {
    const res = await fetch(`${API_URL}/${path}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error(`Failed to reorder ${path}`);
  }
});

export const apiEvents = createApiClient<EventItem>('events');
export const apiTeam = createApiClient<TeamMember>('team');
export const apiPartners = createApiClient<Partner>('partners');
export const apiVolunteerApps = createApiClient<VolunteerApp>('volunteer-apps');
export const apiNewsletter = createApiClient<NewsletterSub>('newsletter');
export const apiContactMessages = createApiClient<ContactMessage>('contact-messages');
export const apiDonations = createApiClient<DonationRecord>('donations');
export const apiDonationRequests = createApiClient<DonationRequest>('donation-requests');
export const apiCarousel = createApiClient<HeroCarouselItem>('carousel');
export const apiAdvocacy = createApiClient<AdvocacyItem>('advocacy');
export const apiPartnershipInquiries = createApiClient<PartnershipInquiry>('partnership-inquiries');
export const apiInternshipApps = createApiClient<InternshipApp>('internship-apps');
export const apiInternshipPosts = createApiClient<InternshipPost>('internship-posts');
export const apiMedia = createApiClient<MediaItem>('media');
export const apiAdminUsers = createApiClient<AdminUser>('admin-users');
export const apiProgram = createApiClient<any>('programs');
export const apiOurWork = createApiClient<OurWorkItem>('our-work');
export const apiNavigation = createApiClient<NavigationItem>('navigation');
export const apiAuthors = createApiClient<AuthorItem>('authors');
export const apiSDGs = createApiClient<SDGItem>('sdgs');
export const apiImpactReports = createApiClient<ImpactReport>('impact-reports');
export const apiCaseStudies = createApiClient<CaseStudy>('case-studies');
export const apiVolunteerTracks = createApiClient<VolunteerTrack>('volunteer-tracks');
export const apiCopHistory = createApiClient<CopHistoryItem>('cop-history');
export const apiPolicyPositions = createApiClient<PolicyPositionItem>('policy-positions');


// Blog Specific API Client
export const apiBlog = {
  ...createApiClient<BlogPost>('blogs'),
  getBySlugOrId: async (slugOrId: string): Promise<BlogPost> => {
    const res = await fetch(`${API_URL}/blogs/${slugOrId}`);
    if (!res.ok) throw new Error('Blog not found');
    return res.json();
  },
  validateSlug: async (slug: string, currentId?: string): Promise<{ available: boolean; message?: string }> => {
    const res = await fetch(`${API_URL}/blogs/validate-slug`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, currentId }),
    });
    return res.json();
  }
};

// Founder Brief
export const fetchFounderBrief = async (): Promise<FounderBriefData> => {
  const res = await fetch(`${API_URL}/founder-brief`);
  if (!res.ok) throw new Error('Failed to fetch founder brief');
  return res.json();
};

export const updateFounderBrief = async (data: Partial<FounderBriefData>): Promise<FounderBriefData> => {
  const res = await fetch(`${API_URL}/founder-brief`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update founder brief');
  return res.json();
};

// About Page Content
export const fetchAboutContent = async (): Promise<AboutContent> => {
  const res = await fetch(`${API_URL}/about-content`);
  if (!res.ok) throw new Error('Failed to fetch about content');
  return res.json();
};

export const updateAboutContent = async (data: Partial<AboutContent>): Promise<AboutContent> => {
  const res = await fetch(`${API_URL}/about-content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update about content');
  return res.json();
};

// Site Settings
export const updateSiteSettings = async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
  const res = await fetch(`${API_URL}/site-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update site settings');
  return res.json();
};

// Centralized Inquiries Status Update
export const updateInquiryStatus = async (type: string, id: string, status: string): Promise<void> => {
  const res = await fetch(`${API_URL}/inquiries/${type}/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update inquiry status');
};

// Robots.txt
export const updateRobots = async (content: string): Promise<any> => {
  const res = await fetch(`${API_URL}/robots`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to update robots.txt');
  return res.json();
};

// Page Schema
export const updatePageSchema = async (page: string, structuredData: string, schemaType?: string): Promise<any> => {
  const res = await fetch(`${API_URL}/page-schemas/${page}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredData, schemaType }),
  });
  if (!res.ok) throw new Error('Failed to update page schema');
  return res.json();
};

// Upload Single File
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('File upload failed');
  const data = await res.json();
  return data.url;
};

// Upload Multiple Files
export const uploadMultipleFiles = async (files: FileList | File[]): Promise<string[]> => {
  const formData = new FormData();
  Array.from(files).forEach(f => formData.append('files', f));

  const res = await fetch(`${API_URL}/upload-multiple`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Multiple files upload failed');
  const data = await res.json();
  return data.urls;
};

// Stats
export const fetchStats = async (): Promise<ImpactStats> => {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const updateStats = async (stats: ImpactStats): Promise<ImpactStats> => {
  const res = await fetch(`${API_URL}/stats`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stats),
  });
  if (!res.ok) throw new Error('Failed to update stats');
  return res.json();
};

// News
export const fetchNews = async (): Promise<NewsItem[]> => {
  const res = await fetch(`${API_URL}/news`);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
};

export const createNews = async (news: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
  const res = await fetch(`${API_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(news),
  });
  if (!res.ok) throw new Error('Failed to create news');
  return res.json();
};

export const updateNews = async (id: string, news: Partial<NewsItem>): Promise<NewsItem> => {
  const res = await fetch(`${API_URL}/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(news),
  });
  if (!res.ok) throw new Error('Failed to update news');
  return res.json();
};

export const deleteNews = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/news/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete news');
};

// Newsletter Export CSV
export const exportNewsletterCSV = () => {
  window.open(`${API_URL}/newsletter/export-csv`, '_blank');
};

// Clean Demo Data
export const cleanDemoData = async (): Promise<any> => {
  const res = await fetch(`${API_URL}/clean-demo-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to clean demo data');
  return res.json();
};

export const migrateAllData = async (data: any): Promise<boolean> => {
  const res = await fetch(`${API_URL}/migrate-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
};
