import { Head } from "@inertiajs/react";

import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import useSearchFilter from "@/hooks/useSearchfilter";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { cleanFilterParams, getSerialNumber } from "@/lib/utils";
import {
  Eye,
  Briefcase,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegisterGuide } from '@/components/GuideProvider';
import { ADMISSION_HEADS_GUIDE } from "@/constants/guides/misc";
;
import { useDisclosure } from "@/hooks/useDisclosure";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ADMISSION_HEAD_BREADCRUMBS,
  INITIAL_MANAGECOURSE_FILTERS,
  MANAGE_ADMISSION_HEAD_GUIDELINES,
  MANAGECOURSE_COLUMNS,
  ADMISSION_HEAD_STATUS,
  ADMISSION_HEAD_STATUS_OPTIONS,
  GENDER_FILTER_OPTIONS,
  CATEGORY_FILTER_OPTIONS,
} from "@/constants/page/admin/admissionHead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdmissionHeadApi from "@/lib/api/admissionHeadApi";
import { AdmissionHeadQueryKeys } from "@/lib/querykey/admissionHead";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { AdmissionHeadDialog } from "@/components/admin/admissionHeadDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import { Chip, ChipGroup, ChipVariant } from "@/components/ui/chip";
import { StatusBadge } from "@/components/ui/status-badge";

