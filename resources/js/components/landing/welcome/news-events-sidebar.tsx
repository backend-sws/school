import { Newspaper, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { SectionCard } from './section-card';

const LATEST_NEWS = [
    {
        title: 'Admission Open for Academic Session 2025-26',
        date: '05 Jan 2025',
        category: 'Admissions'
    },
    {
        title: 'College Ranks Among Top Institutions in Bihar',
        date: '28 Dec 2024',
        category: 'Achievement'
    },
    {
        title: 'New Computer Lab Inaugurated',
        date: '20 Dec 2024',
        category: 'Infrastructure'
    },
];

const UPCOMING_EVENTS = [
    { title: 'Annual Sports Meet', date: '15', month: 'Jan', location: 'Sports Ground' },
    { title: 'Cultural Festival', date: '25', month: 'Jan', location: 'Main Auditorium' },
    { title: 'Career Counseling Session', date: '02', month: 'Feb', location: 'Seminar Hall' },
    { title: 'Alumni Meet 2025', date: '10', month: 'Feb', location: 'College Campus' },
];

export function NewsEventsSidebar() {
    return (
        <SectionCard
            title="News & Events"
            subtitle="Stay updated with college"
            icon={<Newspaper className="h-4 w-4" />}
            iconBgClass="bg-primary/10 text-primary"
            actionHref="#"
        >
            <div className="flex flex-col h-full">
                {/* Latest News - Top Half */}
                <div className="px-3 pt-2 pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Latest News</span>
                        <a href="#" className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-0.5">
                            All News <ArrowRight className="h-2.5 w-2.5" />
                        </a>
                    </div>
                    <div className="space-y-2">
                        {LATEST_NEWS.slice(0, 3).map((news, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="group block p-2 rounded-lg hover:bg-primary/5 transition-all"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase">
                                        {news.category}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">{news.date}</span>
                                </div>
                                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {news.title}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events - Bottom Half */}
                <div className="flex-1 px-3 pt-2 pb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Upcoming Events</span>
                        <a href="#" className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-0.5">
                            All Events <ArrowRight className="h-2.5 w-2.5" />
                        </a>
                    </div>
                    <div className="space-y-2">
                        {UPCOMING_EVENTS.slice(0, 3).map((event, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="group flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-all"
                            >
                                {/* Date Badge */}
                                <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex flex-col items-center justify-center">
                                    <span className="text-sm font-bold leading-none">{event.date}</span>
                                    <span className="text-[8px] font-medium uppercase">{event.month}</span>
                                </div>

                                {/* Event Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                        {event.title}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-2.5 w-2.5" />
                                        {event.location}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
