
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Printer, Loader2 } from "lucide-react";
import { idCardGenerateSchema, type IdCardGenerateFormData } from "@/lib/validations/idCard";
import { IdCardTemplateApi, IdCardApi } from "@/lib/api/idCardApi";
import streamApi from "@/lib/api/streamApi";
import R2Api from "@/lib/api/r2Api";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { IdCardQueryKeys } from "@/lib/querykey/idCard";
import {
    GENERATE_FORM_FIELDS,
    ID_CARD_PERMISSIONS,
    ID_CARD_CONTENT,
    getIdCardGenerateContent,
    getIdCardGenerateBreadcrumbs,
    getGenerateFormFields,
    type IdCardTemplateCardType,
} from "@/constants/idCard/formConfig";
import { ID_CARD_GENERATE_GUIDELINES, ID_CARD_GENERATE_TIP } from "@/constants/page/idCard";
import { getEditableFieldsForTemplate, EMPTY_CARD_DATA, type CardType } from "@/constants/idCard/editorConfig";
import { validateCardDataForLayout } from "@/lib/idCard/cardDataMapper";
import { Button } from "@/components/ui/button";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import { useAuth } from "@/hooks/use-can";
import { cn } from "@/lib/utils";
import type { IdCardHolderData } from "@/components/certificates/IdCardPreview";
import CardPreviewStage from "@/components/certificates/editor/CardPreviewStage";
import CardDetailsForm from "@/components/certificates/editor/CardDetailsForm";

