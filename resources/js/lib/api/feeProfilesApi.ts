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
  session_id?: number | null;
  session?: { id: number; name: string } | null;
  name: string;
  profile_type: string | null;
  gender: string | null;
  category: string | null;
  description: string | null;
  is_default: boolean;
  fee_collection_frequency?: string | null;
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
    session_id?: string | number | null;
    profile_type?: string | null;
    gender?: string | null;
    category?: string | null;
    description?: string | null;
    is_default?: boolean;
    fee_collection_frequency?: string | null;
    items: { fee_type_id: number; amount: number }[];
  }) => api.post(BASE, data),
  update: (
    id: number,
    data: {
      name?: string;
      session_id?: string | number | null;
      profile_type?: string | null;
      gender?: string | null;
      category?: string | null;
      description?: string | null;
      is_default?: boolean;
      fee_collection_frequency?: string | null;
      items?: { fee_type_id: number; amount: number }[];
    }
  ) => api.put(`${BASE}/${id}`, data),
  clone: (
    id: number,
    data: {
      target_session_id: number;
      name?: string;
    }
  ) => api.post(`${BASE}/${id}/clone`, data),
  destroy: (id: number) => api.delete(`${BASE}/${id}`),
};


export default feeProfilesApi;
