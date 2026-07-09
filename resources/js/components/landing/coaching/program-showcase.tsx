import { ArrowRight, Clock, Users } from 'lucide-react';

const PROGRAMS = [
    {
        name: 'JEE Main & Advanced',
        description: 'Complete preparation for IIT-JEE with expert faculty',
        duration: '2 Years',
        batches: '5 Active',
        color: 'from-blue-600 to-indigo-600',
        icon: '🎯',
    },
    {
        name: 'NEET UG',
        description: 'Medical entrance preparation with lab-based learning',
        duration: '2 Years',
        batches: '4 Active',
        color: 'from-emerald-600 to-teal-600',
        icon: '🩺',
    },
    {
        name: 'Foundation (9-10)',
        description: 'Board + competitive exam preparation for early starters',
        duration: '2 Years',
        batches: '3 Active',
        color: 'from-amber-500 to-orange-500',
        icon: '📚',
    },
    {
        name: 'UPSC Civil Services',
        description: 'Comprehensive preparation for Prelims, Mains & Interview',
        duration: '1 Year',
        batches: '2 Active',
        color: 'from-violet-600 to-purple-600',
        icon: '🏛️',
    },
    {
        name: 'Banking & SSC',
        description: 'SBI PO, IBPS, SSC CGL & CHSL preparation',
        duration: '6 Months',
        batches: '3 Active',
        color: 'from-rose-500 to-pink-600',
        icon: '🏦',
    },
    {
        name: 'Crash Course',
        description: 'Intensive last-minute revision & practice for all exams',
        duration: '3 Months',
        batches: '6 Active',
        color: 'from-red-500 to-orange-500',
        icon: '⚡',
    },
];

/**
 * ProgramShowcase — Coaching-specific landing section.
 * Bold, results-driven display of programs with batch counts and duration.
 */
export function ProgramShowcase() {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                    <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                        Our Programs
                    </h2>
                </div>
                <a href="#" className="text-[10px] sm:text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="h-3 w-3" />
                </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {PROGRAMS.map((prog) => (
                    <div
                        key={prog.name}
                        className="group relative rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                        {/* Top gradient bar */}
                        <div className={`h-1.5 bg-gradient-to-r ${prog.color}`} />

                        <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{prog.icon}</span>
                                <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight leading-tight">
                                    {prog.name}
                                </h3>
                            </div>

                            <p className="text-xs text-muted-foreground font-medium mb-4 leading-relaxed">
                                {prog.description}
                            </p>

                            <div className="flex items-center gap-4 text-[10px] sm:text-xs text-muted-foreground font-bold">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {prog.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {prog.batches}
                                </span>
                            </div>

                            <div className="mt-4 pt-3 border-t border-border/50">
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider transition-all group-hover:gap-2.5"
                                >
                                    Enroll Now
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
