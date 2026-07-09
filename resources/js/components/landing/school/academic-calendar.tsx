import { CalendarDays, MapPin } from 'lucide-react';
import type { WelcomePageProps } from '@/types/website';

interface AcademicCalendarProps {
    upcomingEvents?: WelcomePageProps['upcomingEvents'];
}

/**
 * AcademicCalendar — School-specific landing section.
 * Shows next 4-6 upcoming school events as a clean timeline.
 * Useful for parents to know PTM dates, exam schedule, annual day, etc.
 */
export function AcademicCalendar({ upcomingEvents }: AcademicCalendarProps) {
    const events = upcomingEvents?.slice(0, 6) ?? [];

    if (events.length === 0) {
        return (
            <section className="py-6 sm:py-10 md:py-14">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                        School Calendar
                    </span>
                </div>
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-10 text-center">
                    <CalendarDays className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">
                        No upcoming events scheduled. Check back soon!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                            School Calendar
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                        Upcoming Events
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {events.map((event, idx) => (
                    <div
                        key={idx}
                        className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                    >
                        <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
                        <div className="p-5 sm:p-6">
                            {/* Date badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold mb-3">
                                <CalendarDays className="h-3 w-3" />
                                {event.event_date || 'TBD'}
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 tracking-tight line-clamp-2">
                                {event.title}
                            </h3>

                            {event.content && (
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2 mb-3">
                                    {event.content}
                                </p>
                            )}

                            {event.event_location && (
                                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground font-medium">
                                    <MapPin className="h-3 w-3" />
                                    {event.event_location}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
