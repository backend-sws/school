import { ANALYTICS_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function AnalyticsLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={ANALYTICS_NAVIGATION}
            sidebarId="analytics-sidebar"
            contentAreaId="analytics-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
