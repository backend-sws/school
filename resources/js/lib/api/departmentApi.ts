import api from "./api";

const API_URL = "/departments";

const DepartmentApi = {
  getDepartment: (params?: Record<string, any>) => api.get(API_URL, { params }),

  getDepartmentById: (id: string) => api.get(`${API_URL}/${id}`),

  createDepartment: (data: any) => api.post(API_URL, data),

  updateDepartment: (id: string, data: any) =>
    api.put(`${API_URL}/${id}`, data),

  deleteDepartment: (id: string) => api.delete(`${API_URL}/${id}`),
};

export default DepartmentApi;
