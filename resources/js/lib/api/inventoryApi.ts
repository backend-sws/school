import api from "./api";

const BASE = "/inventory";

const inventoryApi = {
  locations: {
    index: (params?: Record<string, unknown>) =>
      api.get(`${BASE}/locations`, { params }),
    show: (id: string | number) => api.get(`${BASE}/locations/${id}`),
    store: (data: Record<string, unknown>) =>
      api.post(`${BASE}/locations`, data),
    update: (id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/locations/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/locations/${id}`),
  },
  categories: {
    index: (params?: Record<string, unknown>) =>
      api.get(`${BASE}/categories`, { params }),
    show: (id: string | number) => api.get(`${BASE}/categories/${id}`),
    store: (data: Record<string, unknown>) =>
      api.post(`${BASE}/categories`, data),
    update: (id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/categories/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/categories/${id}`),
  },
  items: {
    index: (params?: Record<string, unknown>) =>
      api.get(`${BASE}/items`, { params }),
    show: (id: string | number) => api.get(`${BASE}/items/${id}`),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/items`, data),
    update: (id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/items/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/items/${id}`),
  },
  movements: {
    index: (params?: Record<string, unknown>) =>
      api.get(`${BASE}/movements`, { params }),
    show: (id: string | number) => api.get(`${BASE}/movements/${id}`),
    store: (data: Record<string, unknown>) =>
      api.post(`${BASE}/movements`, data),
  },
  reports: {
    lowStock: (params?: Record<string, unknown>) => api.get(`${BASE}/reports/low-stock`, { params }),
    exportLowStock: async (params?: Record<string, unknown>) => {
      const response = await api.get(`${BASE}/reports/low-stock/export`, {
        params,
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `low_stock_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  },
  sales: {
    index: (params?: Record<string, unknown>) =>
      api.get(`${BASE}/sales`, { params }),
    show: (id: string | number) => api.get(`${BASE}/sales/${id}`),
    store: (data: Record<string, unknown>) =>
      api.post(`${BASE}/sales`, data),
    confirm: (id: string | number, data?: Record<string, unknown>) =>
      api.post(`${BASE}/sales/${id}/confirm`, data ?? {}),
  },
};

export default inventoryApi;
