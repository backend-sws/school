import api from "./api";

const BASE = "/inventory/vendors";

export type InventoryVendor = {
  id: number;
  institution_id: number;
  name: string;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  gstin?: string | null;
  pan?: string | null;
  bank_name?: string | null;
  bank_account_no?: string | null;
  bank_ifsc?: string | null;
  credit_limit: number;
  payment_terms: string;
  is_active: boolean;
  notes?: string | null;
  // aggregated stats
  total_purchases?: number;
  total_purchases_amount?: number;
  credit_amount?: number;
  settled_amount?: number;
  outstanding_balance?: number;
  created_at?: string;
  updated_at?: string;
};

export type InventoryVendorSettlement = {
  id: number;
  inventory_vendor_id: number;
  settlement_date: string;
  amount: number;
  payment_mode: string;
  reference_number?: string | null;
  notes?: string | null;
  created_by?: { id: number; name: string };
  created_at?: string;
};

export type InventoryVendorLedgerResponse = {
  vendor: InventoryVendor;
  purchases: any[];
  settlements: InventoryVendorSettlement[];
  summary: {
    total_credit: number;
    total_paid_direct: number;
    total_settled: number;
    outstanding: number;
  };
};

const inventoryVendorApi = {
  index: (params?: Record<string, unknown>) =>
    api.get(BASE, { params }),

  show: (id: number | string) =>
    api.get(`${BASE}/${id}`),

  store: (data: Partial<InventoryVendor>) =>
    api.post(BASE, data),

  update: (id: number | string, data: Partial<InventoryVendor>) =>
    api.put(`${BASE}/${id}`, data),

  destroy: (id: number | string) =>
    api.delete(`${BASE}/${id}`),

  ledger: (id: number | string, params?: Record<string, unknown>) =>
    api.get<{ data: InventoryVendorLedgerResponse }>(`${BASE}/${id}/ledger`, { params }),

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

export default inventoryVendorApi;
