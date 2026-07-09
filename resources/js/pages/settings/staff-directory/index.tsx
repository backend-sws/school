
import HeadingSmall from "@/components/heading-small";
import { Head } from "@inertiajs/react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import useSearchFilter from "@/hooks/useSearchfilter";
import StaffApi from "@/lib/api/staffApi";
import {
  INITIAL_STAFF_FILTERS,
  STAFF_COLUMNS,
  STAFF_FILTER_MAPPING,
  STAFF_STATUS_OPTIONS,
  STAFF_CATEGORY_FILTER_OPTIONS,
  STAFF_TOOLTIPS,
} from "@/constants/page/admin/staffDirectory";
import { useDepartments } from "@/hooks/useDepartments";
import { useCollegeSubject } from "@/hooks/useSubjects";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Plus, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { useState } from 'react';
import { PermissionGate } from "@/components/PermissionGate";
import { useRegisterGuide } from '@/components/GuideProvider';
import { STAFF_DIRECTORY_GUIDE } from "@/constants/guides/settings";
import React from 'react';

const STAFF_QUERY_KEY = ["staff", "staff-directory"] as const;

function staffListQueryKey(filter: Record<string, unknown>) {
  return [...STAFF_QUERY_KEY, filter] as const;
}

/** Response shape from GET /api/v1/staff (StaffController index) */
interface StaffListResponse {
  data?: Array<Record<string, unknown>>;
  meta?: { current_page?: number; last_page?: number; per_page?: number; total?: number };
}

const CATEGORY_LABELS: Record<number, string> = {
  232: "Teaching",
  233: "Non-teaching",
};

