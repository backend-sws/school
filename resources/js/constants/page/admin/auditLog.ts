import { BreadcrumbItem } from "@/types";

export const AUDIT_LOG_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Analytics", href: "/admission/stats" },
  { title: "Audit Logs", href: "/admin/audit-logs" },
];

export const INITIAL_AUDIT_LOG_FILTERS = {
  page: 1,
  per_page: 25,
  action: null as string | null,
  entity_type: null as string | null,
  from_date: null as string | null,
  to_date: null as string | null,
};

export const AUDIT_LOG_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "created_at", label: "Time" },
  { key: "action", label: "Action" },
  { key: "entity_type", label: "Entity" },
  { key: "entity_id", label: "ID" },
  { key: "user", label: "User" },
  { key: "detail", label: "" },
];

export const AUDIT_ACTION_OPTIONS = [
  { label: "Created", value: "created" },
  { label: "Updated", value: "updated" },
  { label: "Deleted", value: "deleted" },
];
