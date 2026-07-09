export const SettingsQueryKeys = {
    all: ["settings"] as const,
    profile: () => ["profile"] as const,
    institution: () => ["settings"] as const,
    sessions: (filters?: Record<string, unknown>) =>
        ["sessions", ...(filters ? [filters] : [])] as const,
    sessionsList: () => ["sessions-list"] as const,
    sessionsCurrent: () => ["sessions-current"] as const,
    departments: (filters?: Record<string, unknown>) =>
        ["department", ...(filters ? [filters] : [])] as const,
    mainStreams: (filters?: Record<string, unknown>) =>
        ["main-streams", ...(filters ? [filters] : [])] as const,
    mainStreamsList: () => ["main-streams-list"] as const,
    streams: (filters?: Record<string, unknown>) =>
        ["streams", ...(filters ? [filters] : [])] as const,
    streamDetail: (id: number | string) =>
        ["stream-detail", id] as const,
    subStreams: (filters?: Record<string, unknown>) =>
        ["sub-streams", ...(filters ? [filters] : [])] as const,
    subjects: (filters?: Record<string, unknown>) =>
        ["subject", ...(filters ? [filters] : [])] as const,
    subjectCategory: () => ["subject-category"] as const,
    subjectCategoryMapping: () => ["subject-category-mapping"] as const,
    subjectGroups: (filters?: Record<string, unknown>) =>
        ["subject-group", ...(filters ? [filters] : [])] as const,
    seo: () => ["seo"] as const,
    admissionSettings: () => ["admissionForm"] as const,
    admissionVerification: () => ["admissionVerification"] as const,
    studentVerification: () => ["StudentVerification"] as const,
    digitalPresence: () => ["digital-presence"] as const,
    landingPageContent: () => ["landing-page-content"] as const,
    onboardingVerification: () => ["onboarding-verification"] as const,
};
