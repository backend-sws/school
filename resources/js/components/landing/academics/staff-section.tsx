import { Phone, GraduationCap, Building } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TEACHING_STAFF as DEFAULT_TEACHING, NON_TEACHING_STAFF as DEFAULT_NON_TEACHING } from '@/constants';

type StaffType = 'teaching' | 'non-teaching';

interface StaffSectionProps {
    teachingStaff?: any[];
    nonTeachingStaff?: any[];
}

export function StaffSection({
    teachingStaff = DEFAULT_TEACHING,
    nonTeachingStaff = DEFAULT_NON_TEACHING
}: StaffSectionProps) {
    const [staffType, setStaffType] = useState<StaffType>('teaching');

    const teaching = teachingStaff || DEFAULT_TEACHING;
    const nonTeaching = nonTeachingStaff || DEFAULT_NON_TEACHING;

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <div className="section-title-label">Our Team</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Faculty & Staff Directory
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                    Meet our dedicated team of educators and support staff committed to your academic success.
                </p>
            </div>

            {/* Toggle */}
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg border border-border/50 w-fit">
                <Button
                    variant={staffType === 'teaching' ? 'default' : 'ghost'}
                    onClick={() => setStaffType('teaching')}
                    className="px-4 py-2 h-auto text-sm font-medium transition-colors"
                >
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Teaching Staff
                </Button>
                <Button
                    variant={staffType === 'non-teaching' ? 'default' : 'ghost'}
                    onClick={() => setStaffType('non-teaching')}
                    className="px-4 py-2 h-auto text-sm font-medium transition-colors"
                >
                    <Building className="w-4 h-4 inline mr-2" />
                    Non-Teaching Staff
                </Button>
            </div>

            {/* Staff Grid */}
            {staffType === 'teaching' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teaching.map((staff, i) => (
                        <div key={i} className="natural-card rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {(staff.name || 'S').charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground truncate">{staff.name}</h3>
                                    <p className="text-sm text-primary">{staff.designation}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{staff.department}</p>
                                    <p className="text-xs text-muted-foreground">{staff.qualification}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="natural-card rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-foreground">Name</th>
                                <th className="text-left p-4 text-sm font-semibold text-foreground">Designation</th>
                                <th className="text-left p-4 text-sm font-semibold text-foreground hidden md:table-cell">Department</th>
                                <th className="text-left p-4 text-sm font-semibold text-foreground">Contact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {nonTeaching.map((staff, i) => (
                                <tr key={i} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 text-sm text-foreground">{staff.name}</td>
                                    <td className="p-4 text-sm text-muted-foreground">{staff.designation}</td>
                                    <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{staff.department}</td>
                                    <td className="p-4 text-sm">
                                        <a href={`tel:${staff.contact}`} className="text-primary hover:underline flex items-center gap-1">
                                            <Phone className="w-3.5 h-3.5" />
                                            {staff.contact}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
