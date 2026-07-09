import { WEBSITE_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function WebsiteLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={WEBSITE_NAVIGATION}
            sidebarId="website-sidebar"
            contentAreaId="website-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
