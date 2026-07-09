import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10 GB
const ALLOWED_EXTENSIONS = ["mp4", "mov", "avi", "mkv", "webm"];
const ALLOWED_MIME_TYPES = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
];

/** Client-side validation for video upload init */
export const videoUploadSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must be under 255 characters"),
    description: z.string().max(2000).optional(),
});

/**
 * Validate a file before upload.
 * Returns null if valid, error message if invalid.
 */
export function validateVideoFile(file: File): string | null {
    // Check size
    if (file.size > MAX_FILE_SIZE) {
        return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024 * 1024)} GB.`;
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return `File type "${file.type}" is not supported. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
    }

    // Check extension
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
        return `File extension ".${ext}" is not supported. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
    }

    return null;
}

export { MAX_FILE_SIZE, ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES };
