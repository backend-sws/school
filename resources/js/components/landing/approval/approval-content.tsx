import { type ApprovalSection } from '@/constants';
import { FileText, Download, Calendar, HardDrive, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ApprovalContentProps {
    section: ApprovalSection;
}

export function ApprovalContent({ section }: ApprovalContentProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start border-t border-border/50 pt-16 group first:border-t-0 first:pt-0">
            {/* Left Column: Info */}
            <div className="w-full lg:w-1/3 pt-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] w-8 bg-primary" />
                    <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{section.shortName}</h3>
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-border group-hover:scale-110 transition-transform duration-300",
                        section.color
                    )}>
                        {section.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">{section.name}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-lg">
                    {section.fullDescription}
                </p>
            </div>

            {/* Right Column: Documents */}
            <div className="flex-1 w-full space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Verification Documents
                    </h4>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                        {section.documents.length} Files Available
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    {section.documents.length > 0 ? (
                        section.documents.map((doc, idx) => (
                            <div
                                key={idx}
                                className="natural-card group/doc bg-card/50 hover:bg-muted/30 border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover/doc:scale-110",
                                        section.color,
                                        "border-current/10"
                                    )}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-foreground group-hover/doc:text-primary transition-colors line-clamp-1">
                                            {doc.title}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {doc.date}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <HardDrive className="w-3 h-3" />
                                                {doc.size}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl h-9 text-[10px] font-bold uppercase tracking-widest gap-2 bg-background hover:bg-primary hover:text-primary-foreground border-border hover:border-primary transition-all duration-300"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-xl h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all duration-300"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-12 rounded-3xl border border-dashed border-border bg-muted/10 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h4 className="font-bold text-foreground mb-1">No Documents Yet</h4>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Verification documents for this section are being processed and will be available soon.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
