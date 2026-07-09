import React, { useMemo } from 'react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { APPLICATIONS_GUIDE } from "@/constants/guides/applications";
import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileSignature, Plus, Eye, FileDown, Edit, FileText, CheckCircle2, Clock, Coins } from "lucide-react";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { FilterBar } from "@/components/filter-bar";
import AdmissionApi, { type ApplicationListParams } from "@/lib/api/admissionApi";
import { ApplicationQueryKeys } from "@/lib/querykey/application";

import Each from "@/components/Each";
import { useInstitutionLabels } from "@/hooks/useInstitutionLabels";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-can";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import { getSerialNumber } from "@/lib/utils";
import {
  ADMISSION_BREADCRUMBS,
  STUDENT_ADMISSION_BREADCRUMBS,
  APPLICATIONS_GUIDELINES,
  APPLICATIONS_TIP,
  STUDENT_APPLICATIONS_GUIDELINES,
  STUDENT_APPLICATIONS_TIP,
} from "@/constants/page/admin/admission";


const APPLICATION_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "application_id", label: "Application ID" },
  { key: "applicant", label: "Applicant" },
  { key: "stream_session", label: "Class / Session" },
  { key: "amount", label: "Amount" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "payment", label: "Payment" },
  { key: "submitted", label: "Submitted" },
  { key: "actions", label: "Actions" },
];

import {
  APPLICATION_FILTER_MAPPING,
  INITIAL_APPLICATION_FILTERS,
} from "@/constants/page/admission/applications";
import { useFilterRegistry } from "@/hooks/useFilterRegistry";

type ApplicationRow = {
  id: number;
  user_id?: number;
  application_id: string;
  applicant_name: string;
  father_name?: string;
  mother_name?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  amount: string | number;
  application_type?: string;
  payment_status?: string;
  process_status?: string;
  submitted_at?: string;
  admission_head?: { stream?: { name: string }; session?: { name: string } };
  lms_class?: { name: string };
  stream?: { name: string };
  session?: { name: string };
  due_amount?: string | number;
  discount_amount?: string | number;
};


