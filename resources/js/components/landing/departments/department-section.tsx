import { useState } from 'react';
import { ChevronDown, User, Phone, GraduationCap, AlertCircle } from 'lucide-react';
import type { Department, DepartmentCategory } from '@/constants';

interface DepartmentSectionProps {
    category: DepartmentCategory;
    departments: Department[];
}

import { Button } from '@/components/ui/button';

export function DepartmentSection({ category, departments }: DepartmentSectionProps) {
    const [expandedDept, setExpandedDept] = useState<string | null>(null);

    const toggleDept = (deptId: string) => {
        setExpandedDept(expandedDept === deptId ? null : deptId);
    };

    return (
        <section id={category.id} className="scroll-mt-24">
            {/* Section Header */}
            <div className="mb-6">
                <div className="section-title-label">{category.description}</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center text-lg`}>
                        {category.icon}
                    </span>
                    {category.name}
                </h2>
                <p className="text-muted-foreground">
                    Explore subjects and faculty members in the {category.name.toLowerCase()}.
                </p>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {departments.map((dept) => (
                    <div
                        key={dept.id}
                        className="natural-card rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/30"
                    >
                        {/* Accordion Header */}
                        <Button
                            variant="ghost"
                            onClick={() => toggleDept(dept.id)}
                            className="w-full flex items-center justify-between p-4 text-left focus-ring rounded-xl h-auto hover:bg-transparent"
                            aria-expanded={expandedDept === dept.id}
                            aria-controls={`dept-content-${dept.id}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{dept.name}</h3>
                                    <span className="text-xs text-muted-foreground">
                                        {dept.faculty.length > 0
                                            ? `${dept.faculty.length} Faculty Member${dept.faculty.length > 1 ? 's' : ''}`
                                            : 'No faculty data'}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expandedDept === dept.id ? 'rotate-180' : ''
                                    }`}
                            />
                        </Button>

                        {/* Accordion Content */}
                        <div
                            id={`dept-content-${dept.id}`}
                            className={`overflow-hidden transition-all duration-300 ${expandedDept === dept.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-4 pb-4">
                                {dept.faculty.length > 0 ? (
                                    <div className="natural-surface rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left p-3 font-semibold text-foreground">Name</th>
                                                    <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">Qualification</th>
                                                    <th className="text-left p-3 font-semibold text-foreground">Designation</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {dept.faculty.map((member, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                                                                    {member.name.charAt(0)}
                                                                </div>
                                                                <span className="text-foreground font-medium">{member.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-muted-foreground hidden sm:table-cell">
                                                            {member.qualification || '—'}
                                                        </td>
                                                        <td className="p-3">
                                                            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                                                                {member.designation}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="natural-surface rounded-lg p-6 text-center">
                                        <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            Faculty information will be updated soon.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
