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
  Layers,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useMemo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { BreadcrumbItem } from "@/types";
import { getSerialNumber } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MainStreamApi from "@/lib/api/mainStreamApi";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MainStreamDialog } from "@/components/admin/MainStreamDialog";
import { FilterBar } from "@/components/filter-bar";
import {
  INITIAL_MAIN_STREAM_FILTERS,
  MainStreamTable,
  MAIN_STREAM_GUIDELINES,
  MAIN_STREAM_PERMISSIONS,
} from "@/constants/page/admin/mainStream";
import { useRegisterGuide } from '@/components/GuideProvider';
import { MAIN_STREAMS_GUIDE } from "@/constants/guides/academic";
import { useInstitutionLabels } from "@/hooks/useInstitutionLabels";
import { useAuth } from "@/hooks/use-can";

const MainStreams = () => {
  const queryClient = useQueryClient();
  const { mainStreamsTitle, mainStreamLabel } = useInstitutionLabels();
  const { can } = useAuth();
  const canCreate = can(MAIN_STREAM_PERMISSIONS.create);
  const canEdit = can(MAIN_STREAM_PERMISSIONS.edit);
  const canDelete = can(MAIN_STREAM_PERMISSIONS.delete);
  useRegisterGuide(MAIN_STREAMS_GUIDE);

  const mainStreamDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_MAIN_STREAM_FILTERS,
  });
  const deleteMainStreamMutation = useMutation({
    mutationFn: (id: number | string) =>
      MainStreamApi.deleteMainStream(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-streams"] });
      deleteDisclosure.onClose();
    },
  });
  const { data, isLoading } = useQuery({
    queryKey: ["main-streams", filter],
    queryFn: () => MainStreamApi.getMainStreams(filter),
  });
  const handleEdit = (row: any) => mainStreamDisclosure.onOpen(row);
  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deleteMainStreamMutation.mutate(deleteDisclosure.data?.id);
  };
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const breadcrumbs = useMemo((): BreadcrumbItem[] => [
    { title: "Academic Setup", href: "/organization/sessions" },
    { title: mainStreamsTitle, href: "/organization/main-streams" },
  ], [mainStreamsTitle]);

  return (
    <>
      <Head title={mainStreamsTitle} />

      <MainStreamDialog
        open={mainStreamDisclosure.isOpen}
        onClose={mainStreamDisclosure.onClose}
        mainStream={mainStreamDisclosure.data}
        mainStreamLabel={mainStreamLabel}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title={`Delete ${mainStreamLabel}`}
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteMainStreamMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />

      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="main-streams-header"
            breadcrumbs={breadcrumbs}
            icon={Layers}
            title={mainStreamsTitle}
            subtitle={`Define high-level academic divisions for your institution`}
            guidance={MAIN_STREAM_GUIDELINES}
          />
          {canCreate && (
            <div className="flex justify-end">
              <Button
                onClick={() => mainStreamDisclosure.onOpen()}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                <span>Register {mainStreamLabel}</span>
              </Button>
            </div>
          )}

          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{
                  filters: [],
                  searchGroup: {
                    selectName: "search_by",
                    searchName: "search",
                    options: [
                      { value: "name", label: "Name" },
                      { value: "code", label: "Code" },
                    ],
                    placeholder: "Search...",
                  },
                }} />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0" id="main-streams-table">
              {/* Data Table */}
              <DataTable
                columns={MainStreamTable}
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
                  of={data?.data}
                  isLoading={isLoading}
                  nodatafound={
                    <TableEmptyState
                      colSpan={MainStreamTable.length}
                      message="No candidates found"
                      description="There are no candidates to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={MainStreamTable.length} />
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
                      <TableCell className="font-medium max-w-[200px] uppercase">
                        <span className="truncate block">{val?.name}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground uppercase">
                        {val?.code || "All Students"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={val?.status === 0 ? "inactive" : "active"}
                        />
                      </TableCell>

                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          {canEdit && (
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
                          )}
                          {canDelete && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(val)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                            </Tooltip>
                          )}
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

export default MainStreams;
