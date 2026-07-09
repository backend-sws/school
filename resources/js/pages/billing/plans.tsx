import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, Link, useForm } from '@inertiajs/react';
import { Check, Star, Building2, Users, Mail, HardDrive, Zap } from 'lucide-react';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import Each from '@/components/Each';

interface Plan {
    id: string;
    name: string;
    price_monthly: number;
    price_annual: number;
    limits: {
        institutions: number;
        users: number;
        staff: number;
        emails: number;
        storage: number;
    };
    modules: string[];
    is_current: boolean;
    is_recommended: boolean;
}

interface Props {
    plans: Plan[];
    currentSubscription: {
        tier: string;
        tier_label: string;
        is_trial: boolean;
        ends_at: string | null;
        trial_ends_at: string | null;
        is_active: boolean;
    } | null;
}

export default function Plans({ plans, currentSubscription }: Props) {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const { post, processing } = useForm();

    const handleSelectPlan = (planId: string) => {
        post(route('billing.checkout', { tier: planId, cycle: billingCycle }));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Billing', href: route('billing.plans') },
        { title: 'Subscription Plans', href: route('billing.plans') },
    ];

    return (
        <>
            <Head title="Subscription Plans" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <MainPageHeader
                        breadcrumbs={breadcrumbs}
                        icon={Zap}
                        title="Choose the Perfect Plan for Your Growth"
                        subtitle="Scale your educational institution with our powerful tools. Flexible plans designed for every stage."
                    />

                    <div className="mt-8 flex justify-center">
                        <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as any)} className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                <TabsTrigger value="annual" className="relative">
                                    Annual
                                    <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600 text-[10px] px-1.5 py-0.5">
                                        Save 15%
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Each
                        of={plans}
                        render={(plan, index) => (
                            <Card
                                key={plan.id}
                                variant={plan.is_recommended ? "glass" : "action"}
                                delay={index * 0.05}
                                className={cn(
                                    "flex flex-col relative",
                                    plan.is_recommended && "border-primary ring-1 ring-primary shadow-lg shadow-primary/10",
                                    plan.is_current && "bg-muted/50"
                                )}
                            >
                                {plan.is_recommended && (
                                    <div className="absolute top-0 right-0 z-10">
                                        <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1 px-8 rotate-45 translate-x-4 -translate-y-2">
                                            Popular
                                        </div>
                                    </div>
                                )}

                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                        {plan.is_current && <Badge variant="secondary">Current Plan</Badge>}
                                    </div>
                                    <div className="mt-4 flex items-baseline">
                                        <span className="text-4xl font-extrabold tracking-tight">
                                            ₹{billingCycle === 'monthly' ? plan.price_monthly.toLocaleString() : (plan.price_annual / 12).toLocaleString()}
                                        </span>
                                        <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {billingCycle === 'annual' ? `Billed ₹${plan.price_annual.toLocaleString()} annually` : 'Billed monthly'}
                                    </p>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Building2 className="h-4 w-4 text-primary" />
                                            <span>Up to <strong>{plan.limits.institutions === 2147483647 ? 'Unlimited' : plan.limits.institutions}</strong> Institutions</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Users className="h-4 w-4 text-primary" />
                                            <span>Up to <strong>{plan.limits.users === 2147483647 ? 'Unlimited' : plan.limits.users}</strong> Users</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span><strong>{plan.limits.emails === 2147483647 ? 'Unlimited' : plan.limits.emails.toLocaleString()}</strong> Emails/mo</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <HardDrive className="h-4 w-4 text-primary" />
                                            <span><strong>{plan.limits.storage}GB</strong> Shared Storage</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border/50">
                                        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                            <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                            Features Included:
                                        </h4>
                                        <ul className="space-y-2.5">
                                            {plan.modules.slice(0, 8).map((module: string) => (
                                                <li key={module} className="flex items-start gap-2.5 text-sm">
                                                    <div className="mt-1 rounded-full bg-green-500/10 p-0.5">
                                                        <Check className="h-3 w-3 text-green-500" />
                                                    </div>
                                                    <span className="text-muted-foreground leading-tight">
                                                        {module.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                    </span>
                                                </li>
                                            ))}
                                            {plan.modules.length > 8 && (
                                                <li className="text-xs text-primary font-medium pl-6">
                                                    + {plan.modules.length - 8} more modules
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0 relative z-20">
                                    <Button
                                        className="w-full h-11 text-base shadow-inner"
                                        variant={plan.is_recommended ? 'default' : 'outline'}
                                        disabled={plan.is_current || processing}
                                        onClick={() => handleSelectPlan(plan.id)}
                                    >
                                        {plan.is_current ? 'Current Plan' : (
                                            <span className="flex items-center gap-2">
                                                {plan.is_recommended && <Star className="h-4 w-4" />}
                                                Get Started
                                            </span>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    />
                </div>

                <div className="mt-16 bg-muted/30 rounded-3xl p-8 border border-dashed border-muted-foreground/20 text-center">
                    <h3 className="text-2xl font-bold mb-2">Need a Custom Solution?</h3>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        For large universities or government chains requiring high-scale deployments, custom SLAs, and architecture.
                    </p>
                    <Button variant="link" className="text-primary font-bold text-lg h-auto p-0 underline-offset-4">
                        Contact our Enterprise Team &rarr;
                    </Button>
                </div>
            </div>
        </>
    );
}
