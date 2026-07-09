/**
 * Static theme definitions — mirrors database/seeders/data/website_themes.php.
 * Used as a client-side fallback so the theme selector renders
 * even when the website_themes DB table hasn't been seeded yet.
 *
 * Each slug maps 1:1 to [data-theme="slug"] in brand-palettes.css.
 */

export interface ThemeDefinition {
    slug: string;
    name: string;
    category: "core" | "brand" | "festival";
    description: string;
    preview_colors: string[];
}

export const STATIC_THEMES: ThemeDefinition[] = [
    // ── Core Admin Themes ────────────────────────────────────────
    { slug: "royal",        name: "Royal",        category: "core",     description: "Indigo & Violet — the default legacy theme. Evokes trust and authority.",    preview_colors: ["#4338ca", "#7c3aed", "#c4b5fd"] },
    { slug: "nature",       name: "Nature",       category: "core",     description: "Emerald & Sage — growth and vitality. The main PDS Education theme.",             preview_colors: ["#065f46", "#10b981", "#a7f3d0"] },
    { slug: "vibrant",      name: "Vibrant",      category: "core",     description: "Amethyst & Orchid — creative energy and modern flair.",                        preview_colors: ["#7e22ce", "#a855f7", "#e9d5ff"] },
    { slug: "heritage",     name: "Heritage",     category: "core",     description: "Burgundy & Rose — tradition and timeless elegance.",                           preview_colors: ["#7f1d1d", "#dc2626", "#fecaca"] },
    { slug: "intelligence", name: "Intelligence", category: "core",     description: "Midnight Indigo — scholarly depth for research institutions.",                 preview_colors: ["#1e3a5f", "#3b82f6", "#bfdbfe"] },
    { slug: "serenity",     name: "Serenity",     category: "core",     description: "Deep Teal — calm and focused environment.",                                    preview_colors: ["#134e4a", "#14b8a6", "#ccfbf1"] },
    { slug: "energy",       name: "Energy",       category: "core",     description: "Charred Amber — warmth and inspiration.",                                      preview_colors: ["#78350f", "#f59e0b", "#fef3c7"] },
    { slug: "oxford",       name: "Oxford",       category: "core",     description: "Academic Navy — prestigious darker palette for universities.",                  preview_colors: ["#1e3a8a", "#3b82f6", "#dbeafe"] },

    // ── Brand Identity Palettes ──────────────────────────────────
    { slug: "crimson",      name: "Crimson",      category: "brand",    description: "Bold red — passion and determination.",                                        preview_colors: ["#991b1b", "#ef4444", "#fecaca"] },
    { slug: "teal",         name: "Teal",         category: "brand",    description: "Cool teal — professionalism and clarity.",                                     preview_colors: ["#134e4a", "#2dd4bf", "#ccfbf1"] },
    { slug: "sunset",       name: "Sunset",       category: "brand",    description: "Warm orange — creativity and optimism.",                                       preview_colors: ["#9a3412", "#f97316", "#fed7aa"] },
    { slug: "forest",       name: "Forest",       category: "brand",    description: "Deep green — natural and organic.",                                            preview_colors: ["#14532d", "#22c55e", "#bbf7d0"] },
    { slug: "plum",         name: "Plum",         category: "brand",    description: "Rich purple — luxury and sophistication.",                                     preview_colors: ["#581c87", "#a855f7", "#e9d5ff"] },
    { slug: "cobalt",       name: "Cobalt",       category: "brand",    description: "Vivid blue — trustworthy and professional.",                                   preview_colors: ["#1e3a8a", "#3b82f6", "#93c5fd"] },
    { slug: "rose",         name: "Rose",         category: "brand",    description: "Soft pink — approachable and caring.",                                         preview_colors: ["#9f1239", "#f43f5e", "#fda4af"] },
    { slug: "slate",        name: "Slate",        category: "brand",    description: "Neutral grey — minimal and clean.",                                            preview_colors: ["#334155", "#64748b", "#cbd5e1"] },
    { slug: "jade",         name: "Jade",         category: "brand",    description: "Warm green — balanced and harmonious.",                                        preview_colors: ["#064e3b", "#34d399", "#a7f3d0"] },
    { slug: "saffron",      name: "Saffron",      category: "brand",    description: "Golden saffron — cultural heritage and warmth.",                               preview_colors: ["#92400e", "#fbbf24", "#fef3c7"] },
    { slug: "pdseducation", name: "PDS Education",category: "brand",    description: "Crimson & Gold — bold educational identity.",                                  preview_colors: ["#7f1d1d", "#dc2626", "#fbbf24"] },

    // ── Festival & Occasion Themes ───────────────────────────────
    { slug: "diwali",       name: "Diwali",       category: "festival", description: "Festival of Lights — warm golds and deep roses.",                              preview_colors: ["#ea580c", "#f59e0b", "#fef3c7"] },
    { slug: "republic",     name: "Republic Day", category: "festival", description: "26 January — saffron, white and green tricolor pride.",                        preview_colors: ["#ea580c", "#16a34a", "#f8fafc"] },
];
