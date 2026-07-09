import api from "./api";

export type AcademicCalendarSettings = {
  session_start_month: number;
  start_month_label: string;
  expected_session: {
    start_year: number;
    end_year: number;
    name: string;
  };
};

export type AcademicCalendarUpdatePayload = {
  session_start_month: number;
  sync_current_session?: boolean;
  duration_years?: number;
};

const BASE = "/academic-calendar/settings";

const academicCalendarApi = {
  getSettings: (params?: { duration_years?: number }) =>
    api.get(BASE, { params }),

  updateSettings: (payload: AcademicCalendarUpdatePayload) =>
    api.patch(BASE, payload),
};

export default academicCalendarApi;
