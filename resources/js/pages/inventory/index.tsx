import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { Package, FolderTree, Boxes, ArrowLeftRight, AlertTriangle } from "lucide-react";
import { INVENTORY_BREADCRUMBS, INVENTORY_GUIDELINES, INVENTORY_TIP } from "@/constants/page/admin/inventory";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INVENTORY_OVERVIEW_GUIDE } from "@/constants/guides/inventory";
import React from 'react';
import Each from '@/components/Each';

const links = [
  { title: "CATEGORIES", href: "/inventory/categories", icon: FolderTree, description: "Manage asset categories" },
  { title: "ITEMS", href: "/inventory/items", icon: Boxes, description: "Manage inventory items and stock levels" },
  { title: "MOVEMENTS", href: "/inventory/movements", icon: ArrowLeftRight, description: "View and record issue, receive, adjust" },
  { title: "LOW STOCK", href: "/inventory/reports/low-stock", icon: AlertTriangle, description: "Items at or below minimum stock" },
];

const InventoryIndex = () => {
useRegisterGuide(INVENTORY_OVERVIEW_GUIDE);

  return (
    <>
      <Head title="Inventory" />
      <PageContainer>
        <div className="space-y-6">
        <MainPageHeader
          id="inventory-header"
          breadcrumbs={INVENTORY_BREADCRUMBS}
          icon={Package}
          title="Inventory Overview"
          description="Manage asset categories, items, movements, and stock levels."
          guidance={INVENTORY_GUIDELINES}
          tip={INVENTORY_TIP}
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4" id="inventory-stats">
          <Each
              of={links}
              keyExtractor={(item) => item.href}
              render={({ title, href, icon: Icon, description }) => (
            <TooltipWrapper key={href} content={description} className="h-full">
              <Link href={href} className="block h-full">
                <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer border border-border/50">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/5">
                        <Icon className="size-4" />
                      </div>
                      <p className="font-semibold text-foreground text-sm uppercase tracking-wide">{title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </TooltipWrapper>
          )}
          />
        </div>
        </div>
      </PageContainer>
    </>
  );
};

export default InventoryIndex;
