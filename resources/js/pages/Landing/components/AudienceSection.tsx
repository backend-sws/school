import React from 'react';
import * as LucideIcons from 'lucide-react';
import Each from '@/components/Each';
import { ShineBorder } from '@/components/ui/shine-border';
import { AUDIENCE_CARD_SHINE } from '@/constants/landing/audience';

interface AudienceItem {
    title: string;
    description: string;
    icon: string;
}

interface AudienceSectionProps {
    audience: AudienceItem[];
}

export default function AudienceSection({ audience }: AudienceSectionProps) {
    const isDark = typeof document !== 'undefined'
        && document.documentElement.classList.contains('dark');

    return (
        <section className="py-[var(--space-section)] relative">
            {/* Subtle radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-30 bg-[radial-gradient(ellipse,var(--l-primary-soft),transparent)]" />

            <div className="max-w-[var(--max-w-content)] mx-auto px-4 relative z-10">
                <div className="text-center mb-10 space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] l-text-primary">Target Ecosystems</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight l-fg l-font-heading">Whom is it for?</h2>
                    <p className="text-lg l-text-muted max-w-2xl mx-auto l-font-body">
                        Engineered for the unique complexities of Indian educational governance.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <Each
                        of={audience}
                        render={(item, index) => {
                            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Users;
                            const shine = AUDIENCE_CARD_SHINE[index % AUDIENCE_CARD_SHINE.length];
                            const colors = isDark ? shine.dark : shine.light;

                            return (
                                <div className="relative l-bg-surface rounded-2xl h-full">
                                    <div className="p-5 flex flex-col h-full relative z-10">
                                        <div className="size-10 rounded-xl flex items-center justify-center l-text-primary l-bg-primary-soft mb-4">
                                            <Icon className="size-4" />
                                        </div>
                                        <h3 className="text-base font-bold mb-2 l-fg l-font-heading leading-snug">{item.title}</h3>
                                        <p className="text-sm l-text-muted leading-relaxed font-medium l-font-body flex-1">
                                            {item.description}
                                        </p>
                                    </div>
                                    <ShineBorder
                                        shineColor={colors}
                                        duration={shine.duration}
                                        borderWidth={1}
                                    />
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
