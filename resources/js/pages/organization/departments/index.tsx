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
  Building2,
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

import { FilterBar } from "@/components/filter-bar";
import {
  DEPARTMENT_BREADCRUMBS,
  DEPARTMENT_COLUMNS,
  INITIAL_DEPARTMENT_FILTERS,
  DEPARTMENT_GUIDELINES,
  DEPARTMENT_TIP,
} from "@/constants/page/admin/department";
import DepartmentApi from "@/lib/api/departmentApi";
import { DepartmentDialog } from "@/components/admin/departmentDialog";
import { useRegisterGuide } from '@/components/GuideProvider';
import { DEPARTMENTS_GUIDE } from "@/constants/guides/academic";

const ManageDepartments = () => {
  const queryClient = useQueryClient();
useRegisterGuide(DEPARTMENTS_GUIDE);

  const departmentDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_DEPARTMENT_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["department", filter],
    queryFn: () => DepartmentApi.getDepartment(filter),
  });
  const deleteDisclosure = useDisclosure();
  const deletesubjectGroupMutation = useMutation({
    mutationFn: (id: number | string) =>
      DepartmentApi.deleteDepartment(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deletesubjectGroupMutation.mutate(deleteDisclosure.data?.id);
  };
  const handleEdit = (row: any) => departmentDisclosure.onOpen(row);
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title="Department" />
      <DepartmentDialog
        open={departmentDisclosure.isOpen}
        onClose={departmentDisclosure.onClose}
        data={departmentDisclosure.data}
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
              id="departments-header"
              breadcrumbs={DEPARTMENT_BREADCRUMBS}
              icon={Building2}
              title="Departments"
              subtitle="Manage core academic and administrative departments"
              guidance={DEPARTMENT_GUIDELINES}
              tip={DEPARTMENT_TIP}
            />
            <div className="flex justify-end">
              <Button
                id="new-department-btn"
                onClick={() => departmentDisclosure.onOpen()}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                <span>Add New Department</span>
              </Button>
            </div>

          <Card>
            <CardHeader className="pb-4">
              {" "}
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{ filters: [], search: { name: "search", placeholder: "Search by Department Name or Code..." } }} />
              </FilterBar>{" "}
            </CardHeader>
            <CardContent className="pt-0" id="departments-table">
              {/* Data Table */}
              <DataTable
                columns={DEPARTMENT_COLUMNS}
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
                      colSpan={DEPARTMENT_COLUMNS.length}
                      message="No Department found"
                      description="There are no Department to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={DEPARTMENT_COLUMNS.length} />
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

export default ManageDepartments;