const ManageCourseHead = () => {
useRegisterGuide(ADMISSION_HEADS_GUIDE);
  const manageCourseDisclosure = useDisclosure<any>();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_MANAGECOURSE_FILTERS,
  });

  const normalizedFilter = {
    ...filter,
    status: filter.status === "all" ? "" : filter.status,
  };

  const { data, isLoading } = useQuery({
    queryKey: AdmissionHeadQueryKeys.list(normalizedFilter),
    queryFn: () => AdmissionHeadApi.getAdmissionHead(cleanFilterParams(normalizedFilter)),
  });
  const { data: streamsResponse, isLoading: streamLoading } =
    useCollegeStreams();
  const streams = streamsResponse?.data || [];

  const streamOptions = [
    { value: null, label: "All Streams" },
    ...streams.map((s: any) => ({ value: s.id.toString(), label: s.name })),
  ];
  const queryClient = useQueryClient();

  const deleteDisclosure = useDisclosure<any>();
  const statusDisclosure = useDisclosure<{ id: number; currentStatus: number; targetStatus: number; title: string }>();

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) =>
      AdmissionHeadApi.deleteAdmissionHead(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AdmissionHeadQueryKeys.all });
      deleteDisclosure.onClose();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      AdmissionHeadApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AdmissionHeadQueryKeys.all });
      statusDisclosure.onClose();
    },
  });

  const confirmDelete = () => {
    deleteMutation.mutate(deleteDisclosure?.data?.id);
  };

  const confirmStatusChange = () => {
    if (statusDisclosure.data) {
      statusMutation.mutate({
        id: statusDisclosure.data.id,
        status: statusDisclosure.data.targetStatus,
      });
    }
  };

  const handleStatusChange = (row: any, targetStatus: number) => {
    statusDisclosure.onOpen({
      id: row.id,
      currentStatus: Number(row.status),
      targetStatus,
      title: row.title,
    });
  };

  const getStatusChangeInfo = (targetStatus: number) => {
    if (targetStatus === ADMISSION_HEAD_STATUS.PUBLISHED) {
      return {
        title: "Publish Admission Head",
        description: "Once published, this admission head will be visible to students and cannot be reverted to draft. Are you sure you want to publish?",
        variant: "default" as const,
        confirmText: "Publish",
        confirmationKeyword: "PUBLISH",
      };
    }
    if (targetStatus === ADMISSION_HEAD_STATUS.UNPUBLISHED) {
      return {
        title: "Unpublish Admission Head",
        description: "This will temporarily hide the admission head from students. You can republish it later.",
        variant: "danger" as const,
        confirmText: "Unpublish",
        confirmationKeyword: "UNPUBLISH",
      };
    }
    return {
      title: "Change Status",
      description: "Are you sure you want to change the status?",
      variant: "default" as const,
      confirmText: "Confirm",
      confirmationKeyword: undefined,
    };
  };

  const handleEdit = (row: any) => manageCourseDisclosure.onOpen(row);
  const handleView = (row: any) => manageCourseDisclosure.onOpen({ ...row, viewMode: true });
  const handleDelete = (row: any) => deleteDisclosure.onOpen(row);
  const handleUnpublish = (row: any) => handleStatusChange(row, ADMISSION_HEAD_STATUS.UNPUBLISHED);

  return (
    <>
      <Head title="Student Management" />
      <AdmissionHeadDialog
        open={manageCourseDisclosure.isOpen}
        onClose={manageCourseDisclosure.onClose}
        data={manageCourseDisclosure.data}
      />

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Admission Head"
        description={`Are you sure you want to delete "${deleteDisclosure?.data?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />

      {statusDisclosure.data && (
        <ConfirmDialog
          open={statusDisclosure.isOpen}
          onOpenChange={statusDisclosure.onClose}
          title={getStatusChangeInfo(statusDisclosure.data.targetStatus).title}
          description={`${getStatusChangeInfo(statusDisclosure.data.targetStatus).description}\n\nAdmission Head: "${statusDisclosure.data.title}"`}
          onConfirm={confirmStatusChange}
          isLoading={statusMutation.isPending}
          confirmText={getStatusChangeInfo(statusDisclosure.data.targetStatus).confirmText}
          variant={getStatusChangeInfo(statusDisclosure.data.targetStatus).variant}
          confirmationKeyword={getStatusChangeInfo(statusDisclosure.data.targetStatus).confirmationKeyword}
        />
      )}
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="admission-heads-header"
            breadcrumbs={ADMISSION_HEAD_BREADCRUMBS}
            icon={Briefcase}
            title="Admission Heads"
            subtitle="Configure and manage active admission periods for various programs"
            guidance={MANAGE_ADMISSION_HEAD_GUIDELINES}
          />
          <div className="flex justify-end">
            <Button
              id="new-admission-head-btn"
              onClick={() => manageCourseDisclosure.onOpen()}
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              <span>Define Admission Course</span>
            </Button>
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilter}>
                <FilterBar.Renderer config={{ filters: [{ name: "stream_id", type: "select", label: "Stream / Course", placeholder: "Stream / Course", tooltip: "Filter admission heads by stream or course", options: streamOptions }, { name: "category", type: "select", label: "Category", placeholder: "Category", tooltip: "Filter by student category (General, SC, ST, etc.)", options: CATEGORY_FILTER_OPTIONS }, { name: "gender", type: "select", label: "Gender", placeholder: "Gender", tooltip: "Filter by gender eligibility criteria", options: GENDER_FILTER_OPTIONS }, { name: "status", type: "select", label: "Status", placeholder: "Status", tooltip: "Filter by admission head status (Draft, Published, etc.)", options: [{ label: "All Status", value: "all" }, ...ADMISSION_HEAD_STATUS_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value }))] }] }} />
              </FilterBar>
            </CardHeader>

            <CardContent className="pt-0">
              <DataTable
                columns={MANAGECOURSE_COLUMNS}
                currentPage={data?.meta?.current_page || 1}
                lastPage={data?.meta?.last_page || 1}
                pageSize={filter.per_page}
                totalRecords={data?.meta?.total}
                handlePageChange={(page) => handleFilter({ page })}
                handlePageSizeChange={(size) =>
                  handleFilter({ per_page: size, page: 1 })
                }
              >
                <Each
                  isLoading={isLoading}
                  of={data?.data}
                  nodatafound={
                    <TableEmptyState
                      colSpan={MANAGECOURSE_COLUMNS.length}
                      message="No Admission Head found"
                      description="There are no admission heads to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader
                      columns={MANAGECOURSE_COLUMNS.length}
                    />
                  }
                  render={(val, index) => (
                    <TableRow key={val.id} className="hover:bg-muted/30 transition-colors">
                      {/* Serial */}
                      <TableCell className="text-center text-muted-foreground/70 font-medium text-xs tabular-nums">
                        {getSerialNumber(
                          data?.meta?.current_page || 1,
                          filter.per_page || 10,
                          index,
                        )}
                      </TableCell>

                      {/* For - Type */}
                      <TableCell className="whitespace-nowrap">
                        <Chip variant={val?.course_for === "new" ? "indigo" : "amber"}>
                          {val?.course_for === "new" ? "New" : "Re-Adm"}
                        </Chip>
                      </TableCell>

                      {/* Title */}
                      <TableCell className="font-semibold text-foreground whitespace-nowrap">
                        {val?.title}
                      </TableCell>

                      {/* Stream */}
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {val?.stream?.name}
                      </TableCell>

                      {/* Application Fee */}
                      <TableCell className="text-right font-medium tabular-nums whitespace-nowrap">
                        <span className="text-emerald-600">₹{val?.application_fees}</span>
                      </TableCell>

                      {/* Admission Fee */}
                      <TableCell className="text-right font-medium tabular-nums whitespace-nowrap">
                        <span className="text-blue-600">₹{val?.total_admission_fees}</span>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <ChipGroup
                          maxVisible={3}
                          items={val?.category_criteria?.map((c: string) => ({ label: c, variant: "sky" as ChipVariant })) || []}
                        />
                      </TableCell>

                      {/* Board */}
                      <TableCell>
                        <ChipGroup
                          maxVisible={2}
                          items={val?.board_criteria?.map((b: string) => ({ label: b, variant: "emerald" as ChipVariant })) || []}
                        />
                      </TableCell>

                      {/* Gender */}
                      <TableCell>
                        <ChipGroup
                          maxVisible={2}
                          items={val?.gender_criteria?.map((g: string) => ({ label: g, variant: "violet" as ChipVariant })) || []}
                        />
                      </TableCell>

                      {/* Last Date */}
                      <TableCell className="text-muted-foreground whitespace-nowrap tabular-nums">
                        {new Date(val?.last_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>

                      {/* Subjects */}
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {val?.subject ?? <span className="text-muted-foreground/50">—</span>}
                      </TableCell>

                      {/* PG Processor */}
                      <TableCell className="whitespace-nowrap">
                        <span className="text-[10px] font-medium text-muted-foreground/60 uppercase">
                          {val?.payment_gateway}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="whitespace-nowrap">
                        <StatusBadge
                          status={ADMISSION_HEAD_STATUS_OPTIONS.find(opt => String(opt.value) === String(val?.status))?.label || "Unknown"}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center justify-center gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleView(val)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleEdit(val)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>

                          {/* Status Actions */}
                          {(() => {
                            const currentStatus = Number(val?.status);

                            if (currentStatus === ADMISSION_HEAD_STATUS.DRAFT) {
                              return (
                                <>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(val)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="size-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete draft admission head</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div>
                                        <Switch
                                          checked={false}
                                          onCheckedChange={() => handleStatusChange(val, ADMISSION_HEAD_STATUS.PUBLISHED)}
                                          className="data-[state=unchecked]:bg-slate-200"
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Publish and make visible to students</TooltipContent>
                                  </Tooltip>
                                </>
                              );
                            }

                            if (currentStatus === ADMISSION_HEAD_STATUS.PUBLISHED) {
                              return (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => handleUnpublish(val)}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Unpublish and hide from students</TooltipContent>
                                </Tooltip>
                              );
                            }

                            return null;
                          })()}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </DataTable>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </>
  );
};

export default ManageCourseHead;
