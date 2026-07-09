import api from "./api";

const API_URL = "/website/sliders";

const SliderApi = {
    getSliders: (params?: Record<string, any>) =>
        api.get(`${API_URL}`, {
            params,
        }),

    createSlider: (data: any) => api.post(`${API_URL}`, data),

    getSliderById: (id: number | string) => api.get(`${API_URL}/${id}`),

    updateSlider: (id: number | string, data: any) =>
        api.put(`${API_URL}/${id}`, data),

    deleteSlider: (id: number | string) => api.delete(`${API_URL}/${id}`),
};

export default SliderApi;
