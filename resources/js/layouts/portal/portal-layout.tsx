import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Link, usePage, router } from "@inertiajs/react";
import AppLogoIcon from "@/components/app-logo-icon";
import { useInstitution } from "@/hooks/use-institution";
import { type SharedData } from "@/types";
import { logout } from "@/routes";
import { HeaderActions } from "@/components/shared/header-actions";
import { RealtimeNotificationsSubscriber } from "@/components/RealtimeNotificationsSubscriber";
import { PermissionGate } from "@/components/PermissionGate";
import { PORTAL_NAVIGATION } from "@/constants/navigation";
import { useNavConfig } from "@/hooks/useNavConfig";
import type { SidebarNavItem } from "@/types/navigation";
import type { LayoutKey } from "@/lib/layout-factory";
import Each from "@/components/Each";
import {
    LayoutDashboard,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

interface PortalLayoutProps {
    layoutKey?: LayoutKey;
}

/**
 * PortalLayout — the layout for student/parent-facing pages.
 *
 * Factory-managed: auto-wrapped by the layout factory for all `student-portal/*` pages.
 * Uses PermissionGate to filter nav items by user permissions.
 */
export default function PortalLayout({
    children,
    layoutKey,
}: PropsWithChildren<PortalLayoutProps>) {
    const { auth } = usePage<SharedData>().props;
    const { name } = useInstitution();
    const { contentMap } = useNavConfig();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <RealtimeNotificationsSubscriber />
            <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent/10 selection:text-accent relative">
                {/* Premium Background Textures */}
                <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-[100px]" />
                </div>

                {/* Portal Navbar */}
                <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 sm:h-16 items-center justify-between px-4 md:px-6">
                        {/* Left: Logo + Name */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors h-9 w-9"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                aria-label="Toggle sidebar"
                            >
                                {sidebarOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                            <Link href="/student-portal/dashboard" className="flex items-center gap-2.5">
                                <div className="p-1 rounded-lg border border-border bg-white dark:bg-card">
                                    <AppLogoIcon alt={`${name} Logo`} className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-sm font-bold text-foreground leading-tight truncate max-w-[200px]">
                                        {name}
                                    </h1>
                                    <span className="text-[10px] text-accent-foreground font-semibold uppercase tracking-wider">
                                        Student Portal
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Right: Header Actions (notification bell, user dropdown, theme) */}
                        <HeaderActions />
                    </div>
                </header>

                <div className="flex flex-1 min-h-0">
                    {/* Sidebar — Desktop */}
                    <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-card">
                        <nav className="flex-1 p-3 space-y-1">
                            <Each
                                of={PORTAL_NAVIGATION}
                                render={(item: SidebarNavItem) => (
                                    <PortalNavItem key={item.href} item={item} />
                                )}
                            />
                        </nav>
                    </aside>

                    {/* Sidebar — Mobile Overlay */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-40 lg:hidden">
                            <div
                                className="absolute inset-0 bg-black/40"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <aside className="relative z-50 w-64 h-full bg-card border-r border-border flex flex-col animate-slide-in-left">
                                <nav className="flex-1 p-3 space-y-1 pt-4">
                                    <Each
                                        of={PORTAL_NAVIGATION}
                                        render={(item: SidebarNavItem) => (
                                            <PortalNavItem
                                                key={item.href}
                                                item={item}
                                                onClick={() => setSidebarOpen(false)}
                                            />
                                        )}
                                    />
                                </nav>
                            </aside>
                        </div>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">{children}</main>
                </div>

                {/* Mobile Bottom Tab Bar */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm safe-area-pb">
                    <div className="flex items-center justify-around py-1.5">
                        <Each
                            of={PORTAL_NAVIGATION.slice(0, 5)}
                            render={(item: SidebarNavItem) => {
                                const Icon = item.icon ?? LayoutDashboard;
                                const isActive =
                                    typeof window !== "undefined" &&
                                    window.location.pathname.startsWith(item.href);
                                return (
                                    <PermissionGate key={item.href} can={item.permission} feature={item.feature}>
                                        <Link
                                            href={item.href}
                                            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${isActive
                                                ? "text-accent-foreground"
                                                : "text-muted-foreground"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">
                                                {item.title.split(" ").pop()}
                                            </span>
                                        </Link>
                                    </PermissionGate>
                                );
                            }}
                        />
                    </div>
                </nav>
            </div>
        </>
    );
}

/** Sub-component: single portal nav item with PermissionGate */
function PortalNavItem({ item, onClick }: { item: SidebarNavItem; onClick?: () => void }) {
    const Icon = item.icon ?? LayoutDashboard;
    const isActive =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith(item.href);

    return (
        <PermissionGate can={item.permission} feature={item.feature}>
            <Link
                href={item.href}
                onClick={onClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-accent/15 text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
            >
                <Icon className="h-4 w-4 shrink-0" />
                {item.title}
            </Link>
        </PermissionGate>
    );
}
