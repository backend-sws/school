import "../css/app.css";
import "../css/tiptap.css";

import { createInertiaApp } from "@inertiajs/react";

// Register PWA service worker (single SW handles precache + push)
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/build/sw.js", { scope: "/" }).catch(() => { });
  });
}
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeTheme } from "./hooks/use-appearance";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query.client";
import { Toaster } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { PoweredByFooter } from "./components/powered-by-footer";
import { resolveLayoutKey } from "./lib/layout-config";
import { isSelfManaged, getLayoutImporter } from "./lib/layout-factory";
import { GuideProvider } from "./components/GuideProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SharedData } from "@/types";

const appName = import.meta.env.VITE_APP_NAME ?? 'PDS Education'
const brandName = import.meta.env.VITE_BRAND_NAME || appName;

/**
 * ThemeRoot — global wrapper that applies data-theme / data-font
 * on the root <div> so every layout inherits the institution palette.
 *
 * NOTE: This component wraps the Inertia <App>, so it renders ABOVE the
 * Inertia context provider. We therefore cannot use usePage() here.
 * Instead we receive the initial shared props directly.
 */
function ThemeRoot({
  children,
  institution,
  branding,
}: {
  children: React.ReactNode;
  institution?: SharedData["institution"];
  branding?: SharedData["branding"];
}) {
  const brandTheme = institution?.brand_theme;
  const brandFont = institution?.brand_font;
  const brandMotif = institution?.brand_motif;

  const [showGlobalFooter, setShowGlobalFooter] = React.useState(true);

  React.useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      // Hide on public landing/website/auth pages since they render layout-specific footers
      const isAdministrative = path.startsWith('/dashboard') || 
                               path.startsWith('/students') || 
                               path.startsWith('/staff') || 
                               path.startsWith('/accounts') || 
                               path.startsWith('/hr') || 
                               path.startsWith('/academic') ||
                               path.startsWith('/settings');
      setShowGlobalFooter(isAdministrative);
    };

    checkPath();
    // Listen to Inertia navigate events to update footer visibility
    document.addEventListener('inertia:navigate', checkPath);
    return () => document.removeEventListener('inertia:navigate', checkPath);
  }, []);

  // Sync brand attributes to <html> so ALL elements — including
  // React Portals (tooltip, dialog, select, etc.) — inherit the
  // correct palette from a single source of truth.
  React.useEffect(() => {
    if (brandTheme) document.documentElement.setAttribute("data-theme", brandTheme);
    if (brandFont) document.documentElement.setAttribute("data-font", brandFont);
    if (brandMotif) document.documentElement.setAttribute("data-motif", brandMotif);
  }, [brandTheme, brandFont, brandMotif]);

  return (
    <div
      id="theme-root"
      className="flex h-full w-full flex-col"
    >
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
      {showGlobalFooter && <PoweredByFooter branding={branding} />}
    </div>
  );
}


createInertiaApp({
  title: (title) => title ? `${title} | ${brandName}` : brandName,
  resolve: async (name) => {
    const page = (await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob("./pages/**/*.tsx")
    )) as { default: { layout?: (pageNode: React.ReactNode) => React.ReactNode } };

    // Layout Factory: auto-assign persistent layout via explicit hashmap only
    const layoutKey = resolveLayoutKey(name);

    if (layoutKey && !isSelfManaged(layoutKey)) {
      const importer = getLayoutImporter(layoutKey);
      if (importer) {
        const layoutModule = await importer();
        const LayoutComponent = layoutModule.default;
        
        // Factory provides layoutProps support: pages can define static or functional layoutProps
        // to customize the factory-assigned layout (e.g. backHref, backLabel)
        const getLayoutProps = (pageProps: any) => {
          const lp = (page.default as any).layoutProps;
          return typeof lp === 'function' ? lp(pageProps) : (lp || {});
        };

        page.default.layout = (pageNode: any) => (
          <LayoutComponent layoutKey={layoutKey} {...getLayoutProps(pageNode.props)}>
            {pageNode}
          </LayoutComponent>
        );
      }
    }

    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    const sharedProps = props.initialPage.props as unknown as SharedData;

    root.render(
      <StrictMode>
        <Toaster
          richColors={false}
          position="top-right"
          icons={{
            success: <CheckCircle2 className="size-5 text-emerald-500" />,
            error: <AlertCircle className="size-5 text-destructive" />,
            info: <Info className="size-5 text-blue-500" />,
            warning: <AlertTriangle className="size-5 text-amber-500" />,
          }}
          toastOptions={{
            classNames: {
              toast:
                "group toast flex items-center gap-3 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-5 py-4 rounded-2xl transition-all duration-300",
              title: "text-[15px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight",
              description: "text-sm text-zinc-500 dark:text-zinc-400 font-normal",
              actionButton: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-xs font-semibold",
              cancelButton: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-lg text-xs font-semibold",
            },
          }}
        />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <GuideProvider>
                <ThemeRoot
                  institution={sharedProps.institution}
                  branding={sharedProps.branding}
                >
                  <App {...props} />
                </ThemeRoot>
            </GuideProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </StrictMode>
    );
  },
  progress: {
    color: "#4B5563",
  },
});

// This will set light / dark mode on load...
initializeTheme();
