import api from "./api";

const BASE = "/gate-security";

const gateSecurityApi = {
  passes: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/passes`, { params }),
    show: (id: string | number) => api.get(`${BASE}/passes/${id}`),
    store: (data: FormData | Record<string, unknown>) =>
      data instanceof FormData
        ? api.post(`${BASE}/passes`, data, { headers: { "Content-Type": "multipart/form-data" } })
        : api.post(`${BASE}/passes`, data),
    update: (id: string | number, data: FormData | Record<string, unknown>) => {
      if (data instanceof FormData) {
        data.append("_method", "PUT");
        return api.post(`${BASE}/passes/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      return api.put(`${BASE}/passes/${id}`, data);
    },
    destroy: (id: string | number) => api.delete(`${BASE}/passes/${id}`),
    checkout: (id: string | number, data?: { exit_remarks?: string }) =>
      api.post(`${BASE}/passes/${id}/checkout`, data ?? {}),
    lookup: (phone: string) => api.get(`${BASE}/passes/lookup`, { params: { phone } }),
    analytics: () => api.get(`${BASE}/passes/analytics`),
    exportUrl: (params?: Record<string, unknown>) => {
      const q = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
        });
      }
      return `/api/v1/gate-security/passes/export?${q.toString()}`;
    },
  },
};

export default gateSecurityApi;
