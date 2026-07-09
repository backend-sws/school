import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { usePageConfig } from "@/hooks/usePageConfig";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { parsePaginatedResponse, getSerialNumber, extractApiList } from "@/lib/utils";
import expenseApi from "@/lib/api/expenseApi";
import { ExpenseQueryKeys } from "@/lib/querykey/expense";
import {
  EXPENSE_PERMISSIONS,
  EXPENSE_FORM_FIELDS,
  getExpenseColumns,
  getExpensesBreadcrumbs,
  PAYMENT_MODE_OPTIONS,
} from "@/constants/expenses/formConfig";
import { expenseSchema } from "@/lib/validations/expense";
import { ExpenseDialog } from "@/components/admin/expenseDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filter-bar";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import { TableRow, TableCell } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { ModalDialog } from "@/components/shared/Modal";
import { Plus, Pencil, Trash2, Check, X, FileText, IndianRupee, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function Records() {
  const formDisclosure = useDisclosure<any>();
  const deleteDisclosure = useDisclosure<any>();
  const rejectDisclosure = useDisclosure<any>();

  const [rejectionReason, setRejectionReason] = useState("");

  const { content: CONTENT, breadcrumbs: BREADCRUMBS, columns: COLUMNS, canCreate, canEdit, canDelete } =
    usePageConfig({
      permissions: EXPENSE_PERMISSIONS,
      formFields: EXPENSE_FORM_FIELDS as any,
      schema: expenseSchema,
      getContent: (c) => ({
        pageTitle: c.expenses_records_title,
        pageSubtitle: c.expenses_records_subtitle,
        guidance: c.expenses_records_guidance,
        addBtn: c.expenses_records_add_btn,
        emptyTitle: c.expenses_records_empty_title,
        emptyDesc: c.expenses_records_empty_desc,
        searchPlaceholder: "Search by title or payee...",
      }),
      getBreadcrumbs: getExpensesBreadcrumbs,
      getColumns: getExpenseColumns,
    });

  const { filter, handleFilter } = useSearchFilter({
    search: "",
    expense_category_id: "",
    status: "",
    payment_mode: "",
    page: 1,
    per_page: 15,
  });

  // Fetch Categories for filters
  const { data: categoriesResponse } = useQuery({
    queryKey: ExpenseQueryKeys.categoriesList({ per_page: 1000 }),
    queryFn: () => expenseApi.categoriesIndex({ per_page: 1000 }),
  });
  const categories = extractApiList(categoriesResponse);

  // Fetch Expenses list
  const { data, isLoading } = useQuery({
    queryKey: ExpenseQueryKeys.expensesList(filter),
    queryFn: () => expenseApi.expensesIndex(filter),
  });

  const { items, meta } = parsePaginatedResponse<any>(data);

  // Fetch KPI summaries
  const { data: analyticsResponse } = useQuery({
    queryKey: ["expenses-kpis"],
    queryFn: () => expenseApi.expensesAnalytics(),
  });
  const kpis = analyticsResponse?.kpis || { total_approved: 0, total_pending: 0, total_draft: 0 };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => expenseApi.expensesDestroy(id),
    onSuccess: () => {
      toast.success("Expense log deleted");
      queryClient.invalidateQueries({ queryKey: ExpenseQueryKeys.expensesAll });
      queryClient.invalidateQueries({ queryKey: ["expenses-kpis"] });
      deleteDisclosure.onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete expense");
      deleteDisclosure.onClose();
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => expenseApi.expensesApprove(id),
    onSuccess: () => {
      toast.success("Expense approved");
      queryClient.invalidateQueries({ queryKey: ExpenseQueryKeys.expensesAll });
      queryClient.invalidateQueries({ queryKey: ["expenses-kpis"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Approval failed");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => expenseApi.expensesReject(id, reason),
    onSuccess: () => {
      toast.success("Expense rejected");
      queryClient.invalidateQueries({ queryKey: ExpenseQueryKeys.expensesAll });
      queryClient.invalidateQueries({ queryKey: ["expenses-kpis"] });
      rejectDisclosure.onClose();
      setRejectionReason("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Rejection failed");
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteDisclosure.data?.id) {
      deleteMutation.mutate(deleteDisclosure.data.id);
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    if (rejectDisclosure.data?.id) {
      rejectMutation.mutate({ id: rejectDisclosure.data.id, reason: rejectionReason });
    }
  };

  return (
    <>
      <Head title={CONTENT.pageTitle} />

      <ExpenseDialog
        open={formDisclosure.isOpen}
        onClose={formDisclosure.onClose}
        expense={formDisclosure.data}
      />

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={(open) => !open && deleteDisclosure.onClose()}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Log"
        description="Are you sure you want to delete this logged expense? This action is permanent."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Reject Reason Dialog */}
      <ModalDialog
        open={rejectDisclosure.isOpen}
        onClose={rejectDisclosure.onClose}
        title="Reject Expense Payment"
        className="max-w-md"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Reason for Rejection
            </label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="Provide a reason for rejecting this expense..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={rejectDisclosure.onClose}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rejectMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject Expense"}
            </button>
          </div>
        </form>
      </ModalDialog>

      <TooltipProvider>
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

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-emerald-500/5 border-emerald-500/10">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Approved</p>
                    <h3 className="text-2xl font-bold text-emerald-600 mt-1">₹{kpis.total_approved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                    <IndianRupee className="size-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-500/5 border-amber-500/10">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Pending Review</p>
                    <h3 className="text-2xl font-bold text-amber-600 mt-1">₹{kpis.total_pending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
                    <AlertCircle className="size-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/5 border-blue-500/10">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Outflows</p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-1">
                      ₹{(kpis.total_approved + kpis.total_pending).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                    <FileText className="size-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Logged Expenditures</h2>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilter}>
                  <FilterBar.Renderer
                    config={{
                      search: { name: "search", placeholder: CONTENT.searchPlaceholder },
                      filters: [
                        {
                          name: "expense_category_id",
                          type: "select",
                          label: "Category",
                          placeholder: "All Categories",
                          options: [
                            { value: "", text: "All Categories" },
                            ...categories.map((c: any) => ({ value: String(c.id), text: c.name }))
                          ]
                        },
                        {
                          name: "status",
                          type: "select",
                          label: "Status",
                          placeholder: "All Statuses",
                          options: [
                            { value: "", text: "All Statuses" },
                            { value: "pending", text: "Pending Approval" },
                            { value: "approved", text: "Approved" },
                            { value: "rejected", text: "Rejected" },
                            { value: "draft", text: "Draft" },
                          ]
                        },
                        {
                          name: "payment_mode",
                          type: "select",
                          label: "Payment Mode",
                          placeholder: "All Modes",
                          options: [
                            { value: "", text: "All Modes" },
                            ...PAYMENT_MODE_OPTIONS.map((o) => ({ value: o.value, text: o.text }))
                          ]
                        }
                      ]
                    }}
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
                    render={(row, index) => {
                      const isPending = row.status === "pending";
                      return (
                        <TableRow>
                          <TableCell className="w-[60px]">
                            {getSerialNumber(meta.current_page, meta.per_page, index)}
                          </TableCell>
                          <TableCell>{row.date ? row.date.split("T")[0] : "—"}</TableCell>
                          <TableCell className="font-semibold">{row.category?.name || "—"}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{row.title}</p>
                              {row.reference_no && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">Ref: {row.reference_no}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-foreground">
                            ₹{parseFloat(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>{row.payee || "—"}</TableCell>
                          <TableCell>{row.payment_mode}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                row.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : row.status === "rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}
                            >
                              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="w-[180px]">
                            <div className="flex items-center gap-1">
                              {/* View invoice attachment if exists */}
                              {row.attachment && (
                                <TooltipWrapper content="View Invoice">
                                  <a
                                    href={`/api/v1/r2/proxy?path=${encodeURIComponent(row.attachment)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 border rounded-md hover:bg-muted text-primary"
                                  >
                                    <FileText className="size-4" />
                                  </a>
                                </TooltipWrapper>
                              )}

                              {/* Approver actions */}
                              {isPending && canEdit && (
                                <>
                                  <TooltipWrapper content="Approve">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => approveMutation.mutate(row.id)}
                                      disabled={approveMutation.isPending}
                                    >
                                      <Check className="size-4" />
                                    </Button>
                                  </TooltipWrapper>
                                  <TooltipWrapper content="Reject">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => rejectDisclosure.onOpen(row)}
                                    >
                                      <X className="size-4" />
                                    </Button>
                                  </TooltipWrapper>
                                </>
                              )}

                              {/* Standard edit/delete when pending/draft */}
                              {(!row.approved_by || row.status === "pending") && (
                                <>
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
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }}
                  />
                </DataTable>
              </CardContent>
            </Card>
          </div>
      </TooltipProvider>
    </>
  );
}
