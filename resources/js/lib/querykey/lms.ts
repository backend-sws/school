export const LmsQueryKeys = {
    all: ["lms"] as const,
    classes: (filters?: Record<string, unknown>) =>
        ["lms-classes", ...(filters ? [filters] : [])] as const,
    classesList: () => ["lms-classes-list"] as const,
    classDetail: (id: number | string) =>
        ["lms-class", id] as const,
    classAllocations: (id: number | string) =>
        ["lms-class-allocations", id] as const,
    classEnrollments: (id: number | string) =>
        ["lms-class-enrollments", id] as const,
    classAnnouncements: (id: number | string) =>
        ["lms-class-announcements", id] as const,
    classAssignments: (id: number | string) =>
        ["lms-class-assignments", id] as const,
    classMaterials: (id: number | string) =>
        ["lms-class-materials", id] as const,
    classTests: (id: number | string) =>
        ["lms-class-tests", id] as const,
    classLiveSessions: (id: number | string) =>
        ["lms-class-live-sessions", id] as const,
    classRecordings: (id: number | string) =>
        ["lms-class-recordings", id] as const,
    classAttendanceSummary: (id: number | string) =>
        ["lms-class-attendance-summary", id] as const,
    courses: (filters?: Record<string, unknown>) =>
        ["lms-courses", ...(filters ? [filters] : [])] as const,
    materials: (filters?: Record<string, unknown>) =>
        ["lms-materials", ...(filters ? [filters] : [])] as const,
    announcements: (filters?: Record<string, unknown>) =>
        ["lms-announcements", ...(filters ? [filters] : [])] as const,
    assignments: (filters?: Record<string, unknown>) =>
        ["lms-assignments", ...(filters ? [filters] : [])] as const,
    tests: (filters?: Record<string, unknown>) =>
        ["lms-tests", ...(filters ? [filters] : [])] as const,
    liveSessions: (filters?: Record<string, unknown>) =>
        ["lms-live-sessions", ...(filters ? [filters] : [])] as const,
    recordings: (filters?: Record<string, unknown>) =>
        ["lms-recordings", ...(filters ? [filters] : [])] as const,
    streams: () => ["lms-streams"] as const,
    myClasses: () => ["lms-my-classes"] as const,
};
