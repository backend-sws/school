import api from "./api";

const BASE = "/attendance";

export type AttendanceLevel = "class" | "subject";

export type AttendanceRecordRow = {
  id?: number;
  user_id: number;
  user_name: string;
  roll_no?: string;
  status: string;
  has_record?: boolean;
  remarks?: string | null;
  date: string;
};

export type AttendanceMeta = {
  is_sunday: boolean;
  is_holiday: boolean;
  holiday: { id: number; name: string; description?: string | null } | null;
};

export type DailyResponse = {
  records: AttendanceRecordRow[];
  summary: { present: number; absent: number; late: number; leave: number; holiday: number; total: number };
  level: AttendanceLevel;
  class_subject_allocation_id: number | null;
  meta?: AttendanceMeta | null;
};

export type DayMeta = {
  day: number;
  day_name: string;
  is_sunday: boolean;
  holiday: { id: number; name: string; description?: string | null } | null;
};

export type LedgerStudentRow = {
  user_id: number;
  roll_no: string;
  name: string;
  summary: {
    present: number;
    absent: number;
    late: number;
    leave: number;
    holiday: number;
    total_marked: number;
  };
  days: Record<string, { id?: number; status: string; remarks?: string | null } | null>;
};

export type AttendanceLedgerData = {
  class_id: number;
  class_name: string;
  subject_name: string;
  level: AttendanceLevel;
  month: string;
  days_in_month: number;
  days_meta: Record<string, DayMeta>;
  matrix: LedgerStudentRow[];
  working_days: number;
  total_students: number;
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
  }) => api.get<{ data?: DailyResponse } & DailyResponse>(`${BASE}/daily`, { params }),

  submitDaily: (payload: {
    lms_class_id: number;
    date: string;
    level: AttendanceLevel;
    class_subject_allocation_id?: number | null;
    records: Array<{ user_id: number; status: string; remarks?: string | null }>;
  }) => api.post(`${BASE}/daily`, payload),

  ledger: (params: {
    lms_class_id: number;
    month?: string;
    level?: AttendanceLevel;
    class_subject_allocation_id?: number | null;
  }) => api.get<{ data: AttendanceLedgerData }>(`${BASE}/ledger`, { params }),

  markCell: (payload: {
    lms_class_id: number;
    user_id: number;
    date: string;
    status: string;
    level?: AttendanceLevel;
    class_subject_allocation_id?: number | null;
    remarks?: string | null;
  }) => api.post(`${BASE}/mark-cell`, payload),

  export: (params: {
    lms_class_id: number;
    month?: string;
    level?: AttendanceLevel;
    class_subject_allocation_id?: number | null;
  }) => api.get(`${BASE}/export`, { params, responseType: "blob" }),

  downloadTemplate: (params: {
    lms_class_id: number;
    month?: string;
    level?: AttendanceLevel;
    class_subject_allocation_id?: number | null;
  }) => api.get(`${BASE}/template`, { params, responseType: "blob" }),

  import: (formData: FormData) =>
    api.post<{ data: { imported_count: number; skipped_count: number; errors: string[]; total_errors: number } }>(
      `${BASE}/import`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    ),

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

