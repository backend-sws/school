import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthPageHeaderProps {
    title: string;
    description?: ReactNode;
    className?: string;
}

/**
 * Standardized header for auth and onboarding pages.
 * Enforces consistent typography, size, and no-caps as per user request.
 */
export function AuthPageHeader({ title, description, className }: AuthPageHeaderProps) {
    return (
        <div className={cn("space-y-[var(--space-2)] border-l-4 border-primary pl-[var(--space-10)] -ml-4 lg:-ml-[var(--space-10)]", className)}>
            <h1 className="text-xl sm:text-3xl font-black tracking-tighter text-foreground leading-none">
                {title}
            </h1>
            {description && (
                <p className="text-[10px] sm:text-sm font-semibold text-muted-foreground/80 leading-relaxed max-w-[280px] sm:max-w-none">
                    {description}
                </p>
            )}
        </div>
    );
}
