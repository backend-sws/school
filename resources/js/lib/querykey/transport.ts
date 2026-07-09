export const TransportQueryKeys = {
    all: ["transport"] as const,
    routes: (filters?: Record<string, unknown>) =>
        ["transport-routes", ...(filters ? [filters] : [])] as const,
    routesList: () => ["transport-routes-list"] as const,
    route: (id: number | string) =>
        ["transport-route", id] as const,
    stops: (filters?: Record<string, unknown>) =>
        ["transport-stops", ...(filters ? [filters] : [])] as const,
    vehicles: (filters?: Record<string, unknown>) =>
        ["transport-vehicles", ...(filters ? [filters] : [])] as const,
    drivers: (filters?: Record<string, unknown>) =>
        ["transport-drivers", ...(filters ? [filters] : [])] as const,
    assignments: (filters?: Record<string, unknown>) =>
        ["transport-assignments", ...(filters ? [filters] : [])] as const,
    manifest: (filters?: Record<string, unknown>) =>
        ["transport-manifest", ...(filters ? [filters] : [])] as const,
    occupancy: (filters?: Record<string, unknown>) =>
        ["transport-occupancy", ...(filters ? [filters] : [])] as const,
};
