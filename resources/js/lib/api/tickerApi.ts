import api from "./api";

const API_URL = "/website/tickers";

const TickerApi = {
    getTickers: (params?: Record<string, any>) =>
        api.get(`${API_URL}`, {
            params,
        }),

    createTicker: (data: any) => api.post(`${API_URL}`, data),

    getTickerById: (id: number | string) => api.get(`${API_URL}/${id}`),

    updateTicker: (id: number | string, data: any) =>
        api.put(`${API_URL}/${id}`, data),

    deleteTicker: (id: number | string) => api.delete(`${API_URL}/${id}`),
};

export default TickerApi;
