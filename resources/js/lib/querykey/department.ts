export const DepartmentQueryKeys = {
  all: ["departments"] as const,
  list: (filters?: Record<string, unknown>) =>
    ["departments", ...(filters ? [filters] : [])] as const,
  detail: (id: number | string) => ["departments", id] as const,
};
