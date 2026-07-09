import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Pipette } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field-error";

// ── Preset color palette (curated for ID cards / branding) ──────────────────
const PRESET_COLORS = [
    // Row 1: Dark tones
    "#1a237e", "#0d47a1", "#01579b", "#006064", "#004d40",
    "#1b5e20", "#33691e", "#827717", "#f57f17", "#e65100",
    "#bf360c", "#b71c1c", "#880e4f", "#4a148c", "#311b92",
    // Row 2: Mid tones
    "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688",
    "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107",
    "#ff9800", "#ff5722", "#e91e63", "#9c27b0", "#673ab7",
    // Row 3: Light tones
    "#7986cb", "#64b5f6", "#4fc3f7", "#4dd0e1", "#4db6ac",
    "#81c784", "#aed581", "#dce775", "#fff176", "#ffd54f",
    "#ffb74d", "#ff8a65", "#f06292", "#ba68c8", "#9575cd",
    // Row 4: Neutrals
    "#000000", "#212121", "#424242", "#616161", "#757575",
    "#9e9e9e", "#bdbdbd", "#e0e0e0", "#eeeeee", "#ffffff",
];

interface ColorPickerFieldProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: (e: any) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export function ColorPickerField({
    value = "",
    onChange,
    onBlur,
    placeholder = "#000000",
    disabled,
    error,
    className,
}: ColorPickerFieldProps) {
    const [open, setOpen] = useState(false);
    const nativeInputRef = useRef<HTMLInputElement>(null);
    const currentColor = value || placeholder;

    const handleHexInput = useCallback(
        (raw: string) => {
            // Allow typing with or without #
            let hex = raw.startsWith("#") ? raw : `#${raw}`;
            // Only allow valid hex chars
            hex = hex.replace(/[^#0-9a-fA-F]/g, "").slice(0, 7);
            onChange(hex);
        },
        [onChange]
    );

    const handlePresetClick = useCallback(
        (color: string) => {
            onChange(color);
            setOpen(false);
        },
        [onChange]
    );

    const handleNativePickerChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
        },
        [onChange]
    );

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                    <button
                        type="button"
                        className={cn(
                            "group flex items-center gap-3 w-full h-11 px-3 rounded-md border border-input bg-background",
                            "transition-all duration-200 text-left",
                            "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-destructive focus-visible:ring-destructive/20",
                            className
                        )}
                        onBlur={onBlur}
                    >
                        {/* Color swatch */}
                        <div
                            className="size-6 rounded-md border border-border/80 shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-110"
                            style={{ backgroundColor: currentColor }}
                        />
                        {/* Hex value */}
                        <span
                            className={cn(
                                "flex-1 text-sm font-mono tracking-wide truncate",
                                value ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {value || placeholder}
                        </span>
                        {/* Pipette icon */}
                        <Pipette className="size-4 text-muted-foreground/60 shrink-0 group-hover:text-primary transition-colors" />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[320px] p-0 rounded-xl shadow-xl border-border/50"
                    align="start"
                    sideOffset={8}
                >
                    {/* Live preview bar */}
                    <div
                        className="h-12 rounded-t-xl transition-colors duration-300 flex items-center justify-center"
                        style={{ backgroundColor: currentColor }}
                    >
                        <span
                            className="text-xs font-bold uppercase tracking-widest drop-shadow-sm"
                            style={{
                                color: isLightColor(currentColor) ? "#000" : "#fff",
                            }}
                        >
                            {value || placeholder}
                        </span>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Hex input + native picker */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-foreground/60">
                                    #
                                </span>
                                <Input
                                    value={value?.replace("#", "") || ""}
                                    onChange={(e) => handleHexInput(e.target.value)}
                                    placeholder={placeholder?.replace("#", "")}
                                    maxLength={6}
                                    className="pl-7 h-9 font-mono text-sm tracking-wider uppercase rounded-lg"
                                />
                            </div>
                            {/* Native color picker (hidden, triggered by button) */}
                            <input
                                ref={nativeInputRef}
                                type="color"
                                value={currentColor}
                                onChange={handleNativePickerChange}
                                className="sr-only"
                                tabIndex={-1}
                            />
                            <button
                                type="button"
                                onClick={() => nativeInputRef.current?.click()}
                                className={cn(
                                    "size-9 rounded-lg border border-border/80 shrink-0 flex items-center justify-center",
                                    "hover:border-primary/50 hover:scale-105 active:scale-95 transition-all duration-200"
                                )}
                                title="Open system color picker"
                            >
                                <div
                                    className="size-5 rounded-md shadow-inner"
                                    style={{ backgroundColor: currentColor }}
                                />
                            </button>
                        </div>

                        {/* Preset color grid */}
                        <div className="grid grid-cols-10 gap-1.5">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => handlePresetClick(color)}
                                    className={cn(
                                        "size-6 rounded-md border transition-all duration-150",
                                        "hover:scale-125 hover:z-10 hover:shadow-md active:scale-95",
                                        value?.toLowerCase() === color.toLowerCase()
                                            ? "ring-2 ring-primary ring-offset-1 ring-offset-background border-primary scale-110"
                                            : "border-border/50 hover:border-border"
                                    )}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <FieldError message={error ?? ""} />
        </div>
    );
}

// ── Helper: Determine if a hex color is light (for contrast text) ───────────
function isLightColor(hex: string): boolean {
    const color = hex.replace("#", "");
    if (color.length < 6) return false;
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    // Relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
}
