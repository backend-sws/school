import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Megaphone, Pencil, Eye, Trash2, Plus } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { cn, getSerialNumber, cleanFilterParams } from "@/lib/utils";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import { NoticeDialog } from "@/components/admin/noticeDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import NoticeApi from "@/lib/api/noticeApi";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { getStudentListDisplayConfig } from "@/constants/scopeTypeDisplay";
import Each from "@/components/Each";
import { NoticeQueryKeys } from "@/lib/querykey/notice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { NOTICE_MANAGEMENT_GUIDELINES } from "@/constants/admin/guidelines";
import { FilterBar, FilterOption } from "@/components/filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  INITIAL_NOTICE_FILTERS,
  NOTICE_BREADCRUMBS,
  NOTICE_COLUMNS,
  TARGET_TYPE_OPTIONS,
  NOTICE_GUIDELINES,
  NOTICE_TIP,
} from "@/constants/page/admin/notice";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRegisterGuide } from '@/components/GuideProvider';
import { NOTICES_GUIDE } from "@/constants/guides/website";
import React from 'react';



const buildParams = (filter: any) => ({
  page: filter.page,
  per_page: filter.perPage,
  target_type: filter.targetType,
  stream: filter.stream,
  session: filter.session,
  search: filter.search,
});

