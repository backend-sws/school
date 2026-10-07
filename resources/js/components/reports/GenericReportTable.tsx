import DataTable, { TableEmptyState } from "@/components/dataTable";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import Each from "@/components/Each";

interface Column {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
}

interface PaginationProps {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface GenericReportTableProps {
    columns: Column[];
    data: any[];
    isLoading?: boolean;
    pagination?: PaginationProps;
    onPageChange?: (page: number) => void;
}

export default function GenericReportTable({
    columns = [],
    data = [],
    isLoading = false,
    pagination,
    onPageChange,
}: GenericReportTableProps) {
    const safeColumns = Array.isArray(columns) ? columns : [];
    const safeData = Array.isArray(data) ? data : [];

    if (safeData.length === 0 && !isLoading) {
        return (
            <DataTable columns={safeColumns} isPaginated={false}>
                <TableEmptyState colSpan={Math.max(1, safeColumns.length)} />
            </DataTable>
        );
    }

    // Determine if we should show SL No and TXN ID at the start (Standard for Daily/Transaction reports)
    const hasSlNo = safeColumns.some((c) => c.key === "sl_no");
    const hasTxnId = safeColumns.some((c) => c.key === "transaction_id");

    // Only force-align if these specific operational columns are present
    let normalizedColumns = [...safeColumns];
    if (hasSlNo || hasTxnId) {
        normalizedColumns = [
            ...(hasSlNo ? [{ key: "sl_no", label: "SL No" }] : []),
            ...(hasTxnId ? [{ key: "transaction_id", label: "TXN ID" }] : []),
            ...safeColumns.filter((c) => c.key !== "sl_no" && c.key !== "transaction_id"),
        ];
    }

    // Normalize data: Calculate SL No and format Dates
    const normalizedData = safeData.map((row, index) => {
        const page = pagination?.current_page || 1;
        const perPage = pagination?.per_page || 15;

        return {
            ...row,
            sl_no: ((page - 1) * perPage) + index + 1,
            date: row?.date?.toString().includes("T") ? row.date.toString().split("T")[0] : row?.date,
        };
    });

    return (
        <DataTable
            columns={normalizedColumns}
            isPaginated={Boolean(pagination && (pagination.last_page || 0) > 1)}
            currentPage={pagination?.current_page || 1}
            lastPage={pagination?.last_page || 1}
            totalRecords={pagination?.total || normalizedData.length}
            pageSize={pagination?.per_page || 15}
            handlePageChange={onPageChange}
        >
            <Each
                of={normalizedData}
                render={(row, index) => (
                    <TableRow
                        key={index}
                        className="hover:bg-muted/30 transition-colors border-b last:border-0 border-border/50"
                    >
                        <Each
                            of={normalizedColumns}
                            render={(col) => (
                                <TableCell
                                    key={col.key}
                                    className={
                                        col.align === "right"
                                            ? "text-right"
                                            : col.align === "center"
                                              ? "text-center"
                                              : ""
                                    }
                                >
                                    {row?.[col.key]?.toString() ?? "—"}
                                </TableCell>
                            )}
                        />
                    </TableRow>
                )}
            />
        </DataTable>
    );
}
