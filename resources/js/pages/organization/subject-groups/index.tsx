import React from 'react';
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
import { Head } from "@inertiajs/react";
import {
  Eye,
  Layers,
  Pencil,
  Plus,
  ToggleLeftIcon,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import SessionApi from "@/lib/api/sessionApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import subjectGroupApi from "@/lib/api/subjectGroupApi";
import { SubjectGroupDialog } from "@/components/admin/subjectGroupDialog";
import {
  INITIAL_SUBJECT_GROUP_FILTERS,
  SUBJECT_GROUP_BREADCRUMBS,
  SUBJECT_GROUP_COLUMNS,
  SUBJECT_GROUPS_GUIDELINES,
} from "@/constants/page/admin/subjectGroup";
import { FilterBar } from "@/components/filter-bar";
import { useRegisterGuide } from '@/components/GuideProvider';
import { SUBJECT_GROUPS_GUIDE } from "@/constants/guides/academic";

const SubjectGroups = () => {
  const queryClient = useQueryClient();
useRegisterGuide(SUBJECT_GROUPS_GUIDE);

  const subjectGroupDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_SUBJECT_GROUP_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["subject-group", filter],
    queryFn: () => subjectGroupApi.getSubjectGroup(filter),
  });
  const deleteDisclosure = useDisclosure();
  const deletesubjectGroupMutation = useMutation({
    mutationFn: (id: number | string) =>
      subjectGroupApi.deleteSubjectGroup(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-group"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deletesubjectGroupMutation.mutate(deleteDisclosure.data?.id);
  };
  const handleEdit = (row: any) => subjectGroupDisclosure.onOpen(row);
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title="Subject Group" />
      <SubjectGroupDialog
        open={subjectGroupDisclosure.isOpen}
        onClose={subjectGroupDisclosure.onClose}
        data={subjectGroupDisclosure.data}
      />

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Stream"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deletesubjectGroupMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <PageContainer maxWidth="full">
          <div className="space-y-6">
            <MainPageHeader
              id="subject-groups-header"
              breadcrumbs={SUBJECT_GROUP_BREADCRUMBS}
              icon={Layers}
              title="Elective Groups"
              subtitle="Cluster subjects into logical elective or core groups for streamlined student selection"
              guidance={SUBJECT_GROUPS_GUIDELINES}
            />
            <div className="flex justify-end">
              <Button
                id="new-elective-group-btn"
                onClick={() => subjectGroupDisclosure.onOpen()}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                <span>Define Elective Group</span>
              </Button>
            </div>

          <Card>
            <CardHeader className="pb-4">
              {" "}
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{ filters: [], search: { name: "search", placeholder: "Search..." } }} />
              </FilterBar>{" "}
            </CardHeader>
            <CardContent className="pt-0" id="subject-groups-table">
              {/* Data Table */}
              <DataTable
                columns={SUBJECT_GROUP_COLUMNS}
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
                      colSpan={SUBJECT_GROUP_COLUMNS.length}
                      message="No subject group found"
                      description="There are no subject group to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader
                      columns={SUBJECT_GROUP_COLUMNS.length}
                    />
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

                      {/* Title */}
                      <TableCell className="font-medium max-w-[200px] uppercase">
                        <span className="truncate block">{val?.name}</span>
                      </TableCell>

                      <TableCell className="font-medium max-w-[200px] uppercase">
                        <span className="truncate block">{val?.code}</span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="w-1/6">
                        <div className="flex  items-center gap-0.5">
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

                          {/* <Tooltip>
                              <TooltipTrigger>
                                <Button size="icon" variant="outline">
                                  {val?.status === 0 ? (
                                    <ToggleLeftIcon color="red" />
                                  ) : (
                                    <ToggleRight color="green" />
                                  )}
                                </Button>{" "}
                              </TooltipTrigger>{" "}
                              <TooltipContent>Status Toggle</TooltipContent>
                            </Tooltip> */}

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
                                disabled={deletesubjectGroupMutation.isPending}
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

export default SubjectGroups;
