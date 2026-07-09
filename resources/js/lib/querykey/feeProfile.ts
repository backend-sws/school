export const FeeProfileQueryKeys = {
    all: ["fee-profiles"] as const,
    list: (filters?: Record<string, unknown>) =>
        [...FeeProfileQueryKeys.all, "list", filters] as const,
    detail: (id: number | string) =>
        [...FeeProfileQueryKeys.all, "detail", id] as const,
    profileDetail: (id: number | string) =>
        [...FeeProfileQueryKeys.all, "profile-detail", id] as const,
};
