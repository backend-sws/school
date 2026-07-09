import { ArrowRight, Download } from 'lucide-react';

/**
 * AdmissionsCTA — School-specific full-width admission call-to-action banner.
 * Creates urgency for parents visiting the site with a warm gradient background.
 * Placed just before the footer for maximum conversion.
 */
export function AdmissionsCTA() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const sessionLabel = `${currentYear}–${String(nextYear).slice(-2)}`;

    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-16">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                    <div className="text-center md:text-left">
                        <span className="inline-block px-3 py-1 mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase bg-white/15 text-primary-foreground rounded-full border border-white/20">
                            Admissions Open
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight mb-2 sm:mb-3">
                            Enroll for Session {sessionLabel}
                        </h2>
                        <p className="text-sm sm:text-base text-primary-foreground/80 font-medium max-w-lg">
                            Applications open for Nursery to Class XII. Limited seats available.
                            Give your child the best start.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
                        <a
                            href="/academics#admission"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-white text-primary text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors group"
                        >
                            Apply Now
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </a>
                        <a
                            href="#"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-white/10 text-primary-foreground text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl border border-white/20 hover:bg-white/20 transition-colors group"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Prospectus
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
