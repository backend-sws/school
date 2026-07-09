import React from "react";

import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import {
    ACADEMICS_ADMISSION_GROUP,
    ACADEMICS_CALENDAR_GROUP,
    ACADEMICS_STAFF_GROUP,
    ACADEMICS_POLICIES_GROUP,
    ACADEMICS_CURRICULUM_GROUP
} from "@/constants/page/admin/collegeConfig";
import { FORM_TYPE } from "@/constants/shared/form";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Transition } from "@headlessui/react";
import { Loader2, GraduationCap, Calendar, Users, ShieldCheck, BookOpen } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { cn } from "@/lib/utils";
import { useGuide, useRegisterGuide } from "@/components/GuideProvider";
import { ACADEMICS_PAGE_GUIDE } from "@/constants/guides/institution";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";

const SECTIONS = [
    {
        id: 'admission', 
        title: 'Admission', 
        description: 'Configure institutional admission criteria, eligibility, and entry requirements.',
        icon: GraduationCap, 
        groups: [{ name: 'academics_admission', layout: ACADEMICS_ADMISSION_GROUP }]
    },
    {
        id: 'calendar', 
        title: 'Calendar', 
        description: 'Manage the academic sessions, semester timelines, and holiday schedules.',
        icon: Calendar, 
        groups: [{ name: 'academics_calendar', layout: ACADEMICS_CALENDAR_GROUP }]
    },
    {
        id: 'staff', 
        title: 'Staff', 
        description: 'Configure faculty designations, teaching loads, and academic staff policies.',
        icon: Users, 
        groups: [{ name: 'academics_staff', layout: ACADEMICS_STAFF_GROUP }]
    },
    {
        id: 'policies', 
        title: 'Policies', 
        description: 'Define the core academic policies, grading systems, and student conduct guidelines.',
        icon: ShieldCheck, 
        groups: [{ name: 'academics_policies', layout: ACADEMICS_POLICIES_GROUP }]
    },
    {
        id: 'curriculum', 
        title: 'Curriculum', 
        description: 'Manage the curriculum structure, course delivery methods, and educational standards.',
        icon: BookOpen, 
        groups: [{ name: 'academics_curriculum', layout: ACADEMICS_CURRICULUM_GROUP }]
    },
];

export default function InstitutionalAcademics() {
    const queryClient = useQueryClient();
    useRegisterGuide(ACADEMICS_PAGE_GUIDE);
    const [activeSection, setActiveSection] = useState('admission');

    const { control, handleSubmit, reset, formState: { isDirty } } = useForm({
        mode: "onChange",
    });

    const groups = ['academics_admission', 'academics_calendar', 'academics_staff', 'academics_policies', 'academics_curriculum'];

    const { data: allSettings, isLoading } = useQuery({
        queryKey: ["settings", "academics_all"],
        queryFn: async () => {
            const results = await Promise.all(groups.map(g => SettingApi.getSettingsByGroup(g)));
            const data: Record<string, any> = {};
            results.forEach(res => {
                res.data.forEach((s: any) => {
                    try {
                        data[s.setting_key] = JSON.parse(s.setting_value);
                    } catch {
                        data[s.setting_key] = s.setting_value;
                    }
                });
            });
            return data;
        },
    });

    useEffect(() => {
        if (allSettings) {
            reset(allSettings);
        }
    }, [allSettings, reset]);

    const updateMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const processed = await processSettingsPayload(data);
            const payloadsByGroup: Record<string, any[]> = {};

            // Map keys back to their groups
            const keyToGroup: Record<string, string> = {};
            SECTIONS.forEach(s => s.groups.forEach(g => g.layout.forEach(f => keyToGroup[f.name] = g.name)));

            Object.entries(processed).forEach(([key, value]) => {
                const group = keyToGroup[key];
                if (group) {
                    if (!payloadsByGroup[group]) payloadsByGroup[group] = [];
                    payloadsByGroup[group].push({ setting_key: key, value, group });
                }
            });

            return Promise.all(Object.entries(payloadsByGroup).map(([group, payload]) =>
                SettingApi.updateSettings(group, { settings: payload })
            ));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "academics_all"] });
            toast.success("Academic settings updated successfully");
        },
        onError: () => toast.error("Failed to update settings")
    });

    const onSubmit = (data: any) => updateMutation.mutate(data);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            </div>
        );
    }

    const currentSection = SECTIONS.find(s => s.id === activeSection);

    return (
        <>
            <Head title="Institutional Academics" />

            <div>
                <HeadingSmall
                    id="academics-administration-header"
                    guidance={ACADEMICS_PAGE_GUIDE}
                />

                <div className="mt-6 flex flex-wrap gap-1 border-b border-slate-200">
                    <Each
                        of={SECTIONS}
                        keyExtractor={(section) => String(section.id)}
                        render={(section) => (
                            <Button
                                key={section.id}
                                variant="ghost"
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "px-6 py-3 rounded-none border-b-2 transition-all flex items-center gap-2.5 h-auto text-[13px] font-bold uppercase tracking-wider",
                                    activeSection === section.id
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <section.icon className={cn(
                                    "h-4 w-4",
                                    activeSection === section.id ? "text-primary" : "text-slate-400"
                                )} />
                                {section.title}
                            </Button>
                        )}
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 pb-20">
                    <SettingsSection
                        title={currentSection?.title || "Academic Settings"}
                        description={currentSection?.description}
                        icon={currentSection?.icon}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {currentSection?.groups.map((group) => (
                                <React.Fragment key={group.name}>
                                    <Each
                                        of={group.layout as any}
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
                                                    className={cn(
                                                        isFullWidth ? "md:col-span-2" : "md:col-span-1",
                                                        field.type === 'title' ? "pt-6 first:pt-0" : ""
                                                    )}
                                                />
                                            );
                                        }}
                                    />
                                </React.Fragment>
                            ))}
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


