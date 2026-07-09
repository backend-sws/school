import { Award, BookOpen } from 'lucide-react';

const FACULTY = [
    { name: 'Dr. Rajesh Mishra', subject: 'Physics', exp: '18 yrs', qualification: 'PhD, IIT Delhi', specialization: 'JEE Advanced' },
    { name: 'Prof. Sunita Verma', subject: 'Chemistry', exp: '15 yrs', qualification: 'MSc, BHU', specialization: 'NEET UG' },
    { name: 'Dr. Amit Sinha', subject: 'Mathematics', exp: '20 yrs', qualification: 'PhD, IISc', specialization: 'JEE Main' },
    { name: 'Prof. Neha Gupta', subject: 'Biology', exp: '12 yrs', qualification: 'PhD, AIIMS', specialization: 'NEET UG' },
    { name: 'Dr. Vikram Jha', subject: 'General Studies', exp: '16 yrs', qualification: 'IAS (Retd.)', specialization: 'UPSC CSE' },
    { name: 'Prof. Kavita Rao', subject: 'Quantitative Aptitude', exp: '10 yrs', qualification: 'MBA, IIM-A', specialization: 'Banking' },
];

/**
 * FacultySpotlight — Coaching-specific landing section.
 * Horizontal scroll of faculty cards with credentials.
 * Faculty credibility is a key conversion driver for coaching centers.
 */
export function FacultySpotlight() {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Our Expert Faculty
                </h2>
            </div>

            <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {FACULTY.map((member) => (
                    <div
                        key={member.name}
                        className="shrink-0 w-[260px] sm:w-[280px] snap-start rounded-2xl border border-border bg-card p-5 sm:p-6 hover:shadow-md transition-all group"
                    >
                        {/* Avatar Placeholder */}
                        <div className="h-16 w-16 sm:h-20 sm:w-20 mx-auto rounded-full bg-muted border-2 border-border flex items-center justify-center mb-4 group-hover:border-primary/30 transition-colors">
                            <span className="text-2xl font-bold text-muted-foreground/40">
                                {member.name.charAt(0)}
                            </span>
                        </div>

                        <div className="text-center mb-4">
                            <h3 className="text-sm font-bold text-foreground mb-0.5 leading-tight">
                                {member.name}
                            </h3>
                            <p className="text-xs text-primary font-bold">{member.subject}</p>
                        </div>

                        <div className="space-y-2 text-[10px] sm:text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Award className="h-3 w-3 text-primary shrink-0" />
                                <span className="font-medium">{member.qualification}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-3 w-3 text-primary shrink-0" />
                                <span className="font-medium">{member.specialization} • {member.exp}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
