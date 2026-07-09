import { CERTIFICATE_NAVIGATION } from "@/constants/navigation";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { type PropsWithChildren } from "react";

export default function CertificateLayout({ children }: PropsWithChildren) {
    return (
        <ModuleLayout
            sidebarNavItems={CERTIFICATE_NAVIGATION}
            sidebarId="certificate-sidebar"
            contentAreaId="certificate-content-area"
        >
            {children}
        </ModuleLayout>
    );
}