const ApplicationsIndex = () => {
  const { can } = useAuth();
  useRegisterGuide(APPLICATIONS_GUIDE);
  const { streamLabel } = useInstitutionLabels();

  const isStudent = can("portal");
  const canCreate = can("create_applications") || can("apply_admission");

  const breadcrumbs = isStudent ? STUDENT_ADMISSION_BREADCRUMBS : ADMISSION_BREADCRUMBS;

  const columns = useMemo(() => {
    if (isStudent) {
      return APPLICATION_COLUMNS.filter((col) => col.key !== "applicant");
    }
    return APPLICATION_COLUMNS;
  }, [isStudent]);

  const { filter, handleFilter, buildParams } = useSearchFilter({
    ...INITIAL_APPLICATION_FILTERS,
  });

  const filterConfig = useFilterRegistry("admission_applications");

  const listParams: ApplicationListParams = useMemo(() => buildParams(APPLICATION_FILTER_MAPPING), [filter, buildParams]);

  const { data, isLoading } = useQuery({
    queryKey: ApplicationQueryKeys.list(listParams as Record<string, unknown>),
    queryFn: () => AdmissionApi.index(listParams),
  });

  const applications = (data as { data?: ApplicationRow[] })?.data ?? [];
  const meta = (data as { meta?: { current_page: number; last_page: number; total: number; per_page?: number } })?.meta;
  const stats = (data as any)?.meta?.stats ?? { total_applications: 0, approved_applications: 0, pending_applications: 0, total_collection: 0 };

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title={isStudent ? "My Applications" : "Application Desk"} />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            breadcrumbs={breadcrumbs}
            icon={FileSignature}
            title={isStudent ? "My Applications" : "Application Desk"}
            subtitle={isStudent ? "Track your admission applications and status." : "Review and process incoming student applications."}
            guidance={isStudent ? STUDENT_APPLICATIONS_GUIDELINES : APPLICATIONS_GUIDELINES}
            tip={isStudent ? STUDENT_APPLICATIONS_TIP : APPLICATIONS_TIP}
          />

          {!isStudent && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Applications</p>
                    <p className="text-2xl font-black text-foreground">{stats.total_applications}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Approved</p>
                    <p className="text-2xl font-black text-foreground">{stats.approved_applications}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Pending</p>
                    <p className="text-2xl font-black text-foreground">{stats.pending_applications}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Clock className="size-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Collection</p>
                    <p className="text-2xl font-black text-foreground">₹{stats.total_collection.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Coins className="size-5" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {canCreate && (
            <div className="flex justify-end">
              <Link href="/admission/applications/new?fresh=true" id="new-application-btn">
                <Button variant="default" size="default" className="w-full sm:w-auto">
                  <Plus className="size-4" />
                  <span>{isStudent ? "New Application" : "New application"}</span>
                </Button>
              </Link>
            </div>
          )}

          <Card id="applications-table">
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={filterConfig} />
              </FilterBar>
            </CardHeader>

            <CardContent className="pt-0">
              <DataTable
                columns={columns}
                currentPage={meta?.current_page ?? 1}
                lastPage={meta?.last_page ?? 1}
                pageSize={Number(filter.per_page) || 15}
                totalRecords={meta?.total ?? 0}
                handlePageChange={(page) => handleFilter({ page })}
                handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
              >
                <Each
                  of={applications}
                  isLoading={isLoading}
                  nodatafound={
                    <TableEmptyState
                      colSpan={columns.length}
                      message={isStudent ? "No applications found" : "No applications yet"}
                      description={
                        isStudent
                          ? "You haven't submitted any admission applications yet."
                          : "Start by creating a new application to onboard a student or process a re-admission."
                      }
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={columns.length} />
                  }
                  keyExtractor={(row: ApplicationRow) => row.id}
                  render={(row: ApplicationRow, index: number) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          meta?.current_page ?? 1,
                          Number(filter.per_page) || 15,
                          index,
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{row.application_id ?? "—"}</TableCell>
                      {!isStudent && (
                        <TableCell>
                          <div>
                            <p className="font-medium">{row.applicant_name ?? "—"}</p>
                            {row.mobile && (
                              <p className="text-xs text-muted-foreground">{row.mobile}</p>
                            )}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="text-sm">
                          {row.admission_head?.stream?.name || row.stream?.name || row.lms_class?.name || "—"}
                          {(row.admission_head?.session?.name || row.session?.name) && (
                            <span className="text-muted-foreground font-mono text-[10px] ml-1">
                              ({row.admission_head?.session?.name || row.session?.name})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <span>₹{Number(row.amount || 0).toLocaleString()}</span>
                          {Number(row.due_amount || 0) > 0 && (
                            <p className="text-[10px] text-destructive font-normal">
                              Due: ₹{Number(row.due_amount).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-[10px] px-1.5 py-0 h-5">
                          {row.application_type || "new"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.process_status === "approved" ? "default" : row.process_status === "rejected" ? "destructive" : "secondary"}>
                          {row.process_status ?? "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.payment_status === "paid" || row.payment_status === "success" ? "default" : "outline"}>
                          {row.payment_status ?? "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.submitted_at
                          ? new Date(row.submitted_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <TooltipWrapper content="View">
                            <Button variant="ghost" size="icon-sm" asChild className="text-muted-foreground hover:text-foreground">
                              <Link href={`/admission/applications/${row.id}`}>
                                <Eye className="size-4" aria-hidden />
                              </Link>
                            </Button>
                          </TooltipWrapper>
                          {(row.process_status === 'draft' || row.process_status === 'pending') && (
                            <TooltipWrapper content="Edit">
                              <Button variant="ghost" size="icon-sm" asChild className="text-muted-foreground hover:text-foreground">
                                <Link href={`/admission/${row.application_type === 're-admission' ? 'readmissions' : 'applications'}/new?edit_id=${row.id}`}>
                                  <Edit className="size-4" aria-hidden />
                                </Link>
                              </Button>
                            </TooltipWrapper>
                          )}
                          <TooltipWrapper content="Download invoice">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-foreground"
                              asChild
                            >
                              <a
                                href={`/api/v1/applications/${row.id}/invoice`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                <FileDown className="size-4" aria-hidden />
                              </a>
                            </Button>
                          </TooltipWrapper>
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

export default ApplicationsIndex;
