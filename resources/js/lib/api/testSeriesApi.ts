import api from "./api";

const TestSeriesApi = {
    index: (params?: { page?: number; per_page?: number; category?: string; published?: boolean }) =>
        api.get("/test-series", { params }),

    show: (id: number) => api.get(`/test-series/${id}`),

    store: (data: {
        title: string;
        description?: string;
        category?: string;
        difficulty?: string;
        starts_at?: string;
        ends_at?: string;
        test_ids?: number[];
    }) => api.post("/test-series", data),

    update: (id: number, data: Record<string, unknown>) =>
        api.put(`/test-series/${id}`, data),

    destroy: (id: number) => api.delete(`/test-series/${id}`),

    togglePublish: (id: number) => api.patch(`/test-series/${id}/toggle-publish`),

    leaderboard: (id: number) => api.get(`/test-series/${id}/leaderboard`),

    // Analytics
    analytics: (id: number) => api.get(`/test-series/${id}/analytics`),

    myAnalytics: (id: number) => api.get(`/test-series/${id}/my-analytics`),

    recalculate: (id: number) => api.post(`/test-series/${id}/recalculate`),
};

export default TestSeriesApi;
