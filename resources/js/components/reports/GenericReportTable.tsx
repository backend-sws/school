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
    columns,
    data,
    isLoading = false,
    pagination,
    onPageChange,
}: GenericReportTableProps) {
    if (data.length === 0 && !isLoading) {
        return (
            <DataTable columns={columns} isPaginated={false}>
                <TableEmptyState colSpan={columns.length} />
            </DataTable>
        );
    }

    // Determine if we should show SL No and TXN ID at the start (Standard for Daily/Transaction reports)
    const hasSlNo = columns.some(c => c.key === 'sl_no');
    const hasTxnId = columns.some(c => c.key === 'transaction_id');

    // Only force-align if these specific operational columns are present
    let normalizedColumns = [...columns];
    if (hasSlNo || hasTxnId) {
        normalizedColumns = [
            ...(hasSlNo ? [{ key: 'sl_no', label: 'SL No' }] : []),
            ...(hasTxnId ? [{ key: 'transaction_id', label: 'TXN ID' }] : []),
            ...columns.filter(c => c.key !== 'sl_no' && c.key !== 'transaction_id')
        ];
    }

    // Normalize data: Calculate SL No and format Dates
    const normalizedData = data.map((row, index) => {
        const page = pagination?.current_page || 1;
        const perPage = pagination?.per_page || 15;

        return {
            ...row,
            sl_no: ((page - 1) * perPage) + index + 1,
            date: row.date?.toString().includes('T') ? row.date.toString().split('T')[0] : row.date,
        };
    });

    return (
        <DataTable
            columns={normalizedColumns}
            isPaginated={!!pagination}
            currentPage={pagination?.current_page}
            lastPage={pagination?.last_page}
            totalRecords={pagination?.total}
            pageSize={pagination?.per_page}
            handlePageChange={onPageChange}
        >
            <Each
                of={normalizedData}
                render={(row, index) => (
                    <TableRow key={index} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-border/50">
                        <Each
                            of={normalizedColumns}
                            render={(col) => (
                                <TableCell
                                    key={col.key}
                                    className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
                                >
                                    {row[col.key]?.toString() ?? "—"}
                                </TableCell>
                            )}
                        />
                    </TableRow>
                )}
            />
        </DataTable>
    );
}
