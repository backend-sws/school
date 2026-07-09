import React, { useMemo, useState } from "react";
import FullPageLayout from "@/layouts/full-page-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Printer,
  Download,
  Ban,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Info,
  Clock,
  ShieldCheck,
  AlertCircle,
  Hash,
  MapPin,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdmissionApi from "@/lib/api/admissionApi";
import { ApplicationQueryKeys } from "@/lib/querykey/application";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { TotalSummaryCard } from "@/components/admission/TotalSummaryCard";
import { RecordPaymentDialog } from "@/components/admission/RecordPaymentDialog";
import { computeAdmissionDetailSummary } from "@/lib/utils";
import api from "@/lib/api/api";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCurrency, MATRIX_ADMISSION_COLUMNS } from "@/constants/accounts/ledgerDetailConfig";
import Each from "@/components/Each";
import {
  APPLICATION_SHOW_BREADCRUMBS,
  APPLICATION_STATUS_COLORS,
  APPLICATION_STATUS_DOT_COLORS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_DOT_COLORS,
} from "@/constants/page/admin/applicationShow";

const ApplicationsShow = () => {
  const { props } = usePage();
  const { id, course_for: inertiaScope } = props as unknown as { id: number | string; course_for?: "school" | "college" };
  const queryClient = useQueryClient();

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ApplicationQueryKeys.detail(id),
    queryFn: () => AdmissionApi.show(id),
    enabled: !!id,
    retry: false,
  });

  const response = data as { success?: boolean; data?: Record<string, any> };
  const application = response?.data ?? (data as Record<string, any>);
  const enrolledUserId = application?.user_id ? Number(application.user_id) : null;

  const { data: ledgerRes, isLoading: ledgerLoading } = useQuery({
    queryKey: ["application-student-ledger", enrolledUserId],
    queryFn: () => api.get(`/fees/ledger/student/${enrolledUserId}`),
    enabled: !!enrolledUserId && application?.process_status === "approved",
  });

  const ledgerMatrix = (ledgerRes as any)?.data?.matrix ?? [];
  const feeBreakdown = (application?.fee_breakdown as Array<{ name?: string; amount?: number; type?: string; category?: string }>) ?? [];
  const isSchool = (inertiaScope || application?.admission_head?.course_for) === "school";
  
  const summary = useMemo(() => {
    if (!application) {
      return {
        feeTotal: 0,
        transportTotal: 0,
        hostelTotal: 0,
        inventoryTotal: 0,
        discountTotal: 0,
        cashAmount: 0,
        onlineAmount: 0,
        totalPaid: 0,
        dueAmount: 0,
        grandTotal: 0,
      };
    }
    return computeAdmissionDetailSummary(application);
  }, [application]);

  const processMutation = useMutation({
    mutationFn: (payload: { status: string; remarks?: string }) =>
      AdmissionApi.process(id, payload),
    onSuccess: (_data, variables) => {
      const isApproved = variables.status === "approved";
      toast.success(isApproved ? "Application approved. Applicant has been onboarded as a student and will appear in the students list." : "Application rejected successfully.");
      queryClient.invalidateQueries({ queryKey: ApplicationQueryKeys.detail(id) });
      setIsRejectDialogOpen(false);
      setRejectRemarks("");
    },
    onError: (_err, variables) => {
      const isApproved = variables?.status === "approved";
      toast.error(isApproved ? "Failed to approve application." : "Failed to reject application.");
    },
  });

  const handleReject = () => {
    processMutation.mutate({ status: "rejected", remarks: rejectRemarks });
  };

  const handleApprove = () => {
    processMutation.mutate({ status: "approved" });
  };

  const paymentDone = application?.payment_status === "success" || application?.payment_status === "paid";
  const canShowApprove = paymentDone && application?.process_status === "pending";

  const handleCopyId = () => {
    if (application?.application_id) {
      navigator.clipboard.writeText(String(application.application_id));
      setCopied(true);
      toast.success("Application ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const breadcrumbs = APPLICATION_SHOW_BREADCRUMBS(id, application?.application_id ? String(application.application_id) : undefined);

  /** Academic details – must run before any early return to satisfy Rules of Hooks */
  const { academicDetails, academicDisplayItems } = useMemo(() => {
    if (!application) {
      return { academicDetails: {} as Record<string, string>, academicDisplayItems: [] as { label: string; value: string; isSemester?: boolean }[] };
    }
    const sessionName = application.session?.name || application.session_name || null;
    const mainProgram =
      application.main_stream_name ??
      application.admission_head?.main_stream?.name ??
      application.admission_head?.mainStream?.name ??
      application.admissionHead?.main_stream?.name ??
      application.admissionHead?.mainStream?.name ??
      application.admission_head?.stream?.main_stream?.name ??
      application.admission_head?.stream?.mainStream?.name ??
      application.admissionHead?.stream?.main_stream?.name ??
      application.admissionHead?.stream?.mainStream?.name ??
      application.stream?.main_stream?.name ??
      application.stream?.mainStream?.name ??
      null;
    const branchStream =
      application.branch_stream_name ??
      (application.admission_head?.stream?.name ||
        application.admissionHead?.stream?.name ||
        application.lms_class?.name ||
        application.lmsClass?.name ||
        application.class_name ||
        application.stream?.name ||
        null);
    const sectionOrSemester = isSchool
      ? (application.lms_section?.name || application.lmsSection?.name || application.section_name || null)
      : (application.semester != null && application.semester !== "" ? String(application.semester) : null);

    const hasValue = (v: string | null | undefined) =>
      v != null && v !== "" && v !== "—" && String(v).toUpperCase() !== "N/A";

    const details: Record<string, string> = {};
    if (hasValue(sessionName)) details[isSchool ? "academic_session" : "admission_session"] = sessionName!;
    if (hasValue(mainProgram!)) details[isSchool ? "program_level" : "main_program"] = mainProgram!;
    if (hasValue(branchStream!)) details[isSchool ? "admission_class" : "branch_stream"] = branchStream!;
    if (hasValue(sectionOrSemester!)) details[isSchool ? "provisional_section" : "current_semester"] = sectionOrSemester!;

    const sessionLabel = isSchool ? "Academic Session" : "Admission Session";
    const mainLabel = isSchool ? "Program / Level" : "Main Stream";
    const branchLabel = isSchool ? "Admission Class" : "Branch / Stream";
    const sectionLabel = isSchool ? "Provisional Section" : "Current Semester";

    const displayItems: { label: string; value: string; isSemester?: boolean }[] = [];
    if (hasValue(sessionName)) displayItems.push({ label: sessionLabel, value: sessionName! });
    displayItems.push({ label: mainLabel, value: mainProgram && hasValue(mainProgram) ? mainProgram : "—" });
    if (hasValue(branchStream!)) displayItems.push({ label: branchLabel, value: branchStream! });
    if (hasValue(sectionOrSemester!)) displayItems.push({ label: sectionLabel, value: sectionOrSemester!, isSemester: !isSchool });

    return { academicDetails: details, academicDisplayItems: displayItems };
  }, [application, inertiaScope, isSchool]);

  if (isLoading) {
    return (
      <>
        <Head title="Loading..." />
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
          <div className="size-12 relative">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium">Loading application details...</p>
        </div>
      </>
    );
  }

  if (!application || isError) {
    return (
      <>
        <Head title="Not Found" />
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center px-4">
          <AlertCircle className="size-12 text-muted-foreground/30" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Application Not Found</h2>
            <p className="text-muted-foreground text-sm">
              {isError
                ? "This application may have been deleted or you may not have access to it."
                : "The application you are looking for does not exist."}
            </p>
          </div>
          <Link href="/admission/applications">
            <Button variant="outline" className="rounded-xl">Return to List</Button>
          </Link>
        </div>
      </>
    );
  }

  const statusColors = APPLICATION_STATUS_COLORS;
  const statusDotColors = APPLICATION_STATUS_DOT_COLORS;
  const paymentColors = PAYMENT_STATUS_COLORS;
  const paymentDotColors = PAYMENT_STATUS_DOT_COLORS;

  return (
    <>
      <Head title={`${application.applicant_name ?? "Application"} – ${application.application_id}`} />

      {/* Hero Header Section */}
      <div className="relative border-b bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold uppercase tracking-wider">
                  <Hash className="size-3" /> {application.application_id}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyId}
                    className="ml-1 h-6 w-6 hover:text-primary/70"
                    title="Copy ID"
                  >
                    {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                  <Clock className="size-3" /> Submitted on {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                {application.applicant_name}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-10">

            {/* Financial Summary Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <CreditCard className="size-5" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">Financial Summary</h3>
              </div>

              <TotalSummaryCard
                feeTotal={summary.feeTotal}
                transportTotal={summary.transportTotal}
                hostelTotal={summary.hostelTotal}
                inventoryTotal={summary.inventoryTotal}
                discountTotal={summary.discountTotal}
                scope={isSchool ? "school" : "college"}
                cashAmount={summary.cashAmount}
                onlineAmount={summary.onlineAmount}
                dueAmount={summary.dueAmount}
              />

              {feeBreakdown.length > 0 && (
                <Card className="rounded-xl border shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                          <TableHead className="px-6 py-3 font-bold uppercase tracking-wider text-[10px]">Fee Type</TableHead>
                          <TableHead className="px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-right">Category</TableHead>
                          <TableHead className="px-6 py-3 font-bold uppercase tracking-wider text-[10px] text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <Each
                          of={feeBreakdown}
                          keyExtractor={(item, index) => `${item.name}-${index}`}
                          render={(item) => (
                            <TableRow>
                              <TableCell className="px-6 py-3 font-semibold text-sm">{item.name ?? "Fee"}</TableCell>
                              <TableCell className="px-6 py-3 text-right text-xs uppercase text-muted-foreground">{item.category ?? item.type ?? "—"}</TableCell>
                              <TableCell className="px-6 py-3 text-right tabular-nums font-bold">{formatCurrency(item.amount ?? 0)}</TableCell>
                            </TableRow>
                          )}
                        />
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {enrolledUserId && application.process_status === "approved" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-bold tracking-tight">Monthly Fee Schedule</h4>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/accounts/fee-hub/students?student=${enrolledUserId}`}>Open Full Ledger</Link>
                    </Button>
                  </div>
                  {ledgerLoading ? (
                    <p className="text-sm text-muted-foreground">Loading monthly schedule…</p>
                  ) : ledgerMatrix.length > 0 ? (
                    <Card className="rounded-xl border shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted hover:bg-muted">
                              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase">Month</TableHead>
                              <Each
                                of={MATRIX_ADMISSION_COLUMNS}
                                keyExtractor={(col) => col.key}
                                render={(col) => (
                                  <TableHead key={col.key} className="px-4 py-3 text-[10px] font-bold uppercase text-right">{col.label}</TableHead>
                                )}
                              />
                              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase text-right">Monthly Fee</TableHead>
                              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase text-right">Arrears</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <Each
                              of={ledgerMatrix}
                              keyExtractor={(row: any) => row.month_key}
                              render={(row: any) => (
                                <TableRow>
                                  <TableCell className="px-4 py-3 font-semibold text-sm">{row.month_name}</TableCell>
                                  <Each
                                    of={MATRIX_ADMISSION_COLUMNS}
                                    keyExtractor={(col) => col.key}
                                    render={(col) => (
                                      <TableCell key={col.key} className="px-4 py-3 text-right tabular-nums text-sm">
                                        {formatCurrency(row[col.rowField!] ?? 0, col.format === "currency-positive")}
                                      </TableCell>
                                    )}
                                  />
                                  <TableCell className="px-4 py-3 text-right tabular-nums text-sm">{formatCurrency(row.monthly_total ?? 0)}</TableCell>
                                  <TableCell className="px-4 py-3 text-right tabular-nums text-sm text-rose-600">{formatCurrency(row.balance ?? 0, true)}</TableCell>
                                </TableRow>
                              )}
                            />
                          </TableBody>
                        </Table>
                      </div>
                    </Card>
                  ) : (
                    <p className="text-sm text-muted-foreground">No monthly fee schedule available yet.</p>
                  )}
                </div>
              )}
            </section>

            <Separator className="bg-border/50" />

            {/* Applicant Information Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <User className="size-5" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard
                  icon={ShieldCheck}
                  label="Father's Name"
                  value={application.father_name}
                />
                <InfoCard
                  icon={ShieldCheck}
                  label="Mother's Name"
                  value={application.mother_name}
                />
                <InfoCard
                  icon={Calendar}
                  label="Date of Birth"
                  value={application.dob ? new Date(application.dob).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                />
                <InfoCard
                  icon={User}
                  label="Gender / Category"
                  value={`${application.gender ?? "—"} / ${application.category ?? "—"}`}
                />
                <InfoCard
                  icon={Phone}
                  label="Mobile Number"
                  value={application.mobile}
                />
                <InfoCard
                  icon={Mail}
                  label="Email Address"
                  value={application.email}
                  className="lowercase"
                />
              </div>
            </section>

            <Separator className="bg-border/50" />

            {/* Academic Section — only required/present data (academicDetails object has no empty or N/A) */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap className="size-5" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">Academic Details</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl border-2 border-primary/10 bg-primary/[0.02] p-6 shadow-sm">
                  {academicDisplayItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Each
                        of={academicDisplayItems}
                        keyExtractor={(item) => item.label}
                        render={(item, index) => (
                          <div className={`space-y-1.5 ${index > 0 ? "border-l border-border/40 md:pl-6" : ""}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              {item.label}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold text-foreground">{item.value}</p>
                              {item.isSemester && (
                                <Badge variant="outline" className="text-[10px] font-bold uppercase bg-background border-primary/20">
                                  Level {application.semester ?? 1}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No academic details recorded.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border-2 border-border bg-muted/5 p-6 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-background border flex items-center justify-center">
                        <MapPin className="size-5 text-primary/70" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Application Type</p>
                        <h4 className="text-lg font-bold capitalize">{application.application_type ?? "General"}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-border bg-muted/5 p-6 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-background border flex items-center justify-center">
                        <GraduationCap className="size-5 text-primary/70" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Previous Board</p>
                        <h4 className="text-lg font-bold">{application.previous_board ?? "N/A"}</h4>
                      </div>
                    </div>
                    {application.previous_marks && (
                      <div className="mt-4 inline-block px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                        {application.previous_marks}% Marks Recorded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar Actions Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border-2 border-border bg-background p-6 space-y-8">
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Status</p>
                  <Badge variant="outline" className={`w-full py-2.5 text-sm font-bold rounded-xl border-2 justify-center ${paymentColors[application.payment_status as string] ?? paymentColors.pending}`}>
                    <div className={`size-2 rounded-full mr-2 ${paymentDotColors[application.payment_status as string] ?? paymentDotColors.pending}`} />
                    {String(application.payment_status ?? "pending").toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Application Status</p>
                  <Badge variant="outline" className={`w-full py-2.5 text-sm font-bold rounded-xl border-2 justify-center ${statusColors[application.process_status as string] || statusColors.pending}`}>
                    <div className={`size-2 rounded-full mr-2 ${statusDotColors[application.process_status as string] ?? statusDotColors.pending}`} />
                    {String(application.process_status ?? "pending").toUpperCase()}
                  </Badge>
                  {application.process_status === "approved" && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-green-600 shrink-0" />
                      Onboarded as student — appears in the students list.
                    </p>
                  )}
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold tracking-tight">Quick Actions</h4>
                  <p className="text-muted-foreground text-xs">Management tools</p>
                </div>

                <div className="grid gap-2">
                  <ActionBtn
                    icon={Printer}
                    label="Print Application"
                    href={`/api/v1/applications/${id}/invoice?view=print`}
                  />
                  <ActionBtn
                    icon={Download}
                    label="Get Receipt"
                    href={`/api/v1/applications/${id}/invoice`}
                  />
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-between rounded-xl border border-border hover:bg-muted/50 transition-all px-4 bg-background"
                    onClick={() => setIsPaymentDialogOpen(true)}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="size-4 text-muted-foreground" />
                      <span className="font-bold text-sm">Record Payment</span>
                      {summary.dueAmount > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 rounded-full">
                          Due ₹{summary.dueAmount.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="size-4 opacity-30" />
                  </Button>

                  {canShowApprove && (
                    <Button
                      variant="default"
                      className="w-full h-12 justify-between rounded-xl px-4 bg-green-600 text-white hover:bg-green-700"
                      onClick={handleApprove}
                      disabled={processMutation.isPending}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="size-4" />
                        <span className="font-bold text-sm">Approve Admission</span>
                      </div>
                      <ChevronRight className="size-4 opacity-50" />
                    </Button>
                  )}

                  {application.process_status === "pending" && (
                    <Button
                      variant="destructive"
                      className="w-full h-12 justify-between rounded-xl px-4 bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setIsRejectDialogOpen(true)}
                    >
                      <div className="flex items-center gap-2.5">
                        <Ban className="size-4" />
                        <span className="font-bold text-sm">Reject Application</span>
                      </div>
                      <ChevronRight className="size-4 opacity-50" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Concierge Support</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="size-3.5 text-muted-foreground" />
                  <span className="font-medium">{(props as any).institution?.phone || '+91 1234567890'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <span className="font-medium">{(props as any).institution?.email || 'admission@institution.edu'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <Ban className="size-6" /> Reject Application
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to reject <span className="font-bold text-foreground">{application.applicant_name}</span>? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="remarks" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reason for rejection</Label>
            <Textarea
              id="remarks"
              placeholder="Enter remarks..."
              className="rounded-xl border-2 min-h-[100px] text-sm"
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)} disabled={processMutation.isPending} className="rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processMutation.isPending} className="rounded-xl px-6">
              {processMutation.isPending ? "Processing..." : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <RecordPaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        applicationId={id}
        application={application}
        scope={isSchool ? "school" : "college"}
      />
    </>
  );
};

ApplicationsShow.layoutProps = {
  backHref: "/admission/applications",
  backLabel: "Back",
};

// Internal Helper Components
const InfoCard = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value?: string, className?: string }) => (
  <div className="space-y-1.5 p-3.5 rounded-xl bg-muted/5 border-2 border-transparent hover:border-border transition-colors">
    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 text-primary/60" />
      <p className={`text-base font-bold text-foreground tracking-tight leading-none ${className}`}>
        {value || "—"}
      </p>
    </div>
  </div>
);

const ActionBtn = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => (
  <Button variant="outline" className="w-full h-12 justify-between rounded-xl border border-border hover:bg-muted/50 transition-all px-4 bg-background" asChild>
    <a href={href} target={href.includes('api') ? "_blank" : "_self"} rel="noopener noreferrer">
      <div className="flex items-center gap-2.5">
        <Icon className="size-4 text-muted-foreground" />
        <span className="font-bold text-sm">{label}</span>
      </div>
      <ChevronRight className="size-4 opacity-30" />
    </a>
  </Button>
);

export default ApplicationsShow;
