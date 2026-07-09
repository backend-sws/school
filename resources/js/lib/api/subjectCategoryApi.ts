import api from "./api";

const API_URL = "/subject-categories";

const SubjectCategoryApi = {
  getSubjectCategory: (params?: Record<string, any>) => {
    return api.get(API_URL, {
      params,
    });
  },

  createSubjectCatergory: (data: any) => api.post(`${API_URL}`, data),

  getSubjectCatergoryById: (id: number | string) => api.get(`${API_URL}/${id}`),

  updateSubjectCatergory: (id: number | string, data: any) =>
    api.put(`${API_URL}/${id}`, data),

  deleteSubjectCatergory: (id: number | string) =>
    api.delete(`${API_URL}/${id}`),
};

export default SubjectCategoryApi;
