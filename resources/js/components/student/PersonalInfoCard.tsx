import React from "react";
import { User } from "lucide-react";

interface PersonalInfoCardProps {
    personalInfo: {
        father_name: string;
        mother_name: string;
        aadhar_no?: string;
        category: string;
        blood_group?: string;
    };
}

export const PersonalInfoCard = ({ personalInfo }: PersonalInfoCardProps) => {
    return (
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6">
                <User className="size-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                    Guardian & Personal
                </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {[
                    { label: "Father's Name", value: personalInfo.father_name },
                    { label: "Mother's Name", value: personalInfo.mother_name },
                    { label: "Aadhar No", value: personalInfo.aadhar_no || "N/A" },
                    { label: "Category", value: personalInfo.category },
                    { label: "Blood Group", value: personalInfo.blood_group || "N/A" },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                    >
                        <span className="text-xs font-semibold text-muted-foreground uppercase px-2 py-0.5 rounded-full bg-muted/50">
                            {item.label}
                        </span>
                        <span className="text-sm font-bold">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
