import React, { useEffect, useState } from "react";
import { ID_CARD_PLACEHOLDER, EMPTY_CARD_DATA, getCardDetailsHeaderLabel } from "@/constants/idCard/editorConfig";
import { ID_CARD_CONTENT } from "@/constants/idCard/formConfig";
import { cn } from "@/lib/utils";
import { User, QrCode } from "lucide-react";
import { useInstitution } from "@/hooks/use-institution";

const EDITOR = ID_CARD_CONTENT.editor;

// ─── Holder data for live preview (student, staff, visitor) ──
export interface IdCardHolderData {
    name?: string;
    reg_no?: string;
    stream?: string;
    blood_group?: string;
    dob?: string;
    mobile?: string;
    valid_until?: string;
    photo_url?: string;
    father_name?: string;
    mother_name?: string;
    address?: string;
    department?: string;
    session?: string;
    employee_id?: string;
    designation?: string;
    joining_date?: string;
    purpose?: string;
    host_name?: string;
    organization?: string;
    email?: string;
}

/** @deprecated Use IdCardHolderData */
export type IdCardStudentData = IdCardHolderData;

interface IdCardPreviewProps {
    data: {
        name?: string;
        card_type?: string;
        background_color?: string;
        color_scheme?: {
            primary?: string;
            secondary?: string;
            text?: string;
            bg?: string;
        };
    };
    selectedFields?: string[];
    backFields?: string[];
    activeSide?: "front" | "back";
    compact?: boolean;
    /** When provided, renders holder data instead of placeholders */
    studentData?: IdCardHolderData | null;
    studentName?: string;
}

