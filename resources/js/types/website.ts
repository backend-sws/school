/**
 * Types for public website CMS content (sliders, tickers, news, galleries, landing settings).
 * Used as Inertia page props from WebsiteController.
 */

export interface Slider {
  id: number;
  title: string | null;
  description: string | null;
  image_url: string | null;
  button_caption: string | null;
  button_url: string | null;
  sort_order: number;
}

export interface Ticker {
  id: number;
  content: string;
  tags: string[];
}

export interface NewsPreview {
  id: number;
  title: string;
  content: string | null;
  news_for: string | null;
  news_types: string[];
  created_at: string | null;
}

/** News items filtered by news_types containing "event" for Upcoming Events sidebar. */
export interface EventPreview {
  id: number;
  title: string;
  content: string | null;
  news_for: string | null;
  news_types: string[];
  created_at: string | null;
  event_date: string | null;
  event_location: string | null;
}

export interface GalleryImagePayload {
  id: number;
  image_url: string | null;
  caption: string | null;
  media_type: string | null;
  sort_order?: number;
}

export interface GalleryPreviewPayload {
  id: number;
  title: string | null;
  description: string | null;
  images: GalleryImagePayload[];
}

export interface GalleryWithImages {
  id: number;
  title: string | null;
  description: string | null;
  images: GalleryImagePayload[];
}

export type LandingSettings = Record<string, string>;

export interface StatItem {
  value: string;
  label: string;
}

export interface WelcomePageProps {
  [key: string]: any;
  canRegister: boolean;
  sliders: Slider[];
  tickers: Ticker[];
  newsPreview: NewsPreview[];
  upcomingEvents: EventPreview[];
  landingSettings: LandingSettings;
  stats: StatItem[];
  galleryPreview: GalleryPreviewPayload | null;
  sectionOrder?: Array<{
    section_id: string;
    sort_order: number;
    is_visible: boolean;
    custom_props: Record<string, any> | null;
  }>;
}

export interface GalleryPageProps {
  galleries: GalleryWithImages[];
}
