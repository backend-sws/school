
import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import {
    LANDING_PAGE_LEADERSHIP_GROUP,
    LANDING_PAGE_NARRATIVE_GROUP,
    LANDING_PAGE_GOALS_GROUP,
    LANDING_PAGE_JOURNEY_GROUP
} from "@/constants/page/admin/collegeConfig";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useRegisterGuide } from '@/components/GuideProvider';
import { LANDING_PAGE_CONTENT_GUIDE } from "@/constants/guides/website";
import { landingPageContentSchema, type LandingPageContentFormValues } from "@/lib/validations/settings";
import SettingsFooter from "@/components/shared/SettingsFooter";

export default function LandingPageContent() {
useRegisterGuide(LANDING_PAGE_CONTENT_GUIDE);
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, formState: { isDirty, errors } } = useForm<LandingPageContentFormValues>({
        mode: "onChange",
        resolver: zodResolver(landingPageContentSchema),
    });

    const { data: settings, isLoading } = useQuery({
        queryKey: ["settings", "landing_page"],
        queryFn: () => SettingApi.getSettingsByGroup("landing_page"),
    });

    useEffect(() => {
        if (settings?.data) {
            const formData: Record<string, any> = {};
            settings.data.forEach((s: any) => {
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
                group: "landing_page",
            }));
            return SettingApi.updateSettings("landing_page", { settings: payload });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "landing_page"] });
            toast.success("Landing page content updated successfully");
        },
        onError: () => {
            toast.error("Failed to update content");
        }
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
            <Head title="Landing Page Content" />

            <div>
                    <HeadingSmall
                        id="landing-page-content-header"
                        guidance={LANDING_PAGE_CONTENT_GUIDE}
                    />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
                        <div className="grid grid-cols-1 gap-8">
                            {/* Institutional Leadership Section */}
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2 mb-4">Institutional Leadership</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    <Each
                                        of={LANDING_PAGE_LEADERSHIP_GROUP}
                                        render={(field) => (
                                            <ControlledFormComponent
                                                key={field.name}
                                                control={control}
                                                {...field}
                                                className={field.name === 'principal_name' ? "max-w-md" : ""}
                                            />
                                        )}
                                    />
                                </div>

                            {/* Institutional Narrative Section */}
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2 mb-4">Institutional Narrative</h3>
                                <div className="grid grid-cols-1 gap-y-10">
                                    <Each
                                        of={LANDING_PAGE_NARRATIVE_GROUP}
                                        render={(field) => (
                                            <ControlledFormComponent
                                                key={field.name}
                                                control={control}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>

                            {/* Core Goals Section */}
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2 mb-4">Core Goals</h3>
                                <div className="grid grid-cols-1 gap-y-10">
                                    <Each
                                        of={LANDING_PAGE_GOALS_GROUP}
                                        render={(field) => (
                                            <ControlledFormComponent
                                                key={field.name}
                                                control={control}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>

                            {/* Our Journey Section */}
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2 mb-4">Our Journey</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    <Each
                                        of={LANDING_PAGE_JOURNEY_GROUP}
                                        render={(field) => (
                                            <ControlledFormComponent
                                                key={field.name}
                                                control={control}
                                                {...field}
                                                className={field.type === 'editor' ? 'col-span-full' : ''}
                                            />
                                        )}
                                    />
                                </div>
                        </div>

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
