import api from "./api";
import { cleanFilterParams } from "@/lib/utils";

const API_URL = "/sessions";

function buildSessionParams(filter: Record<string, any> = {}) {
  const params: Record<string, any> = {};
  if (filter.page != null) params.page = filter.page;
  if (filter.perPage != null) params.per_page = filter.perPage;

  const searchVal = typeof filter.search === "string" ? filter.search : "";
  if (searchVal && searchVal !== "__all__") {
    params.search = searchVal;
  }

  return cleanFilterParams(params);
}

const SessionApi = {
  getSessions: (filter?: Record<string, any>) =>
    api.get(`${API_URL}`, {
      params: buildSessionParams(filter),
    }),

  /** Current session for the institution (resolved via academic calendar + is_current fallback). */
  getCurrentSession: () => api.get<{ data?: { id: number; name: string } | null }>(`${API_URL}/current`),

  getSuggestedYears: (durationYears = 4) =>
    api.get(`${API_URL}/suggested-years`, { params: { duration_years: durationYears } }),

  getPublicSessions: (params?: Record<string, any>) =>
    api.get(`public${API_URL}`, {
      params,
    }),

  getSessionsWithParams: (params?: Record<string, any>) =>
    api.get(`${API_URL}`, {
      params,
    }),

  createSession: (data: any) => api.post(`${API_URL}`, data),

  getSessionById: (id: number | string) => api.get(`${API_URL}/${id}`),

  updateSession: (id: number | string, data: any) =>
    api.put(`${API_URL}/${id}`, data),

  deleteStream: (id: number | string) => api.delete(`${API_URL}/${id}`),
};

export default SessionApi;
