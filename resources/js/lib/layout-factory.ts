/**
 * Layout Factory — Assembly Line Architecture
 *
 * Layouts are assembled from composable stages (Shell → Nav → Content → Footer).
 * Each LayoutKey maps to a pipeline of stage keys, and stage keys map to
 * concrete configuration (CSS classes, component refs).
 *
 * Software Factory pattern:
 *   Page → Shell Stage → Nav Stage → Content Stage → Footer Stage → Rendered
 *
 * To add a new layout:
 *   1. Define a pipeline in LAYOUT_PIPELINES
 *   2. Map page prefixes to it in layout-config.ts
 *   Done. No new component file needed.
 */

import type { ComponentType, ReactNode } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Stage Keys — the building blocks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Shell controls viewport scroll behavior */
export type ShellStage = "locked" | "natural";

/** Nav controls the navigation chrome */
export type NavStage = "sidebar" | "topbar" | "minimal" | "none";

/** Content controls the inner content frame */
export type ContentStage = "padded" | "prose" | "full" | "centered";

/** Footer controls the bottom section */
export type FooterStage = "powered" | "legal" | "public" | "none";

/** MobileNav controls the navigation evolution for small screens */
export type MobileNavStage = "bottom-nav" | "drawer" | "none";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Layout Keys — the product SKUs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type LayoutKey =
    | "admin"
    | "auth"
    | "public"
    | "portal"
    | "onboarding"
    | "canvas"
    | "fullpage"
    | "legal"
    | "settings";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pipeline Definition
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface LayoutPipeline {
    /** Viewport scroll behavior */
    shell: ShellStage;
    /** Navigation chrome */
    nav: NavStage;
    /** Inner content frame */
    content: ContentStage;
    /** Bottom section */
    footer: FooterStage;
    /** Mobile-specific navigation behavior */
    mobileNav: MobileNavStage;
    /**
     * If true, the layout is self-managed — the page component
     * wraps itself in its own layout. The factory won't wrap it.
     * Used for complex layouts like auth (split panel), portal (custom topbar).
     */
    selfManaged?: boolean;
}

/** The default layout key when no match is found in the hashmap */
export const DEFAULT_LAYOUT: LayoutKey = "admin";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pipeline Registry — how each layout is assembled
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LAYOUT_PIPELINES: Record<LayoutKey, LayoutPipeline> = {
    admin: {
        shell:   "locked",
        nav:     "sidebar",
        content: "padded",
        footer:  "none",
        mobileNav: "bottom-nav",
    },
    auth: {
        shell:   "natural",
        nav:     "none",
        content: "centered",
        footer:  "none",
        mobileNav: "none",
        selfManaged: true,
    },
    public: {
        shell:   "natural",
        nav:     "topbar",
        content: "full",
        footer:  "none",
        mobileNav: "none",
        selfManaged: true,
    },
    portal: {
        shell:   "natural",
        nav:     "topbar",
        content: "padded",
        footer:  "none",
        mobileNav: "bottom-nav",
        selfManaged: true,
    },
    onboarding: {
        shell:   "natural",
        nav:     "none",
        content: "centered",
        footer:  "none",
        mobileNav: "none",
        selfManaged: true,
    },
    canvas: {
        shell:   "natural",
        nav:     "none",
        content: "full",
        footer:  "none",
        mobileNav: "none",
    },
    fullpage: {
        shell:   "natural",
        nav:     "minimal",
        content: "full",
        footer:  "none",
        mobileNav: "none",
    },
    legal: {
        shell:   "natural",
        nav:     "minimal",
        content: "prose",
        footer:  "none",
        mobileNav: "none",
        selfManaged: true,
    },
    settings: {
        shell:   "locked",
        nav:     "sidebar",
        content: "padded",
        footer:  "none",
        mobileNav: "bottom-nav",
    },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Stage CSS Maps — concrete styles for each stage key
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SHELL_CLASSES: Record<ShellStage, string> = {
    locked:  "h-screen overflow-hidden",
    natural: "min-h-screen",
};

export const CONTENT_CLASSES: Record<ContentStage, string> = {
    padded:   "flex-1 min-h-0 px-4 lg:px-6 pt-8 pb-12 mx-auto w-full",
    prose:    "flex-1 min-h-0 mx-auto max-w-3xl px-[var(--space-6)] py-[var(--space-10)] sm:py-[var(--space-12)]",
    full:     "flex-1 min-h-0",
    centered: "flex-1 min-h-0 flex items-center justify-center p-[var(--space-4)]",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Layout Component Registry — maps LayoutKey → component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Registry of layout wrapper components.
 *
 * - Non-selfManaged layouts (admin, settings, canvas) use concrete wrapper components.
 * - SelfManaged layouts (auth, public, portal, onboarding, fullpage, legal)
 *   don't need a factory wrapper — the page handles its own layout.
 *
 * This is populated lazily to avoid circular imports.
 */
const LAYOUT_COMPONENT_MAP: Record<LayoutKey, (() => Promise<{ default: ComponentType<any> }>) | null> = {
    admin:      () => import("@/layouts/app-layout"),
    settings:   () => import("@/layouts/app-layout"),
    canvas:     () => import("@/layouts/canvas-layout"),
    // Self-managed — page wraps itself
    auth:       null,
    public:     null,
    portal:     null,
    onboarding: null,
    fullpage:   () => import("@/layouts/full-page-layout"),
    legal:      null,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Factory API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get the pipeline configuration for a layout key.
 */
export function getPipeline(key: LayoutKey): LayoutPipeline {
    return LAYOUT_PIPELINES[key];
}

/**
 * Get the layout wrapper component for a layout key.
 * Returns null for self-managed layouts.
 */
export function getLayoutImporter(key: LayoutKey) {
    return LAYOUT_COMPONENT_MAP[key];
}

/**
 * Check if a layout is self-managed (page wraps itself).
 */
export function isSelfManaged(key: LayoutKey): boolean {
    return LAYOUT_PIPELINES[key]?.selfManaged === true;
}
