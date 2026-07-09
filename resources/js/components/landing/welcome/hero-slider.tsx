import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { Slider } from '@/types/website';
import { cn, htmlToPlainText } from "@/lib/utils";
import { Link } from '@inertiajs/react';
import { register } from '@/routes';
import R2Api from '@/lib/api/r2Api';
import { useInstitution } from '@/hooks/use-institution';

const FALLBACK_SUBTITLE = 'Updates';

interface HeroSliderProps {
    sliders?: Slider[];
}

function mapSlidersToSlides(sliders: Slider[]) {
    return sliders.map((s) => ({
        title: htmlToPlainText(s.title ?? ''),
        subtitle: FALLBACK_SUBTITLE,
        desc: htmlToPlainText(s.description ?? ''),
        ctaCaption: s.button_caption ? htmlToPlainText(s.button_caption) : '',
        ctaUrl: s.button_url?.trim() || '',
        image: s.image_url ?? '',
    }));
}

export function HeroSlider({ sliders = [] }: HeroSliderProps) {
    const { name } = useInstitution();
    const slides = useMemo(
        () => (sliders.length > 0 ? mapSlidersToSlides(sliders) : []),
        [sliders]
    );
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const isEmpty = slides.length === 0;

    return (
        <div className="relative w-full overflow-hidden group isolate bg-card h-[240px] sm:h-[340px] md:h-[400px] lg:h-[450px] rounded-xl sm:rounded-2xl border border-border">
            {/* Empty state placeholder - responsive typography and spacing */}
            {isEmpty && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 sm:gap-4 p-4 sm:p-6 bg-primary/5 border border-border/50">
                    <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-center tracking-tight leading-tight px-2">
                        Welcome to {name}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center max-w-md px-2">
                        Explore admissions, academics, and campus life.
                    </p>
                    <Button
                        asChild
                        className="px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors touch-manipulation h-auto"
                    >
                        <Link href={register()}>
                            Register for admission
                        </Link>
                    </Button>
                </div>
            )}
            {/* Slider Content */}
            {slides.map((slide, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        {slide.image ? (
                            <img
                                src={R2Api.imageSrc(slide.image)}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : null}
                        {/* More solid/natural overlay for text readability */}
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Text Overlay - responsive padding and typography */}
                    {slide.title && (
                        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10">
                            <div className="relative z-10 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded bg-primary/20 border border-primary/20 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-3 sm:mb-5">
                                    <span className="w-2 h-2 rounded-full bg-primary-foreground" />
                                    {slide.subtitle}
                                </div>
                                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 leading-[1.05] tracking-tight text-white">
                                    {slide.title}
                                </h2>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 font-medium mb-4 sm:mb-8 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                                    {slide.desc}
                                </p>
                                {slide.ctaCaption && (
                                    <div className="flex flex-wrap gap-2 sm:gap-4">
                                        <Button
                                            asChild
                                            className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 text-xs sm:text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 touch-manipulation h-auto"
                                        >
                                            <Link href={slide.ctaUrl || register()}>
                                                {slide.ctaCaption}
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Slider Indicators - Flat Style (only when slides exist) */}
            {!isEmpty && (
                <div className="absolute bottom-3 right-4 sm:bottom-6 sm:right-8 z-20 flex gap-2 sm:gap-2.5">
                    {slides.map((_, idx) => (
                        <Button
                            key={idx}
                            variant="ghost"
                            onClick={() => setCurrentSlide(idx)}
                            className={cn(
                                "w-2 h-2 p-0 min-w-0 rounded-full transition-all duration-300",
                                currentSlide === idx
                                    ? "w-8 bg-primary"
                                    : "bg-white/40 hover:bg-white/60"
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
