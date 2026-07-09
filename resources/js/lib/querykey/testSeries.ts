export const TestSeriesQueryKeys = {
    all: ["test-series"] as const,
    list: (filters?: { category?: string; published?: boolean }) =>
        [...TestSeriesQueryKeys.all, "list", filters] as const,
    detail: (id: number) => [...TestSeriesQueryKeys.all, "detail", id] as const,
    analytics: (id: number) => [...TestSeriesQueryKeys.all, "analytics", id] as const,
    myAnalytics: (id: number) => [...TestSeriesQueryKeys.all, "my-analytics", id] as const,
    leaderboard: (id: number) => [...TestSeriesQueryKeys.all, "leaderboard", id] as const,
};
