
import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import {
    DIGITAL_PRESENCE_CONTACT_GROUP,
    DIGITAL_PRESENCE_SOCIAL_GROUP
} from "@/constants/page/admin/collegeConfig";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { MapPin, Share2, Loader2 } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useRegisterGuide } from '@/components/GuideProvider';
import { DIGITAL_PRESENCE_GUIDE } from "@/constants/guides/website";
import { digitalPresenceSchema, type DigitalPresenceFormValues } from "@/lib/validations/settings";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";

export default function DigitalPresence() {
useRegisterGuide(DIGITAL_PRESENCE_GUIDE);
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, formState: { isDirty, errors } } = useForm<DigitalPresenceFormValues>({
        mode: "onChange",
        resolver: zodResolver(digitalPresenceSchema),
    });

    const { data: settings, isLoading } = useQuery({
        queryKey: ["settings", "social"],
        queryFn: () => SettingApi.getSettingsByGroup("social"),
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
                group: "social",
            }));
            return SettingApi.updateSettings("social", { settings: payload });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "social"] });
            toast.success("Digital presence updated successfully");
        },
        onError: () => {
            toast.error("Failed to update digital presence");
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
            <Head title="Digital Presence" />

            <div>
                <HeadingSmall
                    id="digital-presence-header"
                    guidance={DIGITAL_PRESENCE_GUIDE}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 pb-20">
                    <SettingsSection
                        title="Contact Information"
                        description="Manage your institution's primary contact details, physical address, and official website URL."
                        icon={MapPin}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <Each
                                of={DIGITAL_PRESENCE_CONTACT_GROUP}
                                render={(field) => (
                                    <ControlledFormComponent
                                        key={field.name}
                                        control={control}
                                        {...field}
                                        className={field.name === 'map_location_url' || field.name === 'full_address' || field.name === 'college_website' ? "col-span-full" : ""}
                                    />
                                )}
                            />
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        title="Social Media Presence"
                        description="Configure links to your institution's official social media profiles and digital channels."
                        icon={Share2}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <Each
                                of={DIGITAL_PRESENCE_SOCIAL_GROUP}
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


