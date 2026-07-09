import { Play, ZoomIn, Camera, Video as VideoIcon } from 'lucide-react';
import type { GalleryMedia, GalleryCategory } from '@/constants';
import { cn } from '@/lib/utils';

interface GallerySectionProps {
    category: GalleryCategory;
    media: readonly GalleryMedia[];
}

export function GallerySection({ category, media }: GallerySectionProps) {
    const images = media.filter(m => m.type === 'image');
    const videos = media.filter(m => m.type === 'video');

    if (media.length === 0) return null;

    return (
        <section id={category.id} className="scroll-mt-24">
            {/* Section Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-10 bg-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                        {category.name}
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
                    {category.name} Gallery
                </h2>
                <p className="text-muted-foreground max-w-3xl">
                    {category.description}
                </p>
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {images.map((item, idx) => (
                        <div
                            key={item.id}
                            className={cn(
                                "group relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10",
                                idx === 0 && "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto h-[400px] sm:h-[600px]",
                                idx !== 0 && "aspect-[4/3]"
                            )}
                        >
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end">
                                <h3 className="text-xl font-bold text-white tracking-tight mb-1">{item.title}</h3>
                                {item.description && (
                                    <p className="text-sm text-white/80 line-clamp-2">{item.description}</p>
                                )}
                            </div>
                            <div className="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 border border-white/20 transform translate-y-2 group-hover:translate-y-0">
                                <ZoomIn className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Videos Grid */}
            {videos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {videos.map((item) => (
                        <div
                            key={item.id}
                            className="group flex flex-col gap-4"
                        >
                            <div className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-card">
                                {item.thumbnail ? (
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <VideoIcon className="w-12 h-12 text-muted-foreground/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                        <Play className="w-8 h-8 fill-current translate-x-0.5" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                                    <VideoIcon className="w-3 h-3" />
                                    Video Highlight
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
