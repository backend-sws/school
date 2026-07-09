import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, isSameUrl } from "@/lib/utils";
import { type SidebarNavGroup } from "@/types/navigation";
import { Link } from "@inertiajs/react";
import { Fragment, type PropsWithChildren } from "react";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { PermissionGate } from "@/components/PermissionGate";

interface ModuleLayoutProps extends PropsWithChildren {
    sidebarNavItems: SidebarNavGroup[];
    sidebarId?: string;
    contentAreaId?: string;
    hideSidebar?: boolean;
}

export default function ModuleLayout({
    children,
    sidebarNavItems,
    sidebarId,
    contentAreaId,
    hideSidebar = false,
}: ModuleLayoutProps) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === "undefined") {
        return null;
    }

    const currentPath = window.location.pathname;

    const filteredGroups = sidebarNavItems;

    return (
        <div className="px-4 pt-4 pb-6">
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                {!hideSidebar && (
                    <aside
                        id={sidebarId}
                        className="w-full max-w-xl lg:w-60 shrink-0 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
                    >
                        <nav className="flex flex-col space-y-6">
                            <Each
                                of={filteredGroups}
                                keyExtractor={(group) => group.label}
                                render={(group) => (
                                    <PermissionGate key={group.label} canAny={group.items.map((i: any) => i.permission).filter((p: any): p is string => !!p)}>
                                        <div className="space-y-3">
                                            <h4 className="px-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.1em]">
                                                {group.label}
                                            </h4>
                                            <div className="flex flex-col space-y-1">
                                                <Each
                                                    of={group.items}
                                                    keyExtractor={(item, index) => `${item.href}-${index}`}
                                                    render={(item) => (
                                                        <PermissionGate key={item.href} can={item.permission} feature={item.feature}>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                asChild
                                                                className={cn(
                                                                    "w-full justify-start h-10 px-3.5 transition-all duration-200 rounded-xl",
                                                                    isSameUrl(currentPath, item.href)
                                                                        ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                                                                        : "text-muted-foreground/90 hover:text-foreground hover:bg-muted/60"
                                                                )}
                                                            >
                                                                <Link
                                                                    href={item.href}
                                                                    className="flex items-center gap-3.5"
                                                                >
                                                                    {item.icon && (
                                                                        <item.icon
                                                                            className={cn(
                                                                                "h-[18px] w-[18px] shrink-0",
                                                                                isSameUrl(currentPath, item.href)
                                                                                    ? "text-primary"
                                                                                    : "text-muted-foreground/70"
                                                                            )}
                                                                        />
                                                                    )}
                                                                    <span className="truncate text-sm tracking-tight">
                                                                        {item.title}
                                                                    </span>
                                                                </Link>
                                                            </Button>
                                                        </PermissionGate>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </PermissionGate>
                                )}
                            />
                        </nav>
                    </aside>
                )}

                {!hideSidebar && <Separator className="my-8 lg:hidden" />}

                <div id={contentAreaId} className="flex-1 min-w-0">
                    <div className="space-y-12 pb-12">{children}</div>
                </div>
            </div>
        </div>
    );
}
