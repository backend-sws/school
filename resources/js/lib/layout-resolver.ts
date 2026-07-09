/**
 * Layout Resolver — Central routing of pages to layout shells.
 *
 * Reads `institution.type` from Inertia shared data and returns the
 * navigation config, section registry, label overrides, and theme
 * defaults for the current institution type.
 *
 * DB overrides from `websiteNav` (shared Inertia prop) take precedence
 * over static defaults. This enables the admin panel (Website Builder)
 * to customize all public navigation and footer content.
 *
 * Usage:
 *   const ctx = useLayoutContext();
 *   // ctx.navItems, ctx.footerSections, ctx.landingSections, ...
 */

import { usePage } from "@inertiajs/react";
import { useMemo } from "react";
import type { SharedData } from "@/types";
import type { InstitutionType, PublicNavItem, FooterSection, UtilityLink, ImportantLink } from "@/constants/landing/types";
import type { SectionMeta } from "@/constants/landing/sections";
import { PUBLIC_NAV, PUBLIC_FOOTER, TOP_BAR_TAG, PUBLIC_UTILITY_LINKS, PUBLIC_IMPORTANT_LINKS } from "@/constants/landing/navigation";
import { LANDING_SECTIONS } from "@/constants/landing/sections";
import {
    GROUP_LABEL_OVERRIDES,
    HEAD_LABEL,
    HEAD_DESK_LABEL,
    DEFAULT_THEME,
    DEFAULT_FONT,
    PRIMARY_CTA_LABEL,
} from "@/constants/landing/overrides";

// ── DB Nav Config Shape (from websiteNav shared prop) ────────────
interface WebsiteNavConfig {
    footer_description?: string;
    top_bar_tag?: string;
    privacy_policy_url?: string;
    terms_of_service_url?: string;
    sitemap_url?: string;
    custom_nav_items?: PublicNavItem[];
    custom_footer_sections?: FooterSection[];
    custom_utility_links?: UtilityLink[];
    custom_important_links?: ImportantLink[];
}

export interface LayoutContextResult {
    /** Resolved institution type (defaults to 'college') */
    institutionType: InstitutionType;
    /** Public nav items for this institution type */
    navItems: PublicNavItem[];
    /** Footer sections for this institution type */
    footerSections: FooterSection[];
    /** Landing page section order for this institution type */
    landingSections: SectionMeta[];
    /** Sidebar group label overrides */
    groupLabelOverrides: Record<string, string>;
    /** "Principal" / "Director" / "Vice Chancellor" */
    headLabel: string;
    /** "Principal's Desk" / "Director's Desk" / "Vice Chancellor's Desk" */
    headDeskLabel: string;
    /** Resolved theme key (DB brand_theme → type default) */
    defaultTheme: string;
    /** Resolved font key (DB brand_font → type default) */
    defaultFont: string | undefined;
    /** Custom brand hex color from DB (overrides theme primary), or null */
    brandColor: string | null;
    /** Primary CTA label (e.g. 'Apply Now', 'Enroll Now') */
    ctaLabel: string;
    /** Top bar left badge (e.g. 'CBSE Affiliated', 'Govt. of Bihar') */
    topBarTag: string;
    /** Top-right utility links (Feedback, Grievance, etc.) */
    utilityLinks: UtilityLink[];
    /** Sub-header important links (CBSE, NAAC, etc.) — empty = hidden */
    importantLinks: ImportantLink[];
    /** Footer description text (from DB or default) */
    footerDescription: string;
    /** Legal links (from DB or defaults) */
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
    sitemapUrl: string;
}

/**
 * Hook to resolve the full layout context for the current institution.
 * Memoized — safe to call from any component.
 *
 * DB overrides from websiteNav take precedence over static type-based defaults.
 */
export function useLayoutContext(): LayoutContextResult {
    const { institution, websiteNav } = usePage<SharedData>().props as any;
    const type = (institution?.type ?? "college") as InstitutionType;
    const nav: WebsiteNavConfig = websiteNav ?? {};

    return useMemo(
        () => ({
            institutionType: type,
            // DB custom → static defaults per type
            navItems: nav.custom_nav_items ?? PUBLIC_NAV[type] ?? PUBLIC_NAV.college,
            footerSections: nav.custom_footer_sections ?? PUBLIC_FOOTER[type] ?? PUBLIC_FOOTER.college,
            landingSections: LANDING_SECTIONS[type] ?? LANDING_SECTIONS.college,
            groupLabelOverrides: GROUP_LABEL_OVERRIDES[type] ?? {},
            headLabel: HEAD_LABEL[type] ?? "Principal",
            headDeskLabel: HEAD_DESK_LABEL[type] ?? "Principal's Desk",
            // Prefer DB brand tokens → type-level defaults
            defaultTheme: institution?.brand_theme ?? DEFAULT_THEME[type] ?? "royal",
            defaultFont: institution?.brand_font ?? DEFAULT_FONT[type],
            brandColor: institution?.brand_color ?? null,
            ctaLabel: PRIMARY_CTA_LABEL[type] ?? "Apply Now",
            topBarTag: nav.top_bar_tag ?? TOP_BAR_TAG[type] ?? "",
            utilityLinks: nav.custom_utility_links ?? PUBLIC_UTILITY_LINKS[type] ?? [],
            importantLinks: nav.custom_important_links ?? PUBLIC_IMPORTANT_LINKS[type] ?? [],
            // Footer-specific config
            footerDescription: nav.footer_description ?? "",
            privacyPolicyUrl: nav.privacy_policy_url ?? "#",
            termsOfServiceUrl: nav.terms_of_service_url ?? "#",
            sitemapUrl: nav.sitemap_url ?? "#",
        }),
        [type, institution?.brand_theme, institution?.brand_font, institution?.brand_color, nav],
    );
}

/**
 * Utility to resolve institution type from a raw string.
 * Falls back to 'college' for unknown types.
 */
export function resolveInstitutionType(raw?: string | null): InstitutionType {
    const valid: InstitutionType[] = ["school", "college", "coaching", "university"];
    if (raw && valid.includes(raw as InstitutionType)) {
        return raw as InstitutionType;
    }
    throw new Error("Invalid institution type");
}
