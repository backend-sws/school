import api from "./api";

const API_URL = "/notices";

const NoticeApi = {
  getNotices: (params: Record<string, any>) => {
    return api.get(`${API_URL}`, {
      params
    });
  },
  createNotice: (data: Record<string, any>) => {
    return api.post(`${API_URL}`, data);
  },
  getNoticeById: (id: number | string) => {
    return api.get(`${API_URL}/${id}/edit`);
  },
  updateNoticeStatus: (id: number | string, data: Record<string, any>) => {
    return api.patch(`${API_URL}/${id}/toggle-status`, data);
  },
  updateNotice: (id: number | string, data: Record<string, any>) => {
    return api.put(`${API_URL}/${id}`, data);
  },
  deleteNotice: (id: number | string) => {
    return api.delete(`${API_URL}/${id}`);
  }
}

export default NoticeApi;
