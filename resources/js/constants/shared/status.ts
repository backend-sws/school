/**
 * Generic publish status enum for content (galleries, sliders, news, tickers, etc.)
 * Frontend uses string values; backend converts to int (100=draft, 101=published).
 */
export const PUBLISH_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type PublishStatusType = (typeof PUBLISH_STATUS)[keyof typeof PUBLISH_STATUS];

export const PUBLISH_STATUS_OPTIONS = [
  { key: "published", text: "Publish", value: PUBLISH_STATUS.PUBLISHED },
  { key: "draft", text: "Draft", value: PUBLISH_STATUS.DRAFT },
] as const;
