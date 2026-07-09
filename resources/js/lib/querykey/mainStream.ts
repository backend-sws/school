export const MainStreamQueryKeys = {
  all: ["main-streams"] as const,
  list: (filters?: Record<string, unknown>) => ["main-streams", filters] as const,
  detail: (id: number | string) => ["main-streams", id] as const,
};
