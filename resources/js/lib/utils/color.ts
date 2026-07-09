/**
 * Hex → OKLCH color converter for CSS variable override.
 *
 * Used to convert a brand hex color (e.g. "#2E7D32") into an OKLCH string
 * that can override the theme's `--primary` CSS variable.
 *
 * Conversion path: Hex → sRGB → Linear RGB → XYZ D65 → OKLAB → OKLCH
 */

/** Convert hex color to OKLCH CSS string, e.g. "oklch(0.45 0.12 145)" */
export function hexToOklch(hex: string): string {
    const [r, g, b] = hexToRgb(hex);
    const [lr, lg, lb] = [srgbToLinear(r / 255), srgbToLinear(g / 255), srgbToLinear(b / 255)];

    // Linear RGB → XYZ D65
    const x = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const y = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const z = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

    // XYZ → OKLAB
    const l_ = Math.cbrt(0.2104542553 * x + 0.7936177850 * y - 0.0040720468 * z);
    const m_ = Math.cbrt(0.0765378210 * x + 0.7317038560 * y + 0.1916737630 * z);
    const s_ = Math.cbrt(0.0177079888 * x + 0.3472048090 * y + 0.6349077020 * z);

    const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    // OKLAB → OKLCH
    const C = Math.sqrt(a * a + bLab * bLab);
    const H = (Math.atan2(bLab, a) * 180) / Math.PI;
    const hue = H < 0 ? H + 360 : H;

    return `oklch(${round(L, 2)} ${round(C, 2)} ${round(hue, 0)})`;
}

/**
 * Generate CSS custom property overrides for a brand color.
 * Returns a CSSProperties object that overrides --primary and derived tokens.
 */
export function brandColorOverrides(hex: string): Record<string, string> {
    const oklch = hexToOklch(hex);
    return {
        '--primary': oklch,
        '--ring': oklch,
    };
}

// ── Internal helpers ─────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
        parseInt(h.substring(0, 2), 16),
        parseInt(h.substring(2, 4), 16),
        parseInt(h.substring(4, 6), 16),
    ];
}

function srgbToLinear(c: number): number {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function round(n: number, d: number): number {
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
}
