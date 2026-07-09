/**
 * Pricing section beam configs.
 * Popular plan gets a distinct accent.
 */
export interface PricingBeamConfig {
    from: string;
    to: string;
    duration: number;
    size: number;
}

export const PRICING_BEAM_CONFIG: PricingBeamConfig[] = [
    { from: '#94a3b8', to: '#cbd5e1', duration: 14, size: 60 },   // Starter — subtle slate
    { from: '#6366f1', to: '#a78bfa', duration: 8, size: 100 },    // Professional (popular) — indigo accent
    { from: '#8b5cf6', to: '#c084fc', duration: 12, size: 60 },   // Enterprise — violet
    { from: '#f59e0b', to: '#fcd34d', duration: 10, size: 60 },   // Plus — amber
];
