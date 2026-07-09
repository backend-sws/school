import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SettingsSectionProps {
    /** Lucide icon component for the section header */
    icon?: LucideIcon;
    /** Section title */
    title: React.ReactNode;
    /** Optional description below the title */
    description?: React.ReactNode;
    /** Optional badge to display next to the title */
    badge?: React.ReactNode;
    /** Section content (form fields) */
    children: React.ReactNode;
    /** Additional CSS classes for the outer card */
    className?: string;
    /** HTML id for anchor/guide targeting */
    id?: string;
}

/**
 * Premium card wrapper for settings form sections.
 * Provides visual containment, a rich header with icon + description,
 * and consistent spacing for all settings pages.
 */
export default function SettingsSection({
    icon: Icon,
    title,
    description,
    badge,
    children,
    className,
    id,
}: SettingsSectionProps) {
    return (
        <section
            id={id}
            className={cn(
                "rounded-xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100/50 overflow-hidden",
                className
            )}
        >
            {/* Section Header */}
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                                {title}
                            </h3>
                            {badge}
                        </div>
                        {description && (
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section Content */}
            <div className="px-6 py-6">
                {children}
            </div>
        </section>
    );
}
