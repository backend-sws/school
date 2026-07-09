import api from "./api";

const BASE = "/fee-types";

const feeTypesApi = {
  index: (params?: Record<string, unknown>) =>
    api.get(BASE, { params }),
  show: (id: number) => api.get(`${BASE}/${id}`),
  store: (data: {
    name: string;
    category?: string;
    profile_type?: string | null;
    reservation_category?: string | null;
    gender?: string | null;
  }) => api.post(BASE, data),
  update: (id: number, data: {
    name?: string;
    category?: string;
    profile_type?: string | null;
    reservation_category?: string | null;
    gender?: string | null;
  }) => api.put(`${BASE}/${id}`, data),
  destroy: (id: number) => api.delete(`${BASE}/${id}`),
  restoreDefaults: () =>
    api.post<{ data?: { created: number }; message?: string }>(`${BASE}/restore-defaults`),
};

export default feeTypesApi;
