
import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import { SEO_FAVICON_GROUP } from "@/constants/page/admin/collegeConfig";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Globe, Loader2 } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useRegisterGuide } from '@/components/GuideProvider';
import { SEO_GUIDE } from "@/constants/guides/website";
import { seoSchema, type SeoFormValues } from "@/lib/validations/settings";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";

export default function SeoSettings() {
useRegisterGuide(SEO_GUIDE);
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, formState: { isDirty, errors } } = useForm<SeoFormValues>({
        mode: "onChange",
        resolver: zodResolver(seoSchema),
    });

    const { data: settings, isLoading } = useQuery({
        queryKey: ["settings", "seo"],
        queryFn: () => SettingApi.getSettingsByGroup("seo"),
    });

    useEffect(() => {
        if (settings?.data) {
            const formData: Record<string, unknown> = {};
            settings.data.forEach((s: { setting_key: string; setting_value: string }) => {
                formData[s.setting_key] = s.setting_value;
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
                group: "seo",
            }));
            return SettingApi.updateSettings("seo", { settings: payload });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "seo"] });
            toast.success("SEO & favicon settings updated successfully");
        },
        onError: () => {
            toast.error("Failed to update SEO settings");
        }
    });

    const onSubmit = (data: SeoFormValues) => updateMutation.mutate(data);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
        );
    }

    return (
        <>
            <Head title="SEO & Favicon" />

            <div>
                <HeadingSmall
                    id="seo-header"
                    guidance={SEO_GUIDE}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 pb-20">
                    <SettingsSection
                        title="Search Engine Optimization"
                        description="Configure your website's search engine visibility, meta tags, and browser favicon."
                        icon={Globe}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <Each
                                of={SEO_FAVICON_GROUP}
                                render={(field) => (
                                    <ControlledFormComponent
                                        key={field.name}
                                        control={control}
                                        {...field}
                                        className={
                                            field.name === "meta_title" || field.name === "meta_description"
                                                ? "md:col-span-2"
                                                : ""
                                        }
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


