import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import Each from "./Each";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronsUpDown, Check, X } from "lucide-react";
import { FieldError } from "@/components/ui/field-error";

export function MultiSelectField({
  options,
  value,
  onChange,
  disabled,
  placeholder,
  valueKey,
  error,
  className,
}: any) {
  const [selectedItems, setSelectedItems] = useState<any[]>(value || []);

  // keep internal state synced with external value
  useEffect(() => {
    setSelectedItems(value || []);
  }, [value]);

  // Helper to check if an item is selected (supports object values via valueKey)
  const isSelected = (itemValue: any) => {
    if (valueKey) {
      return selectedItems.some((v) => v?.[valueKey] === itemValue?.[valueKey]);
    }
    return selectedItems.includes(itemValue);
  };

  // Helper to get display key for an item
  const getItemKey = (itemValue: any) => {
    if (valueKey && typeof itemValue === "object") {
      return String(itemValue?.[valueKey]);
    }
    return typeof itemValue === "object"
      ? JSON.stringify(itemValue)
      : String(itemValue);
  };

  const toggleItem = (itemValue: any) => {
    let newSelected: any[];
    if (isSelected(itemValue)) {
      if (valueKey) {
        newSelected = selectedItems.filter(
          (v) => v?.[valueKey] !== itemValue?.[valueKey],
        );
      } else {
        newSelected = selectedItems.filter((v) => v !== itemValue);
      }
    } else {
      newSelected = [...selectedItems, itemValue];
    }
    setSelectedItems(newSelected);
    onChange(newSelected);
  };

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dropdownSearch, setDropdownSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // When popover opens, sync dropdown search from trigger input; when typing in dropdown, filter
  const searchTerm = open ? dropdownSearch : inputValue;
  const filteredOptions = useMemo(() => {
    // Filter out already selected items from the dropdown
    const availableOptions = options.filter((option: any) => !isSelected(option.value));

    if (!searchTerm.trim()) return availableOptions;
    return availableOptions.filter((option: any) =>
      (option.text || option.value)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, selectedItems, isSelected]);

  const handleSelect = (itemValue: any) => {
    toggleItem(itemValue);
    setInputValue("");
    setDropdownSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setDropdownSearch("");
    } else {
      setDropdownSearch(inputValue);
    }
  };

  const handleRemove = (e: React.MouseEvent, val: any) => {
    e.stopPropagation();
    toggleItem(val);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-invalid={!!error}
          className={cn(
            "relative z-10 flex items-center min-h-10 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background shadow-none transition-all cursor-text",
            "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
            disabled && "cursor-not-allowed opacity-50 select-none pointer-events-none",
            className,
            error && "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive",
          )}
          onClick={() => {
            if (!disabled) {
              setOpen(true);
              inputRef.current?.focus();
            }
          }}
        >
          <div className="flex flex-wrap flex-1 items-center gap-1.5 overflow-hidden">
            <Each
              of={selectedItems}
              render={(val: any) => {
                const option = valueKey
                  ? options.find((o: any) => o.value?.[valueKey] === val?.[valueKey])
                  : options.find((o: any) => o.value === val);

                return (
                  <Badge
                    key={getItemKey(val)}
                    variant="secondary"
                    className="pl-2 pr-1 py-0 h-6 flex items-center gap-1 bg-blue-50/50 text-blue-600 border border-blue-200 hover:bg-blue-100/50 transition-colors rounded-md shadow-sm shrink-0"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-tight truncate max-w-[120px]">
                      {option?.text || getItemKey(val)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleRemove(e, val)}
                      className="size-4 p-0 flex items-center justify-center hover:bg-blue-200/50 rounded-full transition-colors text-blue-400 hover:text-blue-600 h-4 w-4"
                    >
                      <X className="size-3" strokeWidth={3} />
                    </Button>
                  </Badge>
                );
              }}
            />

            <input
              ref={inputRef}
              type="text"
              className={cn(
                "flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-sm min-w-[50px]",
                disabled && "cursor-not-allowed"
              )}
              placeholder={selectedItems.length === 0 ? (placeholder || "Select options...") : ""}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (!open) setOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !inputValue && selectedItems.length > 0) {
                  const newSelected = selectedItems.slice(0, -1);
                  setSelectedItems(newSelected);
                  onChange(newSelected);
                }
              }}
              disabled={disabled}
            />
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      {error && <FieldError message={error} />}
      <PopoverContent
        className="z-[200] min-w-[var(--radix-popover-trigger-width)] p-0 border-none shadow-lg"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command className="w-full" shouldFilter={false}>
          <div className="flex h-9 items-center gap-2 border-b border-border px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              value={dropdownSearch}
              onChange={(e) => setDropdownSearch(e.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <CommandList className="max-h-[250px] overflow-y-auto custom-scrollbar">
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              No results found
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option: any) => {
                const selected = isSelected(option.value);
                return (
                  <CommandItem
                    key={option.key}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-sm",
                      selected
                        ? "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "size-5 rounded border flex items-center justify-center transition-all",
                      selected
                        ? "bg-blue-600 border-blue-600 shadow-sm"
                        : "border-muted-foreground/30 bg-background"
                    )}>
                      {selected && <Check className="size-3.5 text-white" strokeWidth={4} />}
                    </div>
                    <span>{option.text || option.value}</span>
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
