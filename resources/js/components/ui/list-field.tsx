

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";

interface ListFieldProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  maxItems?: number;
  className?: string;
  onBlur?: (e: any) => void;
}

export function ListField({
  value = [],
  onChange,
  placeholder = "Enter item...",
  disabled = false,
  error = false,
  maxItems = 10,
  className,
  onBlur,
}: ListFieldProps) {
  const [items, setItems] = React.useState<string[]>(value || []);
  const [newItem, setNewItem] = React.useState("");

  // Sync with external value changes
  React.useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(items)) {
      setItems(value || []);
    }
  }, [value]);

  const handleAddItem = () => {
    if (newItem.trim() && items.length < maxItems) {
      const updated = [...items, newItem.trim()];
      setItems(updated);
      onChange(updated);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange(updated);
  };

  const handleUpdateItem = (index: number, newValue: string) => {
    const updated = items.map((item, i) => (i === index ? newValue : item));
    setItems(updated);
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Existing items */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 group",
                "bg-accent/30 rounded-lg px-3 py-2",
                "border border-border/50 hover:border-border transition-all duration-300"
              )}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              <Input
                value={item}
                onChange={(e) => handleUpdateItem(index, e.target.value)}
                disabled={disabled}
                onBlur={onBlur}
                className="flex-1 border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={placeholder}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
                disabled={disabled}
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 rounded-md"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add new item */}
      {items.length < maxItems && (
        <div className="flex items-center gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 h-11 border-input bg-background focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary shadow-none",
              error && "border-destructive focus-visible:ring-destructive/10"
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddItem}
            disabled={disabled || !newItem.trim()}
            className="h-11 w-11 shrink-0 border-input hover:bg-accent hover:text-accent-foreground hover:border-primary/20 transition-all shadow-none"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Item count */}
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
        {items.length} / {maxItems} items
      </p>
    </div>
  );
}
