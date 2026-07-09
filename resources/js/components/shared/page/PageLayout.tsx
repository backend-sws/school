import { type BreadcrumbItem } from "@/types";
import { type ReactNode } from "react";
import { PageContainer } from "./PageContainer";
import { PageGuidance } from "./PageGuidance";
import { PageHeader } from "./PageHeader";

interface PageLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    guidance?: string | string[];
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
    className?: string;
}

export function PageLayout({
    children,
    title,
    description,
    breadcrumbs,
    guidance,
    maxWidth,
    className,
}: PageLayoutProps) {
    return (
        <PageContainer maxWidth={maxWidth} className={className}>
            <PageHeader
                title={title}
                description={description}
                breadcrumbs={breadcrumbs}
            />

            {guidance && <PageGuidance guidance={guidance} />}

            <div className="min-h-0 flex-1">{children}</div>
        </PageContainer>
    );
}
