import api from "./api";

const API_URL = "/admission-heads";

const AdmissionHeadApi = {
  getAdmissionHead: (params?: Record<string, any>) =>
    api.get(API_URL, { params }),

  getAdmissionHeadById: (id: string) => api.get(`${API_URL}/${id}`),

  createAdmissionHead: (data: any) => api.post(API_URL, data),

  updateAdmissionHead: (id: string, data: any) =>
    api.put(`${API_URL}/${id}`, data),

  deleteAdmissionHead: (id: string) => api.delete(`${API_URL}/${id}`),

  updateStatus: (id: string | number, status: number) =>
    api.patch(`${API_URL}/${id}/status`, { status }),
};

export default AdmissionHeadApi;
