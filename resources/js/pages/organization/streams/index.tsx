import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Head } from "@inertiajs/react";
import { Eye, GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber, parsePaginatedResponse } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import streamApi from "@/lib/api/streamApi";
import { StreamQueryKeys } from "@/lib/querykey/stream";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StreamDialog } from "@/components/admin/streamDialog";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import { FilterBar } from "@/components/filter-bar";
import { getStreamsGuide } from "@/constants/guides/academic";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { toast } from "sonner";
import { usePageConfig } from "@/hooks/usePageConfig";
import { streamSchema } from "@/lib/validations/stream";
import {
  STREAM_PERMISSIONS,
  STREAM_FORM_FIELDS,
  getStreamContent,
  getStreamBreadcrumbs,
  getStreamColumns,
  getStreamFormFields,
} from "@/constants/stream/formConfig";

// ─── Types ───────────────────────────────────────────────────────────────────

type StreamRow = {
  id: number;
  name: string;
  code: string;
  duration_years: number;
  status: number;
  main_stream_id: number;
  main_stream?: { name: string };
};

const DEFAULT_PAGE_SIZE = 15;

// ─── Component ───────────────────────────────────────────────────────────────

const Streams = () => {
  const queryClient = useQueryClient();
  const streamDisclosure = useDisclosure<StreamRow>();
  const deleteDisclosure = useDisclosure<StreamRow>();

  // ─── Page config (single source of truth) ────────────
  const {
    content: CONTENT,
    breadcrumbs: BREADCRUMBS,
    columns: COLUMNS,
    canCreate,
    canEdit,
    canDelete,
  } = usePageConfig({
    permissions: STREAM_PERMISSIONS,
    formFields: STREAM_FORM_FIELDS,
    schema: streamSchema,
    getContent: getStreamContent,
    getBreadcrumbs: getStreamBreadcrumbs,
    getColumns: getStreamColumns,
    getFormFields: getStreamFormFields,
    getGuide: getStreamsGuide,
  });

  // ─── Search + Pagination ─────────────────────────────
  const { filter, handleFilter } = useSearchFilter({
    main_stream_id: "" as string,
    search: "",
    search_by: "name",
    page: 1,
    perPage: DEFAULT_PAGE_SIZE,
  });

  // ─── Main stream filter options ──────────────────────
  const { mainStreams } = useCollegeMainStreams({ enabled: true });
  const mainStreamOptions = [
    { key: "all", value: "", text: CONTENT.filterAll },
    ...mainStreams,
  ];

  // ─── Query ───────────────────────────────────────────
  const { data: streamsRes, isLoading } = useQuery({
    queryKey: StreamQueryKeys.list({
      page: filter.page,
      perPage: filter.perPage,
      search: filter.search,
      search_by: filter.search_by,
      main_stream_id: filter.main_stream_id,
    }),
    queryFn: () =>
      streamApi.index({
        page: filter.page,
        per_page: filter.perPage,
        search: filter.search || undefined,
        search_by: filter.search_by || undefined,
        main_stream_id: filter.main_stream_id || undefined,
      }),
  });

  const { items: streams, meta } = parsePaginatedResponse<StreamRow>(streamsRes);

  // ─── Mutations ───────────────────────────────────────
  const destroyMutation = useMutation({
    mutationFn: (id: number) => streamApi.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: StreamQueryKeys.all });
      deleteDisclosure.onClose();
      toast.success("Deleted successfully.");
    },
    onError: () => toast.error("Failed to delete."),
  });

  // ─── Helpers ─────────────────────────────────────────
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title={CONTENT.pageTitle} />

      {/* Stream create/edit dialog (separate component) */}
      <StreamDialog
        open={streamDisclosure.isOpen}
        onClose={streamDisclosure.onClose}
        stream={streamDisclosure.data}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={(open) => !open && deleteDisclosure.onClose()}
        title={CONTENT.deleteTitle}
        description={
          deleteDisclosure.data
            ? `${CONTENT.deleteDesc} "${deleteDisclosure.data.name}"`
            : ""
        }
        onConfirm={() =>
          deleteDisclosure.data && destroyMutation.mutate(deleteDisclosure.data.id)
        }
        isLoading={destroyMutation.isPending}
        confirmText="Delete"
        variant="danger"
      />

      <TooltipProvider>
        <PageContainer maxWidth="full">
          <div className="space-y-6">
            <MainPageHeader
              id="streams-header"
              breadcrumbs={BREADCRUMBS}
              icon={GraduationCap}
              title={CONTENT.pageTitle}
              subtitle={CONTENT.pageSubtitle}
              guidance={CONTENT.guidance}
              tip={CONTENT.tip}
            />

            <div className="flex justify-end">
              {canCreate && (
                <Button
                  id="new-stream-btn"
                  onClick={() => streamDisclosure.onOpen()}
                  className="w-full sm:w-auto"
                >
                  <Plus className="size-4" /> {CONTENT.addBtn}
                </Button>
              )}
            </div>

            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={{
                    filters: [
                      { name: "main_stream_id", type: "select", label: CONTENT.filterPlaceholder, placeholder: CONTENT.filterPlaceholder, options: mainStreamOptions },
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

              <CardContent className="pt-0" id="streams-table">
                <DataTable
                  columns={COLUMNS}
                  isPaginated={meta.last_page > 1}
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                  totalRecords={meta.total}
                  pageSize={meta.per_page}
                  handlePageChange={(p) => handleFilter({ page: p })}
                  handlePageSizeChange={(size) =>
                    handleFilter({ perPage: size, page: 1 })
                  }
                >
                  <Each
                    of={streams}
                    isLoading={isLoading}
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
                    keyExtractor={(r: StreamRow) => String(r.id)}
                    render={(row: StreamRow, index: number) => (
                      <TableRow key={row.id} className="hover:bg-muted/50">
                        <TableCell className="text-muted-foreground font-mono text-xs w-12">
                          {getSerialNumber(
                            meta.current_page,
                            meta.per_page,
                            index,
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{row.name}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.code}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.duration_years}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.main_stream?.name ?? "—"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={row.status === 0 ? "Not active" : "Active"}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {canEdit && (
                              <TooltipWrapper content="Edit">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => streamDisclosure.onOpen(row)}
                                >
                                  <Pencil className="size-4" aria-hidden />
                                </Button>
                              </TooltipWrapper>
                            )}
                            {canDelete && (
                              <TooltipWrapper content="Delete">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => deleteDisclosure.onOpen(row)}
                                >
                                  <Trash2 className="size-4" aria-hidden />
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

export default Streams;
