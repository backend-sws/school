import api from "./api";

const API_URL = "/institutions";

export interface Institution {
  id: number;
  name: string;
  code?: string | null;
  type?: string;
  organization_id?: number | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  status?: number;
}

const InstitutionApi = {
  index: (params?: { per_page?: number; page?: number }) =>
    api.get(API_URL, { params }),

  store: (data: Record<string, unknown>) =>
    api.post<{ data: Institution }>(API_URL, data),

  show: (id: number | string) =>
    api.get<{ data: Institution }>(`${API_URL}/${id}`),

  update: (id: number | string, data: Record<string, unknown>) =>
    api.put<{ data: Institution }>(`${API_URL}/${id}`, data),

  destroy: (id: number | string) =>
    api.delete<{ data: null }>(`${API_URL}/${id}`),
};

export default InstitutionApi;
