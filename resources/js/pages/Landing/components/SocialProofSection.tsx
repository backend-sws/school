import React, { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import * as LucideIcons from 'lucide-react';
import Each from '@/components/Each';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

import { ShineBorder } from '@/components/ui/shine-border';
import CountUp from './shared/CountUp';
import GeometryPattern from './shared/GeometryPattern';

interface StatItem {
    label: string;
    value: number;
    icon: string;
    suffix?: string;
    prefix?: string;
}

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    institution: string;
}

interface SocialProofSectionProps {
    stats: StatItem[];
    testimonials: Testimonial[];
}

export default function SocialProofSection({ stats, testimonials }: SocialProofSectionProps) {
    const { name: appName } = usePage<SharedData>().props;

    // Duplicate for seamless infinite loop
    const marqueeItems = useMemo(
        () => [...testimonials, ...testimonials],
        [testimonials],
    );

    return (
        <section className="pt-[var(--space-section)] pb-16 l-bg-surface/5 relative overflow-hidden">
            {/* Radial glow background */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_50%,var(--l-primary-soft),transparent)]" />

            {/* Dot pattern background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-[1] bg-[radial-gradient(circle_at_1px_1px,var(--l-fg)_1px,transparent_0)] bg-[length:32px_32px]" />

            {/* Auto-swapping Madhubani patterns */}
            <GeometryPattern autoSwap opacity={0.08} borderBeam position="top" />

            <div className="max-w-[var(--max-w-content)] mx-auto px-4 relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] l-text-primary/60">Trust & Reliability</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight l-fg l-font-heading">Why Institutions Trust {appName}</h2>
                </div>

                {/* Stats with CountUp */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                    <Each
                        of={stats}
                        render={(stat, index) => {
                            const Icon = (LucideIcons as any)[stat.icon] || LucideIcons.HelpCircle;
                            return (
                                <div className="relative rounded-xl l-bg-surface p-6 text-center overflow-hidden">
                                    <div className="relative z-10 space-y-3">
                                        <div className="flex items-center justify-center size-12 rounded-xl l-text-primary l-bg-primary-soft mx-auto mb-3">
                                            <Icon className="size-5" />
                                        </div>
                                        <div className="text-3xl font-black tracking-tight l-fg">
                                            <CountUp
                                                target={stat.value}
                                                prefix={stat.prefix}
                                                suffix={stat.suffix}
                                                duration={2200}
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest l-text-muted">{stat.label}</p>
                                    </div>
                                    <ShineBorder
                                        shineColor={['var(--l-primary)', 'var(--l-accent)', 'var(--l-primary)']}
                                        borderWidth={1}
                                        duration={8 + (index ?? 0) * 2}
                                    />
                                </div>
                            );
                        }}
                    />
                </div>
            </div>

            {/* Testimonial Marquee — pure CSS, full viewport width */}
            <div className="mb-12 relative z-10 overflow-hidden">
                {/* Gradient fade edges */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[var(--l-bg)] to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[var(--l-bg)] to-transparent" />

                <div className="animate-marquee items-center w-max py-2">
                    <Each
                        of={marqueeItems}
                        render={(t) => (
                            <div className="mx-3 w-[340px] shrink-0 rounded-2xl border border-[var(--l-border)] l-bg-surface whitespace-normal">
                                <div className="p-5 flex flex-col justify-between h-full">
                                    <p className="text-sm font-medium leading-relaxed l-fg opacity-90 l-font-body">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-black l-text-primary border l-bg-primary-soft border-[var(--l-primary)]/20">
                                            {t.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm leading-none l-fg">{t.name}</h4>
                                            <p className="text-[10px] l-text-muted font-bold uppercase tracking-wider mt-1">
                                                {t.role}, {t.institution}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Trust Badges */}
            <div className="max-w-[var(--max-w-content)] mx-auto px-4 relative z-10">
                <div className="flex flex-wrap items-center justify-center gap-12 opacity-25 hover:opacity-50 transition-opacity duration-500 pointer-events-none">
                    <div className="flex items-center gap-3">
                        <Lock className="size-4" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em]">Bank-Grade Security</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="size-4" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em]">SOC 2 Ready</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Zap className="size-4" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em]">99.9% Uptime</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
