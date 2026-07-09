export const ReadmissionQueryKeys = {
    all: ["readmissions"] as const,
    eligible: (filters?: Record<string, unknown>) =>
        ["readmissions", "eligible", ...(filters ? [filters] : [])] as const,
    sessionEligible: (filters?: Record<string, unknown>) =>
        ["readmissions", "session-eligible", ...(filters ? [filters] : [])] as const,
    history: (filters?: Record<string, unknown>) =>
        ["readmissions", "history", ...(filters ? [filters] : [])] as const,
    previewFees: (studentProfileId: number | string) =>
        ["readmissions", "preview-fees", studentProfileId] as const,
    detail: (id: number | string) =>
        ["readmissions", id] as const,
};
