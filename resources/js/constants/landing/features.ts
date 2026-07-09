/**
 * Feature card border-beam config.
 * Each card gets a unique beam accent — supports both light & dark modes.
 */
export interface FeatureBeamConfig {
    from: string;
    to: string;
    duration: number;
}

export const FEATURES_BEAM_CONFIG: FeatureBeamConfig[] = [
    { from: '#6366f1', to: '#a78bfa', duration: 8 },   // Indigo — hero card
    { from: '#ec4899', to: '#f9a8d4', duration: 10 },   // Pink
    { from: '#8b5cf6', to: '#c084fc', duration: 12 },   // Violet
    { from: '#06b6d4', to: '#67e8f9', duration: 14 },   // Cyan
    { from: '#10b981', to: '#6ee7b7', duration: 16 },   // Emerald
];
