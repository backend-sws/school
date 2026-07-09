import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderShellProps {
  children: ReactNode;
  className?: string;
  variant?: "sidebar" | "fullpage";
  scrolled?: boolean;
}

/**
 * Unified Header Shell — Standardizes structural logic, sticky positioning,
 * and high-end aesthetics (glassmorphism/blur) across the platform.
 * 
 * Effectively eliminates layout duplication between Sidebar and Full-Page views.
 */
export function DashboardHeaderShell({
  children,
  className,
  variant = "sidebar",
  scrolled = false,
}: DashboardHeaderShellProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 px-5 transition-all duration-500",
        variant === "sidebar" 
          ? "bg-sidebar border-b border-sidebar-border" 
          : cn(
              "bg-background/80 backdrop-blur-xl border-b",
              scrolled 
                ? "border-border shadow-sm" 
                : "border-border/40"
            ),
        className
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {children}
    </header>
  );
}
