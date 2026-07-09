import { useMemo } from "react";
import { usePage } from "@inertiajs/react";
import type { SharedData } from "@/types";
import type { SidebarConfig, SidebarNavGroup, SidebarNavItem } from "@/types/navigation";
import { unifiedSidebarConfig, SETTINGS_NAVIGATION } from "@/constants/navigation";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import type { InstitutionContentMap } from "@/constants/content";

// ─── Title resolver ──────────────────────────────────────────────────────────

/**
 * Resolve a nav item's title using the content engine.
 * If the item has a `contentKey`, look it up in the content map.
 * Falls back to the static `title` string.
 */
function resolveTitle(item: SidebarNavItem, contentMap: InstitutionContentMap): string {
  if (item.contentKey && item.contentKey in contentMap) {
    return String(contentMap[item.contentKey as keyof InstitutionContentMap]);
  }
  return item.title;
}

function resolveItems(items: SidebarNavItem[], contentMap: InstitutionContentMap): SidebarNavItem[] {
  return items.map((item) => ({
    ...item,
    title: resolveTitle(item, contentMap),
  }));
}

function resolveGroups(groups: SidebarNavGroup[], contentMap: InstitutionContentMap): SidebarNavGroup[] {
  return groups.map((group) => ({
    ...group,
    items: resolveItems(group.items, contentMap),
  }));
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface NavConfigResult {
  /** Resolved sidebar config (all contentKey titles resolved) */
  config: SidebarConfig;
  /** Resolved settings navigation */
  settingsNav: SidebarNavGroup[];
  /** Raw content map (for any extra lookups) */
  contentMap: InstitutionContentMap;
}

/**
 * Returns the full navigation config with all `contentKey` titles
 * resolved from the institution content engine.
 *
 * Use this hook in every component that renders nav items
 * (sidebar, mobile-nav, command-palette, module-layout).
 */
export function useNavConfig(): NavConfigResult {
  const contentMap = useInstitutionContent();

  const config = useMemo<SidebarConfig>(() => ({
    ...unifiedSidebarConfig,
    mainItems: resolveItems(unifiedSidebarConfig.mainItems, contentMap),
    groups: resolveGroups(unifiedSidebarConfig.groups, contentMap),
    footerItems: unifiedSidebarConfig.footerItems
      ? resolveItems(unifiedSidebarConfig.footerItems, contentMap)
      : undefined,
  }), [contentMap]);

  const settingsNav = useMemo(
    () => resolveGroups(SETTINGS_NAVIGATION, contentMap),
    [contentMap],
  );

  return { config, settingsNav, contentMap };
}
