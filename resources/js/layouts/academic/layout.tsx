import { ACADEMIC_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function AcademicLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={ACADEMIC_NAVIGATION}
            sidebarId="academic-sidebar"
            contentAreaId="academic-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
