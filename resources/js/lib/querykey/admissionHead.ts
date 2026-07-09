/**
 * Centralized query keys for Admission Head-related queries
 */
export const AdmissionHeadQueryKeys = {
    all: ["admission-head"] as const,
    list: (filters?: Record<string, unknown>) =>
        filters ? ([...AdmissionHeadQueryKeys.all, filters] as const) : AdmissionHeadQueryKeys.all,
    detail: (id: number | string) => [...AdmissionHeadQueryKeys.all, String(id)] as const,
};
