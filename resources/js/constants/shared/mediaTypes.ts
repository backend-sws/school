/**
 * Media types for gallery items (images, videos, YouTube links)
 */
export const MEDIA_TYPE = {
  IMAGE: "image",
  VIDEO: "video",
  YOUTUBE: "youtube",
} as const;

export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];

export const MEDIA_TYPE_OPTIONS = [
  { key: "image", text: "Image", value: MEDIA_TYPE.IMAGE },
  { key: "video", text: "Video", value: MEDIA_TYPE.VIDEO },
  { key: "youtube", text: "YouTube Link", value: MEDIA_TYPE.YOUTUBE },
] as const;

export function parseYouTubeUrl(url: string): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
