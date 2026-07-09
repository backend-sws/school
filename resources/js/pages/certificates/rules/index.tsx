import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import SettingsLayout from "@/layouts/settings/layout";

import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingApi from "@/lib/api/settingApi";
import { processSettingsPayload } from "@/lib/uploadSettingsPayload";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, Undo2, ScrollText } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Transition } from "@headlessui/react";
import { Card, CardHeader } from "@/components/ui/card";
import { CERTIFICATE_RULES_GROUP } from "@/constants/page/admin/certificate";
import {
  CertificateRulesSchema,
  CertificateSettingsFormValues,
} from "@/lib/validations/certificate";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Certificates", href: "/certificates/applications" },
  { title: "Certificate Rules", href: "/certificates/rules" },
];

const AdmissionSetting = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<CertificateSettingsFormValues>({
    mode: "onChange",
    resolver: zodResolver(CertificateRulesSchema),
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings", "certificate_rules"],
    queryFn: () => SettingApi.getSettingsByGroup("certificate_rules"),
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
      console.log("Submitting data:", data); // Debug log
      const processed = await processSettingsPayload(data);
      const payload = Object.entries(processed).map(([key, value]) => ({
        setting_key: key,
        value: value || "",
        group: "certificate_rules",
      }));
      return SettingApi.updateSettings("certificate_rules", {
        settings: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", "certificate_rules"],
      });
      toast.success("Certificate settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update certificate settings");
    },
  });

  const onSubmit = (data: any) => updateMutation.mutate(data);

  if (isLoading) {
    return (
      <>
        <SettingsLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
          </div>
        </SettingsLayout>
      </>
    );
  }

  return (
    <>
      <Head title="Certificate Settings" />
      <SettingsLayout>
        <PageContainer maxWidth="full">
          <div className="space-y-8">
            <MainPageHeader
              icon={ScrollText}
              title="Certificate Rules"
              subtitle="Configure your institution's certificate generation rules and instructions."
              breadcrumbs={breadcrumbs}
              tip="These settings control the appearance and instructions shown to students during the certificate download."
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 max-w-4xl pb-10"
            >
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-6">
                      <Each
                        of={CERTIFICATE_RULES_GROUP}
                        render={(field) => (
                          <ControlledFormComponent
                            key={field.name}
                            control={control}
                            name={field.name as any}
                            type={field.type}
                            label={field.label}
                            tooltip={field.tooltip}
                            className={
                              field.type === "editor" ? "col-span-full" : ""
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex items-center justify-end gap-4 pt-6 sticky bottom-0 bg-background/80 backdrop-blur-sm z-10 pb-4">
                <Transition
                  show={updateMutation.isSuccess && !isDirty}
                  enter="transition ease-in-out duration-300"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in-out duration-300"
                  leaveTo="opacity-0"
                >
                  <p className="text-sm text-green-600 font-medium">
                    Saved Successfully
                  </p>
                </Transition>

                {isDirty && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => reset()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !isDirty}
                  className="min-w-[140px] shadow-lg shadow-primary/20"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </PageContainer>
      </SettingsLayout>
    </>
  );
};

export default AdmissionSetting;
