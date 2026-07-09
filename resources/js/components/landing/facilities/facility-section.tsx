import { Check, Library, Monitor, Dumbbell, Building, Trophy, Wifi, type LucideIcon } from 'lucide-react';

// Facility interface for backend data
interface Facility {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string;
    features?: string[];
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
    Library,
    Monitor,
    Dumbbell,
    Building,
    Trophy,
    Wifi,
};

interface FacilitySectionProps {
    facility: Facility;
}

export function FacilitySection({ facility }: FacilitySectionProps) {
    const Icon = iconMap[facility.icon] || Library;

    return (
        <section id={facility.id} className="scroll-mt-24 h-full">
            <div className="natural-card rounded-2xl h-full overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30">
                {/* Header with gradient accent */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${facility.color.includes('primary') ? 'from-primary to-primary/60' :
                    facility.color.includes('info') ? 'from-blue-500 to-blue-400' :
                        facility.color.includes('success') ? 'from-emerald-500 to-emerald-400' :
                            facility.color.includes('warning') ? 'from-amber-500 to-amber-400' :
                                facility.color.includes('destructive') ? 'from-rose-500 to-rose-400' : 'from-primary to-primary/60'
                    }`} />

                <div className="p-6 flex flex-col h-[calc(100%-6px)]">
                    {/* Icon and Title Row */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl ${facility.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {facility.name}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-grow">
                        {facility.description}
                    </p>

                    {/* Features - Fixed height section */}
                    {facility.features && facility.features.length > 0 && (
                        <div className="pt-4 border-t border-border/50">
                            <div className="flex flex-wrap gap-2">
                                {facility.features.map((feature, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-muted/50 text-muted-foreground font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        <Check className="w-3 h-3 text-primary" />
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
