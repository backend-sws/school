import React, { useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pick from "lodash/pick";
import defaults from "lodash/defaults";
import { toast } from "sonner";
import feeProfilesApi from "@/lib/api/feeProfilesApi";
import {
    feeProfileSchema,
    type FeeProfileFormData,
    type FeeProfileFormInputValues,
} from "@/lib/validations/feeProfile";
import { usePermittedFields } from "@/hooks/usePermittedFields";
import {
    FEE_PROFILE_FORM_FIELDS,
    FEE_PROFILE_DEFAULT_VALUES,
    FEE_PROFILE_ITEMS_REPEATER,
    getFeeProfileContent,
} from "@/constants/feeProfile/formConfig";
import { FORM_TYPE } from "@/constants/shared/form";
import { FeeProfileQueryKeys } from "@/lib/querykey/feeProfile";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import Each from "@/components/Each";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BACK_HREF = "/accounts/fee-hub/profiles";

export default function FeeProfileForm() {
    const { props } = usePage<{ id?: number }>();
    const isEdit = !!props.id;
    const queryClient = useQueryClient();

    const contentMap = useInstitutionContent();
    const CONTENT = useMemo(() => getFeeProfileContent(contentMap), [contentMap]);

    // ─── Fetch existing profile when editing ─────────────
    const { data: editData, isLoading: editLoading } = useQuery({
        queryKey: FeeProfileQueryKeys.profileDetail(props.id!),
        queryFn: () => feeProfilesApi.show(props.id!),
        enabled: isEdit,
    });

    // ─── Permission-gated fields ─────────────────────────
    const { visibleFields, permittedSchema } = usePermittedFields(
        FEE_PROFILE_FORM_FIELDS,
        feeProfileSchema,
    );

    // ─── Form (react-hook-form + Zod) ────────────────────
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm<FeeProfileFormInputValues>({
        resolver: zodResolver(permittedSchema) as any,
        mode: "onChange",
        defaultValues: FEE_PROFILE_DEFAULT_VALUES,
    });

    const items = watch("items");
    const isDefault = watch("is_default");

    // ─── Populate form when editing ──────────────────────
    React.useEffect(() => {
        if (editData) {
            const base = pick(editData, ["name", "profile_type", "category", "gender", "fee_collection_frequency", "description", "is_default"]);
            const items = editData.items?.length
                ? editData.items.map((i: Record<string, any>) => pick(i, ["fee_type_id", "amount"]))
                : FEE_PROFILE_DEFAULT_VALUES.items;
            reset(defaults({ ...base, items }, FEE_PROFILE_DEFAULT_VALUES));
        }
    }, [editData, reset]);

    // ─── Mutations ───────────────────────────────────────
    const createMutation = useMutation({
        mutationFn: (data: FeeProfileFormData) => feeProfilesApi.store(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FeeProfileQueryKeys.all });
            toast.success("Fee profile created.");
            router.visit(BACK_HREF);
        },
        onError: () => toast.error("Failed to create fee profile."),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: FeeProfileFormData }) =>
            feeProfilesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FeeProfileQueryKeys.all });
            toast.success("Fee profile updated.");
            router.visit(BACK_HREF);
        },
        onError: () => toast.error("Failed to update fee profile."),
    });

    // ─── Handlers ────────────────────────────────────────
    const onSubmit = (data: FeeProfileFormInputValues) => {
        const payload = {
            ...data,
            profile_type: data.profile_type === "_none" ? null : data.profile_type,
            category: data.category === "_none" ? null : data.category,
            gender: data.gender === "_none" ? null : data.gender,
            fee_collection_frequency: data.fee_collection_frequency === "_none" ? null : data.fee_collection_frequency,
            description: data.description?.trim() || null,
        } as FeeProfileFormData;

        if (isEdit && props.id) {
            updateMutation.mutate({ id: props.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;
    const itemsTotal = (items ?? []).reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    if (isEdit && editLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                {/* ─── Card Header (matches StepCard pattern) ─── */}
                <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b bg-muted/30">
                    <div className="space-y-0.5">
                        <h2 className="text-base font-bold text-foreground tracking-tight">
                            {isEdit ? CONTENT.editTitle : CONTENT.createTitle}
                        </h2>
                        <p className="text-[13px] text-muted-foreground font-medium">
                            {isEdit
                                ? "Update the profile details and fee breakdown."
                                : "Enter fee profile details as per structure."
                            }
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-6 space-y-6">
                            {/* ═══ Section 1: Profile Details ═══ */}
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70 border-b border-primary/10 pb-1.5 mb-4">
                                    Profile Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                    <Each
                                        of={visibleFields}
                                        render={(field) => (
                                            <ControlledFormComponent
                                                key={field.name}
                                                control={control}
                                                name={field.name as any}
                                                type={field.type}
                                                label={field.label}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                tooltip={field.tooltip}
                                                options={field.options as any}
                                                className={field.name === "description" ? "md:col-span-2" : ""}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex items-center gap-2.5 mt-4">
                                    <Checkbox
                                        id="profile-default"
                                        checked={isDefault}
                                        onCheckedChange={(checked) => setValue("is_default", checked === true)}
                                    />
                                    <Label htmlFor="profile-default" className="text-[13px] font-medium cursor-pointer flex items-center gap-1.5 text-muted-foreground">
                                        {CONTENT.defaultLabel}
                                        <HelperTooltip content="If enabled, this profile will be automatically selected for new students matching its criteria." />
                                    </Label>
                                </div>
                            </section>

                            {/* ═══ Section 2: Fee Breakdown ═══ */}
                            <section>
                                <div className="flex items-center justify-between border-b border-primary/10 pb-1.5 mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70">
                                        Fee Breakdown
                                    </h3>
                                    <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 h-5 bg-background font-mono tabular-nums">
                                        Total: ₹{itemsTotal.toLocaleString()}
                                    </Badge>
                                </div>

                                <ControlledFormComponent
                                    control={control}
                                    name={FEE_PROFILE_ITEMS_REPEATER.name}
                                    type={FORM_TYPE.REPEATER}
                                    fields={FEE_PROFILE_ITEMS_REPEATER.fields}
                                    addLabel={FEE_PROFILE_ITEMS_REPEATER.addLabel}
                                    disabled={isPending}
                                />
                            </section>
                        </div>

                        {/* ═══ Footer (matches StepCard footer) ═══ */}
                        <div className="bg-muted/10 p-4 rounded-b-xl flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(BACK_HREF)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending || isSubmitting} className="gap-2">
                                {isPending
                                    ? <Loader2 className="size-4 animate-spin" />
                                    : <ArrowRight className="size-4" />
                                }
                                {isEdit ? CONTENT.updateBtn : CONTENT.createBtn}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

FeeProfileForm.layoutProps = {
    backHref: BACK_HREF,
    backLabel: "Fee Profiles",
};
