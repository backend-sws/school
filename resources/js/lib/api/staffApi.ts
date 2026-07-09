import api from "./api";

const API_URL = "/staff";

const StaffApi = {
  listStaff: (params?: Record<string, unknown>) =>
    api.get(API_URL, { params }),

  getStaffById: (id: string) => api.get(`${API_URL}/${id}`),

  createStaff: (data: Record<string, unknown>) => api.post(API_URL, data),

  updateStaff: (id: string, data: Record<string, unknown>) =>
    api.put(`${API_URL}/${id}`, data),

  deleteStaff: (id: string) => api.delete(`${API_URL}/${id}`),
  resendInvitation: (id: string) => api.post(`${API_URL}/${id}/resend-invitation`),
};

export default StaffApi;
