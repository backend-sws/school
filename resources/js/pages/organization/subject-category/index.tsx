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
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import {
  Eye,
  ListChecks,
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
import SubjectCategoryApi from "@/lib/api/subjectCategoryApi";
import {
  INITIAL_SUBJECT_CATEGORY_FILTERS,
  SUBJECT_CATEGORY_COLUMNS,
  SUBJECT_CATEGORY_GUIDELINES,
  SUBJECT_CATEGORY_BREADCRUMBS,
} from "@/constants/page/admin/subjectCategory";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SubjectCategoryDialog } from "@/components/admin/subjectCategoryDialog";
import { FilterBar } from "@/components/filter-bar";
import { KeyGuidelines } from "@/components/key-guidelines";


const SubjectCategory = () => {
  const queryClient = useQueryClient();

  const subjectCategoryDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_SUBJECT_CATEGORY_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["subject-category", filter],
    queryFn: () => SubjectCategoryApi.getSubjectCategory(filter),
  });
  const deleteDisclosure = useDisclosure();
  const deleteSubjectCategoryMutation = useMutation({
    mutationFn: (id: number | string) =>
      SubjectCategoryApi.deleteSubjectCatergory(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-category"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deleteSubjectCategoryMutation.mutate(deleteDisclosure.data?.id);
  };
  const handleEdit = (row: any) => subjectCategoryDisclosure.onOpen(row);
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };
  return (
    <>
      <Head title="Subject Classifications" />
      <SubjectCategoryDialog
        open={subjectCategoryDisclosure.isOpen}
        onClose={subjectCategoryDisclosure.onClose}
        data={subjectCategoryDisclosure.data}
      />

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Stream"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteSubjectCategoryMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            breadcrumbs={SUBJECT_CATEGORY_BREADCRUMBS}
            icon={ListChecks}
            title="Subject Classifications"
            subtitle="Define high-level categories for subjects (e.g., Core, Elective, Practical, Theory)"
            guidance={SUBJECT_CATEGORY_GUIDELINES}
          />

          <div className="flex justify-end">
            <Button
              onClick={() => subjectCategoryDisclosure.onOpen()}
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              <span>New Classification</span>
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
                columns={SUBJECT_CATEGORY_COLUMNS}
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
                      colSpan={SUBJECT_CATEGORY_COLUMNS.length}
                      message="No subject category found"
                      description="There are no subject category to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={SubjectCategory.length} />
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
                                disabled={
                                  deleteSubjectCategoryMutation.isPending
                                }
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

export default SubjectCategory;
