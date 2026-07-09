import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm, useFieldArray } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import SessionApi from "@/lib/api/sessionApi";
import { zodResolver } from "@hookform/resolvers/zod";
import UserApi from "@/lib/api/userApi";
import {
  CERTIFICATEHEAD_COLUMNS,
  CERTIFICATEHEAD_DIALOG_FORM_LAYOUT,
  CERTIFICATEHEAD_FORM_INITIAL_DATA,
  INITIAL_CERTIFICATEHEAD_FILTERS,
  certificate_templates,
} from "@/constants/page/admin/certificateHead";
import CertificationHeadApi from "@/lib/api/certificateHeadApi";
import SettingsApi from "@/lib/api/settingsApi";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Info } from "lucide-react";
import { Controller } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CertificateHeadQueryKeys } from "@/lib/querykey/certificateHead";

interface CertificateProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function CertificateHeadDialog({
  open,
  onClose,
  data,
}: CertificateProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    // resolver: zodResolver(CertificateFormSchema),
    defaultValues: CERTIFICATEHEAD_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });

  const {
    fields: customFields,
    append: appendCustomField,
    remove: removeCustomField,
  } = useFieldArray({
    control,
    name: "custom_fields" as any,
  });

  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const web_certificate_required = watch("web_certificate_required" as const);
  const selected_main_stream_id = watch("main_stream_id" as const);

  const { data: CertificateDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: CertificateHeadQueryKeys.detail(dataId),
    queryFn: () => CertificationHeadApi.getCertificationHeadById(dataId),
    enabled: open && isEditMode,
  });
  const { mainStreams = [] } = useCollegeMainStreams({ enabled: open });
  const { streams = [] } = useCollegeStreams({
    enabled: open,
    main_stream_id: selected_main_stream_id,
  });

  const { data: paymentOptions, isLoading: isLoadingPaymentsDetail } = useQuery(
    {
      queryKey: ["payment-gateway"],
      queryFn: () => SettingsApi.getSettings({ group: "payment" }),
      enabled: open,
    },
  );
  const toCamelCase = (str: string) =>
    str
      .replace(/\s(.)/g, (_, group1) => group1.toUpperCase())
      .replace(/\s/g, "")
      .replace(/^(.)/, (_, group1) => group1.toLowerCase());

  useEffect(() => {
    if (CertificateDetail && CertificateDetail.data.custom_fields?.length) {
      const customDefaults = CertificateDetail.data.custom_fields.reduce(
        (acc: any, field: any) => {
          const name = `custom_fields.${toCamelCase(field.field_title)}`;
          acc[name] = ""; // or field.value if backend adds later
          return acc;
        },
        {},
      );

      reset((prev: any) => ({
        ...prev,
        ...customDefaults,
      }));
    }
  }, [CertificateDetail, reset]);

  const formLayout = useMemo(() => {
    return CERTIFICATEHEAD_DIALOG_FORM_LAYOUT.map((field) => {
      if (field.name == "main_stream_id") {
        return {
          ...field,
          options:
            mainStreams?.map((item: any) => ({
              key: String(item.key),
              value: String(item.value),
              text: item?.text,
            })) ?? [],
        };
      }
      if (field.name == "stream_id") {
        return {
          ...field,
          options:
            streams?.map((item: any) => ({
              key: String(item.key),
              value: String(item.value),
              text: item?.text,
            })) ?? [],
        };
      }
      if (field.name == "payment_processor") {
        return {
          ...field,
          options:
            paymentOptions?.data?.map((item: any) => ({
              key: String(item.setting_value),
              value: String(item.setting_value),
              text: item.setting_value,
            })) ?? [],
        };
      }
      if (field.name == "certificate_template") {
        return {
          ...field,
          options:
            certificate_templates?.map((item: any) => ({
              key: String(item.key),
              value: String(item.value),
              text: item.text,
            })) ?? [],
        };
      }
      return field;
    });
  }, [CertificateDetail, paymentOptions, mainStreams, streams]);
  useEffect(() => {
    if (CertificateDetail && isEditMode) {
      const fullData = CertificateDetail.data;
      console.log(fullData);
      reset({
        title: fullData?.title,
        description: fullData?.description,
        processing_days: fullData?.processing_days,
        fee_amount: fullData?.fee_amount,
        payment_processor: fullData?.payment_processor,
        main_stream_id: String(fullData.main_stream_id),
        stream_id: String(fullData.stream_id),
        header_image: fullData.header_image || "",
        custom_fields: fullData.custom_fields || [],
      }); // <-- important
    }
  }, [CertificateDetail, isEditMode, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? CertificationHeadApi.updateCertificationHead(dataId, submitData)
        : CertificationHeadApi.createCertificationHead(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CertificateHeadQueryKeys.all,
      });
      reset();
      onClose(false);
    },
    onError: (error: any) => {
      // Global mutationCache handles this
    },
  });

  const onSubmit = (data: any) => {
    handleMutation(data);
  };

  return (
    <ModalDialog
      title={isEditMode ? "Edit Certificate" : "Add Certificate"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isSaving || isLoadingDetail}
      className="absolute sm:max-w-5xl"
    >
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          <Each
            of={formLayout}
            render={(form: any) => {
              // Hide certificate_template field if web_certificate_required is not true
              if (
                form.name === "certificate_template" &&
                !web_certificate_required
              ) {
                return null;
              }
              return (
                <ControlledFormComponent
                  control={control}
                  options={form.options}
                  {...form}
                />
              );
            }}
          />
        </div>

        {/* Certificate Templates Section - Show conditionally */}
        {web_certificate_required && (
          <div className="mt-2">
            <TooltipProvider>
              <h3 className="text-[13px] font-bold text-foreground flex items-center justify-between border-b pb-1 mb-3 uppercase tracking-tight">
                <span className="flex items-center gap-1.5">
                  Available Templates
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3.5 text-muted-foreground/50 cursor-help hover:text-primary transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="max-w-[250px] text-[11px]"
                    >
                      Select certificate templates to be available for this
                      certification head.
                    </TooltipContent>
                  </Tooltip>
                </span>
              </h3>
            </TooltipProvider>
            <div className="text-[12px] text-muted-foreground bg-muted/5 border border-dashed rounded-md p-3">
              <p>
                Selected Template:{" "}
                <span className="font-semibold text-foreground">
                  {watch("certificate_template") || "None selected"}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Custom Fields Section */}
        <div className="mt-2">
          <TooltipProvider>
            <h3 className="text-[13px] font-bold text-foreground flex items-center justify-between border-b pb-1 mb-3 uppercase tracking-tight">
              <span className="flex items-center gap-1.5">
                Custom Fields
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground/50 cursor-help hover:text-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="max-w-[250px] text-[11px]"
                  >
                    Define custom fields to be filled by applicants for this
                    certificate.
                  </TooltipContent>
                </Tooltip>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendCustomField({
                    field_title: "",
                    description: "",
                    is_required: false,
                  })
                }
                className="h-6 px-2 text-[10px] font-bold uppercase tracking-wider border-dashed hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Plus className="size-3 mr-1" />
                Add Field
              </Button>
            </h3>
          </TooltipProvider>

          <div className="space-y-1.5">
            <Each
              of={customFields}
              render={(item, index) => (
                <div
                  key={item.id}
                  className="flex items-end gap-3 group animate-in fade-in slide-in-from-top-1 duration-200 bg-muted/5 p-2 rounded-md border border-transparent hover:border-border transition-all"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground/70 uppercase flex items-center gap-1">
                        Field Title
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-2.5 text-muted-foreground/30 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="text-[10px]">
                              Enter the field title (e.g., University Roll No).
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Controller
                        control={control}
                        name={`custom_fields.${index}.field_title` as any}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="e.g., University Roll No"
                            className="h-8 text-sm bg-background"
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground/70 uppercase flex items-center gap-1">
                        Description
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-2.5 text-muted-foreground/30 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="text-[10px]">
                              Enter a helpful description or placeholder text.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Controller
                        control={control}
                        name={`custom_fields.${index}.description` as any}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="e.g., Enter your final year roll number"
                            className="h-8 text-sm bg-background"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-background rounded border">
                      <Controller
                        control={control}
                        name={`custom_fields.${index}.is_required` as any}
                        render={({ field: checkField }) => (
                          <>
                            <input
                              type="checkbox"
                              checked={checkField.value}
                              onChange={(e) =>
                                checkField.onChange(e.target.checked)
                              }
                              className="size-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            />
                            <span className="text-[10px] font-medium text-muted-foreground uppercase whitespace-nowrap">
                              Required
                            </span>
                          </>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomField(index)}
                      className="size-8 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            />

            {customFields.length === 0 && (
              <div className="text-center py-4 border border-dashed rounded-md bg-muted/5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  No custom fields added
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
