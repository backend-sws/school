import api from "./api";

const API_URL = "/main-streams";

const MainStreamApi = {
  getMainStreams: (params: Record<string, any>) => api.get(API_URL, { params }),
  getMainStreamById: (id: string) => api.get(`${API_URL}/${id}`),
  createMainStream: (data: any) => api.post(API_URL, data),
  updateMainStream: (id: string, data: any) =>
    api.put(`${API_URL}/${id}`, data),
  deleteMainStream: (id: string) => api.delete(`${API_URL}/${id}`),
};

export default MainStreamApi;
