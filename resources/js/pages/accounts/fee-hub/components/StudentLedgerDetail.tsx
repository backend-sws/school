import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstitutionLabels } from "@/constants/scopeTypeDisplay";
import api from "@/lib/api/api";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CreditCard, AlertCircle, Mail, Bell, Link2, Download, CheckCircle2, Check, Receipt, Send, Loader2, CalendarRange
} from "lucide-react";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";
import PaymentCollectModal from "@/pages/accounts/fee-hub/components/PaymentCollectModal";
import AdvancePaymentModal from "@/pages/accounts/fee-hub/components/AdvancePaymentModal";


import {
    LEDGER_HERO_PILLS,
    LEDGER_HERO_ACTIONS,
    ADMISSION_METRICS,
    MATRIX_STATIC_COLUMNS,
    MATRIX_ADMISSION_COLUMNS,
    MATRIX_SUMMARY_COLUMNS,
    ONE_TIME_COLUMNS,
    getContextCards,
    resolveValue,
    formatCurrency,
    type HeroPillConfig,
    type ContextCardConfig,
    type AdmissionMetricConfig,
    type HeroActionConfig,
} from "@/constants/accounts/ledgerDetailConfig";

// ─── Sub-Components ──────────────────────────────────────────────────────────

/** Config-driven hero info pill */
function HeroPill({ config, student }: { config: HeroPillConfig; student: any }) {
    const value = resolveValue(student, config.valuePath, config.fallbackPaths);
    if (config.conditional && !value) return null;
    const Icon = config.icon;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm",
            config.variant === "primary"
                ? "bg-primary/5 border border-primary/20 text-primary"
                : "bg-background border"
        )}>
            {Icon && <Icon className="size-3.5" />}
            {config.label && (
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{config.label}</span>
            )}
            <span className={cn("text-xs font-bold", !config.icon && "font-mono")}>{value || "N/A"}</span>
        </div>
    );
}

