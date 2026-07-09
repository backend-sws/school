import { MobileNav } from "@/components/mobile-nav";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { RealtimeNotificationsSubscriber } from "@/components/RealtimeNotificationsSubscriber";
import { SidebarInset } from "@/components/ui/sidebar";
import { type BreadcrumbItem } from "@/types";
import PremiumBackground from "@/components/shared/PremiumBackground";
import { type PropsWithChildren } from "react";
import { getPipeline, CONTENT_CLASSES, type LayoutKey } from "@/lib/layout-factory";
import { cn } from "@/lib/utils";

export default function AppSidebarLayout({
  children,
  breadcrumbs,
  layoutKey = "admin",
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; layoutKey?: LayoutKey }>) {
  const pipeline = getPipeline(layoutKey);
  return (
    <AppShell variant="sidebar" className="h-full overflow-hidden">
      <RealtimeNotificationsSubscriber />
      <AppSidebar />
      <SidebarInset className={cn(
        "flex h-full min-h-0 flex-1 flex-col overflow-hidden relative",
        pipeline.mobileNav === "bottom-nav" && "mb-[var(--space-12,3rem)] md:mb-0"
      )}>
        <div className="md:hidden absolute inset-0 z-0 pointer-events-none">
          <PremiumBackground variant="mobile" orbOpacity={0.15} motifCount={8} />
        </div>
        <div className="relative z-10 flex flex-col h-full min-h-0">
          <AppSidebarHeader breadcrumbs={breadcrumbs} />
          <main className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto bg-background/50 md:bg-background", CONTENT_CLASSES[pipeline.content])}>
            {children}
          </main>
        </div>
      </SidebarInset>
      {pipeline.mobileNav === "bottom-nav" && <MobileNav />}
    </AppShell>
  );
}
