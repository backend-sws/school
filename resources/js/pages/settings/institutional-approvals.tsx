
import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import { APPROVALS_GROUP } from "@/constants/page/admin/collegeConfig";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { ScrollText, Loader2 } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import { useRegisterGuide } from '@/components/GuideProvider';
import { APPROVALS_PAGE_GUIDE } from "@/constants/guides/institution";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";

export default function InstitutionalApprovals() {
    const queryClient = useQueryClient();
    useRegisterGuide(APPROVALS_PAGE_GUIDE);
    const { control, handleSubmit, reset, formState: { isDirty } } = useForm({
        mode: "onChange",
    });

    const { data: settings, isLoading } = useQuery({
        queryKey: ["settings", "approvals"],
        queryFn: () => SettingApi.getSettingsByGroup("approvals"),
    });

    useEffect(() => {
        if (settings?.data) {
            const formData: Record<string, any> = {};
            settings.data.forEach((s: any) => {
                try {
                    formData[s.setting_key] = JSON.parse(s.setting_value);
                } catch {
                    formData[s.setting_key] = s.setting_value;
                }
            });
            reset(formData);
        }
    }, [settings, reset]);

    const updateMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const processed = await processSettingsPayload(data);
            const payload = Object.entries(processed).map(([key, value]) => ({
                setting_key: key,
                value: value || "",
                group: "approvals",
            }));
            return SettingApi.updateSettings("approvals", { settings: payload });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "approvals"] });
            toast.success("Regulatory approvals updated successfully");
        },
        onError: () => toast.error("Failed to update approvals")
    });

    const onSubmit = (data: any) => updateMutation.mutate(data);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
        );
    }

    return (
        <>
            <Head title="Regulatory Approvals" />

            <div>
                <HeadingSmall
                    id="approvals-header"
                    guidance={APPROVALS_PAGE_GUIDE}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 pb-20">
                    <SettingsSection
                        title="Regulatory Approvals"
                        description="Manage your institution's regulatory approvals, affiliations, and accreditation details."
                        icon={ScrollText}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <Each
                                of={APPROVALS_GROUP}
                                render={(field) => {
                                    const isFullWidth = [
                                        FORM_TYPE.EDITOR, 
                                        FORM_TYPE.FILE, 
                                        FORM_TYPE.LIST, 
                                        FORM_TYPE.REPEATER,
                                        FORM_TYPE.TITLE,
                                        FORM_TYPE.TEXTAREA
                                    ].includes(field.type);

                                    return (
                                        <ControlledFormComponent
                                            key={field.name}
                                            control={control}
                                            {...field}
                                            className={isFullWidth ? "md:col-span-2" : "md:col-span-1"}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </SettingsSection>

                    <SettingsFooter
                        isDirty={isDirty}
                        isPending={updateMutation.isPending}
                        isSuccess={updateMutation.isSuccess}
                        onDiscard={() => reset()}
                    />
                </form>
            </div>
        </>
    );
}
