/**
 * Centralized query keys for Admission Application–related queries
 */
export const ApplicationQueryKeys = {
    all: ["admission-applications"] as const,
    list: (filters?: Record<string, unknown>) =>
        filters ? ([...ApplicationQueryKeys.all, filters] as const) : ApplicationQueryKeys.all,
    detail: (id: number | string) => [...ApplicationQueryKeys.all, "detail", id] as const,
};
