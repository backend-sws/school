import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Check } from 'lucide-react';
import Each from '@/components/Each';
import { Badge } from '@/components/ui/badge';
import { MagicCard } from '@/components/ui/magic-card';

interface FeatureStat {
    value: string;
    label: string;
}

interface FeatureItem {
    title: string;
    description: string;
    icon: string;
    category: string;
    badge?: string;
    stat?: FeatureStat;
    highlights?: string[];
}

interface FeaturesSectionProps {
    features: FeatureItem[];
}

/** Bento grid class map — index → span class */
const BENTO_SPAN: Record<number, string> = {
    0: 'md:col-span-2',    // Hero card — wide
    5: 'md:col-span-3',    // Last card — full width
};

export default function FeaturesSection({ features }: FeaturesSectionProps) {
    return (
        <section id="features" className="py-[var(--space-section)] l-bg relative overflow-hidden">
            {/* Radial glow background */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,var(--l-primary-soft),transparent)]" />

            <div className="max-w-[var(--max-w-content)] mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] l-text-primary/60">Strategic Solutions</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight l-fg l-font-heading">Why Does it Matter?</h2>
                    </div>
                    <p className="max-w-md l-text-muted font-medium l-font-body">
                        Institutional excellence isn't just about software—it's about fixing the friction in manual governance.
                    </p>
                </div>

                {/* Bento grid: first card spans 2×2, rest fill in */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Each
                        of={features}
                        render={(feature, index) => {
                            const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.HelpCircle;
                            const isFeatured = index === 0;
                            const spanClass = BENTO_SPAN[index] || '';

                            return (
                                <MagicCard
                                    className={`rounded-2xl ${spanClass}`}
                                    gradientColor="var(--l-primary-soft)"
                                    gradientOpacity={0.15}
                                    gradientSize={250}
                                >
                                    <div className={`flex flex-col h-full ${isFeatured ? 'p-8' : 'p-5'}`}>
                                        {/* Header: icon + category badge */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className={`rounded-xl flex items-center justify-center l-text-primary l-bg-primary-soft ${isFeatured ? 'size-12' : 'size-10'
                                                    }`}
                                            >
                                                <Icon className={isFeatured ? 'size-6' : 'size-4'} />
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-[9px] font-black uppercase tracking-widest border-[var(--l-border)]/50 l-text-muted px-2 py-0.5"
                                            >
                                                {feature.category}
                                            </Badge>
                                        </div>

                                        {/* Title + description */}
                                        <h4 className={`font-bold mb-2 l-fg l-font-heading ${isFeatured ? 'text-2xl' : 'text-lg leading-snug'}`}>
                                            {feature.title}
                                        </h4>
                                        <p className={`l-text-muted leading-relaxed font-medium l-font-body mb-4 ${isFeatured ? 'text-base' : 'text-sm'
                                            }`}>
                                            {feature.description}
                                        </p>

                                        {/* Highlights — bullet list */}
                                        {feature.highlights && feature.highlights.length > 0 && (
                                            <ul className={`space-y-2 mt-auto ${isFeatured ? 'mb-6' : 'mb-3'}`}>
                                                <Each
                                                    of={feature.highlights}
                                                    render={(highlight) => (
                                                        <li className="flex items-start gap-2 text-sm l-text-muted font-medium l-font-body">
                                                            <Check className="size-3.5 mt-0.5 l-text-primary shrink-0" />
                                                            <span>{highlight}</span>
                                                        </li>
                                                    )}
                                                />
                                            </ul>
                                        )}

                                        {/* Stat pill — bottom of card */}
                                        {feature.stat && (
                                            <div className={`flex items-center gap-2 pt-3 border-t border-[var(--l-border)]/30 ${!feature.highlights ? 'mt-auto' : ''}`}>
                                                <span className={`font-black l-text-primary ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
                                                    {feature.stat.value}
                                                </span>
                                                <span className="text-xs font-semibold l-text-muted uppercase tracking-wider">
                                                    {feature.stat.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </MagicCard>
                            );
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
