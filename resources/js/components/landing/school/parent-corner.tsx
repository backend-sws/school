import { CalendarCheck, CreditCard, Bus, Phone, ClipboardList, ArrowRight } from 'lucide-react';

const PARENT_ACTIONS = [
    {
        title: 'PTM Schedule',
        description: 'View upcoming parent-teacher meetings',
        icon: CalendarCheck,
        href: '#',
        color: 'bg-primary/10 text-primary',
    },
    {
        title: 'Fee Payment',
        description: 'Pay school fees online',
        icon: CreditCard,
        href: '#',
        color: 'bg-primary/10 text-primary',
    },
    {
        title: 'Transport',
        description: 'Track school bus routes & timings',
        icon: Bus,
        href: '#',
        color: 'bg-primary/10 text-primary',
    },
    {
        title: 'Contact Teacher',
        description: 'Reach out to class teachers',
        icon: Phone,
        href: '#',
        color: 'bg-primary/10 text-primary',
    },
    {
        title: 'Homework & Circulars',
        description: 'Daily assignments & school circulars',
        icon: ClipboardList,
        href: '#',
        color: 'bg-primary/10 text-primary',
    },
];

/**
 * ParentCorner — School-specific landing section.
 * Provides quick action cards for parents: PTM, fees, transport, etc.
 */
export function ParentCorner() {
    return (
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-8 overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h3 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Parent Corner
                </h3>
            </div>

            <div className="space-y-2 sm:space-y-3">
                {PARENT_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                        <a
                            key={action.title}
                            href={action.href}
                            className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-all duration-200"
                        >
                            <div className={`p-2.5 rounded-lg ${action.color} shrink-0`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-foreground leading-tight">
                                    {action.title}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">
                                    {action.description}
                                </p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
