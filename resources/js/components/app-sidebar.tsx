import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePage, router } from "@inertiajs/react";
import * as React from "react";
import { motion } from "framer-motion";
import { type LucideIcon, LayoutGrid, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { type SharedData } from "@/types";
import { useAuth } from "@/hooks/use-can";
import type { SidebarNavItem } from "@/types/navigation";
import { PermissionGate } from "@/components/PermissionGate";
import { useNavConfig } from "@/hooks/useNavConfig";
import { PORTAL_NAVIGATION } from "@/constants/navigation";
import { getDailySlogan } from "@/constants/content/slogans";
import Each from "@/components/Each";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar() {
  const { config, settingsNav } = useNavConfig();
  const { url, props: { institution } } = usePage<SharedData>();
  const auth = useAuth();

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /** Find the first nav item the user has permission + feature access to. */
  const firstPermittedHref = React.useCallback((items: SidebarNavItem[]): string | undefined => {
    const item = items.find(i => {
      if (i.permission && !auth.can(i.permission)) return false;
      if (i.feature && !auth.hasFeature(i.feature)) return false;
      return true;
    });
    return item?.href;
  }, [auth]);

  // ─── State ──────────────────────────────────────────────────────────────────
  
  // Find which group contains the active URL to set initial module
  const initialModule = React.useMemo(() => {
    if (url === "/dashboard") return "dashboard";
    if (url.startsWith("/settings") || 
        url.startsWith("/admin/roles") || 
        url.startsWith("/admin/data-import") ||
        url.startsWith("/accounts/fee-hub/collection-settings")
    ) return "settings";
    
    // Check mainItems (student-portal items, etc.)
    const activeMainItem = config.mainItems.find(item => url.startsWith(item.href));
    if (activeMainItem) return activeMainItem.href;

    const activeGroup = config.groups.find(group => 
      group.items.some(item => url.startsWith(item.href))
    );
    return activeGroup ? activeGroup.label : "dashboard";
  }, [url, config.groups, config.mainItems]);

  const [activeModule, setActiveModule] = React.useState<string>(initialModule);

  // ─── Sync active module with URL changes ───────────────────────────────────
  React.useEffect(() => {
    if (url === "/dashboard") {
      setActiveModule("dashboard");
      return;
    }

    if (url.startsWith("/settings") || 
        url.startsWith("/admin/roles") || 
        url.startsWith("/admin/data-import") ||
        url.startsWith("/accounts/fee-hub/collection-settings")
    ) {
      setActiveModule("settings");
      return;
    }

    // Check mainItems (student-portal items, etc.)
    const activeMainItem = config.mainItems.find(item => url.startsWith(item.href));
    if (activeMainItem) {
      setActiveModule(activeMainItem.href);
      return;
    }

    const activeGroup = config.groups.find(group => 
      group.items.some(item => url.startsWith(item.href))
    );
    if (activeGroup) setActiveModule(activeGroup.label);
  }, [url, config.groups, config.mainItems]);

  // ─── Constants ──────────────────────────────────────────────────────────────
  const isActive = React.useCallback((href: string) => url === href, [url]);

  const railItems = React.useMemo(() => {
    // Individual main items (student portal items, etc.) — only if user has permission
    const permittedMainItems = config.mainItems
      .filter(i => {
        if (i.permission && !auth.can(i.permission)) return false;
        if (i.feature && !auth.hasFeature(i.feature)) return false;
        // Skip duplicate dashboard if it's already at the top
        if (i.title.toLowerCase() === "dashboard" || i.href === "/dashboard") return false;
        return true;
      })
      .map(i => ({
        id: i.href,
        label: i.title,
        icon: i.icon || LayoutGrid,
        href: i.href,
      }));

    // Groups — only if user has at least one permitted item in the group
    const permittedGroups = config.groups
      .filter(group => firstPermittedHref(group.items) !== undefined)
      .map(group => {
        const firstItem = group.items.find(i => {
           if (i.permission && !auth.can(i.permission)) return false;
           if (i.feature && !auth.hasFeature(i.feature)) return false;
           return true; 
        });
        return {
          id: group.label,
          label: group.label,
          icon: firstItem?.icon || LayoutGrid,
          href: firstPermittedHref(group.items),
        };
      });

    return [
      { id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
      ...permittedMainItems,
      ...permittedGroups,
    ];
  }, [config.groups, config.mainItems, auth, firstPermittedHref]);

  const permittedSettingsNav = React.useMemo(() => {
    return settingsNav
      .map(group => ({
        ...group,
        items: group.items.filter(i => {
          if (i.permission && !auth.can(i.permission)) return false;
          if (i.feature && !auth.hasFeature(i.feature)) return false;
          return true;
        })
      }))
      .filter(group => group.items.length > 0);
  }, [settingsNav, auth]);

  const activeGroup = config.groups.find(g => g.label === activeModule);

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isPortal = ["student", "parent", "candidate"].includes(auth.auth?.role || "");

  return (
    <Sidebar
      collapsible="none"
      className={cn(
        "bg-sidebar border-r border-sidebar-border overflow-hidden transition-[width] duration-300 ease-in-out hidden md:block",
        isPortal ? "w-[240px]" : (isCollapsed ? "w-[72px]" : "w-[310px]")
      )}
    >
      <SidebarContent className="flex flex-row p-0 scrollbar-none overflow-hidden h-full">

        {!isPortal && (
          <TooltipProvider delayDuration={100}>
            {/* ─── Layer 1: Left Rail (Icons Only) ─── */}
            <aside className="w-[72px] flex flex-col border-r border-sidebar-border bg-sidebar-accent/5 shrink-0 h-full">
              {/* Logo Section - Height matched with Detail Pane Header */}
              <div className="h-16 flex items-center justify-center border-b border-sidebar-border shrink-0">
                <Link
                  href={config.homePath}
                  className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-all hover:bg-primary/20 shadow-sm"
                >
                  {institution?.logo_url ? (
                     <img
                     src={institution.logo_url}
                     alt={institution.short_name || institution.name}
                     className="size-5 object-contain"
                   />
                  ) : (
                    <span className="text-primary font-black text-lg leading-none font-logo">
                      {(institution?.short_name || institution?.name || "V").charAt(0).toUpperCase()}
                    </span>
                  )}
                </Link>
              </div>

              <div className="flex-1 flex flex-col items-center py-4 overflow-hidden">
                {/* Primary Nav Items */}
                <nav className="flex-1 flex flex-col gap-1 px-1 overflow-y-auto scrollbar-none w-full items-center">
                  <Each 
                     of={railItems}
                    render={(item: { id: string; label: string; icon: LucideIcon; href?: string }) => {
                      const active = activeModule === item.id;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.href || "/dashboard"}
                          onClick={() => setActiveModule(item.id)}
                          className={cn(
                            "relative flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg transition-all group/rail-item w-full no-underline",
                            active 
                              ? "text-primary bg-primary/10" 
                              : "text-muted-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          {active && (
                            <motion.div
                              layoutId="rail-active-indicator"
                              className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-primary"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <Icon className={cn("size-5 relative z-10", active ? "fill-primary/20 stroke-2" : "stroke-[1.5]")} />
                          <span className="text-[10px] font-medium tracking-tight text-center leading-none px-0.5 truncate w-full">{item.label}</span>
                        </Link>
                      );
                    }}
                  />
                </nav>

                {/* Rail Footer Items (Settings, etc.) */}
                <div className="w-8 h-px bg-sidebar-border mx-auto my-4 shrink-0" />
                <nav className="flex flex-col gap-1 px-1 pb-2 items-center w-full">
                {config.footerItems?.map((item) => {
                  const isSettings = item.title === "Settings";
                  const active = isSettings ? activeModule === "settings" : isActive(item.href);
                  const Icon = item.icon || LayoutGrid;
                  
                  return (
                    <button
                      key={item.title}
                      onClick={() => {
                        if (isSettings) {
                          setActiveModule("settings");
                          // Flatten all settings groups, find first permitted
                          const allSettingsItems = permittedSettingsNav.flatMap(g => g.items);
                          const href = firstPermittedHref(allSettingsItems);
                          if (href) router.visit(href);
                        }
                      }}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg transition-all group/rail-item w-full",
                        active 
                          ? "text-primary bg-primary/10" 
                          : "text-muted-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="rail-footer-active-indicator"
                          className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-primary"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className={cn("size-5 relative z-10", active ? "fill-primary/20 stroke-2" : "stroke-[1.5]")} />
                      <span className="text-[10px] font-medium tracking-tight text-center leading-none px-0.5 truncate w-full">{item.title}</span>
                    </button>
                  );
                })}
              </nav>
              </div>
            </aside>
          </TooltipProvider>
        )}

        {/* ─── Layer 2: Detail Pane (Sub-items) ─── */}
        <div className={cn(
          "flex flex-col bg-sidebar overflow-hidden h-full transition-all duration-300 ease-in-out",
          isPortal ? "flex-1 opacity-100" : (isCollapsed ? "w-0 opacity-0 pointer-events-none" : "flex-1 opacity-100")
        )}>
          <header className="h-16 flex items-center px-5 border-b border-sidebar-border shrink-0">
             <div className="flex items-baseline gap-2 min-w-0 max-w-full">
              <span className="font-logo font-black text-sm leading-none tracking-tight text-foreground uppercase truncate shrink-0">
                {institution?.short_name || institution?.name || "PDS Education"}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground/40 italic leading-none truncate border-l border-sidebar-border/50 pl-2">
                {institution?.motto || getDailySlogan()}
              </span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none">
            {isPortal ? (
              <SidebarMenu className="gap-0.5">
                <Each 
                   of={PORTAL_NAVIGATION}
                   render={(item: SidebarNavItem) => <NavMenuItem key={item.href} item={item} url={url} />}
                />
              </SidebarMenu>
            ) : activeModule === "dashboard" ? (
              <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/dashboard")}
                      className={cn(
                        "h-9 px-3 rounded-lg font-medium transition-all",
                        isActive("/dashboard")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      <Link href="/dashboard" className="flex items-center gap-3 w-full">
                        <LayoutGrid className="size-4" />
                        <span className="text-[13px] font-display">Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
            ) : activeModule === "settings" ? (
              <div className="flex flex-col gap-8">
                <Each 
                  of={permittedSettingsNav}
                  render={(group) => (
                    <div key={group.label} className="flex flex-col gap-2">
                       <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest px-3 mb-1">
                        {group.label}
                      </span>
                      <SidebarMenu className="gap-0.5">
                        <Each 
                           of={group.items}
                          render={(item: SidebarNavItem) => <NavMenuItem key={item.href} item={item} url={url} />}
                        />
                      </SidebarMenu>
                    </div>
                  )}
                />
              </div>
            ) : (
              <SidebarMenu className="gap-0.5">
                <Each 
                   of={activeGroup?.items || []}
                   render={(item: SidebarNavItem) => <NavMenuItem key={item.href} item={item} url={url} />}
                />
              </SidebarMenu>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

/** Sub-component for individual nav items to keep root cleaner */
function NavMenuItem({ item, url }: { item: SidebarNavItem; url: string }) {
  const Icon = item.icon ?? LayoutGrid;
  const active = url === item.href;
  const isComingSoon = item.comingSoon;

  return (
    <PermissionGate can={item.permission} feature={item.feature}>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild={!isComingSoon}
          disabled={isComingSoon}
          isActive={active}
          className={cn(
            "h-9 px-3 rounded-lg font-medium transition-all group/item",
            isComingSoon && "opacity-50 cursor-not-allowed",
            active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground/80 hover:bg-sidebar-accent/50 hover:text-foreground"
          )}
        >
          {isComingSoon ? (
            <span className="flex items-center gap-3 w-full">
              <Icon className="size-4 shrink-0 opacity-60" />
              <span className="text-[13px] truncate flex-1 font-display">{item.title}</span>
              <span className="text-[8px] font-black bg-muted/50 px-1 py-0.5 rounded uppercase tracking-wider">Soon</span>
            </span>
          ) : (
            <Link href={item.href} className="flex items-center gap-3 w-full">
              <Icon className={cn("size-4 shrink-0 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground")} />
              <span className="text-[13px] truncate font-display tracking-tight">{item.title}</span>
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto size-1.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </Link>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </PermissionGate>
  );
}
