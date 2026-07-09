import { Users, GraduationCap, Layers, FlaskConical } from 'lucide-react';
import type { WelcomePageProps } from '@/types/website';

interface SchoolTrustBarProps {
    stats?: WelcomePageProps['stats'];
}

const DEFAULT_STATS = [
    { value: '2000+', label: 'Students', icon: Users },
    { value: '80+', label: 'Teachers', icon: GraduationCap },
    { value: '15+', label: 'Grade Levels', icon: Layers },
    { value: '10+', label: 'Modern Labs', icon: FlaskConical },
];

/**
 * SchoolTrustBar — Warm horizontal stat bar for school landing pages.
 * Shows key numbers (students, teachers, grades, labs) as animated counters
 * over a warm gradient background. Parent-facing: builds confidence.
 */
export function SchoolTrustBar({ stats }: SchoolTrustBarProps) {
    const items = stats?.length
        ? stats.map((s, i) => ({ ...s, icon: DEFAULT_STATS[i]?.icon ?? Users }))
        : DEFAULT_STATS;

    return (
        <section className="py-6 sm:py-8 md:py-10">
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/10 px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {items.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center gap-2 sm:gap-3 group"
                            >
                                <div className="p-3 sm:p-4 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-110 duration-300">
                                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-none">
                                        {stat.value}
                                    </p>
                                    <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
