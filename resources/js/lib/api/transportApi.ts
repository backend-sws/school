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
    exportUrl: (params?: Record<string, unknown>) => {
      const q = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
        });
      }
      return `/api/v1/transport/vehicles/export?${q.toString()}`;
    },
  },
  vehicleLogs: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/vehicle-logs`, { params }),
    show: (id: string | number) => api.get(`${BASE}/vehicle-logs/${id}`),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/vehicle-logs`, data),
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/vehicle-logs/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/vehicle-logs/${id}`),
    exportUrl: (params?: Record<string, unknown>) => {
      const q = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
        });
      }
      return `/api/v1/transport/vehicle-logs/export?${q.toString()}`;
    },
  },
  vehicleFuels: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/vehicle-fuels`, { params }),
    show: (id: string | number) => api.get(`${BASE}/vehicle-fuels/${id}`),
    store: (data: FormData | Record<string, unknown>) =>
      data instanceof FormData
        ? api.post(`${BASE}/vehicle-fuels`, data, { headers: { "Content-Type": "multipart/form-data" } })
        : api.post(`${BASE}/vehicle-fuels`, data),
    update: (id: string | number, data: FormData | Record<string, unknown>) => {
      if (data instanceof FormData) {
        data.append("_method", "PUT");
        return api.post(`${BASE}/vehicle-fuels/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      return api.put(`${BASE}/vehicle-fuels/${id}`, data);
    },
    destroy: (id: string | number) => api.delete(`${BASE}/vehicle-fuels/${id}`),
    exportUrl: (params?: Record<string, unknown>) => {
      const q = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
        });
      }
      return `/api/v1/transport/vehicle-fuels/export?${q.toString()}`;
    },
  },
  vehicleExpenses: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/vehicle-expenses`, { params }),
    show: (id: string | number) => api.get(`${BASE}/vehicle-expenses/${id}`),
    store: (data: FormData | Record<string, unknown>) =>
      data instanceof FormData
        ? api.post(`${BASE}/vehicle-expenses`, data, { headers: { "Content-Type": "multipart/form-data" } })
        : api.post(`${BASE}/vehicle-expenses`, data),
    update: (id: string | number, data: FormData | Record<string, unknown>) => {
      if (data instanceof FormData) {
        data.append("_method", "PUT");
        return api.post(`${BASE}/vehicle-expenses/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      return api.put(`${BASE}/vehicle-expenses/${id}`, data);
    },
    destroy: (id: string | number) => api.delete(`${BASE}/vehicle-expenses/${id}`),
    exportUrl: (params?: Record<string, unknown>) => {
      const q = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
        });
      }
      return `/api/v1/transport/vehicle-expenses/export?${q.toString()}`;
    },
  },
  analytics: {
    vehicle: (id: string | number) => api.get(`${BASE}/vehicles/${id}/analytics`),
    fleet: () => api.get(`${BASE}/vehicles/fleet-analytics`),
    auditLogs: (id: string | number) => api.get(`${BASE}/vehicles/${id}/audit-logs`),
    fleetAuditLogs: () => api.get(`${BASE}/vehicles/fleet-audit-logs`),
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
