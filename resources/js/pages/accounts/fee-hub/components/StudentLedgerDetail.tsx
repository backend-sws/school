import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstitutionLabels } from "@/constants/scopeTypeDisplay";
import api from "@/lib/api/api";
import R2Api from "@/lib/api/r2Api";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CreditCard, AlertCircle, Mail, Bell, Link2, Download, CheckCircle2, Check, Receipt, Send, Loader2, CalendarRange, RotateCcw, AlertTriangle, User, Calendar
} from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";
import PaymentCollectModal from "@/pages/accounts/fee-hub/components/PaymentCollectModal";
import AdvancePaymentModal from "@/pages/accounts/fee-hub/components/AdvancePaymentModal";
import RevertPaymentModal from "@/pages/accounts/fee-hub/components/RevertPaymentModal";


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
    revertPayment?: (row: any) => void;
    revertAdHoc?: (charge: any) => void;
}

function PaidRowActions({ row, handlers }: { row: any; handlers: RowActionHandlers }) {
    const actions = [
        { key: "email", icon: Mail, tooltip: "Email Receipt", color: "hover:bg-blue-50 text-blue-600", onClick: () => handlers.resendReceipt(row.payment_id, "email") },
        { key: "push", icon: Bell, tooltip: "Push Receipt", color: "hover:bg-purple-50 text-purple-600", onClick: () => handlers.resendReceipt(row.payment_id, "push") },
        { key: "download", icon: Download, tooltip: "Download PDF", color: "hover:bg-amber-50 text-amber-600", onClick: () => handlers.downloadReceipt(row.payment_id) },
        { key: "link", icon: Link2, tooltip: "Copy Receipt Link", color: "hover:bg-slate-100 text-slate-600", onClick: () => handlers.copyLink(row.payment_id) },
        ...(handlers.revertPayment ? [{
            key: "undo",
            icon: RotateCcw,
            tooltip: "Undo / Revert Payment (With Reason)",
            color: "hover:bg-rose-50 text-rose-500 hover:text-rose-600",
            onClick: () => handlers.revertPayment!(row),
        }] : []),
        ...(handlers.revertAdHoc && row.ad_hoc_charges && row.ad_hoc_charges.length > 0 ? row.ad_hoc_charges.map((charge: any) => ({
            key: `revert-adhoc-${charge.id}`,
            icon: RotateCcw,
            tooltip: `Revert Ad-Hoc: ${charge.name} (₹${Number(charge.amount).toLocaleString('en-IN')})`,
            color: "hover:bg-amber-50 text-amber-600 hover:text-amber-700",
            onClick: () => handlers.revertAdHoc!(charge),
        })) : []),
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
            {handlers.revertAdHoc && row.ad_hoc_charges && row.ad_hoc_charges.length > 0 && (
                row.ad_hoc_charges.map((charge: any) => (
                    <Tooltip key={`revert-adhoc-${charge.id}`}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 rounded-lg hover:bg-amber-50 text-amber-600 hover:text-amber-700"
                                onClick={() => handlers.revertAdHoc!(charge)}
                            >
                                <RotateCcw className="size-3.5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Revert Ad-Hoc: {charge.name} (₹{Number(charge.amount).toLocaleString('en-IN')})</TooltipContent>
                    </Tooltip>
                ))
            )}
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
    const [revertingRow, setRevertingRow] = useState<any>(null);
    const [revertingAdHoc, setRevertingAdHoc] = useState<any>(null);
    const [photoError, setPhotoError] = useState(false);

    // ─── Data Fetching ───────────────────────────────────────────────────────
    const { data: ledgerRes, isLoading, isError } = useQuery({
        queryKey: ["student-ledger-matrix", studentId, selectedSession, isStudentPortal],
        queryFn: () => api.get(isStudentPortal ? `/student/financial-ledger` : `/fees/ledger/student/${studentId}`, { params: { session_id: selectedSession === "current" ? null : selectedSession } }),
    });

    // ─── Mutations ───────────────────────────────────────────────────────────
    const revertAdHocMutation = useMutation({
        mutationFn: (chargeId: number) => api.delete(`/fees/ad-hoc-charges/${chargeId}`),
        onSuccess: () => {
            toast.success("Ad-hoc charge reverted successfully. Student ledger updated.");
            setRevertingAdHoc(null);
            queryClient.invalidateQueries({ queryKey: ["student-ledger-matrix", studentId] });
            queryClient.invalidateQueries({ queryKey: ["student-ledger-stats"] });
            queryClient.invalidateQueries({ queryKey: ["students-list"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to revert ad-hoc charge.");
        },
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
    const studentPhoto =
        student.photo_url ||
        student.avatar_url ||
        student.avatar ||
        student.student_profile?.photo_url ||
        student.studentProfile?.photo_url ||
        student.user?.photo_url;
    const matrix = data?.matrix || [];
    const classInfo = data?.class || {};
    const admissionSummary = data?.admission_summary || null;
    const oneTimeCharges = data?.one_time_charges || [];
    const availableSessions = data?.available_sessions || [];
    const revertedHistory = data?.reverted_history || [];
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
        setPhotoError(false);
    }, [studentPhoto]);

    useEffect(() => {
        if (student.name && onLoaded) onLoaded(student.name);
    }, [student.name, onLoaded]);

    // ─── Action Handlers (via map) ───────────────────────────────────────────
    const heroActionHandlers: Record<string, () => void> = {
        remind: () => {
            const currentPeriod = matrix?.[0]?.month_key ?? new Date().toISOString().slice(0, 7);
            sendReminderMutation.mutate({ period: currentPeriod, type: "due_soon" });
        },
        export: async () => {
            try {
                toast.loading("Generating Excel spreadsheet...", { id: "export-ledger" });
                const endpoint = isStudentPortal ? `/student/financial-ledger/export` : `/fees/ledger/student/${studentId}/export`;
                const response = await api.get(endpoint, {
                    params: { session_id: selectedSession === "current" ? null : selectedSession },
                    responseType: "blob",
                });

                const blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                const safeName = (student?.name || "Student").replace(/[^a-zA-Z0-9_-]/g, "_");
                const sessionStr = student?.student_profile?.session?.name || "Session";
                link.download = `Fee_Ledger_${safeName}_${sessionStr}.xlsx`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                toast.success("Excel ledger downloaded successfully!", { id: "export-ledger" });
            } catch (err: any) {
                toast.error("Failed to export fee ledger to Excel.", { id: "export-ledger" });
            }
        },
        print: () => window.print(),
    };

    const rowActionHandlers: RowActionHandlers = {
        resendReceipt: (paymentId, via) => resendReceiptMutation.mutate({ paymentId, via }),
        downloadReceipt: (paymentId: number) => {
            const endpoint = isStudentPortal
                ? `/api/v1/student/financial-ledger/receipt/${paymentId}`
                : `/api/v1/fees/ledger/download-receipt/${paymentId}`;
            window.open(endpoint, "_blank");
        },
        copyLink: () => {
            const url = `${window.location.origin}/accounts/fee-hub/students?student=${studentId}`;
            navigator.clipboard.writeText(url);
            toast.success("Link copied");
        },
        sendReminder: (period, type, via) => sendReminderMutation.mutate({ period, type, via }),
        revertPayment: (row) => setRevertingRow(row),
        revertAdHoc: (charge) => setRevertingAdHoc(charge),
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
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20 text-3xl font-black text-primary shadow-inner overflow-hidden">
                                    {studentPhoto && !photoError ? (
                                        <img
                                            src={R2Api.imageSrc(studentPhoto)}
                                            alt={student.name || "Student"}
                                            className="size-full object-cover"
                                            onError={() => setPhotoError(true)}
                                        />
                                    ) : (
                                        student.name?.charAt(0)
                                    )}
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
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
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
                            {admissionSummary.payment_status === "success" && (admissionSummary.id || admissionSummary.application_id) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 border-primary/20 text-primary hover:bg-primary/5 shadow-none"
                                    onClick={() => window.open(`/api/v1/student/admission/${admissionSummary.id || admissionSummary.application_id}/download-receipt`, "_blank")}
                                >
                                    <Download className="size-3.5" />
                                    <span>Download Receipt</span>
                                </Button>
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
                                                    {row.remarks && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-muted/60 border text-muted-foreground text-[9px] font-medium max-w-[150px] truncate cursor-help">
                                                                    <span className="font-semibold text-foreground">Note:</span>
                                                                    <span className="truncate">{row.remarks}</span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" className="max-w-xs p-2.5 text-xs">
                                                                <span className="font-bold text-foreground">Transaction Note / Reason:</span>
                                                                <p className="mt-1 text-muted-foreground">{row.remarks}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {row.reverted_payments && row.reverted_payments.length > 0 && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-semibold tracking-wide hover:bg-rose-100 transition-colors cursor-help">
                                                                    <RotateCcw className="size-2.5 text-rose-500 shrink-0" />
                                                                    <span>Reverted</span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" className="max-w-xs p-3 space-y-2 bg-popover border shadow-xl text-popover-foreground">
                                                                <div className="flex items-center gap-1.5 font-bold text-xs text-rose-600">
                                                                    <AlertTriangle className="size-3.5" />
                                                                    <span>Payment Reversal Audit</span>
                                                                </div>
                                                                {row.reverted_payments.map((rp: any, idx: number) => (
                                                                    <div key={idx} className="text-xs space-y-1 border-t border-border/60 pt-1.5">
                                                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                                                            <span>Amount: ₹{Number(rp.amount ?? 0).toLocaleString()}</span>
                                                                            <span>{rp.reverted_at}</span>
                                                                        </div>
                                                                        {rp.receipt_no && (
                                                                            <div className="text-[10px] text-muted-foreground font-mono">
                                                                                Receipt: <span className="line-through">{rp.receipt_no}</span>
                                                                            </div>
                                                                        )}
                                                                        <div className="bg-rose-50/70 border border-rose-100 p-2 rounded-md text-[11px] space-y-0.5">
                                                                            <span className="font-bold text-rose-800">Reason: </span>
                                                                            <span className="text-rose-950 font-medium italic">"{rp.reason}"</span>
                                                                        </div>
                                                                        <div className="text-[9px] text-muted-foreground">
                                                                            Reverted by: <span className="font-semibold">{rp.reverted_by}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </TooltipContent>
                                                        </Tooltip>
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
                                                    render={(col) => {
                                                        const val = row[col.rowField!] ?? 0;
                                                        const isHostelBreakdown = col.key === "hostel_fee" && row.hostel_breakdown && (row.hostel_breakdown.mess_amount > 0 || row.hostel_breakdown.room_amount > 0);
                                                        return (
                                                            <TableCell className="text-right py-4 tabular-nums text-sm font-medium border-r opacity-80">
                                                                {isHostelBreakdown && Number(val) > 0 ? (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <span className="cursor-help underline decoration-dotted decoration-primary/50 underline-offset-4 font-semibold text-foreground">
                                                                                {formatCurrency(val, col.format === "currency-positive")}
                                                                            </span>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top" className="text-xs p-2.5 space-y-1.5 bg-popover text-popover-foreground border shadow-md">
                                                                            <p className="font-bold border-b pb-1 text-foreground">Hostel & Mess Breakdown</p>
                                                                            <div className="flex justify-between gap-4 text-muted-foreground">
                                                                                <span>Room Rent:</span>
                                                                                <span className="font-semibold text-foreground">{formatCurrency(row.hostel_breakdown.room_amount)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between gap-4 text-muted-foreground">
                                                                                <span>Mess ({row.hostel_breakdown.mess_plan_name || 'Dining'}):</span>
                                                                                <span className="font-semibold text-foreground">{formatCurrency(row.hostel_breakdown.mess_amount)}</span>
                                                                            </div>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                ) : (
                                                                    formatCurrency(val, col.format === "currency-positive")
                                                                )}
                                                            </TableCell>
                                                        );
                                                    }}
                                                />
                                                {/* Dynamic Particulars */}
                                                <Each
                                                    of={allParticulars}
                                                    keyExtractor={(pName) => pName}
                                                    render={(pName) => {
                                                        const ep = (row.expected_particulars || []).find((ep: any) => ep.name === pName);
                                                        const isFallbackFees = pName === "Fees" && allParticulars.length === 1 && !ep;
                                                        const pValue = ep?.amount ?? (isFallbackFees ? (row.monthly_total ?? row.total_payable ?? 0) : 0);
                                                        const isAdHoc = ep?.type === "ad_hoc";
                                                        return (
                                                            <TableCell className={cn("text-right py-4 tabular-nums text-sm font-medium border-r opacity-70", pValue < 0 && "text-emerald-600 font-bold opacity-100")}>
                                                                {pValue !== 0 ? (
                                                                    isAdHoc && ep?.id && !isStudentPortal ? (
                                                                        <div className="inline-flex items-center justify-end gap-1 group/adhoc">
                                                                            <span className="font-semibold text-foreground">{formatCurrency(pValue)}</span>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setRevertingAdHoc(ep)}
                                                                                        className="opacity-0 group-hover/adhoc:opacity-100 transition-opacity p-0.5 rounded text-amber-600 hover:bg-amber-50 hover:text-amber-700 cursor-pointer"
                                                                                    >
                                                                                        <RotateCcw className="size-2.5" />
                                                                                    </button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top">Revert Ad-Hoc: {ep.name}</TooltipContent>
                                                                            </Tooltip>
                                                                        </div>
                                                                    ) : (
                                                                        pValue > 0 ? formatCurrency(pValue) : `-${formatCurrency(Math.abs(pValue))}`
                                                                    )
                                                                ) : "—"}
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
                                                                            row.payment_id ? (
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            className="h-7 px-2.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200 flex items-center gap-1.5 text-[11px] font-semibold shadow-none transition-colors"
                                                                                            onClick={() => rowActionHandlers.downloadReceipt(row.payment_id)}
                                                                                        >
                                                                                            <Download className="size-3.5 text-amber-600" />
                                                                                            <span>Receipt</span>
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Download Fee Receipt (PDF)</TooltipContent>
                                                                                </Tooltip>
                                                                            ) : (
                                                                                <span className="text-muted-foreground/60 text-[11px] font-medium">—</span>
                                                                            )
                                                                        ) : row.payment_id
                                                                            ? <PaidRowActions row={row} handlers={rowActionHandlers} />
                                                                            : <UnpaidRowActions row={row} handlers={rowActionHandlers} isPending={sendReminderMutation.isPending} />
                                                                        }
                                                                    </div>
                                                                </TableCell>
                                                            ),
                                                            action: () => {
                                                                const hasPayment = Boolean(row.payment_id) || Number(row.paid_amount || 0) > 0 || row.status === "paid" || row.status === "partial";
                                                                const canPay = !hasPayment && Number(row.balance || 0) > 0;

                                                                return (
                                                                    <TableCell className="text-center py-4">
                                                                        {canPay ? (
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
                                                                            <div className="flex items-center justify-center gap-1.5">
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <div className="size-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm cursor-default">
                                                                                            <Check className="size-3.5 stroke-[3.5px]" />
                                                                                        </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>
                                                                                        {Number(row.balance || 0) > 0
                                                                                            ? "Payment recorded (Remaining balance carried forward to next month)"
                                                                                            : "Paid in full"}
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                                {!isStudentPortal && row.payment_id && (
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger asChild>
                                                                                            <Button
                                                                                                size="icon" variant="ghost"
                                                                                                className="size-7 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-600 border border-transparent hover:border-rose-100"
                                                                                                onClick={() => setRevertingRow(row)}
                                                                                            >
                                                                                                <RotateCcw className="size-3.5" />
                                                                                            </Button>
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent>Undo Payment (With Reason)</TooltipContent>
                                                                                    </Tooltip>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                );
                                                            },
                                                        };

                                                        if (COLUMN_RENDERERS[col.key]) return COLUMN_RENDERERS[col.key]();

                                                        const rawVal = col.rowField ? row[col.rowField] : null;
                                                        const formatter = FORMAT_DISPLAY[col.format ?? ""];
                                                        let display: React.ReactNode = formatter ? formatter(rawVal) : (rawVal || "—");

                                                        if (col.key === "receipt_no" && !rawVal && row.reverted_payments?.length > 0) {
                                                            const firstRev = row.reverted_payments[0];
                                                            display = (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="inline-flex flex-col items-center cursor-help">
                                                                            <span className="text-[11px] font-mono text-muted-foreground/70 line-through">
                                                                                {firstRev.receipt_no || "Receipt"}
                                                                            </span>
                                                                            <span className="text-[8px] font-bold text-rose-500 uppercase tracking-wider">
                                                                                Reverted
                                                                            </span>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top" className="max-w-xs text-xs p-2">
                                                                        <span className="font-bold text-rose-500">Reversal Reason:</span> {firstRev.reason}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            );
                                                        } else if (col.key === "receipt_no" && rawVal) {
                                                            display = (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div
                                                                            className={cn(
                                                                                "inline-flex flex-col items-center",
                                                                                row.payment_id ? "cursor-pointer group/rcp" : "cursor-help"
                                                                            )}
                                                                            onClick={() => {
                                                                                if (row.payment_id) {
                                                                                    rowActionHandlers.downloadReceipt(row.payment_id);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <span className={cn(
                                                                                "text-[11px] font-mono font-bold text-primary",
                                                                                row.payment_id && "group-hover/rcp:underline"
                                                                            )}>
                                                                                {rawVal}
                                                                            </span>
                                                                            {row.remarks && (
                                                                                <span className="text-[9px] text-muted-foreground truncate max-w-[120px] italic">
                                                                                    "{row.remarks}"
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top" className="max-w-xs text-xs p-2.5 space-y-1">
                                                                        <div className="font-bold text-foreground">
                                                                            Receipt: {rawVal}
                                                                            {row.payment_id && <span className="ml-1 text-[10px] text-primary font-normal">(Click to download)</span>}
                                                                        </div>
                                                                        {row.payment_mode && (
                                                                            <div className="text-[11px] uppercase font-bold text-muted-foreground">Mode: {row.payment_mode}</div>
                                                                        )}
                                                                        {row.remarks && (
                                                                            <div className="text-xs text-muted-foreground border-t pt-1">
                                                                                <span className="font-semibold text-foreground">Note / Remarks:</span> {row.remarks}
                                                                            </div>
                                                                        )}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            );
                                                        } else if (col.key === "payment_mode" && rawVal) {
                                                            display = (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "text-[10px] uppercase font-bold tracking-wider",
                                                                        rawVal === "concession" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                                                                        rawVal === "cash" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                        "bg-blue-50 text-blue-700 border-blue-200"
                                                                    )}
                                                                >
                                                                    {rawVal}
                                                                </Badge>
                                                            );
                                                        }

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
                                                    const totalParticularsSum = admissionFeeColumns.reduce((sum: number, c: any) => {
                                                        return sum + matrix.reduce((s: number, r: any) => s + Number(r[c.rowField!] ?? 0), 0);
                                                    }, 0) + allParticulars.reduce((sum: number, pName: string) => {
                                                        return sum + matrix.reduce((s: number, r: any) => {
                                                            const ep = (r.expected_particulars || []).find((ep: any) => ep.name === pName);
                                                            return s + (ep?.amount ?? 0);
                                                        }, 0);
                                                    }, 0) + matrix.reduce((s: number, r: any) => s + Number(r.late_fee ?? 0), 0);

                                                    total = firstRowPrevDues + totalParticularsSum;
                                                } else if (col.key === "arrears") {
                                                    const firstRowPrevDues = Number(matrix[0]?.previous_dues ?? 0);
                                                    const totalParticularsSum = admissionFeeColumns.reduce((sum: number, c: any) => {
                                                        return sum + matrix.reduce((s: number, r: any) => s + Number(r[c.rowField!] ?? 0), 0);
                                                    }, 0) + allParticulars.reduce((sum: number, pName: string) => {
                                                        return sum + matrix.reduce((s: number, r: any) => {
                                                            const ep = (r.expected_particulars || []).find((ep: any) => ep.name === pName);
                                                            return s + (ep?.amount ?? 0);
                                                        }, 0);
                                                    }, 0) + matrix.reduce((s: number, r: any) => s + Number(r.late_fee ?? 0), 0);

                                                    const grandTotalDues = firstRowPrevDues + totalParticularsSum;
                                                    const grandTotalPaid = matrix.reduce((sum: number, r: any) => sum + Number(r.paid_amount ?? 0), 0);
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

                {/* ─── Reverted Payments Audit Log ─────────────────────────── */}
                {revertedHistory.length > 0 && (
                    <Card className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/20 via-background to-amber-50/10 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
                            <div className="flex items-center gap-2.5">
                                <div className="size-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <RotateCcw className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-tight text-foreground flex items-center gap-2">
                                        Payment Reversals & Audit History
                                        <Badge variant="outline" className="text-[10px] font-bold border-rose-300 bg-rose-100/50 text-rose-700">
                                            {revertedHistory.length} {revertedHistory.length === 1 ? "reversal" : "reversals"}
                                        </Badge>
                                    </h3>
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        Transactions that were undone / cancelled with mandatory reason
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/40 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                    <TableRow>
                                        <TableHead className="px-6 py-3">Month / Period</TableHead>
                                        <TableHead className="py-3">Receipt No</TableHead>
                                        <TableHead className="py-3 text-right">Amount (₹)</TableHead>
                                        <TableHead className="py-3 text-center">Mode</TableHead>
                                        <TableHead className="py-3">Reverted On</TableHead>
                                        <TableHead className="py-3">Reverted By</TableHead>
                                        <TableHead className="px-6 py-3">Reason for Reversal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {revertedHistory.map((rev: any, idx: number) => (
                                        <TableRow key={rev.id || idx} className="hover:bg-rose-50/20 text-xs transition-colors">
                                            <TableCell className="px-6 py-3.5 font-bold text-foreground">
                                                {rev.for_month || "—"}
                                            </TableCell>
                                            <TableCell className="py-3.5 font-mono text-[11px] text-muted-foreground">
                                                <span className="line-through">{rev.receipt_no || "—"}</span>
                                            </TableCell>
                                            <TableCell className="py-3.5 text-right font-bold text-rose-600 tabular-nums">
                                                {formatCurrency(rev.amount)}
                                            </TableCell>
                                            <TableCell className="py-3.5 text-center">
                                                <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                                                    {rev.payment_mode || "—"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3.5 text-muted-foreground text-[11px]">
                                                {rev.reverted_at || "—"}
                                            </TableCell>
                                            <TableCell className="py-3.5 font-medium text-foreground">
                                                {rev.reverted_by || "Admin"}
                                            </TableCell>
                                            <TableCell className="px-6 py-3.5">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-medium text-xs">
                                                    <span className="font-bold text-rose-700">Reason:</span>
                                                    <span>{rev.reason}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}

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

                {/* ─── Undo / Revert Payment Modal ──────────────────────── */}
                {revertingRow && (
                    <RevertPaymentModal
                        isOpen={!!revertingRow}
                        onClose={() => setRevertingRow(null)}
                        student={student}
                        paymentRow={revertingRow}
                        onSuccess={() => {
                            queryClient.invalidateQueries({ queryKey: ["student-ledger-matrix", studentId] });
                            queryClient.invalidateQueries({ queryKey: ["student-ledger-stats"] });
                            queryClient.invalidateQueries({ queryKey: ["students-list"] });
                            setRevertingRow(null);
                        }}
                    />
                )}

                {/* ─── Revert Ad-Hoc Charge Modal ────────────────────────── */}
                <Dialog open={!!revertingAdHoc} onOpenChange={(open) => !open && setRevertingAdHoc(null)}>
                    <DialogContent className="sm:max-w-[420px] border shadow-2xl p-0 overflow-hidden rounded-2xl">
                        <DialogHeader className="p-6 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                                    <AlertTriangle className="size-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-bold text-foreground">
                                        Revert Ad-Hoc Charge
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                        Remove this ad-hoc charge from the student's ledger
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-6 pt-2 space-y-4">
                            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <User className="size-3.5" />
                                        Student
                                    </span>
                                    <span className="font-bold text-foreground">{student.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Receipt className="size-3.5" />
                                        Charge Name
                                    </span>
                                    <span className="font-bold text-primary">{revertingAdHoc?.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Calendar className="size-3.5" />
                                        Amount
                                    </span>
                                    <span className="font-bold text-destructive text-sm">₹{Number(revertingAdHoc?.amount ?? 0).toLocaleString()}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground pt-1 border-t border-destructive/10">
                                    Reverting will immediately deduct this charge from the student's expected fee and balance for this period.
                                </p>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setRevertingAdHoc(null)}
                                    disabled={revertAdHocMutation.isPending}
                                    className="rounded-xl font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        if (revertingAdHoc?.id) {
                                            revertAdHocMutation.mutate(revertingAdHoc.id);
                                        }
                                    }}
                                    disabled={revertAdHocMutation.isPending}
                                    className="rounded-xl font-bold gap-2"
                                >
                                    {revertAdHocMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                                    Confirm Revert
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}
