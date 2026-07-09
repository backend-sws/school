import api from "./api";

const API_URL = "/support/tickets";

const SupportTicketApi = {
  getSupportTicket: (params?: Record<string, any>) =>
    api.get(API_URL, { params }),

  getSupportTicketById: (id: string) => api.get(`${API_URL}/${id}`),

  createSupportTicket: (data: any) => api.post(`${API_URL}/create`, data),

  updateSupportTicket: (id: string, data: any) =>
    api.patch(`${API_URL}/${id}/priority`, { priority: data }),
  togglSupportTicket: (id: string) => api.patch(`${API_URL}/${id}/toggle-read`),
  closeeSupportTicket: (id: string) => api.post(`${API_URL}/${id}/close`),
  postReply: (id: string, data: any) =>
    api.post(`${API_URL}/${id}/reply`, data),
};

export default SupportTicketApi;
