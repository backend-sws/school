export const NotificationQueryKeys = {
    all: ["notifications"] as const,
    list: (filters?: Record<string, unknown>) =>
        ["notifications", ...(filters ? [filters] : [])] as const,
};
