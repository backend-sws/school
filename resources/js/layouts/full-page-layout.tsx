import { Head, Link, router, usePage } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { type LayoutKey } from "@/lib/layout-factory";
import { HeaderActions } from "@/components/shared/header-actions";
import { DashboardHeaderShell } from "@/components/shared/DashboardHeaderShell";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FullPageLayoutProps {
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  layoutKey?: LayoutKey;
  /** @deprecated No longer rendered. Kept for backward compatibility during migration. */
  breadcrumbs?: unknown[];
}

/**
 * Full-page layout: no sidebar, no rails — just a premium minimal header
 * with a back link (left) and user profile/actions (right), plus full-width content.
 *
 * Factory-managed via `fullpage` layout key in layout-factory.ts.
 * Supports automatic back-navigation resolution from Inertia props (`backHref`, `backLabel`).
 */
export default function FullPageLayout({
  children,
  backHref,
  backLabel,
  onBack,
  layoutKey,
}: FullPageLayoutProps) {
  const { props } = usePage<any>();
  const [scrolled, setScrolled] = useState(false);

  // Resolve back navigation from props if not provided explicitly (for factory-managed mode)
  const effectiveBackHref = backHref || props.backHref || props.back_href;
  const effectiveBackLabel = backLabel || props.backLabel || props.back_label || "Back";

  // Escape key navigates back
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[data-state='open']")) {
        if (onBack) onBack();
        else if (effectiveBackHref) router.visit(effectiveBackHref);
      }
    },
    [onBack, effectiveBackHref]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  const BackComp = effectiveBackHref ? Link : "button";

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <Head title={props.title || "PDS Education"} />
      
      {/* Premium Minimal Header */}
      <DashboardHeaderShell variant="fullpage" scrolled={scrolled}>
        {/* Left — Back Link */}
        <div className="flex items-center gap-1 min-w-0">
          {onBack || effectiveBackHref ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <BackComp
                  href={effectiveBackHref}
                  onClick={onBack}
                  className="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground/60 hover:text-primary transition-all duration-300 focus:outline-none ml-[-10px]"
                >
                  <ChevronLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="hidden sm:inline truncate tracking-tight">{effectiveBackLabel}</span>
                </BackComp>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-wider">
                Back to {effectiveBackLabel}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>

        {/* Right — Header Actions (search, notifications, theme, user) */}
        <HeaderActions compact />
      </DashboardHeaderShell>

      {/* Main scrollable content area with consistent spacing */}
      <main
        className="flex-1 overflow-y-auto pt-8 pb-12 px-4"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
        style={{ 
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 3rem)"
        }}
      >
        {children}
      </main>
    </div>
  );
}
