/**
 * Promotion API – list eligible students, promote, bulk promote, history, rollback.
 */
import api from "./api";

const BASE = "/promotions";

export interface PromotionEligibleParams {
    session_id: number | string;
    stream_id?: number | string;
    semester?: number | string;
    class_id?: number | string;
}

export interface PromotionHistoryParams {
    per_page?: number;
    page?: number;
}

const PromotionApi = {
    eligible: (params: PromotionEligibleParams) =>
        api.get<{ data: unknown[] }>(BASE + "/eligible", { params }),

    promote: (data: {
        student_profile_id: number;
        to_session_id: number;
        to_semester?: number;
        to_class_id?: number;
        from_class_id?: number;
        is_detained?: boolean;
        detention_reason?: string;
        academic_result?: string;
        remarks?: string;
    }) => api.post(BASE + "/promote", data),

    bulkPromote: (data: {
        from_session_id: number | string;
        to_session_id: number | string;
        to_semester?: number;
        to_class_id?: number;
        stream_id?: number | string;
        semester?: number;
        class_id?: number | string;
        exclude_ids?: number[];
    }) => api.post<{ data: { promoted: number; skipped: number } }>(BASE + "/bulk-promote", data),

    history: (params?: PromotionHistoryParams) =>
        api.get<{ data: unknown[]; meta?: { current_page: number; last_page: number; total: number; per_page?: number } }>(BASE + "/history", { params }),

    rollback: (transitionId: number | string) =>
        api.post(`${BASE}/${transitionId}/rollback`),
};

export default PromotionApi;
