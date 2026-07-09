import type { ComponentType } from "react";

// ── Institution Types ────────────────────────────────────────────
export type InstitutionType = "school" | "college" | "coaching" | "university";

// ── Public Navigation ────────────────────────────────────────────
export interface PublicNavItem {
    title: string;
    href?: string;
    children?: { title: string; href: string }[];
}

export interface FooterSection {
    title: string;
    links: { title: string; href: string }[];
}

export interface UtilityLink {
    icon: ComponentType<{ className?: string }>;
    href: string;
    label: string;
}

export interface ImportantLink {
    title: string;
    url: string;
    description?: string;
}

// ── Landing Section Composition ──────────────────────────────────
export interface LandingSectionConfig {
    /** Unique key for React keying & admin toggle */
    id: string;
    /** React component to render */
    component: ComponentType<any>;
    /** Override label for the section (e.g. "Vice Chancellor's Desk" instead of "Principal's Desk") */
    label?: string;
    /** Grid layout hint: 'full' | 'hero-3col' | '2col' | '3col' */
    layout?: "full" | "hero-3col" | "2col" | "3col";
    /** Order weight — lower = higher on page (auto-assigned from array index if omitted) */
    order?: number;
}

// ── Layout Resolver ──────────────────────────────────────────────
export type PageType = "public" | "app" | "portal" | "auth";

export interface LayoutContext {
    institutionType: InstitutionType;
    pageType: PageType;
    userRole?: string;
}

// ── Landing Theme System ─────────────────────────────────────────
export type LandingThemeKey = 
    | 'default' | 'diwali' | 'republic' | 'navratri' | 'independence' | 'gandhi_jayanti' 
    | 'holi' | 'raksha_bandhan' | 'janmashtami' | 'ganesh_chaturthi' | 'dussehra' | 'christmas' | 'new_year'
    | 'ramanavami' | 'hanumanjayanti' | 'vaisakhi' | 'akshayatritiya' | 'gangaur'
    | 'pongal' | 'onam' | 'bihu' | 'baisakhi' | 'ugadi' | 'charaideo' | 'lohr'
    | 'admission_open' | 'early_bird' | 'exam_results' | 'new_session' | 'annual_day' | 'sports_meet'
    | 'scholarship' | 'webinar' | 'workshop' | 'maintenance' | 'summer_camp' | 'winter_break'
    | 'pdseducation_purple' | 'pdseducation_gold' | 'pdseducation_ocean' | 'pdseducation_forest';

export type LandingMotifKey =
    | 'ashoka'
    | 'rangoli'
    | 'paisley'
    | 'lotus'
    | 'mithila'
    | 'warli'
    | 'chikankari'
    | 'kalamkari'
    | 'vedic'
    | 'swastik'
    | 'shloka'
    | 'navratri'
    | 'mudra'
    | 'dhanush'
    | 'gada'
    | 'wheat'
    | 'kalash'
    | 'sindoor';

export interface LandingBannerConfig {
    text: string;
    className?: string;
    link?: { label: string; href: string };
    dismissible: boolean;
    /** Optional specific motif to show in this banner's background */
    motif?: LandingMotifKey;
    /** Optional override for the background gradient/color */
    background?: string;
    /** Optional specific theme to force when this banner is active (if not using the default resolution) */
    theme?: LandingThemeKey;
    /** Optional custom decoration component to render within the banner */
    Decoration?: ComponentType<any>;
}
