import api from "./api";

const API_URL = "/subject-category-mappings";
const SubjectMappingApi = {
  getSubjectMapping: (params?: Record<string, any>) =>
    api.get(API_URL, { params }),
  createSubjectMapping: (data: any) => api.post(`${API_URL}`, data),
  getSubjctMappingById: (id: string) => api.get(`${API_URL}/${id}`),
  updateSubjectMapping: (id: string, data: any) =>
    api.put(`${API_URL}/${id}`, data),

  deleteSubjectMapping: (id: string) => api.delete(`${API_URL}/${id}`),
};

export default SubjectMappingApi;
