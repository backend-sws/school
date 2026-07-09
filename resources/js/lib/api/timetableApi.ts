import api from "./api";

const API_URL = "/timetable";

const TimetableApi = {
    // Timetables
    getTimetables: (params?: Record<string, any>) => api.get(`${API_URL}/timetables`, { params }),
    getTimetableById: (id: number | string) => api.get(`${API_URL}/timetables/${id}`),
    createTimetable: (data: any) => api.post(`${API_URL}/timetables`, data),
    updateTimetable: (id: number | string, data: any) => api.put(`${API_URL}/timetables/${id}`, data),
    deleteTimetable: (id: number | string) => api.delete(`${API_URL}/timetables/${id}`),
    publishTimetable: (id: number | string) => api.post(`${API_URL}/timetables/${id}/publish`),
    saveEntries: (id: number | string, entries: any[]) => api.post(`${API_URL}/timetables/${id}/entries`, { entries }),

    // Templates
    getTemplates: (params?: Record<string, any>) => api.get(`${API_URL}/templates`, { params }),
    getTemplateById: (id: number | string) => api.get(`${API_URL}/templates/${id}`),
    createTemplate: (data: any) => api.post(`${API_URL}/templates`, data),
    updateTemplate: (id: number | string, data: any) => api.put(`${API_URL}/templates/${id}`, data),
    deleteTemplate: (id: number | string) => api.delete(`${API_URL}/templates/${id}`),

    // Rooms
    getRooms: (params?: Record<string, any>) => api.get(`${API_URL}/rooms`, { params }),

    // Substitutions
    getSubstitutions: (params?: Record<string, any>) => api.get(`${API_URL}/substitutions`, { params }),
    getSubstitutionCandidates: (params?: Record<string, any>) => api.get(`${API_URL}/substitutions/candidates`, { params }),
};

export default TimetableApi;
