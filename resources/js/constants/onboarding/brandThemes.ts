/**
 * Brand theme options for the onboarding organization setup.
 * Excludes festival themes (diwali, republic, independence, holi, navratri, onam, eid, christmas).
 * Maps 1:1 to [data-theme] selectors in brand-palettes.css.
 */

export interface BrandThemeOption {
    value: string;
    label: string;
    description: string;
    /** A representative primary color hex for visual swatch */
    swatch: string;
}

export const BRAND_THEME_OPTIONS: BrandThemeOption[] = [
    { value: 'navratri', label: 'Navratri', description: 'Royal purple, golden saffron and kumkum red', swatch: '#4A148C' },
    { value: 'nature', label: 'Nature', description: 'Deep green, earthy and institutional', swatch: '#166534' },
    { value: 'royal', label: 'Royal', description: 'Rich indigo with gold accents', swatch: '#4F46E5' },
    { value: 'vibrant', label: 'Vibrant', description: 'Electric violet, bold and modern', swatch: '#7C3AED' },
    { value: 'heritage', label: 'Heritage', description: 'Warm burgundy, classic academia', swatch: '#9F1239' },
    { value: 'intelligence', label: 'Intelligence', description: 'Midnight blue, sharp and professional', swatch: '#1E3A5F' },
    { value: 'serenity', label: 'Serenity', description: 'Calm teal, soothing and clean', swatch: '#0D9488' },
    { value: 'energy', label: 'Energy', description: 'Sunset orange, warm and dynamic', swatch: '#EA580C' },
    { value: 'oxford', label: 'Oxford', description: 'Dark navy, prestigious and timeless', swatch: '#002147' },
    { value: 'crimson', label: 'Crimson', description: 'Deep red, bold and commanding', swatch: '#991B1B' },
    { value: 'teal', label: 'Teal', description: 'Ocean teal, fresh and balanced', swatch: '#0F766E' },
    { value: 'sunset', label: 'Sunset', description: 'Amber warmth, inviting glow', swatch: '#D97706' },
    { value: 'forest', label: 'Forest', description: 'Pine green, natural and grounded', swatch: '#15803D' },
    { value: 'plum', label: 'Plum', description: 'Deep purple, creative and elegant', swatch: '#7E22CE' },
    { value: 'cobalt', label: 'Cobalt', description: 'Bright blue, clear and confident', swatch: '#1D4ED8' },
    { value: 'rose', label: 'Rose', description: 'Soft pink, warm and approachable', swatch: '#E11D48' },
    { value: 'slate', label: 'Slate', description: 'Cool grey, minimal and modern', swatch: '#475569' },
    { value: 'jade', label: 'Jade', description: 'Rich jade, polished and refined', swatch: '#059669' },
    { value: 'saffron', label: 'Saffron', description: 'Warm saffron, vibrant and cultural', swatch: '#C2410C' },
];

/** Allowlist of valid theme keys (for validation) */
export const BRAND_THEME_KEYS = BRAND_THEME_OPTIONS.map(t => t.value);

/** Default theme key (client-side fallback, prioritized below config('ems.default_brand_theme')) */
export const DEFAULT_BRAND_THEME = 'nature';
