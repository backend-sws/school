import { type Branding } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Full-width, minimal-height footer using EMS_* env branding values.
 * Shows: © {year} {copyright_by}. All rights reserved. | Powered by {powered_by}
 */
export function PoweredByFooter({ branding, className }: { branding?: Branding, className?: string }) {
    const year = new Date().getFullYear();

    return (
        <footer
            role="contentinfo"
            aria-label={branding?.brand_name}
            className={cn(
                "shrink-0 w-full py-2 px-4 text-center text-[8px] sm:text-[10px] font-medium text-muted-foreground border-t border-border/10 bg-background/95 backdrop-blur-sm sticky bottom-0 z-40",
                className
            )}
        >
            © {year} {branding?.copyright_by || branding?.brand_name}. All rights reserved.
            <span className="mx-1 text-border/40">|</span>
            <span className="opacity-70">Powered by</span>{' '}
            <a
                href={branding?.powered_by_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 rounded"
            >
                {branding?.powered_by || ''}
            </a>
            {branding?.designed_by && (
                <>
                    <span className="mx-1 text-border/40">|</span>
                    <span className="opacity-70">Designed by</span>{' '}
                    <a
                        href={branding?.designed_by_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 rounded"
                    >
                        {branding.designed_by}
                    </a>
                </>
            )}
        </footer>
    );
}
