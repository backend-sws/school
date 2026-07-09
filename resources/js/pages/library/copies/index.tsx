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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import libraryApi from "@/lib/api/libraryApi";
import { PermissionGate } from "@/components/PermissionGate";
import {
  LIBRARY_COPIES_BREADCRUMBS,
  LIBRARY_COPIES_GUIDELINES,
  LIBRARY_COPIES_TABLE_COLUMNS,
} from "@/constants/page/admin/library";
import { useRegisterGuide } from '@/components/GuideProvider';
import { LIBRARY_COPIES_GUIDE } from "@/constants/guides/library";
import { ModalDialog } from "@/components/shared/Modal";
import { CopyForm } from "./components/CopyForm";
import React, { useEffect, useState } from "react";

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  search: "",
  library_book_id: "",
  is_available: "",
};

const LibraryCopiesIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(LIBRARY_COPIES_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const deleteDisclosure = useDisclosure<{ id: number; barcode?: string }>();
  const formDisclosure = useDisclosure<{ id?: number; title?: string }>();
  const [selectedCopy, setSelectedCopy] = useState<any>(null);

  const { data: booksData } = useQuery({
    queryKey: ["library-books-list"],
    queryFn: () => libraryApi.books.index({ per_page: 200 }),
  });
  const books = (booksData?.data ?? []) as { id: number; title: string }[];

  const { data, isLoading } = useQuery({
    queryKey: ["library-copies", filter],
    queryFn: () =>
      libraryApi.copies.index({
        ...filter,
        library_book_id: filter.library_book_id || undefined,
        is_available:
          filter.is_available === "" ? undefined : filter.is_available,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => libraryApi.copies.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-copies"] });
      deleteDisclosure.onClose();
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      payload.id
        ? libraryApi.copies.update(payload.id, payload.data)
        : libraryApi.copies.store(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-copies"] });
      formDisclosure.onClose();
      setSelectedCopy(null);
    },
  });

  const handleEdit = (copy: any) => {
    setSelectedCopy({
      library_book_id: String(copy.book?.id || ""),
      barcode: copy.barcode ?? "",
      shelf_location: copy.shelf_location ?? "",
      condition: copy.condition ?? "",
    });
    formDisclosure.onOpen({
      id: copy.id,
      title: copy.barcode ? `Copy ${copy.barcode}` : "Physical Copy",
    });
  };

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = (data?.data ?? []) as (Record<string, unknown> & {
    id: number;
    barcode?: string | null;
    shelf_location?: string | null;
    is_available: boolean;
    book?: { id: number; title: string };
  })[];
  const meta = data?.meta as
    | { current_page: number; last_page: number; per_page: number; total: number }
    | undefined;

  return (
    <>
      <Head title="Library Copies" />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Copy"
        description="Are you sure you want to delete this copy? Return it first if currently issued."
        onConfirm={() =>
          deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)
        }
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />

      <ModalDialog
        open={formDisclosure.isOpen}
        onClose={formDisclosure.onClose}
        title={formDisclosure.data?.id ? `Edit ${formDisclosure.data.title}` : "Add New Copy"}
        className="sm:max-w-2xl"
      >
          <CopyForm
            initialData={selectedCopy}
            isEdit={!!formDisclosure.data?.id}
            isPending={saveMutation.isPending}
            onSubmit={(data) =>
              saveMutation.mutate({
                id: formDisclosure.data?.id,
                data: {
                  ...data,
                  library_book_id: Number(data.library_book_id),
                },
              })
            }
            onCancel={formDisclosure.onClose}
          />
      </ModalDialog>
      <TooltipProvider>
        <PageContainer maxWidth="full">
          <div className="space-y-6">
            <MainPageHeader
              id="library-copies-header"
              breadcrumbs={LIBRARY_COPIES_BREADCRUMBS}
              icon={Copy}
              title="Physical Copies"
              subtitle="Track and manage individual book copies, their current shelf locations, and availability status."
              guidance={LIBRARY_COPIES_GUIDELINES}
            />
            <div className="flex justify-end">
              <PermissionGate can="create_library_copies">
                <Button
                  id="new-copy-btn"
                  onClick={() => {
                    setSelectedCopy(null);
                    formDisclosure.onOpen({});
                  }}
                  className="w-full sm:w-auto"
                >
                  <Plus className="size-4" />
                  <span>Add New Copy</span>
                </Button>
              </PermissionGate>
            </div>
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{ search: { name: "search", placeholder: "Search by barcode or book title..." }, filters: [{ name: "library_book_id", type: "select", label: "Book", placeholder: "All books", options: [{ value: "", label: "All books" }, ...books.map((b) => ({ value: String(b.id), label: b.title }))] }, { name: "is_available", type: "select", label: "Status", placeholder: "All", options: [{ value: "", label: "All" }, { value: "true", label: "Available" }, { value: "false", label: "Issued" }] }] }} />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0" id="copies-table">
              <DataTable
                columns={LIBRARY_COPIES_TABLE_COLUMNS}
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
                      colSpan={LIBRARY_COPIES_TABLE_COLUMNS.length}
                      message="No copies found"
                      description="Add a copy from a book or from the Books page."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={LIBRARY_COPIES_TABLE_COLUMNS.length} />
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
                        <Link
                          href={`/library/books/${row.book?.id}`}
                          className="text-primary hover:underline"
                        >
                          {row.book?.title ?? "—"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.barcode ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.shelf_location ?? "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            row.is_available
                              ? "text-green-600"
                              : "text-amber-600"
                          }
                        >
                          {row.is_available ? "Available" : "Issued"}
                        </span>
                      </TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <PermissionGate can="update_library_copies">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(row)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
                          <PermissionGate can="delete_library_copies">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() =>
                                    deleteDisclosure.onOpen({
                                      id: row.id,
                                      barcode: row.barcode ?? undefined,
                                    })
                                  }
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
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

export default LibraryCopiesIndex;
