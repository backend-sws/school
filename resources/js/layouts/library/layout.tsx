import { LIBRARY_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function LibraryLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={LIBRARY_NAVIGATION}
            sidebarId="library-sidebar"
            contentAreaId="library-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
