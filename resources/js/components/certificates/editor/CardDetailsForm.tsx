import React, { useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Camera, UserCircle, X } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { AsyncSelectField } from "@/components/shared/AsyncSelectField";
import Each from "@/components/Each";
import { cn } from "@/lib/utils";
import { FORM_TYPE } from "@/constants/shared/form";
import { ID_CARD_CONTENT } from "@/constants/idCard/formConfig";
import {
    getLoadDirectoryLabel,
    type CardType,
    type FieldEditorConfig,
} from "@/constants/idCard/editorConfig";
import type { IdCardHolderData } from "@/components/certificates/IdCardPreview";
import { mapUserToCardData } from "@/lib/idCard/cardDataMapper";
import StudentApi from "@/lib/api/studentApi";
import StaffApi from "@/lib/api/staffApi";
import { Button } from "@/components/ui/button";

const EDITOR = ID_CARD_CONTENT.editor;

interface CardDetailsFormProps {
    cardType: CardType;
    fields: (FieldEditorConfig & { key: string })[];
    initialValues: IdCardHolderData;
    onChange: (data: IdCardHolderData) => void;
    onUserLoaded: (userId: number | null, data: IdCardHolderData) => void;
    loadedUserId: number | null;
    sessionId?: string | number;
    streamId?: string | number;
    photoUrl?: string;
    onPhotoUpload: (file: File) => void;
}

const CardDetailsForm: React.FC<CardDetailsFormProps> = ({
    cardType,
    fields,
    initialValues,
    onChange,
    onUserLoaded,
    loadedUserId,
    sessionId,
    streamId,
    photoUrl,
    onPhotoUpload,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const loadLabel = getLoadDirectoryLabel(cardType);

    const { control, reset, watch } = useForm<IdCardHolderData>({
        mode: "onChange",
        defaultValues: initialValues,
    });

    useEffect(() => {
        const sub = watch((formValues) => {
            onChange(formValues as IdCardHolderData);
        });
        return () => sub.unsubscribe();
    }, [watch, onChange]);

    const hasPhoto = fields.some((f) => f.key === "photo");
    const otherFields = fields.filter((f) => f.key !== "photo");

    const handleDirectorySelect = (_val: unknown, option?: { raw?: Record<string, unknown> }) => {
        if (!option?.raw) return;
        const mapped = mapUserToCardData(option.raw as Record<string, any>, cardType);
        reset(mapped);
        onChange(mapped);
        onUserLoaded(Number(option.raw.id), mapped);
    };

    const handleClearLoaded = () => {
        reset(initialValues);
        onChange(initialValues);
        onUserLoaded(null, initialValues);
    };

    const studentAsyncConfig = useMemo(() => ({
        queryFn: async (search: string) => {
            return StudentApi.getStudentList({
                academic_session_id: sessionId,
                stream_id: streamId || undefined,
                name: search,
                status: 1,
                per_page: 20,
            });
        },
        labelKey: "name" as const,
        valueKey: "id" as const,
    }), [sessionId, streamId]);

    const staffAsyncConfig = useMemo(() => ({
        queryFn: async (search: string) => {
            return StaffApi.listStaff({ search, per_page: 20 });
        },
        labelKey: "name" as const,
        valueKey: "id" as const,
    }), []);

    return (
        <div className="h-full flex flex-col bg-card">
            <div className="p-3 border-b border-border">
                <span className="text-sm font-semibold">{EDITOR.detailsTitle}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{EDITOR.detailsSubtitle}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 pb-20">
                {loadLabel && (
                    <div className="space-y-2 pb-3 border-b border-border">
                        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {loadLabel}
                        </label>
                        <AsyncSelectField
                            asyncConfig={cardType === "staff" ? staffAsyncConfig : studentAsyncConfig}
                            value={loadedUserId}
                            onChange={handleDirectorySelect}
                            placeholder={EDITOR.loadPlaceholder}
                        />
                        {loadedUserId && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs gap-1"
                                onClick={handleClearLoaded}
                            >
                                <X className="size-3" />
                                {EDITOR.loadClear}
                            </Button>
                        )}
                        <p className="text-[10px] text-muted-foreground">{EDITOR.loadHint}</p>
                    </div>
                )}

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
                                    <img src={photoUrl} alt="Card holder" className="size-full object-cover" />
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
                        <span className="text-[10px] text-muted-foreground">{EDITOR.detailPhotoLabel}</span>
                    </div>
                )}

                <div className="space-y-3">
                    {otherFields.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-xs font-medium text-muted-foreground">{EDITOR.detailEmptyTitle}</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">{EDITOR.detailEmptyDesc}</p>
                        </div>
                    ) : (
                        <Each
                            of={otherFields}
                            keyExtractor={(f) => f.key}
                            render={(field) => (
                                <ControlledFormComponent
                                    control={control}
                                    name={field.key as keyof IdCardHolderData}
                                    type={field.type === "image" ? FORM_TYPE.TEXT : field.type}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    tooltip={field.tooltip}
                                    options={field.options as any}
                                    disabled={field.readOnly}
                                />
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardDetailsForm;
