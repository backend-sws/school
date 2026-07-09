import api from "./api";

const BASE = "/id-card-templates";
const CARDS_BASE = "/id-cards";

export const IdCardTemplateApi = {
    index: (params?: Record<string, unknown>) => api.get(BASE, { params }),
    store: (data: Record<string, unknown>) => api.post(BASE, data),
    show: (id: number) => api.get(`${BASE}/${id}`),
    update: (id: number, data: Record<string, unknown>) =>
        api.put(`${BASE}/${id}`, data),
    destroy: (id: number) => api.delete(`${BASE}/${id}`),
    toggleStatus: (id: number) =>
        api.patch(`${BASE}/${id}/toggle-status`),
};

export const IdCardApi = {
    index: (params?: Record<string, unknown>) =>
        api.get(CARDS_BASE, { params }),
    show: (id: number) => api.get(`${CARDS_BASE}/${id}`),
    generate: (data: {
        template_id: number;
        session_id: number;
        stream_id?: number;
        user_id?: number;
        student_ids?: number[];
        snapshot_data?: Record<string, string | undefined>;
        photo_url?: string;
    }) => api.post(`${CARDS_BASE}/generate`, data),
    regenerate: (id: number) =>
        api.post(`${CARDS_BASE}/${id}/regenerate`),
    revoke: (id: number) => api.patch(`${CARDS_BASE}/${id}/revoke`),
    download: (id: number) =>
        api.get(`${CARDS_BASE}/${id}/download`, { responseType: "blob" }),
    bulkDownload: (params?: Record<string, unknown>) =>
        api.get(`${CARDS_BASE}/bulk-download`, {
            params,
            responseType: "blob",
        }),
};

export const IdCardVerifyApi = {
    verify: (token: string) =>
        api.get(`/public/verify/id-card/${token}`),
};

export const StudentIdCardApi = {
    show: () => api.get("/student/id-card"),
    download: () =>
        api.get("/student/id-card/download", { responseType: "blob" }),
};
