/**
 * Social proof section beam configs.
 * Stats get a unified accent; testimonials get per-card colors.
 */
export interface SocialProofBeamConfig {
    from: string;
    to: string;
    duration: number;
}

/** Beam for each stat card (4 stats) */
export const STAT_BEAM_CONFIG: SocialProofBeamConfig[] = [
    { from: '#6366f1', to: '#a78bfa', duration: 10 },
    { from: '#8b5cf6', to: '#c084fc', duration: 12 },
    { from: '#ec4899', to: '#f9a8d4', duration: 14 },
    { from: '#06b6d4', to: '#67e8f9', duration: 16 },
];

/** Beam for each testimonial card (3 testimonials) */
export const TESTIMONIAL_BEAM_CONFIG: SocialProofBeamConfig[] = [
    { from: '#f59e0b', to: '#fcd34d', duration: 12 },
    { from: '#10b981', to: '#6ee7b7', duration: 14 },
    { from: '#8b5cf6', to: '#c4b5fd', duration: 16 },
];
