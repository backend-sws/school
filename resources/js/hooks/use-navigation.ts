import { unifiedSidebarConfig } from "@/constants/navigation";
import { SidebarNavItem, SidebarNavGroup } from "@/types/navigation";
import { useMemo } from "react";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { Building2, BookOpen } from "lucide-react";

export interface RouteMetadata {
    title: string;
    icon?: any;
    category?: string;
    href: string;
}

/**
 * Hook to retrieve metadata for the current or specified route.
 */
export function useNavigation() {
    const { auth } = usePage<SharedData>().props;

    const flatItems = useMemo(() => {
        const items: Record<string, RouteMetadata> = {};

        // Helper to process items
        const processItem = (item: SidebarNavItem, category?: string) => {
            items[item.href] = {
                title: item.title,
                icon: item.icon,
                category,
                href: item.href,
            };
        };

        // Process main items
        unifiedSidebarConfig.mainItems.forEach((item) => processItem(item));

        // Inject dynamic items based on persona
        auth.roles.forEach((role) => {
            if (role.key === "hod" && role.scope_type === "department" && role.scope_id) {
                processItem({
                    title: "My Department",
                    href: `/organization/departments/${role.scope_id}`,
                    icon: Building2,
                });
            }
            if (role.key === "teaching_staff" && role.scope_type === "subject" && role.scope_id) {
                processItem({
                    title: "My Teaching Plan",
                    href: `/organization/subjects/${role.scope_id}`,
                    icon: BookOpen,
                });
            }
        });

        // Process grouped items
        unifiedSidebarConfig.groups.forEach((group: SidebarNavGroup) => {
            group.items.forEach((item: SidebarNavItem) => processItem(item, group.label));
        });

        // Process footer items
        unifiedSidebarConfig.footerItems?.forEach((item: SidebarNavItem) => processItem(item));

        return items;
    }, [auth.roles]);

    const getMetadata = (href: string): RouteMetadata | null => {
        return flatItems[href] || null;
    };

    return { getMetadata, flatItems };
}
