import React, { useCallback, useRef, useState } from "react";
import VideoApi from "@/lib/api/videoApi";
import {
    validateVideoFile,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE,
} from "@/lib/validations/video";
import { Button } from "@/components/ui/button";
import {
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Pause,
    Play,
    Loader2,
} from "lucide-react";

interface VideoUploaderProps {
    /** Called when upload + transcode dispatch is complete */
    onUploadComplete?: (video: {
        id: number;
        status: string;
    }) => void;
    /** Called on error */
    onError?: (error: string) => void;
    /** Max file size override in bytes */
    maxSizeBytes?: number;
    /** Custom allowed extensions */
    allowedExtensions?: string[];
    /** Optional class name */
    className?: string;
}

interface UploadState {
    status:
        | "idle"
        | "validating"
        | "uploading"
        | "assembling"
        | "processing"
        | "error";
    progress: number;
    fileName: string | null;
    fileSize: number;
    error: string | null;
    videoId: number | null;
    currentChunk: number;
    totalChunks: number;
    isPaused: boolean;
}

const INITIAL_STATE: UploadState = {
    status: "idle",
    progress: 0,
    fileName: null,
    fileSize: 0,
    error: null,
    videoId: null,
    currentChunk: 0,
    totalChunks: 0,
    isPaused: false,
};

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Reusable chunked video uploader with progress, pause/resume, and error handling.
 *
 * Drop-in component — use anywhere a video upload is needed.
 */
export default function VideoUploader({
    onUploadComplete,
    onError,
    maxSizeBytes = MAX_FILE_SIZE,
    allowedExtensions = ALLOWED_EXTENSIONS,
    className = "",
}: VideoUploaderProps) {
    const [state, setState] = useState<UploadState>(INITIAL_STATE);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef(false);
    const pauseRef = useRef(false);

    const updateState = useCallback(
        (updates: Partial<UploadState>) =>
            setState((prev) => ({ ...prev, ...updates })),
        []
    );

    const formatSize = (bytes: number) => {
        if (bytes >= 1024 * 1024 * 1024)
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
        if (bytes >= 1024 * 1024)
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / 1024).toFixed(1)} KB`;
    };

    const handleFileSelect = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset
        abortRef.current = false;
        pauseRef.current = false;

        // Validate
        updateState({
            status: "validating",
            fileName: file.name,
            fileSize: file.size,
            error: null,
        });

        const validationError = validateVideoFile(file);
        if (validationError) {
            updateState({ status: "error", error: validationError });
            onError?.(validationError);
            return;
        }

        try {
            // Initialize upload
            const initRes = await VideoApi.uploadInit({
                title: file.name.replace(/\.[^.]+$/, ""),
                file_name: file.name,
                file_size: file.size,
                mime_type: file.type,
            });

            const { video_id, chunk_size, total_chunks } =
                initRes.data.data;

            updateState({
                status: "uploading",
                videoId: video_id,
                totalChunks: total_chunks,
                currentChunk: 0,
                progress: 0,
            });

            // Upload chunks
            const effectiveChunkSize = chunk_size || CHUNK_SIZE;
            for (let i = 0; i < total_chunks; i++) {
                // Check abort
                if (abortRef.current) {
                    await VideoApi.uploadAbort(video_id);
                    setState(INITIAL_STATE);
                    return;
                }

                // Check pause
                while (pauseRef.current) {
                    await new Promise((r) => setTimeout(r, 500));
                    if (abortRef.current) {
                        await VideoApi.uploadAbort(video_id);
                        setState(INITIAL_STATE);
                        return;
                    }
                }

                const start = i * effectiveChunkSize;
                const end = Math.min(start + effectiveChunkSize, file.size);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append("chunk", chunk, `chunk_${i}`);
                formData.append("chunk_index", String(i));
                formData.append("total_chunks", String(total_chunks));

                await VideoApi.uploadChunk(video_id, formData);

                const progress = Math.round(((i + 1) / total_chunks) * 100);
                updateState({
                    currentChunk: i + 1,
                    progress: Math.min(progress, 99),
                });
            }

            // Finalize
            updateState({ status: "assembling", progress: 99 });
            const completeRes = await VideoApi.uploadComplete(video_id);

            updateState({ status: "processing", progress: 100 });
            onUploadComplete?.({
                id: video_id,
                status: completeRes.data.data.status,
            });
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Upload failed";
            updateState({ status: "error", error: message });
            onError?.(message);
        }

        // Clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePauseResume = () => {
        pauseRef.current = !pauseRef.current;
        updateState({ isPaused: pauseRef.current });
    };

    const handleCancel = () => {
        abortRef.current = true;
        pauseRef.current = false;
    };

    const handleReset = () => {
        setState(INITIAL_STATE);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={`video-uploader ${className}`}>
            {/* Idle / Error states — show file picker */}
            {(state.status === "idle" || state.status === "error") && (
                <div className="video-uploader__picker">
                    <label className="video-uploader__drop-zone">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={allowedExtensions
                                .map((e) => `.${e}`)
                                .join(",")}
                            onChange={handleFileSelect}
                            className="video-uploader__input"
                        />
                        <Upload className="video-uploader__icon" />
                        <span className="video-uploader__label">
                            Click to select video
                        </span>
                        <span className="video-uploader__hint">
                            {allowedExtensions.join(", ").toUpperCase()} •
                            Max {formatSize(maxSizeBytes)}
                        </span>
                    </label>

                    {state.error && (
                        <div className="video-uploader__error">
                            <AlertCircle size={16} />
                            <span>{state.error}</span>
                            <button onClick={handleReset}>Dismiss</button>
                        </div>
                    )}
                </div>
            )}

            {/* Uploading state — show progress */}
            {(state.status === "uploading" ||
                state.status === "validating" ||
                state.status === "assembling") && (
                <div className="video-uploader__progress">
                    <div className="video-uploader__file-info">
                        <span className="video-uploader__file-name">
                            {state.fileName}
                        </span>
                        <span className="video-uploader__file-size">
                            {formatSize(state.fileSize)}
                        </span>
                    </div>

                    <div className="video-uploader__bar-wrapper">
                        <div
                            className="video-uploader__bar"
                            style={{ width: `${state.progress}%` }}
                        />
                    </div>

                    <div className="video-uploader__meta">
                        <span>
                            {state.status === "validating" && "Validating..."}
                            {state.status === "uploading" &&
                                `Uploading chunk ${state.currentChunk}/${state.totalChunks}`}
                            {state.status === "assembling" &&
                                "Finalizing upload..."}
                        </span>
                        <span>{state.progress}%</span>
                    </div>

                    <div className="video-uploader__actions">
                        {state.status === "uploading" && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePauseResume}
                            >
                                {state.isPaused ? (
                                    <>
                                        <Play size={14} /> Resume
                                    </>
                                ) : (
                                    <>
                                        <Pause size={14} /> Pause
                                    </>
                                )}
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleCancel}
                        >
                            <X size={14} /> Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Processing state */}
            {state.status === "processing" && (
                <div className="video-uploader__processing">
                    <Loader2 className="video-uploader__spinner" />
                    <div>
                        <strong>Processing video</strong>
                        <p>
                            Your video is being transcoded. This may take a
                            few minutes for long videos. You can navigate
                            away — we&apos;ll notify you when it&apos;s
                            ready.
                        </p>
                    </div>
                    <CheckCircle className="video-uploader__check" />
                </div>
            )}
        </div>
    );
}
