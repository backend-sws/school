import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

const CLASSES = [
    { name: 'Nursery & KG', grades: 'Nursery, LKG, UKG', color: 'from-pink-500 to-rose-500', students: '120+' },
    { name: 'Primary', grades: 'Class 1 – 5', color: 'from-blue-500 to-cyan-500', students: '350+' },
    { name: 'Middle School', grades: 'Class 6 – 8', color: 'from-emerald-500 to-green-500', students: '280+' },
    { name: 'Secondary', grades: 'Class 9 – 10', color: 'from-amber-500 to-orange-500', students: '220+' },
    { name: 'Senior Secondary', grades: 'Class 11 – 12', color: 'from-violet-500 to-purple-500', students: '180+' },
];

/**
 * ClassesOverview — School-specific landing section.
 * Displays class groups (Nursery→12) as colorful cards with student counts.
 */
export function ClassesOverview() {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Our Classes
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                {CLASSES.map((cls) => (
                    <div
                        key={cls.name}
                        className="group relative rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                        {/* Gradient accent */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cls.color}`} />

                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cls.color} text-white`}>
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">
                                {cls.students}
                            </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-foreground mb-1 tracking-tight">
                            {cls.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                            {cls.grades}
                        </p>

                        <div className="mt-4 pt-3 border-t border-border/50">
                            <a
                                href="#"
                                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider transition-colors group-hover:gap-2.5"
                            >
                                View Details
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
