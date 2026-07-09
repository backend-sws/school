/**
 * Centralized query keys for Student-related queries
 */
export const StudentQueryKeys = {
    all: ["students"] as const,
    list: (filters?: Record<string, unknown>) =>
        filters ? ([...StudentQueryKeys.all, filters] as const) : StudentQueryKeys.all,
    detail: (id: number | string) => [...StudentQueryKeys.all, "detail", id] as const,
    analytics: (year?: number, page?: number) =>
        [...StudentQueryKeys.all, "analytics", year, page] as const,
};
