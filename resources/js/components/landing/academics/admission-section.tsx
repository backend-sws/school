import { Calendar, Download, ExternalLink } from 'lucide-react';
import {
    ADMISSION_STEPS as DEFAULT_STEPS,
    ADMISSION_IMPORTANT_DATES as DEFAULT_DATES,
    ADMISSION_DOWNLOADS as DEFAULT_DOWNLOADS
} from '@/constants';

interface AdmissionSectionProps {
    steps?: any[];
    dates?: any[];
    downloads?: any[];
}

export function AdmissionSection({
    steps = DEFAULT_STEPS,
    dates = DEFAULT_DATES,
    downloads = DEFAULT_DOWNLOADS
}: AdmissionSectionProps) {
    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <div className="section-title-label">Admission Process</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Join Our Academic Community
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                    Follow these simple steps to complete your admission to our college.
                    For any queries, contact the admission office.
                </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(steps || []).map((item) => (
                    <div
                        key={item.step}
                        className="natural-card rounded-xl p-6 hover:border-primary/30 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {item.step}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Important Dates & Downloads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Important Dates */}
                <div className="natural-card rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Important Dates
                    </h3>
                    <div className="space-y-3">
                        {(dates || []).map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                                <span className="text-muted-foreground">{item.event}</span>
                                <span className="font-medium text-foreground">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Downloads */}
                <div className="natural-card rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-primary" />
                        Downloads & Resources
                    </h3>
                    <div className="space-y-3">
                        {(downloads || []).map((doc, i) => (
                            <a
                                key={i}
                                href={doc.href}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-accent/50 transition-colors group"
                            >
                                <span className="text-sm font-medium">{doc.name}</span>
                                <span className="text-xs text-muted-foreground group-hover:text-primary">{doc.type} ↓</span>
                            </a>
                        ))}
                    </div>

                    <a
                        href="#"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Apply Online Now
                    </a>
                </div>
            </div>
        </div>
    );
}
