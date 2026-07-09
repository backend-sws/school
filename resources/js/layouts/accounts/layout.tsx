import { ACCOUNTS_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function AccountsLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={ACCOUNTS_NAVIGATION}
            sidebarId="accounts-sidebar"
            contentAreaId="accounts-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
