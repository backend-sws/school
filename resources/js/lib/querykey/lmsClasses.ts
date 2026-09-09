export const LmsClassesQueryKeys = {
  all: ["lms-classes"] as const,
  streams: (filters?: Record<string, unknown>) =>
    filters ? (["lms-streams", filters] as const) : (["lms-streams"] as const),
  sessions: () => ["sessions-list"] as const,
  detail: (id: number | string) => ["lms-class", id] as const,
  streamDetail: (streamId: number | string) => ["stream-detail", streamId] as const,
  streamClasses: (filters?: Record<string, unknown>) =>
    filters ? (["lms-classes", filters] as const) : (["lms-classes"] as const),
  allocations: (classId: number | string) => ["lms-class-allocations", classId] as const,
  enrollments: (classId: number | string) => ["lms-class-enrollments", classId] as const,
  assignments: (classId: number | string, filters?: Record<string, unknown>) =>
    filters ? (["lms-class-assignments", classId, filters] as const) : (["lms-class-assignments", classId] as const),
  tests: (classId: number | string, filters?: Record<string, unknown>) =>
    filters ? (["lms-class-tests", classId, filters] as const) : (["lms-class-tests", classId] as const),
  liveSessions: (classId: number | string, filters?: Record<string, unknown>) =>
    filters ? (["lms-class-live-sessions", classId, filters] as const) : (["lms-class-live-sessions", classId] as const),
  recordings: (classId: number | string, filters?: Record<string, unknown>) =>
    filters ? (["lms-class-recordings", classId, filters] as const) : (["lms-class-recordings", classId] as const),
  announcements: (classId: number | string, filters?: Record<string, unknown>) =>
    filters ? (["lms-class-announcements", classId, filters] as const) : (["lms-class-announcements", classId] as const),
  materials: (classId: number | string, filters?: Record<string, unknown>) =>
    filters ? (["lms-class-materials", classId, filters] as const) : (["lms-class-materials", classId] as const),
  attendanceSummary: (classId: number | string, allocationId?: number) =>
    allocationId != null
      ? (["lms-class-attendance-summary", classId, allocationId] as const)
      : (["lms-class-attendance-summary", classId] as const),
};
