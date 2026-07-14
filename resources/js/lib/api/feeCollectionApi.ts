import api from "./api";

const BASE = "/fees";

export type FeeCollectionSettings = {
  fee_collection_frequency: string;
  fee_due_day_of_month: number;
  reminder_days_before_due: number;
  overdue_reminder_after_days: number;
  late_fee_enabled: boolean;
  late_fee_after_days: number;
  late_fee_type: string;
  late_fee_value: number;
  reminder_send_email: boolean;
  receipt_send_email: boolean;
  charge_fees_from_admission_month: boolean;
};

export const feeCollectionApi = {
  getCollectionSettings: () =>
    api.get<{ data?: FeeCollectionSettings }>(`${BASE}/collection-settings`),

  updateCollectionSettings: (data: Partial<FeeCollectionSettings>) =>
    api.patch<{ data?: FeeCollectionSettings; message?: string }>(
      `${BASE}/collection-settings`,
      data
    ),

  getDues: (params: {
    search?: string;
    search_by?: string;
    period?: string;
    lms_class_id?: number;
    status?: string;
    date?: string;
    start_date?: string;
    end_date?: string;
    academic_session_id?: number;
    page?: number;
    per_page?: number;
  }) =>
    api.get<{
      data?: {
        period: string;
        due_date: string;
        list: Array<{
          user_id: number;
          student_name: string;
          reg_no: string | null;
          lms_class_id: number;
          class_name: string;
          period: string;
          due_date: string;
          expected_amount: number;
          paid_amount: number;
          balance: number;
          status: string;
        }>;
        stats?: {
          total_expected: number;
          total_paid: number;
          total_balance: number;
          collection_percentage: number;
        };
        meta?: {
          current_page: number;
          per_page: number;
          total: number;
          last_page: number;
        };
      };
    }>(`${BASE}/dues`, { params }),

  getOverdue: (params?: { from?: string; to?: string; lms_class_id?: number }) =>
    api.get<{
      data?: {
        list: Array<{
          user_id: number;
          student_name: string;
          reg_no: string | null;
          lms_class_id: number;
          class_name: string;
          period: string;
          due_date: string;
          expected_amount: number;
          paid_amount: number;
          balance: number;
        }>;
      };
    }>(`${BASE}/dues/overdue`, { params }),

  sendReminder: (body: {
    period: string;
    type: "due_soon" | "overdue";
    student_ids?: number[];
  }) =>
    api.post<{ data?: { sent_count: number }; message?: string }>(
      `${BASE}/dues/send-reminder`,
      body
    ),

  getMonthlyLedger: (params: { from: string; to: string; lms_class_id?: string }) =>
    api.get(`${BASE}/ledger/monthly`, { params }),
};
