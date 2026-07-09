import { REDRESSAL_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function RedressalLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={REDRESSAL_NAVIGATION}
            sidebarId="redressal-sidebar"
            contentAreaId="redressal-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
