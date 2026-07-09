import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ChevronLeft, ChevronRight, Video, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { SectionCard } from './section-card';

const FEATURED_VIDEOS = [
    {
        title: "VISITOR'S CONFERENCE: Implementation of National Education Policy-2020",
        thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with real links
        duration: "38:29",
        id: "v1"
    },
    {
        title: "Annual Convocation Ceremony 2024 - Highlights",
        thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=EngW7tLk6R8",
        duration: "12:45",
        id: "v2"
    },
    {
        title: "Campus Tour: Exploring Our New Research Lab",
        thumbnail: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        duration: "05:12",
        id: "v3"
    }
];

function VideoPlayer({ url, isPlaying, onStop }: { url: string; isPlaying: boolean; onStop: () => void }) {
    if (!isPlaying) return null;

    const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const id = url.split('v=')[1] || url.split('/').pop();
            return `https://www.youtube.com/embed/${id}?autoplay=1`;
        }
        if (url.includes('vimeo.com')) {
            const id = url.split('/').pop();
            return `https://player.vimeo.com/video/${id}?autoplay=1`;
        }
        return url;
    };

    const embedUrl = getEmbedUrl(url);
    const isIframe = embedUrl.startsWith('http');

    return (
        <div className="absolute inset-0 z-50 bg-black">
            <Button
                variant="ghost"
                size="icon"
                onClick={onStop}
                className="absolute top-4 right-4 z-[60] p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all h-9 w-9"
            >
                <X className="h-5 w-5" />
            </Button>
            {isIframe ? (
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <video
                    src={url}
                    className="w-full h-full"
                    controls
                    autoPlay
                />
            )}
        </div>
    );
}

export function FeaturedVideos() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const nextVideo = () => {
        setIsPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % FEATURED_VIDEOS.length);
    };

    const prevVideo = () => {
        setIsPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + FEATURED_VIDEOS.length) % FEATURED_VIDEOS.length);
    };

    const currentVideo = FEATURED_VIDEOS[currentIndex];

    return (
        <SectionCard
            title="Featured Videos"
            subtitle="CAMPUS HIGHLIGHTS"
            icon={<Video className="h-6 w-6" />}
            iconBgClass="bg-primary/10 text-primary"
            footerLabel="VIEW ALL VIDEOS"
            footerHref="#"
        >
            <div className="flex flex-col h-full bg-transparent px-6 py-4">
                <div className="flex flex-col h-full">
                    {/* Video Container */}
                    <div className="flex-1 relative group rounded-3xl overflow-hidden bg-card border border-border transition-colors duration-300">
                        {/* Player */}
                        <VideoPlayer
                            url={currentVideo.videoUrl}
                            isPlaying={isPlaying}
                            onStop={() => setIsPlaying(false)}
                        />

                        {!isPlaying && (
                            <>
                                {/* Thumbnail */}
                                <img
                                    src={currentVideo.thumbnail}
                                    alt={currentVideo.title}
                                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Play Overlay */}
                                <div className="absolute inset-x-0 bottom-0 bg-black/40 p-8 flex flex-col justify-end pt-20">
                                    <div className="flex items-center justify-between gap-4 mb-3">
                                        <h4 className="text-lg font-bold text-white line-clamp-2 leading-tight tracking-tight">
                                            {currentVideo.title}
                                        </h4>
                                        <div className="px-2.5 py-1 bg-primary rounded-sm text-[9px] font-bold text-white uppercase tracking-widest shrink-0">
                                            {currentVideo.duration}
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsPlaying(true)}
                                        className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-white/90 active:scale-95 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-0"
                                    >
                                        <Play className="h-6 w-6 fill-current ml-1" />
                                    </Button>
                                </div>

                                {/* Navigation Arrows */}
                                <Button
                                    variant="ghost"
                                    onClick={(e) => { e.preventDefault(); prevVideo(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 h-auto"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={(e) => { e.preventDefault(); nextVideo(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 h-auto"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Pagination Indicators */}
                    <div className="flex justify-center items-center gap-2 mt-6 shrink-0">
                        {FEATURED_VIDEOS.map((_, idx) => (
                            <Button
                                key={idx}
                                variant="ghost"
                                onClick={() => { setIsPlaying(false); setCurrentIndex(idx); }}
                                className={cn(
                                    "p-0 min-w-0 transition-all duration-300 h-auto",
                                    currentIndex === idx
                                        ? "h-1 w-12 bg-primary rounded-full"
                                        : "h-1 w-2 bg-muted hover:bg-primary/50 rounded-full"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
