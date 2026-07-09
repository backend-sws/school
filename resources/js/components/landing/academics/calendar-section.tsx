import { Calendar, ExternalLink } from 'lucide-react';
import { ACADEMIC_EVENTS as DEFAULT_EVENTS } from '@/constants';

interface CalendarSectionProps {
    events?: any[];
}

export function CalendarSection({ events = DEFAULT_EVENTS }: CalendarSectionProps) {
    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <div className="section-title-label">Academic Calendar</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Session 2025-26
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                    Stay updated with important academic dates, examinations, and events throughout the year.
                </p>
            </div>

            {/* External Link */}
            <div className="natural-card rounded-xl p-6 bg-primary/5 border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">University Academic Calendar</h3>
                        <p className="text-sm text-muted-foreground">
                            View the complete academic calendar from Patliputra University
                        </p>
                    </div>
                    <a
                        href="https://ppup.ac.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Visit PPUP
                    </a>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(events || []).map((item) => (
                    <div key={item.month} className="natural-card rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">{item.month}</h3>
                        </div>
                        <ul className="space-y-2">
                            {(item.events || []).map((event: string, i: number) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    {event}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
