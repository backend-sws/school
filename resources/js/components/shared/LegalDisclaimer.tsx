import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface LegalDisclaimerProps {
    className?: string;
    hideBorder?: boolean;
}

/**
 * Standardized legal disclaimer for authentication and onboarding flows.
 * Removed heavy caps and tracking for a cleaner, modern look.
 */
export function LegalDisclaimer({ className, hideBorder = false }: LegalDisclaimerProps) {
    return (
        <div className={cn(
            !hideBorder && "pt-[var(--space-3)] border-t border-border/10", 
            className
        )}>
            <p className="text-center text-[9px] sm:text-[10px] font-medium text-muted-foreground/50 leading-relaxed">
                By continuing, you agree to our{' '}
                <Link 
                    href="/terms" 
                    className="text-primary hover:text-foreground transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-border font-semibold"
                >
                    Terms
                </Link> 
                {' '}&{' '}
                <Link 
                    href="/privacy" 
                    className="text-primary hover:text-foreground transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-border font-semibold"
                >
                    Privacy
                </Link>
            </p>
        </div>
    );
}
