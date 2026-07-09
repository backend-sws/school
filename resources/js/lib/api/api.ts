import axios from "axios";

const baseApiSettings = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

baseApiSettings.interceptors.response.use(
  (response) => {
    // ✅ Keep full response for file downloads
    if (response.config.responseType === "blob") {
      return response;
    }
    return response.data;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

// Centralized request wrapper
export const api = {
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    return await baseApiSettings.get(url, config);
  },
  post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return await baseApiSettings.post(url, data, config);
  },
  put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return await baseApiSettings.put(url, data, config);
  },
  patch: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return await baseApiSettings.patch(url, data, config);
  },
  delete: async <T = any>(url: string, config?: any): Promise<T> => {
    return await baseApiSettings.delete(url, config);
  },
};

export default api;
