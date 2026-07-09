import api from "./api";

const BASE = "/fee-regulation-profiles";

export type FeeProfileItem = {
  id?: number;
  fee_type_id: number;
  amount: number;
  fee_type?: { id: number; name: string; category?: string };
};

export type FeeProfile = {
  id: number;
  institution_id: number;
  name: string;
  profile_type: string | null;
  gender: string | null;
  category: string | null;
  description: string | null;
  is_default: boolean;
  items?: FeeProfileItem[];
  created_at?: string;
  updated_at?: string;
};

const feeProfilesApi = {
  index: (params?: Record<string, unknown>) =>
    api.get(BASE, { params }),
  show: (id: number) =>
    api.get<{ data?: FeeProfile }>(`${BASE}/${id}`).then((r: any) => r?.data ?? r),
  store: (data: {
    name: string;
    profile_type?: string | null;
    gender?: string | null;
    category?: string | null;
    description?: string | null;
    is_default?: boolean;
    items: { fee_type_id: number; amount: number }[];
  }) => api.post(BASE, data),
  update: (
    id: number,
    data: {
      name?: string;
      profile_type?: string | null;
      gender?: string | null;
      category?: string | null;
      description?: string | null;
      is_default?: boolean;
      items?: { fee_type_id: number; amount: number }[];
    }
  ) => api.put(`${BASE}/${id}`, data),
  destroy: (id: number) => api.delete(`${BASE}/${id}`),
};

export default feeProfilesApi;