/** Config-driven context card */
function ContextCard({ config, student, classInfo }: { config: ContextCardConfig; student: any; classInfo: any }) {
    // Merge classInfo into student for unified path resolution
    const merged = { ...student, __classInfo: classInfo };
    const value = resolveValue(merged, config.valuePath, config.fallbackPaths);
    const sectionSuffix = classInfo?.section ? ` • ${classInfo.section}` : "";
    const displayValue = config.key === "class" ? `${value || "N/A"}${sectionSuffix}` : (value || "N/A");
    const Icon = config.icon;

    return (
        <Card className="rounded-2xl border shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                    <Icon className="size-5 text-muted-foreground" />
                </div>
                <div className={cn("min-w-0", config.format === "truncate" && "overflow-hidden")}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{config.label}</p>
                    <p className={cn(
                        "font-bold text-foreground",
                        config.format === "truncate" && "truncate",
                        config.format === "mono" && "font-mono"
                    )}>
                        {displayValue}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

/** Config-driven admission metric cell */
function AdmissionMetric({ config, data }: { config: AdmissionMetricConfig; data: any }) {
    const value = Number(data?.[config.field] ?? 0);
    const isDueField = config.key === "due";
    const colorClass = isDueField ? (value > 0 ? "text-rose-600" : "text-emerald-600") : config.colorClass;

    return (
        <div className="p-4 space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{config.label}</p>
            <p className={cn("text-lg font-black tabular-nums", colorClass)}>
                {config.prefix || ""}₹{value.toLocaleString()}
            </p>
        </div>
    );
}

// ─── Row Action Buttons ──────────────────────────────────────────────────────

interface RowActionHandlers {
    resendReceipt: (paymentId: number, via: "email" | "push") => void;
    downloadReceipt: (paymentId: number) => void;
    copyLink: (studentId: number) => void;
    sendReminder: (period: string, type: "due_soon" | "overdue", via?: "email" | "push") => void;
}

function PaidRowActions({ row, handlers }: { row: any; handlers: RowActionHandlers }) {
    const actions = [
        { key: "email", icon: Mail, tooltip: "Email Receipt", color: "hover:bg-blue-50 text-blue-600", onClick: () => handlers.resendReceipt(row.payment_id, "email") },
        { key: "push", icon: Bell, tooltip: "Push Receipt", color: "hover:bg-purple-50 text-purple-600", onClick: () => handlers.resendReceipt(row.payment_id, "push") },
        { key: "download", icon: Download, tooltip: "Download PDF", color: "hover:bg-amber-50 text-amber-600", onClick: () => handlers.downloadReceipt(row.payment_id) },
        { key: "link", icon: Link2, tooltip: "Copy Receipt Link", color: "hover:bg-slate-100 text-slate-600", onClick: () => handlers.copyLink(row.payment_id) },
    ];
    return (
        <Each
            of={actions}
            keyExtractor={(a) => a.key}
            render={(action) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className={cn("size-7 rounded-lg", action.color)} onClick={action.onClick}>
                            <action.icon className="size-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{action.tooltip}</TooltipContent>
                </Tooltip>
            )}
        />
    );
}

function UnpaidRowActions({ row, handlers, isPending }: { row: any; handlers: RowActionHandlers; isPending: boolean }) {
    const isOverdue = row.due_date && new Date(row.due_date) < new Date();
    const type = isOverdue ? "overdue" as const : "due_soon" as const;
    const channels = [
        { key: "email", icon: Mail, tooltip: `Send ${type.replace("_", " ")} reminder via email`, color: "hover:bg-blue-50 text-blue-500" },
        { key: "push", icon: Bell, tooltip: `Send ${type.replace("_", " ")} reminder via push`, color: "hover:bg-purple-50 text-purple-500" },
    ];
    return (
        <div className="flex items-center gap-1">
            <Each
                of={channels}
                keyExtractor={(c) => c.key}
                render={(channel) => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("size-7 rounded-lg", channel.color)}
                                onClick={() => handlers.sendReminder(row.month_key, type, channel.key as "email" | "push")}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <channel.icon className="size-3.5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{channel.tooltip}</TooltipContent>
                    </Tooltip>
                )}
            />
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface StudentLedgerDetailProps {
    studentId?: number;
    onBack?: () => void;
    onLoaded?: (name: string) => void;
    isStudentPortal?: boolean;
}

export default function StudentLedgerDetail({ studentId, onBack, onLoaded, isStudentPortal }: StudentLedgerDetailProps) {
    const scopeType = (usePage().props as { institution?: { type?: string } }).institution?.type ?? null;
    const labels = getInstitutionLabels(scopeType);
    const queryClient = useQueryClient();
    const [selectedMonth, setSelectedMonth] = useState<any>(null);
    const [showAdvance, setShowAdvance] = useState(false);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);

    // ─── Data Fetching ───────────────────────────────────────────────────────
    const { data: ledgerRes, isLoading, isError } = useQuery({
        queryKey: ["student-ledger-matrix", studentId, selectedSession, isStudentPortal],
        queryFn: () => api.get(isStudentPortal ? `/student/financial-ledger` : `/fees/ledger/student/${studentId}`, { params: { session_id: selectedSession === "current" ? null : selectedSession } }),
    });

    // ─── Mutations ───────────────────────────────────────────────────────────
    const resendReceiptMutation = useMutation({
        mutationFn: (vars: { paymentId: number; via: "email" | "push" }) =>
            api.post("/fees/ledger/resend-receipt", { payment_id: vars.paymentId, via: vars.via }),
        onSuccess: (_, vars) => toast.success(`Receipt sent via ${vars.via === "email" ? "email" : "push notification"}`),
        onError: () => toast.error("Failed to resend receipt"),
    });

    const markAsPaidMutation = useMutation({
        mutationFn: (monthKey: string) =>
            api.post("/fees/ledger/mark-as-paid", { user_id: studentId, for_month: monthKey }),
        onSuccess: () => {
            toast.success("Marked as paid successfully");
            queryClient.invalidateQueries({ queryKey: ["student-ledger-matrix", studentId] });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Failed to mark as paid"),
    });

    const sendReminderMutation = useMutation({
        mutationFn: (vars: { period: string; type: "due_soon" | "overdue"; via?: "email" | "push" }) =>
            api.post("/fees/dues/send-reminder", { period: vars.period, type: vars.type, student_ids: [studentId] }),
        onSuccess: () => toast.success("Reminder sent via all configured channels"),
        onError: () => toast.error("Failed to send reminder"),
    });



    // ─── Derived Data ────────────────────────────────────────────────────────
    const data = (ledgerRes as any)?.data || null;
    const student = data?.student || {};
    const matrix = data?.matrix || [];
    const classInfo = data?.class || {};
    const admissionSummary = data?.admission_summary || null;
    const oneTimeCharges = data?.one_time_charges || [];
    const availableSessions = data?.available_sessions || [];
    const contextCards = getContextCards(labels);

    const allParticulars = (() => {
        const names = Array.from(
            new Set(matrix.flatMap((row: any) => (row.expected_particulars || []).map((p: any) => p.name).filter(Boolean)))
        ) as string[];
        return names.length > 0 ? names : ["Fees"];
    })();

    const visibleMetrics = admissionSummary
        ? ADMISSION_METRICS.filter(m => !m.conditionalOnPositive || Number(admissionSummary?.[m.field] ?? 0) > 0)
        : [];
    const admissionFeeColumns = MATRIX_ADMISSION_COLUMNS;

    useEffect(() => {
        if (student.name && onLoaded) onLoaded(student.name);
    }, [student.name, onLoaded]);

    // ─── Action Handlers (via map) ───────────────────────────────────────────
    const heroActionHandlers: Record<string, () => void> = {
        remind: () => {
            const currentPeriod = matrix?.[0]?.month_key ?? new Date().toISOString().slice(0, 7);
            sendReminderMutation.mutate({ period: currentPeriod, type: "due_soon" });
        },
        print: () => window.print(),
        export: () => toast.info("Export coming soon"),
    };

    const rowActionHandlers: RowActionHandlers = {
        resendReceipt: (paymentId, via) => resendReceiptMutation.mutate({ paymentId, via }),
        downloadReceipt: (paymentId) => window.open(`/api/v1/fees/ledger/download-receipt/${paymentId}`, "_blank"),
        copyLink: () => {
            const url = `${window.location.origin}/accounts/fee-hub/students?student=${studentId}`;
            navigator.clipboard.writeText(url);
            toast.success("Link copied");
        },
        sendReminder: (period, type, via) => sendReminderMutation.mutate({ period, type, via }),
    };

    // ─── Loading & Error States ──────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
                <div className="size-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Compiling Digital Ledger...</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="py-32 text-center space-y-4">
                <AlertCircle className="size-12 text-destructive mx-auto opacity-20" />
                <div className="space-y-1">
                    <h4 className="text-lg font-black text-destructive">Ledger Error</h4>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Failed to retrieve historical matrix.</p>
                </div>
                <Button onClick={onBack} variant="outline" className="rounded-xl">Go Back</Button>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                {/* ─── Hero Card ───────────────────────────────────────────── */}
                <Card className="border-primary/20 bg-gradient-to-br from-card to-muted/20 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="max-w-[1400px] mx-auto flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-6">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20 text-3xl font-black text-primary shadow-inner">
                                    {student.name?.charAt(0)}
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <h1 className="text-3xl font-black tracking-tight text-foreground leading-none">{student.name}</h1>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2 opacity-70">Student Financial Ledger</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Each
                                            of={LEDGER_HERO_PILLS}
                                            keyExtractor={(p) => p.key}
                                            render={(pill) => <HeroPill config={pill} student={student} />}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {availableSessions.length > 0 && (
                                    <Select value={selectedSession || "current"} onValueChange={(val) => setSelectedSession(val === "current" ? null : val)}>
                                        <SelectTrigger className="w-[180px] h-12 rounded-xl bg-background border-input shadow-sm">
                                            <SelectValue placeholder="Select Session" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="current">Current Session</SelectItem>
                                            {availableSessions.map((s: any) => (
                                                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {!isStudentPortal && (
                                    <Each
                                        of={LEDGER_HERO_ACTIONS}
                                        keyExtractor={(a) => a.key}
                                        render={(action) => (
                                            <Button
                                                variant={action.variant}
                                                className="rounded-xl gap-2 font-bold h-12 border-input bg-background hover:bg-muted shadow-sm px-6"
                                                onClick={heroActionHandlers[action.key]}
                                                disabled={action.key === "remind" && sendReminderMutation.isPending}
                                            >
                                                {action.key === "remind" && sendReminderMutation.isPending
                                                    ? <Loader2 className="size-4 animate-spin" />
                                                    : <action.icon className="size-4 text-primary" />
                                                }
                                                {action.label}
                                            </Button>
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ─── Context Cards ───────────────────────────────────────── */}
                <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Each
                        of={contextCards}
                        keyExtractor={(c) => c.key}
                        render={(card) => <ContextCard config={card} student={student} classInfo={classInfo} />}
                    />
                </div>

                {/* ─── Admission Fee Summary ───────────────────────────────── */}
                {admissionSummary && (
                    <div className="max-w-[1400px] mx-auto w-full space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <Receipt className="size-4 text-muted-foreground" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admission Fee Summary</h3>
                            {admissionSummary.payment_status && (
                                <Badge
                                    variant={admissionSummary.payment_status === "success" ? "default" : "secondary"}
                                    className={cn(
                                        "text-[9px] font-bold uppercase tracking-wider",
                                        admissionSummary.payment_status === "success"
                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    )}
                                >
                                    {admissionSummary.payment_status === "success" ? "Paid" : "Pending"}
                                </Badge>
                            )}
                        </div>
                        <Card className="rounded-xl border shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                <div className={cn(
                                    "grid grid-cols-2 sm:grid-cols-3 divide-x divide-border",
                                    { "lg:grid-cols-3": visibleMetrics.length <= 3, "lg:grid-cols-4": visibleMetrics.length === 4, "lg:grid-cols-5": visibleMetrics.length === 5, "lg:grid-cols-6": visibleMetrics.length >= 6 }
                                )}>
                                    <Each
                                        of={visibleMetrics}
                                        keyExtractor={(m) => m.key}
                                        render={(metric) => <AdmissionMetric config={metric} data={admissionSummary} />}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* ─── One-Time Charges ────────────────────────────────────── */}
                {oneTimeCharges.length > 0 && (
                    <div className="max-w-[1400px] mx-auto w-full space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <CreditCard className="size-4 text-muted-foreground" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">One-Time Charges</h3>
                        </div>
                        <Card className="rounded-xl border shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-muted hover:bg-muted border-none">
                                            <Each
                                                of={ONE_TIME_COLUMNS}
                                                keyExtractor={(c) => c.key}
                                                render={(col) => (
                                                    <TableHead className={cn("py-3 font-bold uppercase tracking-wider text-[10px]", col.align === "left" ? "px-6" : "text-right", col.align === "right" && col.key === "amount" && "pr-6")}>
                                                        {col.label}
                                                    </TableHead>
                                                )}
                                            />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <Each
                                            of={oneTimeCharges}
                                            keyExtractor={(charge: any) => String(charge.name || charge.id)}
                                            render={(charge: any) => (
                                                <TableRow className="border-b last:border-0 hover:bg-muted/30">
                                                    <TableCell className="px-6 py-3 font-semibold text-sm">{charge.name}</TableCell>
                                                    <TableCell className="py-3 text-right">
                                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider">
                                                            {charge.category?.replace("_", " ")}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-right tabular-nums font-bold pr-6">{formatCurrency(charge.amount)}</TableCell>
                                                </TableRow>
                                            )}
                                        />
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableCell className="px-6 py-3 font-black text-sm" colSpan={2}>Total One-Time</TableCell>
                                            <TableCell className="py-3 text-right tabular-nums font-black pr-6">
                                                {formatCurrency(oneTimeCharges.reduce((sum: number, c: any) => sum + Number(c.amount), 0))}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* ─── Financial Matrix ────────────────────────────────────── */}
                <div className="max-w-[1400px] mx-auto w-full space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Receipt className="size-4 text-muted-foreground" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Financial Matrix</h3>
                        </div>
                        {!isStudentPortal && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1.5 border-primary/20 text-primary hover:bg-primary/5"
                                onClick={() => setShowAdvance(true)}
                            >
                                <CalendarRange className="size-3.5" />
                                Collect Advance
                            </Button>
                        )}
                    </div>

                    <Card className="rounded-xl border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table className="border-collapse">
                                <TableHeader>
                                    <TableRow className="bg-muted hover:bg-muted border-none">
                                        {/* Static leading columns */}
                                        <Each
                                            of={MATRIX_STATIC_COLUMNS}
                                            keyExtractor={(c) => c.key}
                                            render={(col) => (
                                                <TableHead className={cn("py-4 font-bold uppercase tracking-wider text-[10px] border-r", col.bgClass, col.align === "left" ? "px-6" : "text-right")}>
                                                    {col.label}
                                                </TableHead>
                                            )}
                                        />
                                        {/* Admission fee columns */}
                                        <Each
                                            of={admissionFeeColumns}
                                            keyExtractor={(c) => c.key}
                                            render={(col) => (
                                                <TableHead className={cn("py-4 text-right font-bold uppercase tracking-wider text-[10px] border-r", col.bgClass)}>
                                                    {col.label}
                                                </TableHead>
                                            )}
                                        />
                                        {/* Dynamic particular columns */}
                                        <Each
                                            of={allParticulars}
                                            keyExtractor={(p) => p}
                                            render={(p) => (
                                                <TableHead className="py-4 text-right font-bold uppercase tracking-wider text-[10px] border-r">{p}</TableHead>
                                            )}
                                        />
                                        {/* Static trailing columns */}
                                        <Each
                                            of={MATRIX_SUMMARY_COLUMNS}
                                            keyExtractor={(c) => c.key}
                                            render={(col) => (
                                                <TableHead className={cn(
                                                    "py-4 font-bold uppercase tracking-wider text-[10px]",
                                                    col.key !== "action" && "border-r",
                                                    col.bgClass, col.textClass,
                                                    col.align === "center" ? "text-center" : "text-right"
                                                )}>
                                                    {col.label}
                                                </TableHead>
                                            )}
                                        />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <Each
                                        of={matrix}
                                        keyExtractor={(row: any) => `${row.month_key}-${row.payment_id ?? 'unpaid'}`}
                                        render={(row: any) => (
                                            <TableRow className="group border-b last:border-0 hover:bg-muted/30 transition-colors">
                                                {/* Month */}
                                                <TableCell className="px-6 py-4 border-r">
                                                    <div className="font-bold text-sm">{row.month_name}</div>
                                                    {row.due_date && (
                                                        <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Due: {row.due_date}</div>
                                                    )}
                                                </TableCell>
                                                {/* Previous Dues */}
                                                <TableCell className="text-right py-4 tabular-nums text-sm font-semibold text-amber-600 bg-amber-500/[0.02] border-r">
                                                    {formatCurrency(row.previous_dues)}
                                                </TableCell>
                                                {/* Admission fee columns */}
                                                <Each
                                                    of={admissionFeeColumns}
                                                    keyExtractor={(col) => col.key}
                                                    render={(col) => (
                                                        <TableCell className="text-right py-4 tabular-nums text-sm font-medium border-r opacity-80">
                                                            {formatCurrency(row[col.rowField!] ?? 0, col.format === "currency-positive")}
                                                        </TableCell>
                                                    )}
                                                />
                                                {/* Dynamic Particulars */}
                                                <Each
                                                    of={allParticulars}
                                                    keyExtractor={(pName) => pName}
                                                    render={(pName) => {
                                                        const ep = (row.expected_particulars || []).find((ep: any) => ep.name === pName);
                                                        const isFallbackFees = pName === "Fees" && allParticulars.length === 1 && !ep;
                                                        const pValue = ep?.amount ?? (isFallbackFees ? (row.monthly_total ?? row.total_payable ?? 0) : 0);
                                                        return (
                                                            <TableCell className={cn("text-right py-4 tabular-nums text-sm font-medium border-r opacity-70", pValue < 0 && "text-emerald-600 font-bold opacity-100")}>
                                                                {pValue !== 0 ? (pValue > 0 ? formatCurrency(pValue) : `-${formatCurrency(Math.abs(pValue))}`) : "—"}
                                                            </TableCell>
                                                        );
                                                    }}
                                                />
                                                {/* Config-driven summary columns */}
                                                <Each
                                                    of={MATRIX_SUMMARY_COLUMNS}
                                                    keyExtractor={(col) => col.key}
                                                    render={(col) => {
                                                        const FORMAT_DISPLAY: Record<string, (val: any) => string> = {
                                                            currency: (val) => formatCurrency(val ?? 0),
                                                            "currency-positive": (val) => Number(val ?? 0) > 0 ? formatCurrency(val) : "—",
                                                            "currency-discount": (val) => Number(val ?? 0) > 0 ? `-${formatCurrency(val)}` : "—",
                                                        };

                                                        const COLUMN_RENDERERS: Record<string, () => React.ReactNode> = {
                                                            receipts: () => (
                                                                <TableCell className="text-center py-4 border-r">
                                                                    <div className="flex items-center justify-center gap-1.5">
                                                                        {isStudentPortal ? (
                                                                            <span className="text-muted-foreground text-[10px]">No Actions</span>
                                                                        ) : row.payment_id
                                                                            ? <PaidRowActions row={row} handlers={rowActionHandlers} />
                                                                            : <UnpaidRowActions row={row} handlers={rowActionHandlers} isPending={sendReminderMutation.isPending} />
                                                                        }
                                                                    </div>
                                                                </TableCell>
                                                            ),
                                                            action: () => (
                                                                <TableCell className="text-center py-4">
                                                                    {row.balance > 0 ? (
                                                                        isStudentPortal ? (
                                                                            <Button
                                                                                size="sm" variant="secondary"
                                                                                onClick={() => alert("Payment Gateway Integration Pending")}
                                                                                className="h-7 px-3 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-all text-[10px] font-bold uppercase tracking-wider disabled:opacity-30 disabled:grayscale"
                                                                            >
                                                                                <CreditCard className="size-3" /> Pay Now
                                                                            </Button>
                                                                        ) : (
                                                                        <div className="flex items-center justify-center gap-1.5">
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        size="sm" variant="secondary"
                                                                                        onClick={() => setSelectedMonth(row)}
                                                                                        className="h-7 px-3 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-all text-[10px] font-bold uppercase tracking-wider disabled:opacity-30 disabled:grayscale"
                                                                                    >
                                                                                        <CreditCard className="size-3" /> Pay
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Record Detailed Payment</TooltipContent>
                                                                            </Tooltip>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        size="icon" variant="ghost"
                                                                                        className="size-7 rounded-lg hover:bg-emerald-50 text-emerald-600 border border-transparent hover:border-emerald-100"
                                                                                        onClick={() => markAsPaidMutation.mutate(row.month_key)}
                                                                                        disabled={markAsPaidMutation.isPending}
                                                                                    >
                                                                                        <CheckCircle2 className="size-3.5" />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Quick Mark as Paid (Cash)</TooltipContent>
                                                                            </Tooltip>
                                                                        </div>
                                                                        )
                                                                    ) : (
                                                                        <div className="size-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                                                                            <Check className="size-3.5 stroke-[3.5px]" />
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                            ),
                                                        };

                                                        if (COLUMN_RENDERERS[col.key]) return COLUMN_RENDERERS[col.key]();

                                                        const rawVal = col.rowField ? row[col.rowField] : null;
                                                        const formatter = FORMAT_DISPLAY[col.format ?? ""];
                                                        const display = formatter ? formatter(rawVal) : (rawVal || "—");

                                                        return (
                                                            <TableCell className={cn(
                                                                "py-4 tabular-nums text-sm font-bold border-r",
                                                                col.bgClass && `${col.bgClass.replace('/5', '/[0.02]')}`,
                                                                col.textClass,
                                                                col.align === "center" ? "text-center" : "text-right"
                                                            )}>
                                                                {display}
                                                            </TableCell>
                                                        );
                                                    }}
                                                />
                                            </TableRow>
                                        )}
                                    />
                                    {/* Grand Total Row */}
                                    <TableRow className="bg-muted/70 hover:bg-muted/70 border-t-2">
                                        <TableCell className="px-6 py-4 font-black text-sm border-r">Grand Total</TableCell>
                                        <TableCell className="text-right py-4 tabular-nums text-sm font-bold border-r bg-amber-500/[0.02]">—</TableCell>
                                        <Each
                                            of={admissionFeeColumns}
                                            keyExtractor={(col) => `total-${col.key}`}
                                            render={(col) => (
                                                <TableCell className="text-right py-4 tabular-nums text-sm font-bold border-r">
                                                    {formatCurrency(matrix.reduce((sum: number, r: any) => sum + Number(r[col.rowField!] ?? 0), 0))}
                                                </TableCell>
                                            )}
                                        />
                                        <Each
                                            of={allParticulars}
                                            keyExtractor={(p) => `total-${p}`}
                                            render={(pName) => (
                                                <TableCell className="text-right py-4 tabular-nums text-sm font-bold border-r">
                                                    {formatCurrency(matrix.reduce((sum: number, row: any) => {
                                                        const ep = (row.expected_particulars || []).find((ep: any) => ep.name === pName);
                                                        return sum + (ep?.amount ?? 0);
                                                    }, 0))}
                                                </TableCell>
                                            )}
                                        />
                                        <Each
                                            of={MATRIX_SUMMARY_COLUMNS}
                                            keyExtractor={(col) => `gt-${col.key}`}
                                            render={(col) => {
                                                const NON_SUMMABLE = new Set(["receipts", "action"]);
                                                const isNonSummable = !col.rowField || col.format === "text" || NON_SUMMABLE.has(col.key);

                                                if (isNonSummable) {
                                                    return <TableCell className={cn("py-4 border-r", col.key === "action" && "border-r-0")} />;
                                                }

                                                let total = 0;
                                                if (col.key === "total_dues") {
                                                    const firstRowPrevDues = Number(matrix[0]?.previous_dues ?? 0);
                                                    const totalParticularsSum = admissionFeeColumns.reduce((sum, c) => {
                                                        return sum + matrix.reduce((s, r) => s + Number(r[c.rowField!] ?? 0), 0);
                                                    }, 0) + allParticulars.reduce((sum, pName) => {
                                                        return sum + matrix.reduce((s, r) => {
                                                            const ep = (r.expected_particulars || []).find((ep: any) => ep.name === pName);
                                                            return s + (ep?.amount ?? 0);
                                                        }, 0);
                                                    }, 0) + matrix.reduce((s, r) => s + Number(r.late_fee ?? 0), 0);

                                                    total = firstRowPrevDues + totalParticularsSum;
                                                } else if (col.key === "arrears") {
                                                    const firstRowPrevDues = Number(matrix[0]?.previous_dues ?? 0);
                                                    const totalParticularsSum = admissionFeeColumns.reduce((sum, c) => {
                                                        return sum + matrix.reduce((s, r) => s + Number(r[c.rowField!] ?? 0), 0);
                                                    }, 0) + allParticulars.reduce((sum, pName) => {
                                                        return sum + matrix.reduce((s, r) => {
                                                            const ep = (r.expected_particulars || []).find((ep: any) => ep.name === pName);
                                                            return s + (ep?.amount ?? 0);
                                                        }, 0);
                                                    }, 0) + matrix.reduce((s, r) => s + Number(r.late_fee ?? 0), 0);

                                                    const grandTotalDues = firstRowPrevDues + totalParticularsSum;
                                                    const grandTotalPaid = matrix.reduce((sum, r) => sum + Number(r.paid_amount ?? 0), 0);
                                                    total = grandTotalDues - grandTotalPaid;
                                                } else {
                                                    total = matrix.reduce((sum: number, r: any) => sum + Math.max(0, Number(r[col.rowField!] ?? 0)), 0);
                                                }

                                                return (
                                                    <TableCell className={cn(
                                                        "text-right py-4 tabular-nums text-sm font-black border-r",
                                                        col.bgClass && `${col.bgClass.replace('/5', '/[0.04]')}`,
                                                        col.textClass
                                                    )}>
                                                        {formatCurrency(total)}
                                                    </TableCell>
                                                );
                                            }}
                                        />
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>

                {/* ─── Payment Modal ───────────────────────────────────────── */}
                {selectedMonth && (
                    <PaymentCollectModal
                        isOpen={!!selectedMonth}
                        onClose={() => setSelectedMonth(null)}
                        student={student}
                        monthData={selectedMonth}
                        onSuccess={() => {
                            queryClient.invalidateQueries({ queryKey: ["student-ledger-matrix", studentId] });
                            setSelectedMonth(null);
                        }}
                    />
                )}

                {/* ─── Advance Payment Modal ────────────────────────────── */}
                <AdvancePaymentModal
                    isOpen={showAdvance}
                    onClose={() => setShowAdvance(false)}
                    student={student}
                    matrix={matrix}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["student-ledger-matrix", studentId] });
                        setShowAdvance(false);
                    }}
                />
            </div>
        </TooltipProvider>
    );
}
