import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";

import { Head } from "@inertiajs/react";
import {
  MessageSquare,
  Trash2,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import FeedbackApi from "@/lib/api/feedbackApi";
import {
  FEEDBACK_BREADCRUMBS,
  FEEDBACK_COLUMNS,
  INITIAL_FEEDBACK_FILTERS,
} from "@/constants/page/admin/feedback";
import { Switch } from "@/components/ui/switch";
import { useRegisterGuide } from '@/components/GuideProvider';
import { FEEDBACK_GUIDE } from "@/constants/guides/redressal";
import React from 'react';
import { FilterBar } from "@/components/filter-bar";

export const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Read", value: "true" },
  { label: "Unread", value: "false" },
];

const ManageFeedback = () => {
  const queryClient = useQueryClient();
useRegisterGuide(FEEDBACK_GUIDE);

  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_FEEDBACK_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["Feedback", filter],
    queryFn: () => FeedbackApi.getFeedback(filter),
  });
  const deleteDisclosure = useDisclosure();
  const deleteFeedback = useMutation({
    mutationFn: (id: number | string) =>
      FeedbackApi.deleteFeedback(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Feedback"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deleteFeedback.mutate(deleteDisclosure.data?.id);
  };
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };
  const toggleStatusDisclosure = useDisclosure<any>();
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number | string) =>
      FeedbackApi.toggleFeedback(toggleStatusDisclosure?.data?.id as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Feedback"] });
      toggleStatusDisclosure.onClose();
    },
  });

  const handleToggleStatus = (row: any) => {
    toggleStatusDisclosure.onOpen(row);
  };
  const confirmToggleStatus = () => {
    toggleStatusMutation.mutate(toggleStatusDisclosure.data?.id);
  };

  return (
    <>
      <Head title="Feedback" />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Stream"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.id}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteFeedback.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />{" "}
      <ConfirmDialog
        open={toggleStatusDisclosure.isOpen}
        onOpenChange={toggleStatusDisclosure.onClose}
        title={toggleStatusDisclosure.data?.is_read ? "Unread" : "Read"}
        description={`Are you sure you want to ${toggleStatusDisclosure.data?.is_read === true ? "Unread" : "Read"
          }?`}
        onConfirm={confirmToggleStatus}
        isLoading={toggleStatusMutation.isPending}
        variant={
          toggleStatusDisclosure.data?.status === true ? "info" : "warning"
        }
        confirmText={
          toggleStatusDisclosure.data?.is_read === true ? "UnRead" : "Read"
        }
      />
      <TooltipProvider>
          <div className="space-y-6">
            <MainPageHeader
              id="feedback-header"
              breadcrumbs={FEEDBACK_BREADCRUMBS}
              icon={MessageSquare}
              guidance={FEEDBACK_GUIDE}
            />

            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={{
                    filters: [{ name: "is_read", type: "select", label: "Read/Unread Status", placeholder: "Read/Unread Status", options: STATUS_OPTIONS }],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "name", label: "Name" },
                        { value: "email", label: "Email" },
                      ],
                      placeholder: "Search feedback...",
                    },
                  }} />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0" id="feedback-table">
                {/* Data Table */}
                <DataTable
                  columns={FEEDBACK_COLUMNS}
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
                        colSpan={FEEDBACK_COLUMNS.length}
                        message="No Department found"
                        description="There are no Department to display."
                      />
                    }
                    fallback={
                      <TableSkeletonLoader columns={FEEDBACK_COLUMNS.length} />
                    }
                    render={(val, index) => (
                      <TableRow key={val?.id} className="hover:bg-muted/50">
                        {/* Serial Number */}
                        <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                          {getSerialNumber(
                            data?.meta?.current_page || 1,
                            filter.per_page || 10,
                            index,
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.name}</span>
                        </TableCell>
                        {/* Title */}
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.email}</span>
                        </TableCell>

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.mobile}</span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.subject}</span>
                        </TableCell>

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.message}</span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">
                            {val?.is_read ? "Read" : "Unread"}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">
                            {new Date(val?.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        {/* Actions */}
                        <TableCell className="">
                          <div className="flex  items-center gap-0.5">
                            <Tooltip>
                              <TooltipTrigger>
                                <Switch
                                  checked={val?.is_read == true}
                                  onCheckedChange={() => handleToggleStatus(val)}
                                  disabled={toggleStatusMutation.isPending}
                                />
                              </TooltipTrigger>{" "}
                              <TooltipContent>Status Toggle</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(val)}
                                  disabled={deleteFeedback.isPending}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
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

export default ManageFeedback;
