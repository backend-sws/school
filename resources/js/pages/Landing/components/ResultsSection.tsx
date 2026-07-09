import React from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import Each from '@/components/Each';
import GeometryPattern from './shared/GeometryPattern';
import { BorderBeam } from '@/components/ui/border-beam';

interface ResultItem {
    metric: string;
    label: string;
    description: string;
}

interface ResultsSectionProps {
    results: ResultItem[];
}

export default function ResultsSection({ results }: ResultsSectionProps) {
    const { name: appName } = usePage<SharedData>().props;
    return (
        <section id="results" className="py-[var(--space-section)] relative overflow-hidden">
            {/* Auto-swapping Madhubani patterns */}
            <GeometryPattern autoSwap opacity={0.08} borderBeam position="top" />

            <div className="max-w-[var(--max-w-content)] mx-auto px-4 relative z-10">
                {/* Compact header */}
                <div className="text-center mb-8 space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] l-text-primary/60">Institutional Impact</span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight l-fg l-font-heading">Show the Proof</h2>
                    <p className="text-sm l-text-muted max-w-lg mx-auto l-font-body">
                        Real-world metrics from institutions on {appName}.
                    </p>
                </div>

                {/* Inline stat row with BorderBeam */}
                <div className="relative rounded-2xl border border-[var(--l-border)] l-bg-surface overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--l-border)]">
                        <Each
                            of={results}
                            render={(item) => (
                                <div className="text-center py-6 md:py-4 px-6">
                                    <div className="text-4xl font-black tracking-tight mb-1 l-gradient-text l-font-display">
                                        {item.metric}
                                    </div>
                                    <h3 className="text-sm font-bold l-fg l-font-heading mb-1">{item.label}</h3>
                                    <p className="text-xs l-text-muted leading-relaxed font-medium l-font-body max-w-[220px] mx-auto">
                                        {item.description}
                                    </p>
                                </div>
                            )}
                        />
                    </div>
                    <BorderBeam
                        size={200}
                        duration={8}
                        colorFrom="var(--l-primary)"
                        colorTo="var(--l-accent)"
                    />
                </div>
            </div>
        </section>
    );
}
