import { cn } from "@/lib/utils";
import React, { useMemo, useEffect, useCallback, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { idCardTemplateSchema, type IdCardTemplateFormData } from "@/lib/validations/idCard";
import { IdCardTemplateApi } from "@/lib/api/idCardApi";
import { IdCardQueryKeys } from "@/lib/querykey/idCard";
import {
    TEMPLATE_FORM_FIELDS,
    COLOR_SCHEME_FIELDS,
    STUDENT_CARD_PLACEHOLDERS,
    STAFF_CARD_PLACEHOLDERS,
    TEMPORARY_CARD_PLACEHOLDERS,
    PLACEHOLDER_CATEGORIES,
    ID_CARD_CONTENT,
} from "@/constants/idCard/formConfig";
import type { PlaceholderField } from "@/constants/idCard/formConfig";
import { usePage } from "@inertiajs/react";
import { getInstitutionContent } from "@/constants/content";
import {
    IdCard as IdCardIcon,
    Save,
    Palette,
    Layout as LayoutIcon,
    Settings2,
    Info,
    Check,
    Lock,
    PanelTop,
    PanelBottom,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IdCardPreview } from "@/components/certificates/IdCardPreview";
import { Switch } from "@/components/ui/switch";
import type { BreadcrumbItem } from "@/types";
import { resolveScopeType } from "@/constants/scopeTypeDisplay";

// ── Config ────────────────────────────────────────────────────────────────────

const PLACEHOLDER_MAP: Record<string, typeof STUDENT_CARD_PLACEHOLDERS> = {
    student: STUDENT_CARD_PLACEHOLDERS,
    staff: STAFF_CARD_PLACEHOLDERS,
    temporary: TEMPORARY_CARD_PLACEHOLDERS,
};

/** Exclude background_color and checkboxes from the standard field grid */
const GENERAL_FIELDS = TEMPLATE_FORM_FIELDS.filter(
    (f) => f.type !== "checkbox" && f.name !== "background_color",
);

const DEFAULT_VALUES: IdCardTemplateFormData = {
    name: "",
    card_type: "student",
    background_color: "#1a237e",
    is_default: false,
    is_active: true,
    color_scheme: { primary: "#1a237e", secondary: "#ffffff", text: "#ffffff", bg: "#f8fafc" },
    front_layout: ["reg_no", "name", "photo", "institution_name", "institution_logo"],
    back_layout: ["qr_code"],
};

/** Polymorphic config keyed by mode */
const MODE_CONFIG = {
    create: {
        content: ID_CARD_CONTENT.templateCreate,
        settingsDescription: "Setup the fundamental details of your ID card template.",
    },
    edit: {
        content: ID_CARD_CONTENT.templateEdit,
        settingsDescription: "Update the fundamental details of your ID card template.",
    },
} as const;

/** Section config for polymorphic rendering */
interface SectionConfig {
    key: string;
    icon: LucideIcon;
    title: string;
    description: string;
}

const FORM_SECTIONS: SectionConfig[] = [
    { key: "settings", icon: Settings2, title: "Template Settings", description: "" },
    { key: "fields", icon: LayoutIcon, title: "Field Selection", description: "Choose which fields appear on each side of the card." },
];

// ── FieldToggleItem ───────────────────────────────────────────────────────────

interface FieldToggleItemProps {
    fieldKey: string;
    label: string;
    locked?: boolean;
    selected: boolean;
    onToggle: (key: string) => void;
}

const FieldToggleItem = ({ fieldKey, label, locked, selected, onToggle }: FieldToggleItemProps) => (
    <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        onClick={() => !locked && onToggle(fieldKey)}
        disabled={locked}
        className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all select-none",
            selected
                ? "bg-primary/10 text-primary ring-1 ring-primary/25"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            locked && "opacity-50 cursor-not-allowed",
        )}
    >
        <div
            className={cn(
                "size-3.5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all",
                selected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-current opacity-40",
            )}
        >
            {selected && <Check className="size-2" strokeWidth={3.5} />}
        </div>
        {label}
        {locked && <Lock className="size-2.5 opacity-40 -ml-0.5" />}
    </button>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface TemplateFormProps {
    mode: "create" | "edit";
    id?: number;
    breadcrumbs: BreadcrumbItem[];
}

// ── Component ─────────────────────────────────────────────────────────────────

