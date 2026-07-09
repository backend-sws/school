/**
 * Results section beam configs.
 */
export interface ResultBeamConfig {
    from: string;
    to: string;
    duration: number;
}

export const RESULTS_BEAM_CONFIG: ResultBeamConfig[] = [
    { from: '#10b981', to: '#6ee7b7', duration: 10 },   // Emerald — paperwork
    { from: '#6366f1', to: '#a78bfa', duration: 12 },   // Indigo — admissions
    { from: '#ec4899', to: '#f9a8d4', duration: 14 },   // Pink — fee leakage
];
