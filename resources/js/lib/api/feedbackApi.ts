import api from "./api";

const API_URL = "/feedbacks";

const FeedbackApi = {
  getFeedback: (params?: Record<string, any>) => api.get(API_URL, { params }),

  getFeedbackById: (id: string) => api.get(`${API_URL}/${id}`),

  toggleFeedback: (id: string) => api.patch(`${API_URL}/${id}/toggle-read`),
  deleteFeedback: (id: string) => api.delete(`${API_URL}/${id}`),
};

export default FeedbackApi;
