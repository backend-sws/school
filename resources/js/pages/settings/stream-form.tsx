import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";

import { Head } from "@inertiajs/react";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Transition } from "@headlessui/react";
import { Loader2, Save, Undo2 } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { useRegisterGuide } from '@/components/GuideProvider';
import { ACADEMIC_HIERARCHY_GUIDE } from "@/constants/guides/settings";
import { STREAM_FORM_MAPPING_LAYOUT } from "@/constants/page/admin/collegeConfig";
import SettingApi from "@/lib/api/settingApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { streamFormMappingSchema, type StreamFormMappingFormValues } from "@/lib/validations/settings";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";

const StreamForm = () => {
  useRegisterGuide(ACADEMIC_HIERARCHY_GUIDE);
  const contentMap = useInstitutionContent();
  const pageTitle = contentMap.settings_academic_hierarchy_title;
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<StreamFormMappingFormValues>({
    mode: "onChange",
    resolver: zodResolver(streamFormMappingSchema),
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings", "stream_mapping"],
    queryFn: () => SettingApi.getSettingsByGroup("stream_mapping"),
  });

  useEffect(() => {
    if (settings?.data) {
      const formData: Record<string, string> = {};
      settings.data.forEach((s: { setting_key: string; setting_value: string }) => {
        formData[s.setting_key] = s.setting_value || "";
      });
      reset(formData);
    }
  }, [settings, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const payload = Object.entries(data).map(([key, value]) => ({
        setting_key: key,
        value: String(value ?? ""),
        group: "stream_mapping",
      }));
      return SettingApi.updateSettings("stream_mapping", { settings: payload });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "stream_mapping"] });
      reset(variables as Record<string, string>);
      toast.success("Stream form mapping updated successfully");
    },
    onError: () => {
      toast.error("Failed to update stream mapping");
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
      </div>
    );
  }

  return (
    <>
      <Head title={pageTitle || "Stream Settings"} />

      <div>
        <HeadingSmall
          id="stream-mapping-header"
          guidance={ACADEMIC_HIERARCHY_GUIDE}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2 mb-6">Stream Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <Each
                of={STREAM_FORM_MAPPING_LAYOUT}
                render={(field) => (
                  <ControlledFormComponent
                    key={field.name}
                    control={control}
                    {...field}
                  />
                )}
              />
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md z-20 pb-6 mt-12">
            <Transition
              show={updateMutation.isSuccess && !isDirty}
              enter="transition ease-in-out duration-300"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in-out duration-300"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                All changes saved
              </p>
            </Transition>

            {isDirty && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Discard Changes
              </Button>
            )}

            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="min-w-[160px]"
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Commit Settings
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};



export default StreamForm;
