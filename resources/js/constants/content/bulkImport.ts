/**
 * Bulk Import content — toast messages and status labels.
 */

export const BULK_IMPORT_CONTENT = {
    toast: {
        upload_queued: "File uploaded successfully! Import is being processed in the background.",
        import_completed: (module: string, count: number) => `Bulk import for ${module} completed successfully! ${count} records imported.`,
        import_failed: (module: string) => `Bulk import for ${module} failed.`,
        template_downloaded: "Template downloaded",
        template_failed: "Failed to download template",
        auto_seed_success: (count: number) => `${count} default record(s) seeded successfully`,
        auto_seed_none: "Defaults already present — nothing new to add.",
        auto_seed_failed: "Auto-seed failed",
    },
    status: {
        completed: "Completed",
        processing: "Processing",
        failed: "Failed",
        queued: "Queued",
    }
};
