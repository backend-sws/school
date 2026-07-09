import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { ArrowLeftRight, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import libraryApi from "@/lib/api/libraryApi";
import { PermissionGate } from "@/components/PermissionGate";
import {
  LIBRARY_ISSUES_BREADCRUMBS,
  LIBRARY_ISSUES_GUIDELINES,
  LIBRARY_ISSUES_TABLE_COLUMNS,
  LIBRARY_ISSUE_FORM_INITIAL,
  LIBRARY_ISSUE_FORM_LAYOUT,
} from "@/constants/page/admin/library";
import { useRegisterGuide } from '@/components/GuideProvider';
import { LIBRARY_ISSUES_GUIDE } from "@/constants/guides/library";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import {
  LibraryIssueFormSchema,
  type LibraryIssueFormValues,
} from "@/lib/validations/library";
import { useMemo } from 'react';

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  status: "",
};

const defaultDueAt = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
};

const LibraryIssuesIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(LIBRARY_ISSUES_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const issueDialog = useDisclosure();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors: _formErrors },
  } = useForm<LibraryIssueFormValues>({
    resolver: zodResolver(LibraryIssueFormSchema) as any,
    defaultValues: {
      ...LIBRARY_ISSUE_FORM_INITIAL,
      due_at: defaultDueAt(),
    },
    mode: "onChange",
  });

  const { data: copiesData } = useQuery({
    queryKey: ["library-copies-available"],
    queryFn: () =>
      libraryApi.copies.index({ is_available: "true", per_page: 500 }),
    enabled: issueDialog.isOpen,
  });
  const availableCopies = (copiesData?.data ?? []) as {
    id: number;
    barcode?: string | null;
    book?: { id: number; title: string };
  }[];

  const issueFormLayoutWithOptions = useMemo(
    () =>
      LIBRARY_ISSUE_FORM_LAYOUT.map((field) =>
        field.name === "library_copy_id"
          ? {
            ...field,
            options: availableCopies.map((c) => ({
              key: String(c.id),
              text: `${c.book?.title ?? "Book"} ${c.barcode ? `(${c.barcode})` : ""}`,
              value: String(c.id),
            })),
          }
          : field
      ),
    [availableCopies]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["library-issues", filter],
    queryFn: () =>
      libraryApi.issues.index({
        ...filter,
        status: filter.status || undefined,
      }),
  });

  const returnMutation = useMutation({
    mutationFn: (id: number) => libraryApi.issues.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-issues"] });
      queryClient.invalidateQueries({ queryKey: ["library-copies"] });
      queryClient.invalidateQueries({ queryKey: ["library-copies-available"] });
    },
  });

  const issueMutation = useMutation({
    mutationFn: (payload: LibraryIssueFormValues) =>
      libraryApi.issues.store({
        library_copy_id: Number(payload.library_copy_id),
        user_id: Number(payload.user_id),
        due_at: payload.due_at,
        remarks: payload.remarks || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-issues"] });
      queryClient.invalidateQueries({ queryKey: ["library-copies"] });
      queryClient.invalidateQueries({ queryKey: ["library-copies-available"] });
      issueDialog.onClose();
      reset({ ...LIBRARY_ISSUE_FORM_INITIAL, due_at: defaultDueAt() });
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const onIssueSubmit = (formData: LibraryIssueFormValues) => {
    issueMutation.mutate(formData);
  };

  const rows = (data?.data ?? []) as (Record<string, unknown> & {
    id: number;
    issued_at: string;
    due_at: string;
    returned_at?: string | null;
    copy?: { id: number; book?: { title: string } };
    user?: { id: number; name?: string; email?: string };
  })[];
  const meta = data?.meta as
    | {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }
    | undefined;

  return (
    <>
      <Head title="Library Issues" />
      <Dialog open={issueDialog.isOpen} onOpenChange={issueDialog.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Book</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onIssueSubmit) as any}
            className="space-y-4"
          >
            <Each
              of={issueFormLayoutWithOptions}
              render={(formField: any) => (
                <ControlledFormComponent
                  key={formField.name}
                  control={control as any}
                  options={formField.options}
                  {...formField}
                />
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => issueDialog.onClose()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={issueMutation.isPending}>
                {issueMutation.isPending ? "Issuing..." : "Issue"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <PageContainer maxWidth="full">
        <div className="space-y-6">
          <MainPageHeader
            id="library-issues-header"
            breadcrumbs={LIBRARY_ISSUES_BREADCRUMBS}
            icon={ArrowLeftRight}
            title="Circulation Desk"
            subtitle="Manage book check-outs, returns, and track overdue items across your institution."
            guidance={LIBRARY_ISSUES_GUIDELINES}
          />
          <div className="flex justify-end">
            <PermissionGate can="create_library_issues">
              <Button
                id="issue-book-btn"
                onClick={() => issueDialog.onOpen()}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                <span>Issue New Book</span>
              </Button>
            </PermissionGate>
          </div>
        <Card>
          <CardHeader className="pb-4">
            <FilterBar values={filter} onChange={handleFilterChange}>
              <FilterBar.Renderer config={{ filters: [{ name: "status", type: "select", label: "Status", placeholder: "All", options: [{ value: "", label: "All" }, { value: "open", label: "Open" }, { value: "overdue", label: "Overdue" }, { value: "returned", label: "Returned" }] }] }} />
            </FilterBar>
          </CardHeader>
          <CardContent className="pt-0" id="issues-table">
            <DataTable
              columns={LIBRARY_ISSUES_TABLE_COLUMNS}
              currentPage={meta?.current_page ?? 1}
              lastPage={meta?.last_page ?? 1}
              pageSize={filter.per_page ?? 15}
              totalRecords={meta?.total ?? 0}
              handlePageChange={(page) => handleFilter({ page })}
              handlePageSizeChange={(size) =>
                handleFilter({ per_page: size, page: 1 })
              }
            >
              <Each
                isLoading={isLoading}
                of={rows}
                nodatafound={
                  <TableEmptyState
                    colSpan={LIBRARY_ISSUES_TABLE_COLUMNS.length}
                    message="No issues found"
                    description="Issue a book to get started."
                  />
                }
                fallback={
                  <TableSkeletonLoader
                    columns={LIBRARY_ISSUES_TABLE_COLUMNS.length}
                  />
                }
                render={(row, index) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                      {getSerialNumber(
                        meta?.current_page ?? 1,
                        meta?.per_page ?? 15,
                        index
                      )}
                    </TableCell>
                    <TableCell>
                      {row.copy?.book?.title ?? "—"}
                    </TableCell>
                    <TableCell>
                      {row.user?.name ??
                        row.user?.email ??
                        `User #${row.user?.id}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.issued_at
                        ? new Date(row.issued_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.due_at
                        ? new Date(row.due_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.returned_at
                        ? new Date(row.returned_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {!row.returned_at && (
                        <PermissionGate can="create_library_issues">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => returnMutation.mutate(row.id)}
                            disabled={returnMutation.isPending}
                          >
                            Return
                          </Button>
                        </PermissionGate>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
    </>
  );
};

export default LibraryIssuesIndex;
