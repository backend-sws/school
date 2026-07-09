import api from "./api";

const API_URL = "/grievances";

const GrievancesApi = {
  getGrievances: (params?: Record<string, any>) => api.get(API_URL, { params }),

  getGrievancesById: (id: string) => api.get(`${API_URL}/${id}`),

  updateGrievances: (id: string, data: any) =>
    api.post(`${API_URL}/${id}/resolve`, data),

  deleteGrievances: (id: string) => api.delete(`${API_URL}/${id}`),
};

export default GrievancesApi;
