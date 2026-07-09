import { Newspaper, Calendar, ArrowRight, Clock, MapPin } from 'lucide-react';

const LATEST_NEWS = [
    {
        title: 'Admission Open for Academic Session 2025-26',
        date: '05 Jan 2025',
        excerpt: 'Applications are now open for various undergraduate programs. Apply before the deadline.',
        category: 'Admissions'
    },
    {
        title: 'College Ranks Among Top Institutions in Bihar',
        date: '28 Dec 2024',
        excerpt: 'Apex International School achieves excellent ranking in the state-level institutional assessment.',
        category: 'Achievement'
    },
    {
        title: 'New Computer Lab Inaugurated',
        date: '20 Dec 2024',
        excerpt: 'State-of-the-art computer lab with 50 systems now available for students.',
        category: 'Infrastructure'
    },
];

const UPCOMING_EVENTS = [
    { title: 'Annual Sports Meet', date: '15', month: 'Jan', location: 'Sports Ground' },
    { title: 'Cultural Festival', date: '25', month: 'Jan', location: 'Main Auditorium' },
    { title: 'Career Counseling Session', date: '02', month: 'Feb', location: 'Seminar Hall' },
    { title: 'Alumni Meet 2025', date: '10', month: 'Feb', location: 'College Campus' },
];

export function NewsEvents() {
    return (
        <section className="py-12">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Stay Updated</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* News Section - Takes more space */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Newspaper className="h-5 w-5" />
                            </span>
                            Latest News
                        </h2>
                        <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                            All News <ArrowRight className="h-3 w-3" />
                        </a>
                    </div>

                    <div className="space-y-4">
                        {LATEST_NEWS.map((news, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="group block p-5 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center">
                                        <Newspaper className="h-6 w-6 text-muted-foreground/30" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">
                                                {news.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {news.date}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">
                                            {news.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {news.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Events Section */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Calendar className="h-5 w-5" />
                            </span>
                            Events
                        </h2>
                        <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                            All Events <ArrowRight className="h-3 w-3" />
                        </a>
                    </div>

                    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                        {UPCOMING_EVENTS.map((event, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className={`group flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors ${idx !== UPCOMING_EVENTS.length - 1 ? 'border-b border-border/50' : ''}`}
                            >
                                {/* Date Badge */}
                                <div className="shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-lg font-bold leading-none">{event.date}</span>
                                    <span className="text-[10px] font-medium uppercase">{event.month}</span>
                                </div>

                                {/* Event Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                        {event.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                    </p>
                                </div>

                                <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
