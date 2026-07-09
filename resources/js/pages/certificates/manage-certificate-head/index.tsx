import { Head, usePage } from "@inertiajs/react";

import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useRegisterGuide } from '@/components/GuideProvider';
import { CERTIFICATE_HEADS_GUIDE } from "@/constants/guides/misc";
;
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Award, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDisclosure } from "@/hooks/useDisclosure";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import CertificationHeadApi from "@/lib/api/certificateHeadApi";
import {
  CERTIFICATE_HEAD_BREADCRUMBS,
  CERTIFICATEHEAD_COLUMNS,
  INITIAL_CERTIFICATEHEAD_FILTERS,
  CERTIFICATE_HEAD_GUIDELINES,
  CERTIFICATE_HEAD_TIP,
} from "@/constants/page/admin/certificateHead";
import { CertificateHeadQueryKeys } from "@/lib/querykey/certificateHead";
import { CertificateHeadDialog } from "@/components/admin/certificateHeadDialog";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import { useSessions } from "@/hooks/useFeeHooks";
import { TooltipWrapper } from "@/components/shared";
import { Switch } from "@/components/ui/switch";
import { getInstitutionLabels, getCertificateHeadsDisplayConfig } from "@/constants/scopeTypeDisplay";
export const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
export const categoryOptions = [
  { label: "General", value: "general" },
  { label: "EWS", value: "ews" },
  { label: "SC", value: "sc" },
  { label: "ST", value: "st" },
  { label: "BC-1", value: "bc1" },

  { label: "BC-2", value: "bc2" },
];

const ManageCertificateHead = () => {
useRegisterGuide(CERTIFICATE_HEADS_GUIDE);
  const { props } = usePage();
  const scopeType = (props as { institution?: { type?: string } }).institution?.type ?? null;
  const certConfig = getCertificateHeadsDisplayConfig(scopeType);
  const labels = getInstitutionLabels(scopeType);
  const ManageDisclosure = useDisclosure<any>();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_CERTIFICATEHEAD_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: CertificateHeadQueryKeys.list(filter),
    queryFn: () => CertificationHeadApi.getCertificationHead(filter),
  });
  const { data: mainStreamsResponse, isLoading: mainStreamLoading } =
    useCollegeMainStreams({ enabled: true });
  const mainStreams = mainStreamsResponse?.data || [];

  const { data: streamsResponse, isLoading: streamLoading } =
    useCollegeStreams();
  const streams = streamsResponse?.data || [];

  const toggleStatusDisclosure = useDisclosure<any>();

  const handleToggleStatus = (row: any) => {
    toggleStatusDisclosure.onOpen(row);
  };
  const streamOptions = [
    { value: null, label: certConfig.filterStreamOptionAll },
    ...streams.map((s: any) => ({ value: s.id.toString(), label: s.name })),
  ];
  const mainStreamOptions = [
    { value: null, label: certConfig.filterMainStreamOptionAll },
    ...mainStreams.map((s: any) => ({ value: s.id.toString(), label: s.name })),
  ];

  const queryClient = useQueryClient();

  const deleteDisclosure = useDisclosure();
  const deleteCertificateMutation = useMutation({
    mutationFn: (id: number | string) =>
      CertificationHeadApi.deleteCertificationHead(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CertificateHeadQueryKeys.all });
      deleteDisclosure.onClose();
    },
  });

  const confirmDelete = () => {
    deleteCertificateMutation.mutate(deleteDisclosure?.data?.id);
  };

  const handleEdit = (row: any) => ManageDisclosure.onOpen(row);
  const handleView = (row: any) =>
    ManageDisclosure.onOpen({ ...row, viewMode: true });
  const handleDelete = (row: any) => deleteDisclosure.onOpen(row);

  return (
    <>
      <Head title="Student Management" />
      <CertificateHeadDialog
        open={ManageDisclosure.isOpen}
        onClose={ManageDisclosure.onClose}
        data={ManageDisclosure.data}
      />

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Stream"
        description={`Are you sure you want to delete "${deleteDisclosure?.data?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteCertificateMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="certificate-heads-header"
            breadcrumbs={CERTIFICATE_HEAD_BREADCRUMBS}
            icon={Award}
            title="Manage Certificate Heads"
            subtitle="Create and manage certificate types offered to students (e.g., bonafide, transfer, migration)."
            guidance={CERTIFICATE_HEAD_GUIDELINES}
            tip={CERTIFICATE_HEAD_TIP}
          />
          <div className="flex justify-end">
            <Button
              id="new-certificate-head-btn"
              onClick={() => ManageDisclosure.onOpen()}
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              <span>New Certificate Head</span>
            </Button>
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilter}>
                <FilterBar.Renderer config={{ search: { name: "search", placeholder: "Search" }, filters: [{ name: "main_stream_id", type: "select", label: labels.mainStreamLabel, placeholder: labels.mainStreamLabel, options: mainStreamOptions }, { name: "stream_id", type: "select", label: labels.streamSlashCourse, placeholder: labels.streamSlashCourse, options: streamOptions }, { name: "status", type: "select", label: "Status", placeholder: "Status", options: [{ label: "Only Active", value: "1" }, { label: "Only Inactive", value: "0" }] }] }} />
              </FilterBar>
            </CardHeader>

            <CardContent className="pt-0">
              <DataTable
                columns={CERTIFICATEHEAD_COLUMNS}
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
                      colSpan={CERTIFICATEHEAD_COLUMNS.length}
                      message="No Certificate Head found"
                      description="There are no Certificate heads to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader
                      columns={CERTIFICATEHEAD_COLUMNS.length}
                    />
                  }
                  render={(val, index) => (
                    <TableRow key={val.id} className="hover:bg-muted/50">
                      {/* Serial */}
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          data?.meta?.current_page || 1,
                          filter.per_page || 10,
                          index,
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {val?.title}
                      </TableCell>
                      <TableCell>{val?.main_stream?.name}</TableCell>{" "}
                      <TableCell>{val?.stream?.name}</TableCell>
                      <TableCell>₹{val?.fee_amount}</TableCell>{" "}
                      <TableCell>{val?.processing_days}</TableCell>{" "}
                      <TableCell>{val?.payment_processor}</TableCell>{" "}
                      <TableCell>
                        {val?.web_certificate_required ? "YES" : "NO"}
                      </TableCell>
                      <TableCell>
                        {val?.status ? "Active" : "Inactive"}
                      </TableCell>{" "}
                      <TableCell>
                        {" "}
                        {new Date(val?.created_at).toLocaleDateString()}
                      </TableCell>
                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-0.5">
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
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
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

export default ManageCertificateHead;
