import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { SectionCard } from './section-card';
import { cn, htmlToPlainText } from '@/lib/utils';
import type { EventPreview } from '@/types/website';
import Each from '@/components/Each';
import { EmptyState } from '@/components/shared';

/** Static data kept for reference; display uses CMS events from News (news_types: event). */
const UPCOMING_EVENTS = [
    { title: 'Annual Sports Meet', date: '15', month: 'JAN', location: 'Sports Ground', description: 'Join us for a day of athletic excellence and spirit as students compete.', color: 'bg-primary' },
    { title: 'Cultural Festival', date: '25', month: 'JAN', location: 'Main Auditorium', description: 'Celebrating diversity through music, dance, and art performances.', color: 'bg-primary/90' },
    { title: 'Career Counseling Session', date: '02', month: 'FEB', location: 'Seminar Hall', description: 'Expert advice on career paths and industry trends for final year students.', color: 'bg-primary/80' },
    { title: 'Inter-College Quiz 2025', date: '18', month: 'FEB', location: 'Open Hall', description: 'Test your knowledge in our annual inter-college quiz competition.', color: 'bg-primary/70' },
];

const EVENT_BADGE_COLORS = ['bg-primary', 'bg-primary/90', 'bg-primary/80', 'bg-primary/70', 'bg-primary/60'] as const;

function formatEventDate(iso: string | null): { date: string; month: string } {
    if (!iso) return { date: '--', month: '---' };
    try {
        const d = new Date(iso);
        return {
            date: d.getDate().toString().padStart(2, '0'),
            month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        };
    } catch {
        return { date: '--', month: '---' };
    }
}

export interface UpcomingEventsSidebarProps {
    upcomingEvents?: EventPreview[];
}

export function UpcomingEventsSidebar({ upcomingEvents = [] }: UpcomingEventsSidebarProps) {
    const items = upcomingEvents.map((e, idx) => {
        // Prefer event_date (Y-m-d) when set, else created_at
        const dateSource = e.event_date?.trim() || e.created_at;
        const { date, month } = formatEventDate(dateSource);
        const location = e.event_location?.trim() || '—';
        return {
            id: e.id,
            title: htmlToPlainText(e.title ?? ''),
            date,
            month,
            location,
            color: EVENT_BADGE_COLORS[idx % EVENT_BADGE_COLORS.length],
        };
    });

    return (
        <SectionCard
            title="Upcoming Events"
            subtitle="Campus calendar"
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
            iconBgClass="bg-primary/10 text-primary"
            footerLabel="View Full Calendar"
            footerHref="#"
        >
            <div className="flex flex-col h-full px-3 py-2 sm:px-4 sm:py-3 md:px-5">
                <div className="flex-1 space-y-1.5 sm:space-y-2 overflow-y-auto scrollbar-hide pb-1 sm:pb-2">
                    <Each
                        of={items}
                        keyExtractor={(event) => event.id}
                        nodatafound={
                            <EmptyState
                                className="border-0 py-6 sm:py-8"
                                title="No upcoming events"
                                description="Events from the News section (type: event) will appear here."
                            />
                        }
                        render={(event, idx) => (
                            <a
                                href="#"
                                className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl border border-border/60 hover:border-primary/20 hover:bg-muted/50 transition-colors group touch-manipulation"
                            >
                                <div
                                    className={cn(
                                        'w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md sm:rounded-lg flex flex-col items-center justify-center text-white shrink-0',
                                        event.color
                                    )}
                                >
                                    <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tighter opacity-80 leading-none mb-0.5">{event.month}</span>
                                    <span className="text-sm sm:text-base md:text-lg font-bold leading-none">{event.date}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                                        <h4 className="text-xs sm:text-sm md:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors leading-tight break-words line-clamp-2">
                                            {event.title || 'Untitled'}
                                        </h4>
                                        {idx === 0 && (
                                            <span className="shrink-0 px-1.5 py-0.5 rounded-sm bg-primary text-[7px] sm:text-[8px] font-bold text-white uppercase tracking-widest">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                                        <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary/60 shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
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
