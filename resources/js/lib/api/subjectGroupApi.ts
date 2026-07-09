import api from "./api";

const API_URL = "/subject-groups";

const SubjectGroupApi = {
  getSubjectGroup: (params?: Record<string, any>) =>
    api.get(`${API_URL}`, {
      params,
    }),

  createSubjectGroup: (data: any) => api.post(`${API_URL}`, data),

  getSubjectGroupById: (id: number | string) => api.get(`${API_URL}/${id}`),

  updateSubjectGroup: (id: number | string, data: any) =>
    api.put(`${API_URL}/${id}`, data),

  deleteSubjectGroup: (id: number | string) => api.delete(`${API_URL}/${id}`),
};

export default SubjectGroupApi;
