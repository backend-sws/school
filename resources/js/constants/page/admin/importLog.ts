import { BreadcrumbItem } from "@/types";

export const IMPORT_LOG_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Analytics", href: "/admission/stats" },
    { title: "Import Logs", href: "/admin/analytics/import-logs" },
];

export const INITIAL_IMPORT_LOG_FILTERS = {
    page: 1,
    per_page: 25,
    module: null as string | null,
    status: null as string | null,
};

export const IMPORT_LOG_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "module", label: "Module" },
    { key: "stats", label: "Import Stats (S/S/E)" },
    { key: "status", label: "Status" },
    { key: "uploader", label: "Uploaded By" },
    { key: "created_at", label: "Timestamp" },
    { key: "actions", label: "" },
];
