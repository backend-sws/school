import api from "./api";

const BASE = "/streams";

const streamApi = {
  /** Authenticated — GET /streams (with optional filters) */
  index: (params?: Record<string, unknown>) =>
    api.get(BASE, { params }),

  /** Alias for index — used system-wide by useCollegeStreams + Regulations page */
  getStreams: (params?: Record<string, any>) =>
    api.get(BASE, { params }),

  /** Public — GET /public/streams (no auth, student registration) */
  getPublicStreams: (params?: Record<string, any>) =>
    api.get(`/public/streams`, { params }),

  show: (id: number | string) => api.get(`${BASE}/${id}`),
  store: (data: Record<string, unknown>) => api.post(BASE, data),
  update: (id: number | string, data: Record<string, unknown>) =>
    api.put(`${BASE}/${id}`, data),
  destroy: (id: number | string) => api.delete(`${BASE}/${id}`),
  toggleStatus: (id: number | string) =>
    api.patch(`${BASE}/${id}/toggle-status`),
};

export default streamApi;
