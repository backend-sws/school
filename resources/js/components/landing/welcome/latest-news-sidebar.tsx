import { Newspaper, ArrowRight } from 'lucide-react';
import type { NewsPreview } from '@/types/website';
import { SectionCard } from './section-card';
import { cn, htmlToPlainText } from '@/lib/utils';
import Each from '@/components/Each';
import { EmptyState } from '@/components/shared';

const CATEGORY_COLORS = ['bg-primary', 'bg-primary/90', 'bg-primary/80', 'bg-primary/70', 'bg-primary/60'] as const;

function formatNewsDate(iso: string | null): { day: string; month: string } {
    if (!iso) return { day: '--', month: '---' };
    try {
        const d = new Date(iso);
        return { day: d.getDate().toString().padStart(2, '0'), month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase() };
    } catch {
        return { day: '--', month: '---' };
    }
}

function excerpt(text: string | null, maxLen: number): string {
    const stripped = htmlToPlainText(text);
    if (!stripped) return '';
    return stripped.length <= maxLen ? stripped : stripped.slice(0, maxLen) + '...';
}

interface LatestNewsSidebarProps {
    newsPreview?: NewsPreview[];
}

export function LatestNewsSidebar({ newsPreview = [] }: LatestNewsSidebarProps) {
    const items = newsPreview.map((n, idx) => {
        const { day, month } = formatNewsDate(n.created_at);
        const category = (Array.isArray(n.news_types) && n.news_types[0]) || n.news_for || 'News';
        return {
            id: n.id,
            title: htmlToPlainText(n.title),
            day,
            month,
            category,
            description: excerpt(n.content, 80),
            color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        };
    });

    return (
        <SectionCard
            title="Latest News"
            subtitle="Campus updates"
            icon={<Newspaper className="h-5 w-5 sm:h-6 sm:w-6" />}
            iconBgClass="bg-primary/10 text-primary"
            footerLabel="View All News"
            footerHref="#"
        >
            <div className="flex flex-col h-full px-3 py-2 sm:px-4 sm:py-3 md:px-5">
                <div className="flex-1 space-y-1.5 sm:space-y-2 overflow-y-auto scrollbar-hide pb-1 sm:pb-2">
                    <Each
                        of={items}
                        keyExtractor={(news) => news.id}
                        nodatafound={
                            <EmptyState
                                title="No news at the moment."
                                description="Check back later for updates."
                                className="border-0 py-6 sm:py-8"
                            />
                        }
                        render={(news, idx) => (
                            <a
                                href="#"
                                className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl border border-border/60 hover:border-primary/20 hover:bg-muted/50 transition-colors group touch-manipulation"
                            >
                                <div className={cn(
                                    "w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md sm:rounded-lg flex flex-col items-center justify-center text-white shrink-0",
                                    news.color
                                )}>
                                    <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tighter opacity-80 leading-none mb-0.5">{news.month}</span>
                                    <span className="text-sm sm:text-base md:text-lg font-bold leading-none">{news.day}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                                        <h4 className="text-xs sm:text-sm md:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors leading-tight break-words line-clamp-2">
                                            {news.title}
                                        </h4>
                                        {idx === 0 && (
                                            <span className="shrink-0 px-1.5 py-0.5 rounded-sm bg-primary text-[7px] sm:text-[8px] font-bold text-white uppercase tracking-widest">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                                        {news.category}
                                    </p>
                                </div>
                                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors transition-transform group-hover:translate-x-1 shrink-0" />
                            </a>
                        )}
                    />
                </div>
            </div>
        </SectionCard>
    );
}
