import { BookOpen, FlaskConical, Lightbulb, FileText, ArrowRight } from 'lucide-react';

const RESEARCH_STATS = [
    { label: 'Publications', value: '2,500+', icon: FileText, color: 'text-primary' },
    { label: 'Funded Projects', value: '120+', icon: FlaskConical, color: 'text-primary' },
    { label: 'Patents Filed', value: '45+', icon: Lightbulb, color: 'text-primary' },
    { label: 'Research Journals', value: '8', icon: BookOpen, color: 'text-primary' },
];

const FEATURED_PAPERS = [
    { title: 'Machine Learning Applications in Agricultural Yield Prediction', authors: 'Dr. A. Kumar et al.', journal: 'Journal of AI Research, 2025', citations: 142 },
    { title: 'Novel Synthesis of Biodegradable Polymers from Renewable Sources', authors: 'Prof. S. Verma et al.', journal: 'Green Chemistry Letters, 2025', citations: 89 },
    { title: 'Impact of Digital Governance on Rural Development', authors: 'Dr. N. Gupta et al.', journal: 'Public Policy Review, 2024', citations: 67 },
];

/**
 * ResearchWing — University-specific landing section.
 * Showcases research metrics and featured publications.
 * Unique to universities — builds academic credibility.
 */
export function ResearchWing() {
    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Research & Innovation
                </h2>
            </div>

            {/* Research Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {RESEARCH_STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="text-center p-4 sm:p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-all"
                        >
                            <Icon className={`h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-2 ${stat.color}`} />
                            <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tighter">
                                {stat.value}
                            </p>
                            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                {stat.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Featured Publications */}
            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-8">
                <h3 className="text-xs sm:text-sm font-bold text-foreground mb-4 sm:mb-5">
                    Featured Publications
                </h3>
                <div className="space-y-4">
                    {FEATURED_PAPERS.map((paper) => (
                        <div
                            key={paper.title}
                            className="group p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors"
                        >
                            <p className="text-sm font-bold text-foreground leading-tight mb-1">
                                {paper.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-2">
                                {paper.authors} • {paper.journal}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-primary">
                                    {paper.citations} citations
                                </span>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Read <ArrowRight className="h-2.5 w-2.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
