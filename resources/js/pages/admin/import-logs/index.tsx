import DataTable, {
    TableEmptyState,
    TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { TableCell, TableRow } from "@/components/ui/table";
import {
    IMPORT_LOG_BREADCRUMBS,
    IMPORT_LOG_COLUMNS,
    INITIAL_IMPORT_LOG_FILTERS,
} from "@/constants/page/admin/importLog";
import { useDisclosure } from "@/hooks/useDisclosure";
import useSearchFilter from "@/hooks/useSearchfilter";
import BulkImportApi, { ImportLogEntry } from "@/lib/api/bulkImportApi";
import { getSerialNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Head } from "@inertiajs/react";
import {
    History,
    CheckCircle2,
    XCircle,
    Loader2,
    Eye,
    Clock,
    User,
    FileText,
    AlertCircle,
    Database,
} from "lucide-react";
import { FilterBar } from "@/components/filter-bar";
import { useRegisterGuide } from '@/components/GuideProvider';
import { IMPORT_LOGS_GUIDE } from "@/constants/guides/analytics";
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { BULK_IMPORT_CONTENT } from '@/constants/content/bulkImport';

const statusConfig: Record<
    string,
    { label: string; icon: any; color: string; bg: string }
> = {
    completed: {
        label: BULK_IMPORT_CONTENT.status.completed,
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    processing: {
        label: BULK_IMPORT_CONTENT.status.processing,
        icon: Loader2,
        color: "text-blue-600",
        bg: "bg-blue-50 text-blue-700 border-blue-100",
    },
    failed: {
        label: BULK_IMPORT_CONTENT.status.failed,
        icon: XCircle,
        color: "text-rose-600",
        bg: "bg-rose-50 text-rose-700 border-rose-100",
    },
};

const ImportLogsPage = () => {
useRegisterGuide(IMPORT_LOGS_GUIDE);
    const errorDisclosure = useDisclosure<ImportLogEntry>();
    const { filter, handleFilter } = useSearchFilter(INITIAL_IMPORT_LOG_FILTERS);

    const { data: logsData, isLoading } = useQuery({
        queryKey: ["import-history", filter],
        queryFn: () => BulkImportApi.getHistory(filter),
        refetchInterval: (query) => {
            const processing = query.state.data?.data?.some(log => log.status === 'processing');
            return processing ? 5000 : false;
        }
    });

    const logs = logsData?.data ?? [];
    const meta = logsData?.meta;

    const handleFilterChange = (updates: Record<string, unknown>) => {
        handleFilter({ ...updates, page: 1 });
    };

    // Track processing logs to show toast on completion
    const prevLogsRef = useRef<ImportLogEntry[]>([]);

    useEffect(() => {
        const currentLogs = logs;
        const prevLogs = prevLogsRef.current;

        if (prevLogs.length > 0) {
            currentLogs.forEach(log => {
                const prevLog = prevLogs.find(p => p.id === log.id);
                if (prevLog && prevLog.status === 'processing' && log.status === 'completed') {
                    toast.success(BULK_IMPORT_CONTENT.toast.import_completed(log.module, log.imported_rows));
                } else if (prevLog && prevLog.status === 'processing' && log.status === 'failed') {
                    toast.error(BULK_IMPORT_CONTENT.toast.import_failed(log.module));
                }
            });
        }

        prevLogsRef.current = currentLogs;
    }, [logs]);

    return (
        <>
            <Head title="Import Logs" />

            <Sheet
                open={errorDisclosure.isOpen}
                onOpenChange={errorDisclosure.onClose}
            >
                <SheetContent className="sm:max-w-xl p-0 flex flex-col h-full">
                    <SheetHeader className="px-6 py-5 border-b bg-muted/20">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="size-8 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                                <AlertCircle className="size-4 text-rose-600" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-600/80">Import Failure audit</span>
                        </div>
                        <SheetTitle className="text-left text-xl font-bold tracking-tight">
                            Error Details
                        </SheetTitle>
                    </SheetHeader>

                    {errorDisclosure.data && (
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                            {/* Summary Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Database className="size-3.5 text-muted-foreground" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Module</span>
                                    </div>
                                    <div className="font-bold text-sm capitalize">{errorDisclosure.data.module}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="size-3.5 text-muted-foreground" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Source File</span>
                                    </div>
                                    <div className="font-medium text-xs truncate text-muted-foreground" title={errorDisclosure.data.file_name}>
                                        {errorDisclosure.data.file_name}
                                    </div>
                                </div>
                            </div>

                            {/* Error Statistics */}
                            <div className="flex items-center gap-4 py-2 px-1">
                                <div className="flex-1 h-[1px] bg-border/50" />
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold uppercase">
                                    <XCircle className="size-3.5" />
                                    {errorDisclosure.data.error_rows} Issues Found
                                </div>
                                <div className="flex-1 h-[1px] bg-border/50" />
                            </div>

                            {/* Error List */}
                            <div className="space-y-3">
                                {errorDisclosure.data.errors && errorDisclosure.data.errors.length > 0 ? (
                                    <div className="grid gap-2.5">
                                        <Each
                                            of={errorDisclosure.data.errors}
                                            keyExtractor={(error, idx) => `error-${idx}`}
                                            render={(error, idx) => (
                                            <div key={idx} className="group relative p-4 rounded-lg bg-white border border-border/40 shadow-sm hover:border-rose-200 transition-all">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-400 rounded-l-lg" />
                                                <p className="text-sm font-mono leading-relaxed text-slate-700 break-words">
                                                    {error}
                                                </p>
                                            </div>
                                        )}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl border-2 border-dashed border-muted bg-muted/10">
                                        <CheckCircle2 className="size-10 text-emerald-500 mb-3 opacity-50" />
                                        <p className="text-sm text-center text-muted-foreground font-medium max-w-[200px]">
                                            No detailed error logs available for this entry.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="p-4 border-t bg-muted/5 flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => errorDisclosure.onClose()}>
                            Close Audit
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            <div className="space-y-6">
                <MainPageHeader
                    id="import-logs-header"
                    breadcrumbs={IMPORT_LOG_BREADCRUMBS}
                    icon={History}
                    title="Import Logs"
                    subtitle="Track and audit all bulk data import activities across the institution."
                />

                <Card>
                    <CardHeader className="pb-4">
                        <FilterBar values={filter} onChange={handleFilterChange}>
                            <FilterBar.Renderer config={{ search: { name: "module", placeholder: "Filter by module..." }, filters: [{ name: "status", type: "select", label: "Status", placeholder: "Status", options: [{ label: "Completed", value: "completed" }, { label: "Processing", value: "processing" }, { label: "Failed", value: "failed" }] }] }} />
                        </FilterBar>
                    </CardHeader>
                    <CardContent className="pt-0" id="import-logs-table">
                        <DataTable
                            columns={IMPORT_LOG_COLUMNS}
                            currentPage={meta?.current_page ?? 1}
                            lastPage={meta?.last_page ?? 1}
                            pageSize={filter.per_page}
                            totalRecords={meta?.total ?? 0}
                            handlePageChange={(page) => handleFilter({ page })}
                            handlePageSizeChange={(size) =>
                                handleFilter({ per_page: size, page: 1 })
                            }
                        >
                            <Each
                                isLoading={isLoading}
                                of={logs}
                                nodatafound={
                                    <TableEmptyState
                                        colSpan={IMPORT_LOG_COLUMNS.length}
                                        message="No import logs found"
                                        description="Historical data from your bulk imports will appear here."
                                    />
                                }
                                fallback={
                                    <TableSkeletonLoader columns={IMPORT_LOG_COLUMNS.length} />
                                }
                                render={(log: ImportLogEntry, index: number) => {
                                    const status = statusConfig[log.status] || {
                                        label: log.status,
                                        icon: Loader2,
                                        bg: "bg-gray-50 text-gray-700",
                                    };
                                    const StatusIcon = status.icon;

                                    return (
                                        <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                                                {getSerialNumber(
                                                    meta?.current_page ?? 1,
                                                    filter.per_page ?? 25,
                                                    index
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground capitalize tracking-tight">
                                                        {log.module}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1 mt-0.5" title={log.file_name}>
                                                        <FileText className="size-2.5" />
                                                        {log.file_name.length > 25 ? log.file_name.substring(0, 22) + "..." : log.file_name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold text-emerald-600">{log.imported_rows}</span>
                                                        <span className="text-[9px] uppercase tracking-tighter text-muted-foreground font-medium">Success</span>
                                                    </div>
                                                    <div className="w-[1px] h-6 bg-border/60" />
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold text-amber-600">{log.skipped_rows}</span>
                                                        <span className="text-[9px] uppercase tracking-tighter text-muted-foreground font-medium">Skipped</span>
                                                    </div>
                                                    <div className="w-[1px] h-6 bg-border/60" />
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold text-rose-600">{log.error_rows}</span>
                                                        <span className="text-[9px] uppercase tracking-tighter text-muted-foreground font-medium">Errors</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1.5 min-w-[120px]">
                                                    <Badge
                                                        variant="outline"
                                                        className={`gap-1.5 px-2.5 py-0.5 font-medium border shadow-none w-fit ${status.bg}`}
                                                    >
                                                        <StatusIcon className={`size-3 ${log.status === 'processing' ? 'animate-spin' : ''}`} />
                                                        {status.label}
                                                    </Badge>
                                                    {log.status === 'processing' && (
                                                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                                            <div 
                                                                className="bg-blue-600 h-full transition-all duration-500 ease-in-out" 
                                                                style={{ width: `${log.progress}%` }} 
                                                            />
                                                        </div>
                                                    )}
                                                    {log.status === 'processing' && (
                                                        <span className="text-[10px] text-muted-foreground font-medium flex justify-between">
                                                            <span>System is importing...</span>
                                                            <span>{log.progress}%</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="size-7 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                                                        <User className="size-3.5 text-primary" />
                                                    </div>
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {log.uploader?.name || "System"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-right sm:text-left">
                                                    <div className="text-sm font-medium text-foreground flex items-center gap-1.5 justify-end sm:justify-start">
                                                        <Clock className="size-3 text-muted-foreground" />
                                                        {new Date(log.created_at).toLocaleDateString(undefined, {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground/70 ml-4.5">
                                                        {new Date(log.created_at).toLocaleTimeString(undefined, {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="w-16">
                                                {log.error_rows > 0 && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => errorDisclosure.onOpen(log)}
                                                        className="size-8 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                        title="View Errors"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }}
                            />
                        </DataTable>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ImportLogsPage;
