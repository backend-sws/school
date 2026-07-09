import React from 'react';
import { ShieldCheck, GraduationCap } from 'lucide-react';

/**
 * TrustBadgeBanner — Subtle top-of-page marketing strip.
 * Shows compliance & education badges.
 */
export default function TrustBadgeBanner() {
    return (
        <div className="w-full bg-(--l-primary)/5 border-b border-(--l-primary)/10">
            <div className="max-w-(--max-w-content) mx-auto px-4 py-1.5 flex items-center justify-center gap-4 md:gap-6 text-[11px] font-semibold tracking-wide">
                <span className="flex items-center gap-1.5 l-text-primary/80">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Secure & Compliant</span>
                    <span className="sm:hidden">Secure</span>
                </span>

                <span className="w-px h-3 bg-(--l-primary)/20" aria-hidden="true" />

                <span className="flex items-center gap-1.5 l-text-primary/80">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Smart School Management</span>
                    <span className="sm:hidden">Smart ERP</span>
                </span>
            </div>
        </div>
    );
}
