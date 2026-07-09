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
import { BookOpen, Pencil, Plus, Trash2, Eye } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import libraryApi from "@/lib/api/libraryApi";
import { PermissionGate } from "@/components/PermissionGate";
import {
  LIBRARY_BOOKS_BREADCRUMBS,
  LIBRARY_BOOKS_GUIDELINES,
  LIBRARY_BOOKS_TABLE_COLUMNS,
  LIBRARY_TIP,
} from "@/constants/page/admin/library";
import { useRegisterGuide } from '@/components/GuideProvider';
import { LIBRARY_BOOKS_GUIDE } from "@/constants/guides/library";
import { ModalDialog } from "@/components/shared/Modal";
import { BookForm } from "./components/BookForm";
import React, { useEffect, useState } from "react";

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "" };

const LibraryBooksIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(LIBRARY_BOOKS_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const deleteDisclosure = useDisclosure<{ id: number; title: string }>();
  const formDisclosure = useDisclosure<{ id?: number; title?: string }>();
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["library-books", filter],
    queryFn: () => libraryApi.books.index(filter),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => libraryApi.books.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-books"] });
      deleteDisclosure.onClose();
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      payload.id
        ? libraryApi.books.update(payload.id, payload.data)
        : libraryApi.books.store(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-books"] });
      formDisclosure.onClose();
      setSelectedBook(null);
    },
  });

  const handleEdit = (book: any) => {
    setSelectedBook({
      title: book.title,
      author: book.author ?? "",
      isbn: book.isbn ?? "",
      edition: book.edition ?? "",
      description: book.description ?? "",
    });
    formDisclosure.onOpen({ id: book.id, title: book.title });
  };

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = (data?.data ?? []) as (Record<string, unknown> & {
    id: number;
    title: string;
    author?: string | null;
    isbn?: string | null;
    copies_count?: number;
  })[];
  const meta = data?.meta as
    | { current_page: number; last_page: number; per_page: number; total: number }
    | undefined;

  return (
    <>
      <Head title="Library Books" />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Book"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.title}"? Remove all copies first.`}
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
        title={formDisclosure.data?.id ? `Edit Book: ${formDisclosure.data.title}` : "Add New Book"}
        className="sm:max-w-2xl"
      >
          <BookForm
            initialData={selectedBook}
            isPending={saveMutation.isPending}
            onSubmit={(data) =>
              saveMutation.mutate({ id: formDisclosure.data?.id, data })
            }
            onCancel={formDisclosure.onClose}
          />
      </ModalDialog>
      <TooltipProvider>
        <PageContainer maxWidth="full">
          <div className="space-y-6">
            <MainPageHeader
              id="library-books-header"
              breadcrumbs={LIBRARY_BOOKS_BREADCRUMBS}
              icon={BookOpen}
              title="Book Catalog"
              subtitle="Manage and organize the institution's library collection and availability."
              guidance={LIBRARY_BOOKS_GUIDELINES}
              tip={LIBRARY_TIP}
            />
            <div className="flex justify-end">
              <PermissionGate can="create_library_books">
                <Button
                  id="new-book-btn"
                  onClick={() => {
                    setSelectedBook(null);
                    formDisclosure.onOpen({});
                  }}
                  className="w-full sm:w-auto"
                >
                  <Plus className="size-4" />
                  <span>Add New Book</span>
                </Button>
              </PermissionGate>
            </div>
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{ filters: [], search: { name: "search", placeholder: "Search by title, author, or ISBN..." } }} />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0" id="books-table">
              <DataTable
                columns={LIBRARY_BOOKS_TABLE_COLUMNS}
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
                      colSpan={LIBRARY_BOOKS_TABLE_COLUMNS.length}
                      message="No books found"
                      description="Add a book to get started."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={LIBRARY_BOOKS_TABLE_COLUMNS.length} />
                  }
                  render={(row, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          meta?.current_page ?? 1,
                          filter.per_page ?? 15,
                          index
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{row.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.author ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.isbn ?? "—"}
                      </TableCell>
                      <TableCell>{row.copies_count ?? 0}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <PermissionGate can="view_library_books">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon-sm" variant="ghost" asChild>
                                  <Link href={`/library/books/${row.id}`}>
                                    <Eye className="size-4" />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
                          <PermissionGate can="update_library_books">
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
                          <PermissionGate can="delete_library_books">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() =>
                                    deleteDisclosure.onOpen({
                                      id: row.id,
                                      title: row.title,
                                    })
                                  }
                                  disabled={(row.copies_count as number) > 0}
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

export default LibraryBooksIndex;
