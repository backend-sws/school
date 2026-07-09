/**
 * Collaborations — University-specific landing section.
 * Displays partner institution logos in a horizontal scroll.
 * Builds international credibility for the university.
 */

const PARTNERS = [
    { name: 'University of Oxford', country: 'UK', initials: 'OX' },
    { name: 'MIT', country: 'USA', initials: 'MIT' },
    { name: 'IIT Delhi', country: 'India', initials: 'IITD' },
    { name: 'National University of Singapore', country: 'Singapore', initials: 'NUS' },
    { name: 'University of Tokyo', country: 'Japan', initials: 'UT' },
    { name: 'ETH Zurich', country: 'Switzerland', initials: 'ETH' },
    { name: 'University of Melbourne', country: 'Australia', initials: 'UoM' },
    { name: 'AIIMS Delhi', country: 'India', initials: 'AIIMS' },
];

export function Collaborations() {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    International Collaborations
                </h2>
            </div>

            <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {PARTNERS.map((partner) => (
                    <div
                        key={partner.name}
                        className="shrink-0 w-[160px] sm:w-[180px] snap-start rounded-2xl border border-border bg-card p-5 sm:p-6 text-center hover:shadow-md hover:border-primary/20 transition-all group"
                    >
                        {/* Logo placeholder (initials) */}
                        <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-xl bg-muted border border-border flex items-center justify-center mb-3 group-hover:border-primary/30 transition-colors">
                            <span className="text-sm sm:text-base font-bold text-muted-foreground/60">
                                {partner.initials}
                            </span>
                        </div>

                        <h3 className="text-xs font-bold text-foreground leading-tight mb-0.5">
                            {partner.name}
                        </h3>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            {partner.country}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
