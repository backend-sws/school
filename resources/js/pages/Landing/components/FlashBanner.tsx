import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { fireConfetti } from '@/lib/confetti';
import { usePage } from '@inertiajs/react';
import { BANNER_REGISTRY } from '@/constants/landing/banner-factory';
import type { LandingThemeKey } from '@/constants/landing/types';

/**
 * FlashBanner — Creative, fully responsive top-of-page announcement bar.
 *
 * Theme resolution priority:
 * 1. Active festival from Branding::activeFestival() → `branding.festival_banner`
 * 2. DOM `data-theme` attribute (set by Blade)
 * 3. Fallback to 'default'
 *
 * Content is driven by BANNER_REGISTRY.
 * Visual styling is driven by `[data-banner-theme]` CSS variables.
 */
const FlashBanner = () => {
    const [dismissed, setDismissed] = useState(false);

    // Priority: Inertia festival_banner → DOM data-theme → 'default'
    const { branding } = usePage<{ branding: { festival_banner?: string } }>().props;

    const resolvedTheme: LandingThemeKey = (
        (branding?.festival_banner as LandingThemeKey) ||
        (typeof document !== 'undefined'
            ? document.documentElement.getAttribute('data-theme') as LandingThemeKey
            : null)
    ) || 'default';

    const banner = BANNER_REGISTRY[resolvedTheme] || BANNER_REGISTRY.default;

    const handleDismiss = () => {
        fireConfetti('sideCannons');
        setDismissed(true);
    };

    if (!banner) return null;

    // Split emoji from text for separate animation
    const emojiMatch = banner.text.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u);
    const emoji = emojiMatch?.[0]?.trim();
    const textWithoutEmoji = emojiMatch ? banner.text.slice(emojiMatch[0].length) : banner.text;

    const Decoration = banner.Decoration;

    return (
        <AnimatePresence>
            {!dismissed && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    data-banner-theme={resolvedTheme}
                    className={cn("flash-banner l-theme relative z-50 overflow-hidden", banner.className)}
                >
                    {/* ── Animated shimmer overlay ── */}
                    <div className="flash-banner__shimmer" aria-hidden="true" />

                    {/* ── Edge glow accents ── */}
                    <div className="flash-banner__edge-glow flash-banner__edge-glow--top" aria-hidden="true" />
                    <div className="flash-banner__edge-glow flash-banner__edge-glow--bottom" aria-hidden="true" />

                    {/* ── Custom Decoration (e.g. NavratriDecoration) ── */}
                    {Decoration && (
                        <div className="absolute inset-0 pointer-events-none z-1">
                            <Decoration />
                        </div>
                    )}

                    {/* ── Content: always visible, layered above decoration ── */}
                    <div className="flash-banner__content relative z-10">
                        {/* Floating emoji with bounce */}
                        {emoji && (
                            <motion.span
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.2 }}
                                className="flash-banner__emoji"
                                aria-hidden="true"
                            >
                                {emoji}
                            </motion.span>
                        )}

                        {/* Main text */}
                        <motion.span
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                            className="flash-banner__text"
                        >
                            {textWithoutEmoji}
                        </motion.span>

                        {/* CTA pill */}
                        {banner.link && (
                            <motion.a
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                href={banner.link.href}
                                className="flash-banner__cta group"
                            >
                                <span>{banner.link.label}</span>
                                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                            </motion.a>
                        )}
                    </div>

                    {/* ── Dismiss button ── */}
                    {banner.dismissible && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={handleDismiss}
                            className="flash-banner__dismiss group"
                            aria-label="Dismiss banner"
                        >
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4 transform group-active:scale-75 transition-transform" />
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FlashBanner;
