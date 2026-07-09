import { Breadcrumbs } from "@/components/breadcrumbs";
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { PageGuidance } from "./PageGuidance";
import { useGuide } from "@/components/GuideProvider";
import SettingsTip from "../SettingsTip";
import { GuideDefinition } from "@/types/guide";
import { cn } from "@/lib/utils";

export interface MainPageHeaderProps {
    breadcrumbs?: BreadcrumbItemType[];
    icon?: LucideIcon;
    title?: string;
    subtitle?: string;
    description?: string;
    guidance?: string | string[] | GuideDefinition;
    tip?: string;
    children?: React.ReactNode;
    id?: string;
}

/**
 * Common header for main-sidebar pages: breadcrumb → icon + title → subtitle → key guidance → pro tip.
 */
export function MainPageHeader({
    breadcrumbs = [],
    icon: Icon,
    title,
    subtitle,
    description,
    guidance,
    tip,
    children,
    id,
}: MainPageHeaderProps) {
    const { activeGuide } = useGuide();

    const displayTitle = title || activeGuide?.pageTitle || "";
    const displaySubtitle = subtitle || description || activeGuide?.pageSubtitle;
    const displaySettingsTip = tip || activeGuide?.settingsTip;

    return (
        <header className="w-full space-y-1" id={id}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="text-[11px] font-medium text-muted-foreground/70 h-4 flex items-center">
                    <Breadcrumbs breadcrumbs={breadcrumbs} className="text-[11px]" />
                </div>
            )}

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-0.5">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary/80 shrink-0 border border-primary/5">
                            <Icon className="size-4" aria-hidden />
                        </div>
                    )}
                    <div className="space-y-0.5">
                        <h1 className="text-base font-bold tracking-tight text-foreground/90 leading-tight sm:text-lg">
                            {displayTitle}
                        </h1>
                        {displaySubtitle && (
                            <p className="text-[12px] text-muted-foreground/50 font-normal leading-relaxed max-w-2xl px-0">
                                {displaySubtitle}
                            </p>
                        )}
                    </div>
                </div>
                {children && (
                    <div className="flex shrink-0 items-center gap-3">
                        {children}
                    </div>
                )}
            </div>


        </header>
    );
}