const NoticeManagement = () => {
  useRegisterGuide(NOTICES_GUIDE);

  const { props } = usePage();
  const scopeType = (props as { institution?: { type?: string } }).institution?.type ?? null;
  const listConfig = getStudentListDisplayConfig(scopeType);
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_NOTICE_FILTERS,
  });
  const noticeDisclosure = useDisclosure<any>();
  const deleteDisclosure = useDisclosure<any>();
  const statusDisclosure = useDisclosure<any>();

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: boolean }) =>
      NoticeApi.updateNoticeStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NoticeQueryKeys.all });
      statusDisclosure.onClose();
    },
  });

  const handleToggleStatus = (val: any, status: boolean) => {
    statusDisclosure.onOpen({ ...val, targetStatus: status });
  };

  const confirmToggleStatus = () => {
    if (!statusDisclosure.data) return;
    toggleStatusMutation.mutate({
      id: statusDisclosure.data.id,
      status: statusDisclosure.data.targetStatus,
    });
  };

  const deleteNoticeMutation = useMutation({
    mutationFn: (id: number | string) => NoticeApi.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NoticeQueryKeys.all });
      deleteDisclosure.onClose();
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: NoticeQueryKeys.list(filter),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    queryFn: () => NoticeApi.getNotices(cleanFilterParams(filter)),
  });

  const { data: streamsResponse } = useCollegeStreams({
    params: { all: true },
  });
  const { data: sessionResponse } = useCollegeSessions({
    params: { all: true },
  });
  const streams = streamsResponse?.data || [];
  const sessions = sessionResponse?.data || [];

  // Build options from API data
  const streamOptions: FilterOption[] = streams.map((s: any) => ({
    value: s.id.toString(),
    label: s.name,
  }));

  const sessionOptions: FilterOption[] = sessions.map((s: any) => ({
    value: s.id.toString(),
    label: s.name,
  }));

  const handleOpen = (row?: any, viewMode = false) =>
    noticeDisclosure.onOpen(row ? { ...row, viewMode } : null);

  const handleEdit = (row: any) => handleOpen(row, false);
  const handleView = (row: any) => handleOpen(row, true);

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };

  const confirmDelete = () => {
    deleteNoticeMutation.mutate(deleteDisclosure.data?.id);
  };

  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title="Notice Management" />
      <>
        <NoticeDialog
          open={noticeDisclosure.isOpen}
          onClose={noticeDisclosure.onClose}
          notice={noticeDisclosure.data}
        />

        <ConfirmDialog
          open={deleteDisclosure.isOpen}
          onOpenChange={deleteDisclosure.onClose}
          title="Delete Notice"
          description={`Are you sure you want to delete "${deleteDisclosure.data?.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          isLoading={deleteNoticeMutation.isPending}
          confirmText="Delete"
          variant="danger"
          confirmationKeyword="DELETE"
        />

        <ConfirmDialog
          open={statusDisclosure.isOpen}
          onOpenChange={statusDisclosure.onClose}
          title={
            statusDisclosure.data?.targetStatus
              ? "Publish Notice"
              : "Unpublish Notice"
          }
          description={`Are you sure you want to ${statusDisclosure.data?.targetStatus ? "publish" : "unpublish"
            } "${statusDisclosure.data?.title}"?`}
          onConfirm={confirmToggleStatus}
          isLoading={toggleStatusMutation.isPending}
          confirmText={
            statusDisclosure.data?.targetStatus ? "Publish" : "Unpublish"
          }
          variant={statusDisclosure.data?.targetStatus ? "info" : "warning"}
        />

        <TooltipProvider>
          <PageContainer maxWidth="full">
            <div className="space-y-6">
              <MainPageHeader
                id="notice-management-header"
                breadcrumbs={NOTICE_BREADCRUMBS}
                icon={Megaphone}
                title="Notice Management"
                subtitle="Post and manage announcements, academic alerts, and session updates for student visibility."
                guidance={NOTICE_GUIDELINES}
                tip={NOTICE_TIP}
              />
              <div className="flex justify-end">
                <Button id="new-notice-btn" onClick={() => handleOpen()} className="w-full sm:w-auto">
                  <Plus className="size-4" />
                  <span>Draft Official Notice</span>
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-4">
                  <FilterBar values={filter} onChange={handleFilterChange}>
                    <FilterBar.Renderer config={{
                      filters: [{ name: "target_type", type: "select", label: "Target", placeholder: "Target", options: TARGET_TYPE_OPTIONS }, ...(filter.target_type === "selective" ? [{ name: "stream", type: "select", label: `Select ${listConfig.filterStreamPlaceholder}`, placeholder: `Select ${listConfig.filterStreamPlaceholder}`, options: streamOptions }, { name: "session", type: "select", label: "Session", placeholder: "Session", options: sessionOptions }] : [])],
                      searchGroup: {
                        selectName: "search_by",
                        searchName: "search",
                        options: [
                          { value: "title", label: "Title" },
                          { value: "target", label: "Target" },
                        ],
                        placeholder: "Search notices...",
                      },
                    }} />
                  </FilterBar>
                </CardHeader>

                <CardContent className="pt-0" id="notices-table">
                  {/* Data Table */}
                  <DataTable
                    // isLoading={isLoading}
                    columns={NOTICE_COLUMNS}
                    currentPage={data?.meta?.current_page || 1}
                    lastPage={data?.meta?.last_page || 1}
                    pageSize={filter.per_page}
                    totalRecords={data?.meta?.total}
                    handlePageChange={(page) => handleFilter({ page })}
                    handlePageSizeChange={(size) =>
                      handleFilter({ per_page: size, page: 1 })
                    }
                  // emptyMessage="No notices found"
                  // emptyDescription="Try adjusting your filters or create a new notice to get started."
                  >
                    <Each
                      of={data?.data}
                      nodatafound={
                        <TableEmptyState
                          colSpan={NOTICE_COLUMNS.length}
                          message="No notices found"
                          description="Try adjusting your filters or create a new notice to get started."
                        />
                      }
                      isLoading={isLoading}
                      fallback={
                        <TableSkeletonLoader columns={NOTICE_COLUMNS.length} />
                      }
                      render={(val, index) => (
                        <TableRow className="hover:bg-muted/50">
                          <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                            {getSerialNumber(
                              data?.meta?.current_page || 1,

                              filter.per_page || 10,
                              index,
                            )}
                          </TableCell>

                          {/* Title */}
                          <TableCell className="font-medium max-w-[200px]">
                            <span className="truncate block">{val?.title}</span>
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <StatusBadge status={val?.status} />
                          </TableCell>

                          {/* Target */}
                          <TableCell className="text-muted-foreground">
                            {val?.notice_for || "All Students"}
                          </TableCell>

                          {/* Published Date */}
                          <TableCell className="text-muted-foreground">
                            {val?.published_on || (
                              <span className="italic text-muted-foreground/60">
                                Not Published
                              </span>
                            )}
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
                                <TooltipContent>View / Edit</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    onClick={() => handleEdit(val)}
                                    disabled={
                                      val?.status?.toLowerCase() !== "draft"
                                    }
                                    className="text-muted-foreground hover:text-foreground disabled:opacity-40"
                                  >
                                    <Pencil className="size-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {val?.status?.toLowerCase() !== "draft"
                                    ? "Cannot edit published"
                                    : "Edit Notice"}
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(val)}
                                    disabled={
                                      deleteNoticeMutation.isPending ||
                                      val?.status?.toLowerCase() !== "draft"
                                    }
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {val?.status?.toLowerCase() !== "draft"
                                    ? "Cannot delete published"
                                    : "Delete Notice"}
                                </TooltipContent>
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
    </>
  );
};

export default NoticeManagement;
