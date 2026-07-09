import { useInstitution } from '@/hooks/use-institution';
import PublicLayout from '@/layouts/public/public-layout';
import { ApprovalContent } from '@/components/landing/approval/approval-content';
import { Button } from '@/components/ui/button';

interface ApprovalDocument {
    title: string;
    date: string;
    size: string;
    url: string;
}

interface ApprovalSection {
    id: string;
    name: string;
    shortName: string;
    description: string;
    fullDescription: string;
    icon: string;
    color: string;
    documents: ApprovalDocument[];
}

interface PageProps {
    approvalSections: ApprovalSection[];
}

export default function Approval({ approvalSections }: PageProps) {
    const { name, affiliation } = useInstitution();

    return (
        <PublicLayout
            title={`Approvals & Recognitions | ${name}`}
            description={`Regulatory approvals and recognitions for ${name}. NAAC, UGC, university affiliation, and accreditation documents. ${affiliation}.`}
        >
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-background overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Accreditation & Affiliation
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-foreground tracking-tight">
                        Approvals & Recognitions
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        We maintain high standards of academic quality through regular certifications and affiliations with national and state-level bodies.
                    </p>

                    <nav className="flex justify-center items-center space-x-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-foreground">Approvals</span>
                    </nav>
                </div>
            </section>

            {/* Content Section */}
            <section className="pb-24">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8 space-y-32">
                    <div className="space-y-24">
                        {(approvalSections || []).map((section: ApprovalSection) => (
                            <div key={section.id} id={section.id} className="scroll-mt-24">
                                <ApprovalContent section={section} />
                            </div>
                        ))}
                    </div>

                    {/* Help/Notice Card */}
                    <div className="natural-card bg-primary/5 border border-primary/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/20 transition-colors" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 max-w-5xl mx-auto">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-foreground">Need official verification?</h3>
                                <p className="text-muted-foreground max-w-xl leading-relaxed font-medium">
                                    If you require physical copies of these approvals or a certified verification from the principal's office, please visit our campus during office hours.
                                </p>
                            </div>
                            <Button variant="premium" className="shrink-0">
                                Contact Office
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
