import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    /** Permission key required to see this item. Omit = always visible. */
    permission?: string;
    /** Subscription feature/module required to see this item. */
    feature?: string;
    /** If true, show as disabled with "Coming soon" label (route not implemented). */
    comingSoon?: boolean;
    /**
     * Content engine key for scope-type-aware title.
     * When set, the sidebar resolves the label from `InstitutionContentMap[contentKey]`
     * instead of using the static `title`. The `title` field is kept as fallback.
     */
    contentKey?: string;
}

export interface SidebarNavGroup {
    /** Label is strictly for UI classification (section heading). No permission or route logic. */
    label: string;
    items: SidebarNavItem[];
}

export interface SidebarConfig {
    mainItems: SidebarNavItem[];
    groups: SidebarNavGroup[];
    footerItems?: SidebarNavItem[];
    homePath?: string;
}
