import { QUICK_ACCESS_CARDS } from '@/constants';
import { login } from '@/routes';
import { LinkIcon, ArrowRight } from 'lucide-react';
import { SectionCard } from './section-card';
import { cn } from '@/lib/utils';

export function QuickLinksGrid() {
    // Process quick access cards with route helpers
    const processedQuickAccessCards = QUICK_ACCESS_CARDS.map(card => ({
        ...card,
        href: card.href === 'login' ? login().url : card.href
    }));

    return (
        <SectionCard
            title="Quick Links"
            subtitle="Important resources & portals"
            icon={<LinkIcon className="h-6 w-6" />}
            iconBgClass="bg-primary/10 text-primary"
            footerLabel="Explore All Portals"
            footerHref="#"
        >
            <div className="flex flex-col h-full px-3 py-2 sm:px-4 sm:py-3 md:px-5">
                <div className="flex-1 space-y-1.5 sm:space-y-2 overflow-y-auto scrollbar-hide pb-1 sm:pb-2">
                    {processedQuickAccessCards.map((card, idx) => (
                        <a
                            key={idx}
                            href={card.href}
                            className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl border border-border/60 hover:border-primary/20 hover:bg-muted/50 transition-colors group touch-manipulation"
                        >
                            <div className={cn(
                                "w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md sm:rounded-lg flex items-center justify-center text-white shrink-0",
                                card.color.split(' ')[0]
                            )}>
                                <card.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm md:text-[14px] font-bold text-foreground tracking-tight truncate">
                                    {card.title}
                                </p>
                                <p className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Access Portal</p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors transition-transform group-hover:translate-x-1 shrink-0" />
                        </a>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}
