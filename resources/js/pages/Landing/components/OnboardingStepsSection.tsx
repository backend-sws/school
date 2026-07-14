import React from 'react';
import Each from '@/components/Each';
import GeometryPattern from './shared/GeometryPattern';
import { BorderBeam } from '@/components/ui/border-beam';
import * as LucideIcons from 'lucide-react';

interface OnboardingStep {
    step: number;
    title: string;
    description: string;
    icon: string;
    route: string;
}

interface OnboardingStepsSectionProps {
    steps: OnboardingStep[];
}

function StepIcon({ name }: { name: string }) {
    const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name] ?? LucideIcons.CircleDot;
    return <Icon className="w-6 h-6" />;
}

export default function OnboardingStepsSection({ steps }: OnboardingStepsSectionProps) {
    return (
        <section id="how-it-works" className="py-(--space-section) relative overflow-hidden">
            <GeometryPattern autoSwap opacity={0.06} borderBeam position="top" />

            <div className="max-w-(--max-w-content) mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] l-text-primary/60">
                        Zero-Touch Setup
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight l-fg l-font-heading">
                        Go Live in Under 48 Hours
                    </h2>
                    <p className="text-sm l-text-muted max-w-xl mx-auto l-font-body">
                        No sales call needed. Any institution can self-register, configure, and start operations — completely self-service.
                    </p>
                </div>

                {/* Steps timeline */}
                <div className="relative">
                    {/* Vertical line (desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-(--l-primary)/30 to-transparent" />

                    <div className="space-y-6 md:space-y-0">
                        <Each
                            of={steps}
                            render={(item, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <div className="md:grid md:grid-cols-2 md:gap-8 md:py-4 relative">
                                        {/* Dot on timeline */}
                                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full l-bg-surface border-2 border-(--l-primary)/40 items-center justify-center z-10">
                                            <span className="text-xs font-black l-text-primary">{item.step}</span>
                                        </div>

                                        {/* Card — alternates sides on desktop */}
                                        <div className={`${isEven ? 'md:col-start-1 md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12'}`}>
                                            <div className="relative group rounded-xl border border-(--l-border) l-bg-surface p-5 transition-all duration-300 hover:border-(--l-primary)/30 hover:shadow-lg hover:shadow-(--l-primary)/5">
                                                <div className={`flex items-start gap-4 ${isEven ? 'md:flex-row-reverse md:text-right' : ''}`}>
                                                    {/* Icon */}
                                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-(--l-primary)/10 flex items-center justify-center l-text-primary">
                                                        <StepIcon name={item.icon} />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-1 md:hidden">
                                                            <span className="text-[10px] font-black uppercase tracking-wider l-text-primary/60">
                                                                Step {item.step}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-base font-bold l-fg l-font-heading mb-1">{item.title}</h3>
                                                        <p className="text-xs l-text-muted leading-relaxed l-font-body">{item.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Empty column for alternation */}
                                        {isEven && <div className="hidden md:block" />}
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>

                {/* CTA */}
                {/* <div className="text-center mt-12">
                    <a
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm l-bg-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-(--l-primary)/20"
                    >
                        <LucideIcons.Rocket className="w-4 h-4" />
                        Start Free — No Credit Card Required
                    </a>
                </div> */}
            </div>
        </section>
    );
}
