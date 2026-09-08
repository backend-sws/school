import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  UploadCloud,
  Eye,
  HeartPulse,
  Mail,
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  Cloud,
  Download,
  Search,
  Filter,
  Sparkles,
  Layers,
  ArrowUpRight,
  School,
  FileCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { cn } from "@/lib/utils";
import { LeaveDocumentPreviewDialog } from "@/components/admin/leaveDocumentPreviewDialog";

export interface StudentClassAttendanceHubProps {
  classId: number;
  className?: string;
  userId: number;
  studentName?: string;
  onOpenUploadLeave: () => void;
  onOpenProfileDrawer?: () => void;
}

export function StudentClassAttendanceHub({
  classId,
  className,
  userId,
  studentName,
  onOpenUploadLeave,
  onOpenProfileDrawer,
}: StudentClassAttendanceHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<"register" | "leaves">("register");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVaultFilter, setSelectedVaultFilter] = useState<string>("all");

  // Document preview lightbox state
  const [previewDoc, setPreviewDoc] = useState<{
    open: boolean;
    url: string | null;
    name: string | null;
    title?: string | null;
    category?: string | null;
    type?: string;
    dateRange?: string;
    reason?: string;
  }>({
    open: false,
    url: null,
    name: null,
  });

  // Fetch student 360 data
  const { data: profileRes, isLoading } = useQuery({
    queryKey: ["student-360-profile", classId, userId],
    queryFn: () => lmsApi.studentRoster.student360(classId, userId),
    enabled: !!classId && !!userId,
  });

  const profileData = (profileRes as any)?.data;
  const attendance = profileData?.attendance;
  const summary = attendance?.summary;
  const monthly = (attendance?.monthly ?? []) as any[];
  const records = (attendance?.records ?? []) as any[];
  const leaves = (profileData?.leaves ?? []) as any[];

  // Attendance rate styling
  const percentage = summary?.percentage ?? 0;
  const isHealthy = percentage >= 75;
  const isWarning = percentage >= 60 && percentage < 75;

  // Filter daily records
  const filteredRecords = useMemo(() => {
    if (statusFilter === "all") return records;
    return records.filter((r) => r.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [records, statusFilter]);

  // Filter leave applications
  const filteredLeaves = useMemo(() => {
    if (selectedVaultFilter === "all") return leaves;
    if (selectedVaultFilter === "leave") {
      return leaves.filter((l) => (l.document_category || "leave") === "leave");
    }
    if (selectedVaultFilter === "medical") {
      return leaves.filter(
        (l) => l.document_category === "medical" || l.leave_type === "medical"
      );
    }
    if (selectedVaultFilter === "parent") {
      return leaves.filter(
        (l) =>
          l.document_category === "parent_letter" ||
          l.leave_type === "parent_letter" ||
          l.leave_type === "parent_consent"
      );
    }
    return leaves.filter(
      (l) => !["leave", "medical", "parent_letter"].includes(l.document_category)
    );
  }, [leaves, selectedVaultFilter]);

  // Document category helpers
  const getDocumentMeta = (item: any) => {
    const cat = item.document_category || "leave";
    const type = item.leave_type || "casual";

    if (cat === "medical" || type === "medical" || type === "fitness_cert") {
      return {
        label: "Medical Slip",
        icon: HeartPulse,
        badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        iconBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      };
    }
    if (cat === "parent_letter" || type === "parent_letter" || type === "parent_consent") {
      return {
        label: "Parent Letter",
        icon: Mail,
        badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
        iconBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      };
    }
    return {
      label: `${type.replace(/_/g, " ")} Leave`,
      icon: Calendar,
      badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
      iconBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "present":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold text-xs gap-1">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Present
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 font-bold text-xs gap-1">
            <XCircle className="size-3 text-rose-600" />
            Absent
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold text-xs gap-1">
            <Clock className="size-3 text-amber-600" />
            Late
          </Badge>
        );
      case "leave":
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 font-bold text-xs gap-1">
            <Calendar className="size-3 text-blue-600" />
            Leave
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status || "—"}
          </Badge>
        );
    }
  };

  const getLeaveApprovalBadge = (leaveStatus: string) => {
    switch (leaveStatus?.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[11px] font-bold gap-1 py-0.5">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[11px] font-bold gap-1 py-0.5">
            <XCircle className="size-3 text-rose-600" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px] font-bold gap-1 py-0.5">
            <Clock className="size-3 text-amber-600 animate-pulse" />
            Pending Approval
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/5">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-semibold">Loading attendance register & records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Top Attendance KPI Highlight Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Attendance Rate Gauge Card */}
        <Card className="col-span-2 sm:col-span-1 rounded-2xl border-border/70 bg-gradient-to-br from-primary/10 via-card to-background shadow-sm">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Attendance Rate
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 border",
                  isHealthy
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : isWarning
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                )}
              >
                {isHealthy ? "On Track (≥75%)" : isWarning ? "Warning" : "Shortage (<75%)"}
              </Badge>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className={cn(
                  "text-3xl font-extrabold tracking-tight",
                  isHealthy ? "text-emerald-600 dark:text-emerald-400" : isWarning ? "text-amber-600" : "text-rose-600"
                )}>
                  {percentage}%
                </span>
                <span className="text-xs text-muted-foreground font-medium">overall</span>
              </div>
              <Progress
                value={percentage}
                className={cn(
                  "h-2 mt-2 rounded-full",
                  isHealthy ? "[&>div]:bg-emerald-500" : isWarning ? "[&>div]:bg-amber-500" : "[&>div]:bg-rose-500"
                )}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Across {summary?.total_recorded_dates ?? 0} total register working days
            </p>
          </CardContent>
        </Card>

        {/* Days Present Card */}
        <Card className="rounded-2xl border-border/70 bg-card shadow-sm hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Days Present
              </p>
              <p className="text-2xl font-extrabold text-foreground">
                {summary?.present ?? 0}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold">
                Class sessions attended
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Days Absent Card */}
        <Card className="rounded-2xl border-border/70 bg-card shadow-sm hover:border-rose-500/40 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
              <XCircle className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Days Absent
              </p>
              <p className="text-2xl font-extrabold text-foreground">
                {summary?.absent ?? 0}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Unexcused missed days
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Leaves & Medical Slips Card */}
        <Card className="rounded-2xl border-border/70 bg-card shadow-sm hover:border-blue-500/40 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
              <Calendar className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Leaves & Slips
              </p>
              <p className="text-2xl font-extrabold text-foreground">
                {summary?.leave ?? 0}
              </p>
              <p className="text-[10px] text-blue-600 font-semibold">
                {leaves.length} Applications filed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Monthly Attendance Timeline Grid ─────────────────────────────── */}
      {monthly.length > 0 && (
        <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="size-3.5 text-primary" />
              Monthly Attendance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {monthly.map((m: any) => {
                const mPct = m.percentage ?? 0;
                return (
                  <div
                    key={m.month}
                    className="p-3 rounded-xl border border-border/60 bg-muted/15 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground truncate">{m.month_name || m.month}</span>
                      <span className={cn(
                        "font-extrabold text-[11px]",
                        mPct >= 75 ? "text-emerald-600" : mPct >= 60 ? "text-amber-600" : "text-rose-600"
                      )}>
                        {mPct}%
                      </span>
                    </div>
                    <Progress
                      value={mPct}
                      className={cn(
                        "h-1.5 rounded-full",
                        mPct >= 75 ? "[&>div]:bg-emerald-500" : mPct >= 60 ? "[&>div]:bg-amber-500" : "[&>div]:bg-rose-500"
                      )}
                    />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                      <span>{m.present ?? 0}P / {m.absent ?? 0}A</span>
                      <span>{m.total_days ?? 0} days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Detail Tabs: Daily Register vs Leave Applications ─────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-muted/30 border border-border/60">
            <button
              type="button"
              onClick={() => setActiveSubTab("register")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeSubTab === "register"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Calendar className="size-3.5" />
              Daily Attendance Register ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("leaves")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeSubTab === "leaves"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <FileCheck className="size-3.5" />
              My Leave Applications ({leaves.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onOpenUploadLeave}
              className="rounded-xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-sm"
            >
              <UploadCloud className="size-3.5" />
              Apply for Leave / Upload Slip
            </Button>
            {onOpenProfileDrawer && (
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenProfileDrawer}
                className="rounded-xl text-xs font-bold gap-1.5 border-border/80"
              >
                <Eye className="size-3.5 text-muted-foreground" />
                360° Profile
              </Button>
            )}
          </div>
        </div>

        {/* ── Tab 1: Daily Register ───────────────────────────────────────── */}
        {activeSubTab === "register" && (
          <div className="space-y-3">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-muted-foreground mr-1">Filter by status:</span>
              {[
                { label: "All Days", value: "all" },
                { label: "Present", value: "present" },
                { label: "Absent", value: "absent" },
                { label: "Late", value: "late" },
                { label: "Leave", value: "leave" },
              ].map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setStatusFilter(chip.value)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-xl font-bold border transition-all cursor-pointer",
                    statusFilter === chip.value
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center bg-muted/5 space-y-2">
                <Calendar className="size-8 text-muted-foreground/40" />
                <p className="text-xs font-bold text-foreground">
                  No attendance records found for this filter.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Your daily attendance is recorded by your class teacher during roll call.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/70 overflow-hidden bg-card shadow-sm">
                <div className="divide-y divide-border/40">
                  {filteredRecords.map((r: any) => {
                    const recordDate = new Date(r.date + "T00:00:00");
                    const dateFormatted = recordDate.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={r.id || r.date}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/60 text-muted-foreground">
                            <Calendar className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {dateFormatted}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {r.marked_by ? `Marked by ${r.marked_by}` : "Class Register"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {r.remarks && (
                            <span className="text-[11px] text-muted-foreground italic max-w-xs truncate">
                              "{r.remarks}"
                            </span>
                          )}
                          {getStatusBadge(r.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: My Leave Applications & Physical Slips ───────────────── */}
        {activeSubTab === "leaves" && (
          <div className="space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-muted-foreground mr-1">Filter by category:</span>
              {[
                { label: "All Documents", value: "all" },
                { label: "Leave Applications", value: "leave" },
                { label: "Medical / Doctor Slips", value: "medical" },
                { label: "Parent Letters", value: "parent" },
              ].map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setSelectedVaultFilter(chip.value)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-xl font-bold border transition-all cursor-pointer",
                    selectedVaultFilter === chip.value
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {filteredLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center bg-muted/5 space-y-2">
                <FileCheck className="size-8 text-muted-foreground/40" />
                <p className="text-xs font-bold text-foreground">
                  No leave applications or medical slips submitted yet.
                </p>
                <p className="text-[11px] text-muted-foreground max-w-sm">
                  If you missed school due to illness or personal reasons, you can submit a leave application or upload a doctor's prescription slip here.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenUploadLeave}
                  className="mt-2 rounded-xl text-xs font-bold gap-1.5"
                >
                  <UploadCloud className="size-3.5" />
                  Submit Your First Leave Request
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredLeaves.map((item: any) => {
                  const meta = getDocumentMeta(item);
                  const Icon = meta.icon;
                  const title =
                    item.document_title ||
                    (item.leave_type ? item.leave_type.replace(/_/g, " ") : "Leave Application");

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-colors shadow-sm"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border", meta.iconBg)}>
                          <Icon className="size-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs capitalize text-foreground">
                              {title}
                            </span>
                            <Badge variant="outline" className={cn("text-[10px] font-bold py-0 h-5 border", meta.badgeClass)}>
                              {meta.label}
                            </Badge>
                            {getLeaveApprovalBadge(item.status)}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1 font-medium text-foreground/80">
                              <Calendar className="size-3 text-primary" />
                              {item.from_date}
                              {item.to_date && item.from_date !== item.to_date ? ` to ${item.to_date}` : ""}
                            </span>
                            {item.total_days && item.total_days > 1 && (
                              <Badge variant="secondary" className="text-[10px] font-semibold h-4 py-0">
                                {item.total_days} Days
                              </Badge>
                            )}
                            {item.auto_marked_attendance && (
                              <Badge className="text-[9px] font-semibold bg-emerald-500/10 text-emerald-700 border-emerald-500/20 py-0 h-4">
                                Auto-marked in Register
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-foreground/90 italic">
                            "{item.reason}"
                          </p>

                          {item.admin_remarks && (
                            <p className="text-[11px] text-muted-foreground bg-muted/40 rounded-lg p-1.5 border border-border/40">
                              <span className="font-semibold text-foreground">Teacher Remarks:</span> {item.admin_remarks}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {item.document_url ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setPreviewDoc({
                                open: true,
                                url: item.document_url,
                                name: item.document_original_name || "Physical Document",
                                title: item.document_title,
                                category: item.document_category,
                                type: item.leave_type,
                                dateRange: `${item.from_date}${item.to_date && item.from_date !== item.to_date ? ` - ${item.to_date}` : ""}`,
                                reason: item.reason,
                              })
                            }
                            className="h-8 gap-1.5 text-xs font-semibold rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                          >
                            <Eye className="size-3.5" />
                            View Attached Slip
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic px-2">
                            No document file attached
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Document Preview Lightbox Dialog ──────────────────────────────── */}
      <LeaveDocumentPreviewDialog
        open={previewDoc.open}
        onClose={() => setPreviewDoc((prev) => ({ ...prev, open: false }))}
        documentUrl={previewDoc.url}
        documentName={previewDoc.name}
        documentTitle={previewDoc.title}
        documentCategory={previewDoc.category}
        leaveType={previewDoc.type}
        dateRange={previewDoc.dateRange}
        reason={previewDoc.reason}
        studentName={studentName}
      />
    </div>
  );
}
