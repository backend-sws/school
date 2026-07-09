import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import type { AsyncSelectConfig } from "@/types";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { useForm, FormProvider } from "react-hook-form";
import { ControlledFormComponent } from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { motion } from "framer-motion";

// ============================================================================
// Types
// ============================================================================

export interface FilterOption {
    value: string;
    label: string;
}

/** Single filter field config — mirrors ControlledFormComponent props */
export interface FilterFieldConfig {
    name: string;
    type: string;                // FORM_TYPE constant: "select", "async_select", "date", etc.
    label: string;
    placeholder?: string;
    tooltip?: string;
    options?: any[];             // FieldOption[] or FilterOption[] — both work
    asyncConfig?: AsyncSelectConfig;
    searchable?: boolean;
    className?: string;
    disabled?: boolean;
}

/** Top-level filter bar config */
export interface FilterBarConfig {
    filters: FilterFieldConfig[];
    search?: { name: string; placeholder?: string; tooltip?: string };
    searchGroup?: {
        selectName: string;
        searchName: string;
        options: FilterOption[];
        placeholder?: string;
        tooltip?: string;
    };
}

// ============================================================================
// Context
// ============================================================================

interface FilterBarContextValue {
    values: Record<string, any>;
    onChange: (key: string, value: any) => void;
    control?: any;
    mode: "bar" | "sidebar";
}

const FilterBarContext = React.createContext<FilterBarContextValue | null>(null);

const useFilterBar = () => {
    const context = React.useContext(FilterBarContext);
    if (!context) throw new Error("FilterBar components must be used within a FilterBar");
    return context;
};

// ============================================================================
// Search (immediate, non-buffered — stays custom)
// ============================================================================

function SearchInput({ name, placeholder = "Search...", tooltip }: { name: string; placeholder?: string; tooltip?: string }) {
    const { values, onChange, mode } = useFilterBar();
    const [isFocused, setIsFocused] = React.useState(false);

    if (mode === "sidebar") return null;

    const input = (
        <motion.div
            animate={{ width: isFocused ? 320 : 240, scale: isFocused ? 1.02 : 1 }}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative group hidden sm:block"
        >
            <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 size-4 transition-colors pointer-events-none z-10",
                isFocused ? "text-primary" : "text-muted-foreground/40"
            )} />
            <input
                placeholder={placeholder}
                value={values[name] || ""}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => onChange(name, e.target.value)}
                className="flex h-10 w-full pl-9 pr-3 py-1 text-sm bg-transparent border-none placeholder:text-muted-foreground/30 font-medium transition-all focus-visible:outline-none focus:ring-0"
            />
        </motion.div>
    );

    if (tooltip) return <TooltipWrapper content={tooltip} side="top">{input}</TooltipWrapper>;
    return input;
}

