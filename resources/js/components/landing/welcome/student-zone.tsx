import { Link } from '@inertiajs/react';
import { studentRegister } from '@/routes/student';
import { Users, FileText, GraduationCap, BookOpen, ClipboardList, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

export function StudentZone() {
    return (
        <div className="min-h-[280px] h-auto md:h-[450px] relative rounded-2xl sm:rounded-3xl bg-card border border-border flex flex-col overflow-hidden transition-all duration-300">
            <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-primary/10 border border-border flex items-center justify-center text-primary shrink-0">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-tight leading-none mb-0.5">Student Zone</h3>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Academic Portal</p>
                    </div>
                </div>

                {/* Main Action - Simple Primary Button */}
                <Link
                    href={studentRegister().url}
                    className="relative flex items-center justify-between w-full py-3 px-4 sm:py-3.5 sm:px-6 mb-5 sm:mb-8 md:mb-10 rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 group/pill touch-manipulation"
                >
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Student Portal</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-6 md:gap-x-6 md:gap-y-8 flex-1 px-0.5 items-center min-h-0">
                    {[
                        { icon: FileText, label: 'Results', color: 'bg-primary/10 text-primary border-primary/20' },
                        { icon: GraduationCap, label: 'Alumni', color: 'bg-primary/10 text-primary border-primary/20' },
                        { icon: BookOpen, label: 'Syllabus', color: 'bg-primary/10 text-primary border-primary/20' },
                        { icon: ClipboardList, label: 'Exams', color: 'bg-primary/10 text-primary border-primary/20' },
                    ].map((item, idx) => (
                        <a
                            key={idx}
                            href="#"
                            className="flex flex-col items-center gap-1.5 sm:gap-2.5 group transition-colors touch-manipulation"
                        >
                            <div className={cn(
                                "w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 border",
                                item.color
                            )}>
                                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-foreground tracking-widest uppercase text-center opacity-80 group-hover:opacity-100 group-hover:text-primary transition-all leading-tight">
                                {item.label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
