import { useState, Fragment } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types";
import { PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HeaderActions } from "@/components/shared/header-actions";
import { DashboardHeaderShell } from "@/components/shared/DashboardHeaderShell";

export function AppSidebarHeader({ breadcrumbs }: { breadcrumbs?: BreadcrumbItemType[] }) {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <DashboardHeaderShell variant="sidebar">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="size-9 shrink-0 hidden md:flex items-center justify-center rounded-xl text-muted-foreground/60 hover:bg-primary/5 hover:text-primary transition-all duration-300 active:scale-90"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </Button>

        {/* Breadcrumbs - Aligned for symmetry */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="flex-nowrap items-baseline gap-1.5">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <Fragment key={item.href}>
                    <BreadcrumbItem className="flex items-center">
                      {isLast ? (
                        <BreadcrumbPage className="font-sans font-black text-sm leading-none tracking-tight text-foreground uppercase truncate max-w-[200px]">
                          {item.title}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink 
                          asChild
                          className="text-[10px] font-medium text-muted-foreground/40 italic hover:text-primary transition-colors leading-none truncate max-w-[120px]"
                        >
                          <Link href={item.href}>{item.title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className="text-muted-foreground/20 mt-0.5">
                        <span className="text-[10px]">/</span>
                      </BreadcrumbSeparator>
                    )}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      {/* Right Section — shared header actions */}
      <HeaderActions />
    </DashboardHeaderShell>
  );
}
