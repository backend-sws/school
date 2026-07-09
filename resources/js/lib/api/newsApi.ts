import api from "./api";

const API_URL = "/website/news";

const NewsApi = {
    getNews: (params?: Record<string, any>) =>
        api.get(`${API_URL}`, {
            params,
        }),

    createNews: (data: any) => api.post(`${API_URL}`, data),

    getNewsById: (id: number | string) => api.get(`${API_URL}/${id}`),

    updateNews: (id: number | string, data: any) =>
        api.put(`${API_URL}/${id}`, data),

    deleteNews: (id: number | string) => api.delete(`${API_URL}/${id}`),
};

export default NewsApi;
