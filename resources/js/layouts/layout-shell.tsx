/**
 * LayoutShell — Thin wrapper that renders the assembly-line stages.
 *
 * Used for non-selfManaged layouts (admin, settings, canvas).
 * Applies Shell + Content CSS classes from the factory pipeline.
 *
 * Self-managed layouts (auth, portal, onboarding, etc.) bypass this
 * entirely — they handle their own navigation, content frame, and footer.
 */

import type { PropsWithChildren } from "react";
import {
    type LayoutKey,
    getPipeline,
    SHELL_CLASSES,
    CONTENT_CLASSES,
} from "@/lib/layout-factory";
import { cn } from "@/lib/utils";

interface LayoutShellProps {
    /** The resolved layout key for this page */
    layoutKey: LayoutKey;
    /** Additional classes for the shell container */
    className?: string;
}

/**
 * Generic shell wrapper.
 *
 * For the `admin` and `settings` layouts, the actual shell is handled
 * by AppSidebarLayout (which includes AppShell, AppSidebar, etc.).
 * This component is used as a fallback for simpler non-selfManaged layouts
 * like `canvas` that just need CSS classes applied.
 */
export default function LayoutShell({
    children,
    layoutKey,
    className,
}: PropsWithChildren<LayoutShellProps>) {
    const pipeline = getPipeline(layoutKey);

    return (
        <div className={cn(
            "flex h-full w-full flex-col bg-background overflow-y-auto",
            SHELL_CLASSES[pipeline.shell],
            className,
        )}>
            <main className={cn("flex-1", CONTENT_CLASSES[pipeline.content])}>
                {children}
            </main>
        </div>
    );
}
