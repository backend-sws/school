import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Head } from "@inertiajs/react";
import { AlertTriangle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import libraryApi from "@/lib/api/libraryApi";
import { PermissionGate } from "@/components/PermissionGate";
import { LIBRARY_OVERDUE_BREADCRUMBS } from "@/constants/page/admin/library";
import { Button } from "@/components/ui/button";
import { useRegisterGuide } from '@/components/GuideProvider';
import { LIBRARY_OVERDUE_GUIDE } from "@/constants/guides/library";
import React from 'react';

const OVERDUE_TABLE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "book", label: "Book" },
  { key: "borrower", label: "Borrower" },
  { key: "due_at", label: "Due date" },
  { key: "action", label: "Actions" },
];

const LibraryReportsOverdue = () => {
  const queryClient = useQueryClient();
useRegisterGuide(LIBRARY_OVERDUE_GUIDE);
  const { data, isLoading } = useQuery({
    queryKey: ["library-issues-overdue"],
    queryFn: () =>
      libraryApi.issues.index({
        status: "overdue",
        per_page: 50,
      }),
  });

  const returnMutation = useMutation({
    mutationFn: (id: number) => libraryApi.issues.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-issues-overdue"] });
      queryClient.invalidateQueries({ queryKey: ["library-copies"] });
    },
  });

  const rows = (data?.data ?? []) as (Record<string, unknown> & {
    id: number;
    due_at: string;
    copy?: { id: number; book?: { title: string } };
    user?: { id: number; name?: string; email?: string };
  })[];

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        <MainPageHeader
          id="library-overdue-header"
          breadcrumbs={LIBRARY_OVERDUE_BREADCRUMBS}
          icon={AlertTriangle}
          title="Overdue Tracker"
          subtitle="Monitor and follow up on book issues that have exceeded their expected return date."
        />
        <Card>
          <CardHeader>
            <p className="text-sm text-muted-foreground">
              {rows.length} overdue issue(s). Return books to clear from this
              list.
            </p>
          </CardHeader>
          <CardContent className="pt-0" id="overdue-table">
            <DataTable
              columns={OVERDUE_TABLE_COLUMNS}
              currentPage={1}
              lastPage={1}
              pageSize={50}
              totalRecords={rows.length}
              handlePageChange={() => { }}
            >
              <Each
                isLoading={isLoading}
                of={rows}
                nodatafound={
                  <TableEmptyState
                    colSpan={OVERDUE_TABLE_COLUMNS.length}
                    message="No overdue issues"
                    description="All books have been returned on time."
                  />
                }
                fallback={
                  <TableSkeletonLoader columns={OVERDUE_TABLE_COLUMNS.length} />
                }
                render={(row, index) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                      {index + 1}
                    </TableCell>
                    <TableCell>{row.copy?.book?.title ?? "—"}</TableCell>
                    <TableCell>
                      {row.user?.name ??
                        row.user?.email ??
                        `User #${row.user?.id}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.due_at
                        ? new Date(row.due_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataTable>
          </CardContent>
          </Card>
        </div>
      </PageContainer>
  );
};

export default LibraryReportsOverdue;
