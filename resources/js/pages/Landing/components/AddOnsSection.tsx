import React from 'react';
import Each from '@/components/Each';
import * as LucideIcons from 'lucide-react';

interface AddOn {
    name: string;
    price: string;
    icon: string;
}

interface AddOnsSectionProps {
    addOns: AddOn[];
}

export default function AddOnsSection({ addOns }: AddOnsSectionProps) {
    return (
        <div className="mt-12">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-extrabold tracking-tight l-fg l-font-heading">Enhance Any Plan</h3>
                <p className="text-sm l-text-muted mt-2 l-font-body">Extend your plan with optional add-ons.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <Each
                    of={addOns}
                    render={(addon) => {
                        const Icon = (LucideIcons as any)[addon.icon] || LucideIcons.Plus;
                        return (
                            <div className="rounded-xl border border-[var(--l-border)] l-bg-surface p-4">
                                <div className="size-8 rounded-lg flex items-center justify-center l-text-primary l-bg-primary-soft mb-2">
                                    <Icon className="size-4" />
                                </div>
                                <h5 className="font-bold text-sm l-fg mb-0.5 l-font-heading">{addon.name}</h5>
                                <p className="text-xs l-text-muted font-medium l-font-body">{addon.price}</p>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}
