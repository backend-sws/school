import { ViewAllButton } from './view-all-button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionCardProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    iconBgClass?: string;
    actionHref?: string;
    footerLabel?: string;
    footerHref?: string;
    footerVariant?: 'glass' | 'link';
    children: ReactNode;
    className?: string;
}

export function SectionCard({
    title,
    subtitle,
    icon,
    iconBgClass = 'bg-primary/10 text-primary',
    actionHref,
    footerLabel,
    footerHref,
    footerVariant = 'link',
    children,
    className,
}: SectionCardProps) {
    return (
        <div className={cn(
            "relative group rounded-2xl sm:rounded-3xl bg-card border border-border flex flex-col min-h-[260px] h-auto md:h-[450px] overflow-hidden transition-all duration-300",
            className
        )}>
            {/* Header - responsive padding and typography */}
            <div className="px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 flex items-center justify-between shrink-0 border-b border-border/50 bg-muted/10">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {icon && (
                        <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border border-border/50", iconBgClass)}>
                            {icon}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-none mb-0.5 sm:mb-1 truncate">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em]">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                {actionHref && (
                    <a href={actionHref} className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted border border-border/50 transition-all group/action shrink-0">
                        <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground group-hover/action:text-primary" />
                    </a>
                )}
            </div>

            {/* Body - minimal padding; children control their own responsive padding */}
            <div className="flex-1 overflow-y-auto min-h-0 relative z-10 scrollbar-hide p-1 sm:p-2">
                {children}
            </div>

            {/* Standardized Footer */}
            {footerLabel && (
                <div className={cn(
                    "shrink-0 bg-muted/20 border-t border-border/50",
                    footerVariant === 'glass' ? "p-3 sm:p-4" : "p-3 sm:p-3.5 flex justify-center"
                )}>
                    <ViewAllButton
                        label={footerLabel}
                        href={footerHref}
                        variant={footerVariant === 'glass' ? 'subtle' : 'link'}
                        className={cn(
                            "font-bold uppercase tracking-[0.1em] text-[9px] sm:text-[10px]",
                            footerVariant === 'link' ? "text-primary hover:text-primary/80" : ""
                        )}
                    />
                </div>
            )}
        </div>
    );
}
