import api from "./api";

const BASE = "/library";

const libraryApi = {
  books: {
    index: (params?: Record<string, unknown>) =>
      api.get(`${BASE}/books`, { params }),
    show: (id: string | number) => api.get(`${BASE}/books/${id}`),
    store: (data: Record<string, unknown>) =>
      api.post(`${BASE}/books`, data),
    update: (id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/books/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/books/${id}`),
  },
  copies: {
    index: (params?: Record<string, unknown>) =>
      api.get(`${BASE}/copies`, { params }),
    show: (id: string | number) => api.get(`${BASE}/copies/${id}`),
    store: (data: Record<string, unknown>) =>
      api.post(`${BASE}/copies`, data),
    update: (id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/copies/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/copies/${id}`),
  },
  issues: {
    index: (params?: Record<string, unknown>) =>
      api.get(`${BASE}/issues`, { params }),
    show: (id: string | number) => api.get(`${BASE}/issues/${id}`),
    store: (data: Record<string, unknown>) =>
      api.post(`${BASE}/issues`, data),
    update: (id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/issues/${id}`, data),
    returnBook: (id: string | number) =>
      api.post(`${BASE}/issues/${id}/return`, {}),
  },
};

export default libraryApi;
