import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";

interface AppBrandProps {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Extra className on the wrapper */
  className?: string;
}

const SIZE_MAP = {
  sm: {
    wrapper: "gap-2.5",
    logoBox: "h-9 w-9 rounded-xl",
    logo: "h-5 w-5",
    title: "text-[15px]",
    slogan: "text-[7px] tracking-[0.2em] mt-px",
  },
  md: {
    wrapper: "gap-3",
    logoBox: "h-11 w-11 rounded-xl",
    logo: "h-6 w-6",
    title: "text-[17px]",
    slogan: "text-[8px] tracking-[0.22em] mt-0.5",
  },
  lg: {
    wrapper: "gap-3.5",
    logoBox: "h-14 w-14 rounded-2xl",
    logo: "h-8 w-8",
    title: "text-xl",
    slogan: "text-[9px] tracking-[0.22em] mt-0.5",
  },
};

/**
 * Reusable premium brand block — logo + app name + slogan.
 * Pulls app name from Inertia shared data automatically.
 *
 * @example
 * <AppBrand />                     // medium (default)
 * <AppBrand size="lg" />           // large
 * <AppBrand className="mb-6" />    // with extra spacing
 */
export function AppBrand({ size = "md", className }: AppBrandProps) {
  const { name: appName } = usePage<SharedData>().props;
  const s = SIZE_MAP[size];

  return (
    <div className={cn("flex items-center justify-center", s.wrapper, className)}>
      {/* Glassmorphic logo container */}
      <div
        className={cn(
          s.logoBox,
          "shrink-0 flex items-center justify-center",
          "bg-gradient-to-br from-primary/[0.08] to-primary/[0.02]",
          "border border-primary/10",
          "shadow-lg shadow-primary/[0.06]",
        )}
      >
        <img
          src="/logo.png"
          alt={appName}
          className={cn(s.logo, "object-contain")}
        />
      </div>

      {/* Typography block */}
      <div>
        <h1
          className={cn(
            s.title,
            "font-black tracking-tight text-foreground leading-none",
          )}
        >
          {appName}
        </h1>
        <p
          className={cn(
            s.slogan,
            "font-medium uppercase text-muted-foreground/70 leading-none",
          )}
        >
          Institutional Operating System
        </p>
      </div>
    </div>
  );
}
