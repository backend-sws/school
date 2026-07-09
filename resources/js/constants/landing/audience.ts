/**
 * Audience card shine border color config.
 * Each card gets a unique gradient accent — supports both light & dark modes.
 */
export interface AudienceShineConfig {
    /** Light-mode shine colors */
    light: string[];
    /** Dark-mode shine colors (brighter variants for visibility) */
    dark: string[];
    /** ShineBorder duration override */
    duration: number;
}

export const AUDIENCE_CARD_SHINE: AudienceShineConfig[] = [
    {
        light: ['#6366f1', '#a78bfa'],
        dark: ['#818cf8', '#c4b5fd'],
        duration: 12,
    },
    {
        light: ['#8b5cf6', '#c084fc'],
        dark: ['#a78bfa', '#d8b4fe'],
        duration: 14,
    },
    {
        light: ['#ec4899', '#f472b6'],
        dark: ['#f472b6', '#f9a8d4'],
        duration: 16,
    },
    {
        light: ['#06b6d4', '#67e8f9'],
        dark: ['#22d3ee', '#a5f3fc'],
        duration: 18,
    },
];
