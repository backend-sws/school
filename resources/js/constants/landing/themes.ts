import type { LandingBannerConfig, LandingMotifKey, LandingThemeKey } from './types';

// ── Landing Banner Config ────────────────────────────────────────
// The ONLY JS config — all colors/fonts/gradients live in CSS tokens.
// Banner has structured data (text, links, dismissibility) so it stays in JS.

export const LANDING_BANNER_CONFIG: Partial<Record<LandingThemeKey, LandingBannerConfig>> = {
    default: {
        text: '🚀 Powering 500+ institutions across India',
        link: { label: 'See Plans', href: '#pricing' },
        dismissible: true,
    },
    diwali: {
        text: '🪔 Happy Diwali! Celebrate with 25% off all plans',
        link: { label: 'Claim Offer', href: '/pricing?coupon=DIWALI25' },
        dismissible: true,
    },
    republic: {
        text: '🇮🇳 Happy Republic Day! Building Digital India together',
        dismissible: true,
    },
    navratri: {
        text: '🏮 Get ready to celebrate Navratri!',
        link: { label: 'Explore More', href: '#features' },
        dismissible: true,
    },
};

// ── Theme List (for admin panel dropdown) ────────────────────────
export const LANDING_THEME_OPTIONS: { value: LandingThemeKey; label: string }[] = [
    { value: 'default', label: 'PDS Education Modern' },
    { value: 'diwali', label: 'Diwali Festival' },
    { value: 'republic', label: 'Republic Day' },
    { value: 'navratri', label: 'Navratri Festival' },
];

// ── Motif Pool (for dynamic rotation) ────────────────────────────
export const LANDING_MOTIF_POOL: LandingMotifKey[] = [
    'ashoka',
    'rangoli',
    'paisley',
    'lotus',
    'mithila',
    'warli',
    'chikankari',
    'kalamkari',
    'vedic',
    'swastik',
    'shloka',
];
