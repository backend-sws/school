import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface SmartComboboxProps {
    options: { key: string; text: string; value: any }[];
    value?: any;
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
    emptyText?: string;
    editable?: boolean;
    onBlur?: (e: any) => void;
    variant?: "default" | "premium";
    icon?: React.ReactNode;
    label?: string;
}

export function SmartCombobox({
    options = [],
    value,
    onChange,
    placeholder = "Select or type...",
    disabled,
    className,
    error,
    emptyText = "No results found",
    editable = true,
    onBlur,
    variant = "default",
    icon,
    label,
}: SmartComboboxProps) {
    const isPremium = variant === "premium";
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    // Sync inputValue with value prop
    React.useEffect(() => {
        const selectedOption = options.find((o) => String(o.value) === String(value));
        if (selectedOption) {
            setInputValue(String(selectedOption.text));
        } else {
            setInputValue(value != null ? String(value) : "");
        }
    }, [value, options]);

    const filteredOptions = React.useMemo(() => {
        if (!inputValue.trim()) return options;
        const query = inputValue.toLowerCase();
        return options.filter(
            (o) =>
                String(o.text).toLowerCase().includes(query) ||
                String(o.value).toLowerCase().includes(query)
        );
    }, [options, inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        if (!open) setOpen(true);

        // If editable, update parent state immediately or on blur?
        // Usually for forms, we want to update state so validation etc. works.
        if (editable) {
            onChange(val);
        }
    };

    const handleSelect = (option: { text: string; value: any }) => {
        onChange(option.value);
        setInputValue(String(option.text));
        setOpen(false);
    };

    const clearValue = () => {
        onChange("");
        setInputValue("");
        setOpen(false);
    };

    return (
        <div className={cn("relative w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className={cn(
                        "relative w-full group",
                        isPremium ? "flex flex-col px-3 py-1 rounded-xl hover:bg-muted/10 h-10 min-w-[140px] justify-center transition-all bg-transparent" : ""
                    )}>
                        {isPremium && (
                            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-0.5">
                                {icon}
                                {label || placeholder}
                            </span>
                        )}
                        <input
                            disabled={disabled}
                            placeholder={isPremium ? "" : placeholder}
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={() => setOpen(true)}
                            onBlur={onBlur}
                            className={cn(
                                "flex w-full transition-all focus-visible:outline-none font-medium text-xs bg-transparent border-none p-0 text-foreground/90 h-auto placeholder:text-muted-foreground/30",
                                !isPremium && "h-10 px-4 pr-10 rounded-xl border border-border/50 bg-muted/5 placeholder:text-muted-foreground/40 focus:border-primary",
                                open && !isPremium && "border-primary"
                            )}
                        />
                        {!isPremium && (
                            <div className="absolute right-2 top-3 flex items-center gap-1">
                                {inputValue && !disabled && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearValue}
                                        className="p-1 h-6 w-6 hover:bg-accent rounded-full text-muted-foreground/50 hover:text-foreground transition-colors"
                                    >
                                        <X className="size-3" />
                                    </Button>
                                )}
                                <ChevronDown
                                    className={cn(
                                        "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
                                        open && "rotate-180"
                                    )}
                                />
                            </div>
                        )}
                        {isPremium && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <ChevronDown className={cn("size-3.5 opacity-40 shrink-0", open && "rotate-180 transition-transform")} />
                            </div>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 border border-primary/10 max-h-[var(--radix-popover-content-available-height)] overflow-hidden flex flex-col"
                    align="start"
                    sideOffset={5}
                    onOpenAutoFocus={(e) => e.preventDefault()} // Keep focus on input
                    disablePortal={true}
                >
                    <Command shouldFilter={false} className="bg-popover flex-1 flex flex-col overflow-hidden">
                        <CommandList className="max-h-[240px] overflow-y-auto overscroll-contain">
                            {filteredOptions.length === 0 ? (
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                    {emptyText}
                                </CommandEmpty>
                            ) : (
                                <CommandGroup className="p-1">
                                    {filteredOptions.map((option) => {
                                        const isSelected = String(option.value) === String(value);
                                        return (
                                            <CommandItem
                                                key={option.key}
                                                value={String(option.value)}
                                                onSelect={() => handleSelect(option)}
                                                className={cn(
                                                    "flex items-center justify-between rounded-md px-2 py-2 cursor-pointer transition-colors",
                                                    isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"
                                                )}
                                            >
                                                <span className="truncate">{option.text}</span>
                                                {isSelected && <Check className="size-4 shrink-0 text-primary animate-in zoom-in-50 duration-200" />}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
