export const FeeTypeQueryKeys = {
    all: ["fee-types"] as const,
    list: (filters?: Record<string, unknown>) =>
        ["fee-types", ...(filters ? [filters] : [])] as const,
    detail: (id: number | string) =>
        ["fee-types", id] as const,
};
