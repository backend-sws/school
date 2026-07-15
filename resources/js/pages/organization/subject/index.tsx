import React from "react";
import { SubjectDialog } from "@/components/admin/subjectDialog";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TableRow, TableCell } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { useDisclosure } from "@/hooks/useDisclosure";
import useSearchFilter from "@/hooks/useSearchfilter";
import { Head } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { Book, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { FilterBar } from "@/components/filter-bar";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import SubjectGroupApi from "@/lib/api/subjectGroupApi";
import subjectApi from "@/lib/api/subjectApi";
import { SubjectQueryKeys } from "@/lib/querykey/subject";
import { subjectDialogFormSchema } from "@/lib/validations/subject";
import { getSerialNumber, parsePaginatedResponse } from "@/lib/utils";
import { usePageConfig } from "@/hooks/usePageConfig";
import { useAuth } from "@/hooks/use-can";
import { getSubjectsGuide } from "@/constants/guides/academic";
import { toast } from "sonner";
import {
  SUBJECT_PERMISSIONS,
  SUBJECT_FORM_FIELDS,
  getSubjectContent,
  getSubjectBreadcrumbs,
  getSubjectColumns,
  getSubjectFormFields,
} from "@/constants/subject/formConfig";

// ─── Types ───────────────────────────────────────────────────────────────────

type SubjectRow = {
  id: number;
  name: string;
  code: string;
  stream_id: number;
  status: number;
  is_practical: boolean;
  stream?: { name: string };
  subject_group?: { name: string };
};

const DEFAULT_PAGE_SIZE = 15;

// ─── Component ───────────────────────────────────────────────────────────────

const Subjects = () => {
  const formDisclosure = useDisclosure<SubjectRow>();
  const deleteDisclosure = useDisclosure<SubjectRow>();

  // ─── Page config (single source of truth) ────────────
  const {
    content: CONTENT,
    breadcrumbs: BREADCRUMBS,
    columns: COLUMNS,
    canCreate,
    canEdit,
    canDelete,
  } = usePageConfig({
    permissions: SUBJECT_PERMISSIONS,
    formFields: SUBJECT_FORM_FIELDS,
    schema: subjectDialogFormSchema,
    getContent: getSubjectContent,
    getBreadcrumbs: getSubjectBreadcrumbs,
    getColumns: getSubjectColumns,
    getFormFields: getSubjectFormFields,
    getGuide: getSubjectsGuide,
  });

  const { can } = useAuth();
  const canViewSubjectGroups = can("view_subject_groups");

  // ─── Search + Pagination ─────────────────────────────
  const { filter, handleFilter } = useSearchFilter({
    stream_id: null as string | null,
    ...(canViewSubjectGroups ? { subject_group_id: null as string | null } : {}),
    search: "",
    search_by: "name",
    page: 1,
    perPage: DEFAULT_PAGE_SIZE,
  });

  // ─── Query ───────────────────────────────────────────
  const { data: rawData, isLoading } = useQuery({
    queryKey: SubjectQueryKeys.list(filter),
    queryFn: () => subjectApi.index(filter),
  });
  const { items, meta } = parsePaginatedResponse<SubjectRow>(rawData);

  // ─── Filter Options ──────────────────────────────────
  const { streams } = useCollegeStreams();
  const streamOptions = [
    { value: null, text: CONTENT.filterStreamAll },
    ...streams.map((s) => ({ value: s.value, text: s.text })),
  ];

  const { data: subjectGroupData } = useQuery({
    queryKey: ["subject-group"],
    queryFn: () => SubjectGroupApi.getSubjectGroup(),
    enabled: canViewSubjectGroups,
  });
  const subjectGroups = subjectGroupData?.data || [];
  const subjectGroupOptions = [
    { value: null, text: CONTENT.filterGroupAll },
    ...subjectGroups.map((s: any) => ({
      value: s.id.toString(),
      text: s.name,
    })),
  ];

  // ─── Mutations ───────────────────────────────────────
  const deleteSubjectMutation = useMutation({
    mutationFn: (id: number) => subjectApi.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SubjectQueryKeys.all });
      deleteDisclosure.onClose();
      toast.success("Subject deleted successfully");
    },
  });

  const confirmDelete = () => {
    if (deleteDisclosure?.data?.id) {
      deleteSubjectMutation.mutate(deleteDisclosure.data.id);
    }
  };

  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title={CONTENT.pageTitle} />

      {/* Dialog — SEPARATE component */}
      <SubjectDialog
        open={formDisclosure.isOpen}
        onClose={formDisclosure.onClose}
        data={formDisclosure.data}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title={CONTENT.deleteTitle}
        description={`${CONTENT.deleteDesc}`}
        onConfirm={confirmDelete}
        isLoading={deleteSubjectMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />

      <TooltipProvider>
        <PageContainer maxWidth="full">
          <div className="space-y-6">
            <MainPageHeader
              id="subjects-header"
              icon={Book}
              title={CONTENT.pageTitle}
              subtitle={CONTENT.pageSubtitle}
              breadcrumbs={BREADCRUMBS}
              guidance={CONTENT.guidance}
              tip={CONTENT.tip}
            />

            {/* Action bar — always render the wrapper, gate only the button */}
            <div className="flex justify-end">
              {canCreate && (
                <Button
                  id="new-subject-btn"
                  onClick={() => formDisclosure.onOpen()}
                  className="w-full sm:w-auto"
                >
                  <Plus className="size-4" /> {CONTENT.addBtn}
                </Button>
              )}
            </div>

            {/* Table */}
            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={{
                    filters: [
                      { name: "stream_id", type: "select", label: CONTENT.filterStreamPlaceholder, placeholder: CONTENT.filterStreamPlaceholder, options: streamOptions },
                      ...(canViewSubjectGroups ? [{ name: "subject_group_id", type: "select", label: CONTENT.filterGroupPlaceholder, placeholder: CONTENT.filterGroupPlaceholder, options: subjectGroupOptions }] : []),
                    ],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "name", label: "Name" },
                        { value: "code", label: "Code" },
                      ],
                      placeholder: CONTENT.searchPlaceholder,
                    },
                  }} />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0" id="subjects-table">
                <DataTable
                  columns={COLUMNS}
                  isPaginated={meta.last_page > 1}
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                  pageSize={filter.perPage}
                  totalRecords={meta.total}
                  handlePageChange={(page) => handleFilter({ page })}
                  handlePageSizeChange={(size) =>
                    handleFilter({ perPage: size, page: 1 })
                  }
                >
                  <Each
                    isLoading={isLoading}
                    of={items}
                    nodatafound={
                      <TableEmptyState
                        colSpan={COLUMNS.length}
                        message={CONTENT.emptyTitle}
                        description={CONTENT.emptyDescription}
                      />
                    }
                    fallback={
                      <TableSkeletonLoader columns={COLUMNS.length} />
                    }
                    keyExtractor={(row) => String(row.id)}
                    render={(row, index) => (
                      <TableRow className="hover:bg-muted/50">
                        <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                          {getSerialNumber(
                            meta.current_page,
                            filter.perPage || DEFAULT_PAGE_SIZE,
                            index,
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] uppercase">
                          <span className="truncate block">{row.name}</span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] uppercase">
                          <span className="truncate block">{row.code}</span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] uppercase">
                          <span className="truncate block">
                            {row.stream?.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={row.status ? "active" : "inactive"}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className="truncate block">
                            {row.is_practical ? "Yes" : "No"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {canEdit && (
                              <TooltipWrapper content="Edit">
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => formDisclosure.onOpen(row)}
                                  className="text-muted-foreground hover:text-foreground"
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
                                  onClick={() => deleteDisclosure.onOpen(row)}
                                  disabled={deleteSubjectMutation.isPending}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
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
        </PageContainer>
      </TooltipProvider>
    </>
  );
};

export default Subjects;
