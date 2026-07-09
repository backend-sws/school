import { INVENTORY_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function InventoryLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={INVENTORY_NAVIGATION}
            sidebarId="inventory-sidebar"
            contentAreaId="inventory-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
