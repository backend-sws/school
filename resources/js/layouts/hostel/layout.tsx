import { ModuleLayout } from "@/components/shared/ModuleLayout";
import { HOSTEL_NAVIGATION } from "@/constants/navigation";
import { PropsWithChildren } from "react";

export default function HostelLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={HOSTEL_NAVIGATION}
            sidebarId="hostel-sidebar"
            contentAreaId="hostel-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
