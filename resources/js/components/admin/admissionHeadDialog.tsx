import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ControlledFormComponent, {
  DropdownField,
} from "../shared/ControlledFormComponent";
import {
  Plus,
  Trash2,
  Info,
  Calendar,
  IndianRupee,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import AdmissionHeadApi from "@/lib/api/admissionHeadApi";
import {
  MANAGECOURSE_FORM_INITIAL_DATA,
  MANAGECOURSE_SEGMENT_GENERAL,
  MANAGECOURSE_SEGMENT_ELIGIBILITY,
  MANAGECOURSE_SEGMENT_FEES,
  MANAGECOURSE_TAB_VALIDATION_MAP,
  MANAGECOURSE_TABS,
} from "@/constants/page/admin/admissionHead";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { useCollegeSubject } from "@/hooks/useSubjects";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { useFeeTypes } from "@/hooks/useFeeTypes";
import { useSubjectCategory } from "@/hooks/useSubjectCategory";
import { FORM_TYPE } from "@/constants";
import { admissionHeadSchema } from "@/lib/validations/admissionHead";
import { AdmissionHeadQueryKeys } from "@/lib/querykey/admissionHead";

interface AdmissionHeadProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

interface DropdownOptions {
  mainStreams: any[];
  streams: any[];
  subjects: any[];
  sessions: any[];
  feeTypes: any[];
}

export function AdmissionHeadDialog({
  open,
  onClose,
  data,
}: AdmissionHeadProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(admissionHeadSchema) as any,
    defaultValues: MANAGECOURSE_FORM_INITIAL_DATA,
    mode: "onChange",
  });

  // console.log(errors,'test');

  const hasInitializedRef = React.useRef(false);

  const {
    fields: feeFields,
    append: appendFee,
    remove: removeFee,
  } = useFieldArray({
    control,
    name: "fees" as any,
  });

  const { fields: paperCategoryFields } = useFieldArray({
    control,
    name: "subject_paper_categories" as any,
  });

  const isViewMode = !!data?.viewMode;
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const mainStreamId = watch("main_stream_id" as any);
  const streamId = watch("stream_id" as any);
  const allowPaperSelection = watch("allow_subject_paper_selection" as any);
  const hasApplicationFees = watch("has_application_fees" as any);
  const { data: admissionHead, isLoading: isLoadingDetail } = useQuery({
    queryKey: AdmissionHeadQueryKeys.detail(dataId),
    queryFn: () => AdmissionHeadApi.getAdmissionHeadById(dataId),
    enabled: open && isEditMode,
  });

  const { mainStreams = [] } = useCollegeMainStreams({
    enabled: open,
    params: {
      active_only: true,
      all: true,
    },
  });

  const { streams = [] } = useCollegeStreams({
    main_stream_id: mainStreamId,
    enabled: open && !!mainStreamId,
    params: {
      active_only: true,
      all: true,
    },
  });

  const { subjects = [] } = useCollegeSubject({
    stream_id: streamId,
    enabled: open && !!streamId,
    params: {
      active_only: true,
      all: true,
    },
  });
  console.log(subjects, "subecctjs");
  const { sessions = [] } = useCollegeSessions({
    streamId: streamId,
    enabled: open && !!streamId,
    params: {
      active_only: true,
      all: true,
    },
  });

  const { feeTypes = [] } = useFeeTypes({ enabled: open });

  const { subjectCategories = [] } = useSubjectCategory({ enabled: open });

  const initialCategories = useMemo(
    () =>
      subjectCategories.map((cat: any) => ({
        subject_category_id: cat.id,
        category_name: cat.name,
        is_enabled: false,
        limit: 1,
        order: 1,
      })),
    [subjectCategories],
  );

  const [activeTab, setActiveTab] = React.useState<
    "general" | "eligibility" | "fees"
  >("general");

  // Calculate total fee amount in real-time
  const feesValues = watch("fees" as any) ?? [];
  const totalFeeAmount = (feesValues as { amount?: string | number }[]).reduce(
    (sum, row) => {
      const amt = Number(row?.amount) || 0;
      return sum + amt;
    },
    0,
  );

  const filteredGeneralSegment = MANAGECOURSE_SEGMENT_GENERAL;

  const filteredEligibilitySegment = MANAGECOURSE_SEGMENT_ELIGIBILITY;

  const filteredFeesSegment = useMemo(() => {
    return MANAGECOURSE_SEGMENT_FEES.filter((field) => {
      if (field.name === "application_fees") {
        return !!hasApplicationFees;
      }
      return true;
    });
  }, [hasApplicationFees]);

  const dropdownOptions = useMemo<DropdownOptions>(() => {
    return {
      mainStreams,
      streams,
      subjects,
      sessions,
      feeTypes,
    };
  }, [mainStreams, streams, subjects, sessions, feeTypes]);
  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? AdmissionHeadApi.updateAdmissionHead(dataId, submitData)
        : AdmissionHeadApi.createAdmissionHead(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AdmissionHeadQueryKeys.all });
      onClose(false);
    },
  });

  useEffect(() => {
    if (!open) {
      hasInitializedRef.current = false;
      return;
    }

    if (hasInitializedRef.current) return;

    if (isEditMode && admissionHead && subjectCategories.length > 0) {
      const fullData = admissionHead.data || admissionHead;

      // Map papers to subject_paper_categories using initialCategories as base
      const mappedPapers = initialCategories.map((cat: any) => {
        const existingPaper = (fullData.papers || []).find(
          (p: any) =>
            String(p.subject_category_id) === String(cat.subject_category_id),
        );
        return {
          ...cat,
          is_enabled: !!existingPaper,
          limit: existingPaper ? existingPaper.paper_limit : 1,
          order: existingPaper ? existingPaper.sort_order || 1 : 1,
        };
      });

      reset({
        ...MANAGECOURSE_FORM_INITIAL_DATA,
        ...fullData,
        main_stream_id: String(fullData.main_stream_id || ""),
        stream_id: String(fullData.stream_id || ""),
        session_id: String(fullData.session_id || ""),
        major_subject_id: String(fullData.major_subject_id || ""),
        last_date: fullData.last_date
          ? typeof fullData.last_date === "string"
            ? fullData.last_date.split("T")[0]
            : ""
          : "",
        fees: (fullData.fee_structures || []).map((f: any) => {
          // Map from backend FeeStructureRule to form field
          let fee_type_id = f.fee_type_id
            ? String(f.fee_type_id)
            : f.fee_type?.id
              ? String(f.fee_type.id)
              : f.fee_particular_id
                ? String(f.fee_particular_id)
                : "";

          if (!fee_type_id && (f.fee_type_name || f.fee_type)) {
            const name = f.fee_type_name || f.fee_type;
            const match = feeTypes.find(
              (p: any) => p.text === name,
            );
            if (match) fee_type_id = String(match.value);
          }

          return {
            fee_type_id,
            amount: f.amount ? String(Number(f.amount)) : "0",
          };
        }),
        subject_paper_categories: mappedPapers,
      });
      hasInitializedRef.current = true;
    } else if (!isEditMode && subjectCategories.length > 0) {
      reset({
        ...MANAGECOURSE_FORM_INITIAL_DATA,
        subject_paper_categories: initialCategories,
      });
      hasInitializedRef.current = true;
    }
  }, [
    open,
    isEditMode,
    admissionHead,
    initialCategories,
    subjectCategories,
    reset,
  ]);

  const onSubmit = (formData: any) => {
    const submitData = {
      ...formData,
      // Transform subject_paper_categories to admission_head_papers
      admission_head_papers: (formData.subject_paper_categories || [])
        .filter((cat: any) => cat.is_enabled)
        .map((cat: any) => ({
          subject_category_id: cat.subject_category_id,
          paper_limit: Number(cat.limit),
          sort_order: Number(cat.order),
          is_compulsory: true, // Defaulting to true as per common requirement
        })),
      fees: (formData.fees || []).map((f: any) => ({
        ...f,
        amount: Number(f.amount),
      })),
    };
    handleMutation(submitData);
  };

  const handleNext = async () => {
    const fieldsToValidate = MANAGECOURSE_TAB_VALIDATION_MAP[activeTab] || [];
    console.log(fieldsToValidate, "fieldtovalidate");
    const isValid = await trigger(fieldsToValidate as any);
    console.log(fieldsToValidate, "fieldtovalidate");
    console.log(isValid, "iisvalid");

    if (isValid) {
      if (activeTab === "general") setActiveTab("eligibility");
      else if (activeTab === "eligibility") setActiveTab("fees");
    }
  };

  const handleBack = () => {
    if (activeTab === "fees") setActiveTab("eligibility");
    else if (activeTab === "eligibility") setActiveTab("general");
  };

  const currentTabFields = MANAGECOURSE_TAB_VALIDATION_MAP[activeTab] || [];
  const isCurrentTabInvalid = currentTabFields.some(
    (field) => errors[field as any],
  );

  const handleTabChange = async (targetTab: typeof activeTab) => {
    // If moving backwards or to the same tab, just switch
    const tabOrder = ["general", "eligibility", "fees"];
    if (tabOrder.indexOf(targetTab) <= tabOrder.indexOf(activeTab)) {
      setActiveTab(targetTab);
      return;
    }

    // If moving forwards, validate current tab
    const isValid = await trigger(currentTabFields as any);
    if (isValid) {
      setActiveTab(targetTab);
    }
  };

  return (
    <ModalDialog
      title={
        isViewMode
          ? "View Admission Head"
          : isEditMode
            ? "Edit Admission Head"
            : "Add Admission Head"
      }
      open={open}
      onClose={onClose}
      onPrimaryClick={
        isViewMode
          ? undefined
          : activeTab === "fees"
            ? (handleSubmit(onSubmit) as any)
            : handleNext
      }
      submitLabel={
        isViewMode
          ? ""
          : activeTab === "fees"
            ? isEditMode
              ? "Update"
              : "Save"
            : "Next"
      }
      primaryDisabled={!isViewMode && isCurrentTabInvalid}
      onSecondaryClick={activeTab !== "general" ? handleBack : undefined}
      secondaryLabel={
        <div className="flex items-center gap-1.5">
          <ChevronLeft className="size-4" />
          <span>Previous</span>
        </div>
      }
      isLoading={isSaving || isLoadingDetail}
      className="absolute sm:max-w-5xl"
    >
      <div className="flex flex-col gap-y-6">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border w-fit mx-auto sm:mx-0">
          {MANAGECOURSE_TABS.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant="ghost"
              onClick={() => handleTabChange(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all h-auto",
                activeTab === tab.id
                  ? "bg-background text-primary shadow-sm hover:bg-background"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
              )}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                <Each
                  of={filteredGeneralSegment}
                  render={(form: any) => (
                    <ControlledFormComponent
                      control={control}
                      options={
                        form.optionsKey
                          ? dropdownOptions[
                          form.optionsKey as keyof DropdownOptions
                          ]
                          : form.options
                      }
                      {...form}
                      disabled={isViewMode || form.disabled}
                    />
                  )}
                />
              </div>
            </div>
          )}

          {activeTab === "eligibility" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                <Each
                  of={filteredEligibilitySegment}
                  render={(form: any) => (
                    <ControlledFormComponent
                      control={control}
                      options={
                        form.optionsKey
                          ? dropdownOptions[
                          form.optionsKey as keyof DropdownOptions
                          ]
                          : form.options
                      }
                      {...form}
                      disabled={isViewMode || form.disabled}
                    />
                  )}
                />
              </div>

              {/* Subject Paper Categories Section */}
              {allowPaperSelection && (
                <div className="mt-4 p-4 border rounded-xl bg-muted/5">
                  <TooltipProvider>
                    <h3 className="text-[13px] font-bold text-foreground border-b pb-2 mb-4 uppercase tracking-tight flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      Paper Categories Selection
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3.5 text-muted-foreground/50 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[250px]">
                          Define the available paper categories and their
                          selection limits.
                        </TooltipContent>
                      </Tooltip>
                    </h3>
                  </TooltipProvider>

                  <div className="rounded-lg border overflow-hidden shadow-sm">
                    <div className="grid grid-cols-[45px_1fr_90px_90px] bg-muted/80 text-[11px] font-bold uppercase tracking-wider border-b">
                      <div className="p-3 border-r"></div>
                      <div className="p-3 border-r">Category</div>
                      <div className="p-3 border-r text-center">Limit</div>
                      <div className="p-3 text-center">Order</div>
                    </div>

                    <div className="divide-y overflow-y-auto max-h-[300px] custom-scrollbar bg-background">
                      <Each
                        of={paperCategoryFields}
                        render={(field, index) => (
                          <div
                            key={field.id}
                            className="grid grid-cols-[45px_1fr_90px_90px] items-center hover:bg-muted/30 transition-colors"
                          >
                            <div className="p-3 border-r flex justify-center">
                              <Controller
                                control={control}
                                name={
                                  `subject_paper_categories.${index}.is_enabled` as any
                                }
                                render={({ field: checkField }) => (
                                  <input
                                    type="checkbox"
                                    checked={checkField.value}
                                    onChange={(e) =>
                                      checkField.onChange(e.target.checked)
                                    }
                                    disabled={isViewMode}
                                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                  />
                                )}
                              />
                            </div>
                            <div className="p-3 border-r text-[11px] font-semibold text-foreground uppercase tracking-tight">
                              {watch(
                                `subject_paper_categories.${index}.category_name` as any,
                              )}
                            </div>
                            <div className="p-3 border-r text-center">
                              <Controller
                                control={control}
                                name={
                                  `subject_paper_categories.${index}.limit` as any
                                }
                                render={({ field: limitField }) => (
                                  <Input
                                    {...limitField}
                                    type="text"
                                    className="h-8 text-[11px] text-center px-1 bg-background"
                                    disabled={isViewMode}
                                  />
                                )}
                              />
                            </div>
                            <div className="p-3 text-center">
                              <Controller
                                control={control}
                                name={
                                  `subject_paper_categories.${index}.order` as any
                                }
                                render={({ field: orderField }) => (
                                  <Input
                                    {...orderField}
                                    type="text"
                                    className="h-8 text-[11px] text-center px-1 bg-background"
                                    disabled={isViewMode}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "fees" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                <Each
                  of={filteredFeesSegment}
                  render={(form: any) => (
                    <ControlledFormComponent
                      control={control}
                      options={
                        form.optionsKey
                          ? dropdownOptions[
                          form.optionsKey as keyof DropdownOptions
                          ]
                          : form.options
                      }
                      {...form}
                      disabled={isViewMode || form.disabled}
                      disabledDays={
                        form.name === "last_date" && !isEditMode
                          ? {
                            before:
                              new Date(
                                new Date().setHours(0, 0, 0, 0),
                              ).getTime() + 86400000,
                          } // Tomorrow
                          : undefined
                      }
                    />
                  )}
                />
              </div>

              {/* Admission Fee Structure Section */}
              <div className="mt-4 p-4 border rounded-xl bg-muted/5">
                <TooltipProvider>
                  <h3 className="text-[13px] font-bold text-foreground border-b pb-2 mb-4 uppercase tracking-tight flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <IndianRupee className="size-4 text-primary" />
                      Admission Fee Structure
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendFee({ fee_type_id: "", amount: 0 })
                      }
                      disabled={isViewMode}
                      className="h-7 px-3 text-[10px] font-bold uppercase border-dashed hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <Plus className="size-3.5 mr-1.5" />
                      Add Row
                    </Button>
                  </h3>
                </TooltipProvider>

                <div className="space-y-3">
                  <Each
                    of={feeFields}
                    render={(item, index) => {
                      // Get current row's selected value
                      const currentValue = (
                        feesValues as { fee_type_id?: string | number }[]
                      )?.[index]?.fee_type_id;

                      // Get all selected fee_type_ids from OTHER rows only
                      const otherSelectedIds = (
                        feesValues as { fee_type_id?: string | number }[]
                      )
                        .filter((_, i) => i !== index)
                        .map((f) => f?.fee_type_id)
                        .filter(
                          (id) => id !== undefined && id !== null && id !== "",
                        )
                        .map((id) => String(id));

                      // Filter options: show unselected ones + current row's own selection
                      const availableOptions = feeTypes.filter(
                        (opt: any) => {
                          const optValue = String(opt.value);
                          // Always keep current row's selection visible
                          if (currentValue && String(currentValue) === optValue)
                            return true;
                          // Hide options selected in other rows
                          return !otherSelectedIds.includes(optValue);
                        },
                      );

                      return (
                        <div
                          key={item.id}
                          className="flex items-end gap-3 p-3 bg-background rounded-lg border shadow-sm hover:border-primary/20 transition-all"
                        >
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold text-muted-foreground/80 uppercase">
                              Fee Type
                              </Label>
                              <Controller
                                control={control}
                                name={`fees.${index}.fee_type_id` as any}
                                render={({ field }) => (
                                  <DropdownField
                                    {...field}
                                    type={FORM_TYPE.DROPDOWN}
                                    options={availableOptions}
                                    placeholder="Select fee type..."
                                    className={cn(
                                      "h-9 text-sm",
                                      (errors.fees as any)?.[index]
                                        ?.fee_type_id &&
                                      "border-destructive",
                                    )}
                                    searchable={true}
                                    disabled={isViewMode}
                                  />
                                )}
                              />
                              {(errors.fees as any)?.[index]
                                ?.fee_type_id && (
                                  <p className="text-[10px] font-medium text-destructive">
                                    {
                                      (errors.fees as any)[index]
                                        ?.fee_type_id?.message
                                    }
                                  </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold text-muted-foreground/80 uppercase">
                                Amount (₹)
                              </Label>
                              <Controller
                                control={control}
                                name={`fees.${index}.amount` as any}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="text"
                                    className={cn(
                                      "h-9 text-sm",
                                      (errors.fees as any)?.[index]?.amount &&
                                      "border-destructive",
                                    )}
                                    disabled={isViewMode}
                                  />
                                )}
                              />
                              {(errors.fees as any)?.[index]?.amount && (
                                <p className="text-[10px] font-medium text-destructive">
                                  {(errors.fees as any)[index]?.amount?.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFee(index)}
                            disabled={isViewMode || feeFields.length <= 1}
                            className="size-9 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-full transition-all disabled:hidden"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      );
                    }}
                  />

                  {(errors?.fees as any)?.message && (
                    <div className="text-center py-4 border border-dashed border-destructive/30 rounded-lg bg-destructive/5">
                      <p className="text-[11px] font-bold text-destructive uppercase tracking-wide">
                        {(errors?.fees as any)?.message}
                      </p>
                    </div>
                  )}

                  {/* Total Amount */}
                  {feeFields.length > 0 && (
                    <div className="flex justify-end pt-3 mt-2 border-t">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">
                          Total Amount:
                        </span>
                        <span className="text-lg font-bold text-primary">
                          ₹{totalFeeAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