const TemplateForm = ({ mode, id, breadcrumbs }: TemplateFormProps) => {
    const { props } = usePage();
    const scopeType = resolveScopeType(
        (props as { institution?: { type?: string } }).institution?.type,
    );
    const [cardSide, setCardSide] = useState<"front" | "back">("front");
    const queryClient = useQueryClient();
    const isEdit = mode === "edit";
    const { content, settingsDescription } = MODE_CONFIG[mode];

    // ── Data fetch (edit only) ────────────────────────────────────────────
    const { data: templateData, isLoading } = useQuery({
        queryKey: IdCardQueryKeys.templates.detail(id!),
        queryFn: () => IdCardTemplateApi.show(id!),
        enabled: isEdit && !!id,
    });
    const template = useMemo(() => templateData?.data, [templateData]);

    // ── Form ──────────────────────────────────────────────────────────────
    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<IdCardTemplateFormData>({
        resolver: zodResolver(idCardTemplateSchema),
        mode: "onChange",
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (isEdit && template) {
            reset({
                name: template.name,
                card_type: template.card_type,
                background_color: template.background_color || "#1a237e",
                is_default: template.is_default,
                is_active: template.is_active,
                color_scheme: template.color_scheme || DEFAULT_VALUES.color_scheme,
                front_layout: template.front_layout || [],
                back_layout: template.back_layout || [],
            });
        }
    }, [isEdit, template, reset]);

    // ── Preview state (useWatch on primitives only — no objects/arrays) ───
    const cardType = useWatch({ control, name: "card_type" }) || "student";
    const bgColor = useWatch({ control, name: "background_color" });
    const schemePrimary = useWatch({ control, name: "color_scheme.primary" as any });
    const schemeSecondary = useWatch({ control, name: "color_scheme.secondary" as any });
    const schemeText = useWatch({ control, name: "color_scheme.text" as any });
    const schemeBg = useWatch({ control, name: "color_scheme.bg" as any });

    const previewData = useMemo(() => ({
        card_type: cardType,
        background_color: bgColor,
        color_scheme: { primary: schemePrimary, secondary: schemeSecondary, text: schemeText, bg: schemeBg },
    }), [cardType, bgColor, schemePrimary, schemeSecondary, schemeText, schemeBg]);

    const placeholders = useMemo(() => {
        const all = PLACEHOLDER_MAP[cardType] ?? STUDENT_CARD_PLACEHOLDERS;
        const content = getInstitutionContent(scopeType);
        return all
            .filter((ph: PlaceholderField) => ph.scope_types.includes(scopeType))
            .map((ph: PlaceholderField) => ({
                ...ph,
                label: ph.contentKey ? (content as any)[ph.contentKey] ?? ph.label : ph.label,
            }));
    }, [cardType, scopeType]);

    // ── Mutation ──────────────────────────────────────────────────────────
    const mutation = useMutation({
        mutationFn: (data: IdCardTemplateFormData) =>
            isEdit
                ? IdCardTemplateApi.update(id!, data as Record<string, unknown>)
                : IdCardTemplateApi.store(data as Record<string, unknown>),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: IdCardQueryKeys.templates.all });
            toast.success(isEdit ? "Template updated successfully" : "Template created successfully");
            router.visit("/certificates/id-cards/templates");
        },
        onError: () => toast.error(isEdit ? "Failed to update template" : "Failed to create template"),
    });

    const onSubmit = useCallback((data: IdCardTemplateFormData) => mutation.mutate(data), [mutation]);

    // ── Section Renderer Map (polymorphic) ────────────────────────────────
    const sectionRenderers: Record<string, () => React.ReactNode> = useMemo(() => ({
        settings: () => (
            <CardContent className="p-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Each
                        of={GENERAL_FIELDS}
                        render={(field) => (
                            <div key={field.name} className={field.layout === "full" ? "sm:col-span-2" : ""}>
                                <ControlledFormComponent
                                    control={control}
                                    name={field.name as any}
                                    type={field.type}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    tooltip={field.tooltip}
                                    options={field.options}
                                    maxLength={field.maxLength}
                                />
                            </div>
                        )}
                    />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Each
                        of={COLOR_SCHEME_FIELDS}
                        render={(field) => (
                            <div key={field.name}>
                                <ControlledFormComponent
                                    control={control}
                                    name={field.name as any}
                                    type={field.type}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    tooltip={field.tooltip}
                                />
                            </div>
                        )}
                    />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 p-3 rounded-xl bg-muted/50 border border-border/50">
                    <Controller
                        control={control}
                        name="is_default"
                        render={({ field: { value, onChange } }) => (
                            <div className="flex items-center gap-3">
                                <Switch checked={value} onCheckedChange={onChange} />
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Default Template</Label>
                                    <p className="text-xs text-muted-foreground">Used as primary design</p>
                                </div>
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="is_active"
                        render={({ field: { value, onChange } }) => (
                            <div className="flex items-center gap-3">
                                <Switch checked={value} onCheckedChange={onChange} />
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Active Status</Label>
                                    <p className="text-xs text-muted-foreground">Ready for generation</p>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </CardContent>
        ),

fields: () => {
    const frontFields = placeholders.filter((ph: PlaceholderField) => ph.side === "front" || ph.side === "both");
    const backFields = placeholders.filter((ph: PlaceholderField) => ph.side === "back" || ph.side === "both");
    const sideFieldsMap = { front: frontFields, back: backFields };

    const SIDE_TABS = [
        { key: "front" as const, label: "Front Side", icon: PanelTop },
        { key: "back" as const, label: "Back Side", icon: PanelBottom },
    ];

    const renderSidePanel = (side: "front" | "back", layoutName: string) => (
        <Controller
            key={side}
            control={control}
            name={layoutName as any}
            render={({ field: { value, onChange } }) => {
                const selected = (value || []) as string[];
                const toggle = (key: string) => {
                    onChange(
                        selected.includes(key)
                            ? selected.filter((k) => k !== key)
                            : [...selected, key],
                    );
                };
                return (
                    <div className={cn(cardSide !== side && "hidden")}>
                        {/* Selected count */}
                        <p className="text-xs text-muted-foreground mb-4">
                            <span className="font-bold text-foreground">{selected.length}</span> of{" "}
                            {sideFieldsMap[side].length} fields selected
                        </p>

                        <div className="space-y-5">
                            <Each
                                of={[...PLACEHOLDER_CATEGORIES]}
                                render={(cat) => {
                                    const fields = sideFieldsMap[side].filter((ph: PlaceholderField) => ph.category === cat.key);
                                    if (fields.length === 0) return null;
                                    return (
                                        <div key={cat.key}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                                                    {cat.label}
                                                </span>
                                                <div className="flex-1 h-px bg-border/60" />
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Each
                                                    of={fields}
                                                    render={(ph: PlaceholderField) => (
                                                        <FieldToggleItem
                                                            key={ph.key}
                                                            fieldKey={ph.key}
                                                            label={ph.label}
                                                            locked={!!ph.locked}
                                                            selected={selected.includes(ph.key)}
                                                            onToggle={toggle}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </div>
                );
            }}
        />
    );

    return (
    <CardContent className="p-5 pt-0">
        {/* Front / Back tab switcher */}
        <div className="flex gap-2 mb-5">
            {SIDE_TABS.map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => setCardSide(key)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center",
                        cardSide === key
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                >
                    <Icon className="size-4" />
                    {label}
                </button>
            ))}
        </div>
        {renderSidePanel("front", "front_layout")}
        {renderSidePanel("back", "back_layout")}
    </CardContent>
    );
},
    }), [control, placeholders, cardSide]);

    if (isEdit && isLoading) {
        return (
            <>
                <Head title={content.title} />
                <div className="space-y-6">
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
                        <div className="space-y-6">
                            <Skeleton className="h-64 w-full rounded-2xl" />
                            <Skeleton className="h-48 w-full rounded-2xl" />
                        </div>
                        <Skeleton className="h-[500px] w-full rounded-2xl hidden xl:block" />
                    </div>
                </div>
            </>
        );
    }

    return (
    <>
        <Head title={content.title} />

        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <IdCardIcon className="size-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight">{content.title}</h1>
                    <p className="text-sm text-muted-foreground">{content.subtitle}</p>
                </div>
            </div>

            {/* Form with two-column grid */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
                    {/* Left: Form sections */}
                    <div className="space-y-6">
                        {FORM_SECTIONS.map((section) => {
                            const SectionIcon = section.icon;
                            const renderContent = sectionRenderers[section.key];
                            return (
                                <Card key={section.key} className="border-none shadow-sm overflow-hidden">
                                    <CardHeader className="bg-primary/5 pb-6">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <SectionIcon className="size-5 text-primary" />
                                            {section.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {section.key === "general" ? settingsDescription : section.description}
                                        </CardDescription>
                                    </CardHeader>
                                    {renderContent?.()}
                                </Card>
                            );
                        })}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 px-3 rounded-full">
                                <Info className="size-3 text-primary" />
                                <span>Real-time preview enabled</span>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit("/certificates/id-cards/templates")}
                                    className="flex-1 sm:flex-none rounded-full px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || mutation.isPending}
                                    className="flex-1 sm:flex-none rounded-full"
                                >
                                    <Save className="size-4" />
                                    <span>{content.submitBtn}</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sticky preview (desktop) */}
                    <div className="hidden xl:block sticky top-6">
                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardContent className="p-6 flex flex-col items-center bg-gradient-to-b from-muted/20 to-background">
                                <Controller
                                    control={control}
                                    name="front_layout"
                                    render={({ field: { value: frontValue } }) => (
                                        <Controller
                                            control={control}
                                            name="back_layout"
                                            render={({ field: { value: backValue } }) => (
                                                <IdCardPreview
                                                    data={previewData}
                                                    selectedFields={(frontValue || []) as string[]}
                                                    backFields={(backValue || []) as string[]}
                                                    activeSide={cardSide}
                                                    compact
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    </>
);
};

export default TemplateForm;
