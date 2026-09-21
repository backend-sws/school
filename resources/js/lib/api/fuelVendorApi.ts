import api from "./api";

const BASE = "/transport/fuel-vendors";

export type FuelVendor = {
  id: number;
  institution_id: number;
  name: string;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  gstin?: string | null;
  credit_limit: number;
  payment_terms: string;
  is_active: boolean;
  notes?: string | null;
  // aggregated
  total_fuels?: number;
  total_fuel_amount?: number;
  credit_amount?: number;
  settled_amount?: number;
  outstanding_balance?: number;
  created_at?: string;
  updated_at?: string;
};

export type FuelVendorSettlement = {
  id: number;
  transport_fuel_vendor_id: number;
  settlement_date: string;
  amount: number;
  payment_mode: string;
  reference_number?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type VendorLedgerResponse = {
  vendor: FuelVendor;
  fuel_logs: any[];
  settlements: FuelVendorSettlement[];
  summary: {
    total_credit: number;
    total_paid_direct: number;
    total_settled: number;
    outstanding: number;
  };
};

const fuelVendorApi = {
  index: (params?: Record<string, unknown>) =>
    api.get(BASE, { params }),

  show: (id: number | string) =>
    api.get(`${BASE}/${id}`),

  store: (data: Partial<FuelVendor>) =>
    api.post(BASE, data),

  update: (id: number | string, data: Partial<FuelVendor>) =>
    api.put(`${BASE}/${id}`, data),

  destroy: (id: number | string) =>
    api.delete(`${BASE}/${id}`),

  ledger: (id: number | string, params?: Record<string, unknown>) =>
    api.get<{ data: VendorLedgerResponse }>(`${BASE}/${id}/ledger`, { params }),

  settle: (
    id: number | string,
    data: {
      settlement_date: string;
      amount: number;
      payment_mode: string;
      reference_number?: string;
      notes?: string;
    }
  ) => api.post(`${BASE}/${id}/settle`, data),
};

export default fuelVendorApi;
