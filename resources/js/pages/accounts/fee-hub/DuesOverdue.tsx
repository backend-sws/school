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

    const { filter, handleFilter, buildParams } = useSearchFilter({
        search: "",
        search_by: "name",
        period: CURRENT_PERIOD,
        classId: "all",
        statusFilter: "all",
        dateFilter: "",
        reminderType: "due_soon",
        academicSessionId: "all",
        startDate: "",
        endDate: "",
        page: 1,
        perPage: 10,
    });


    const { data: classesRes } = useQuery({
        queryKey: ["lms-classes"],
        queryFn: () => lmsApi.classes.index({ per_page: 500 }),
    });
    const classes =
        Array.isArray((classesRes as any)?.data) ? (classesRes as any).data : Array.isArray(classesRes) ? classesRes : [];

    const { data: duesRes, isLoading } = useQuery({
        queryKey: ["fee-dues", filter],
        queryFn: () =>
            feeCollectionApi.getDues({
                search: filter.search || undefined,
                search_by: filter.search_by || "name",
                period: filter.period === "all" ? undefined : filter.period,
                start_date: filter.startDate || undefined,
                end_date: filter.endDate || undefined,
                academic_session_id: filter.academicSessionId === "all" ? undefined : parseInt(filter.academicSessionId, 10),
                lms_class_id: filter.classId === "all" ? undefined : parseInt(filter.classId, 10),
                status: filter.statusFilter === "all" ? undefined : filter.statusFilter,
                date: filter.dateFilter || undefined,
                page: filter.page,
                per_page: filter.perPage,
            }),
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



    const classOptions = useMemo(() => [
        { value: "all", label: "All classes" },
        ...(classes as any[]).map((c: any) => ({
            value: String(c.id),
            label: c.name ?? c.code ?? `Class ${c.id}`
        }))
    ], [classes]);

    const baseFilterConfig = useFilterRegistry("dues_overdue");
    const filterConfig: FilterBarConfig = useMemo(() => ({
        ...baseFilterConfig,
        filters: [
            ...(baseFilterConfig.filters ?? []).map((f) => {
                if (f.name === "period") return { ...f, options: MONTH_OPTIONS.map((o) => ({ key: o.value, text: o.label, value: o.value })) };
                if (f.name === "classId") return { ...f, options: classOptions.map((o) => ({ key: o.value, text: o.label, value: o.value })) };
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
    }), [baseFilterConfig, classOptions]);

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
                    <div className="grid gap-4 md:grid-cols-4 my-6">
                        {/* 1. Total Expected */}
                        {/* 1. Total Expected */}
                        <Card className="relative overflow-hidden bg-white dark:bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">Total Expected</p>
                                    <h3 className="text-xl font-bold text-foreground tabular-nums flex items-center">
                                        <IndianRupee className="size-4 mr-0.5 text-primary" />
                                        {Number(duesData?.stats?.total_expected ?? 0).toLocaleString()}
                                    </h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                                    <ReceiptText className="size-5 text-primary" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Total Paid */}
                        <Card className="relative overflow-hidden bg-white dark:bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">Total Paid</p>
                                    <h3 className="text-xl font-bold text-green-600 tabular-nums flex items-center">
                                        <IndianRupee className="size-4 mr-0.5 text-green-500" />
                                        {Number(duesData?.stats?.total_paid ?? 0).toLocaleString()}
                                    </h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/10">
                                    <IndianRupee className="size-5 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. Outstanding Dues */}
                        <Card className="relative overflow-hidden bg-white dark:bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">Outstanding Dues</p>
                                    <h3 className="text-xl font-bold text-rose-600 tabular-nums flex items-center">
                                        <IndianRupee className="size-4 mr-0.5 text-rose-500" />
                                        {Number(duesData?.stats?.total_balance ?? 0).toLocaleString()}
                                    </h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/10">
                                    <AlertCircle className="size-5 text-rose-600" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. Collection Rate */}
                        <Card className="relative overflow-hidden bg-white dark:bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">Collection Rate</p>
                                    <h3 className="text-xl font-bold text-purple-600 tabular-nums">
                                        {duesData?.stats?.collection_percentage ?? 0}%
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

                    <Card>
                        <CardHeader className="pb-4" id="dues-filter-card">
                            <div className="space-y-3">
                                {/* Row 1: Search + Filters + Reminder actions */}
                                <FilterBar
                                    values={filter}
                                    onChange={(vals) => handleFilter({ ...vals, page: 1 })}
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
