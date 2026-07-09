import { STATS } from '@/constants';

interface StatItem {
    value: string;
    label: string;
}

interface StatsGridProps {
    stats?: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
    const items = stats && stats.length > 0 ? stats : STATS;

    return (
        <div className="min-h-[260px] h-auto md:h-[450px] relative group rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-6 md:p-8 overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h3 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">Live Statistics</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 min-h-[180px] md:h-[calc(100%-3.5rem)] relative z-10">
                {items.map((stat: StatItem, i: number) => (
                    <div
                        key={i}
                        className="bg-muted/30 rounded-xl sm:rounded-2xl border border-border/60 p-3 sm:p-4 md:p-5 hover:border-primary/30 transition-colors duration-300 group/item flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-0.5 sm:mb-1 tracking-tighter">
                            {stat.value}
                        </p>
                        <p className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-tight px-1 sm:px-2">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
