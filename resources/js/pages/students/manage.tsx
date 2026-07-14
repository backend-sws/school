import React, { useMemo } from 'react';
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pencil, Eye, Users, UserPlus, Copy, Mail, Download, UserCheck, ShieldAlert, CheckCircle2, Receipt } from "lucide-react";
import { useNavigation } from "@/hooks/use-navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { getSerialNumber, copyToClipboard } from "@/lib/utils";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import { PermissionGate } from "@/components/PermissionGate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStudentListDisplayConfig } from "@/constants/scopeTypeDisplay";
import useSearchFilter from "@/hooks/useSearchfilter";
import StudentApi from "@/lib/api/studentApi";
import Each from "@/components/Each";
import {
  STUDENT_FILTER_MAPPING,
  INITIAL_STUDENT_FILTERS,
  STUDENT_LIST_BREADCRUMBS,
} from "@/constants/page/admin/student";
import { useFilterRegistry } from "@/hooks/useFilterRegistry";
import { STUDENTS_GUIDE, STUDENT_LIST_GUIDE } from "@/constants/guides/students";
import { StudentQueryKeys } from "@/lib/querykey/student";
import { useRegisterGuide } from '@/components/GuideProvider';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ManageStudent = () => {
  const { getMetadata } = useNavigation();
  const { props } = usePage();
  useRegisterGuide(STUDENT_LIST_GUIDE);

  const scopeType = (props as { institution?: { type?: string } }).institution?.type ?? null;
  const listConfig = getStudentListDisplayConfig(scopeType);
  const metadata = getMetadata("/students/manage");
  const queryClient = useQueryClient();

  // ─── Mutations ───────────────────────────────────────────────────────────
  const resendVerificationMutation = useMutation({
    mutationFn: (userId: number | string) =>
      StudentApi.resendVerificationEmail(userId),
    onSuccess: () => {
      toast.success("Verification link sent to the student's email.");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to send verification link."
      );
    },
  });

  const copyLinkMutation = useMutation({
    mutationFn: (userId: number | string) =>
      StudentApi.getVerificationLink(userId) as Promise<any>,
    onSuccess: (res: any) => {
      // Handle both raw axios response and intercepted data
      const url = res?.data?.url || res?.url || (typeof res === 'string' ? res : null);
      
      if (!url) {
        console.error("Link response:", res);
        toast.error("Failed to extract verification link from response.");
        return;
      }

      copyToClipboard(url).then((success: boolean) => {
        if (success) {
          toast.success("Verification link copied to clipboard.");
        } else {
          toast.error("Failed to copy link. Please copy it manually.");
        }
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to get verification link.");
    },
  });

  const studentColumns = useMemo(
    () => [
      { key: "serial", label: "#" },
      { key: "reg_no", label: "Reg. No" },
      { key: "roll_no", label: "Roll No" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "mobile", label: "Mobile" },
      { key: "stream", label: listConfig.columnStreamSession },
      { key: "verification", label: "Verification" },
      { key: "status", label: "Status" },
      { key: "action", label: "Actions" },
    ],
    [listConfig.columnStreamSession],
  );
  const { filter, buildParams, handleFilter } = useSearchFilter({
    ...INITIAL_STUDENT_FILTERS,
  });

  const filterConfig = useFilterRegistry("student_management");

  const { data, isLoading } = useQuery({
    queryKey: StudentQueryKeys.list(filter),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    queryFn: () => {
      const params = buildParams(STUDENT_FILTER_MAPPING, { searchTypeKey: "searchType", searchValueKey: "search" });
      if (params.search_by && params.search_text) {
        params[params.search_by] = params.search_text;
        delete params.search_by;
        delete params.search_text;
      } else if (params.search) {
        params[filter.searchType || "email"] = params.search;
        delete params.search;
      }
      return StudentApi.getStudentList(params);
    },
  });

  const stats = (data as any)?.meta?.stats ?? { total_students: 0, active_students: 0, verified_students: 0, unverified_students: 0 };

  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const handleExport = async () => {
    try {
      const params = buildParams(STUDENT_FILTER_MAPPING, { searchTypeKey: "searchType", searchValueKey: "search" });
      if (params.search_by && params.search_text) {
        params[params.search_by] = params.search_text;
        delete params.search_by;
        delete params.search_text;
      } else if (params.search) {
        params[filter.searchType || "email"] = params.search;
        delete params.search;
      }
      toast.promise(StudentApi.exportStudents(params), {
        loading: "Generating student Excel report...",
        success: "Student list exported successfully!",
        error: "Failed to generate student Excel report.",
      });
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to download students report.");
    }
  };


  return (
    <>
      <Head title="Student Management" />

      <TooltipProvider>
        <div className="space-y-6 w-full max-w-full">
          <MainPageHeader
            id="student-directory-header"
            breadcrumbs={STUDENT_LIST_BREADCRUMBS}
            icon={metadata?.icon ?? Users}
          >
            <Button
              variant="outline"
              onClick={handleExport}
              className="rounded-xl h-11 border-border bg-background shadow-sm hover:bg-muted font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Download className="size-4 text-muted-foreground" />
              <span>Export Excel</span>
            </Button>
          </MainPageHeader>

          {/* Analytics stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Students</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_students}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Users className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Active Students</p>
                  <p className="text-2xl font-black text-foreground">{stats.active_students}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Verified Email</p>
                  <p className="text-2xl font-black text-foreground">{stats.verified_students}</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Unverified</p>
                  <p className="text-2xl font-black text-foreground">{stats.unverified_students}</p>
                </div>
                <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <ShieldAlert className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4" id="student-filters-card">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={filterConfig} />
              </FilterBar>
            </CardHeader>

            <CardContent className="pt-0" id="student-table-container">
              <DataTable
                columns={studentColumns}
                currentPage={data?.meta?.current_page || 1}
                lastPage={data?.meta?.last_page || 1}
                pageSize={filter.perPage}
                totalRecords={data?.meta?.total}
                handlePageChange={(page) => handleFilter({ page })}
                handlePageSizeChange={(size) =>
                  handleFilter({ perPage: size, page: 1 })
                }
              >
                <Each
                  of={data?.data ?? []}
                  isLoading={isLoading}
                  nodatafound={
                    <TableEmptyState
                      colSpan={studentColumns.length}
                      message="No students found"
                      description="There are no students to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={studentColumns.length} />
                  }
                  render={(val, index) => (
                    <TableRow key={val.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          data?.meta?.current_page || 1,
                          filter.perPage || 10,
                          index,
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {val?.student_profile?.reg_no ?? val?.studentProfile?.reg_no ?? val?.reg_no ?? val?.student_profile?.app_no ?? val?.studentProfile?.app_no ?? "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {val?.student_profile?.roll_no ?? val?.studentProfile?.roll_no ?? "-"}
                      </TableCell>
                      <TableCell className="font-medium">{val.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium" title="Primary / contact email (mail is sent here)">
                            {val.primary_email ?? val.contact_email ?? val.email ?? "-"}
                          </span>
                          {val.primary_email && val.email && val.primary_email !== val.email && (
                            <span className="text-xs text-muted-foreground/80" title="Login / system email">
                              {val.email}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {val.mobile}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        <div className="flex flex-col">
                          <span>
                            {(val?.student_profile ?? val?.studentProfile)?.stream?.name ?? "-"}
                          </span>
                          <span className="text-muted-foreground/60">
                            {(val?.student_profile ?? val?.studentProfile)?.session?.name ?? "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={(val.effective_email_verified ?? val.email_verified) ? "verified" : "unverified"}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={val.status ? "active" : "inactive"}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <TooltipWrapper content="View Details">
                            <Link href={`/students/manage/${val.id}`}>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="size-4" />
                              </Button>
                            </Link>
                          </TooltipWrapper>
                          <PermissionGate can="view_fee_particulars">
                            <TooltipWrapper content="View Fee Ledger">
                              <Link href={`/accounts/fee-hub/students?student=${val.id}`}>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Receipt className="size-4" />
                                </Button>
                              </Link>
                            </TooltipWrapper>
                          </PermissionGate>
                          <PermissionGate can="update_users">
                            {!(val.effective_email_verified ?? val.email_verified) && (
                              <>
                                <TooltipWrapper content="Copy Verification Link">
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="text-primary hover:text-primary hover:bg-primary/10"
                                    onClick={() => copyLinkMutation.mutate(val.id)}
                                    disabled={copyLinkMutation.isPending}
                                  >
                                    <Copy className="size-4" />
                                  </Button>
                                </TooltipWrapper>
                                <TooltipWrapper content="Resend Verification">
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="text-primary hover:text-primary hover:bg-primary/10"
                                    onClick={() => resendVerificationMutation.mutate(val.id)}
                                    disabled={resendVerificationMutation.isPending}
                                  >
                                    <Mail className="size-4" />
                                  </Button>
                                </TooltipWrapper>
                              </>
                            )}
                          </PermissionGate>
                          <PermissionGate can="update_users">
                            <TooltipWrapper content="Edit Student">
                              <Link href={`/students/manage/${val.id}/edit`}>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </Link>
                            </TooltipWrapper>
                          </PermissionGate>
                          <PermissionGate can="create_readmissions">
                            <TooltipWrapper content="Re-Admit Student">
                              <Link href={`/admission/readmissions/new/identity?student_id=${(val?.student_profile ?? val?.studentProfile)?.id}&fresh=true`}>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <UserPlus className="size-4" />
                                </Button>
                              </Link>
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

export default ManageStudent;
