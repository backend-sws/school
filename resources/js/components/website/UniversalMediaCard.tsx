import { useState, useRef } from "react";
import { Play, Pause, Maximize2, Trash2, ExternalLink, Image as ImageIcon, Video as VideoIcon, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEDIA_TYPE, parseYouTubeUrl, type MediaType } from "@/constants/shared/mediaTypes";
import R2Api from "@/lib/api/r2Api";
import { Button } from "@/components/ui/button";
import { HelperTooltip } from "@/components/ui/helper-tooltip";

interface UniversalMediaCardProps {
    media: {
        id: number | string;
        media_type: MediaType | string;
        image_url: string; // This serves as the source URL for all types
        thumbnail?: string; // Optional custom thumbnail/poster
        caption?: string;
    };
    onDelete?: () => void;
    className?: string;
}

export function UniversalMediaCard({ media, onDelete, className }: UniversalMediaCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const type = media.media_type as MediaType;
    const isYoutube = type === MEDIA_TYPE.YOUTUBE;
    const isVideo = type === MEDIA_TYPE.VIDEO;
    const isImage = type === MEDIA_TYPE.IMAGE;

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = parseYouTubeUrl(url);
        if (!videoId) return null;
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    };

    const getYouTubeThumbnail = (url: string) => {
        const videoId = parseYouTubeUrl(url);
        if (!videoId) return null;
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPlaying(true);
        if (isVideo && videoRef.current) {
            videoRef.current.play();
        }
    };

    const handlePause = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPlaying(false);
        if (isVideo && videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <div
            className={cn(
                "group relative aspect-video rounded-xl overflow-hidden bg-black/5 border shadow-sm hover:shadow-md transition-all",
                className
            )}
        >
            {/* Content Layer */}
            <div className="absolute inset-0 w-full h-full">
                {isImage && (
                    <img
                        src={R2Api.imageSrc(media.image_url)}
                        alt={media.caption || "Gallery Image"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                )}

                {isVideo && (
                    <>
                        <video
                            ref={videoRef}
                            src={R2Api.imageSrc(media.image_url)}
                            poster={media.thumbnail}
                            className={cn(
                                "w-full h-full object-cover",
                                !isPlaying && "brightness-90"
                            )}
                            loop
                            muted
                            playsInline
                            onClick={(e) => isPlaying ? handlePause(e) : handlePlay(e)}
                        />
                        {/* Play Overlay */}
                        {!isPlaying && (
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors cursor-pointer"
                                onClick={handlePlay}
                            >
                                {/* If we have a thumbnail, we can show it here instead of relying on the video poster if desired, 
                                    but poster attribute handles it well. We just keep the play button on top. */}
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-all">
                                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {isYoutube && (
                    isPlaying ? (
                        <iframe
                            src={getYouTubeEmbedUrl(media.image_url) || ""}
                            title={media.caption || "YouTube video"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    ) : (
                        <div
                            className="relative w-full h-full cursor-pointer"
                            onClick={handlePlay}
                        >
                            <img
                                src={getYouTubeThumbnail(media.image_url) || ""}
                                alt={media.caption || "YouTube Video"}
                                className="w-full h-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-medium text-white flex items-center gap-1">
                                <Link2 className="w-3 h-3" />
                                YouTube
                            </div>
                        </div>
                    )
                )}

                {/* Fallback/Empty State */}
                {!isImage && !isVideo && !isYoutube && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
                        <VideoIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs">Unsupported Media</span>
                    </div>
                )}
            </div>

            {/* Overlay Actions (Only visible when not playing interactively or for images) */}
            {(!isPlaying || isImage) && (
                <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {/* Top Actions */}
                    <div className="flex justify-end gap-2">
                        {onDelete && (
                            <div className="pointer-events-auto">
                                <HelperTooltip content="Delete">
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="h-8 w-8 rounded-full shadow-sm bg-red-500/90 hover:bg-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete();
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </HelperTooltip>
                            </div>
                        )}
                    </div>

                    {/* Bottom Info */}
                    <div className="pointer-events-auto">
                        {media.caption && (
                            <div className="bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10 shadow-lg">
                                <p className="text-xs text-white line-clamp-2">{media.caption}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
