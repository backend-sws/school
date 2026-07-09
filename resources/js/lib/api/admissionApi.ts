import api from "./api";

/**
 * Admission API for processing student applications.
 */

export interface ApplicationListParams {
  stream_id?: number | string;
  session_id?: number | string;
  status?: string;
  payment_status?: string;
  application_type?: string;
  start_date?: string;
  end_date?: string;
  search_by?: string;
  search_text?: string;
  per_page?: number;
  page?: number;
}

const AdmissionApi = {
  /** List all admission applications */
  index: (params?: ApplicationListParams) =>
    api.get<{ data: any[]; meta?: { current_page: number; last_page: number; total: number; per_page?: number } }>(
        "/applications", 
        { params }
    ),

  /** List re-admission applications */
  reAdmissions: (params?: ApplicationListParams) =>
    api.get<{ data: any[]; meta?: { current_page: number; last_page: number; total: number } }>(
        "/applications/re-admissions", 
        { params }
    ),

  /** Show specific application details */
  show: (id: number | string) => api.get(`/applications/${id}`),

  /** Create a new admission application */
  store: (data: Record<string, unknown>) => api.post("/applications", data),

  /** Update an existing application */
  update: (id: number | string, data: Record<string, unknown>) => 
    api.put(`/applications/${id}`, data),

  /** Process an application (Approve/Reject) */
  process: (id: number | string, data: { status: string; remarks?: string }) =>
    api.post(`/applications/${id}/process`, data),

  /** Record a payment for an application */
  recordPayment: (id: number | string, data: {
    cash_amount?: number;
    online_amount?: number;
    online_transaction_id?: string;
    transaction_id?: string;
    concession_amount?: number;
    concession_reason?: string;
    notes?: string;
  }) => api.post(`/applications/${id}/record-payment`, data),

  /** Preview fee breakdown via FeeCalculationEngine (single source of truth) */
  previewFees: (params: { admission_head_id: number | string; category?: string; gender?: string }) =>
    api.get<{ data: { items: Array<{ fee_type_id: number; name: string; amount: number; type: string; category: string | null }>; gross: number; discount: number; net: number; profile_id: number | null } }>("/applications/preview-fees", { params }),

  /** Backward compatibility aliases if needed */
  list: (params?: ApplicationListParams) => AdmissionApi.index(params),
  create: (data: Record<string, unknown>) => AdmissionApi.store(data),
};

export default AdmissionApi;
export { AdmissionApi as ApplicationApi };
