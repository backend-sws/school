import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import useSearchFilter from "@/hooks/useSearchfilter";
import { hostelApi, type HostelComplaint } from "@/lib/api/hostelApi";
import { ComplaintDialog, type ComplaintDialogData } from "@/components/admin/complaintDialog";
import { PermissionGate } from "@/components/PermissionGate";
import { HOSTEL_BREADCRUMBS } from "@/constants/page/admin/hostel";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import React, { useState } from 'react';
import { Download, Loader2, MessageSquare, AlertCircle, Clock, CheckCircle2, Building } from "lucide-react";
import { FORM_TYPE } from "@/constants";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "subject", label: "Subject" },
  { key: "user", label: "User / Room" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", status: "all", hostel_id: "all" };

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-red-500/10 text-red-500 border-red-200";
    case "in_progress": return "bg-amber-500/10 text-amber-500 border-amber-200";
    case "resolved": return "bg-emerald-500/10 text-emerald-500 border-emerald-200";
    case "closed": return "bg-slate-500/10 text-slate-500 border-slate-200";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const HostelComplaintsIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<ComplaintDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["hostel-complaints", filter],
    queryFn: () => hostelApi.complaints.index({
      page: filter.page,
      per_page: filter.per_page,
      search: filter.search || undefined,
      status: filter.status === "all" ? undefined : filter.status,
      hostel_id: filter.hostel_id === "all" ? undefined : filter.hostel_id,
    }),
  });

  const { data: hostelsResponse } = useQuery({
    queryKey: ["hostel-hostels-options"],
    queryFn: () => hostelApi.hostels.index({ per_page: 100 }),
  });
  const hostelOptions = [
    { key: "all", text: "All Hostels", value: "all" },
    ...(hostelsResponse?.data || []).map((h: any) => ({
      key: String(h.id),
      text: h.name,
      value: String(h.id),
    })),
  ];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hostelApi.complaints.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostel-complaints"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filter.search) params.append("search", filter.search);
      if (filter.hostel_id && filter.hostel_id !== "all") params.append("hostel_id", String(filter.hostel_id));
      if (filter.status && filter.status !== "all") params.append("status", String(filter.status));

      const downloadUrl = `/api/v1/hostel/complaints/export?${params.toString()}`;
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const rows = (data?.data ?? []) as HostelComplaint[];
  const stats = (data as any)?.meta?.stats ?? { total_complaints: 0, open_complaints: 0, in_progress_complaints: 0, resolved_complaints: 0 };

  return (
    <>
      <Head title="Hostel Complaints" />
      <ComplaintDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Complaint"
        description={`Are you sure you want to delete this complaint? This action cannot be undone.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            icon={MessageSquare}
            title="Complaints Management"
            subtitle="Track and manage hostel maintenance and service issues."
            breadcrumbs={[...HOSTEL_BREADCRUMBS, { title: "Complaints", href: "/hostel/complaints" }]}
          />

          {/* Analytics stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Complaints</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_complaints}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <MessageSquare className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Pending/Open</p>
                  <p className="text-2xl font-black text-foreground">{stats.open_complaints}</p>
                </div>
                <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <AlertCircle className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">In Progress</p>
                  <p className="text-2xl font-black text-foreground">{stats.in_progress_complaints}</p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Clock className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Resolved</p>
                  <p className="text-2xl font-black text-foreground">{stats.resolved_complaints}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Download className="size-4 mr-2" />
              )}
              <span>Export Excel</span>
            </Button>
            <PermissionGate can="create_hostels">
              <Button
                onClick={() => dialogDisclosure.onOpen(null)}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4 mr-2" />
                <span>Log Complaint</span>
              </Button>
            </PermissionGate>
          </div>

          <div className="l-blur-fade l-blur-fade-delay-1">
            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={{
                    filters: [
                      {
                        name: "hostel_id",
                        type: FORM_TYPE.SELECT,
                        label: "Hostel",
                        placeholder: "Select hostel",
                        options: hostelOptions
                      },
                      {
                        name: "status",
                        type: FORM_TYPE.SELECT,
                        label: "Status",
                        placeholder: "Select status",
                        options: [
                          { key: "all", text: "All Statuses", value: "all" },
                          { key: "open", text: "Open", value: "open" },
                          { key: "in_progress", text: "In Progress", value: "in_progress" },
                          { key: "resolved", text: "Resolved", value: "resolved" },
                          { key: "closed", text: "Closed", value: "closed" },
                        ]
                      }
                    ],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "subject", label: "Subject" },
                      ],
                      placeholder: "Search complaints...",
                    },
                  }} />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTable
                  columns={COLUMNS}
                  currentPage={data?.meta?.current_page ?? 1}
                  lastPage={data?.meta?.last_page ?? 1}
                  pageSize={filter.per_page ?? 15}
                  totalRecords={data?.meta?.total ?? 0}
                  handlePageChange={(page) => handleFilter({ page })}
                  handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
                >
                  <Each
                    of={rows}
                    isLoading={isLoading}
                    nodatafound={
                      <TableEmptyState
                        colSpan={COLUMNS.length}
                        message="No complaints found"
                        description="There are currently no complaints matching your filters."
                      />
                    }
                    fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                    keyExtractor={(row) => row.id}
                    render={(row, index) => (
                      <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="w-16 text-muted-foreground font-mono text-xs">
                          {getSerialNumber(data?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground tracking-tight">{row.subject}</span>
                            {row.description && <span className="text-xs text-muted-foreground truncate max-w-[250px]">{row.description}</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground tracking-tight">{row.user?.name ?? 'Unknown'}</span>
                            {row.user?.student_profile && (
                              <span className="text-xs text-muted-foreground font-medium">
                                {[
                                  row.user.student_profile.stream?.name,
                                  row.user.student_profile.reg_no ? `Reg: ${row.user.student_profile.reg_no}` : null
                                ].filter(Boolean).join(" | ")}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">Room {row.room?.room_number ?? 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                          {format(new Date(row.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize ${getStatusColor(row.status)}`}>
                            {row.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-1/6">
                          <div className="flex items-center gap-0.5">
                            <PermissionGate can="update_hostels">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    onClick={() => dialogDisclosure.onOpen(row)}
                                    className="hover:text-primary hover:bg-primary/5"
                                  >
                                    <Pencil className="size-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Update Status</TooltipContent>
                              </Tooltip>
                            </PermissionGate>
                            <PermissionGate can="delete_hostels">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="text-destructive/60 hover:text-destructive hover:bg-destructive/5"
                                    onClick={() => deleteDisclosure.onOpen({ id: row.id, name: row.subject })}
                                    disabled={deleteMutation.isPending}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </PermissionGate>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  />
                </DataTable>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default HostelComplaintsIndex;
