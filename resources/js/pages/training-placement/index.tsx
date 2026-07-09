import { Phone, Mail, MapPin, FileText, Users, Briefcase, Target, Award } from 'lucide-react';
import { useInstitution } from '@/hooks/use-institution';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';

// Types for backend props
interface PlacementStat {
    value: string;
    label: string;
    color: string;
}

interface PlacementService {
    icon: string;
    title: string;
    description: string;
    color: string;
}

interface PlacementOfficer {
    name: string;
    designation: string;
    phone: string;
    email: string;
    address: string;
}

interface PlacementAbout {
    title: string;
    subtitle: string;
    description: string;
    mission: string;
}

interface PageProps {
    placementAbout: PlacementAbout;
    placementStats: PlacementStat[];
    placementServices: PlacementService[];
    placementOfficer: PlacementOfficer;
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    FileText,
    Users,
    Briefcase,
    Target,
    Award,
};

export default function TrainingPlacement({
    placementAbout,
    placementStats,
    placementServices,
    placementOfficer
}: PageProps) {
    const { name, affiliation } = useInstitution();

    return (
        <PublicLayout
            title={`Training & Placement | ${name}`}
            description={`Training & Placement Cell at ${name}. Internships, industry partnerships, placement support, and career guidance. ${affiliation}.`}
        >
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-background overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        {placementAbout?.subtitle || 'Bridging Academics and Industry'}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-foreground tracking-tight">
                        {placementAbout?.title || 'Training & Placement Cell'}
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        {placementAbout?.mission || 'Empowering students with skills and opportunities.'}
                    </p>

                    <nav className="flex justify-center items-center space-x-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-foreground">Training & Placement</span>
                    </nav>
                </div>
            </section>

            {/* Content Container */}
            <div className="mx-auto max-w-[1440px] px-4 md:px-8">

                {/* Statistics Section */}
                <section className="py-8 md:py-12">
                    <div className="relative rounded-3xl bg-card border border-border p-8 overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-[1px] w-8 bg-primary" />
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Placement Highlights</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(placementStats || []).map((stat: PlacementStat, i: number) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "rounded-2xl border p-6 hover:border-primary/30 transition-colors duration-300 flex flex-col items-center justify-center text-center",
                                        stat.color
                                    )}
                                >
                                    <p className="text-3xl sm:text-4xl font-bold mb-1 tracking-tighter">
                                        {stat.value}
                                    </p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest leading-tight opacity-80">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="pb-8 md:pb-12">
                    <div className="natural-card rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-[1px] w-8 bg-primary" />
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">About Us</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed max-w-4xl">
                            {placementAbout?.description || 'The Training and Placement Cell is dedicated to preparing students for successful careers.'}
                        </p>
                    </div>
                </section>

                {/* Services Section */}
                <section className="pb-8 md:pb-12 border-t border-border/50 pt-8 md:pt-12">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-[1px] w-8 bg-primary" />
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">What We Offer</h3>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Our Services
                        </h2>
                        <p className="text-muted-foreground max-w-2xl">
                            Comprehensive support to help you succeed in your career journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(placementServices || []).map((service: PlacementService, i: number) => {
                            const Icon = iconMap[service.icon] || FileText;
                            return (
                                <div
                                    key={i}
                                    className="natural-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300",
                                        service.color
                                    )}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="pb-12 md:pb-16 border-t border-border/50 pt-8 md:pt-12">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-[1px] w-8 bg-primary" />
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Get in Touch</h3>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            Contact Placement Cell
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Officer Card */}
                        <div className="natural-card rounded-2xl p-6 flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                                <span className="text-2xl font-bold text-primary-foreground">
                                    {(placementOfficer?.name || 'P').charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground leading-tight">
                                    {placementOfficer?.name || 'Placement Officer'}
                                </h3>
                                <p className="text-sm text-primary font-medium">
                                    {placementOfficer?.designation || 'Training & Placement Cell'}
                                </p>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <a
                            href={`tel:${placementOfficer?.phone || ''}`}
                            className="natural-card rounded-2xl p-6 flex items-center gap-5 group hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Phone</p>
                                <p className="text-foreground font-semibold group-hover:text-primary transition-colors">
                                    {placementOfficer?.phone || '+91 XXXX XXX XXX'}
                                </p>
                            </div>
                        </a>

                        {/* Email Card */}
                        <a
                            href={`mailto:${placementOfficer?.email || ''}`}
                            className="natural-card rounded-2xl p-6 flex items-center gap-5 group hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Email</p>
                                <p className="text-foreground font-semibold group-hover:text-primary transition-colors">
                                    {placementOfficer?.email || 'placement@college.edu.in'}
                                </p>
                            </div>
                        </a>
                    </div>

                    {/* Address Banner */}
                    <div className="mt-6 natural-card rounded-2xl p-6 flex items-start gap-5">
                        <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Address</p>
                            <p className="text-foreground font-medium">
                                {placementOfficer?.address || 'Training & Placement Cell, College Address'}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
