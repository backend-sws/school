import React, { useState, useRef, useCallback, useMemo } from "react";
import { Play, AlertCircle, RefreshCw, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { parseYouTubeUrl, youtubeEmbedUrl } from "@/constants/shared/mediaTypes";
import { cn } from "@/lib/utils";

// ── Source Detection ────────────────────────────────────────────
type VideoSourceType = "youtube" | "direct" | "none";

interface DetectedSource {
  type: VideoSourceType;
  src: string;
}

function detectSource(videoUrl?: string | null, filePath?: string | null): DetectedSource {
  // 1. YouTube URL
  if (videoUrl) {
    const ytId = parseYouTubeUrl(videoUrl);
    if (ytId) return { type: "youtube", src: youtubeEmbedUrl(ytId) };
    // Fallback: treat non-YouTube URLs as direct video
    return { type: "direct", src: videoUrl.trim() };
  }
  // 2. R2/storage file path
  if (filePath) {
    // If it's already a full URL, use as-is; otherwise, prefix with /storage/
    const src = filePath.startsWith("http") ? filePath : `/storage/${filePath.replace(/^\/+/, "")}`;
    return { type: "direct", src };
  }
  return { type: "none", src: "" };
}

// ── Props ───────────────────────────────────────────────────────
interface LmsVideoPlayerEngineProps {
  /** YouTube or direct video URL */
  videoUrl?: string | null;
  /** R2 file path (from storage upload) */
  filePath?: string | null;
  /** Title for aria-label */
  title?: string;
  /** Optional thumbnail image URL */
  thumbnail?: string | null;
  /** Additional class names */
  className?: string;
  /** Compact mode — smaller play button etc. */
  compact?: boolean;
}

// ── Component ───────────────────────────────────────────────────
/**
 * Unified video player engine for LMS recordings.
 *
 * Auto-detects source type:
 * - **YouTube** → Privacy-enhanced iframe embed
 * - **Direct URL / R2** → Native `<video>` with controls
 *
 * Features:
 * - Click-to-play thumbnail overlay (no autoplay)
 * - Smooth transition from poster to playback
 * - Error state with retry
 * - Fullscreen toggle
 */
export function LmsVideoPlayerEngine({
  videoUrl,
  filePath,
  title = "Video",
  thumbnail,
  className,
  compact = false,
}: LmsVideoPlayerEngineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const source = useMemo(() => detectSource(videoUrl, filePath), [videoUrl, filePath]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setHasError(false);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsPlaying(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    }
  }, []);

  // ── No source ─────────────────────────────────────────────────
  if (source.type === "none") {
    return (
      <div className={cn("aspect-video rounded-xl bg-muted/30 flex items-center justify-center", className)}>
        <p className="text-xs text-muted-foreground font-medium">No video available</p>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (hasError) {
    return (
      <div className={cn("aspect-video rounded-xl bg-red-50 dark:bg-red-950/20 flex flex-col items-center justify-center gap-3 border border-red-200/50 dark:border-red-800/30", className)}>
        <AlertCircle className="size-8 text-red-400" />
        <p className="text-xs font-semibold text-red-500">Failed to load video</p>
        <button
          onClick={handleRetry}
          className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg bg-red-100/50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RefreshCw className="size-3.5" />
          Retry
        </button>
      </div>
    );
  }

  // ── Poster / Click-to-play overlay ────────────────────────────
  if (!isPlaying) {
    const ytId = videoUrl ? parseYouTubeUrl(videoUrl) : null;
    const posterImage = thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);

    return (
      <div
        ref={containerRef}
        className={cn(
          "aspect-video rounded-xl overflow-hidden relative cursor-pointer group",
          "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
          className
        )}
        onClick={handlePlay}
        role="button"
        tabIndex={0}
        aria-label={`Play ${title}`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handlePlay(); } }}
      >
        {/* Poster image */}
        {posterImage && (
          <img
            src={posterImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "flex items-center justify-center rounded-full bg-white/90 dark:bg-white/80 shadow-2xl backdrop-blur-sm",
            "group-hover:scale-110 group-hover:bg-white transition-all duration-300",
            compact ? "size-12" : "size-16"
          )}>
            <Play className={cn(
              "text-primary fill-primary ml-0.5",
              compact ? "size-5" : "size-7"
            )} />
          </div>
        </div>

        {/* Source badge */}
        <div className="absolute bottom-2 right-2">
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider",
            "bg-black/60 text-white/90 backdrop-blur-md"
          )}>
            {source.type === "youtube" ? "YouTube" : "Video"}
          </span>
        </div>
      </div>
    );
  }

  // ── Active playback ───────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={cn("aspect-video rounded-xl overflow-hidden relative bg-black", className)}
    >
      {source.type === "youtube" ? (
        /* YouTube iframe embed */
        <iframe
          src={`${source.src}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        /* Native video player for direct URLs and R2 uploads */
        <>
          <video
            ref={videoRef}
            src={source.src}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
            preload="auto"
            controlsList="nodownload"
            onError={handleError}
          />
          {/* Fullscreen toggle overlay (top-right) */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 text-white/80 hover:bg-black/60 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </button>
        </>
      )}
    </div>
  );
}
