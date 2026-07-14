import * as React from "react";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { router, usePage } from "@inertiajs/react";
import { type SharedData } from "@/types";
import {
    Search,
    LayoutGrid,
    Settings,
    FileText,
    Bell,
    Zap,
    ArrowRight,
} from "lucide-react";
import { useNavConfig } from "@/hooks/useNavConfig";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer } from "vaul";

export function CommandPalette({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const { name: appName, auth } = usePage<SharedData>().props;
    const { config, settingsNav } = useNavConfig();
    const isMobile = useIsMobile();

    const isPortal = auth?.role === 'student' || auth?.role === 'parent' || auth?.role === 'candidate';

    React.useEffect(() => {
        if (isPortal) return;
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, setOpen, isPortal]);

    if (isPortal) return null;

    const suggestions = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutGrid, tag: "Navigate" },
        { title: "Notifications", href: "/notifications", icon: Bell, tag: "Utility" },
    ];

    const suggestionHrefs = suggestions.map(s => s.href);

    const runCommand = React.useCallback(
        (command: () => void) => {
            setOpen(false);
            command();
        },
        [setOpen]
    );

    /* ── Shared command list content ──────────────────────────────────── */
    const commandListContent = (
        <>
            <CommandEmpty className="py-24 flex flex-col items-center gap-5 text-muted-foreground/40">
                <div className="size-20 rounded-[28px] bg-muted/40 flex items-center justify-center ring-1 ring-border/5 shadow-inner">
                    <Search className="size-8 opacity-15" strokeWidth={1} />
                </div>
                <div className="text-center space-y-1.5">
                    <h3 className="text-[15px] font-bold tracking-tight text-foreground/70">No matching results</h3>
                    <p className="text-[12px] text-muted-foreground/30 font-medium">Try searching for a different keyword or app module</p>
                </div>
            </CommandEmpty>

            <div className="space-y-1.5">
                {/* Quick Access */}
                <CommandGroup heading="Quick Access" className="px-0! **:[[cmdk-group-heading]]:text-[11px]! **:[[cmdk-group-heading]]:font-black! **:[[cmdk-group-heading]]:uppercase! **:[[cmdk-group-heading]]:tracking-[0.18em]! **:[[cmdk-group-heading]]:text-primary/25! **:[[cmdk-group-heading]]:px-4! **:[[cmdk-group-heading]]:pb-3!">
                    {suggestions.map((item) => (
                        <CommandItem
                            key={item.href}
                            onSelect={() => runCommand(() => router.visit(item.href))}
                            className="h-13.5! px-4! py-0! rounded-[14px]! gap-4! data-[selected=true]:bg-primary! data-[selected=true]:text-primary-foreground! group/item cursor-pointer mb-1 last:mb-0 transition-all duration-200"
                        >
                            <div className="size-9.5 rounded-xl bg-muted/60 flex items-center justify-center text-primary/80 group-data-[selected=true]/item:bg-primary-foreground/20 group-data-[selected=true]/item:text-primary-foreground shrink-0 transition-all duration-300 shadow-sm ring-1 ring-border/10 group-data-[selected=true]/item:scale-105">
                                <item.icon className="size-4.5!" strokeWidth={2.5} />
                            </div>
                            <span className="text-[14px] font-bold tracking-tight flex-1">{item.title}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 group-data-[selected=true]/item:text-primary-foreground/40 transition-colors">{item.tag}</span>
                                <ArrowRight className="!size-4 opacity-0 -translate-x-2 group-data-[selected=true]/item:opacity-60 group-data-[selected=true]/item:translate-x-0 transition-all duration-300 ease-out" />
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <div className="px-4 my-4 opacity-50">
                    <div className="h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
                </div>

                {/* Modules */}
                <CommandGroup heading="System Modules" className="px-0! **:[[cmdk-group-heading]]:text-[11px]! **:[[cmdk-group-heading]]:font-black! **:[[cmdk-group-heading]]:uppercase! **:[[cmdk-group-heading]]:tracking-[0.18em]! **:[[cmdk-group-heading]]:text-primary/25! **:[[cmdk-group-heading]]:px-4! **:[[cmdk-group-heading]]:pb-3!">
                    {config.mainItems
                        .filter(item => !suggestionHrefs.includes(item.href))
                        .map((item) => {
                            const Icon = item.icon ?? FileText;
                            return (
                                <CommandItem
                                    key={item.href}
                                    onSelect={() => runCommand(() => router.visit(item.href))}
                                    className="h-12.5! px-4! py-0! rounded-[14px]! gap-4! data-[selected=true]:bg-primary! data-[selected=true]:text-primary-foreground! group/item cursor-pointer mb-1 last:mb-0 transition-all duration-200"
                                >
                                    <div className="size-9 rounded-xl bg-muted/60 flex items-center justify-center text-primary/80 group-data-[selected=true]/item:bg-primary-foreground/20 group-data-[selected=true]/item:text-primary-foreground shrink-0 transition-all duration-300 shadow-sm ring-1 ring-border/10 group-data-[selected=true]/item:scale-105">
                                        <Icon className="size-4.5!" strokeWidth={2} />
                                    </div>
                                    <span className="text-[14px] font-semibold tracking-tight flex-1">{item.title}</span>
                                    <ArrowRight className="size-4! opacity-0 -translate-x-2 group-data-[selected=true]/item:opacity-60 group-data-[selected=true]/item:translate-x-0 transition-all duration-300 ease-out" />
                                </CommandItem>
                            );
                        })}
                </CommandGroup>

                <div className="px-4 my-4 opacity-50">
                    <div className="h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
                </div>

                {/* Settings */}
                <CommandGroup heading="Configuration" className="px-0! **:[[cmdk-group-heading]]:text-[11px]! **:[[cmdk-group-heading]]:font-black! **:[[cmdk-group-heading]]:uppercase! **:[[cmdk-group-heading]]:tracking-[0.18em]! **:[[cmdk-group-heading]]:text-primary/25! **:[[cmdk-group-heading]]:px-4! **:[[cmdk-group-heading]]:pb-3!">
                    {settingsNav.flatMap(g => g.items).map((item) => {
                        const Icon = item.icon ?? Settings;
                        return (
                            <CommandItem
                                key={item.href}
                                onSelect={() => runCommand(() => router.visit(item.href))}
                                className="!h-12.5 !px-4 !py-0 !rounded-[14px] !gap-4 data-[selected=true]:!bg-primary data-[selected=true]:!text-primary-foreground group/item cursor-pointer mb-1 last:mb-0 transition-all duration-200"
                            >
                                <div className="size-9 rounded-xl bg-muted/60 flex items-center justify-center text-primary/80 group-data-[selected=true]/item:bg-primary-foreground/20 group-data-[selected=true]/item:text-primary-foreground shrink-0 transition-all duration-300 shadow-sm ring-1 ring-border/10 group-data-[selected=true]/item:scale-105">
                                    <Icon className="!size-4.5" strokeWidth={2} />
                                </div>
                                <span className="text-[14px] font-semibold tracking-tight flex-1">{item.title}</span>
                                <ArrowRight className="!size-4 opacity-0 -translate-x-2 group-data-[selected=true]/item:opacity-60 group-data-[selected=true]/item:translate-x-0 transition-all duration-300 ease-out" />
                            </CommandItem>
                        );
                    })}
                </CommandGroup>
            </div>
        </>
    );

    /* ── Search input (shared) ───────────────────────────────────────── */
    const searchInput = (
        <div className="px-5 pt-6 pb-4">
            <div className="relative group/search-container">
                <div className="absolute -inset-0.5 bg-linear-to-r from-primary/10 via-primary/5 to-transparent rounded-[20px] opacity-0 group-focus-within/search-container:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative flex items-center bg-muted/40 border border-border/30 rounded-[18px] h-14 px-4.5 gap-3 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus-within:bg-background focus-within:border-primary/45 focus-within:ring-4 focus-within:ring-primary/5">
                    <Search 
                        className="size-5 text-primary/70 group-focus-within/search-container:text-primary transition-colors duration-300 shrink-0" 
                        strokeWidth={2.5} 
                    />
                    <CommandInput
                        placeholder="What do you want to find?"
                        hideIcon={true}
                        wrapperClassName="flex-1! max-w-none! w-full!"
                        className="h-full! px-0! m-0! w-full! max-w-none! bg-transparent! border-none! ring-0! text-[15px]! font-bold placeholder:text-muted-foreground/30! shadow-none!"
                    />
                    <div className="flex items-center shrink-0 ml-3">
                        <div className="flex items-center justify-center h-6 min-w-9 px-2 rounded-lg bg-background/80 border border-border/20 shadow-sm backdrop-blur-sm group-focus-within/search-container:border-primary/20">
                            <span className="text-[9px] font-black text-muted-foreground/45 leading-none font-sans tracking-widest">ESC</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ── Footer (desktop only) ───────────────────────────────────────── */
    const footer = (
        <div className="flex items-center justify-between border-t border-border/5 px-7 py-5 bg-muted/5 backdrop-blur-md relative">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group/key transition-opacity hover:opacity-100 opacity-60">
                    <div className="flex items-center justify-center h-5 min-w-5 px-1 rounded shadow-sm bg-background border border-border/20 text-[10px] font-bold text-muted-foreground/60">↵</div>
                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Select</span>
                </div>
                <div className="flex items-center gap-2 group/key transition-opacity hover:opacity-100 opacity-60">
                    <div className="flex items-center justify-center h-5 min-w-5 px-1 rounded shadow-sm bg-background border border-border/20 text-[10px] font-bold text-muted-foreground/60">↑↓</div>
                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Navigate</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-primary/5 ring-1 ring-primary/10 shadow-[0_2px_10px_-4px_rgba(var(--primary),0.2)] transition-all hover:bg-primary/10 group/brand cursor-default">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
                <Zap className="size-3.5 text-primary/70 transition-transform duration-700 group-hover/brand:rotate-[30deg]" />
                <span className="text-[11px] font-black text-primary/70 uppercase tracking-[0.25em]">{appName}</span>
            </div>
        </div>
    );

    /* ── Mobile: Bottom Sheet ────────────────────────────────────────── */
    if (isMobile) {
        return (
            <Drawer.Root open={open} onOpenChange={setOpen}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-110 bg-black/60 backdrop-blur-md" />
                    <Drawer.Content className="fixed inset-x-0 bottom-0 z-110 flex flex-col rounded-t-3xl bg-background border-t border-border/50 shadow-2xl outline-none max-h-[92%] overflow-hidden">
                        <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30 mb-2" />
                        <Command className="flex flex-col flex-1 overflow-hidden min-h-0 bg-transparent">
                            {searchInput}
                            <CommandList className="flex-1 overflow-y-auto px-4 pb-4 pt-1 max-h-none">
                                {commandListContent}
                            </CommandList>
                        </Command>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    /* ── Desktop: Dialog ─────────────────────────────────────────────── */
    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
            className="md:max-w-[720px] rounded-[32px]! border-border/20 bg-background/95 backdrop-blur-3xl shadow-[0_48px_128px_-32px_rgba(0,0,0,0.35)] overflow-hidden p-0"
            showCloseButton={false}
        >
            <div className="flex flex-col h-full">
                {searchInput}
                <CommandList className="max-h-[480px] scrollbar-none px-4 pb-4 pt-1">
                    {commandListContent}
                </CommandList>
                {footer}
            </div>
        </CommandDialog>
    );
}
