import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Trash2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ConfirmVariant = "danger" | "warning" | "info" | "default";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    title: string;
    description: string;
    onConfirm: () => void;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmVariant;
    confirmationKeyword?: string;
}

const variantConfig: Record<
    ConfirmVariant,
    {
        icon: React.ReactNode;
        color: string;
        iconBg: string;
        buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
        accentColor: string;
    }
> = {
    danger: {
        icon: <Trash2 className="size-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />,
        color: "text-red-600 border-red-200 bg-red-50/50 dark:bg-red-500/10 dark:border-red-500/20",
        iconBg: "bg-red-100 dark:bg-red-500/20",
        buttonVariant: "destructive",
        accentColor: "ring-red-500/20",
    },
    warning: {
        icon: <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />,
        color: "text-amber-600 border-amber-200 bg-amber-50/50 dark:bg-amber-500/10 dark:border-amber-500/20",
        iconBg: "bg-amber-100 dark:bg-amber-500/20",
        buttonVariant: "default",
        accentColor: "ring-amber-500/20",
    },
    info: {
        icon: <Info className="size-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />,
        color: "text-blue-600 border-blue-200 bg-blue-50/50 dark:bg-blue-500/10 dark:border-blue-500/20",
        iconBg: "bg-blue-100 dark:bg-blue-500/20",
        buttonVariant: "default",
        accentColor: "ring-blue-500/20",
    },
    default: {
        icon: <HelpCircle className="size-5 text-muted-foreground group-hover:scale-110 transition-transform" />,
        color: "text-muted-foreground border-border bg-muted/30",
        iconBg: "bg-muted",
        buttonVariant: "default",
        accentColor: "ring-primary/20",
    },
};

export function ConfirmDialog({
    open,
    onOpenChange,
    onClose,
    title,
    description,
    onConfirm,
    isLoading,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    confirmationKeyword,
}: ConfirmDialogProps) {
    const [inputValue, setInputValue] = React.useState("");
    const config = variantConfig[variant];

    // Reset input when dialog closes
    React.useEffect(() => {
        if (!open) setInputValue("");
    }, [open]);

    const isConfirmed = !confirmationKeyword || inputValue.toLowerCase() === confirmationKeyword.toLowerCase();

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (onOpenChange) onOpenChange(val);
            if (!val && onClose) onClose();
        }}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden gap-0 border-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <div className="p-8 pb-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "group flex items-center justify-center size-12 rounded-2xl border transition-all duration-500 shadow-sm",
                                config.color
                            )}>
                                {config.icon}
                            </div>
                            <DialogHeader className="text-left space-y-1">
                                <DialogTitle className="text-xl font-bold tracking-tight text-foreground/90 uppercase text-[15px] letter-spacing-[0.05em]">{title}</DialogTitle>
                                <div className="h-0.5 w-8 bg-current opacity-20 rounded-full" style={{ backgroundColor: config.iconBg.match(/bg-(\w+-\d+)/)?.[1] }} />
                            </DialogHeader>
                        </div>

                        <div className="space-y-4">
                            <DialogDescription className="text-base text-muted-foreground/90 leading-relaxed font-medium">
                                {description}
                            </DialogDescription>

                            {confirmationKeyword && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="confirmation-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                            Security Confirmation <span className="text-red-500 ml-0.5">*</span>
                                        </Label>
                                    </div>
                                    <div className="relative group">
                                        <Input
                                            id="confirmation-input"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={`Type "${confirmationKeyword}" to authorize...`}
                                            className={cn(
                                                "h-12 bg-muted/30 border-muted placeholder:text-muted-foreground/40 text-sm focus-visible:ring-2 transition-all duration-300 rounded-xl px-4",
                                                config.accentColor
                                            )}
                                            autoComplete="off"
                                            autoFocus
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-transparent to-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground/60 italic px-1">
                                        This action is destructive and requires explicit verification.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="bg-muted/10 px-8 py-6 flex flex-row items-center justify-end gap-3 border-t border-muted/50 backdrop-blur-md">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (onOpenChange) onOpenChange(false);
                            if (onClose) onClose();
                        }}
                        disabled={isLoading}
                        className="h-11 px-6 text-sm font-semibold hover:bg-muted/50 rounded-xl transition-colors tracking-tight"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={config.buttonVariant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                        disabled={!isConfirmed || isLoading}
                        className={cn(
                            "h-11 px-8 text-sm font-bold shadow-lg shadow-current/10 transition-all duration-300 rounded-xl relative overflow-hidden group",
                            config.buttonVariant === "destructive" ? "bg-red-600 hover:bg-red-700 active:scale-95 translate-y-0 hover:-translate-y-0.5" : "active:scale-95 translate-y-0 hover:-translate-y-0.5",
                            !isConfirmed && "opacity-30 grayscale cursor-not-allowed translate-y-0 shadow-none pointer-events-none"
                        )}
                    >
                        <span className="relative z-10 uppercase tracking-wider">{confirmText}</span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
