import { BookOpen, Users, FlaskConical, Palette, Calculator, Globe, Briefcase, Minus } from 'lucide-react';
import { ViewAllButton } from './view-all-button';
import { cn } from '@/lib/utils';

const DEPARTMENTS = [
    { name: 'Arts', icon: Palette, color: 'bg-primary/10 text-primary border-primary/20', students: '450+' },
    { name: 'Science', icon: FlaskConical, color: 'bg-primary/10 text-primary border-primary/20', students: '380+' },
    { name: 'Commerce', icon: Calculator, color: 'bg-primary/10 text-primary border-primary/20', students: '320+' },
    { name: 'Languages', icon: Globe, color: 'bg-primary/10 text-primary border-primary/20', students: '280+' },
    { name: 'Management', icon: Briefcase, color: 'bg-primary/10 text-primary border-primary/20', students: '200+' },
    { name: 'Education', icon: BookOpen, color: 'bg-primary/10 text-primary border-primary/20', students: '150+' },
];

export function DepartmentsShowcase() {
    return (
        <section className="py-10 sm:py-14 md:py-20 relative bg-background">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 md:mb-12 gap-4 sm:gap-8 relative z-10 px-3 sm:px-4">
                <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-[1px] w-6 sm:w-10 bg-primary" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">Academic Excellence</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">Our Departments</h2>
                </div>

                <div className="shrink-0 pb-1">
                    <ViewAllButton
                        label="View All Departments"
                        href="#"
                        variant="subtle"
                    />
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 relative z-10 px-3 sm:px-4">
                {DEPARTMENTS.map((dept, idx) => (
                    <a
                        key={idx}
                        href="#"
                        className="group flex flex-col items-center text-center p-3 sm:p-4 md:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/60 hover:border-primary/20 transition-all duration-300"
                    >
                        {/* Icon Box */}
                        <div className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center border transition-all duration-300",
                            dept.color
                        )}>
                            <dept.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                        </div>

                        {/* Content */}
                        <h3 className="text-xs sm:text-sm md:text-[15px] font-bold text-foreground group-hover:text-primary transition-colors mt-3 sm:mt-4 md:mt-5 mb-1 sm:mb-2 tracking-tight">
                            {dept.name}
                        </h3>

                        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest leading-none">
                                {dept.students} Students
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
