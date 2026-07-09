import React from 'react';
import { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';



/**
 * Institution logo from DB: shared via HandleInertiaRequests → InstitutionProfileController::getProfile().
 * Backend reads institutions.logo_url (or settings college_logo), resolves to a full URL (asset, R2 stream, or api/public/institution-logo).
 * Uses /logo.png as the default brand fallback when no institution logo is set.
 */
export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    const { institution } = usePage<SharedData>().props;
    const logoUrl = institution?.logo_url;

    // Institution subdomain: use specific logo, or show an empty placeholder div
    // (User requested no brand logo fallback for subdomains)
    if (logoUrl) {
        return (
            <img
                src={logoUrl}
                alt={institution?.name ?? 'Logo'}
                className={cn('block object-contain', className)}
                {...props}
            />
        );
    }

    // Empty placeholder for subdomains with no logo
    return <div className={cn('block bg-muted/20 rounded-lg', className)} />;
}
