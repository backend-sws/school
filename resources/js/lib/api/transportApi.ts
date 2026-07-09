import api from "./api";

const BASE = "/transport";

const transportApi = {
  stops: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/stops`, { params }),
    show: (id: string | number) => api.get(`${BASE}/stops/${id}`),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/stops`, data),
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/stops/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/stops/${id}`),
  },
  routes: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/routes`, { params }),
    show: (id: string | number) => api.get(`${BASE}/routes/${id}`),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/routes`, data),
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/routes/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/routes/${id}`),
  },
  routeStops: {
    index: (routeId: string | number) => api.get(`${BASE}/routes/${routeId}/stops`),
    store: (routeId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/routes/${routeId}/stops`, data),
    updateBulk: (routeId: string | number, stops: Array<Record<string, unknown>>) =>
      api.put(`${BASE}/routes/${routeId}/stops`, { stops }),
    destroy: (routeId: string | number, routeStopId: string | number) =>
      api.delete(`${BASE}/routes/${routeId}/stops/${routeStopId}`),
  },
  drivers: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/drivers`, { params }),
    show: (id: string | number) => api.get(`${BASE}/drivers/${id}`),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/drivers`, data),
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/drivers/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/drivers/${id}`),
  },
  vehicles: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/vehicles`, { params }),
    show: (id: string | number) => api.get(`${BASE}/vehicles/${id}`),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/vehicles`, data),
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/vehicles/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/vehicles/${id}`),
  },
  assignments: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/assignments`, { params }),
    show: (id: string | number) => api.get(`${BASE}/assignments/${id}`),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/assignments`, data),
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/assignments/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/assignments/${id}`),
  },
  reports: {
    manifest: (params: { route_id: number; date?: string }) => api.get(`${BASE}/reports/manifest`, { params }),
    occupancy: (params?: { date?: string }) => api.get(`${BASE}/reports/occupancy`, { params }),
  },
};

export default transportApi;
