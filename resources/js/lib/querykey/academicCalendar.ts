export const AcademicCalendarQueryKeys = {
  all: ["academic-calendar-settings"] as const,
  settings: (durationYears?: number) =>
    ["academic-calendar-settings", durationYears ?? 1] as const,
};
