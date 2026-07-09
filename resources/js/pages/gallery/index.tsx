import { usePage } from '@inertiajs/react';
import { GALLERY_CATEGORIES, ALL_GALLERY_MEDIA } from '@/constants';
import { useInstitution } from '@/hooks/use-institution';
import type { GalleryCategory, GalleryMedia } from '@/constants';
import type { GalleryPageProps, GalleryWithImages, GalleryImagePayload } from '@/types/website';
import PublicLayout from '@/layouts/public/public-layout';
import { GallerySection } from '@/components/landing/gallery/gallery-section';
import Each from '@/components/Each';

function mapGalleryToCategoryAndMedia(gallery: GalleryWithImages): { category: GalleryCategory; media: GalleryMedia[] } {
    const category: GalleryCategory = {
        id: String(gallery.id),
        name: gallery.title ?? 'Gallery',
        description: gallery.description ?? '',
        icon: '📷',
        color: 'bg-primary/10 text-primary',
    };
    const media: GalleryMedia[] = (gallery.images ?? []).map((img: GalleryImagePayload) => ({
        id: String(img.id),
        type: (img.media_type === 'video' ? 'video' : 'image') as 'image' | 'video',
        src: img.image_url ?? '',
        alt: img.caption ?? '',
        title: img.caption ?? '',
        description: undefined,
        category: category.id,
    }));
    return { category, media };
}

export default function Gallery() {
    const { props } = usePage();
    const { name, location, affiliation } = useInstitution();
    const pageProps = props as unknown as GalleryPageProps;
    const galleries = pageProps.galleries ?? [];
    const sections = galleries.length > 0
        ? galleries.map(mapGalleryToCategoryAndMedia)
        : GALLERY_CATEGORIES.map((category) => ({
            category,
            media: ALL_GALLERY_MEDIA[category.id as keyof typeof ALL_GALLERY_MEDIA] ?? [],
        }));

    return (
        <PublicLayout
            title={`Gallery | ${name}`}
            description={`Photo and video gallery of ${name} – campus, events, and student life. ${location}. ${affiliation}.`}
        >
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-background overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Campus Life in Frames
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-foreground tracking-tight">
                        Our Gallery
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Explore a collection of photos and videos showcasing our academic excellence, vibrant campus life, and state-of-the-art facilities.
                    </p>

                    <nav className="flex justify-center items-center space-x-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-foreground">Gallery</span>
                    </nav>
                </div>
            </section>

            {/* Gallery Sections */}
            <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-20 space-y-24">
                <Each
                    of={sections}
                    keyExtractor={(section) => String(section.category.id)}
                    render={({ category, media }) => (
                        <GallerySection
                            key={category.id}
                            category={category}
                            media={media}
                        />
                    )}
                />
            </div>
        </PublicLayout>
    );
}
