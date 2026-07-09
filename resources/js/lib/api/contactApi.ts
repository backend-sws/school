import api from "./api";

const API_URL = "/contacts";

const ContactsApi = {
  getContacts: (params?: Record<string, any>) => api.get(API_URL, { params }),

  getContactsById: (id: string) => api.get(`${API_URL}/${id}`),

  toggleContacts: (id: string) => api.patch(`${API_URL}/${id}/toggle-read`),
  deleteContacts: (id: string) => api.delete(`${API_URL}/${id}`),
};

export default ContactsApi;
