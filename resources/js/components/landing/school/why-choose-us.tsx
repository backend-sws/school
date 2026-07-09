import {
    Shield,
    BookOpen,
    Monitor,
    Trophy,
    Users,
    Heart,
} from 'lucide-react';

const USP_ITEMS = [
    {
        icon: BookOpen,
        title: 'Academic Excellence',
        description: 'Proven track record of outstanding board results and academic achievements.',
        color: 'bg-primary/10 text-primary border-primary/20',
    },
    {
        icon: Shield,
        title: 'Safe & Secure Campus',
        description: 'CCTV-monitored premises with trained security and child-safety protocols.',
        color: 'bg-primary/10 text-primary border-primary/20',
    },
    {
        icon: Monitor,
        title: 'Smart Classrooms',
        description: 'Interactive boards, digital learning tools, and technology-integrated teaching.',
        color: 'bg-primary/10 text-primary border-primary/20',
    },
    {
        icon: Trophy,
        title: 'Sports & Fitness',
        description: 'Dedicated sports coaches, playgrounds, and inter-school competitions.',
        color: 'bg-primary/10 text-primary border-primary/20',
    },
    {
        icon: Users,
        title: 'Experienced Faculty',
        description: 'Passionate teachers with years of experience and continuous training.',
        color: 'bg-primary/10 text-primary border-primary/20',
    },
    {
        icon: Heart,
        title: 'Holistic Development',
        description: 'Focus on arts, music, personality development, and life skills beyond academics.',
        color: 'bg-primary/10 text-primary border-primary/20',
    },
];

/**
 * WhyChooseUs — School-specific landing section.
 * Shows 6 USP cards that speak directly to parents' concerns:
 * safety, academics, facilities, faculty, sports, holistic growth.
 */
export function WhyChooseUs() {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Why Choose Us
                </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-6 sm:mb-8">
                Everything Your Child Needs to Thrive
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {USP_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.title}
                            className="group rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-7 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                        >
                            <div className={`inline-flex p-3 rounded-xl border ${item.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5 tracking-tight">
                                {item.title}
                            </h3>
                            <p className="text-xs sm:text-[13px] text-muted-foreground font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
