import axios from "axios";
import api from "./api";

export type UploadProgressCallback = (percent: number) => void;

// ─── Security Constants ────────────────────────────────────────────────────
/** Maximum file size in bytes (10 MB) — must match backend MAX_FILE_SIZE */
export const R2_MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Human-readable max size label for UI */
export const R2_MAX_FILE_SIZE_LABEL = "10 MB";

/** Allowed MIME types — must match backend ALLOWED_MIME_TYPES */
export const R2_ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
]);

/** Allowed file extensions (lowercase) — must match backend ALLOWED_EXTENSIONS */
export const R2_ALLOWED_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "webp",
  "pdf", "doc", "docx", "xls", "xlsx",
  "ppt", "pptx", "txt", "csv",
]);

// ─── Validation Helpers ────────────────────────────────────────────────────

/** Extract lowercase extension from a filename. */
function getFileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

export interface FileValidationError {
  code: "FILE_TOO_LARGE" | "INVALID_EXTENSION" | "INVALID_MIME_TYPE" | "NO_FILE";
  message: string;
}

/**
 * Validate a file before upload. Returns null if valid, or an error object.
 * This mirrors backend checks so we fail fast on the client.
 */
export function validateFileForUpload(file: File | null | undefined): FileValidationError | null {
  if (!file) {
    return { code: "NO_FILE", message: "No file selected." };
  }

  // Size check
  if (file.size > R2_MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      code: "FILE_TOO_LARGE",
      message: `File is ${sizeMB} MB — maximum allowed is ${R2_MAX_FILE_SIZE_LABEL}.`,
    };
  }

  // Extension check
  const ext = getFileExtension(file.name);
  if (!ext || !R2_ALLOWED_EXTENSIONS.has(ext)) {
    return {
      code: "INVALID_EXTENSION",
      message: `".${ext || "unknown"}" files are not allowed. Accepted: ${[...R2_ALLOWED_EXTENSIONS].join(", ")}.`,
    };
  }

  // MIME type check
  if (file.type && !R2_ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      code: "INVALID_MIME_TYPE",
      message: `File type "${file.type}" is not allowed.`,
    };
  }

  return null;
}

// ─── API Methods ───────────────────────────────────────────────────────────

const R2Api = {
  /**
   * Get a presigned upload URL from the backend.
   * Backend validates extension + MIME type before returning the URL.
   */
  getUploadUrl: (file: File) =>
    api.post<{ upload_url: string; path: string }>("/r2/upload-url", {
      file_name: file.name,
      content_type: file.type || "application/octet-stream",
    }),

  /**
   * Full upload flow: validate → POST multipart to Laravel → server uploads to R2.
   * Avoids browser CORS issues with presigned PUT URLs.
   * Returns the stored path on success.
   * @throws Error on validation failure or upload error.
   */
  uploadFile: async (
    file: File,
    onProgress?: UploadProgressCallback,
  ): Promise<string> => {
    const validationError = validateFileForUpload(file);
    if (validationError) {
      throw new Error(validationError.message);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = (await api.post<{ path: string }>("/r2/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!onProgress || !event.total) return;
          onProgress(Math.round((event.loaded * 100) / event.total));
        },
      })) as { path?: string };

      if (!res?.path) {
        throw new Error("Upload succeeded but no file path was returned.");
      }

      return res.path;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          "Upload failed. Try again.";
        throw new Error(message);
      }
      throw error instanceof Error ? error : new Error("Upload failed. Try again.");
    }
  },

  /** Get a temporary signed view URL for a stored file path. */
  getViewUrl: (path: string) =>
    api.get<{ url: string }>("/r2/view-url", { params: { path } }),

  /** URL for img src when image_url is an R2 path (uploads/...). */
  imageSrc: (imageUrl: string | undefined): string => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/")) {
      return imageUrl;
    }
    return `/api/v1/public/r2/asset?path=${encodeURIComponent(imageUrl)}`;
  },
};

export default R2Api;