const StaffDirectoryIndex = () => {
  useRegisterGuide(STAFF_DIRECTORY_GUIDE);
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const { filter, buildParams, handleFilter } = useSearchFilter({
    ...INITIAL_STAFF_FILTERS,
  });

  const { departments = [] } = useDepartments({ per_page: 200 });
  const { subjects = [] } = useCollegeSubject({ params: { all: true }, enabled: true });
  const departmentOptions = [
    { value: "all", label: "All Departments" },
    ...departments.map((d: { key: number; text: string; value: number }) => ({
      value: String(d.value),
      label: d.text,
    })),
  ];
  const subjectOptions = [
    { value: "all", label: "All Subjects" },
    ...subjects.map((s: { key: string; text: string; value: string }) => ({
      value: s.value,
      label: s.text,
    })),
  ];

  const { data, isLoading } = useQuery({
    queryKey: staffListQueryKey(filter),
    staleTime: 1000 * 60,
    queryFn: () =>
      StaffApi.listStaff(buildParams(STAFF_FILTER_MAPPING)) as Promise<StaffListResponse>,
  });

  const response = (data as StaffListResponse) ?? {};
  const list = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta ?? {};
  const currentPage = meta.current_page ?? 1;
  const lastPage = Math.max(1, meta.last_page ?? 1);
  const totalRecords = meta.total ?? 0;

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      StaffApi.updateStaff(String(id), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => StaffApi.deleteStaff(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
      setDeleteTarget(null);
      toast.success("Staff deleted");
    },
    onError: () => toast.error("Failed to delete staff"),
  });

  const resendMutation = useMutation({
    mutationFn: (id: number) => StaffApi.resendInvitation(String(id)),
    onSuccess: () => {
      toast.success("Invitation link sent successfully");
    },
    onError: () => toast.error("Failed to resend invitation"),
  });

  const handleStatusToggle = (row: Record<string, unknown>) => {
    const id = Number(row.id);
    const current = (row as any).status === 1 || (row as any).is_active;
    statusMutation.mutate({ id, status: current ? 0 : 1 });
  };

  const handleDeleteClick = (row: Record<string, unknown>) => {
    setDeleteTarget({ id: Number(row.id), name: String(row.name ?? "this staff member") });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
  };

  return (
    <>
      <Head title="Staff Directory" />

        <ConfirmDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete staff member"
          description={
            deleteTarget
              ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
              : ""
          }
          onConfirm={handleConfirmDelete}
          isLoading={deleteMutation.isPending}
          confirmText="Delete"
          variant="danger"
          confirmationKeyword="DELETE"
        />
        <TooltipProvider>
          <div className="space-y-6">
            <div className="space-y-4">
              <HeadingSmall
                id="staff-header"
                guidance={STAFF_DIRECTORY_GUIDE}
              />
              <div className="flex justify-end">
                <PermissionGate can="create_users">
                  <Button asChild>
                    <Link id="new-staff-btn" href="/settings/staff-directory/create" className="inline-flex items-center gap-2">
                      <Plus className="size-4" />
                      Create
                    </Link>
                  </Button>
                </PermissionGate>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={{ filters: [{ name: "department", type: "select", label: "Department", placeholder: "Department", tooltip: STAFF_TOOLTIPS.department, options: departmentOptions }, { name: "subject", type: "select", label: "Subject", placeholder: "Subject", tooltip: STAFF_TOOLTIPS.subject, options: subjectOptions }, { name: "category", type: "select", label: "Category", placeholder: "Category", tooltip: STAFF_TOOLTIPS.category, options: STAFF_CATEGORY_FILTER_OPTIONS }, { name: "status", type: "select", label: "Status", placeholder: "Status", tooltip: STAFF_TOOLTIPS.status, options: STAFF_STATUS_OPTIONS }] }} />
                </FilterBar>
              </CardHeader>

              <CardContent className="pt-0" id="staff-table">
                <DataTable
                  columns={STAFF_COLUMNS}
                  currentPage={currentPage}
                  lastPage={lastPage}
                  pageSize={filter.perPage}
                  totalRecords={totalRecords}
                  handlePageChange={(page) => handleFilter({ page })}
                  handlePageSizeChange={(size) =>
                    handleFilter({ perPage: size, page: 1 })
                  }
                >
                  <Each
                    of={list}
                    isLoading={isLoading}
                    nodatafound={
                      <TableEmptyState
                        colSpan={STAFF_COLUMNS.length}
                        message="No staff found"
                        description="There are no staff members to display."
                      />
                    }
                    fallback={
                      <TableSkeletonLoader columns={STAFF_COLUMNS.length} />
                    }
                    render={(row: Record<string, unknown>, index: number) => (
                      <TableRow key={String(row.id)} className="hover:bg-muted/50">
                        <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                          {getSerialNumber(
                            currentPage,
                            filter.perPage ?? 10,
                            index,
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {String(row.name ?? "-")}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {String(row.email ?? "-")}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {(row as any).category != null && CATEGORY_LABELS[(row as any).category]
                            ? CATEGORY_LABELS[(row as any).category]
                            : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {(row as any).roles?.[0]?.name ??
                            (row as any).role ??
                            "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {String((row as any).phone ?? (row as any).mobile ?? "-")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <StatusBadge
                              status={
                                (row as any).status === 1 ||
                                  (row as any).is_active
                                  ? "active"
                                  : "inactive"
                              }
                            />
                            <Switch
                              checked={
                                (row as any).status === 1 ||
                                (row as any).is_active
                              }
                              onCheckedChange={() => handleStatusToggle(row)}
                              disabled={statusMutation.isPending}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <PermissionGate can="update_users">
                              {(row as any).status === 2 && (
                                <TooltipWrapper content="Resend Invitation">
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-primary"
                                    onClick={() => resendMutation.mutate(Number(row.id))}
                                    disabled={resendMutation.isPending}
                                  >
                                    <Mail className="size-4" />
                                  </Button>
                                </TooltipWrapper>
                              )}
                              <TooltipWrapper content="Edit user">
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  asChild
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Link
                                    href={`/settings/staff-directory/${row.id}/edit`}
                                    className="inline-flex"
                                  >
                                    <Eye className="size-4" />
                                  </Link>
                                </Button>
                              </TooltipWrapper>
                            </PermissionGate>
                            <PermissionGate can="delete_users">
                              <TooltipWrapper content="Delete">
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteClick(row)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TooltipWrapper>
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
        </TooltipProvider>
    </>
  );
};



export default StaffDirectoryIndex;
