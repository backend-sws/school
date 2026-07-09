import { SubjectDialog } from "@/components/admin/subjectDialog";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";
import useSearchFilter from "@/hooks/useSearchfilter";
import SubjectApi from "@/lib/api/subjectApi";
import { getSerialNumber } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, GitMerge, Pencil, Plus, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  INITIAL_SUBJECT_MAPPING_FILTERS,
  SUBJECT_MAPPING_COLUMNS,
  SUBJECT_CATEGORY_MAPPING_GUIDELINES,
  SUBJECT_CATEGORY_MAPPING_BREADCRUMBS,
} from "@/constants/page/admin/subjectMapping";
import { SubjectMappingDialog } from "@/components/admin/SubjectMappingDialog";
import SubjectMappingApi from "@/lib/api/subjectMappingApi";
import { FilterBar } from "@/components/filter-bar";
import { KeyGuidelines } from "@/components/key-guidelines";

const SubjetCategoryMapping = () => {
  const queryClient = useQueryClient();

  const subjectMappingDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_SUBJECT_MAPPING_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["subject-category-mapping", filter],
    queryFn: () => SubjectMappingApi.getSubjectMapping(filter),
  });
  const deleteDisclosure = useDisclosure();
  const deleteSubjectMutation = useMutation({
    mutationFn: (id: number | string) =>
      SubjectMappingApi.deleteSubjectMapping(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-category-mapping"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deleteSubjectMutation.mutate(deleteDisclosure?.data?.id);
  };
  const handleEdit = (row: any) => subjectMappingDisclosure.onOpen(row);
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };
  return (
    <>
      <Head title="Category Mapping" />
      <SubjectMappingDialog
        open={subjectMappingDisclosure.isOpen}
        onClose={subjectMappingDisclosure.onClose}
        data={subjectMappingDisclosure.data}
      />

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Stream"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteSubjectMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            breadcrumbs={SUBJECT_CATEGORY_MAPPING_BREADCRUMBS}
            icon={GitMerge}
            title="Category Mapping"
            subtitle="Map subject categories to specific admission heads for automated eligibility checks"
            guidance={SUBJECT_CATEGORY_MAPPING_GUIDELINES}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => subjectMappingDisclosure.onOpen()}
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              <span>Establish Category Map</span>
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-4">
              {" "}
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{ filters: [], search: { name: "search", placeholder: "Search..." } }} />
              </FilterBar>{" "}
            </CardHeader>

            <CardContent className="pt-0">
              {/* Data Table */}
              <DataTable
                columns={SUBJECT_MAPPING_COLUMNS}
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
                      colSpan={SUBJECT_MAPPING_COLUMNS.length}
                      message="No subject-category-mapping category found"
                      description="There are no subject-category-mapping to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader
                      columns={SUBJECT_MAPPING_COLUMNS.length}
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
                      </TableCell>{" "}
                      <TableCell className="font-medium max-w-[200px]">
                        <StatusBadge
                          status={val.status ? "active" : "inactive"}
                        />
                      </TableCell>{" "}
                      <TableCell className="max-w-[250px]">
                        <div className="flex flex-wrap gap-1">
                          {val?.categories?.slice(0, 3).map((cat: any) => (
                            <span
                              key={cat.id}
                              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md uppercase"
                            >
                              {cat.name}
                            </span>
                          ))}

                          {val?.categories?.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{val.categories.length - 3} more
                            </span>
                          )}
                        </div>
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
                                disabled={deleteSubjectMutation.isPending}
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
      </TooltipProvider>
    </>
  );
};

export default SubjetCategoryMapping;
