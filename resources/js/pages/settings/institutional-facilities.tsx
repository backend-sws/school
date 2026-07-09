
import HeadingSmall from "@/components/heading-small";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import { FACILITIES_GROUP } from "@/constants/page/admin/collegeConfig";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { Warehouse, Loader2 } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useRegisterGuide } from "@/components/GuideProvider";
import { FACILITIES_PAGE_GUIDE } from "@/constants/guides/institution";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";

export default function InstitutionalFacilities() {
    const queryClient = useQueryClient();
    useRegisterGuide(FACILITIES_PAGE_GUIDE);

    const { control, handleSubmit, reset, formState: { isDirty } } = useForm({
        mode: "onChange",
    });

    const { data: facSettings, isLoading } = useQuery({
        queryKey: ["settings", "facilities_page"],
        queryFn: () => SettingApi.getSettingsByGroup("facilities_page"),
    });

    useEffect(() => {
        if (facSettings?.data) {
            const formData: Record<string, any> = {};
            facSettings.data.forEach((s: any) => {
                try {
                    formData[s.setting_key] = JSON.parse(s.setting_value);
                } catch {
                    formData[s.setting_key] = s.setting_value;
                }
            });
            reset(formData);
        }
    }, [facSettings, reset]);

    const updateMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const processed = await processSettingsPayload(data);
            const payload = Object.entries(processed).map(([key, value]) => ({
                setting_key: key,
                value: value || "",
                group: "facilities_page",
            }));
            return SettingApi.updateSettings("facilities_page", { settings: payload });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "facilities_page"] });
            toast.success("Website facilities updated successfully");
        },
        onError: () => toast.error("Failed to update facilities"),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
        );
    }

    return (
        <>
            <Head title="Institutional Facilities" />

            <div>
                <HeadingSmall
                    id="campus-facilities-header"
                    guidance={FACILITIES_PAGE_GUIDE}
                />

                <form onSubmit={handleSubmit((v) => updateMutation.mutate(v))} className="mt-6 space-y-6 pb-20">
                    <SettingsSection
                        title="Website Amenities Showcase"
                        description="Configure the facility cards displayed on your institution's public landing page."
                        icon={Warehouse}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <Each
                                of={FACILITIES_GROUP as any[]}
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
