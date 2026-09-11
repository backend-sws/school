import React, { useMemo } from 'react';
import { Head } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feeCollectionApi } from "@/lib/api/feeCollectionApi";
import lmsApi from "@/lib/api/lmsApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    TableRow,
    TableCell,
} from "@/components/ui/table";

import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import {
    AlertCircle,
    IndianRupee,
    Loader2,
    Send,
    ReceiptText,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@inertiajs/react";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { TooltipProvider } from "@/components/ui/tooltip";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import { FilterBar, FilterBarConfig } from "@/components/filter-bar";
import { useFilterRegistry } from "@/hooks/useFilterRegistry";
import { useRegisterGuide } from '@/components/GuideProvider';
import { FEE_DUES_GUIDE } from "@/constants/guides/fees";
import Each from "@/components/Each";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { PermissionGate } from "@/components/PermissionGate";

import {
    DUES_BREADCRUMBS,
    DUES_GUIDANCE,
    DUES_COLUMNS,
    DUES_STATUS_COLOR,
    DUES_STATUS_OPTIONS,
    MONTH_OPTIONS,
    CURRENT_PERIOD,
} from "@/constants/page/admin/duesOverdue";
import useSearchFilter from "@/hooks/useSearchfilter";
import { getSerialNumber } from "@/lib/utils";

export default function DuesOverduePage() {
    const queryClient = useQueryClient();
    useRegisterGuide(FEE_DUES_GUIDE);

    const DEFAULT_FILTER = useMemo(() => ({
        search: "",
        search_by: "name",
        period: "all",
        classId: "all",
        statusFilter: "all",
        dateFilter: "",
        reminderType: "due_soon",
        academicSessionId: "all",
        startDate: "",
        endDate: "",
        page: 1,
        perPage: 10,
    }), []);

    const { filter, handleFilter, buildParams } = useSearchFilter(DEFAULT_FILTER);

    const { data: classesRes } = useQuery({
        queryKey: ["lms-classes-all"],
        queryFn: () => lmsApi.classes.index({
            session_id: "all",
            per_page: 500,
        }),
    });
    const classes =
        Array.isArray((classesRes as any)?.data) ? (classesRes as any).data : Array.isArray(classesRes) ? classesRes : [];

    const { data: duesRes, isLoading } = useQuery({
        queryKey: ["fee-dues", filter],
        queryFn: () => {
            const cleanId = (val: any) => (!val || val === "all" || isNaN(Number(val))) ? undefined : Number(val);
            return feeCollectionApi.getDues({
                search: filter.search || undefined,
                search_by: filter.search_by || "name",
                period: (!filter.period || filter.period === "all") ? "all" : filter.period,
                start_date: filter.startDate || undefined,
                end_date: filter.endDate || undefined,
                academic_session_id: cleanId(filter.academicSessionId),
                lms_class_id: cleanId(filter.classId),
                status: (!filter.statusFilter || filter.statusFilter === "all") ? undefined : filter.statusFilter,
                date: filter.dateFilter || undefined,
                page: filter.page ? Number(filter.page) : 1,
                per_page: filter.perPage ? Number(filter.perPage) : 10,
            });
        },
    });

    const rawData = (duesRes as any)?.data;
    const duesData = rawData?.list || rawData?.stats ? rawData : (rawData?.data ?? duesRes);
    const list = duesData?.list ?? duesData?.data ?? [];
    const dueDate = duesData?.due_date ?? "";

    const sendReminderMutation = useMutation({
        mutationFn: (body: { period: string; type: "due_soon" | "overdue"; student_ids?: number[] }) =>
            feeCollectionApi.sendReminder(body),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["fee-dues"] });
            toast.success(data?.message ?? `Reminders sent: ${data?.data?.sent_count ?? 0}`);
        },
        onError: () => toast.error("Failed to send reminders."),
    });

    const handleBulkReminder = () => {
        sendReminderMutation.mutate({ period: filter.period, type: filter.reminderType as "due_soon" | "overdue" });
    };

    const baseFilterConfig = useFilterRegistry("dues_overdue");
    const filterConfig: FilterBarConfig = useMemo(() => ({
        ...baseFilterConfig,
        filters: [
            ...(baseFilterConfig.filters ?? []).map((f) => {
                if (f.name === "period") return { ...f, options: MONTH_OPTIONS.map((o) => ({ key: o.value, text: o.label, value: o.value })) };
                if (f.name === "classId") return {
                    ...f,
                    options: (currentValues: any) => {
                        const activeSession = currentValues?.academicSessionId || filter.academicSessionId;
                        if (activeSession && activeSession !== "all") {
                            const filtered = (classes as any[]).filter((c: any) => String(c.session_id) === String(activeSession));
                            return [
                                { key: "all", text: "All classes", value: "all" },
                                ...filtered.map((c: any) => ({
                                    key: String(c.id),
                                    text: c.name ?? c.code ?? `Class ${c.id}`,
                                    value: String(c.id),
                                }))
                            ];
                        }
                        return [
                            { key: "all", text: "All classes", value: "all" },
                            ...(classes as any[]).map((c: any) => ({
                                key: String(c.id),
                                text: c.session?.name ? `${c.name ?? c.code ?? `Class ${c.id}`} (${c.session.name})` : (c.name ?? c.code ?? `Class ${c.id}`),
                                value: String(c.id),
                            }))
                        ];
                    }
                };
                if (f.name === "statusFilter") return { ...f, options: DUES_STATUS_OPTIONS.map((o) => ({ key: o.value, text: o.label, value: o.value })) };
                return f;
            }),
            {
                name: "reminderType",
                type: "select",
                label: "Reminder Type",
                placeholder: "Select reminder type",
                options: [
                    { key: "due_soon", text: "Due soon", value: "due_soon" },
                    { key: "overdue", text: "Overdue", value: "overdue" },
                ],
            },
        ],
    }), [baseFilterConfig, classes, filter.academicSessionId]);

    return (
        <>
            <Head title="Dues & overdue - Fee Hub" />
            <TooltipProvider>
                <PageContainer maxWidth="full">
                    <MainPageHeader
                        id="fee-dues-header"
                        breadcrumbs={DUES_BREADCRUMBS}
                        icon={AlertCircle}
                        title="Dues & overdue"
                        subtitle="View fee dues by period and send reminders to guardians and students."
                        guidance={DUES_GUIDANCE}
                    />

                    {/* Analytics Summary Cards */}
                    {/* Analytics Summary Cards */}
                    {(() => {
                        const currentStatus = filter.statusFilter || "all";
                        const handleCardClick = (targetStatus: string) => {
                            if (targetStatus === "all") {
                                handleFilter({ statusFilter: "all", page: 1 });
                            } else {
                                const next = currentStatus === targetStatus ? "all" : targetStatus;
                                handleFilter({ statusFilter: next, page: 1 });
                            }
                        };
                        const isTotalActive = currentStatus === "all";
                        const isPaidActive = currentStatus === "paid";
                        const isOverdueActive = currentStatus === "overdue";

                        return (
                            <div className="grid gap-4 md:grid-cols-4 my-6">
                                {/* 1. Total Expected */}
                                <Card
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleCardClick("all")}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("all"); } }}
                                    className={`relative overflow-hidden border-border/50 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 select-none ${
                                        isTotalActive
                                            ? "ring-2 ring-primary/70 bg-primary/[0.03] dark:bg-primary/[0.06]"
                                            : "bg-white dark:bg-card hover:border-primary/40"
                                    }`}
                                >
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">Total Expected</p>
                                                {isTotalActive && (
                                                    <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-primary border-primary/30">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground tabular-nums flex items-center">
                                                <IndianRupee className="size-4 mr-0.5 text-primary" />
                                                {isLoading ? "..." : Number(duesData?.stats?.total_expected ?? 0).toLocaleString()}
                                            </h3>
                                        </div>
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                                            <ReceiptText className="size-5 text-primary" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 2. Total Paid */}
                                <Card
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleCardClick("paid")}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("paid"); } }}
                                    className={`relative overflow-hidden border-border/50 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 select-none ${
                                        isPaidActive
                                            ? "ring-2 ring-emerald-500/70 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08]"
                                            : "bg-white dark:bg-card hover:border-emerald-500/40"
                                    }`}
                                >
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">Total Paid</p>
                                                {isPaidActive && (
                                                    <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-emerald-600 border-emerald-500/30">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-emerald-600 tabular-nums flex items-center">
                                                <IndianRupee className="size-4 mr-0.5 text-emerald-500" />
                                                {isLoading ? "..." : Number(duesData?.stats?.total_paid ?? 0).toLocaleString()}
                                            </h3>
                                        </div>
                                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                                            <IndianRupee className="size-5 text-emerald-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 3. Outstanding Dues */}
                                <Card
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleCardClick("overdue")}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("overdue"); } }}
                                    className={`relative overflow-hidden border-border/50 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 select-none ${
                                        isOverdueActive
                                            ? "ring-2 ring-rose-500/70 bg-rose-500/[0.04] dark:bg-rose-500/[0.08]"
                                            : "bg-white dark:bg-card hover:border-rose-500/40"
                                    }`}
                                >
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">Outstanding Dues</p>
                                                {isOverdueActive && (
                                                    <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-rose-600 border-rose-500/30">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-rose-600 tabular-nums flex items-center">
                                                <IndianRupee className="size-4 mr-0.5 text-rose-500" />
                                                {isLoading ? "..." : Number(duesData?.stats?.total_balance ?? 0).toLocaleString()}
                                            </h3>
                                        </div>
                                        <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/10">
                                            <AlertCircle className="size-5 text-rose-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 4. Collection Rate */}
                                <Card
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleCardClick("paid")}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("paid"); } }}
                                    className={`relative overflow-hidden border-border/50 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 select-none ${
                                        isPaidActive
                                            ? "ring-2 ring-purple-500/70 bg-purple-500/[0.04] dark:bg-purple-500/[0.08]"
                                            : "bg-white dark:bg-card hover:border-purple-500/40"
                                    }`}
                                >
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">Collection Rate</p>
                                                {isPaidActive && (
                                                    <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-purple-600 border-purple-500/30">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-purple-600 tabular-nums">
                                                {isLoading ? "..." : `${duesData?.stats?.collection_percentage ?? 0}%`}
                                            </h3>
                                        </div>
                                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/10">
                                            <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px] bg-purple-100 text-purple-700 hover:bg-purple-100 font-bold border-purple-200">
                                                Active
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })()}

                    <Card>
                        <CardHeader className="pb-4" id="dues-filter-card">
                            <div className="space-y-3">
                                {/* Row 1: Search + Filters + Reminder actions */}
                                <FilterBar
                                    values={filter}
                                    onChange={(vals) => handleFilter({ ...vals, page: 1 })}
                                    onReset={() => handleFilter(DEFAULT_FILTER)}
                                >
                                    <FilterBar.Renderer config={filterConfig} />
                                    <TooltipWrapper content={`Send ${(filter.reminderType || "due_soon").replace("_", " ")} reminders to all listed students`}>
                                        <Button
                                            id="send-reminders-btn"
                                            variant="outline"
                                            size="icon"
                                            onClick={handleBulkReminder}
                                            disabled={sendReminderMutation.isPending || list.length === 0}
                                            className="size-9 shrink-0 border-dashed hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                                        >
                                            {sendReminderMutation.isPending ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <Send className="size-3.5" />
                                            )}
                                        </Button>
                                    </TooltipWrapper>
                                </FilterBar>

                            </div>
                        </CardHeader>
                        <CardContent className="pt-0" id="dues-table-container">
                            <DataTable
                                columns={DUES_COLUMNS}
                                currentPage={duesData?.meta?.current_page ?? 1}
                                lastPage={duesData?.meta?.last_page ?? 1}
                                pageSize={filter.perPage ?? 50}
                                totalRecords={duesData?.meta?.total ?? 0}
                                handlePageChange={(page) => handleFilter({ page })}
                                handlePageSizeChange={(size) => handleFilter({ perPage: size, page: 1 })}
                            >
                                <Each
                                    of={list}
                                    isLoading={isLoading}
                                    nodatafound={
                                        <TableEmptyState
                                            colSpan={DUES_COLUMNS.length}
                                            message="No dues found"
                                            description="No fee dues match your selected filters and period."
                                        />
                                    }
                                    fallback={<TableSkeletonLoader columns={DUES_COLUMNS.length} />}
                                    keyExtractor={(row: any) => `${row.user_id}-${row.period}`}
                                    render={(row: any, index: number) => (
                                        <TableRow key={`${row.user_id}-${row.period}`} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="text-xs text-muted-foreground tabular-nums font-mono w-[50px]">
                                                {getSerialNumber(index, duesData?.meta?.current_page ?? 1, filter.perPage ?? 50)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-foreground">{row.student_name}</div>
                                                {row.reg_no && (
                                                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{row.reg_no}</div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">{row.class_name ?? "—"}</TableCell>
                                            <TableCell className="text-sm font-mono">{row.due_date ?? "—"}</TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                <span className="flex items-center justify-end">
                                                    <IndianRupee className="size-3 mr-0.5 text-muted-foreground" />
                                                    {Number(row.expected_amount ?? 0).toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                <span className="flex items-center justify-end">
                                                    <IndianRupee className="size-3 mr-0.5 text-muted-foreground" />
                                                    {Number(row.paid_amount ?? 0).toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums font-semibold text-foreground">
                                                <span className="flex items-center justify-end">
                                                    <IndianRupee className="size-3 mr-0.5 text-muted-foreground" />
                                                    {Number(row.balance ?? 0).toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={DUES_STATUS_COLOR[row.status] ?? "bg-muted"}
                                                >
                                                    {row.status.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <TooltipWrapper content={`Send ${(filter.reminderType || "due_soon").replace("_", " ")} reminder`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => sendReminderMutation.mutate({ period: filter.period, type: filter.reminderType as "due_soon" | "overdue", student_ids: [row.user_id] })}
                                                            disabled={sendReminderMutation.isPending}
                                                            className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                                                        >
                                                            <Send className="size-3.5" />
                                                        </Button>
                                                    </TooltipWrapper>
                                                    <PermissionGate can="view_student_ledger">
                                                        <TooltipWrapper content="View student ledger matrix">
                                                            <Button variant="ghost" size="icon" asChild className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground">
                                                                <Link href={`/accounts/fee-hub/students?student=${row.user_id}`}>
                                                                    <ReceiptText className="size-4" />
                                                                </Link>
                                                            </Button>
                                                        </TooltipWrapper>
                                                    </PermissionGate>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </DataTable>
                        </CardContent>
                    </Card>
                </PageContainer>
            </TooltipProvider>
        </>
    );
}
