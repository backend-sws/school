import HeadingSmall from "@/components/heading-small";
import { Head, usePage } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import {
    COLLEGE_PROFILE_BASIC_INFO_GROUP,
    COLLEGE_PROFILE_IDENTITY_GROUP,
} from "@/constants/page/admin/collegeConfig";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collegeProfileSchema, type CollegeProfileFormValues } from "@/lib/validations/settings";
import { useEffect } from "react";
import { useRegisterGuide } from "@/components/GuideProvider";
import { INSTITUTION_GUIDE } from "@/constants/guides/institution";
import { toast } from "sonner";
import {
    Building2, Loader2, Palette,
} from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { type SharedData } from "@/types";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";


export default function InstitutionProfile() {
    const { institution } = usePage<SharedData>().props;
    const profileTitle = institution?.profile_settings_title ?? "Institution Profile";
    const queryClient = useQueryClient();
    useRegisterGuide(INSTITUTION_GUIDE);

    // ── Single unified form ─────────────────────────────────────────
    const { control, handleSubmit, reset, formState: { isDirty } } = useForm<CollegeProfileFormValues>({
        mode: "onChange",
        resolver: zodResolver(collegeProfileSchema),
    });

    // ── Fetch both groups in parallel ───────────────────────────────
    const { data: generalSettings, isLoading: loadingGeneral } = useQuery({
        queryKey: ["settings", "general"],
        queryFn: () => SettingApi.getSettingsByGroup("general"),
    });


    // Merge settings into the form once loaded
    useEffect(() => {
        if (!generalSettings?.data) return;

        const merged: Record<string, any> = {};

        // General settings (profile fields)
        generalSettings?.data?.forEach((s: any) => {
            merged[s.setting_key] = s.setting_value;
        });

        reset(merged);
    }, [generalSettings, reset]);

    // ── Single save mutation — splits and saves both groups ─────────
    const saveMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const processed = await processSettingsPayload(data);

            // Save general group
            return SettingApi.updateSettings("general", { 
                settings: Object.entries(processed).map(([key, value]) => ({
                    setting_key: key,
                    value: value ?? "",
                    group: "general"
                }))
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "general"] });
            toast.success(`${profileTitle} updated successfully`);
        },
        onError: () => toast.error("Failed to update profile"),
    });

    if (loadingGeneral) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
        );
    }

    return (
        <>
            <Head title={profileTitle} />

            <div className="space-y-8">
                <HeadingSmall
                    id="institution-profile-header"
                    guidance={INSTITUTION_GUIDE}
                />

                {/* ─── Single form wrapping all sections ─── */}
                <form
                    onSubmit={handleSubmit((data) => saveMutation.mutate(data))}
                    className="space-y-6"
                >
                    {/* ── Basic Information ── */}
                    <SettingsSection
                        icon={Building2}
                        title="Basic Information"
                        description="Core details about your institution — name, type, and establishment."
                        id="basic-info-section"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <Each
                                of={COLLEGE_PROFILE_BASIC_INFO_GROUP}
                                render={(field) => (
                                    <ControlledFormComponent
                                        key={field.name}
                                        control={control}
                                        {...field}
                                        className={field.name === "college_name" ? "col-span-full" : ""}
                                    />
                                )}
                            />
                        </div>
                    </SettingsSection>

                    {/* ── Identity & Branding ── */}
                    <SettingsSection
                        icon={Palette}
                        title="Identity & Branding"
                        description="Logo and visual identity assets for your institution."
                        id="branding-section"
                    >
                        <div className="grid grid-cols-1 gap-y-6">
                            <Each
                                of={COLLEGE_PROFILE_IDENTITY_GROUP}
                                render={(field) => (
                                    <ControlledFormComponent
                                        key={field.name}
                                        control={control}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </SettingsSection>


                    {/* ── Single Footer ── */}
                    <SettingsFooter
                        isDirty={isDirty}
                        isPending={saveMutation.isPending}
                        isSuccess={saveMutation.isSuccess}
                        onDiscard={() => reset()}
                    />
                </form>
            </div>
        </>
    );
}
