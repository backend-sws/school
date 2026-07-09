/**
 * Reusable confetti effects — thin wrapper around canvas-confetti.
 * Lazy-loads the library so it never bloats the initial bundle.
 *
 * Usage:
 *   import { fireConfetti } from '@/lib/confetti';
 *   fireConfetti('sideCannons');
 *   fireConfetti('burst', { origin: { x: 0.5, y: 0.5 } });
 */

type ConfettiFn = (opts?: Record<string, unknown>) => void;

let confettiModule: ConfettiFn | null = null;

async function getConfetti(): Promise<ConfettiFn> {
    if (!confettiModule) {
        const mod = await import('canvas-confetti');
        confettiModule = mod.default as unknown as ConfettiFn;
    }
    return confettiModule;
}

/* ────── Preset effects ────── */

const BRAND_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

/** Side cannons — burst from left + right top corners */
async function sideCannons(overrides?: Record<string, unknown>) {
    const confetti = await getConfetti();
    const duration = 300;
    const end = Date.now() + duration;

    const defaults = {
        particleCount: 3,
        spread: 55,
        colors: BRAND_COLORS,
        ticks: 100,
        gravity: 1.2,
        scalar: 0.9,
        ...overrides,
    };

    const frame = () => {
        confetti({ ...defaults, angle: 60, origin: { x: 0, y: 0 }, drift: 0.5 });
        confetti({ ...defaults, angle: 120, origin: { x: 1, y: 0 }, drift: -0.5 });
        if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
}

/** Center burst — explodes from center of viewport */
async function burst(overrides?: Record<string, unknown>) {
    const confetti = await getConfetti();
    confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: BRAND_COLORS,
        ticks: 80,
        gravity: 1,
        scalar: 1.1,
        ...overrides,
    });
}

/** Fireworks — multiple delayed bursts */
async function fireworks(overrides?: Record<string, unknown>) {
    const confetti = await getConfetti();
    const defaults = {
        spread: 360,
        ticks: 60,
        gravity: 0,
        decay: 0.96,
        startVelocity: 20,
        colors: BRAND_COLORS,
        ...overrides,
    };

    const shoot = () => {
        confetti({ ...defaults, particleCount: 30 });
        confetti({ ...defaults, particleCount: 5 });
        confetti({ ...defaults, particleCount: 15, scalar: 0.5, shapes: ['circle'] });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}

/** Stars — gentle star-shaped confetti */
async function stars(overrides?: Record<string, unknown>) {
    const confetti = await getConfetti();
    confetti({
        particleCount: 50,
        spread: 70,
        origin: { x: 0.5, y: 0.4 },
        colors: BRAND_COLORS,
        shapes: ['star'],
        ticks: 120,
        gravity: 0.8,
        scalar: 1.2,
        ...overrides,
    });
}

/* ────── Public API ────── */

const PRESETS = { sideCannons, burst, fireworks, stars } as const;
export type ConfettiPreset = keyof typeof PRESETS;

/**
 * Fire a confetti preset.
 * @param preset — 'sideCannons' | 'burst' | 'fireworks' | 'stars'
 * @param overrides — optional canvas-confetti options to merge
 */
export function fireConfetti(preset: ConfettiPreset, overrides?: Record<string, unknown>): void {
    PRESETS[preset](overrides);
}
