import api from "./api";

/**
 * Video Engine API module.
 *
 * Handles: upload lifecycle (init → chunk → complete → abort),
 * video CRUD, playback URLs, and storage usage.
 */
const VideoApi = {
    /** List all videos for the institution */
    index: (params?: { page?: number; per_page?: number; status?: string }) =>
        api.get("/videos", { params }),

    /** Get single video details */
    show: (id: number) => api.get(`/videos/${id}`),

    /** Delete a video */
    destroy: (id: number) => api.delete(`/videos/${id}`),

    /** Retry a failed transcode */
    retry: (id: number) => api.post(`/videos/${id}/retry`),

    /** Get storage usage for institution */
    storageUsage: () => api.get("/videos/storage-usage"),

    // ── Upload Lifecycle ───────────────────────────────────────────

    /** Initialize chunked upload */
    uploadInit: (data: {
        title: string;
        description?: string;
        file_name: string;
        file_size: number;
        mime_type: string;
    }) => api.post("/videos/upload-init", data),

    /** Upload a single chunk */
    uploadChunk: (
        videoId: number,
        formData: FormData,
        onProgress?: (progress: number) => void
    ) =>
        api.patch(`/videos/${videoId}/chunk`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e: { loaded: number; total?: number }) => {
                if (onProgress && e.total) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            },
        }),

    /** Finalize upload and start transcoding */
    uploadComplete: (videoId: number) =>
        api.post(`/videos/${videoId}/upload-complete`),

    /** Abort an in-progress upload */
    uploadAbort: (videoId: number) =>
        api.delete(`/videos/${videoId}/upload-abort`),

    // ── Playback ───────────────────────────────────────────────────

    /** Get signed HLS playback URL */
    getPlaybackUrl: (videoId: number) =>
        api.get(`/videos/${videoId}/playback-url`),

    /** Get signed thumbnail URL */
    getThumbnailUrl: (videoId: number) =>
        api.get(`/videos/${videoId}/thumbnail`),
};

export default VideoApi;
