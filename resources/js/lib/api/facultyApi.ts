import api from "./api";

const API_URL = "/website/faculties";

const FacultyApi = {
    getFaculties: (params?: Record<string, any>) =>
        api.get(`${API_URL}`, {
            params,
        }),

    createFaculty: (data: any) => api.post(`${API_URL}`, data),

    getFacultyById: (id: number | string) => api.get(`${API_URL}/${id}`),

    updateFaculty: (id: number | string, data: any) =>
        api.put(`${API_URL}/${id}`, data),

    deleteFaculty: (id: number | string) => api.delete(`${API_URL}/${id}`),
};

export default FacultyApi;
