/**
 * Re-Admission API – eligible list, prefill, preview-fees, process, bulk, history, rollback.
 */
import api from "./api";

const BASE = "/readmissions";

export interface ReadmissionHistoryParams {
    per_page?: number;
    page?: number;
}

export interface ReadmissionEligibleParams {
    include_active?: boolean;
    from_session_id?: number;
    stream_id?: number;
}

export interface BulkReadmissionPayload {
    to_session_id: number;
    to_semester?: number;
    to_class_id?: number;
    from_session_id?: number;
    stream_id?: number;
    exclude_ids?: number[];
}

const ReadmissionApi = {
    eligible: (params?: ReadmissionEligibleParams) =>
        api.get<{ data: unknown[] }>(BASE + "/eligible", { params }),

    prefill: (studentProfileId: number | string) =>
        api.get<{ data: { student_profile: unknown; prefill: Record<string, unknown> } }>(`${BASE}/prefill/${studentProfileId}`),

    previewFees: (studentProfileId: number | string, admissionHeadId: number) =>
        api.get<{ data: { items: unknown[]; gross: number; discount: number; net: number } }>(`${BASE}/preview-fees/${studentProfileId}`, {
            params: { admission_head_id: admissionHeadId },
        }),

    process: (data: {
        student_profile_id: number;
        to_session_id: number;
        to_semester?: number;
        to_class_id?: number;
        to_stream_id?: number;
        dropout_reason?: string;
        gap_duration_months?: number;
        admission_application_id?: number;
        remarks?: string;
        create_application?: boolean;
    }) => api.post(BASE + "/process", data),

    bulk: (data: BulkReadmissionPayload) =>
        api.post<{ data: { readmitted: number; skipped: number } }>(BASE + "/bulk", data),

    history: (params?: ReadmissionHistoryParams) =>
        api.get<{ data: unknown[]; meta?: { current_page: number; last_page: number; total: number; per_page?: number } }>(BASE + "/history", { params }),

    rollback: (transitionId: number | string) =>
        api.post(`${BASE}/${transitionId}/rollback`),
};

export default ReadmissionApi;

