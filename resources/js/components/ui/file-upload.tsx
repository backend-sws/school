"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import R2Api from "@/lib/api/r2Api";
import { Upload, FileImage, FileText, X, Loader2, User, Plus, Video, Play } from "lucide-react";
import { generateVideoThumbnail } from "@/lib/video-utils";

export type FileUploadMode = "single" | "multiple" | "avatar" | "portrait";

interface BaseFileUploadProps {
  accept?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  onBlur?: (e: any) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

interface SingleFileUploadProps extends BaseFileUploadProps {
  mode?: "single";
  value?: string | File | null;
  onChange: (value: string | null) => void;
  /** Compact plus-card style (slider-like) instead of full drop zone */
  compact?: boolean;
}

interface MultipleFileUploadProps extends BaseFileUploadProps {
  mode: "multiple";
  value?: string[] | File[] | null;
  onChange: (value: string[]) => void;
  maxFiles?: number;
}

interface AvatarFileUploadProps extends BaseFileUploadProps {
  mode: "avatar";
  value?: string | File | null;
  onChange: (value: string | null) => void;
}

interface PortraitFileUploadProps extends BaseFileUploadProps {
  mode: "portrait";
  value?: string | File | null;
  onChange: (value: string | null) => void;
}

export type FileUploadProps =
  | SingleFileUploadProps
  | MultipleFileUploadProps
  | AvatarFileUploadProps
  | PortraitFileUploadProps;

function getDisplayUrl(value: string | File | null): string | null {
  if (!value) return null;
  if (typeof value === "string") return R2Api.imageSrc(value);
  if (value instanceof File) return URL.createObjectURL(value);
  return null;
}

function getAcceptHint(accept?: string): string {
  if (!accept || accept === "*") return "Any file";
  if (accept.includes("image")) return "PNG, JPG, WebP, GIF";
  if (accept.includes("video")) return "MP4, WebM, MOV";
  return "Selected file types";
}

function isVideoFile(value: string | File): boolean {
  if (value instanceof File) {
    return value.type.startsWith("video/");
  }
  const ext = value.split(".").pop()?.toLowerCase();
  return ["mp4", "webm", "ogg", "mov"].includes(ext || "");
}

function isPdfFile(value: string | File): boolean {
  if (value instanceof File) {
    return value.type === "application/pdf";
  }
  const ext = value.split(".").pop()?.toLowerCase();
  return ext === "pdf";
}

function getFileName(value: string | File): string {
  if (value instanceof File) return value.name;
  return value.split("/").pop() || "Document";
}

const AVATAR_ALLOWED_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const AVATAR_ALLOWED_EXT = ["jpg", "jpeg", "png", "gif", "webp"];
const AVATAR_ERROR_MSG = "Invalid file type. Allowed: JPG, JPEG, PNG, GIF, WebP";

function isAllowedAvatarFile(file: File): boolean {
  const mime = file.type?.toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase();
  return (
    (!!mime && AVATAR_ALLOWED_MIMES.includes(mime)) ||
    (!!ext && AVATAR_ALLOWED_EXT.includes(ext))
  );
}

export function FileUpload(props: FileUploadProps) {
  const {
    accept = "image/*",
    disabled = false,
    className,
    error,
    mode = "single",
    onBlur,
  } = props;

  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [thumbnails, setThumbnails] = React.useState<Record<string, string>>({});
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isUploading = uploadProgress !== null;
  const maxFiles = props.mode === "multiple" ? (props.maxFiles ?? 10) : 1;

  React.useEffect(() => {
    props.onUploadingChange?.(isUploading);
  }, [isUploading, props.onUploadingChange]);

  // Normalize values for each mode
  const singleValue =
    mode !== "multiple" ? (props.value as string | File | null) ?? null : null;
  const multipleValues =
    mode === "multiple"
      ? (Array.isArray(props.value) ? props.value : []) as (string | File)[]
      : [];

  const hasSingleValue = !!singleValue;
  const hasMultipleValues = multipleValues.length > 0;
  const hasValue = hasSingleValue || hasMultipleValues;

  // Effect to generate video thumbnails
  React.useEffect(() => {
    const values = mode === "multiple" ? multipleValues : (singleValue ? [singleValue] : []);

    values.forEach(async (val) => {
      if (!val) return;

      const key = typeof val === "string" ? val : val.name;

      // Skip if not video or already generated
      if (!isVideoFile(val) || thumbnails[key]) return;

      try {
        const thumb = await generateVideoThumbnail(val);
        setThumbnails(prev => ({ ...prev, [key]: thumb }));
      } catch (err) {
        console.error("Failed to generate thumbnail", err);
      }
    });
  }, [singleValue, multipleValues, mode]); // Limited deps to avoid loops

  const handleUploadOne = React.useCallback(
    async (file: File): Promise<string | null> => {
      setUploadError(null);
      setUploadProgress(0);

      try {
        const path = await R2Api.uploadFile(file, (percent) => {
          setUploadProgress(percent);
        });
        return path;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Upload failed. Try again.";
        setUploadError(msg);
        return null;
      } finally {
        setUploadProgress(null);
      }
    },
    []
  );

  const handleFileSelect = React.useCallback(
    (files: FileList | null) => {
      const fileList = Array.from(files ?? []);
      if (!fileList.length || disabled || isUploading) return;

      if (mode === "avatar") {
        const file = fileList[0];
        if (!isAllowedAvatarFile(file)) {
          setUploadError(AVATAR_ERROR_MSG);
          return;
        }
      }

      if (mode === "multiple") {
        const existingPaths = multipleValues.filter(
          (v): v is string => typeof v === "string"
        );
        const remaining = maxFiles - existingPaths.length;
        const toAdd = fileList.slice(0, Math.max(0, remaining));
        if (toAdd.length === 0) return;

        const addFiles = async () => {
          const newPaths: string[] = [];
          for (let i = 0; i < toAdd.length; i++) {
            const path = await handleUploadOne(toAdd[i]);
            if (path) newPaths.push(path);
          }
          if (newPaths.length > 0) {
            (props as MultipleFileUploadProps).onChange([
              ...existingPaths,
              ...newPaths,
            ]);
          }
        };
        addFiles();
      } else {
        handleUploadOne(fileList[0]).then((path) => {
          if (path) (props as SingleFileUploadProps).onChange(path);
          else (props as SingleFileUploadProps).onChange("");
        });
      }
    },
    [disabled, isUploading, mode, maxFiles, multipleValues, props, handleUploadOne]
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClear = React.useCallback(() => {
    if (mode === "multiple") {
      (props as MultipleFileUploadProps).onChange([]);
    } else {
      (props as SingleFileUploadProps).onChange("");
    }
    setUploadError(null);
  }, [mode, props]);

  const handleRemoveAt = React.useCallback(
    (index: number) => {
      const current = multipleValues.filter(
        (v): v is string => typeof v === "string"
      );
      (props as MultipleFileUploadProps).onChange(
        current.filter((_, i) => i !== index)
      );
    },
    [multipleValues, props]
  );

  const isImageAccept = accept.includes("image");
  const isVideoAccept = accept.includes("video");

  // Helper to get thumbnail or generic icon
  const renderPreview = (value: string | File) => {
    const isVideo = isVideoFile(value);
    const key = typeof value === "string" ? value : value.name;
    const thumbUrl = thumbnails[key];
    const displayUrl = getDisplayUrl(value);

    if (isVideo && thumbUrl) {
      return (
        <div className="relative w-full h-full">
          <img src={thumbUrl} alt="Video Thumbnail" className="object-cover w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="h-8 w-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <Play className="h-4 w-4 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
      );
    }

    // PDFs: show embedded preview via iframe
    if (isPdfFile(value)) {
      const pdfUrl = getDisplayUrl(value);
      if (pdfUrl) {
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
            <iframe
              src={pdfUrl}
              title={getFileName(value)}
              className="w-full h-full border-0"
            />
          </div>
        );
      }
      // Fallback if no URL available
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50 p-3">
          <FileText className="size-8 text-red-500" />
          <span className="text-xs text-muted-foreground text-center line-clamp-2 max-w-full px-2">
            {getFileName(value)}
          </span>
        </div>
      );
    }

    if (isImageAccept && displayUrl && !isVideo) {
      return <img src={displayUrl} alt="Preview" className="object-cover w-full h-full" />;
    }

    // Fallback for video without thumb yet or other files
    if (isVideo) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Video className="size-8 text-muted-foreground" />
        </div>
      );
    }

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <FileImage className="size-8 text-muted-foreground" />
      </div>
    );
  };


  // ─── Avatar mode ─────────────────────────────────────────────────────────
  if (mode === "avatar") {
    const displayUrl = getDisplayUrl(singleValue);
    const avatarSize = "size-24 sm:size-28";

    return (
      <div className={cn("space-y-2", className)}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={cn(
            "relative inline-flex items-center justify-center rounded-full overflow-hidden cursor-pointer transition-all duration-300",
            "border-2 border-dashed border-slate-200",
            "hover:border-primary/40 hover:bg-slate-50",
            isDragging && "border-primary bg-primary/10",
            isUploading && "cursor-not-allowed opacity-90",
            disabled && "cursor-not-allowed opacity-50",
            error && "border-destructive/60",
            avatarSize
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={disabled || isUploading}
            onChange={(e) => {
              handleFileSelect(e.target.files);
              e.target.value = "";
            }}
          />

          {isUploading ? (
            <Loader2 className="size-10 text-primary animate-spin" />
          ) : displayUrl && isImageAccept ? (
            <img
              src={displayUrl}
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="size-12 text-slate-300" />
          )}

          {displayUrl && !isUploading && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute inset-0 m-auto h-8 w-8 rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground opacity-0 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={disabled}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {isUploading ? "Uploading..." : "Click or drag to change"}
        </p>
        {uploadError && (
          <p className="text-xs text-destructive">{uploadError}</p>
        )}
      </div>
    );
  }

  // ─── Portrait mode ──────────────────────────────────────────────────────────
  if (mode === "portrait") {
    const displayUrl = getDisplayUrl(singleValue);

    return (
      <div className={cn("space-y-3", className)}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={cn(
            "group relative w-full max-w-[200px] cursor-pointer transition-all",
            isUploading && "cursor-not-allowed opacity-90",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={disabled || isUploading}
            onChange={(e) => {
              handleFileSelect(e.target.files);
              e.target.value = "";
            }}
          />

          {/* Portrait Container */}
          <div
            className={cn(
              "relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300",
              "bg-gradient-to-b from-muted/50 to-muted",
              "ring-2 ring-offset-2 ring-offset-background",
              displayUrl ? "ring-primary/20" : "ring-muted-foreground/20",
              isDragging && "ring-primary ring-offset-4",
              error && "ring-destructive/60",
              "group-hover:ring-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10"
            )}
          >
            {isUploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
                <Loader2 className="size-10 text-primary animate-spin" />
                <span className="text-sm font-medium text-muted-foreground">Uploading...</span>
                <Progress value={uploadProgress ?? 0} className="w-3/4 h-1.5" />
              </div>
            ) : displayUrl && isImageAccept ? (
              <>
                <img
                  src={displayUrl}
                  alt="Portrait"
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Change photo hint */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
                    <Upload className="size-4" />
                    <span>Change Photo</span>
                  </div>
                </div>

                {/* Remove button */}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  disabled={disabled}
                >
                  <X className="size-4" />
                </Button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                <div className="rounded-full bg-muted-foreground/10 p-4">
                  <User className="size-10 text-muted-foreground/60" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Upload Portrait
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Click or drag image
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {uploadError && (
          <p className="text-xs text-destructive">{uploadError}</p>
        )}
      </div>
    );
  }

  // ─── Multiple mode ───────────────────────────────────────────────────────
  if (mode === "multiple") {
    const canAddMore = multipleValues.length < maxFiles;

    // Use large dropzone style if no files yet
    if (multipleValues.length === 0) {
      return (
        <div
          className={cn("space-y-2", className)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div
            onClick={() => !isUploading && inputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center min-h-[160px] rounded-xl border-2 border-dashed border-slate-200 transition-all duration-300 cursor-pointer bg-slate-50/30",
              "hover:border-primary/40 hover:bg-slate-50",
              isDragging && "border-primary bg-primary/10",
              isUploading && "cursor-not-allowed opacity-90",
              disabled && "cursor-not-allowed opacity-50",
              error && "border-destructive/60"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple
              className="sr-only"
              disabled={disabled || isUploading}
              onChange={(e) => {
                handleFileSelect(e.target.files);
                e.target.value = "";
              }}
              onBlur={onBlur}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-3 px-6 w-full max-w-xs">
                <Loader2 className="size-10 text-primary animate-spin" />
                <span className="text-sm font-bold text-primary">Uploading...</span>
                <Progress value={uploadProgress ?? 0} className="w-full h-1.5" />
              </div>
            ) : (
              <>
                <div className="rounded-full bg-white border border-slate-100 p-4 mb-3 shadow-sm">
                  <Upload className="size-8 text-primary" />
                </div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                  Drop files or click
                </p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">
                  {getAcceptHint(accept)}
                </p>
              </>
            )}
          </div>
          {uploadError && (
            <p className="text-xs text-destructive">{uploadError}</p>
          )}
        </div>
      );
    }

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {canAddMore && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() =>
                !isUploading && canAddMore && inputRef.current?.click()
              }
              className={cn(
                "flex flex-col items-center justify-center w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-slate-200 cursor-pointer transition-all duration-300 bg-slate-50/50",
                "hover:border-primary/40 hover:bg-slate-50",
                isDragging && "border-primary bg-primary/10",
                isUploading && "cursor-not-allowed opacity-90",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple
                className="sr-only"
                disabled={disabled || isUploading}
                onChange={(e) => {
                  handleFileSelect(e.target.files);
                  e.target.value = "";
                }}
                onBlur={onBlur}
              />
              {isUploading ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : (
                <Plus className="size-6 text-slate-400" />
              )}
            </div>
          )}
          {multipleValues.map((val, i) => {
            return (
              <div
                key={i}
                className={cn(
                  "relative rounded-lg border overflow-hidden bg-muted/30 aspect-square w-20 h-20 shrink-0",
                  error && "border-destructive/60"
                )}
              >
                {renderPreview(val)}

                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-0.5 right-0.5 h-6 w-6 rounded-full shadow"
                  onClick={() => handleRemoveAt(i)}
                  disabled={disabled}
                >
                  <X className="size-3" />
                </Button>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {multipleValues.length} / {maxFiles} files
          {canAddMore && " • Drag or click plus to add more"}
        </p>
        {uploadError && (
          <p className="text-xs text-destructive">{uploadError}</p>
        )}
      </div>
    );
  }

  // ─── Single mode (default) ────────────────────────────────────────────────
  const displayUrl = getDisplayUrl(singleValue);
  const compact = mode === "single" && (props as SingleFileUploadProps).compact;

  // Compact: show small preview when has value, else plus-card trigger
  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        {hasValue && !isUploading ? (
          <div
            className={cn(
              "relative rounded-lg border overflow-hidden bg-muted/30 aspect-video min-h-[100px]",
              error && "border-destructive/60"
            )}
          >
            <div className="absolute inset-0">
              {(() => {
                const FILE_TYPE_PREVIEW: Record<string, React.ReactNode> = {
                  pdf: (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
                      <iframe src={displayUrl!} title={getFileName(singleValue!)} className="w-full h-full border-0" />
                    </div>
                  ),
                  video: renderPreview(singleValue!),
                  image: <img src={displayUrl!} alt="Preview" className="object-cover w-full h-full" />,
                  fallback: (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground p-2">
                      <FileImage className="size-8 shrink-0" />
                      <span className="text-xs truncate w-full text-center">{getFileName(singleValue!)}</span>
                    </div>
                  ),
                };
                const key = isPdfFile(singleValue!) ? "pdf"
                  : isVideoFile(singleValue!) ? "video"
                    : (isImageAccept && displayUrl) ? "image"
                      : "fallback";
                return FILE_TYPE_PREVIEW[key];
              })()}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full shadow hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={disabled}
            >
              <X className="size-3" />
            </Button>
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => !disabled && inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="sr-only"
                disabled={disabled}
                onChange={(e) => {
                  handleFileSelect(e.target.files);
                  e.target.value = "";
                }}
                onBlur={onBlur}
              />
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && inputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center aspect-video min-h-[100px] rounded-lg border-2 border-dashed border-slate-200 cursor-pointer transition-all duration-300 bg-slate-50/50",
              "hover:border-primary/40 hover:bg-slate-50",
              isDragging && "border-primary bg-primary/10",
              isUploading && "cursor-not-allowed opacity-90",
              disabled && "cursor-not-allowed opacity-50",
              error && "border-destructive/60"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="sr-only"
              disabled={disabled || isUploading}
              onChange={(e) => {
                handleFileSelect(e.target.files);
                e.target.value = "";
              }}
              onBlur={onBlur}
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="size-8 animate-spin text-primary" />
                <Progress value={uploadProgress ?? 0} className="w-16 h-1" />
              </div>
            ) : (
              <Plus className="size-10 text-slate-300" />
            )}
          </div>
        )}
        {uploadError && (
          <p className="text-xs text-destructive">{uploadError}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {hasValue && !isUploading ? (
        <div
          className={cn(
            "group relative rounded-lg border overflow-hidden bg-muted/30 cursor-pointer",
            error && "border-destructive/60"
          )}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={disabled}
            onChange={(e) => {
              handleFileSelect(e.target.files);
              e.target.value = "";
            }}
            onBlur={onBlur}
          />
          <div className="aspect-video max-h-48 w-full relative">
            {/* Logic for single preview is same as renderPreview but adapted for large view */}
            {(() => {
              const FILE_TYPE_PREVIEW: Record<string, React.ReactNode> = {
                pdf: (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
                    <iframe src={displayUrl!} title={getFileName(singleValue!)} className="w-full h-full border-0" />
                  </div>
                ),
                video: renderPreview(singleValue!),
                image: <img src={displayUrl!} alt="Preview" className="object-contain w-full h-full" />,
                fallback: (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileImage className="size-12" />
                    <span className="text-sm">{getFileName(singleValue!)}</span>
                  </div>
                ),
              };
              const key = isPdfFile(singleValue!) ? "pdf"
                : isVideoFile(singleValue!) ? "video"
                  : (isImageAccept && displayUrl) ? "image"
                    : "fallback";
              return FILE_TYPE_PREVIEW[key];
            })()}

            {/* Hover overlay — click to replace */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <Upload className="size-4" />
                <span>Click to replace</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={disabled}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center min-h-[160px] rounded-xl border-2 border-dashed border-slate-200 transition-all duration-300 cursor-pointer bg-slate-50/10",
            "hover:border-primary/40 hover:bg-slate-50",
            isDragging && "border-primary bg-primary/10",
            isUploading && "cursor-not-allowed opacity-90",
            disabled && "cursor-not-allowed opacity-50",
            error && "border-destructive/60"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={disabled || isUploading}
            onChange={(e) => {
              handleFileSelect(e.target.files);
              e.target.value = "";
            }}
            onBlur={onBlur}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3 px-6 w-full max-w-xs">
              <Loader2 className="size-10 text-primary animate-spin" />
              <span className="text-sm font-bold text-primary">Uploading...</span>
              <Progress value={uploadProgress ?? 0} className="w-full h-1.5" />
            </div>
          ) : (
            <>
              <div className="rounded-full bg-white border border-slate-100 p-4 mb-3 shadow-sm">
                <Upload className="size-8 text-primary" />
              </div>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                Drop file or click
              </p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">
                {getAcceptHint(accept)}
              </p>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}
    </div>
  );
}
