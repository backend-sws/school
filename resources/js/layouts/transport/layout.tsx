import { TRANSPORT_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function TransportLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={TRANSPORT_NAVIGATION}
            sidebarId="transport-sidebar"
            contentAreaId="transport-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
