export const AdminQueryKeys = {
    all: ["admin"] as const,
    roles: (filters?: Record<string, unknown>) =>
        ["roles", ...(filters ? [filters] : [])] as const,
    role: (id: number | string) =>
        ["role", id] as const,
    permissions: () => ["permissions"] as const,
    auditLogs: (filters?: Record<string, unknown>) =>
        ["audit-logs", ...(filters ? [filters] : [])] as const,
    importLogs: (filters?: Record<string, unknown>) =>
        ["import-history", ...(filters ? [filters] : [])] as const,
    importModules: () => ["import-modules"] as const,
    organizations: () => ["organizations"] as const,
    staff: (filters?: Record<string, unknown>) =>
        ["staff", ...(filters ? [filters] : [])] as const,
    dashboardStats: () => ["dashboard-stats"] as const,
};
