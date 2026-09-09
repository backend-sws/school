import React, { useState, useMemo } from "react";
import { Link } from "@inertiajs/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  UploadCloud,
  History,
  BookOpen,
  GraduationCap,
  Eye,
  Trash2,
  HeartPulse,
  Building,
  School,
  FileCheck,
  ArrowUpRight,
  Cloud,
  Mail,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  Filter,
  Download,
  Check,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LeaveDocumentPreviewDialog } from "./leaveDocumentPreviewDialog";
import { StudentLeaveUploadDialog } from "./studentLeaveUploadDialog";
import R2Api from "@/lib/api/r2Api";

interface StudentClassProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  userId?: number;
  classId?: number;
  studentName?: string;
  isStudent?: boolean;
  defaultTab?: string;
}

export function StudentClassProfileDrawer({
  open,
  onClose,
  userId,
  classId,
  studentName,
  isStudent = false,
  defaultTab,
}: StudentClassProfileDrawerProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>(defaultTab || "overview");

  React.useEffect(() => {
    if (open && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  // Selected session in Lifetime Journey (if inspecting past class)
  const [selectedHistoryClassId, setSelectedHistoryClassId] = useState<number | null>(null);

  // Leave / Document Upload Dialog State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>("leave");

  // Vault Filter Category State
  const [selectedVaultFilter, setSelectedVaultFilter] = useState<string>("all");

  // Document Preview Lightbox State
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

  // Rejection Dialog State
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    leaveId: number | null;
    studentName?: string;
    leaveType?: string;
    dateRange?: string;
    remarks: string;
  }>({
    open: false,
    leaveId: null,
    remarks: "",
  });

  // Delete Confirmation Dialog State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Effective classId: uses selected historical class if switched, else current classId
  const effectiveClassId = selectedHistoryClassId ?? classId;

  // Fetch 360 data
  const { data: profileRes, isLoading } = useQuery({
    queryKey: ["student-360-profile", effectiveClassId, userId],
    queryFn: () => {
      if (!userId) return null;
      if (effectiveClassId) {
        return lmsApi.studentRoster.student360(effectiveClassId, userId);
      }
      return lmsApi.studentRoster.global360(userId);
    },
    enabled: open && !!userId,
  });

  const profileData = (profileRes as any)?.data;
  const student = profileData?.student;
  const currentClass = profileData?.current_class;
  const attendance = profileData?.attendance;
  const tests = profileData?.tests;
  const leaves = (profileData?.leaves ?? []) as any[];
  const lifetimeJourney = profileData?.lifetime_journey;

  // Delete leave/document mutation
  const deleteLeaveMutation = useMutation({
    mutationFn: (leaveId: number) => lmsApi.studentRoster.deleteLeave(leaveId),
    onSuccess: () => {
      toast.success("Document record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["student-360-profile", effectiveClassId, userId] });
      queryClient.invalidateQueries({ queryKey: ["lms-class-students-summary", classId] });
      queryClient.invalidateQueries({ queryKey: ["attendance-monthly-matrix", classId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete document record.");
    },
  });

  // Approve / Reject leave mutation
  const updateLeaveStatusMutation = useMutation({
    mutationFn: ({
      leaveId,
      status,
      adminRemarks,
      syncAttendance = true,
    }: {
      leaveId: number;
      status: "approved" | "rejected";
      adminRemarks?: string;
      syncAttendance?: boolean;
    }) =>
      lmsApi.studentRoster.updateLeaveStatus(leaveId, {
        status,
        admin_remarks: adminRemarks,
        sync_attendance: syncAttendance,
      }),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "approved"
          ? "Leave application approved and attendance register synchronized."
          : "Leave application marked as rejected."
      );
      queryClient.invalidateQueries({ queryKey: ["student-360-profile", effectiveClassId, userId] });
      queryClient.invalidateQueries({ queryKey: ["lms-class-students-summary", classId] });
      queryClient.invalidateQueries({ queryKey: ["lms-class-attendance-today", classId] });
      queryClient.invalidateQueries({ queryKey: ["attendance-monthly-matrix", classId] });
      queryClient.invalidateQueries({ queryKey: ["student-own-attendance-hub"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update leave application status.");
    },
  });

  // Filter leaves/documents according to selected category
  const filteredDocuments = useMemo(() => {
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
    if (selectedVaultFilter === "academic") {
      return leaves.filter(
        (l) =>
          l.document_category === "academic" ||
          l.leave_type === "tc_copy" ||
          l.leave_type === "academic_cert"
      );
    }
    if (selectedVaultFilter === "other") {
      return leaves.filter(
        (l) =>
          !["leave", "medical"].includes(l.document_category) &&
          !["medical", "casual", "emergency", "duty"].includes(l.leave_type)
      );
    }
    return leaves;
  }, [leaves, selectedVaultFilter]);

  // Helper for document category badges & icons
  const getDocumentCategoryMeta = (item: any) => {
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
    if (cat === "academic" || type === "tc_copy" || type === "academic_cert") {
      return {
        label: "TC / Academic",
        icon: GraduationCap,
        badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
        iconBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      };
    }
    if (cat === "fee" || type === "fee_receipt" || type === "bank_challan") {
      return {
        label: "Fee Slip",
        icon: CreditCard,
        badgeClass: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
        iconBg: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      };
    }
    if (cat === "identity" || type === "id_proof" || type === "birth_cert") {
      return {
        label: "Govt ID / Proof",
        icon: ShieldCheck,
        badgeClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
        iconBg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      };
    }
    if (cat === "disciplinary" || type === "disciplinary") {
      return {
        label: "Disciplinary",
        icon: AlertTriangle,
        badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
        iconBg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      };
    }
    if (cat === "general" || type === "general_document") {
      return {
        label: "Physical Record",
        icon: FolderOpen,
        badgeClass: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-300 border-neutral-500/30",
        iconBg: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20",
      };
    }
    return {
      label: `${type} Leave`,
      icon: Calendar,
      badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
      iconBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    };
  };

  if (!open) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-3xl md:max-w-4xl p-0 flex flex-col border-l border-border/80 shadow-2xl bg-card"
        >
          {/* ── Top Header & Student Identity Banner ─────────────────────── */}
          <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-background to-primary/5 px-6 pt-6 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative size-16 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md bg-muted flex items-center justify-center">
                  <User className="size-8 text-muted-foreground" />
                  {student?.photo_url && (
                    <img
                      src={R2Api.imageSrc(student.photo_url)}
                      alt={student.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-background",
                      student?.enrollment_status === "active" ? "bg-emerald-500" : "bg-muted-foreground"
                    )}
                  />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SheetTitle className="text-xl font-extrabold text-foreground truncate">
                      {student?.name || studentName || "Student Profile"}
                    </SheetTitle>
                    {student?.roll_no && (
                      <Badge variant="secondary" className="font-bold text-xs bg-primary/15 text-primary border border-primary/20">
                        Roll #{student.roll_no}
                      </Badge>
                    )}
                    {student?.reg_no && (
                      <Badge variant="outline" className="font-semibold text-xs border-border/80">
                        Reg: {student.reg_no}
                      </Badge>
                    )}
                  </div>

                  <SheetDescription className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                    {currentClass && (
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <School className="size-3.5 text-primary" />
                        {currentClass.name} {currentClass.section ? `(${currentClass.section})` : ""}
                      </span>
                    )}
                    {currentClass?.session && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        {currentClass.session.name}
                      </span>
                    )}
                    {student?.mobile && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3 text-muted-foreground" />
                        {student.mobile}
                      </span>
                    )}
                  </SheetDescription>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {userId && (
                  <Link
                    href={`/students/manage/${userId}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-background/80 hover:bg-muted text-xs font-bold text-foreground transition-all shadow-xs"
                    title="Open full student profile in new tab"
                  >
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                    <span>Full Profile</span>
                  </Link>
                )}
                {classId && userId && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setUploadCategory("leave");
                      setUploadOpen(true);
                    }}
                    className="rounded-xl font-bold text-xs gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <UploadCloud className="size-4" />
                    + Upload Physical Copy
                  </Button>
                )}
              </div>
            </div>

            {/* Historical Session Indicator if switched */}
            {selectedHistoryClassId && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 text-xs text-amber-700 dark:text-amber-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <History className="size-3.5" />
                  Viewing Historical Archive: {currentClass?.name} ({currentClass?.session?.name})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedHistoryClassId(null)}
                  className="text-[11px] underline hover:text-foreground font-bold cursor-pointer"
                >
                  Return to Active Class
                </button>
              </div>
            )}
          </div>

          {/* ── Tabs Navigation ─────────────────────────────────────────── */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="border-b border-border/40 bg-muted/10 w-full overflow-x-auto overflow-y-hidden no-scrollbar">
              <TabsList className="h-12 bg-transparent p-0 px-6 gap-2 sm:gap-3 border-none shadow-none flex w-max min-w-full justify-start flex-nowrap items-center shrink-0">
                <TabsTrigger
                  value="overview"
                  className="shrink-0 whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-transparent rounded-xl px-3.5 py-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <User className="size-4 shrink-0" />
                  360° Bio & Info
                </TabsTrigger>
                <TabsTrigger
                  value="attendance"
                  className="shrink-0 whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-transparent rounded-xl px-3.5 py-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="size-4 shrink-0" />
                  Attendance & Document Vault ({leaves.length})
                </TabsTrigger>
                <TabsTrigger
                  value="tests"
                  className="shrink-0 whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-transparent rounded-xl px-3.5 py-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="size-4 shrink-0" />
                  LMS Tests & Exams ({tests?.summary?.completed ?? 0}/{tests?.summary?.total_assigned ?? 0})
                </TabsTrigger>
                <TabsTrigger
                  value="lifetime"
                  className="shrink-0 whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-transparent rounded-xl px-3.5 py-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <GraduationCap className="size-4 shrink-0" />
                  Lifetime Journey ({lifetimeJourney?.sessions_timeline?.length ?? 1} Sessions)
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Tab 1: 360° Bio & Overview ────────────────────────────── */}
            <TabsContent value="overview" className="flex-1 overflow-y-auto p-6 m-0 space-y-6">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <>
                  {/* Summary KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Card className="rounded-2xl border-border/60 bg-muted/20 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Attendance Rate
                        </p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">
                          {attendance?.summary?.percentage ?? 0}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {attendance?.summary?.present ?? 0} days present
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/60 bg-muted/20 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          LMS Tests Completed
                        </p>
                        <p className="text-2xl font-black text-blue-600 mt-1">
                          {tests?.summary?.completed ?? 0}/{tests?.summary?.total_assigned ?? 0}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {tests?.summary?.completion_rate ?? 0}% completed
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/60 bg-muted/20 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Physical Document Vault
                        </p>
                        <p className="text-2xl font-black text-amber-600 mt-1">
                          {leaves.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Cloud className="size-3 text-primary" /> Stored in R2 Vault
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/60 bg-muted/20 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Avg Test Score
                        </p>
                        <p className="text-2xl font-black text-purple-600 mt-1">
                          {tests?.summary?.average_score !== null && tests?.summary?.average_score !== undefined
                            ? `${tests.summary.average_score}%`
                            : "N/A"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Across submitted tests
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Personal & Parent Information */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Card className="rounded-2xl border-border/60 shadow-sm">
                      <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40 bg-muted/10">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <User className="size-4 text-primary" />
                          Personal & Contact Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-3.5 text-xs">
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Full Name</span>
                          <span className="font-bold text-foreground">{student?.name || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Email Address</span>
                          <span className="font-medium text-foreground">{student?.email || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Mobile Phone</span>
                          <span className="font-medium text-foreground">{student?.mobile || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Gender / DOB</span>
                          <span className="font-medium text-foreground">
                            {student?.gender ? student.gender.toUpperCase() : "—"} / {student?.dob || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Blood Group / Category</span>
                          <span className="font-medium text-foreground">
                            {student?.blood_group || "—"} / {student?.category || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Admission Date</span>
                          <span className="font-medium text-foreground">{student?.admission_date || "—"}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/60 shadow-sm">
                      <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40 bg-muted/10">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <Building className="size-4 text-primary" />
                          Parent & Guardian Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-3.5 text-xs">
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Father's Name</span>
                          <span className="font-bold text-foreground">{student?.father_name || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Father's Contact</span>
                          <span className="font-medium text-foreground">{student?.father_mobile || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Mother's Name</span>
                          <span className="font-bold text-foreground">{student?.mother_name || "—"}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">Residential Address</span>
                          <span className="font-medium text-foreground text-right max-w-[200px] truncate">
                            {student?.address ? `${student.address}, ${student.city || ""}` : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Previous School</span>
                          <span className="font-medium text-foreground">{student?.previous_school_name || "—"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Medical & Health Notes */}
                  {(student?.medical_condition || student?.allergy) && (
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 flex items-start gap-3">
                      <HeartPulse className="size-5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          Medical & Health Alerts
                        </p>
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {student?.medical_condition && <span>Condition: {student.medical_condition}. </span>}
                          {student?.allergy && <span>Allergies: {student.allergy}</span>}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* ── Tab 2: Attendance & Physical Document Vault ────────────── */}
            <TabsContent value="attendance" className="flex-1 overflow-y-auto p-6 m-0 space-y-6">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <>
                  {/* Attendance Stats Gauge */}
                  <div className="rounded-3xl border border-border/70 bg-muted/15 p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-extrabold text-foreground">
                          Attendance Performance ({currentClass?.name || "Class"})
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Calculated across all recorded register days
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-bold text-xs py-1 px-3">
                          {attendance?.summary?.present ?? 0} Present
                        </Badge>
                        <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/30 font-bold text-xs py-1 px-3">
                          {attendance?.summary?.absent ?? 0} Absent
                        </Badge>
                        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 font-bold text-xs py-1 px-3">
                          {attendance?.summary?.late ?? 0} Late
                        </Badge>
                        <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 font-bold text-xs py-1 px-3">
                          {attendance?.summary?.leave ?? 0} Leaves
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Overall Attendance Rate</span>
                        <span className="text-emerald-600">{attendance?.summary?.percentage ?? 0}%</span>
                      </div>
                      <Progress
                        value={attendance?.summary?.percentage ?? 0}
                        className="h-3 rounded-full bg-muted border border-border/40"
                      />
                    </div>
                  </div>

                  {/* ── Student Physical Document & Records Vault ───────────── */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                            <FolderOpen className="size-4 text-primary" />
                            Physical Document & Records Vault ({leaves.length})
                          </h4>
                          <Badge variant="outline" className="text-[10px] font-bold text-primary bg-primary/5 border-primary/20 flex items-center gap-1">
                            <Cloud className="size-3" /> Cloudflare R2
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Preserve scanned doctor prescriptions, parent letters, transfer certificates, fee receipts & leave applications.
                        </p>
                      </div>
                      {classId && userId && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setUploadCategory("leave");
                            setUploadOpen(true);
                          }}
                          className="rounded-xl font-bold text-xs gap-1.5 h-8 bg-primary text-primary-foreground shadow-sm"
                        >
                          <UploadCloud className="size-3.5" />
                          + Upload Document
                        </Button>
                      )}
                    </div>

                    {/* Filter Category Chips */}
                    {leaves.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 mr-1 shrink-0">
                          <Filter className="size-3" /> Filter:
                        </span>
                        {[
                          { key: "all", label: `All (${leaves.length})` },
                          { key: "leave", label: "Leave Slips" },
                          { key: "medical", label: "Medical" },
                          { key: "parent", label: "Parent Notes" },
                          { key: "academic", label: "TC & Academic" },
                          { key: "other", label: "Fee & Other" },
                        ].map((chip) => (
                          <button
                            key={chip.key}
                            type="button"
                            onClick={() => setSelectedVaultFilter(chip.key)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border",
                              selectedVaultFilter === chip.key
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted"
                            )}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {filteredDocuments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center bg-muted/5 space-y-2">
                        <FileCheck className="size-10 text-muted-foreground/40 mb-1" />
                        <p className="text-xs font-bold text-foreground">
                          {selectedVaultFilter === "all"
                            ? "No Physical Documents Recorded Yet"
                            : "No Documents Found in this Filter"}
                        </p>
                        <p className="text-[11px] text-muted-foreground max-w-sm">
                          Upload handwritten parent notes, medical certificates, TC copies, fee slips, or general physical documents to preserve them permanently in Cloudflare R2.
                        </p>
                        {classId && userId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUploadCategory("leave");
                              setUploadOpen(true);
                            }}
                            className="mt-2 rounded-xl text-xs font-bold gap-1.5"
                          >
                            <UploadCloud className="size-3.5" />
                            Upload First Document
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {filteredDocuments.map((item: any) => {
                          const meta = getDocumentCategoryMeta(item);
                          const Icon = meta.icon;
                          const title =
                            item.document_title ||
                            (item.leave_type ? item.leave_type.replace(/_/g, " ") : "Physical Document");

                          return (
                            <div
                              key={item.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-colors shadow-sm"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className={cn(
                                    "size-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5",
                                    meta.iconBg
                                  )}
                                >
                                  <Icon className="size-5" />
                                </div>

                                <div className="space-y-1.5 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className={cn("capitalize text-xs font-bold border", meta.badgeClass)}>
                                      {meta.label}
                                    </Badge>
                                    <span className="font-bold text-xs text-foreground truncate max-w-xs">
                                      {title}
                                    </span>

                                    {/* Leave Approval Status Badge */}
                                    {item.status === "approved" ? (
                                      <Badge className="text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 py-0 h-5">
                                        ✓ Approved
                                      </Badge>
                                    ) : item.status === "rejected" ? (
                                      <Badge className="text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 py-0 h-5">
                                        ✕ Rejected
                                      </Badge>
                                    ) : (
                                      <Badge className="text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 py-0 h-5">
                                        ⏳ Pending Approval
                                      </Badge>
                                    )}

                                    <span className="font-medium text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="size-3" />
                                      {item.from_date}
                                      {item.to_date && item.from_date !== item.to_date ? ` to ${item.to_date}` : ""}
                                    </span>
                                    {item.total_days && item.total_days > 1 && (
                                      <Badge variant="secondary" className="text-[10px] font-semibold">
                                        {item.total_days} Days
                                      </Badge>
                                    )}
                                    {item.auto_marked_attendance ? (
                                      <Badge className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 border-emerald-500/20 py-0 h-5">
                                        Auto-marked
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground py-0 h-5">
                                        Vault Record
                                      </Badge>
                                    )}
                                  </div>

                                  <p className="text-xs text-foreground/90 italic">
                                    "{item.reason}"
                                  </p>

                                  {item.admin_remarks && (
                                    <p className="text-[11px] text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/40 inline-block">
                                      <span className="font-semibold text-foreground">Teacher Remark:</span> {item.admin_remarks}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                                    <span>Recorded {item.created_at}</span>
                                    {item.approved_by && <span>• Approved by {item.approved_by}</span>}
                                    <span className="flex items-center gap-0.5 text-primary">
                                      <Cloud className="size-3" /> Cloudflare R2
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                                {/* Staff Approve / Reject Actions */}
                                {!isStudent && (
                                  <div className="flex items-center gap-1.5">
                                    {item.status === "pending" ? (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            updateLeaveStatusMutation.mutate({
                                              leaveId: item.id,
                                              status: "approved",
                                              syncAttendance: true,
                                            })
                                          }
                                          disabled={updateLeaveStatusMutation.isPending}
                                          className="h-8 gap-1 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                          title="Approve leave and record in attendance register as Leave (L)"
                                        >
                                          <Check className="size-3.5" />
                                          Approve
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setRejectDialog({
                                              open: true,
                                              leaveId: item.id,
                                              studentName: student?.name,
                                              leaveType: title,
                                              dateRange: `${item.from_date}${item.to_date && item.from_date !== item.to_date ? ` to ${item.to_date}` : ""}`,
                                              remarks: "",
                                            });
                                          }}
                                          disabled={updateLeaveStatusMutation.isPending}
                                          className="h-8 gap-1 text-xs font-bold rounded-xl border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                                          title="Reject leave application"
                                        >
                                          <X className="size-3.5" />
                                          Reject
                                        </Button>
                                      </>
                                    ) : item.status === "approved" ? (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          setRejectDialog({
                                            open: true,
                                            leaveId: item.id,
                                            studentName: student?.name,
                                            leaveType: title,
                                            dateRange: `${item.from_date}${item.to_date && item.from_date !== item.to_date ? ` to ${item.to_date}` : ""}`,
                                            remarks: "Approval revoked by teacher",
                                          });
                                        }}
                                        disabled={updateLeaveStatusMutation.isPending}
                                        className="h-8 text-[11px] text-muted-foreground hover:text-rose-600"
                                        title="Revoke approval"
                                      >
                                        Revoke
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          updateLeaveStatusMutation.mutate({
                                            leaveId: item.id,
                                            status: "approved",
                                            syncAttendance: true,
                                          })
                                        }
                                        disabled={updateLeaveStatusMutation.isPending}
                                        className="h-8 text-[11px] text-muted-foreground hover:text-emerald-600"
                                        title="Re-approve"
                                      >
                                        Approve
                                      </Button>
                                    )}
                                  </div>
                                )}

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
                                    View Physical Copy
                                  </Button>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground italic px-2">
                                    No scan attached
                                  </span>
                                )}

                                {!isStudent && (
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    onClick={() => setDeleteConfirmId(item.id)}
                                    disabled={deleteLeaveMutation.isPending}
                                    className="size-8 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                                    title="Delete record"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Daily Attendance Logs */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                      <Clock className="size-4 text-primary" />
                      Daily Register Log ({attendance?.records?.length ?? 0} Records)
                    </h4>
                    <div className="max-h-64 overflow-y-auto rounded-2xl border border-border/70 divide-y divide-border/40">
                      {attendance?.records?.length === 0 ? (
                        <p className="p-6 text-center text-xs text-muted-foreground">No attendance records found for this class.</p>
                      ) : (
                        attendance?.records?.map((record: any) => (
                          <div key={record.id} className="flex items-center justify-between p-3 text-xs">
                            <span className="font-semibold text-foreground flex items-center gap-1.5">
                              <Calendar className="size-3 text-muted-foreground" />
                              {record.date}
                            </span>
                            <div className="flex items-center gap-2">
                              {record.remarks && (
                                <span className="text-muted-foreground italic text-[11px] max-w-[200px] truncate">
                                  {record.remarks}
                                </span>
                              )}
                              <Badge
                                className={cn(
                                  "capitalize text-[10px] font-bold py-0 h-5",
                                  record.status === "present" && "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
                                  record.status === "absent" && "bg-rose-500/15 text-rose-600 border-rose-500/30",
                                  record.status === "late" && "bg-amber-500/15 text-amber-600 border-amber-500/30",
                                  record.status === "leave" && "bg-blue-500/15 text-blue-600 border-blue-500/30",
                                  record.status === "holiday" && "bg-purple-500/15 text-purple-600 border-purple-500/30"
                                )}
                              >
                                {record.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* ── Tab 3: LMS Tests & Exams Tracker ──────────────────────── */}
            <TabsContent value="tests" className="flex-1 overflow-y-auto p-6 m-0 space-y-6">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <>
                  {/* Test Progress Banner */}
                  <div className="rounded-3xl border border-border/70 bg-gradient-to-r from-blue-500/10 via-background to-blue-500/5 p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-extrabold text-foreground">
                          LMS Test & Exam Completion Tracker
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Progress across all tests assigned in {currentClass?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                            Completion Rate
                          </p>
                          <p className="text-xl font-black text-blue-600">
                            {tests?.summary?.completed ?? 0} / {tests?.summary?.total_assigned ?? 0} Tests
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Progress</span>
                        <span className="text-blue-600">{tests?.summary?.completion_rate ?? 0}%</span>
                      </div>
                      <Progress
                        value={tests?.summary?.completion_rate ?? 0}
                        className="h-3 rounded-full bg-muted border border-border/40"
                      />
                    </div>
                  </div>

                  {/* Assigned Tests Table */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                      <BookOpen className="size-4 text-primary" />
                      Classroom Tests & Attempts ({tests?.list?.length ?? 0})
                    </h4>

                    {tests?.list?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center bg-muted/5">
                        <BookOpen className="size-10 text-muted-foreground/40 mb-2" />
                        <p className="text-xs font-semibold text-foreground">No Tests Assigned in This Class</p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {tests?.list?.map((test: any) => {
                          const isSubmitted = test.attempt?.status === "submitted";
                          return (
                            <div
                              key={test.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-colors shadow-sm"
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-bold text-sm text-foreground truncate">
                                    {test.title}
                                  </h5>
                                  <Badge variant="outline" className="text-[10px] font-semibold">
                                    {test.duration_minutes ? `${test.duration_minutes} mins` : "Untimed"}
                                  </Badge>
                                  <Badge variant="secondary" className="text-[10px] font-semibold">
                                    Max: {test.max_marks} marks
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {test.description || "LMS Online Test & Assessment"}
                                </p>
                                {test.attempt?.submitted_at && (
                                  <p className="text-[10px] text-muted-foreground">
                                    Submitted on {test.attempt.submitted_at} • {test.attempt.attempts_count} attempt(s)
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                {isSubmitted ? (
                                  <div className="flex items-center gap-2 text-right">
                                    <div>
                                      <p className="text-xs font-black text-foreground">
                                        Score: {test.attempt.score} / {test.max_marks}
                                      </p>
                                      <p className="text-[10px] font-bold text-emerald-600">
                                        {test.attempt.percentage}% Achieved
                                      </p>
                                    </div>
                                    <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs font-bold py-1">
                                      Completed
                                    </Badge>
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30 text-xs font-bold py-1">
                                    Not Attempted
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>

            {/* ── Tab 4: Lifetime Academic Journey & Archives ───────────── */}
            <TabsContent value="lifetime" className="flex-1 overflow-y-auto p-6 m-0 space-y-6">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <>
                  <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 space-y-1">
                    <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                      <GraduationCap className="size-4 text-primary" />
                      Lifetime Academic Timeline & Historical Archive
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      All past attendance records, LMS test attempts, and uploaded physical documents are permanently preserved across class upgrades, promotions, and readmissions. Click any session to inspect past records.
                    </p>
                  </div>

                  {/* Sessions Timeline Cards */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Chronological Enrolled Classes ({lifetimeJourney?.sessions_timeline?.length ?? 0})
                    </h4>

                    <div className="grid gap-3.5">
                      {lifetimeJourney?.sessions_timeline?.map((sessionItem: any, idx: number) => {
                        const isSelected = effectiveClassId === sessionItem.class_id;
                        return (
                          <div
                            key={sessionItem.enrollment_id || idx}
                            onClick={() => setSelectedHistoryClassId(sessionItem.class_id)}
                            className={cn(
                              "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer shadow-sm",
                              isSelected
                                ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                                : "border-border/70 bg-card hover:border-primary/50 hover:bg-muted/10"
                            )}
                          >
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-sm text-foreground">
                                  {sessionItem.class_name} {sessionItem.section ? `(Section ${sessionItem.section})` : ""}
                                </span>
                                <Badge variant="outline" className="font-semibold text-xs border-border/80 bg-background">
                                  {sessionItem.session_name}
                                </Badge>
                                <Badge
                                  className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider py-0 h-5",
                                    sessionItem.enrollment_status === "active"
                                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                      : "bg-blue-500/15 text-blue-600 border-blue-500/30"
                                  )}
                                >
                                  {sessionItem.enrollment_status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Stream: {sessionItem.stream_name || "General"} • Enrolled: {sessionItem.enrolled_at || "—"}
                              </p>
                            </div>

                            {/* Metrics Snapshot */}
                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-muted-foreground">Attendance</p>
                                  <p className="text-xs font-black text-emerald-600">
                                    {sessionItem.metrics?.attendance_percentage ?? 0}%
                                  </p>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-muted-foreground">Tests</p>
                                  <p className="text-xs font-black text-blue-600">
                                    {sessionItem.metrics?.tests_completed ?? 0}/{sessionItem.metrics?.tests_assigned ?? 0}
                                  </p>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-muted-foreground">Documents</p>
                                  <p className="text-xs font-black text-amber-600">
                                    {sessionItem.metrics?.leaves_uploaded ?? 0} Vault
                                  </p>
                                </div>
                              </div>

                              <Button
                                size="sm"
                                variant={isSelected ? "default" : "outline"}
                                className="h-8 rounded-xl text-xs font-bold gap-1 ml-2"
                              >
                                {isSelected ? "Active View" : "Inspect Archive"}
                                <ArrowUpRight className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transition Audit Trail */}
                  {lifetimeJourney?.transitions?.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Promotion & Readmission Audit Log ({lifetimeJourney.transitions.length})
                      </h4>
                      <div className="rounded-2xl border border-border/70 divide-y divide-border/40">
                        {lifetimeJourney.transitions.map((t: any) => (
                          <div key={t.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-foreground capitalize">
                                {t.type}: {t.from_class || t.from_session} → {t.to_class || t.to_session}
                              </span>
                              {t.remarks && <p className="text-[11px] text-muted-foreground italic mt-0.5">"{t.remarks}"</p>}
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              Processed by {t.processed_by || "System"} on {t.processed_at}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Document Lightbox Preview Modal */}
      <LeaveDocumentPreviewDialog
        open={previewDoc.open}
        onClose={() => setPreviewDoc({ open: false, url: null, name: null })}
        documentUrl={previewDoc.url}
        documentName={previewDoc.name}
        documentTitle={previewDoc.title}
        documentCategory={previewDoc.category}
        leaveType={previewDoc.type}
        dateRange={previewDoc.dateRange}
        reason={previewDoc.reason}
        studentName={student?.name || studentName}
      />

      {/* Universal Physical Document Upload Modal */}
      {classId && userId && (
        <StudentLeaveUploadDialog
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          classId={classId}
          userId={userId}
          studentName={student?.name || studentName}
          defaultCategory={uploadCategory}
          isStudent={isStudent}
        />
      )}

      {/* ── Rejection Remarks Modal Dialog ────────────────────────── */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(isOpen) => !isOpen && setRejectDialog((prev) => ({ ...prev, open: false }))}
      >
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80 p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20 shrink-0">
                <X className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-extrabold text-foreground">
                  Reject Leave Request
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {rejectDialog.studentName ? `${rejectDialog.studentName} • ` : ""}
                  {rejectDialog.leaveType || "Leave Request"}
                  {rejectDialog.dateRange ? ` (${rejectDialog.dateRange})` : ""}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-2 py-3">
            <Label className="text-xs font-bold text-foreground">
              Rejection Reason or Remarks (Optional)
            </Label>
            <Textarea
              value={rejectDialog.remarks}
              onChange={(e) => setRejectDialog((prev) => ({ ...prev, remarks: e.target.value }))}
              placeholder="e.g. Doctor's medical certificate missing, prior approval required, dates invalid..."
              rows={3}
              className="rounded-2xl border-border/70 text-xs resize-none placeholder:text-muted-foreground/60"
            />
            <p className="text-[11px] text-muted-foreground">
              These remarks will be displayed on the student's leave ledger in their portal.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialog((prev) => ({ ...prev, open: false }))}
              disabled={updateLeaveStatusMutation.isPending}
              className="rounded-xl text-xs font-semibold h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!rejectDialog.leaveId) return;
                updateLeaveStatusMutation.mutate(
                  {
                    leaveId: rejectDialog.leaveId,
                    status: "rejected",
                    adminRemarks: rejectDialog.remarks.trim() || undefined,
                  },
                  {
                    onSettled: () => setRejectDialog((prev) => ({ ...prev, open: false })),
                  }
                );
              }}
              disabled={updateLeaveStatusMutation.isPending}
              className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white gap-1.5 h-9 shadow-sm"
            >
              <X className="size-3.5" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Leave / Document Confirmation Dialog ─────────────── */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(isOpen) => !isOpen && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80 p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20 shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-extrabold text-foreground">
                  Delete Document Record?
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  This will permanently delete this leave application and its uploaded scan from Cloudflare R2 vault.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleteLeaveMutation.isPending}
              className="rounded-xl text-xs font-semibold h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (!deleteConfirmId) return;
                deleteLeaveMutation.mutate(deleteConfirmId, {
                  onSettled: () => setDeleteConfirmId(null),
                });
              }}
              disabled={deleteLeaveMutation.isPending}
              className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white gap-1.5 h-9 shadow-sm"
            >
              <Trash2 className="size-3.5" />
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
