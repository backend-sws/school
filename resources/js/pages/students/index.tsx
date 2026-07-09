import { Head, usePage } from "@inertiajs/react";
import React, { useMemo, useState } from 'react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { STUDENT_ANALYTICS_GUIDE } from "@/constants/guides/analytics";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import { Users, UserCheck, UserX, UserMinus, PieChart } from "lucide-react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { useQuery } from "@tanstack/react-query";
import StudentApi from "@/lib/api/studentApi";
import Each from "@/components/Each";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { StudentQueryKeys } from "@/lib/querykey/student";
import { STUDENT_ANALYTICS_BREADCRUMBS } from "@/constants/page/admin/student";
import { getStudentAnalyticsDisplayConfig } from "@/constants/scopeTypeDisplay";
import { ErrorState } from "@/components/shared/StateComponents";
import { FilterBar } from "@/components/filter-bar";
import { generateYearRange } from "@/lib/utils";

const StudentAnalytics = () => {
  const { props } = usePage();
useRegisterGuide(STUDENT_ANALYTICS_GUIDE);

  const scopeType = (props as { institution?: { type?: string } }).institution?.type ?? null;
  const analyticsConfig = getStudentAnalyticsDisplayConfig(scopeType);
  const analyticsColumns = useMemo(
    () => [
      { key: "serial", label: "#" },
      { key: "main_stream", label: analyticsConfig.columnMainStream },
      { key: "stream", label: analyticsConfig.columnStreamCourse },
      { key: "total_students", label: "Total Student(s)" },
      { key: "unverified_students", label: "Un-Verified" },
      { key: "disabled_students", label: "Disabled*" },
    ],
    [analyticsConfig.columnMainStream, analyticsConfig.columnStreamCourse],
  );
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [page, setPage] = useState(1);

  // Generate year options for FilterBar
  const yearOptions = generateYearRange(5).map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: StudentQueryKeys.analytics(selectedYear, page),
    queryFn: () => StudentApi.getSummary({ year: selectedYear, page, per_page: 8 }),
  });

  const summary = data?.data?.summary ?? {};
  const streamTable = data?.data?.stream_table ?? [];

  const stats = [
    {
      title: "Total Students",
      value: summary.total_students?.toLocaleString() ?? "0",
      description: "Active enrollments",
      icon: <Users />,
    },
    {
      title: "Verified Accounts",
      value: summary.verified_accounts?.toLocaleString() ?? "0",
      description: "Email verified",
      icon: <UserCheck />,
    },
    {
      title: "Unverified Accounts",
      value: summary.unverified_accounts?.toLocaleString() ?? "0",
      description: "Pending verification",
      icon: <UserX />,
    },
    {
      title: "Disabled Accounts",
      value: summary.disabled_accounts?.toLocaleString() ?? "0",
      description: "Inactive accounts",
      icon: <UserMinus />,
    },
  ];

  return (
    <>
      <Head title="Student Analytics" />

      <PageContainer maxWidth="full">
        <div className="space-y-6">
          <MainPageHeader
            id="student-analytics-header"
            breadcrumbs={STUDENT_ANALYTICS_BREADCRUMBS}
            icon={Users}
            title="Student Analytics"
            subtitle="Monitor enrollment trends, verification status, and demographic insights."
          />
        <div className="flex justify-end">
          <FilterBar
            values={{ year: selectedYear.toString() }}
            onChange={(updates) => setSelectedYear(Number(updates.year))}
          >
            <FilterBar.Renderer config={{ filters: [{ name: "year", type: "select", label: "Year", placeholder: "Select Year", options: yearOptions, disabled: isLoading }] }} />
          </FilterBar>
        </div>
        {/* Content */}
        {(
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" id="student-stats-charts">
              <Each
                of={stats}
                render={(stat, index) => (
                  <StatCard {...stat} delay={index * 0.05} />
                )}
              />
            </div>

            {/* Stream-wise Statistics Table */}
            <Card id="student-table-card" animated delay={0.2}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-muted-foreground" />
                  <CardTitle className="text-lg">
                    Student Statistics by {analyticsConfig.tableTitleSuffix} ({selectedYear})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTable
                  columns={analyticsColumns}
                  isPaginated={true}
                  currentPage={data?.data?.pagination?.current_page}
                  lastPage={data?.data?.pagination?.last_page}
                  totalRecords={data?.data?.pagination?.total}
                  pageSize={data?.data?.pagination?.per_page}
                  handlePageChange={setPage}
                  maxHeight="calc(100vh - 500px)"
                >

                  <Each
                    of={streamTable}
                    isLoading={isLoading}
                    fallback={<TableSkeletonLoader columns={analyticsColumns.length} rows={5} />}
                    nodatafound={
                      <TableEmptyState
                        colSpan={analyticsColumns.length}
                        message="No stream data available"
                        description={`No student enrollment data found for the year ${selectedYear}`}
                      />
                    }
                    render={(val: any, index: number) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {val?.main_stream || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {val?.stream || "-"}
                        </TableCell>
                        <TableCell>
                          {val.total_students === 0 ? (
                            <span className="text-muted-foreground text-sm">No students yet</span>
                          ) : (
                            <span className="font-medium">{val.total_students} student(s)</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "font-medium",
                              val.unverified_students > 0
                                ? "text-orange-600"
                                : "text-muted-foreground"
                            )}
                          >
                            {val.unverified_students}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "font-medium",
                              val.disabled_students > 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                            )}
                          >
                            {val.disabled_students}
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  />
                </DataTable>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
    </>
  );
};

export default StudentAnalytics;
