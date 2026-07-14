import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Each from '@/components/Each';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import GeometryPattern from './shared/GeometryPattern';

interface Plan {
    name: string;
    monthly: string;
    annual: string;
    is_popular: boolean;
    limits: { label: string; value: string }[];
    modules: { name: string; included: boolean }[];
}

interface PricingSectionProps {
    plans: Plan[];
}

export default function PricingSection({ plans }: PricingSectionProps) {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    return (
        <section id="pricing" className="py-[var(--space-section)] l-bg relative overflow-hidden">
            {/* Subtle radial glow behind pricing */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-3xl pointer-events-none bg-[radial-gradient(ellipse,var(--l-primary-soft),transparent)]" />

            {/* Auto-swapping Madhubani patterns */}
            <GeometryPattern autoSwap opacity={0.08} borderBeam position="top" />

            <div className="max-w-[var(--max-w-content)] mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-1 bg-[var(--l-primary)]/80 rounded-full mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] l-text-primary/80">Investment</span>
                    </div>
                    <h2 className="text-5xl font-extrabold tracking-tight l-fg l-font-heading">Structured Solutions.</h2>
                    <p className="text-lg l-text-muted max-w-2xl mx-auto l-font-body">Transparent pricing. No hidden fees. Scale as you grow.</p>

                    {/* Animated pill toggle */}
                    <div className="flex items-center justify-center gap-1 pt-6">
                        <div className="relative flex items-center rounded-xl border border-[var(--l-border)] l-bg-surface p-1">
                            <motion.div
                                className="absolute h-[calc(100%-8px)] rounded-lg l-bg-fg shadow-md"
                                layoutId="billingToggle"
                                style={{
                                    width: 'calc(50% - 4px)',
                                    left: billingCycle === 'monthly' ? '4px' : 'calc(50%)',
                                }}
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            />
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={cn(
                                    'relative z-10 text-sm font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer',
                                    billingCycle === 'monthly' ? 'l-bg-inverse-text' : 'l-text-muted'
                                )}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={cn(
                                    'relative z-10 text-sm font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer',
                                    billingCycle === 'annual' ? 'l-bg-inverse-text' : 'l-text-muted'
                                )}
                            >
                                Annual
                                <span className="absolute -top-2 -right-6 text-[9px] font-black l-text-primary bg-[var(--l-primary)]/10 px-2 py-0.5 rounded-full">
                                    -15%
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    <Each
                        of={plans}
                        render={(plan, index) => {
                            return (
                                <div
                                    className={cn(
                                        'rounded-2xl border border-[var(--l-border)] l-bg-surface transition-all duration-300 flex flex-col',
                                        plan.is_popular && 'scale-[1.02] z-10 ring-1 ring-[var(--l-primary)]/30'
                                    )}
                                >
                                    {plan.is_popular && (
                                        <div className="text-center py-2 text-[10px] font-black uppercase tracking-widest text-white l-bg-primary rounded-t-2xl">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="mb-5">
                                            <h4 className="text-lg font-bold l-fg mb-3 l-font-heading">{plan.name}</h4>
                                            <div className="flex items-baseline gap-1.5">
                                                <motion.span
                                                    key={billingCycle}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-4xl font-black tracking-tight l-fg"
                                                >
                                                    {billingCycle === 'monthly' ? plan.monthly : plan.annual}
                                                </motion.span>
                                                <span className="text-xs font-bold l-text-muted uppercase">/mo</span>
                                            </div>
                                            {billingCycle === 'annual' && (
                                                <p className="text-[11px] l-text-primary font-semibold mt-1">
                                                    Billed annually · Save 15%
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-5">
                                            <h5 className="text-[10px] font-black uppercase tracking-widest l-text-muted mb-3">Plan Limits</h5>
                                            <div className="space-y-2">
                                                <Each
                                                    of={plan.limits}
                                                    render={(limit) => (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="l-text-muted">{limit.label}</span>
                                                            <span className="font-bold l-fg">{limit.value}</span>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t border-[var(--l-border)] my-2" />

                                        <div className="flex-1 mb-6 mt-4">
                                            <h5 className="text-[10px] font-black uppercase tracking-widest l-text-muted mb-3">Modules</h5>
                                            <ul className="space-y-2">
                                                <Each
                                                    of={plan.modules}
                                                    render={(mod) => (
                                                        <li className="flex items-start gap-2.5 text-sm">
                                                            {mod.included ? (
                                                                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 l-text-primary" />
                                                            ) : (
                                                                <span className="w-4 h-4 shrink-0 mt-0.5 rounded-full border-2 border-[var(--l-border)]/30 inline-block" />
                                                            )}
                                                            <span className={mod.included ? 'l-fg font-medium' : 'l-text-muted/50 line-through'}>
                                                                {mod.name}
                                                            </span>
                                                        </li>
                                                    )}
                                                />
                                            </ul>
                                        </div>

                                        {/* <Button
                                            asChild
                                            className={cn(
                                                'w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 hover:-translate-y-0.5 cursor-pointer',
                                                plan.is_popular
                                                    ? 'l-bg-primary text-white hover:opacity-90 l-shimmer'
                                                    : 'l-bg-surface l-fg border border-[var(--l-border)] hover:opacity-80'
                                            )}
                                        >
                                            <a href="/register">Select Plan</a>
                                        </Button> */}
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
