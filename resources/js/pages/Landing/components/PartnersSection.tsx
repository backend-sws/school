import React from 'react';
import Each from '@/components/Each';
import GeometryPattern from './shared/GeometryPattern';
import { Building2 } from 'lucide-react';

interface Partner {
    name: string;
    city: string | null;
    state: string | null;
    logo_url: string | null;
}

interface PartnersSectionProps {
    partners: Partner[];
}

function PartnerInitials({ name }: { name: string }) {
    const initials = name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');
    return (
        <div className="w-10 h-10 rounded-lg bg-(--l-primary)/10 flex items-center justify-center l-text-primary text-sm font-black">
            {initials || <Building2 className="w-4 h-4" />}
        </div>
    );
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
    if (!partners || partners.length === 0) return null;

    return (
        <section id="partners" className="py-(--space-section) relative overflow-hidden">
            <GeometryPattern autoSwap opacity={0.05} position="bottom" />

            <div className="max-w-(--max-w-content) mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-10 space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] l-text-primary/60">
                        Our Partners
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight l-fg l-font-heading">
                        Trusted by Institutions
                    </h2>
                    <p className="text-sm l-text-muted max-w-lg mx-auto l-font-body">
                        Organizations already running on the PDS Education platform.
                    </p>
                </div>

                {/* Partner grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <Each
                        of={partners}
                        render={(partner) => (
                            <div className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-(--l-border) l-bg-surface transition-all duration-300 hover:border-(--l-primary)/30 hover:shadow-md hover:shadow-(--l-primary)/5 text-center">
                                {partner.logo_url ? (
                                    <img
                                        src={partner.logo_url}
                                        alt={partner.name}
                                        className="w-10 h-10 rounded-lg object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <PartnerInitials name={partner.name} />
                                )}
                                <div className="min-w-0">
                                    <h3 className="text-xs font-bold l-fg l-font-heading truncate max-w-[140px]">
                                        {partner.name}
                                    </h3>
                                    {(partner.city || partner.state) && (
                                        <p className="text-[10px] l-text-muted truncate max-w-[140px]">
                                            {[partner.city, partner.state].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        keyExtractor={(partner) => partner.name}
                    />
                </div>
            </div>
        </section>
    );
}