export const IdCardPreview: React.FC<IdCardPreviewProps> = ({
    data,
    selectedFields = [],
    backFields = [],
    activeSide = "front",
    compact = false,
    studentData,
    studentName,
}) => {
    const { color_scheme, background_color, card_type } = data;
    const { name: institutionName, logoUrl } = useInstitution();
    const [logoError, setLogoError] = useState(false);

    const showLogoImage = !!logoUrl && !logoError;
    const logoInitial = (institutionName || "I").charAt(0).toUpperCase();

    useEffect(() => {
        setLogoError(false);
    }, [logoUrl]);

    const primaryColor = color_scheme?.primary || background_color || "#1a237e";
    const secondaryColor = color_scheme?.secondary || "#ffffff";
    const textColor = color_scheme?.text || "#ffffff";
    const bgColor = color_scheme?.bg || "#f8fafc";

    const isLive = !!studentData;
    // Merge: real data overrides placeholders
    const s = isLive
        ? { ...EMPTY_CARD_DATA, ...studentData }
        : { ...ID_CARD_PLACEHOLDER, ...studentData };

    const hasField = (key: string) => selectedFields.includes(key);
    const hasBackField = (key: string) => backFields.includes(key);
    const [selectedSide, setSelectedSide] = useState<"front" | "back" | null>(null);

    return (
        <div className={cn("flex flex-row flex-wrap items-start justify-center gap-6 py-6")}>
            <div className="basis-full text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
                {isLive && studentName ? `${EDITOR.previewLive}: ${studentName}` : isLive ? EDITOR.previewLive : EDITOR.previewPlaceholder}
            </div>

            {/* Front Card */}
            <div
                className={cn("transition-all duration-300 cursor-pointer rounded-[22px]", selectedSide === "front" && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
                onClick={(e) => { e.stopPropagation(); setSelectedSide(prev => prev === "front" ? null : "front"); }}
            >
                <div className="text-[10px] font-bold text-center text-muted-foreground/60 uppercase tracking-widest mb-2">{EDITOR.previewFront}</div>
                <div
                    className="w-[300px] h-[460px] rounded-[20px] shadow-xl overflow-hidden flex flex-col transition-all duration-300 border border-border"
                    style={{ backgroundColor: bgColor }}
                >
                    {/* Header Section */}
                    <div
                        className="h-[120px] p-4 flex flex-col items-center justify-center text-center gap-1.5 relative overflow-hidden"
                        style={{ backgroundColor: primaryColor, color: textColor }}
                    >
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14 blur-2xl" />

                        {hasField("institution_logo") && (
                            <div className="size-11 rounded-lg bg-white flex items-center justify-center shadow-md border border-white/40 overflow-hidden">
                                {showLogoImage ? (
                                    <img
                                        src={logoUrl}
                                        alt={`${institutionName || "Institution"} logo`}
                                        className="size-full object-contain p-1"
                                        onError={() => setLogoError(true)}
                                    />
                                ) : (
                                    <span className="text-sm font-black text-primary/80">{logoInitial}</span>
                                )}
                            </div>
                        )}

                        {hasField("institution_name") && (
                            <div className="font-black text-[10px] uppercase tracking-[0.2em] leading-tight">
                                {institutionName || "Institution Name"}
                            </div>
                        )}
                    </div>

                    {/* Profile Section */}
                    <div className="flex-1 px-4 -mt-7 flex flex-col items-center">
                        {hasField("photo") && (
                            <div className="size-24 rounded-[24px] bg-card border-4 border-background shadow-lg flex items-center justify-center overflow-hidden z-20">
                                {s.photo_url ? (
                                    <img src={s.photo_url} alt={s.name} className="size-full object-cover" />
                                ) : (
                                    <div className="size-full bg-muted flex items-center justify-center text-muted-foreground">
                                        <User className="size-10 opacity-20" />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-3 flex flex-col items-center w-full grow">
                            {hasField("name") && (
                                <div className="font-black text-base tracking-tight text-center leading-none mb-0.5 text-foreground">
                                    {s.name}
                                </div>
                            )}

                            {hasField("reg_no") && (
                                <div className="text-[9px] font-bold text-muted-foreground/60 tracking-[0.15em] mb-3 uppercase">
                                    {s.reg_no}
                                </div>
                            )}

                            <div className="w-full space-y-1.5 mt-1">
                                {hasField("stream") && <FieldRow label="Class / Stream" value={s.stream} />}
                                {hasField("designation") && <FieldRow label="Designation" value={s.designation} />}
                                {hasField("employee_id") && <FieldRow label="Employee ID" value={s.employee_id} />}
                                {hasField("purpose") && <FieldRow label="Purpose" value={s.purpose} />}
                                {hasField("organization") && <FieldRow label="Organization" value={s.organization} />}
                                {hasField("blood_group") && <FieldRow label="Blood Group" value={s.blood_group} />}
                                {hasField("dob") && <FieldRow label="Date of Birth" value={s.dob} />}
                                {hasField("mobile") && <FieldRow label="Contact" value={s.mobile} />}
                                {hasField("email") && <FieldRow label="Email" value={s.email} />}
                                {hasField("session") && <FieldRow label="Session" value={s.session} />}
                                {hasField("department") && <FieldRow label="Department" value={s.department} />}
                                {hasField("valid_until") && <FieldRow label="Valid Until" value={s.valid_until} />}
                            </div>
                        </div>

                        <div className="mt-auto mb-6 w-full flex flex-col items-center gap-3">
                            <div
                                className="h-0.5 w-20 rounded-full opacity-20"
                                style={{ backgroundColor: primaryColor }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Card */}
            <div
                className={cn("transition-all duration-300 cursor-pointer rounded-[22px]", selectedSide === "back" && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
                onClick={(e) => { e.stopPropagation(); setSelectedSide(prev => prev === "back" ? null : "back"); }}
            >
                <div className="text-[10px] font-bold text-center text-muted-foreground/60 uppercase tracking-widest mb-2">{EDITOR.previewBack}</div>
                <div
                    className="w-[300px] h-[460px] rounded-[20px] shadow-xl overflow-hidden flex flex-col transition-all duration-300 border border-border"
                    style={{ backgroundColor: bgColor }}
                >
                    {/* Back header strip */}
                    <div
                        className="h-14 flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: primaryColor, color: textColor }}
                    >
                        <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mt-10 blur-xl" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-90">
                            {getCardDetailsHeaderLabel(card_type)}
                        </span>
                    </div>

                    {/* Back content */}
                    <div className="flex-1 p-5 flex flex-col gap-3">
                        {hasBackField("father_name") && <BackFieldRow label="Father's Name" value={s.father_name} />}
                        {hasBackField("mother_name") && <BackFieldRow label="Mother's Name" value={s.mother_name} />}
                        {hasBackField("address") && <BackFieldRow label="Address" value={s.address} />}
                        {hasBackField("mobile") && <BackFieldRow label="Contact" value={s.mobile} />}
                        {hasBackField("email") && <BackFieldRow label="Email" value={s.email} />}
                        {hasBackField("department") && <BackFieldRow label="Department" value={s.department} />}
                        {hasBackField("session") && <BackFieldRow label="Session" value={s.session} />}
                        {hasBackField("joining_date") && <BackFieldRow label="Joining Date" value={s.joining_date} />}
                        {hasBackField("host_name") && <BackFieldRow label="Host" value={s.host_name} />}

                        <div className="mt-auto flex flex-col items-center gap-3">
                            {hasBackField("qr_code") && (
                                <div className="size-20 p-2.5 bg-white rounded-xl shadow-sm border border-border/50">
                                    <QrCode className="size-full text-zinc-800" />
                                </div>
                            )}
                            <div
                                className="h-0.5 w-20 rounded-full opacity-20"
                                style={{ backgroundColor: primaryColor }}
                            />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

const FieldRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/40 leading-none mb-0.5">{label}</span>
        <span className="text-[10px] font-bold text-foreground leading-tight tracking-tight">{value}</span>
    </div>
);

const BackFieldRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/40">{label}</span>
        <span className="text-xs font-semibold text-foreground">{value}</span>
        <div className="h-px bg-border/50 mt-1" />
    </div>
);
