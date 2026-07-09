import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, UserCircle } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { cn } from "@/lib/utils";
import { FORM_TYPE } from "@/constants/shared/form";
import { ID_CARD_CONTENT } from "@/constants/idCard/formConfig";
import {
    idCardStudentDetailSchema,
    type IdCardStudentDetailFormData,
} from "@/lib/validations/idCard";
import type { FieldEditorConfig } from "@/constants/idCard/editorConfig";
import type { IdCardStudentData } from "@/components/certificates/IdCardPreview";

const EDITOR = ID_CARD_CONTENT.editor;

interface StudentDetailEditorProps {
    /** Polymorphic field list — driven by the template's layout */
    fields: (FieldEditorConfig & { key: string })[];
    /** Current student's merged data (API + overrides) */
    values: Partial<IdCardStudentData>;
    /** Callback to update a field override */
    onFieldChange: (key: string, value: string) => void;
    /** Photo preview URL (from upload or API) */
    photoUrl?: string;
    /** Callback when a photo file is selected */
    onPhotoUpload: (file: File) => void;
    studentName?: string;
    studentId?: number | string;
}

/**
 * Polymorphic per-student detail editor.
 * Uses react-hook-form + ControlledFormComponent for config-driven rendering.
 * Renders exactly the fields the selected template uses.
 */
const StudentDetailEditor: React.FC<StudentDetailEditorProps> = ({
    fields,
    values,
    onFieldChange,
    photoUrl,
    onPhotoUpload,
    studentName,
    studentId,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── React Hook Form ─────────────────────────────────
    const { control, reset, watch } = useForm<IdCardStudentDetailFormData>({
        resolver: zodResolver(idCardStudentDetailSchema),
        mode: "onChange",
        defaultValues: buildDefaults(values),
    });

    // Reset form only when switching students — not on every override update
    useEffect(() => {
        reset(buildDefaults(values));
        // eslint-disable-next-line react-hooks/exhaustive-deps -- values read when studentId changes
    }, [studentId, reset]);

    // Watch all fields and propagate changes to parent via onFieldChange
    useEffect(() => {
        const subscription = watch((formValues, { name }) => {
            if (name && formValues[name as keyof IdCardStudentDetailFormData] !== undefined) {
                onFieldChange(name, formValues[name as keyof IdCardStudentDetailFormData] ?? "");
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, onFieldChange]);

    // Separate photo from other fields
    const hasPhoto = fields.some((f) => f.key === "photo");
    const otherFields = fields.filter((f) => f.key !== "photo");

    return (
        <div className="h-full flex flex-col border-l border-border bg-card">
            {/* Header */}
            <div className="p-3 border-b border-border">
                <span className="text-sm font-semibold">
                    {studentName ? `Edit: ${studentName}` : EDITOR.detailsTitle}
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                    {EDITOR.detailsSubtitle}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 pb-20">
                {/* Photo uploader */}
                {hasPhoto && (
                    <div className="flex flex-col items-center gap-2 pb-4 border-b border-border">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "relative size-24 rounded-2xl overflow-hidden transition-all cursor-pointer",
                                "border-2 border-dashed border-border hover:border-primary/40",
                                "flex items-center justify-center group",
                                photoUrl && "border-solid border-primary/20",
                            )}
                        >
                            {photoUrl ? (
                                <>
                                    <img
                                        src={photoUrl}
                                        alt="Student"
                                        className="size-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="size-5 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                                    <UserCircle className="size-8" />
                                    <span className="text-[9px] font-medium">{EDITOR.detailPhotoBtn}</span>
                                </div>
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onPhotoUpload(file);
                            }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                            {EDITOR.detailPhotoLabel}
                        </span>
                    </div>
                )}

                {/* Dynamic fields via ControlledFormComponent */}
                <div className="space-y-3">
                    <Each
                        of={otherFields}
                        keyExtractor={(f) => f.key}
                        render={(field) => (
                            <ControlledFormComponent
                                control={control}
                                name={field.key as any}
                                type={field.type}
                                label={field.label}
                                placeholder={field.placeholder}
                                tooltip={field.tooltip}
                                options={field.options as any}
                                disabled={field.readOnly}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

/** Builds default values from the student data for useForm */
function buildDefaults(values: Partial<IdCardStudentData>): IdCardStudentDetailFormData {
    return {
        name: values.name ?? "",
        reg_no: values.reg_no ?? "",
        stream: values.stream ?? "",
        blood_group: values.blood_group ?? "",
        dob: values.dob ?? "",
        mobile: values.mobile ?? "",
        valid_until: values.valid_until ?? "",
        father_name: values.father_name ?? "",
        mother_name: values.mother_name ?? "",
        address: values.address ?? "",
        department: values.department ?? "",
        session: values.session ?? "",
    };
}

export default StudentDetailEditor;
