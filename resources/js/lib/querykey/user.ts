export const UserQueryKeys = {
  all: ["users"] as const,
  list: (filters?: Record<string, unknown>) =>
    ["users", ...(filters ? [filters] : [])] as const,
  detail: (id: number | string) => ["users", id] as const,
};
