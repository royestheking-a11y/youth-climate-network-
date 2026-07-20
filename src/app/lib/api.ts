import useSWR from 'swr';
import type {
  ImpactStats, NewsItem, EventItem, TeamMember, Partner,
  VolunteerApp, NewsletterSub, ContactMessage, DonationRecord,
  DonationRequest, HeroCarouselItem, AdvocacyItem,
  PartnershipInquiry, InternshipApp, MediaItem
} from './storage';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useStats = () => useSWR<ImpactStats>(`${API_URL}/stats`, fetcher);
export const useNews = () => useSWR<NewsItem[]>(`${API_URL}/news`, fetcher);
export const useEvents = () => useSWR<EventItem[]>(`${API_URL}/events`, fetcher);
export const useTeam = () => useSWR<TeamMember[]>(`${API_URL}/team`, fetcher);
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
export const useMedia = () => useSWR<MediaItem[]>(`${API_URL}/media`, fetcher);

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

// Generic factory for simple entities
const createApiClient = <T extends { id: string }>(path: string) => ({
  getAll: async (): Promise<T[]> => {
    const res = await fetch(`${API_URL}/${path}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return res.json();
  },
  create: async (data: Omit<T, 'id'>): Promise<T> => {
    const res = await fetch(`${API_URL}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create ${path}`);
    return res.json();
  },
  update: async (id: string, data: Partial<T>): Promise<T> => {
    const res = await fetch(`${API_URL}/${path}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update ${path}`);
    return res.json();
  },
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${path}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete ${path}`);
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
export const apiMedia = createApiClient<MediaItem>('media');

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

export const migrateAllData = async (data: any): Promise<boolean> => {
  const res = await fetch(`${API_URL}/migrate-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
};
