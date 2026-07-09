import { Quote } from 'lucide-react';
import { useInstitution } from '@/hooks/use-institution';

interface AboutPrincipalsDeskProps {
    name?: string;
    designation?: string;
    message?: string;
    image?: string;
}

export function AboutPrincipalsDesk({ name, designation, message, image }: AboutPrincipalsDeskProps) {
    const { name: institutionName } = useInstitution();

    // Defaults
    const principalName = name || 'Dr. Anand Prakash Gupta';
    const principalDesignation = designation || `Principal, ${institutionName || 'the Institution'}`;
    const principalMessage = message || `"Our mission is to empower every student with the knowledge and character needed to excel in an ever-evolving world. At ${institutionName || 'our institution'}, we don't just teach; we inspire excellence."`;
    const principalImage = image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800';
    return (
        <section className="py-24 bg-card border-y border-border/50 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-serif font-black select-none">
                    P
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* Image Column */}
                    <div className="lg:col-span-5">
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border-8 border-background bg-muted relative group">
                                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500" />
                                <img
                                    src={principalImage}
                                    alt={principalName}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                />
                            </div>

                            {/* Experience/Badge */}
                            <div className="absolute -bottom-6 -right-6 md:right-10 bg-primary text-primary-foreground p-8 rounded-3xl shadow-2xl">
                                <div className="text-3xl font-bold font-serif mb-1">25+</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Years of Academic Leadership</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                            Principal's Message
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-foreground leading-tight">
                            Leading with <span className="text-primary italic">Inspiration</span> and Purpose.
                        </h2>

                        <div className="relative mb-10">
                            <Quote className="absolute -top-6 -left-8 w-16 h-16 text-primary/10 -z-10" />
                            <p className="text-xl md:text-2xl text-muted-foreground font-serif italic leading-relaxed">
                                {principalMessage}
                            </p>
                        </div>

                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <p>
                                It is my great pleasure to welcome you to {institutionName || 'our institution'}. As an institution rooted in academic excellence, we carry forward a legacy of intellectual pursuit and academic rigor.
                            </p>
                            <p>
                                We believe in holistic development—balancing academic excellence with creative exploration and physical well-being. Our dedicated faculty and staff are committed to creating an environment that nurtures curiosity and fosters integrity.
                            </p>
                        </div>

                        <div className="mt-12 pt-12 border-t border-border/50">
                            <div className="font-serif text-2xl font-bold text-foreground">{principalName}</div>
                            <div className="text-sm font-bold uppercase tracking-widest text-primary mt-1">{principalDesignation}</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
