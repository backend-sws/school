import { ADMISSION_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function AdmissionLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={ADMISSION_NAVIGATION}
            sidebarId="admission-sidebar"
            contentAreaId="admission-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
