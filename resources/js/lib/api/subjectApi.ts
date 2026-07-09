import api from "./api";

const BASE = "/subjects";

const subjectApi = {
  // Standard CRUD (new convention)
  index: (params?: Record<string, unknown>) => api.get(BASE, { params }),
  show: (id: number | string) => api.get(`${BASE}/${id}`),
  store: (data: Record<string, unknown>) => api.post(BASE, data),
  update: (id: number | string, data: Record<string, unknown>) =>
    api.put(`${BASE}/${id}`, data),
  destroy: (id: number | string) => api.delete(`${BASE}/${id}`),

  // Backward-compatible aliases (used by other components)
  getSubjects: (params?: Record<string, any>) => api.get(BASE, { params }),
  getSubjectById: (id: string | number) => api.get(`${BASE}/${id}`),
  createSubject: (data: any) => api.post(BASE, data),
  updateSubject: (id: string | number, data: any) => api.put(`${BASE}/${id}`, data),
  deleteSubject: (id: string | number) => api.delete(`${BASE}/${id}`),

  // Custom
  getMappedCategories: (subjectId: number | string) =>
    api.get(`${BASE}/${subjectId}/mapped-categories`),
};

export default subjectApi;
