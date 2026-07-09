import api from "./api";
import axios from "axios";

export interface ImportModule {
    key: string;
    name: string;
    description: string;
    icon: string;
    depends_on: string[];
}

export interface ImportResult {
    import_log_id: number;
    module: string;
    file_name: string;
    total_rows: number;
    imported: number;
    skipped: number;
    errors: number;
    error_details: string[];
}

export interface ImportLogEntry {
    id: number;
    module: string;
    file_name: string;
    total_rows: number;
    imported_rows: number;
    skipped_rows: number;
    error_rows: number;
    errors: string[] | null;
    status: string;
    progress: number;
    uploaded_by: number;
    uploader?: { id: number; name: string };
    created_at: string;
}

/**
 * Maps bulk-import module keys → onboarding seeder category slugs.
 * Only modules with a mapping support auto-seed.
 */
export const AUTO_SEED_CATEGORY_MAP: Record<string, string> = {
    departments: "departments",
    streams: "streams",
    subjects: "subjects",
    fee_types: "fee-types",
    fee_profiles: "fee-profiles",
};

const BulkImportApi = {
    getModules: () => api.get<{ data: ImportModule[] }>("import/modules"),

    downloadTemplate: (module: string) =>
        api.get(`import/${module}/template`, { responseType: "blob" }),

    upload: (module: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post<{ data: ImportResult; message: string }>(
            `import/${module}/upload`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            },
        );
    },

    getHistory: (params?: Record<string, unknown>) =>
        api.get<{
            data: ImportLogEntry[];
            meta: { current_page: number; last_page: number; total: number };
        }>("import/history", { params }),

    /** Auto-seed default data for a category via the onboarding seeder. */
    autoSeed: (moduleKey: string) => {
        const category = AUTO_SEED_CATEGORY_MAP[moduleKey];
        if (!category) return Promise.reject(new Error("Auto-seed not available for this module"));
        return axios.post(`/onboarding/data-import/auto-seed/${category}`, {}, { withCredentials: true });
    },
};

export default BulkImportApi;
