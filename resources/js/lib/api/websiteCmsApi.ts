import api from "./api";

const SLIDER_API_URL = "/sliders";
const NEWS_API_URL = "/news";
const GALLERIES_API_URL = "/galleries";

const WebsiteCmsApi = {
  getSliders: (params?: Record<string, any>) =>
    api.get(`/website${SLIDER_API_URL}`, { params }),

  getSlidersById: (id: string) => api.get(`/website${SLIDER_API_URL}/${id}`),
  createSliders: (data: any) => api.post(`/website${SLIDER_API_URL}`, data),

  updateSliders: (id: string, data: any) =>
    api.put(`/website${SLIDER_API_URL}/${id}`, data),

  toggleSliders: (id: string) =>
    api.patch(`${SLIDER_API_URL}/${id}/toggle-read`),
  deleteSliders: (id: string) => api.delete(`/website${SLIDER_API_URL}/${id}`),
};

export default WebsiteCmsApi;