const GenerateCards = () => {
    const queryClient = useQueryClient();
    const contentMap = useInstitutionContent();
    const { can } = useAuth();

    const [cardData, setCardData] = useState<IdCardHolderData>({ ...EMPTY_CARD_DATA });
    const [loadedUserId, setLoadedUserId] = useState<number | null>(null);
    const [photoUrl, setPhotoUrl] = useState("");
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const { control, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<IdCardGenerateFormData>({
        resolver: zodResolver(idCardGenerateSchema) as any,
        mode: "onChange",
        defaultValues: {
            template_id: undefined,
            session_id: undefined,
            stream_id: "",
        },
    });

    const watchedTemplateId = watch("template_id");
    const watchedSessionId = watch("session_id");
    const watchedStreamId = watch("stream_id");

    const { data: templatesData } = useQuery({
        queryKey: IdCardQueryKeys.templates.all,
        queryFn: () => IdCardTemplateApi.index({ per_page: 100, is_active: 1 }),
    });

    const { data: selectedTemplate } = useQuery({
        queryKey: IdCardQueryKeys.templates.detail(Number(watchedTemplateId)),
        queryFn: () => IdCardTemplateApi.show(Number(watchedTemplateId)),
        enabled: !!watchedTemplateId,
    });

    const { data: streamsData } = useQuery({
        queryKey: ["streams-all"],
        queryFn: () => streamApi.index({ all: true }),
    });

    const { sessions: sessionOptions, currentSessionId, rawSessions } = useCollegeSessions();

    const tmpl = useMemo(() => selectedTemplate?.data ?? selectedTemplate, [selectedTemplate]);
    const cardType: CardType = (tmpl?.card_type as CardType) ?? "student";

    const CONTENT = useMemo(() => getIdCardGenerateContent(contentMap), [contentMap]);
    const BREADCRUMBS = useMemo(() => getIdCardGenerateBreadcrumbs(contentMap), [contentMap]);
    const resolvedFields = useMemo(
        () => getGenerateFormFields(contentMap, GENERATE_FORM_FIELDS, cardType as IdCardTemplateCardType),
        [contentMap, cardType],
    );

    const canGenerate = can(ID_CARD_PERMISSIONS.generate);

    useEffect(() => {
        if (currentSessionId && cardType !== "temporary") {
            setValue("session_id", currentSessionId as any, { shouldValidate: true });
        }
    }, [currentSessionId, setValue, cardType]);

    useEffect(() => {
        if (cardType === "temporary" && currentSessionId) {
            setValue("session_id", currentSessionId as any, { shouldValidate: false });
        }
    }, [cardType, currentSessionId, setValue]);

    useEffect(() => {
        setCardData({ ...EMPTY_CARD_DATA });
        setLoadedUserId(null);
        setPhotoUrl("");
    }, [watchedTemplateId]);

    const streamOptions = useMemo(
        () =>
            (streamsData?.data ?? []).map((s: any) => ({
                key: String(s.id),
                value: String(s.id),
                text: s.name,
            })),
        [streamsData],
    );

    const templateOptions = useMemo(
        () =>
            (templatesData?.data ?? []).map((t: any) => ({
                key: String(t.id),
                text: `${t.name} (${t.card_type})`,
                value: String(t.id),
            })),
        [templatesData],
    );

    const allStreamOptions = useMemo(
        () => [{ key: "all", text: CONTENT.streamAll, value: "" }, ...streamOptions],
        [streamOptions, CONTENT.streamAll],
    );

    const fieldOptionsMap: Record<string, any[]> = useMemo(
        () => ({
            template_id: templateOptions,
            session_id: sessionOptions,
            stream_id: allStreamOptions,
        }),
        [templateOptions, sessionOptions, allStreamOptions],
    );

    const templatePreviewData = useMemo(() => {
        if (!tmpl) return null;
        return {
            name: tmpl.name,
            card_type: tmpl.card_type,
            background_color: tmpl.background_color,
            color_scheme: tmpl.color_scheme,
        };
    }, [tmpl]);

    const frontFields = useMemo(
        () => tmpl?.front_layout ?? ["institution_name", "institution_logo", "photo", "name", "reg_no"],
        [tmpl],
    );

    const backFields = useMemo(
        () => tmpl?.back_layout ?? ["mobile", "qr_code"],
        [tmpl],
    );

    const editableFields = useMemo(
        () => getEditableFieldsForTemplate(frontFields, backFields),
        [frontFields, backFields],
    );

    const layoutFieldKeys = useMemo(
        () => [...new Set([...frontFields, ...backFields])],
        [frontFields, backFields],
    );

    const sessionLabel = useMemo(() => {
        const s = rawSessions.find((x: any) => String(x.id) === String(watchedSessionId));
        return s?.name ?? "";
    }, [rawSessions, watchedSessionId]);

    const streamLabel = useMemo(() => {
        if (!watchedStreamId) return "";
        return streamOptions.find((s) => s.value === String(watchedStreamId))?.text ?? "";
    }, [streamOptions, watchedStreamId]);

    const previewCardData = useMemo(
        () => ({
            ...cardData,
            session: cardData.session || sessionLabel,
            stream: cardData.stream || streamLabel,
            photo_url: photoUrl || cardData.photo_url,
        }),
        [cardData, sessionLabel, streamLabel, photoUrl],
    );

    const handleCardDataChange = useCallback((data: IdCardHolderData) => {
        setCardData(data);
    }, []);

    const handlePhotoUpload = useCallback(async (file: File) => {
        setIsUploadingPhoto(true);
        try {
            const path = await R2Api.uploadFile(file);
            const viewUrl = R2Api.imageSrc(path);
            setPhotoUrl(viewUrl);
            setCardData((prev) => ({ ...prev, photo_url: path }));
            toast.success("Photo uploaded successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to upload photo");
        } finally {
            setIsUploadingPhoto(false);
        }
    }, []);

    const generateMutation = useMutation({
        mutationFn: (payload: Record<string, unknown>) => IdCardApi.generate(payload as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IdCardQueryKeys.cards.all });
            toast.success(CONTENT.successMsg);
            router.visit("/certificates/id-cards");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? err?.message ?? CONTENT.errorMsg);
        },
    });

    const onSubmit = (data: IdCardGenerateFormData) => {
        const validationError = validateCardDataForLayout(previewCardData, layoutFieldKeys);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        const rawSessionId = data.session_id ?? watchedSessionId ?? currentSessionId;
        const sessionId = Number(rawSessionId);

        if (!sessionId || Number.isNaN(sessionId)) {
            toast.error("Academic session is required");
            return;
        }

        generateMutation.mutate({
            template_id: Number(data.template_id),
            session_id: sessionId,
            stream_id: data.stream_id ? Number(data.stream_id) : undefined,
            user_id: loadedUserId ?? undefined,
            snapshot_data: previewCardData,
            photo_url: photoUrl || previewCardData.photo_url || undefined,
        });
    };

    const showEditor = !!watchedTemplateId;
    const canSubmit = !!watchedTemplateId && !!(watchedSessionId || currentSessionId);

    return (
        <>
            <Head title={CONTENT.pageTitle} />

            <div className="editor-lockdown -mx-4 -mt-8 -mb-12 grid grid-rows-[auto_auto_1fr] h-[calc(100dvh-4rem)] min-h-0">
                <div className="px-4 py-2 border-b border-border bg-card">
                    <MainPageHeader
                        breadcrumbs={BREADCRUMBS}
                        title={CONTENT.pageTitle}
                        guidance={ID_CARD_GENERATE_GUIDELINES}
                        tip={ID_CARD_GENERATE_TIP}
                    />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="border-b border-border bg-card px-4 py-3"
                >
                    <div className="flex items-end gap-3 flex-wrap">
                        <Each
                            of={resolvedFields}
                            render={(field) => (
                                <div key={field.name} className="w-48">
                                    <ControlledFormComponent
                                        control={control}
                                        name={field.name as any}
                                        type={field.type}
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        tooltip={field.tooltip}
                                        options={fieldOptionsMap[field.name] ?? field.options}
                                    />
                                </div>
                            )}
                        />

                        <div className="flex items-center gap-2 ml-auto">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit("/certificates/id-cards")}
                            >
                                {CONTENT.cancelBtn}
                            </Button>
                            {canGenerate && (
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={
                                        isSubmitting ||
                                        generateMutation.isPending ||
                                        isUploadingPhoto ||
                                        !canSubmit
                                    }
                                >
                                    {generateMutation.isPending && (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    )}
                                    <Printer className="size-3.5" />
                                    <span>{CONTENT.submitBtn}</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </form>

                <div
                    className={cn(
                        "grid min-h-0",
                        showEditor ? "grid-cols-[1fr_20rem]" : "grid-cols-1",
                    )}
                >
                    <div className="editor-panel bg-muted/20 min-h-0">
                        <CardPreviewStage
                            templateData={templatePreviewData}
                            frontFields={frontFields}
                            backFields={backFields}
                            studentData={showEditor ? previewCardData : null}
                            studentName={previewCardData.name}
                        />
                    </div>

                    {showEditor && (
                        <div className="editor-panel border-l border-border bg-card min-h-0">
                            <CardDetailsForm
                                key={String(watchedTemplateId)}
                                cardType={cardType}
                                fields={editableFields}
                                initialValues={{ ...EMPTY_CARD_DATA }}
                                onChange={handleCardDataChange}
                                onUserLoaded={(id, data) => {
                                    setLoadedUserId(id);
                                    setCardData(data);
                                }}
                                loadedUserId={loadedUserId}
                                sessionId={watchedSessionId}
                                streamId={watchedStreamId}
                                photoUrl={photoUrl || cardData.photo_url}
                                onPhotoUpload={handlePhotoUpload}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

GenerateCards.layoutProps = {
    backHref: "/certificates/id-cards",
    backLabel: ID_CARD_CONTENT.editor.backBtn,
};

export default GenerateCards;
