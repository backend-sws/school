import React from "react";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Head, Link } from "@inertiajs/react";
import {
  Eye,
  Calendar,
  Pencil,
  Plus,
  ToggleLeftIcon,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { MainStreamTable } from "@/constants/page/admin/mainStream";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import SessionApi from "@/lib/api/sessionApi";
import {
  INITIAL_SESSION_FILTERS,
  SESSION_BREADCRUMBS,
  SessionTable,
  SESSION_TOOLTIPS,
  YEAR_FILTER_OPTIONS,
  SESSION_GUIDELINES,
  SESSION_TIP,
} from "@/constants/page/admin/session";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SessionDialog } from "@/components/admin/sessionDialog";
import { Switch } from "@/components/ui/switch";
import { FilterBar } from "@/components/filter-bar";
import { useRegisterGuide } from '@/components/GuideProvider';
import { SESSIONS_GUIDE } from "@/constants/guides/academic";
import academicCalendarApi from "@/lib/api/academicCalendarApi";
import { useAuth } from "@/hooks/use-can";
import { AcademicCalendarQueryKeys } from "@/lib/querykey/academicCalendar";

const Sessions = () => {
  const sessionDisclosure = useDisclosure();
const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_SESSION_FILTERS,
  });
  const queryClient = useQueryClient();
  useRegisterGuide(SESSIONS_GUIDE);
  const { can } = useAuth();
  const canViewCalendarSettings = can("view_academic_calendar_settings");

  const { data: calendarRes } = useQuery({
    queryKey: AcademicCalendarQueryKeys.settings(1),
    queryFn: () => academicCalendarApi.getSettings({ duration_years: 1 }),
    enabled: canViewCalendarSettings,
  });

  const calendarSettings =
    (calendarRes as { data?: { start_month_label?: string } })?.data ?? calendarRes?.data;

  const { data, isLoading } = useQuery({
    queryKey: ["sessions", filter],
    queryFn: () => SessionApi.getSessions(filter),
  });

  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };
  const handleEdit = (row: any) => sessionDisclosure.onOpen(row);
  const deleteDisclosure = useDisclosure();
  const deleteSessionMutation = useMutation({
    mutationFn: (id: number | string) => SessionApi.deleteStream(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deleteSessionMutation.mutate(deleteDisclosure.data?.id);
  };
  return (
    <>
      <Head title="Session" />{" "}
      <SessionDialog
        open={sessionDisclosure.isOpen}
        onClose={sessionDisclosure.onClose}
        data={sessionDisclosure.data}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Stream"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteSessionMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <PageContainer maxWidth="full">
          <div className="space-y-6">
            <MainPageHeader
              id="sessions-header"
              breadcrumbs={SESSION_BREADCRUMBS}
              icon={Calendar}
              title="Academic Sessions"
              subtitle="Configure time-based enrollment cycles and academic year durations"
              guidance={SESSION_GUIDELINES}
              tip={SESSION_TIP}
            />

            {canViewCalendarSettings && calendarSettings?.start_month_label && (
              <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                Academic year starts in{" "}
                <span className="font-medium text-foreground">
                  {calendarSettings.start_month_label}
                </span>
                .{" "}
                <Link
                  href="/settings/academic-calendar"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Change in Settings → Academic Calendar
                </Link>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                id="initialize-session-btn"
                onClick={() => sessionDisclosure.onOpen()}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                <span>Initialize Academic Session</span>
              </Button>
            </div>

          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.SmartSelect
                  name="search"
                  options={YEAR_FILTER_OPTIONS}
                  placeholder="Search by name or year..."
                  tooltip="You can type a name or select/type a year"
                />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0" id="sessions-table">
              {/* Data Table */}
              <DataTable
                columns={SessionTable}
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
                  of={data?.data}
                  isLoading={isLoading}
                  nodatafound={
                    <TableEmptyState
                      colSpan={SessionTable.length}
                      message="No Sessions found"
                      description="There are no sessions to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={SessionTable.length} />
                  }
                  render={(val, index) => (
                    <TableRow key={val?.id} className="hover:bg-muted/50">
                      {/* Serial Number */}
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          data?.meta?.current_page || 1,
                          filter.perPage || 10,
                          index,
                        )}
                      </TableCell>

                      {/* Title */}
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">{val?.name}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {val?.start_year}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {val?.end_year}
                      </TableCell>
                      <TableCell className="text-muted-foreground italic">
                        {val?.duration} years
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={val?.status === 0 ? "Not active" : "Active"}
                        />
                      </TableCell>

                      <TableCell className="w-1/6">
                        <div className="flex  items-center gap-0.5">
                          <Tooltip>
                            <TooltipTrigger>
                              {" "}
                              <Switch
                                checked={val?.status === 1}
                              // onCheckedChange={() =>
                              //   handleToggleStatus(val)
                              // }
                              // disabled={toggleStatusMutation.isPending}
                              />
                            </TooltipTrigger>{" "}
                            <TooltipContent>Status Toggle</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleEdit(val)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View / Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleEdit(val)}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-40"
                              >
                                <Pencil className="size-4" />
                              </Button>
                            </TooltipTrigger>{" "}
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleDelete(val)}
                                disabled={deleteSessionMutation.isPending}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
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
      </PageContainer>
    </TooltipProvider>
    </>
  );
};

export default Sessions;
