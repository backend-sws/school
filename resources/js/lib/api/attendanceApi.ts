import api from "./api";

const BASE = "/attendance";

export type AttendanceLevel = "class" | "subject";

export type AttendanceRecordRow = {
  id?: number;
  user_id: number;
  user_name: string;
  status: string;
  remarks?: string | null;
  date: string;
};

export type DailyResponse = {
  records: AttendanceRecordRow[];
  summary: { present: number; absent: number; late: number; leave: number; holiday: number; total: number };
  level: AttendanceLevel;
  class_subject_allocation_id: number | null;
};

const attendanceApi = {
  classes: (params?: { session_id?: number; per_page?: number; all?: boolean }) =>
    api.get<{ data: unknown[]; meta?: { total: number }; current_page?: number; last_page?: number }>(`${BASE}/classes`, { params }),

  allocationsForClass: (lmsClassId: number) =>
    api.get<Array<{ id: number; subject: { id: number; name: string; code?: string } | null; instructor: { id: number; name: string } | null }>>(
      `${BASE}/classes/${lmsClassId}/allocations`
    ),

  getDaily: (params: {
    lms_class_id: number;
    date: string;
    level?: AttendanceLevel;
    class_subject_allocation_id?: number | null;
  }) => api.get<{ records: AttendanceRecordRow[]; summary: DailyResponse["summary"]; level: AttendanceLevel; class_subject_allocation_id: number | null }>(`${BASE}/daily`, { params }),

  submitDaily: (payload: {
    lms_class_id: number;
    date: string;
    level: AttendanceLevel;
    class_subject_allocation_id?: number | null;
    records: Array<{ user_id: number; status: string; remarks?: string | null }>;
  }) => api.post(`${BASE}/daily`, payload),

  updateRecord: (id: number, data: { status?: string; remarks?: string | null }) =>
    api.put(`${BASE}/records/${id}`, data),

  destroyRecord: (id: number) => api.delete(`${BASE}/records/${id}`),

  reports: {
    daily: (params: {
      lms_class_id: number;
      date: string;
      level?: AttendanceLevel;
      class_subject_allocation_id?: number | null;
    }) => api.get<DailyResponse>(`${BASE}/reports/daily`, { params }),
    summary: (params: {
      lms_class_id?: number;
      user_id?: number;
      session_id?: number;
      from_date: string;
      to_date: string;
      level?: AttendanceLevel;
    }) =>
      api.get<{
        summary: { present: number; absent: number; late: number; leave: number; holiday: number; total: number; percentage_present: number };
        from_date: string;
        to_date: string;
        threshold_percentage?: number | null;
      }>(`${BASE}/reports/summary`, { params }),
  },
};

export default attendanceApi;
