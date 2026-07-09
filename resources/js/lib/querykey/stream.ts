export const StreamQueryKeys = {
  all: ["streams"] as const,
  list: (filters?: Record<string, unknown>) => ["streams", filters] as const,
  detail: (id: number | string) => ["streams", id] as const,
};
