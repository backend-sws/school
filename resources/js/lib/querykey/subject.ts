export const SubjectQueryKeys = {
  all: ["subjects"] as const,
  list: (filters?: Record<string, unknown>) =>
    ["subjects", ...(filters ? [filters] : [])] as const,
  detail: (id: number | string) => ["subjects", id] as const,
};
