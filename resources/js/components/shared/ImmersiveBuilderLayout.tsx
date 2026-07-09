import React, { useState, useEffect } from "react";
import { X, Menu, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ImmersiveBuilderStat {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconClassName?: string;
    containerClassName?: string;
}

interface ImmersiveBuilderLayoutProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    stats?: ImmersiveBuilderStat[];
    sidebarContent: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export function ImmersiveBuilderLayout({
    open,
    onClose,
    title,
    subtitle,
    icon: Icon,
    stats = [],
    sidebarContent,
    children,
    actions,
}: ImmersiveBuilderLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Prevent body scroll when immersive builder is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    if (!open) return null;

    const HeaderIcon = Icon;

    return (
        <div className="fixed inset-0 z-[9999] bg-background flex flex-col overflow-hidden isolate h-[100dvh] w-screen animate-in fade-in duration-300">
            {/* --- Top Header / Stats Bar --- */}
            <header className="h-16 border-b border-primary/10 bg-card/95 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shrink-0 gap-2 z-50">
                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden min-w-0 max-w-[45%] sm:max-w-[30%]">
                    <div className="md:hidden shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl hover:bg-primary/5 size-9"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="size-5" />
                        </Button>
                    </div>

                    <div className="size-8 sm:size-10 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
                        <HeaderIcon className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground truncate">{title}</h2>
                        {subtitle && (
                            <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground truncate opacity-60">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Desktop/Tablet Stats */}
                <div className="flex-1 flex items-center justify-center gap-4 lg:gap-12 overflow-hidden px-4">
                    {stats.map((stat, idx) => {
                        const StatIcon = stat.icon;
                        return (
                            <div key={idx} className={cn("flex items-center gap-2 lg:gap-3 shrink-0", stat.containerClassName)}>
                                <div className={cn("size-7 lg:size-10 rounded-full sm:rounded-3xl flex items-center justify-center transition-all", stat.iconClassName || "bg-primary/5 text-primary border border-primary/10")}>
                                    <StatIcon className="size-3.5 sm:size-4" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground leading-none">{stat.label}</p>
                                    <p className="text-[11px] font-black leading-none mt-1.5">{stat.value}</p>
                                </div>
                                <div className="sm:hidden">
                                    <p className="text-[10px] font-black leading-none">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                    {actions}
                    <div className="w-px h-6 bg-border mx-1 hidden sm:block opacity-50" />
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive shrink-0 size-9">
                        <X className="size-5" />
                    </Button>
                </div>
            </header>

            {/* --- Main Workspace --- */}
            <main className="flex-1 flex overflow-hidden min-h-0 relative bg-muted/10">
                {/* Mobile Local Sidebar Drawer */}
                <div
                    className={cn(
                        "fixed inset-0 z-[1000] bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                        isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                    onClick={() => setIsSidebarOpen(false)}
                />
                <aside
                    className={cn(
                        "fixed top-0 left-0 bottom-0 z-[1001] w-80 bg-background border-r border-border flex flex-col transition-transform duration-300 ease-out md:hidden",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0 bg-card">
                        <h2 className="text-sm font-black uppercase tracking-widest text-primary">Workspace</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="rounded-xl size-8">
                            <X className="size-4" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
                        {sidebarContent}
                    </div>
                </aside>

                {/* Sidebar: Desktop */}
                <aside className="hidden md:flex w-80 border-r border-border bg-card flex-col shrink-0 min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-hidden h-full flex flex-col">
                        {sidebarContent}
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col min-w-0 min-h-0 relative overflow-hidden">
                    <ScrollArea className="flex-1 w-full h-full" scrollHideDelay={0}>
                        <div className="flex flex-col min-h-full">
                            {children}
                        </div>
                    </ScrollArea>
                </section>
            </main>
        </div>
    );
}
