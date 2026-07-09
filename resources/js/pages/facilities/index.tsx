import { useInstitution } from '@/hooks/use-institution';
import PublicLayout from '@/layouts/public/public-layout';
import { FacilitySection } from '@/components/landing/facilities/facility-section';

interface Facility {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string;
    features: string[];
}

interface PageProps {
    facilities: Facility[];
}

export default function Facilities({ facilities }: PageProps) {
    const { name, location, affiliation } = useInstitution();

    return (
        <PublicLayout
            title={`Facilities & Services | ${name}`}
            description={`Campus facilities and services at ${name}, ${location}. Library, labs, hostel, sports, and student amenities. ${affiliation}.`}
        >
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-background overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Campus Infrastructure
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-foreground tracking-tight">
                        Facilities & Services
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Explore our comprehensive range of facilities designed to support your academic journey and campus life.
                    </p>

                    <nav className="flex justify-center items-center space-x-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-foreground">Facilities & Services</span>
                    </nav>
                </div>
            </section>

            {/* Facilities Grid */}
            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                        {(facilities || []).map((facility: Facility) => (
                            <FacilitySection
                                key={facility.id}
                                facility={facility}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
