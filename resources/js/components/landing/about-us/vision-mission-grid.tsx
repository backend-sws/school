import { Eye, Target, Award, CheckCircle2 } from 'lucide-react';

interface VisionMissionGridProps {
    vision?: string;
    mission?: string;
}

export function VisionMissionGrid({ vision, mission }: VisionMissionGridProps) {
    const goals = [
        "Promote student welfare and overall development.",
        "Inculcate discipline and devotion for responsible citizenship.",
        "Impart higher education to rural students of the region.",
        "Prepare students for global competitive challenges."
    ];

    // Default content
    const defaultVision = "To be an institution of excellence, where youths can achieve full potential in their academics, creative, physical and social development so as to become empowered and worthy citizens capable of nurturing the society and nation as well.";
    const defaultMission = "To be the best in imparting knowledge and skills to the students for the overall development of the nation. Our value system is based on dedication, teamwork, and honesty to achieve excellence in all walks of life.";

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Vision Card */}
                    <div className="group p-10 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                            <Eye className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif mb-6 text-foreground">Our Vision</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {vision || defaultVision}
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="group p-10 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden lg:translate-y-8">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                            <Target className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif mb-6 text-foreground">Our Mission</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {mission || defaultMission}
                        </p>
                    </div>

                    {/* Goals Card */}
                    <div className="group p-10 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden lg:translate-y-16">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                            <Award className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif mb-6 text-foreground">Core Goals</h3>
                        <ul className="space-y-4">
                            {goals.map((goal, i) => (
                                <li key={i} className="flex gap-3 text-muted-foreground leading-tight">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{goal}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}
