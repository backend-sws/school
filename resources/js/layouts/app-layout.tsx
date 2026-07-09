import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import { type BreadcrumbItem } from "@/types";
import { type LayoutKey } from "@/lib/layout-factory";
import { type ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  layoutKey?: LayoutKey;
}

export default ({ children, breadcrumbs, layoutKey, ...props }: AppLayoutProps) => (
  <AppSidebarLayout breadcrumbs={breadcrumbs} layoutKey={layoutKey} {...props}>
    {children}
  </AppSidebarLayout>
);