function MobileSearchInput({ name, placeholder }: { name: string; placeholder?: string }) {
    const { values, onChange } = useFilterBar();
    return (
        <div className="relative w-full sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
            <input
                placeholder={placeholder}
                value={values[name] || ""}
                onChange={(e) => onChange(name, e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border/50 bg-muted/10 pl-9 pr-3 py-1 text-sm focus-visible:outline-none"
            />
        </div>
    );
}

// ============================================================================
// SearchGroup (immediate, non-buffered — stays custom)
// ============================================================================

function SearchGroupInput({ selectName, searchName, options, placeholder, tooltip }: {
    selectName: string;
    searchName: string;
    options: FilterOption[];
    placeholder?: string;
    tooltip?: string;
}) {
    const { values, onChange, mode } = useFilterBar();
    const [isFocused, setIsFocused] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const mobileInputRef = React.useRef<HTMLInputElement>(null);

    if (mode === "sidebar") return null;

    const selectedOption = options.find((opt) => opt.value === values[selectName]?.toString());
    const dynamicPlaceholder = placeholder || (selectedOption ? `Search by ${selectedOption.label.toLowerCase()}...` : "Search...");

    const combined = (
        <motion.div
            animate={{ scale: isFocused ? 1.01 : 1 }}
            className={cn(
                "flex w-full min-w-0 items-stretch overflow-hidden transition-all duration-300 sm:w-auto sm:min-w-[340px] rounded-xl border border-border/50 bg-muted/10"
            )}
        >
            <Select value={values[selectName]?.toString() || ""} onValueChange={(v) => onChange(selectName, v)}>
                <SelectTrigger className="h-10 w-auto sm:w-32 shrink-0 rounded-none border-0 px-2 sm:px-3 transition-colors focus:ring-0 focus:ring-offset-0 font-bold text-[10px] uppercase tracking-widest text-primary/70 bg-muted/10 border-r border-border/20">
                    <Search className="hidden sm:block size-3.5 shrink-0 text-primary opacity-60" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl">
                    <Each
                        of={options ?? []}
                        render={(option) => (
                            <SelectItem value={option.value || "all"} className="text-xs font-bold rounded-lg m-1">
                                {option.label}
                            </SelectItem>
                        )}
                        keyExtractor={(option) => option.value}
                    />
                </SelectContent>
            </Select>
            <div className="relative min-w-0 flex-1">
                <input
                    placeholder={dynamicPlaceholder}
                    value={values[searchName] || ""}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => onChange(searchName, e.target.value)}
                    className="h-10 w-full rounded-none border-0 bg-transparent px-4 py-1 text-sm placeholder:text-muted-foreground/30 focus:outline-none focus:ring-0 font-medium"
                />
            </div>
        </motion.div>
    );

    if (tooltip) {
        return <TooltipWrapper content={tooltip} side="top" className="w-full sm:w-auto">{combined}</TooltipWrapper>;
    }
    return combined;
}

// ============================================================================
// FilterRenderer — renders sidebar filters via ControlledFormComponent
// ============================================================================

export function FilterRenderer({ config }: { config: FilterBarConfig }) {
    const { mode, control } = useFilterBar();

    // Search & SearchGroup are immediate (bar-only), rendered outside the sidebar
    const searchEl = config.search && (
        <>
            <SearchInput {...config.search} />
            <MobileSearchInput {...config.search} />
        </>
    );
    const searchGroupEl = config.searchGroup && <SearchGroupInput {...config.searchGroup} />;

    if (mode === "bar") {
        return (
            <>
                {searchEl}
                <div className="flex items-center gap-1 ml-auto">
                    {searchGroupEl}
                </div>
            </>
        );
    }

    // Sidebar mode — render all filter fields via ControlledFormComponent
    return (
        <div className="flex flex-col gap-3">
            <Each
                of={config.filters}
                render={(field) => (
                    <ControlledFormComponent
                        control={control}
                        name={field.name}
                        type={field.type}
                        label={field.label}
                        placeholder={field.placeholder}
                        tooltip={field.tooltip}
                        options={field.options}
                        asyncConfig={field.asyncConfig}
                        searchable={field.searchable}
                        disabled={field.disabled}
                        className={field.className}
                    />
                )}
                keyExtractor={(f) => f.name}
            />
        </div>
    );
}

// ============================================================================
// Backward-compatible sub-components
// These allow existing pages to keep using FilterBar.Search, FilterBar.Select,
// FilterBar.Date, FilterBar.Left, FilterBar.Right, FilterBar.Group unchanged.
// ============================================================================

interface FilterBarSearchProps {
    name: string;
    placeholder?: string;
    tooltip?: string;
    label?: string;
    className?: string;
}

function FilterBarSearch({ name, placeholder = "Search...", tooltip, className }: FilterBarSearchProps) {
    const { values, onChange, mode } = useFilterBar();
    const [isFocused, setIsFocused] = React.useState(false);

    if (mode === "sidebar") return null;

    const input = (
        <motion.div
            animate={{ scale: isFocused ? 1.01 : 1 }}
            className="flex w-full sm:max-w-[320px] min-w-0 items-center overflow-hidden rounded-xl border border-border/50 bg-muted/10 group focus-within:ring-2 focus-within:ring-primary/10 transition-all"
        >
            <div className="flex items-center justify-center px-3 shrink-0 h-10">
                <Search className={cn("size-3.5 transition-colors", isFocused ? "text-primary" : "text-primary/40")} />
            </div>
            <input
                placeholder={placeholder}
                value={values[name] || ""}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => onChange(name, e.target.value)}
                className={cn("h-10 w-full rounded-none border-0 bg-transparent px-4 py-1 text-sm placeholder:text-muted-foreground/30 focus:outline-none focus:ring-0 font-medium", className)}
            />
        </motion.div>
    );

    if (tooltip) return <TooltipWrapper content={tooltip} side="top">{input}</TooltipWrapper>;
    return input;
}

