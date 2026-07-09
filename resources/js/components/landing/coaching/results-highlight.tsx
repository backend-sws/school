import { Trophy, Star, TrendingUp, Medal } from 'lucide-react';

const TOPPERS = [
    { name: 'Aisha Sharma', rank: 'AIR 42', exam: 'JEE Advanced 2025', year: '2025' },
    { name: 'Rahul Kumar', rank: 'AIR 156', exam: 'NEET UG 2025', year: '2025' },
    { name: 'Priya Singh', rank: 'AIR 23', exam: 'UPSC CSE 2024', year: '2024' },
    { name: 'Arjun Patel', rank: 'AIR 89', exam: 'JEE Advanced 2024', year: '2024' },
];

const STATS = [
    { label: 'Total Selections', value: '1200+', icon: Trophy, color: 'text-primary' },
    { label: 'Top 100 Ranks', value: '50+', icon: Medal, color: 'text-primary' },
    { label: 'Success Rate', value: '95%', icon: TrendingUp, color: 'text-primary' },
    { label: 'Years of Excellence', value: '15+', icon: Star, color: 'text-primary' },
];

/**
 * ResultsHighlight — Coaching-specific landing section.
 * Showcases toppers with trophy-style cards and bold statistics.
 * Social proof that drives enrollments.
 */
export function ResultsHighlight() {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Results & Achievements
                </h2>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="text-center p-4 sm:p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-all"
                        >
                            <Icon className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 ${stat.color}`} />
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tighter">
                                {stat.value}
                            </p>
                            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                {stat.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Toppers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TOPPERS.map((topper) => (
                    <div
                        key={topper.name}
                        className="relative rounded-2xl border border-border bg-card p-5 text-center overflow-hidden group hover:border-primary/30 transition-colors"
                    >
                        {/* Gold accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />

                        <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-3">
                            <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                        </div>

                        <p className="text-sm font-bold text-foreground mb-0.5">{topper.name}</p>
                        <p className="text-lg sm:text-xl font-bold text-primary tracking-tight mb-1">
                            {topper.rank}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            {topper.exam}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
