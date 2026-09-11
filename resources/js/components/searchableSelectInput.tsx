import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export interface SearchableSelectOption {
    key: string;
    text: string;
    value: any;
    triggerText?: string;
    label?: React.ReactNode;
    subtext?: React.ReactNode;
    [key: string]: any;
}

interface SearchableSelectProps {
    options: SearchableSelectOption[];
    value?: any;
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    popoverClassName?: string;
    emptyText?: string;
    searchPlaceholder?: string;
    listMaxHeight?: string;
    renderOption?: (option: SearchableSelectOption, isSelected: boolean) => React.ReactNode;
    renderTrigger?: (selectedOption?: SearchableSelectOption) => React.ReactNode;
}

/** Detects if options look like years (all numeric, 4 digits) for smarter placeholder */
function isYearOptions(options: { value: any }[]): boolean {
    if (options.length === 0) return false;
    const sample = options.slice(0, 3);
    return sample.every(
        (o) => typeof o.value === "number" && o.value >= 1900 && o.value <= 2100
    );
}

export function SearchableSelectField({
    options = [],
    value,
    onChange,
    placeholder = "Select option...",
    disabled,
    className,
    popoverClassName,
    emptyText = "No results found",
    searchPlaceholder,
    listMaxHeight = "max-h-[260px]",
    renderOption,
    renderTrigger,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const resolvedSearchPlaceholder =
        searchPlaceholder ?? (isYearOptions(options) ? "Type year..." : "Search...");

    const selectedOption = React.useMemo(
        () => options.find((o) => String(o.value) === String(value)),
        [options, value]
    );

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery.trim()) return options;
        const query = searchQuery.toLowerCase();
        return options.filter(
            (o) =>
                String(o.text).toLowerCase().includes(query) ||
                String(o.value).toLowerCase().includes(query)
        );
    }, [options, searchQuery]);

    React.useEffect(() => {
        if (!open) setSearchQuery("");
    }, [open]);

    return (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between font-normal h-10 px-3 shadow-none border-input",
                        "hover:bg-accent/50 focus-visible:ring-ring/50 focus-visible:ring-2",
                        !selectedOption && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate text-left flex-1">
                        {renderTrigger
                            ? renderTrigger(selectedOption)
                            : selectedOption
                            ? (selectedOption.triggerText ?? selectedOption.text)
                            : placeholder}
                    </span>
                    <ChevronDown
                        className={cn(
                            "ml-2 size-3.5 shrink-0 opacity-50 transition-transform",
                            open && "rotate-180"
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    "p-0 z-[1200]",
                    popoverClassName || "w-[var(--radix-popover-trigger-width)] min-w-[260px]"
                )}
                align="start"
                sideOffset={4}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Command shouldFilter={false} className="w-full">
                    <CommandInput
                        placeholder={resolvedSearchPlaceholder}
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        wrapperClassName="h-9 px-3 gap-2"
                        className="py-1 text-xs"
                    />
                    <CommandList
                        className={cn(
                            "overflow-y-auto overscroll-contain custom-scrollbar",
                            listMaxHeight
                        )}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                            {emptyText}
                        </CommandEmpty>
                        <CommandGroup className="p-1">
                            {filteredOptions.map((option) => {
                                const isSelected = String(option.value) === String(value);
                                return (
                                    <CommandItem
                                        key={option.key}
                                        value={String(option.key || option.text || option.value)}
                                        onSelect={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                        onClick={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-start justify-between rounded-md px-2.5 py-2 cursor-pointer text-xs gap-2",
                                            isSelected && "bg-primary/10 text-primary font-medium"
                                        )}
                                    >
                                        <div className="flex flex-col flex-1 min-w-0">
                                            {renderOption ? (
                                                renderOption(option, isSelected)
                                            ) : option.label ? (
                                                <>
                                                    <div className="min-w-0">{option.label}</div>
                                                    {option.subtext}
                                                </>
                                            ) : (
                                                <>
                                                    <span className={cn("text-xs leading-normal", !option.subtext && "truncate")}>
                                                        {option.text}
                                                    </span>
                                                    {option.subtext}
                                                </>
                                            )}
                                        </div>
                                        {isSelected && <Check className="size-3.5 shrink-0 text-primary mt-0.5" />}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
