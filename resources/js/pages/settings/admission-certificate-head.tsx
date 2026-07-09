import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";

import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Download, Eye, Loader2, Upload } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useGuide, useRegisterGuide } from "@/components/GuideProvider";
import { ADMISSION_VERIFICATION_GUIDE } from "@/constants/guides/institution";
import Each from "@/components/Each";
import { useMutation, useQuery } from "@tanstack/react-query";
import AdmissionVerificationApi from "@/lib/api/AdmissionVerificationApi";
import Heading from "@/components/heading";
import SettingApi from "@/lib/api/settingApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ADDMISSION_CERTIFICATE_FORM_LAYOUT } from "@/constants/page/admin/AdmissionCertificateHead";
import R2Api from "@/lib/api/r2Api";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Settings",
    href: "/settings/admission verification",
  },
];

type AdmissionVerificationForm = {
  file: string | File | null;
};

/** ✅ R2 / URL resolver */

const AdmissionCertificateHead = () => {
  useRegisterGuide(ADMISSION_VERIFICATION_GUIDE);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

  const { control, handleSubmit, reset, watch } =
    useForm<AdmissionVerificationForm>({
      mode: "onChange",
    });

  const selectedFile = watch("file");
  /** ✅ Fetch existing certificate */
  useEffect(() => {
    SettingApi.getSettingByKey("admission-head-certificate")
      .then((res: any) => {
        if (res?.data?.setting_value) {
          setCertificateUrl(res.data.setting_value);
        }
      })
      .catch(() => {
        console.log("No existing certificate found");
      });
  }, []);

  useQuery({
    queryKey: ["admissionVerification"],
    queryFn: () => AdmissionVerificationApi.getVerificationSettings(),
  });

  const formLayout = useMemo(() => {
    return ADDMISSION_CERTIFICATE_FORM_LAYOUT;
  }, []);

  /** ✅ Upload mutation */
  const uploadMutation = useMutation({
    mutationFn: async (formData: AdmissionVerificationForm) => {
      const filePath = formData.file as string;
      if (!filePath) throw new Error("No file selected");

      const payload = {
        settings: [
          {
            setting_key: "admission-head-certificate",
            value: filePath,
            group: "general",
          },
        ],
      };

      await SettingApi.updateSettingbulk(payload);

      return filePath;
    },
    onSuccess: (filePath: string) => {
      setCertificateUrl(filePath);
      toast.success("Certificate uploaded successfully");
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Upload failed");
    },
  });
  const onSubmit = (formData: AdmissionVerificationForm) => {
    uploadMutation.mutate(formData);
  };

  return (
    <>
      <Head title="Admission Verification" />

      <TooltipProvider>
        <div>
          <HeadingSmall
            id="admission-certificate-header"
            guidance={ADMISSION_VERIFICATION_GUIDE}
          />

          <div className="space-y-10">
            {/* ✅ Upload Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 pb-10"
            >
              <section className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2 mb-6">Upload Authorized Certificate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <Each
                    of={formLayout}
                    render={(form: any) => (
                      <ControlledFormComponent control={control} {...form} />
                    )}
                  />
                </div>
              </section>

              {selectedFile && (
                <div className="flex justify-start">
                  <Button
                    type="submit"
                    disabled={uploadMutation.isPending}
                    className="min-w-[200px] font-bold shadow-lg shadow-indigo-200/50"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload & Finalize Certificate
                      </>
                    )}
                  </Button>
                </div>
              )}
              {/* ✅ Image Preview BELOW upload */}
              {certificateUrl && (
                <section className="space-y-4 pt-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Active Certificate Preview</h3>

                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 max-w-lg shadow-sm">
                    <img
                      src={R2Api.imageSrc(certificateUrl)}
                      alt="Admission Head Certificate"
                      className="w-full h-auto rounded-xl object-contain border border-white shadow-sm"
                    />
                  </div>
                </section>
              )}
            </form>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};



export default AdmissionCertificateHead;
