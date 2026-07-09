import { Transition } from "@headlessui/react";
import { Loader2, Save, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import React from "react";

interface SettingsFooterProps {
    /** Whether the form has unsaved changes */
    isDirty?: boolean;
    /** Whether the submit action is in progress */
    isPending: boolean;
    /** Whether the last submit action was successful */
    isSuccess?: boolean;
    /** Callback to reset the form/discard changes */
    onDiscard?: () => void;
    /** Callback for submit action (for non-form usage) */
    onSubmit?: () => void;
    /** Label for the primary submit button */
    submitLabel?: string;
    /** Message to show on successful save */
    successMessage?: string;
    /** Additional CSS classes for the container */
    className?: string;
    /** Whether to show the discard button when dirty */
    showDiscard?: boolean;
    /** Optional link for a "Cancel" action (instead of Discard) */
    cancelLink?: string;
    /** Label for the cancel link */
    cancelLabel?: string;
    /** Extra elements to render in the footer */
    children?: React.ReactNode;
    /** Whether to always show the footer regardless of state */
    alwaysShow?: boolean;
    /** Submit button type */
    type?: "submit" | "button";
    /** ID for the submit button (for testing) */
    dataTest?: string;
    /** Submit button variant */
    submitVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "premium";
}

/**
 * Standardized footer for settings pages with sticky behavior,
 * success transitions, and standardized "Commit/Discard" actions.
 */
export const SettingsFooter = ({
    isDirty = false,
    isPending,
    isSuccess = false,
    onDiscard,
    onSubmit,
    submitLabel = "Commit Settings",
    successMessage = "All changes saved",
    className,
    showDiscard = true,
    cancelLink,
    cancelLabel = "Cancel",
    children,
    alwaysShow = false,
    type = onSubmit ? "button" : "submit",
    dataTest,
    submitVariant,
}: SettingsFooterProps) => {
    const isVisible = alwaysShow || isDirty || isPending || isSuccess;

    return (
        <Transition
            show={isVisible}
            as="div"
            enter="transition ease-out duration-500 transform"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition ease-in duration-300 transform"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
            className="sticky bottom-8 z-30 mt-8"
        >
            <div className={cn(
                "w-full flex items-center justify-end gap-4 p-4 rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-lg ring-1 ring-primary/5",
                className
            )}>
                {/* Success message with smooth transition */}
                <Transition
                    show={isSuccess && !isDirty}
                    enter="transition ease-in-out duration-500"
                    enterFrom="opacity-0 translate-y-2 scale-95"
                    enterTo="opacity-100 translate-y-0 scale-100"
                    leave="transition ease-in-out duration-300"
                    leaveTo="opacity-0 scale-95"
                >
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30 px-4 py-2 rounded-full border border-emerald-200/50 dark:border-emerald-900/50 shadow-sm backdrop-blur-sm">
                        {successMessage}
                    </p>
                </Transition>

                {/* Custom actions or elements */}
                {children}

                {/* Cancel (Link) or Discard (Button) */}
                {cancelLink ? (
                    <Button
                        variant="ghost"
                        asChild
                        className="text-muted-foreground hover:text-foreground font-bold"
                    >
                        <Link href={cancelLink}>{cancelLabel}</Link>
                    </Button>
                ) : (
                    isDirty && showDiscard && onDiscard && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onDiscard}
                            className="text-muted-foreground hover:text-foreground font-bold"
                        >
                            <Undo2 className="mr-2 h-4 w-4" />
                            Discard Changes
                        </Button>
                    )
                )}

                {/* Main Submit Action */}
                <Button
                    type={type}
                    data-test={dataTest}
                    disabled={isPending || (type === "submit" && !isDirty && !cancelLink && !alwaysShow)}
                    variant={submitVariant}
                    className="min-w-[160px] font-bold shadow-sm transition-all active:scale-95"
                    onClick={onSubmit}
                >
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {submitLabel}
                </Button>
            </div>
        </Transition>
    );
};

export default SettingsFooter;
