import React from "react";
import { GraduationCap, Mail } from "lucide-react";
import R2Api from "@/lib/api/r2Api";
import Each from "@/components/Each";

interface AcademicIdentityCardProps {
    personalInfo: {
        name: string;
        email: string;
        photo_url?: string;
    };
    academicRecord: {
        university_roll_no?: string;
        roll_no: string;
        reg_no: string;
    };
}

export const AcademicIdentityCard = ({
    personalInfo,
    academicRecord,
}: AcademicIdentityCardProps) => {
    return (
        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="relative">
                    <div className="h-32 w-32 rounded-3xl border-4 border-background bg-muted overflow-hidden transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                        {personalInfo.photo_url ? (
                            <div className="h-full w-full">
                                <img
                                    src={R2Api.imageSrc(personalInfo.photo_url)}
                                    alt={personalInfo.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <span className="text-xl font-semibold text-muted-foreground">
                                {personalInfo.name
                                    ?.split(" ")
                                    .map((part) => part.charAt(0))
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase() || "?"}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                            {personalInfo.name}
                        </h2>
                        <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                            <Mail size={14} /> {personalInfo.email}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-border/50">
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                University Roll
                            </p>
                            <p className="font-black text-foreground">
                                {academicRecord.university_roll_no || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                College Roll
                            </p>
                            <p className="font-black text-foreground">
                                {academicRecord.roll_no}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Registration No
                            </p>
                            <p className="font-black text-foreground">
                                {academicRecord.reg_no}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 pointer-events-none group-hover:rotate-0 transition-all duration-1000">
                <GraduationCap size={240} strokeWidth={1} />
            </div>
        </div>
    );
};

export const AcademicIdentitySkeleton = () => {
    return (
        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 relative overflow-hidden animate-pulse">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="h-32 w-32 rounded-3xl bg-muted" />

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="space-y-2">
                        <div className="h-8 bg-muted rounded-md w-3/4 mx-auto md:mx-0" />
                        <div className="h-4 bg-muted rounded-md w-1/2 mx-auto md:mx-0" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-border/50">
                        <Each
                            of={[1, 2, 3]}
                            render={() => (
                                <div className="space-y-2">
                                    <div className="h-2 bg-muted rounded-md w-1/2" />
                                    <div className="h-4 bg-muted rounded-md w-3/4" />
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

