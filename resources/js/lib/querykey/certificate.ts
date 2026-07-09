export const CertificateQueryKeys = {
    all: ["certificate"] as const,
    list: (filters?: Record<string, unknown>) =>
        ["certificate", ...(filters ? [filters] : [])] as const,
    myCertificate: (filters?: Record<string, unknown>) =>
        ["mycertificate", ...(filters ? [filters] : [])] as const,
    report: (filters?: Record<string, unknown>) =>
        ["report", ...(filters ? [filters] : [])] as const,
    workflow: (id: number | string) =>
        ["workflow", id] as const,
    workflows: (filters?: Record<string, unknown>) =>
        ["workflows", ...(filters ? [filters] : [])] as const,
};
