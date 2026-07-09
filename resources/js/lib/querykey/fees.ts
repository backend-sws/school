export const FeeTypeQueryKeys = {
    all: ["fee-types"] as const,
    list: (filters?: Record<string, unknown>) =>
        [...FeeTypeQueryKeys.all, "list", filters] as const,
    detail: (id: number | string) =>
        [...FeeTypeQueryKeys.all, "detail", id] as const,
};

export const FeeCollectionQueryKeys = {
    all: ["fee-collection"] as const,
    settings: () => ["fee-collection-settings"] as const,
    dues: (filters?: Record<string, unknown>) =>
        ["fee-dues", ...(filters ? [filters] : [])] as const,
    monthlyLedger: (filters?: Record<string, unknown>) =>
        ["monthly-ledger", ...(filters ? [filters] : [])] as const,
    analytics: (filters?: Record<string, unknown>) =>
        ["analytics-fee-hub", ...(filters ? [filters] : [])] as const,
    studentLedgerMatrix: (id: number | string) =>
        ["student-ledger-matrix", id] as const,
    studentSearch: (term: string) =>
        ["student-search", term] as const,
    classFees: (classId: number | string) =>
        ["class-fees", classId] as const,
    availableFees: (filters?: Record<string, unknown>) =>
        ["availableFees", ...(filters ? [filters] : [])] as const,
    regulationProfiles: (filters?: Record<string, unknown>) =>
        ["fee-regulation-profiles", ...(filters ? [filters] : [])] as const,
    feesParticular: (filters?: Record<string, unknown>) =>
        ["fees-particular", ...(filters ? [filters] : [])] as const,
    studentTransactions: (id: number | string) =>
        ["studentTransactions", id] as const,
};
