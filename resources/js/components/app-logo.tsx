import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { getDailySlogan } from '@/constants/content/slogans';

interface AppLogoProps {
    className?: string;
    /** Show only the icon (first letter) — useful in collapsed sidebars */
    iconOnly?: boolean;
    /** Override the institution name */
    name?: string;
}

/**
 * Reusable app logo component.
 * Shows institution logo from DB if available, otherwise Eczar initial fallback.
 * Name in Eczar font + daily rotating slogan.
 */
export default function AppLogo({ className, iconOnly = false, name }: AppLogoProps) {
    const { institution } = usePage<SharedData>().props;
    const displayName = name || institution?.name || 'Institution';
    const initial = displayName.charAt(0).toUpperCase();
    const logoUrl = institution?.logo_url;
    const [imgError, setImgError] = useState(false);

    const showImage = !!logoUrl && !imgError;

    return (
        <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
            {/* Logo: DB image or Eczar initial fallback */}
            <div className="size-8 shrink-0 flex items-center justify-center rounded-lg overflow-hidden">
                {showImage ? (
                    <img
                        src={logoUrl}
                        alt={displayName}
                        className="size-full object-contain"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span
                        className="size-full flex items-center justify-center bg-primary/10 text-primary text-lg font-semibold"
                        style={{ fontFamily: "'Eczar', serif" }}
                    >
                        {initial}
                    </span>
                )}
            </div>

            {/* Name + daily slogan */}
            {!iconOnly && (
                <div className="flex flex-col min-w-0">
                    <span
                        className="text-[13px] font-semibold text-foreground leading-tight truncate"
                        style={{ fontFamily: 'var(--font-logo)' }}
                    >
                        {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 font-medium leading-tight truncate italic">
                        {getDailySlogan()}
                    </span>
                </div>
            )}
        </div>
    );
}
