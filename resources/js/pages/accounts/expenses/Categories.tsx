import React, { useMemo } from "react";
import { Head } from "@inertiajs/react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { usePageConfig } from "@/hooks/usePageConfig";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { parsePaginatedResponse } from "@/lib/utils";
import expenseApi from "@/lib/api/expenseApi";
import { ExpenseQueryKeys } from "@/lib/querykey/expense";
import {
  CATEGORY_PERMISSIONS,
  CATEGORY_FORM_FIELDS,
  getCategoryColumns,
  getExpensesBreadcrumbs,
} from "@/constants/expenses/formConfig";
import { expenseCategorySchema } from "@/lib/validations/expense";
import { ExpenseCategoryDialog } from "@/components/admin/expenseCategoryDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filter-bar";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import { TableRow, TableCell } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";

import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Plus, Pencil, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function Categories() {
  const formDisclosure = useDisclosure<any>();
  const deleteDisclosure = useDisclosure<any>();

  const { content: CONTENT, breadcrumbs: BREADCRUMBS, columns: COLUMNS, canCreate, canEdit, canDelete } =
    usePageConfig({
      permissions: CATEGORY_PERMISSIONS,
      formFields: CATEGORY_FORM_FIELDS as any,
      schema: expenseCategorySchema,
      getContent: (c) => ({
        pageTitle: c.expense_categories_title,
        pageSubtitle: c.expense_categories_subtitle,
        guidance: c.expense_categories_guidance,
        addBtn: c.expense_categories_add_btn,
        emptyTitle: c.expense_categories_empty_title,
        emptyDesc: c.expense_categories_empty_desc,
        searchPlaceholder: "Search by category name or code...",
      }),
      getBreadcrumbs: getExpensesBreadcrumbs,
      getColumns: getCategoryColumns,
    });

  const { filter, handleFilter } = useSearchFilter({
    search: "",
    page: 1,
    per_page: 15,
  });

  const { data, isLoading } = useQuery({
    queryKey: ExpenseQueryKeys.categoriesList(filter),
    queryFn: () => expenseApi.categoriesIndex(filter),
  });

  const { items, meta } = parsePaginatedResponse<any>(data);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => expenseApi.categoriesDestroy(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ExpenseQueryKeys.categoriesAll });
      deleteDisclosure.onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete category");
      deleteDisclosure.onClose();
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteDisclosure.data?.id) {
      deleteMutation.mutate(deleteDisclosure.data.id);
    }
  };

  return (
    <>
      <Head title={CONTENT.pageTitle} />

      <ExpenseCategoryDialog
        open={formDisclosure.isOpen}
        onClose={formDisclosure.onClose}
        category={formDisclosure.data}
      />

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={(isOpen) => !isOpen && deleteDisclosure.onClose()}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Category"
        description={`Are you sure you want to delete category "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      <TooltipProvider delayDuration={300}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <MainPageHeader
              title={CONTENT.pageTitle}
              subtitle={CONTENT.pageSubtitle}
              guidance={CONTENT.guidance}
            />
            <div className="flex justify-end w-full sm:w-auto">
              {canCreate && (
                <Button onClick={() => formDisclosure.onOpen(null)} className="w-full sm:w-auto gap-1.5">
                  <Plus className="size-4" /> {CONTENT.addBtn}
                </Button>
              )}
            </div>
          </div>

            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilter}>
                  <FilterBar.Search name="search" placeholder={CONTENT.searchPlaceholder} />
                  <FilterBar.Select
                    name="is_active"
                    placeholder="All Status"
                    options={[
                      { value: "1", label: "Active" },
                      { value: "0", label: "Inactive" },
                    ]}
                  />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTable
                  columns={COLUMNS}
                  isPaginated={meta.last_page > 1}
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                  totalRecords={meta.total}
                  pageSize={meta.per_page}
                  handlePageChange={(page) => handleFilter({ page })}
                  handlePageSizeChange={(per_page) => handleFilter({ per_page, page: 1 })}
                >
                  <Each
                    of={items}
                    isLoading={isLoading}
                    nodatafound={
                      <TableEmptyState
                        colSpan={COLUMNS.length}
                        message={CONTENT.emptyTitle}
                        description={CONTENT.emptyDesc}
                      />
                    }
                    fallback={<TableSkeletonLoader columns={COLUMNS.length} rows={5} />}
                    keyExtractor={(r) => String(r.id)}
                    render={(row, index) => (
                      <TableRow>
                        <TableCell className="w-[80px]">
                          {meta.from ? meta.from + index : index + 1}
                        </TableCell>
                        <TableCell className="font-semibold">{row.name}</TableCell>
                        <TableCell>{row.code || "—"}</TableCell>
                        <TableCell className="max-w-xs truncate" title={row.description}>
                          {row.description || "—"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              row.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {row.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="w-[100px]">
                          <div className="flex items-center gap-0.5">
                            {canEdit && (
                              <TooltipWrapper content="Edit">
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => formDisclosure.onOpen(row)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipWrapper>
                            )}
                            {canDelete && (
                              <TooltipWrapper content="Delete">
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => deleteDisclosure.onOpen(row)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TooltipWrapper>
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
}