interface FilterBarSelectProps {
    name: string;
    label?: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
    tooltip?: string;
    className?: string;
}

function FilterBarSelect({ name, label, placeholder, options = [], tooltip, className }: FilterBarSelectProps) {
    const { values, onChange, mode } = useFilterBar();

    if (mode === "sidebar") {
        return (
            <div className="space-y-2">
                {label && <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{label}</label>}
                <Select value={values[name]?.toString() || ""} onValueChange={(v) => onChange(name, v)}>
                    <SelectTrigger className="h-10 rounded-xl border-border/50">
                        <SelectValue placeholder={placeholder || label || "Select"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <Each
                            of={options}
                            render={(opt) => (
                                <SelectItem value={opt.value} className="rounded-lg m-1">{opt.label}</SelectItem>
                            )}
                            keyExtractor={(opt) => opt.value}
                        />
                    </SelectContent>
                </Select>
            </div>
        );
    }

    const select = (
        <Select value={values[name]?.toString() || ""} onValueChange={(v) => onChange(name, v)}>
            <SelectTrigger className={cn("h-10 w-auto min-w-[120px] rounded-xl border-border/50 bg-muted/10 text-xs font-bold uppercase tracking-widest", className)}>
                <SelectValue placeholder={placeholder || label || "Select"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl">
                <Each
                    of={options}
                    render={(opt) => (
                        <SelectItem value={opt.value} className="text-xs font-bold rounded-lg m-1">{opt.label}</SelectItem>
                    )}
                    keyExtractor={(opt) => opt.value}
                />
            </SelectContent>
        </Select>
    );

    if (tooltip) return <TooltipWrapper content={tooltip} side="top">{select}</TooltipWrapper>;
    return select;
}

interface FilterBarDateProps {
    name: string;
    label?: string;
    tooltip?: string;
}

function FilterBarDate({ name, label, tooltip }: FilterBarDateProps) {
    const { values, onChange, mode } = useFilterBar();

    if (mode === "sidebar") {
        return (
            <div className="space-y-2">
                {label && <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{label}</label>}
                <input
                    type="date"
                    value={values[name] || ""}
                    onChange={(e) => onChange(name, e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border/50 bg-muted/10 px-3 py-1 text-sm focus-visible:outline-none focus:ring-0"
                />
            </div>
        );
    }

    const date = (
        <input
            type="date"
            value={values[name] || ""}
            onChange={(e) => onChange(name, e.target.value)}
            className="flex h-10 w-auto rounded-xl border border-border/50 bg-muted/10 px-3 py-1 text-sm focus-visible:outline-none focus:ring-0"
        />
    );

    if (tooltip) return <TooltipWrapper content={tooltip} side="top">{date}</TooltipWrapper>;
    return date;
}

function FilterBarLeft({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center gap-2 flex-1 min-w-0">{children}</div>;
}

function FilterBarRight({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center gap-2 ml-auto shrink-0">{children}</div>;
}

function FilterBarGroup({ children }: { children: React.ReactNode }) {
    const { mode } = useFilterBar();
    return <div className={cn("flex items-center gap-2", mode === "sidebar" && "flex-col items-stretch gap-3")}>{children}</div>;
}

// ============================================================================
// FilterBar — main container
// ============================================================================

interface FilterBarProps {
    id?: string;
    children: React.ReactNode;
    values: Record<string, any>;
    onChange: (updates: Record<string, any>) => void;
    className?: string;
    /** Show the Filter sidebar button. Defaults to true only when FilterBar.Renderer is used. */
    showFilterButton?: boolean;
}

export const FilterBar = ({ id, children, values, onChange, className, showFilterButton }: FilterBarProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Auto-detect if Renderer is used by scanning children
    const hasRenderer = React.useMemo(() => {
        let found = false;
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && (child.type as any) === FilterRenderer) found = true;
        });
        return found;
    }, [children]);

    const shouldShowFilter = showFilterButton ?? hasRenderer;

    const sidebarMethods = useForm({ defaultValues: values, mode: "onChange" });
    const { control: sidebarControl, reset: resetSidebar, handleSubmit } = sidebarMethods;

    // Sync sidebar form when it opens or parent values change
    React.useEffect(() => {
        if (isSidebarOpen) resetSidebar(values);
    }, [values, isSidebarOpen, resetSidebar]);

    const onApply = (data: Record<string, any>) => {
        onChange(data);
        setIsSidebarOpen(false);
    };

    const handleReset = () => {
        const cleared: Record<string, any> = {};
        Object.keys(values).forEach((k) => (cleared[k] = ""));
        onChange(cleared);
        resetSidebar(cleared);
        setIsSidebarOpen(false);
    };

    const barCtx: FilterBarContextValue = {
        values,
        onChange: (key, value) => onChange({ ...values, [key]: value }),
        mode: "bar",
    };

    const sidebarCtx: FilterBarContextValue = {
        values: sidebarMethods.watch(),
        onChange: (key, val) => sidebarMethods.setValue(key, val),
        control: sidebarControl,
        mode: "sidebar",
    };

    const activeCount = Object.keys(values).filter((k) =>
        !["search_text", "search", "query", "q", "search_by", "search_mode", "searchType"].includes(k) &&
        values[k] !== "" && values[k] !== undefined && values[k] !== null && values[k] !== "all"
    ).length;

    return (
        <FilterBarContext.Provider value={barCtx}>
            <motion.div
                id={id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex items-center gap-3 w-full", className)}
            >
                {/* Spacer to push everything right */}
                <div className="flex-1" />

                {/* Search bar + immediate filters */}
                {children}

                {/* Sidebar trigger — only when needed */}
                {shouldShowFilter && (
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-10 rounded-xl border-border/50 bg-muted/10 hover:bg-muted/30 transition-all flex items-center gap-2 font-bold text-xs text-muted-foreground px-2.5 sm:px-4"
                            >
                                <SlidersHorizontal className="size-4 text-muted-foreground/60" />
                                <span className="hidden sm:inline">Filter</span>
                                {activeCount > 0 && (
                                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-black">
                                        {activeCount}
                                    </span>
                                )}
                                <ChevronDown className={cn("hidden sm:block size-3.5 opacity-40 transition-transform", isSidebarOpen && "rotate-180")} />
                            </Button>
                        </SheetTrigger>

                        <SheetContent className="flex flex-col h-full bg-background border-l border-border/20 w-full sm:max-w-md p-0">
                            <SheetHeader className="px-6 py-4 border-b border-border">
                                <SheetTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Filters</SheetTitle>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <FilterBarContext.Provider value={sidebarCtx}>
                                    <FormProvider {...sidebarMethods}>
                                        <form id="sidebar-filter-form" onSubmit={handleSubmit(onApply)} className="space-y-0">
                                            {children}
                                        </form>
                                    </FormProvider>
                                </FilterBarContext.Provider>
                            </div>

                            <SheetFooter className="p-6 border-t border-border flex flex-row gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 rounded-xl h-11 font-bold text-xs uppercase tracking-widest text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5"
                                    onClick={handleReset}
                                >
                                    <X className="size-4 mr-2" />
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    form="sidebar-filter-form"
                                    className="flex-1 rounded-xl h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                                >
                                    Apply Filters
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                )}
            </motion.div>
        </FilterBarContext.Provider>
    );
};

// Attach sub-components
FilterBar.Renderer = FilterRenderer;
FilterBar.Search = FilterBarSearch;
FilterBar.Select = FilterBarSelect;
FilterBar.Date = FilterBarDate;
FilterBar.Left = FilterBarLeft;
FilterBar.Right = FilterBarRight;
FilterBar.Group = FilterBarGroup;
