import { BookOpen, Download, FileText } from 'lucide-react';
import { SYLLABUS_DEPARTMENTS } from '@/constants';

interface SyllabusSectionProps {
    departments?: { name: string; subjects: string[] }[];
}

export function SyllabusSection({ departments }: SyllabusSectionProps) {
    const syllabusDepartments = departments || SYLLABUS_DEPARTMENTS;
    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <div className="section-title-label">Syllabus</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Course Curricula
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                    Download the latest syllabus for all undergraduate programs as prescribed by Patliputra University.
                </p>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {syllabusDepartments.map((dept) => (
                    <div key={dept.name} className="natural-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">{dept.name}</h3>
                        </div>
                        <ul className="space-y-2 mb-4">
                            {dept.subjects.map((subject, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-center justify-between">
                                    <span>{subject}</span>
                                    <a href="#" className="text-primary hover:underline text-xs">
                                        <Download className="w-3.5 h-3.5" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <a
                            href="#"
                            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                            <FileText className="w-4 h-4" />
                            Download All
                        </a>
                    </div>
                ))}
            </div>

            {/* Note */}
            <div className="natural-surface rounded-xl p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Syllabus is subject to change as per university guidelines.
                Always refer to the official Patliputra University website for the latest updates.
            </div>
        </div>
    );
}
