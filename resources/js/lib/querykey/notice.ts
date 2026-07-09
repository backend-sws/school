/**
 * Centralized query keys for Notice-related queries
 */
export const NoticeQueryKeys = {
    all: ["getAllNotice"] as const,
    list: (filters?: Record<string, unknown>) =>
        filters ? ([...NoticeQueryKeys.all, filters] as const) : NoticeQueryKeys.all,
    detail: (id: number | string) => [...NoticeQueryKeys.all, "detail", id] as const,
};
