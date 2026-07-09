import api from "./api";

const API_URL = "/organizations";

export interface Organization {
  id: number;
  name: string;
  code: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  status: number;
  institutions_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedOrganizations {
  data: Organization[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const OrganizationApi = {
  index: (params?: { per_page?: number; page?: number }) =>
    api.get<{ data: Organization[]; meta: PaginatedOrganizations["meta"] }>(API_URL, { params }),

  store: (data: Record<string, unknown>) =>
    api.post<{ data: Organization }>(API_URL, data),

  show: (id: number | string) =>
    api.get<{ data: Organization }>(`${API_URL}/${id}`),

  update: (id: number | string, data: Record<string, unknown>) =>
    api.put<{ data: Organization }>(`${API_URL}/${id}`, data),

  destroy: (id: number | string) =>
    api.delete<{ data: null }>(`${API_URL}/${id}`),

  institutions: (
    id: number | string,
    params?: { page?: number; per_page?: number; search?: string; type?: string }
  ) =>
    api.get<{ data: unknown[]; meta: PaginatedOrganizations["meta"] }>(
      `${API_URL}/${id}/institutions`,
      { params }
    ),
};

export default OrganizationApi;
