export const AttendanceQueryKeys = {
    all: ["attendance"] as const,
    classes: () => ["attendance-classes"] as const,
    daily: (filters?: Record<string, unknown>) =>
        ["attendance-daily", ...(filters ? [filters] : [])] as const,
    allocations: (filters?: Record<string, unknown>) =>
        ["attendance-allocations", ...(filters ? [filters] : [])] as const,
    reportsDaily: (filters?: Record<string, unknown>) =>
        ["attendance-reports-daily", ...(filters ? [filters] : [])] as const,
    reportsSummary: (filters?: Record<string, unknown>) =>
        ["attendance-reports-summary", ...(filters ? [filters] : [])] as const,
};
