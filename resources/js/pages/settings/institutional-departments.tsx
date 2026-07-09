
import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import { DEPARTMENTS_CATEGORIES_GROUP, DEPARTMENTS_LIST_GROUP } from "@/constants/page/admin/collegeConfig";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { LayoutGrid, Loader2, Network } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useGuide, useRegisterGuide } from "@/components/GuideProvider";
import { DEPARTMENTS_PAGE_GUIDE } from "@/constants/guides/institution";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";

export default function InstitutionalDepartments() {
    const queryClient = useQueryClient();
    useRegisterGuide(DEPARTMENTS_PAGE_GUIDE);
    const { control, handleSubmit, reset, formState: { isDirty } } = useForm({
        mode: "onChange",
    });

    const { data: settings, isLoading } = useQuery({
        queryKey: ["settings", "departments_page"],
        queryFn: () => SettingApi.getSettingsByGroup("departments_page"),
    });

    useEffect(() => {
        if (settings?.data) {
            const formData: Record<string, any> = {};
            settings.data.forEach((s: any) => {
                try {
                    // Try to format JSON for the editor if it's the list
                    const value = JSON.parse(s.setting_value);
                    if (s.setting_key === 'departments_list') {
                        formData[s.setting_key] = JSON.stringify(value, null, 2);
                    } else {
                        formData[s.setting_key] = value;
                    }
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
            const payload = Object.entries(processed).map(([key, value]) => {
                // For the list, try to minify the JSON before saving
                let finalValue = value;
                if (key === 'departments_list') {
                    try {
                        finalValue = JSON.stringify(JSON.parse(value as string));
                    } catch {
                        // Keep as is if parsing fails
                    }
                }
                return {
                    setting_key: key,
                    value: finalValue || "",
                    group: "departments_page",
                };
            });
            return SettingApi.updateSettings("departments_page", { settings: payload });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "departments_page"] });
            toast.success("Departments updated successfully");
        },
        onError: () => toast.error("Failed to update departments")
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
            <Head title="Academic Departments" />

            <div>
                <HeadingSmall
                    id="departments-header"
                    guidance={DEPARTMENTS_PAGE_GUIDE}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 pb-20">
                    <SettingsSection
                        title="Department Categories"
                        description="Configure the top-level categories and organizational groupings for your academic departments."
                        icon={LayoutGrid}
                    >
                        <div className="grid grid-cols-1 gap-y-6">
                            <Each
                                of={DEPARTMENTS_CATEGORIES_GROUP}
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

                    <SettingsSection
                        title="Faculty & Department Mapping"
                        description="Define the detailed mapping of faculties to their respective departments and programs."
                        icon={Network}
                    >
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                            <Each
                                of={DEPARTMENTS_LIST_GROUP}
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
