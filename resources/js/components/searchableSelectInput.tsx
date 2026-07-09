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

interface SearchableSelectProps {
    options: { key: string; text: string; value: any }[];
    value?: any;
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    emptyText?: string;
    searchPlaceholder?: string;
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
    emptyText = "No results found",
    searchPlaceholder,
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
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
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
                    <span className="truncate">
                        {selectedOption ? selectedOption.text : placeholder}
                    </span>
                    <ChevronDown
                        className={cn(
                            "ml-2 size-4 shrink-0 opacity-50 transition-transform",
                            open && "rotate-180"
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                sideOffset={4}
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={resolvedSearchPlaceholder}
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        className="h-9 border-b rounded-none"
                    />
                    <CommandList className="max-h-[240px] overscroll-contain">
                        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                            {emptyText}
                        </CommandEmpty>
                        <CommandGroup className="p-1">
                            {filteredOptions.map((option) => {
                                const isSelected = String(option.value) === String(value);
                                return (
                                    <CommandItem
                                        key={option.key}
                                        value={String(option.value)}
                                        onSelect={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between rounded-md px-2 py-1.5 cursor-pointer",
                                            isSelected && "bg-primary/10 text-primary font-medium"
                                        )}
                                    >
                                        <span>{option.text}</span>
                                        {isSelected && <Check className="size-4 shrink-0 text-primary" />}
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
