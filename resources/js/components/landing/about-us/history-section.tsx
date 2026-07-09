import { History, Milestone, CalendarDays } from 'lucide-react';
import { useInstitution } from '@/hooks/use-institution';

interface HistorySectionProps {
    history?: string;
    image?: string;
    logo?: string;
    established?: string;
}

export function HistorySection({ history, image, logo, established = '1978' }: HistorySectionProps) {
    const { name: institutionName } = useInstitution();
    const yearsSince = new Date().getFullYear() - parseInt(established);

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Content Column */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Our Journey
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-foreground leading-tight">
                            A Legacy of Knowledge <br />
                            <span className="text-primary italic">Since {established}</span>
                        </h2>

                        <div className="space-y-8 text-muted-foreground leading-relaxed">
                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mt-1">
                                    <History className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-2">Historical Foundations</h4>
                                    <p>
                                        Established in {established}, {institutionName || 'our institution'} was founded with a vision to provide quality education to the youth of the region.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mt-1">
                                    <Milestone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-2">Academic Evolution</h4>
                                    <p>
                                        From its humble beginnings, the institution has evolved into a premier educational unit, offering diverse programs and fostering academic excellence.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mt-1">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-2">Modern Era</h4>
                                    <p>
                                        Today, we stand as a beacon of modern learning, integrating digital resources and contemporary teaching methodologies while remaining steadfast in our cultural roots.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Column/Decoration */}
                    <div className="order-1 lg:order-2">
                        <div className="relative">
                            {/* Decorative Background Elements */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

                            {/* Multi-image/Styled Image Holder */}
                            <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-muted">
                                <img
                                    src={image || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1466&auto=format&fit=crop"}
                                    alt="College History"
                                    className="w-full aspect-[4/3] object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
                                    <div className="text-white">
                                        <div className="text-4xl font-bold font-serif mb-1">{yearsSince}+ Years</div>
                                        <div className="text-sm font-bold uppercase tracking-widest opacity-80">Of Educational Service</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
