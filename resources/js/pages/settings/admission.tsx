import HeadingSmall from "@/components/heading-small";
import { type BreadcrumbItem, type SharedData } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import {
  ADMISSION_RE_ADMISSION_GROUP,
  ADMISSION_NEW_ADMISSION_GROUP,
  ADMISSION_REGISTRATION_NUMBER_GROUP
} from "@/constants/page/admin/collegeConfig";
import { useRegisterGuide } from '@/components/GuideProvider';
import { ADMISSION_POLICY_GUIDE } from "@/constants/guides/settings";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RefreshCw, UserPlus, Loader2, Fingerprint } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { admissionSettingsSchema, type AdmissionSettingsFormValues } from "@/lib/validations/settings";
import SettingsFooter from "@/components/shared/SettingsFooter";
import SettingsSection from "@/components/shared/SettingsSection";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Admission setting",
    href: "/admission",
  },
];

const AdmissionSetting = () => {
  useRegisterGuide(ADMISSION_POLICY_GUIDE);
  const { institution } = usePage<SharedData>().props;
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, watch, formState: { isDirty, errors } } = useForm<AdmissionSettingsFormValues>({
    mode: "onChange",
    resolver: zodResolver(admissionSettingsSchema),
  });

  const regNoPrefix = watch("reg_no_prefix");
  const regNoIncludeYear = watch("reg_no_include_year");
  const regNoSequencePadding = watch("reg_no_sequence_padding");

  // Generate preview registration number
  const prefix = typeof regNoPrefix === "string" ? regNoPrefix : (institution?.code || "INST");
  const year = regNoIncludeYear !== "0" ? new Date().getFullYear().toString() : "";
  const paddingLength = parseInt(String(regNoSequencePadding), 10) || 6;
  const sampleSeq = "1".padStart(paddingLength, "0");
  const previewRegNo = `${prefix}${year}${sampleSeq}`;

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings", "admission"],
    queryFn: () => SettingApi.getSettingsByGroup("admission"),
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
        group: "admission",
      }));
      return SettingApi.updateSettings("admission", { settings: payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "admission"] });
      toast.success("Admission settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update admission settings");
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
      <Head title="Admission Settings" />

      <div>
        <HeadingSmall
          id="admission-settings-header"
          guidance={ADMISSION_POLICY_GUIDE}
        />

        <form id="admission-settings-form" onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 pb-20">

          <SettingsSection
            title="Re-Admission Policy"
            description="Configure policies and requirements for returning students seeking re-admission."
            icon={RefreshCw}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Each
                of={ADMISSION_RE_ADMISSION_GROUP}
                render={(field) => (
                  <ControlledFormComponent
                    key={field.name}
                    control={control}
                    {...field}
                    className={field.type === 'title' || field.type === 'editor' ? "col-span-full" : ""}
                  />
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="New Admission Policy"
            description="Define the core policies, eligibility, and procedures for new student enrollments."
            icon={UserPlus}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Each
                of={ADMISSION_NEW_ADMISSION_GROUP}
                render={(field) => (
                  <ControlledFormComponent
                    key={field.name}
                    control={control}
                    {...field}
                    className={field.type === 'title' || field.type === 'editor' ? "col-span-full" : ""}
                  />
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Registration Number Policy"
            description="Configure custom formatting and sequence options for generated student registration numbers."
            icon={Fingerprint}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Each
                of={ADMISSION_REGISTRATION_NUMBER_GROUP}
                render={(field) => (
                  <ControlledFormComponent
                    key={field.name}
                    control={control}
                    {...field}
                    className={field.type === 'title' || field.type === 'editor' ? "col-span-full" : ""}
                  />
                )}
              />

              {/* Registration Number Live Preview */}
              <div className="col-span-full mt-4 p-4 rounded-xl border bg-primary/5 border-primary/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary/80">Live Preview</span>
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xl md:text-2xl font-black text-primary tracking-wide">
                    {previewRegNo}
                  </div>
                  <span className="text-xs text-muted-foreground bg-background border px-2 py-0.5 rounded-full font-medium shadow-sm">
                    Sample #1
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is how the registration number will look for the first student admitted in this session.
                </p>
              </div>
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
};



export default AdmissionSetting;
