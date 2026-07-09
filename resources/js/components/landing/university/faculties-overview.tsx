import { ArrowRight } from 'lucide-react';

const FACULTIES = [
    { name: 'Arts & Humanities', departments: 12, students: '2,500+', icon: '📜', color: 'from-rose-500 to-pink-500' },
    { name: 'Science & Technology', departments: 8, students: '3,200+', icon: '🔬', color: 'from-blue-500 to-cyan-500' },
    { name: 'Commerce & Management', departments: 6, students: '1,800+', icon: '📊', color: 'from-emerald-500 to-green-500' },
    { name: 'Engineering', departments: 10, students: '4,000+', icon: '⚙️', color: 'from-amber-500 to-orange-500' },
    { name: 'Law', departments: 4, students: '800+', icon: '⚖️', color: 'from-violet-500 to-purple-500' },
    { name: 'Medicine & Health Sciences', departments: 7, students: '1,500+', icon: '🩺', color: 'from-red-500 to-rose-500' },
];

/**
 * FacultiesOverview — University-specific landing section.
 * Grand display of faculties with department counts and student numbers.
 */
export function FacultiesOverview() {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Our Faculties
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {FACULTIES.map((faculty) => (
                    <div
                        key={faculty.name}
                        className="group relative rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                        {/* Top accent */}
                        <div className={`h-1 bg-gradient-to-r ${faculty.color}`} />

                        <div className="p-5 sm:p-6 md:p-7">
                            <div className="flex items-start gap-4 mb-4">
                                <span className="text-3xl">{faculty.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight leading-tight mb-1">
                                        {faculty.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground font-bold">
                                        <span>{faculty.departments} Departments</span>
                                        <span className="h-3 w-px bg-border" />
                                        <span>{faculty.students} Students</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-border/50">
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider transition-all group-hover:gap-2.5"
                                >
                                    Explore Faculty
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
