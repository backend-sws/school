import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItemType[];
}

export function PageHeader({ title, description, breadcrumbs = [] }: PageHeaderProps) {
    return (
        <div className="space-y-4">
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={item.href}>
                                <BreadcrumbItem>
                                    {index === breadcrumbs.length - 1 ? (
                                        <BreadcrumbPage className="font-medium text-foreground">{item.title}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={item.href}>{item.title}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}

            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
