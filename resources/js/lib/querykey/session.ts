export const SessionQueryKeys = {
  all: ["sessions"] as const,
  list: (filters?: Record<string, unknown>) =>
    ["sessions", ...(filters ? [filters] : [])] as const,
  detail: (id: number | string) => ["sessions", id] as const,
};
