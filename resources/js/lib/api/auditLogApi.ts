import api from "./api";

const AUDIT_LOGS_URL = "/audit-logs";

export interface AuditLogFilters {
  page?: number;
  per_page?: number;
  user_id?: number | null;
  action?: string | null;
  entity_type?: string | null;
  from_date?: string | null;
  to_date?: string | null;
}

export interface AuditLogListResponse {
  success: boolean;
  data: AuditLogEntry[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const AuditLogApi = {
  getAuditLogs: (params?: AuditLogFilters) =>
    api.get<AuditLogListResponse>(AUDIT_LOGS_URL, { params }),

  getAuditLog: (id: number | string) =>
    api.get<{ success: boolean; data: AuditLogEntry }>(`${AUDIT_LOGS_URL}/${id}`),
};

export interface AuditLogEntry {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string } | null;
}

export default AuditLogApi;
