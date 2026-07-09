import { useInstitution } from '@/hooks/use-institution';

interface AboutHeroProps {
    title?: string;
    subtitle?: string;
    description?: string;
}

export function AboutHero({ title, subtitle, description }: AboutHeroProps) {
    const { name, location, established } = useInstitution();

    return (
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />

                {/* Subtle Grid Pattern (Standard CSS/Tailwind) */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <div className="inline-block px-4 py-1.5 mb-8 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                    Established Since {established}
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif mb-8 text-foreground tracking-tight leading-[1.05]">
                    Excellence in <span className="text-primary italic relative">
                        Education
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full" />
                    </span>, <br className="hidden md:block" />
                    Rooted in <span className="text-primary italic relative">
                        Heritage
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full" />
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-3xl mx-auto mb-10 leading-relaxed">
                    {name}, {location} is a cornerstone of academic brilliance,
                    dedicated to nurturing character and competence in the heart of Nalanda.
                </p>

                {/* Breadcrumbs */}
                <nav className="flex justify-center items-center space-x-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                    <a href="/" className="hover:text-primary transition-colors">Home</a>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-foreground">About Us</span>
                </nav>
            </div>

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
}
