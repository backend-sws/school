import { Clock, Users, MapPin, ArrowRight, AlertCircle } from 'lucide-react';

const BATCHES = [
    { name: 'JEE Warrior 2027', program: 'JEE Main + Advanced', timing: '6:00 AM – 10:00 AM', mode: 'Offline', seats: '8 left', total: 60, location: 'Main Campus' },
    { name: 'NEET Champion 2027', program: 'NEET UG', timing: '10:30 AM – 2:30 PM', mode: 'Offline', seats: '12 left', total: 80, location: 'Main Campus' },
    { name: 'Foundation Batch XI', program: 'Foundation (Class 11)', timing: '3:00 PM – 6:00 PM', mode: 'Offline', seats: '20 left', total: 50, location: 'Branch 2' },
    { name: 'UPSC Lakshya 2026', program: 'UPSC Civil Services', timing: '7:00 AM – 12:00 PM', mode: 'Hybrid', seats: '5 left', total: 40, location: 'Main Campus' },
    { name: 'Banking Express', program: 'Banking & SSC', timing: '4:00 PM – 7:00 PM', mode: 'Online', seats: '25 left', total: 100, location: 'Online' },
];

interface BatchesTableProps {
    ctaLabel?: string;
}

/**
 * BatchesTable — Coaching-specific landing section.
 * Lists current batches with timing, seats, and enroll CTA.
 * Uses urgency indicators ("5 left") to drive enrollments.
 */
export function BatchesTable({ ctaLabel = 'Enroll Now' }: BatchesTableProps) {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                    <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                        Current Batches
                    </h2>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">
                    {BATCHES.length} batches starting soon
                </span>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Batch</th>
                            <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Timing</th>
                            <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mode</th>
                            <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Seats</th>
                            <th className="text-right px-5 py-3.5"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {BATCHES.map((batch) => {
                            const seatsNum = parseInt(batch.seats);
                            const isUrgent = seatsNum <= 10;
                            return (
                                <tr key={batch.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-foreground text-sm">{batch.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{batch.program}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            {batch.timing}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary`}>
                                            {batch.mode}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${isUrgent ? 'text-destructive' : 'text-muted-foreground'
                                            }`}>
                                            {isUrgent && <AlertCircle className="h-3 w-3" />}
                                            {batch.seats}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <a
                                            href="#"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
                                        >
                                            {ctaLabel}
                                            <ArrowRight className="h-3 w-3" />
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {BATCHES.map((batch) => {
                    const seatsNum = parseInt(batch.seats);
                    const isUrgent = seatsNum <= 10;
                    return (
                        <div key={batch.name} className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-bold text-foreground">{batch.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">{batch.program}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isUrgent ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {isUrgent && <AlertCircle className="h-2.5 w-2.5" />}
                                    {batch.seats}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium mb-3">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {batch.timing}
                                </span>
                                <span>•</span>
                                <span>{batch.mode}</span>
                            </div>
                            <a
                                href="#"
                                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
                            >
                                {ctaLabel} <ArrowRight className="h-3 w-3" />
                            </a>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
