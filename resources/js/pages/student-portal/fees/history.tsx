import React from "react";
import { Head } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import transactionApi, { type Transaction } from "@/lib/api/transactionApi";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { format } from "date-fns";
import { getSerialNumber } from "@/lib/utils";
import Each from "@/components/Each";
import useSearchFilter from "@/hooks/useSearchfilter";
import { FilterBar } from "@/components/filter-bar";

const TRANSACTION_HISTORY_BREADCRUMBS = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "Transaction History", href: "/student-portal/fees/history" },
];

const TRANSACTION_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "txn_id", label: "Transaction ID" },
  { key: "payable", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Success", value: "success" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

const getStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case "success":
    case "paid":
      return "success";
    case "failed":
      return "destructive";
    case "pending":
      return "warning";
    default:
      return "secondary";
  }
};

const getPayableDescription = (transaction: Transaction) => {
  if (transaction.payable_type?.includes("FeeHead") || transaction.payable_type?.includes("FeePayment")) {
    return transaction.payable?.title || "Academic Fee";
  }
  if (transaction.payable_type?.includes("AdmissionApplication")) {
    return `Admission Application (${transaction.payable?.application_id || "N/A"})`;
  }
  return "N/A";
};

const TransactionHistoryPage = () => {
  const { filter, handleFilter } = useSearchFilter({
    page: 1,
    per_page: 15,
    status: "all",
  });

  const { data: transactionsRes, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["studentTransactions", filter.page, filter.per_page, filter.status],
    queryFn: () =>
      transactionApi.getStudentTransactions({
        page: filter.page,
        per_page: filter.per_page,
        ...(filter.status && filter.status !== "all" ? { status: filter.status } : {}),
      }),
  });

  const transactions = transactionsRes?.data ?? [];
  const meta = transactionsRes?.meta;
  const currentPage = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;
  const totalRecords = meta?.total ?? 0;
  const pageSize = meta?.per_page ?? 15;

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title="Transaction History" />
      <div className="p-4 sm:p-6 space-y-6">
        <MainPageHeader
          breadcrumbs={TRANSACTION_HISTORY_BREADCRUMBS}
          icon={History}
          title="Transaction History"
          subtitle="View all your fee and payment transactions."
          guidance="Past payments, refunds, and admission-related transactions appear here."
        />

        <Card>
          <CardHeader className="pb-4">
            <FilterBar values={filter} onChange={handleFilterChange}>
              <FilterBar.Renderer config={{ filters: [{ name: "status", type: "select", label: "Status", options: STATUS_OPTIONS, placeholder: "All" }] }} />
            </FilterBar>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              columns={TRANSACTION_COLUMNS}
              totalRecords={totalRecords}
              currentPage={currentPage}
              lastPage={lastPage}
              pageSize={pageSize}
              handlePageChange={(page) => handleFilter({ page })}
              handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
            >
              <Each
                of={transactions}
                isLoading={isLoadingTransactions}
                nodatafound={
                  <TableEmptyState
                    colSpan={TRANSACTION_COLUMNS.length}
                    message="No transactions"
                    description="You haven't made any fee payments yet."
                  />
                }
                fallback={<TableSkeletonLoader columns={TRANSACTION_COLUMNS.length} />}
                render={(txn, index) => (
                  <TableRow key={txn.id} className="hover:bg-muted/50">
                    <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                      {getSerialNumber(currentPage, pageSize, index)}
                    </TableCell>
                    <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">
                      {txn.transaction_id}
                    </TableCell>
                    <TableCell className="font-medium">{getPayableDescription(txn)}</TableCell>
                    <TableCell className="font-bold">
                      ₹{parseFloat(txn.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(txn.status) as "success" | "destructive" | "warning" | "secondary"}>
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {txn.created_at ? format(new Date(txn.created_at), "dd MMM yyyy, hh:mm a") : 'N/A'}
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TransactionHistoryPage;
