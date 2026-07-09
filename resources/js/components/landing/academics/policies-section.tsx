import { Shield, AlertTriangle, FileText, Phone } from 'lucide-react';
import {
    DISCIPLINARY_RULES as DEFAULT_RULES,
    ANTI_RAGGING_POINTS as DEFAULT_ANTI_RAGGING,
    ATTENDANCE_POLICIES as DEFAULT_ATTENDANCE,
    ANTI_RAGGING_HELPLINE as DEFAULT_HELPLINE
} from '@/constants';

interface PoliciesSectionProps {
    rules?: string[];
    antiRagging?: string[];
    helpline?: string;
    attendance?: any[];
}

export function PoliciesSection({
    rules = DEFAULT_RULES,
    antiRagging = DEFAULT_ANTI_RAGGING,
    helpline = DEFAULT_HELPLINE,
    attendance = DEFAULT_ATTENDANCE
}: PoliciesSectionProps) {

    const conductRules = rules || DEFAULT_RULES;
    const raggingPoints = antiRagging || DEFAULT_ANTI_RAGGING;
    const supportHelpline = helpline || DEFAULT_HELPLINE;
    const attendancePolicies = attendance || DEFAULT_ATTENDANCE;

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <div className="section-title-label">Rules & Policies</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Code of Conduct
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                    Important policies and guidelines that all students must follow for a disciplined academic environment.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Anti-Ragging Policy */}
                <div className="natural-card rounded-xl p-6 border-l-4 border-l-destructive">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Anti-Ragging Policy</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Ragging in any form is strictly prohibited and is a criminal offense under UGC regulations and university guidelines.
                                Offenders will face strict disciplinary action including expulsion.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {raggingPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs font-semibold text-foreground mb-1">Anti-Ragging Helpline</p>
                                <a href={`tel:${supportHelpline}`} className="text-sm text-primary font-medium flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {supportHelpline} (Toll Free)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disciplinary Rules */}
                <div className="natural-card rounded-xl p-6 border-l-4 border-l-primary">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Disciplinary Rules</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Students are expected to maintain discipline and decorum on campus at all times.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {conductRules.map((rule, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Policy */}
            <div className="natural-surface rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Attendance Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {attendancePolicies.map((policy, i) => (
                        <div key={i} className="p-4 bg-background rounded-lg border border-border">
                            <div className={`text-2xl font-bold mb-1 ${policy.variant === 'primary' ? 'text-primary' :
                                policy.variant === 'warning' ? 'text-warning' :
                                    'text-destructive'
                                }`}>
                                {policy.threshold}
                            </div>
                            <p className="text-sm text-muted-foreground">{policy.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
