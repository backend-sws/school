export const WebsiteQueryKeys = {
    all: ["website"] as const,
    sliders: (filters?: Record<string, unknown>) =>
        ["sliders", ...(filters ? [filters] : [])] as const,
    news: (filters?: Record<string, unknown>) =>
        ["news", ...(filters ? [filters] : [])] as const,
    galleries: (filters?: Record<string, unknown>) =>
        ["galleries", ...(filters ? [filters] : [])] as const,
    gallery: (id: number | string) =>
        ["gallery", id] as const,
    galleryImages: (id: number | string) =>
        ["gallery-images", id] as const,
    tickers: (filters?: Record<string, unknown>) =>
        ["tickers", ...(filters ? [filters] : [])] as const,
};
