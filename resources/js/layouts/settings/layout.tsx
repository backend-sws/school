import { SETTINGS_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function SettingsLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={SETTINGS_NAVIGATION}
            sidebarId="settings-sidebar"
            contentAreaId="settings-content-area"
            hideSidebar={true}
        >
            {children}
        </ModuleLayout>
    );
}
