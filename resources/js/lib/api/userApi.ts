import api from "./api";

const API_URL = "/users";

const UserApi = {
  getUser: (params?: Record<string, any>) => api.get(API_URL, { params }),

  getUserById: (id: string) => api.get(`${API_URL}/${id}`),

  createUser: (data: any) => api.post(API_URL, data),

  updateUser: (id: string, data: any) => api.put(`${API_URL}/${id}`, data),

  deleteUser: (id: string) => api.delete(`${API_URL}/${id}`),
};

export default UserApi;
