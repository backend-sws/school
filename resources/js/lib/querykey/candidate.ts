/**
 * Centralized query keys for Candidate-related queries
 */
export const CandidateQueryKeys = {
    all: ["candidates"] as const,
    list: (filters?: Record<string, unknown>) =>
        filters ? ([...CandidateQueryKeys.all, filters] as const) : CandidateQueryKeys.all,
    detail: (id: number | string) => [...CandidateQueryKeys.all, "detail", id] as const,
};
