import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoApi from "@/lib/api/videoApi";
import { VideoQueryKeys } from "@/lib/querykey/video";
import { Loader2, Maximize, Volume2, VolumeX, Settings } from "lucide-react";

interface VideoPlayerProps {
    /** Video ID to play */
    videoId: number;
    /** Optional thumbnail URL */
    thumbnail?: string | null;
    /** Auto play on load */
    autoPlay?: boolean;
    /** Optional class name */
    className?: string;
}

/**
 * Reusable HLS video player with adaptive quality selection.
 *
 * Features:
 * - Adaptive bitrate switching via HLS.js
 * - Manual quality selector (360p/720p/1080p/Auto)
 * - Playback speed control
 * - Fullscreen toggle
 * - Volume control
 *
 * Drop-in component — use anywhere a video needs to be played.
 */
export default function VideoPlayer({
    videoId,
    thumbnail,
    autoPlay = false,
    className = "",
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showQuality, setShowQuality] = useState(false);
    const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = auto
    const [availableLevels, setAvailableLevels] = useState<
        { index: number; label: string; height: number }[]
    >([]);

    // Fetch signed playback URL
    const { data: playbackData, isLoading } = useQuery({
        queryKey: VideoQueryKeys.playbackUrl(videoId),
        queryFn: () => VideoApi.getPlaybackUrl(videoId),
        staleTime: 30 * 60 * 1000, // 30 min
    });

    useEffect(() => {
        const video = videoRef.current;
        const url = playbackData?.data?.data?.playback_url;
        if (!video || !url) return;

        // Check if HLS.js is available (loaded from CDN or bundled)
        const loadHls = async () => {
            try {
                const Hls = (await import("hls.js")).default;

                if (Hls.isSupported()) {
                    const hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: false,
                        startLevel: -1, // Auto quality
                    });

                    hls.loadSource(url);
                    hls.attachMedia(video);

                    hls.on(Hls.Events.MANIFEST_PARSED, (_: unknown, data: { levels: Array<{ height: number }> }) => {
                        const levels = data.levels.map(
                            (level: { height: number }, index: number) => ({
                                index,
                                label: `${level.height}p`,
                                height: level.height,
                            })
                        );
                        setAvailableLevels(levels);
                        setIsReady(true);

                        if (autoPlay) {
                            video.play().catch(() => {});
                        }
                    });

                    hls.on(Hls.Events.LEVEL_SWITCHED, (_: unknown, data: { level: number }) => {
                        setCurrentQuality(data.level);
                    });

                    hlsRef.current = hls;
                } else if (
                    video.canPlayType("application/vnd.apple.mpegurl")
                ) {
                    // Safari native HLS
                    video.src = url;
                    setIsReady(true);
                }
            } catch {
                // HLS.js not available, try native
                video.src = url;
                setIsReady(true);
            }
        };

        loadHls();

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [playbackData, autoPlay]);

    const handleQualityChange = (levelIndex: number) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = levelIndex;
            setCurrentQuality(levelIndex);
        }
        setShowQuality(false);
    };

    const handleAutoQuality = () => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = -1; // Auto
            setCurrentQuality(-1);
        }
        setShowQuality(false);
    };

    const toggleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    if (isLoading) {
        return (
            <div className={`video-player video-player--loading ${className}`}>
                <Loader2 className="video-player__spinner" />
                <span>Loading video...</span>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`video-player ${className}`}>
            <video
                ref={videoRef}
                className="video-player__video"
                poster={
                    thumbnail ||
                    playbackData?.data?.data?.thumbnail_url ||
                    undefined
                }
                controls
                playsInline
                preload="metadata"
            />

            {/* Quality selector overlay */}
            {isReady && availableLevels.length > 1 && (
                <div className="video-player__quality-menu">
                    <button
                        className="video-player__quality-btn"
                        onClick={() => setShowQuality(!showQuality)}
                        title="Video quality"
                    >
                        <Settings size={18} />
                    </button>

                    {showQuality && (
                        <div className="video-player__quality-dropdown">
                            <button
                                className={`video-player__quality-option ${currentQuality === -1 ? "active" : ""}`}
                                onClick={handleAutoQuality}
                            >
                                Auto
                            </button>
                            {availableLevels.map((level) => (
                                <button
                                    key={level.index}
                                    className={`video-player__quality-option ${currentQuality === level.index ? "active" : ""}`}
                                    onClick={() =>
                                        handleQualityChange(level.index)
                                    }
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Custom controls overlay */}
            <div className="video-player__controls">
                <button onClick={toggleMute} title="Toggle mute">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={toggleFullscreen} title="Fullscreen">
                    <Maximize size={18} />
                </button>
            </div>
        </div>
    );
}
