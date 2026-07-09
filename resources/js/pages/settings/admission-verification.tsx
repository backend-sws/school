import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Transition } from "@headlessui/react";
import {
  Download,
  Eye,
  Loader2,
  Megaphone,
  Plus,
  Save,
  Undo2,
  Upload,
} from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useRegisterGuide } from '@/components/GuideProvider';
import { VERIFICATION_LOGIC_GUIDE } from "@/constants/guides/settings";
import { ADMISSION_VERIFICATION_GUIDE as INSTITUTION_ADMISSION_VERIFICATION_GUIDE } from "@/constants/guides/institution";
import Each from "@/components/Each";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ADMISSION_VERIFICATION_COLUMNS,
  ADMISSION_VERIFICATION_FORM_LAYOUT,
} from "@/constants/page/admin/admissionVerification";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import AdmissionVerificationApi from "@/lib/api/AdmissionVerificationApi";
import AdmissionVerificationDialog from "@/components/admin/admissionVerifyDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import Heading from "@/components/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Settings",
    href: "/settings/admission verification",
  },
];

type AdmissionVerificationForm = {
  streamId: number | string;
  file: File[];
};

const AdmissionVerification = () => {
useRegisterGuide(INSTITUTION_ADMISSION_VERIFICATION_GUIDE);
  const [globalStatus, setGlobalStatus] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    AdmissionVerificationApi.getVerificationSettings()
      .then((res) => {
        // Assuming API returns { global_status: true/false }
        setGlobalStatus(res.data.global_status);
      })
      .catch(() => {
        toast.error("Failed to fetch global verification status");
      });
    //   .finally(() => setIsLoading(false));
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<AdmissionVerificationForm>({
    mode: "onChange",
    defaultValues: {
      streamId: "",
      file: [],
    },
  });
  const DialogDisclosure = useDisclosure();

  const { mainStreams = [] } = useCollegeMainStreams({ enabled: true });
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState();
  const { data, isLoading } = useQuery({
    queryKey: ["admissionVerification"],
    queryFn: () => AdmissionVerificationApi.getVerificationSettings(),
  });
  const toggleStatusDisclosure = useDisclosure<any>();

  const toggleGlobalVerificationMutation = useMutation({
    mutationFn: (status: boolean) => {
      return AdmissionVerificationApi.toggleGlobalVerification(status);
    },
    onSuccess: (_, status) => {
      setGlobalStatus(status);
      queryClient.invalidateQueries({ queryKey: ["admissionVerification"] });
      toast.success(
        `Global verification has been ${status ? "enabled" : "disabled"}`,
      );
    },
    onError: () => {
      toast.error("Failed to update global verification status");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return AdmissionVerificationApi.toggleStreamVerification(
        toggleStatusDisclosure?.data?.main_stream_id,
        !toggleStatusDisclosure?.data?.is_enabled,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissionVerification"] });
      toggleStatusDisclosure.onClose();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (data: AdmissionVerificationForm) => {
      return AdmissionVerificationApi.uploadStudentDatabase(
        data.streamId,
        data.file[0], // single Excel file
      );
    },
    onSuccess: () => {
      toast.success("Student verification database uploaded successfully");
      reset();
    },
    onError: () => {
      toast.error("Failed to upload student database");
    },
  });

  const onSubmit = (data: AdmissionVerificationForm) => {
    uploadMutation.mutate(data);
  };
  // Status filter options
  const handleToggleStatus = (row: any) => {
    toggleStatusDisclosure.onOpen(row);
  };
  const confirmToggleStatus = () => {
    console.log(toggleStatusMutation);
    toggleStatusMutation.mutate(toggleStatusDisclosure?.data);
  };

  if (uploadMutation.isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
      </div>
    );
  }

  return (
    <>
      <Head title="Admission Verification" />

      <ConfirmDialog
        open={toggleStatusDisclosure.isOpen}
        onOpenChange={toggleStatusDisclosure.onClose}
        title={toggleStatusDisclosure.data?.is_enabled ? "Disable" : "Enable"}
        description={`Are you sure you want to ${toggleStatusDisclosure.data?.is_enabled === true
          ? "Disable"
          : "Enable"
          }?`}
        onConfirm={confirmToggleStatus}
        isLoading={toggleStatusMutation.isPending}
        variant={
          toggleStatusDisclosure.data?.is_enabled === true
            ? "info"
            : "warning"
        }
        confirmText={
          toggleStatusDisclosure.data?.is_enabled === true
            ? "Disable"
            : "Enable"
        }
      />
      <AdmissionVerificationDialog
        open={DialogDisclosure.isOpen}
        onClose={DialogDisclosure.onClose}
        data={DialogDisclosure.data}
        selectedId={selectedId}
      />{" "}
      <TooltipProvider>
        <div>
          <HeadingSmall
            id="verification-header"
            guidance={INSTITUTION_ADMISSION_VERIFICATION_GUIDE}
          />
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-700">Admission Verification Status</h4>
                <p className="text-xs text-slate-500">Toggle the admission verification logic for all streams.</p>
              </div>

              <div className="flex items-center gap-6">
                <RadioGroup
                  value={data?.data?.global_enabled ? "yes" : "no"}
                  onValueChange={(value: "yes" | "no") => {
                    const status = value === "yes";
                    toggleGlobalVerificationMutation.mutate(status);
                  }}
                  className="flex gap-6"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <RadioGroupItem
                      value="yes"
                      disabled={toggleGlobalVerificationMutation.isPending}
                      className="border-slate-300 text-primary focus-visible:ring-primary"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Enabled</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <RadioGroupItem
                      value="no"
                      disabled={toggleGlobalVerificationMutation.isPending}
                      className="border-slate-300 text-primary focus-visible:ring-primary"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Disabled</span>
                  </label>
                </RadioGroup>

                <div className="w-px h-8 bg-slate-200" />

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-slate-50 border-slate-200"
                  onClick={() => AdmissionVerificationApi.downloadSampleExcel()}
                >
                  <Download className="mr-2 h-4 w-4 text-slate-500" />
                  Sample Excel
                </Button>
              </div>
            </div>

            <div id="verification-table" className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <DataTable
                columns={ADMISSION_VERIFICATION_COLUMNS}
                currentPage={data?.meta?.current_page || 1}
                lastPage={data?.meta?.last_page || 1}
                totalRecords={data?.meta?.total}
              >
                <Each
                  isLoading={isLoading}
                  of={data?.data?.streams}
                  nodatafound={
                    <TableEmptyState
                      colSpan={ADMISSION_VERIFICATION_COLUMNS.length}
                      message="No streams found"
                      description="No streams recorded for verification settings."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader
                      columns={ADMISSION_VERIFICATION_COLUMNS.length}
                    />
                  }
                  render={(val, index) => (
                    <TableRow key={val?.id} className="hover:bg-slate-50/50 group transition-colors">
                      <TableCell className="w-16 text-slate-400 font-mono text-xs">
                        {getSerialNumber(
                          data?.meta?.current_page || 1,
                          10,
                          index,
                        )}
                      </TableCell>

                      <TableCell className="font-bold text-slate-700">
                        {val?.main_stream_name}
                      </TableCell>

                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          val?.is_enabled 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-slate-50 text-slate-500 border border-slate-100"
                        )}>
                          {val?.is_enabled ? "Enabled" : "Disabled"}
                        </span>
                      </TableCell>

                      <TableCell className="text-slate-500 text-xs">
                        {val?.last_uploaded_at || "—"}
                      </TableCell>

                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          val?.is_database_attached 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        )}>
                          {val?.is_database_attached ? "Attached" : "Missing"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="px-2">
                                <Switch
                                  checked={val?.is_enabled == true}
                                  onCheckedChange={() => handleToggleStatus(val)}
                                  disabled={toggleStatusMutation.isPending}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Toggle Stream Status</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedId(val?.main_stream_id);
                                  DialogDisclosure.onOpen();
                                }}
                                className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                              >
                                <Upload className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Upload Student DB</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => AdmissionVerificationApi.exportStream(val?.main_stream_id)}
                                className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                              >
                                <Download className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Export Records</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};



export default AdmissionVerification;
