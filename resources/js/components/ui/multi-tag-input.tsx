import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface MultiTagInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  maxTags?: number;
  predefinedTags?: string[];
  className?: string;
  onBlur?: (e: any) => void;
}

export function MultiTagInput({
  value = [],
  onChange,
  placeholder = "Add tag...",
  disabled = false,
  error = false,
  maxTags = 3,
  predefinedTags = ["New", "Latest", "Upcoming", "Urgent", "Event", "Notice"],
  className,
  onBlur,
}: MultiTagInputProps) {
  const [tags, setTags] = React.useState<string[]>(value || []);
  const [customTag, setCustomTag] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Sync with external value changes
  React.useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(tags)) {
      setTags(value || []);
    }
  }, [value]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      const updated = [...tags, trimmedTag];
      setTags(updated);
      onChange(updated);
      setCustomTag("");
      setIsOpen(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove);
    setTags(updated);
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(customTag);
    }
  };

  const availablePredefinedTags = predefinedTags.filter(
    (tag) => !tags.includes(tag)
  );

  return (
    <div className={cn("space-y-2", className)}>
      {/* Display Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="pl-2.5 pr-1 py-1 text-[12px] font-bold border border-border/50 transition-colors"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTag(tag)}
                disabled={disabled}
                className="h-4 w-4 ml-1.5 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add Tag Button */}
      {tags.length < maxTags && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onBlur={onBlur}
              className={cn(
                "w-full h-11 justify-start text-[14px] text-muted-foreground bg-background border-input rounded-lg hover:bg-accent transition-all shadow-none",
                error && "border-destructive focus-visible:ring-destructive/10"
              )}
            >
              <Plus className="h-4 w-4 mr-2 text-primary" />
              {placeholder}
              <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground/50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 space-y-3">
              {/* Custom Tag Input */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Custom Tag
                </p>
                <div className="flex gap-2">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type custom tag..."
                    className="h-8 text-sm"
                    maxLength={20}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addTag(customTag)}
                    disabled={!customTag.trim()}
                    className="h-8 px-3"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Predefined Tags */}
              {availablePredefinedTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Quick Select
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availablePredefinedTags.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(tag)}
                        className="h-7 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Tag count */}
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
        {tags.length} / {maxTags} tags
      </p>
    </div>
  );
}
