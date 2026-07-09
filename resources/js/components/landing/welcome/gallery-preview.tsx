import { ZoomIn } from 'lucide-react';
import type { GalleryPreviewPayload } from '@/types/website';
import { htmlToPlainText } from '@/lib/utils';
import { ViewAllButton } from './view-all-button';

const GALLERY_URL = '/gallery';

const GALLERY_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070', alt: 'Main Academic Block', category: 'Campus' },
    { src: 'https://images.unsplash.com/photo-1498243639359-2ceece460004?q=80&w=2070', alt: 'Central Library', category: 'Facilities' },
    { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070', alt: 'Cultural Fest 2025', category: 'Events' },
];

interface GalleryPreviewProps {
    galleryPreview?: GalleryPreviewPayload | null;
}

export function GalleryPreview({ galleryPreview = null }: GalleryPreviewProps) {
    const useCms = galleryPreview && galleryPreview.images && galleryPreview.images.length > 0;
    const images = useCms
        ? galleryPreview!.images.map((img) => ({
            src: img.image_url ?? '',
            alt: htmlToPlainText(img.caption ?? galleryPreview!.title ?? 'Image'),
            category: htmlToPlainText(galleryPreview!.title ?? 'Gallery'),
        }))
        : GALLERY_IMAGES;
    const galleryHref = GALLERY_URL;

    return (
        <section className="py-10 sm:py-14 md:py-20 relative overflow-hidden bg-background">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 md:mb-12 gap-4 sm:gap-8 relative z-10 px-3 sm:px-4">
                <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-[1px] w-6 sm:w-10 bg-primary" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">Campus Life</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">Photo Gallery</h2>
                </div>
                <div className="shrink-0 pb-1">
                    <ViewAllButton label="View Full Gallery" href={galleryHref} variant="subtle" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 relative z-10 px-3 sm:px-4 md:h-[600px]">
                <div className="md:col-span-2 relative group rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer h-[220px] sm:h-[280px] md:h-full border border-border">
                    {images[0]?.src ? (
                        <img src={images[0].src} alt={images[0].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-sm bg-primary text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-widest w-fit mb-1 sm:mb-2">
                                {images[0]?.category ?? 'Campus'}
                            </span>
                        </div>
                        <h3 className="text-sm sm:text-base md:text-xl font-bold text-white tracking-tight line-clamp-2">{images[0]?.alt ?? ''}</h3>
                    </div>
                    <div className="absolute top-6 right-6 p-3 rounded-lg bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                        <ZoomIn className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 h-full">
                    {images.slice(1).map((image, idx) => (
                        <div key={idx} className="flex-1 relative group rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer min-h-[140px] sm:min-h-[180px] md:min-h-0 border border-border">
                            {image.src ? (
                                <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : null}
                            <div className="absolute inset-x-0 bottom-0 bg-black/40 p-3 sm:p-4 md:p-6 flex flex-col justify-end">
                                <span className="px-2 py-0.5 rounded-sm bg-primary text-white text-[8px] font-bold uppercase tracking-widest w-fit mb-1 sm:mb-2">
                                    {image.category}
                                </span>
                                <h3 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight line-clamp-2">{image.alt}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
