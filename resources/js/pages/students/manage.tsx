import React, { useMemo } from 'react';
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pencil, Eye, Users, UserPlus, Copy, Mail, Download, UserCheck, ShieldAlert, CheckCircle2, Receipt, GraduationCap } from "lucide-react";
import { StudentClassProfileDrawer } from "@/components/admin/studentClassProfileDrawer";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ManageStudent = () => {
  const { getMetadata } = useNavigation();
  const { props } = usePage();
  useRegisterGuide(STUDENT_LIST_GUIDE);

  const scopeType = (props as { institution?: { type?: string } }).institution?.type ?? null;
  const listConfig = getStudentListDisplayConfig(scopeType);
  const metadata = getMetadata("/students/manage");
  const queryClient = useQueryClient();
  const [studentFor360, setStudentFor360] = React.useState<{ id: number; name: string } | null>(null);

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


  const currentStatus = String(filter.status ?? "all");
  const currentEmailVerified = String(filter.email_verified ?? "all");

  const handleCardClick = (type: "all" | "active" | "verified" | "unverified") => {
    if (type === "all") {
      handleFilter({ status: "all", email_verified: "all", page: 1 });
    } else if (type === "active") {
      const next = currentStatus === "1" ? "all" : "1";
      handleFilter({ status: next, email_verified: "all", page: 1 });
    } else if (type === "verified") {
      const next = currentEmailVerified === "1" ? "all" : "1";
      handleFilter({ email_verified: next, status: "all", page: 1 });
    } else if (type === "unverified") {
      const next = currentEmailVerified === "0" ? "all" : "0";
      handleFilter({ email_verified: next, status: "all", page: 1 });
    }
  };

  const isTotalActive = (currentStatus === "all" || !filter.status) && (currentEmailVerified === "all" || !filter.email_verified);
  const isActiveStudentsActive = currentStatus === "1";
  const isVerifiedActive = currentEmailVerified === "1";
  const isUnverifiedActive = currentEmailVerified === "0";

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
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick("all")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("all"); } }}
              className={`border-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 select-none ${
                isTotalActive
                  ? "ring-2 ring-primary/70 bg-primary/[0.03] dark:bg-primary/[0.06]"
                  : "bg-white dark:bg-card hover:border-primary/40"
              }`}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Students</p>
                    {isTotalActive && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-primary border-primary/30">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-black text-foreground">{isLoading ? "..." : stats.total_students}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Users className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick("active")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("active"); } }}
              className={`border-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 select-none ${
                isActiveStudentsActive
                  ? "ring-2 ring-emerald-500/70 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08]"
                  : "bg-white dark:bg-card hover:border-emerald-500/40"
              }`}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Active Students</p>
                    {isActiveStudentsActive && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-emerald-600 border-emerald-500/30">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-black text-foreground">{isLoading ? "..." : stats.active_students}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick("verified")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("verified"); } }}
              className={`border-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 select-none ${
                isVerifiedActive
                  ? "ring-2 ring-indigo-500/70 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08]"
                  : "bg-white dark:bg-card hover:border-indigo-500/40"
              }`}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Verified Email</p>
                    {isVerifiedActive && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-indigo-600 border-indigo-500/30">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-black text-foreground">{isLoading ? "..." : stats.verified_students}</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick("unverified")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("unverified"); } }}
              className={`border-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 select-none ${
                isUnverifiedActive
                  ? "ring-2 ring-red-500/70 bg-red-500/[0.04] dark:bg-red-500/[0.08]"
                  : "bg-white dark:bg-card hover:border-red-500/40"
              }`}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Unverified</p>
                    {isUnverifiedActive && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-red-600 border-red-500/30">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-black text-foreground">{isLoading ? "..." : stats.unverified_students}</p>
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
                          <TooltipWrapper content="360° Academic & Leave Vault">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => setStudentFor360({ id: val.id, name: val.name })}
                            >
                              <GraduationCap className="size-4" />
                            </Button>
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

      {/* ── Student 360° Profile & Record Vault Drawer ────────────────── */}
      <StudentClassProfileDrawer
        open={!!studentFor360}
        onClose={() => setStudentFor360(null)}
        userId={studentFor360?.id}
        studentName={studentFor360?.name}
      />
    </>
  );
};

export default ManageStudent;
