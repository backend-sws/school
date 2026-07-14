import { Link, usePage, router } from "@inertiajs/react";
import { LayoutGrid, Search, Bell, Menu, Layers, ChevronLeft, Settings } from "lucide-react";
import { cn, isSameUrl } from "@/lib/utils";
import { type SharedData } from "@/types";
import { useSidebar } from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CommandPalette } from "@/components/command-palette";
import Each from "@/components/Each";
import { PoweredByFooter } from "@/components/powered-by-footer";

import { PermissionGate } from "@/components/PermissionGate";
import { useNavConfig } from "@/hooks/useNavConfig";
import { PORTAL_NAVIGATION } from "@/constants/navigation";

type DrillState =
    | { level: "closed" }
    | { level: "groups" }
    | { level: "items"; groupLabel: string }
    | { level: "settings-groups" }
    | { level: "settings-items"; groupLabel: string };

export function MobileNav() {
    const { url, props } = usePage<SharedData>();
    const institution = props.institution;
    const branding = props.branding;
    const isPortal = ["student", "parent", "candidate"].includes(props.auth?.role || "");
    const { setOpenMobile } = useSidebar();
    const [searchOpen, setSearchOpen] = useState(false);
    const [drill, setDrill] = useState<DrillState>({ level: "closed" });

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

    // Close drill-down on navigation
    useEffect(() => {
        setDrill({ level: "closed" });
    }, [url]);

    const closeDrill = useCallback(() => setDrill({ level: "closed" }), []);

    const activeTab = (() => {
        if (url === "/dashboard" || url === "/") return "Home";
        if (url.startsWith("/notifications")) return "Activity";
        if (drill.level === "settings-groups" || drill.level === "settings-items") return "Settings";
        if (drill.level === "groups" || drill.level === "items") return "Menu";
        return "";
    })();

    // Resolved navigation (titles from content engine)
    const { config, settingsNav } = useNavConfig();

    const settingsCategories = settingsNav.map(g => ({
        label: g.label,
        icon: g.items[0]?.icon ?? Settings,
        items: g.items,
    }));

    const allGroups = config.groups.map(g => ({
        label: g.label,
        icon: g.items[0]?.icon ?? Layers,
        items: g.items,
    }));

    // Get items for the current drilled group
    const drilledGroup = drill.level === "items"
        ? allGroups.find(g => g.label === drill.groupLabel)
        : drill.level === "settings-items"
            ? settingsCategories.find(g => g.label === drill.groupLabel)
            : null;

    const tabItems = useMemo(() => [
        { label: "Home", href: "/dashboard", icon: LayoutGrid },
        {
            label: "Menu",
            href: "#",
            icon: Layers,
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setDrill(prev =>
                    prev.level === "closed" || prev.level === "settings-groups" || prev.level === "settings-items"
                        ? { level: "groups" as const }
                        : { level: "closed" as const }
                );
            },
        },
        {
            label: "Settings",
            href: "#",
            icon: Settings,
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setDrill(prev =>
                    prev.level === "closed" || prev.level === "groups" || prev.level === "items"
                        ? { level: "settings-groups" as const }
                        : { level: "closed" as const }
                );
            },
        },
    ], []);

    return (
        <>
            <CommandPalette open={searchOpen} setOpen={setSearchOpen} />

            {/* Bottom Sheet Overlay */}
            <AnimatePresence>
                {drill.level !== "closed" && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-sm md:hidden"
                            onClick={closeDrill}
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            key="sheet"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="fixed bottom-16 left-0 right-0 z-[100] md:hidden pb-[env(safe-area-inset-bottom)]"
                        >
                            <div className="mx-3 bg-card/60 backdrop-blur-[32px] rounded-[2rem] border border-border/20 shadow-2xl overflow-hidden max-h-[60vh] relative group">
                                {/* Glass Mesh Effect */}
                                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%),radial-gradient(circle_at_bottom_left,var(--accent),transparent_70%)]" />
                                
                                {/* Sheet Header */}
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-border/20">
                                    {(drill.level === "items" || drill.level === "settings-items") ? (
                                        <button
                                            onClick={() => setDrill(drill.level === "settings-items" ? { level: "settings-groups" } : { level: "groups" })}
                                            className="flex items-center gap-2 text-primary font-semibold text-sm"
                                        >
                                            <ChevronLeft className="size-4" />
                                            <span>{drilledGroup?.label ?? "Back"}</span>
                                        </button>
                                    ) : drill.level === "settings-groups" ? (
                                        <span className="text-sm font-bold text-foreground tracking-tight">
                                            Settings
                                        </span>
                                    ) : (
                                        <span className="text-sm font-bold text-foreground tracking-tight">
                                            {isPortal ? "Menu" : "Modules"}
                                        </span>
                                    )}
                                </div>
 
                                 {/* Sheet Content */}
                                 <div className="overflow-y-auto max-h-[calc(60vh-56px)] overscroll-contain">
                                     <AnimatePresence mode="wait">
                                         {drill.level === "groups" && (
                                             <motion.div
                                                 key="groups"
                                                 initial={{ opacity: 0, x: -20 }}
                                                 animate={{ opacity: 1, x: 0 }}
                                                 exit={{ opacity: 0, x: -20 }}
                                                 transition={{ duration: 0.15 }}
                                                 className="py-2 px-3"
                                             >
                                                 {isPortal ? (
                                                     PORTAL_NAVIGATION.map((item: any) => {
                                                         const ItemIcon = item.icon ?? Layers;
                                                         const isActive = isSameUrl(currentPath, item.href);
                                                         const isComingSoon = item.comingSoon;
 
                                                         if (isComingSoon) {
                                                             return (
                                                                 <PermissionGate key={item.href} can={item.permission} feature={item.feature}>
                                                                     <div className="flex items-center gap-3.5 px-3 py-3 rounded-xl opacity-40 cursor-not-allowed">
                                                                         <div className="flex items-center justify-center size-9 rounded-lg bg-muted/40">
                                                                             <ItemIcon className="size-4.5 text-muted-foreground/50" />
                                                                         </div>
                                                                         <span className="text-[14px] font-medium text-muted-foreground">{item.title}</span>
                                                                         <span className="ml-auto text-[9px] font-bold bg-muted/60 px-1.5 py-0.5 rounded uppercase tracking-wider">Soon</span>
                                                                     </div>
                                                                 </PermissionGate>
                                                             );
                                                         }
 
                                                         return (
                                                             <PermissionGate key={item.href} can={item.permission} feature={item.feature}>
                                                                 <Link
                                                                     href={item.href}
                                                                     className={cn(
                                                                         "flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all relative",
                                                                         isActive
                                                                             ? "bg-primary/8 text-primary"
                                                                             : "hover:bg-muted/50 active:bg-muted/70"
                                                                     )}
                                                                 >
                                                                     <div className={cn(
                                                                         "flex items-center justify-center size-9 rounded-lg transition-colors",
                                                                         isActive
                                                                             ? "bg-primary text-primary-foreground shadow-sm"
                                                                             : "bg-muted/40 text-muted-foreground/70"
                                                                     )}>
                                                                         <ItemIcon className="size-4.5" />
                                                                     </div>
                                                                     <span className={cn(
                                                                         "text-[14px] font-medium tracking-tight",
                                                                         isActive ? "font-semibold" : ""
                                                                     )}>
                                                                         {item.title}
                                                                     </span>
                                                                     {isActive && (
                                                                         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-full" />
                                                                     )}
                                                                 </Link>
                                                             </PermissionGate>
                                                         );
                                                     })
                                                 ) : (
                                                     allGroups.map((group) => {
                                                         const GroupIcon = group.icon;
                                                         const permissions = group.items
                                                             .map((i: any) => i.permission)
                                                             .filter((p: any): p is string => !!p);
 
                                                         return (
                                                             <PermissionGate key={group.label} canAny={permissions}>
                                                                 <button
                                                                     onClick={() => setDrill({ level: "items", groupLabel: group.label })}
                                                                     className="flex items-center gap-3.5 w-full px-3 py-3 rounded-xl text-left transition-colors hover:bg-muted/50 active:bg-muted/70 group"
                                                                 >
                                                                     <div className="flex items-center justify-center size-9 rounded-lg bg-primary/5 text-primary/70 group-hover:bg-primary/10 transition-colors">
                                                                         <GroupIcon className="size-4.5" />
                                                                     </div>
                                                                     <div className="flex-1 min-w-0">
                                                                         <span className="text-[14px] font-semibold text-foreground tracking-tight">
                                                                             {group.label}
                                                                         </span>
                                                                         <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                                                                             {group.items.length} items
                                                                         </p>
                                                                     </div>
                                                                     <ChevronLeft className="size-4 text-muted-foreground/30 rotate-180" />
                                                                 </button>
                                                             </PermissionGate>
                                                         );
                                                     })
                                                 )}
                                             </motion.div>
                                         )}

                                        {(drill.level === "items" || drill.level === "settings-items") && drilledGroup && (
                                            <motion.div
                                                key={`items-${drilledGroup.label}`}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.15 }}
                                                className="py-2 px-3"
                                            >
                                                {drilledGroup.items.map((item: any) => {
                                                    const ItemIcon = item.icon ?? Layers;
                                                    const isActive = isSameUrl(currentPath, item.href);
                                                    const isComingSoon = item.comingSoon;

                                                    if (isComingSoon) {
                                                        return (
                                                            <PermissionGate key={item.href} can={item.permission} feature={item.feature}>
                                                                <div className="flex items-center gap-3.5 px-3 py-3 rounded-xl opacity-40 cursor-not-allowed">
                                                                    <div className="flex items-center justify-center size-9 rounded-lg bg-muted/40">
                                                                        <ItemIcon className="size-4.5 text-muted-foreground/50" />
                                                                    </div>
                                                                    <span className="text-[14px] font-medium text-muted-foreground">{item.title}</span>
                                                                    <span className="ml-auto text-[9px] font-bold bg-muted/60 px-1.5 py-0.5 rounded uppercase tracking-wider">Soon</span>
                                                                </div>
                                                            </PermissionGate>
                                                        );
                                                    }

                                                    return (
                                                        <PermissionGate key={item.href} can={item.permission} feature={item.feature}>
                                                            <Link
                                                                href={item.href}
                                                                className={cn(
                                                                    "flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all relative",
                                                                    isActive
                                                                        ? "bg-primary/8 text-primary"
                                                                        : "hover:bg-muted/50 active:bg-muted/70"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "flex items-center justify-center size-9 rounded-lg transition-colors",
                                                                    isActive
                                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                                        : "bg-muted/40 text-muted-foreground/70"
                                                                )}>
                                                                    <ItemIcon className="size-4.5" />
                                                                </div>
                                                                <span className={cn(
                                                                    "text-[14px] font-medium tracking-tight",
                                                                    isActive ? "font-semibold" : ""
                                                                )}>
                                                                    {item.title}
                                                                </span>
                                                                {isActive && (
                                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-full" />
                                                                )}
                                                            </Link>
                                                        </PermissionGate>
                                                    );
                                                })}
                                            </motion.div>
                                        )}

                                        {drill.level === "settings-groups" && (
                                            <motion.div
                                                key="settings-groups"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.15 }}
                                                className="py-2 px-3"
                                            >
                                                {settingsCategories.map((group) => {
                                                    const GroupIcon = group.icon;
                                                    const permissions = group.items
                                                        .map((i: any) => i.permission)
                                                        .filter((p: any): p is string => !!p);

                                                    return (
                                                        <PermissionGate key={group.label} canAny={permissions}>
                                                            <button
                                                                onClick={() => setDrill({ level: "settings-items", groupLabel: group.label })}
                                                                className="flex items-center gap-3.5 w-full px-3 py-3 rounded-xl text-left transition-colors hover:bg-muted/50 active:bg-muted/70 group"
                                                            >
                                                                <div className="flex items-center justify-center size-9 rounded-lg bg-primary/5 text-primary/70 group-hover:bg-primary/10 transition-colors">
                                                                    <GroupIcon className="size-4.5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-[14px] font-semibold text-foreground tracking-tight">
                                                                        {group.label}
                                                                    </span>
                                                                    <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                                                                        {group.items.length} items
                                                                    </p>
                                                                </div>
                                                                <ChevronLeft className="size-4 text-muted-foreground/30 rotate-180" />
                                                            </button>
                                                        </PermissionGate>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-background/60 backdrop-blur-2xl border-t border-border/15 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-around h-12 px-2">
                    <Each
                        of={tabItems}
                        keyExtractor={(item) => item.label}
                        render={(item) => {
                            const isActive = activeTab === item.label;
                            const isLink = !item.onClick;

                            const content = (
                                <div className="flex flex-col items-center justify-center gap-0.5 relative px-3 py-1">
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobile-nav-dot"
                                            className="absolute -top-1 size-1 rounded-full bg-primary"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                    <item.icon
                                        className={cn(
                                            "size-4 transition-all duration-300",
                                            isActive ? "text-primary" : "text-muted-foreground/45"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 1.8}
                                    />
                                    <span
                                        className={cn(
                                            "text-[8px] font-bold uppercase tracking-[0.1em] transition-all duration-300",
                                            isActive ? "text-primary" : "text-muted-foreground/35"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            );

                            return (
                                <div key={item.label} className="relative flex-1 group">
                                    {isLink ? (
                                        <Link
                                            href={item.href}
                                            onClick={closeDrill}
                                            className="flex flex-col items-center justify-center w-full h-full relative"
                                        >
                                            {content}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={item.onClick}
                                            className="flex flex-col items-center justify-center w-full h-full relative outline-none"
                                        >
                                            {content}
                                        </button>
                                    )}
                                </div>
                            );
                        }}
                    />

                    {/* Institution Logo */}
                    <Link
                        href={config.homePath}
                        className="flex flex-col items-center justify-center px-2"
                    >
                        <div className="size-6 rounded-md bg-primary/8 flex items-center justify-center border border-primary/10">
                            {institution?.logo_url ? (
                                <img src={institution.logo_url} alt={institution.short_name || institution.name} className="size-3.5 object-contain" />
                            ) : (
                                <span className="text-primary font-black text-[9px] leading-none font-logo">
                                    {(institution?.short_name || institution?.name || "V").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

                <PoweredByFooter
                    branding={branding}
                    className="border-t-0 bg-transparent backdrop-blur-none sticky-none static py-0.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] text-[7px] sm:text-[7px] z-auto"
                />
            </nav>
        </>
    );
}
