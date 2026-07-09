import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import FullPageLayout from "@/layouts/full-page-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StudentApi from "@/lib/api/studentApi";
import { StudentQueryKeys } from "@/lib/querykey/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Hash,
  GraduationCap,
  Pencil,
  Mail as MailIcon,
  Copy,
  Power,
  Calendar,
  BookOpen,
  Users,
  MapPin,
  Droplets,
  CreditCard,
  ShieldCheck,
  Building2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { PermissionGate } from "@/components/PermissionGate";
import { getStudentProfileDisplayConfig } from "@/constants/scopeTypeDisplay";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { cn, copyToClipboard } from "@/lib/utils";
import { VerifiedDocumentsCard } from "@/components/student/VerifiedDocumentsCard";
import Each from "@/components/Each";
import {
  getStudentShowSections,
  getHeroInfoPills,
  STUDENT_SHOW_ACTIONS,
  STUDENT_SHOW_BREADCRUMBS,
  resolveFieldValue,
  type FieldConfig,
  type SectionConfig,
  type ActionConfig,
  type HeroInfoPill,
} from "@/constants/students/studentShowConfig";

// ─── Reusable sub-components ─────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  const v = value ?? "—";
  return (
    <div className="flex gap-3 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 flex items-center justify-between gap-2 text-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "mt-0.5 font-medium text-foreground",
              mono && "font-mono text-sm"
            )}
          >
            {v}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b bg-muted/30 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

/** Pill style map for hero info pills */
const PILL_VARIANT_CLASSES: Record<string, string> = {
  muted: "bg-muted border border-border",
  primary: "bg-primary/10 border border-primary/20",
  dashed: "bg-muted/50 border border-dashed border-border",
};

function HeroPill({
  pill,
  value,
}: {
  pill: HeroInfoPill;
  value: any;
}) {
  if (!value) return null;
  const PillIcon = pill.icon;
  return (
    <div className={cn("px-3 py-1 rounded-full flex items-center gap-2", PILL_VARIANT_CLASSES[pill.variant])}>
      {PillIcon && <PillIcon className={cn("h-3 w-3", pill.variant === "primary" ? "text-primary" : "text-muted-foreground")} />}
      {pill.label && (
        <span className={cn("text-[10px] font-black uppercase", pill.variant === "primary" ? "text-primary" : "text-muted-foreground")}>
          {pill.label}
        </span>
      )}
      <span
        className={cn(
          "text-xs font-bold",
          pill.variant === "primary" ? "text-primary" : pill.variant === "dashed" ? "text-muted-foreground font-medium" : "text-foreground",
          pill.mono && "font-mono"
        )}
      >
        {String(value)}
      </span>
    </div>
  );
}

// ─── Config-driven section renderer ──────────────────────────────────────────

function ConfigDrivenSection({
  section,
  student,
  profile,
  scopeType,
  permAddr,
  corrAddr,
  onAction,
  isVerified,
}: {
  section: SectionConfig;
  student: Record<string, any>;
  profile: Record<string, any> | null;
  scopeType: string | null;
  permAddr: Record<string, unknown> | null;
  corrAddr: Record<string, unknown> | null;
  onAction?: (key: string) => void;
  isVerified?: boolean;
}) {
  // Address sections are special
  if (section.layout === "address") {
    const addr = section.key === "permanent_address" ? permAddr : corrAddr;
    return (
      <SectionCard title={section.title} icon={section.icon}>
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {formatAddress(addr)}
        </p>
      </SectionCard>
    );
  }

  // Filter fields that have a showWhen predicate
  const visibleFields = section.fields.filter((field) => {
    if (!field.showWhen) return true;
    const raw = resolveFieldValue(field.path, student, profile);
    return field.showWhen(raw);
  });

  if (section.layout === "list") {
    return (
      <SectionCard title={section.title} icon={section.icon}>
        <div className="space-y-1">
          <Each
            of={visibleFields}
            keyExtractor={(f: FieldConfig) => f.key}
            render={(field: FieldConfig, idx: number) => {
              const raw = resolveFieldValue(field.path, student, profile);
              const display = field.format ? field.format(raw, scopeType) : raw;
              const isEmailRow = field.key === "email" && !isVerified;

              return (
                <div key={field.key}>
                  {idx > 0 && <Separator />}
                  <InfoRow
                    icon={field.icon}
                    label={field.label}
                    value={display}
                    mono={field.mono}
                  >
                    {isEmailRow && onAction && (
                      <div className="flex items-center gap-1">
                        <TooltipWrapper content="Copy Verification Link">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="h-7 w-7 text-primary hover:bg-primary/10"
                            onClick={() => onAction("copy_link")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipWrapper>
                        <TooltipWrapper content="Resend Verification">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="h-7 w-7 text-primary hover:bg-primary/10"
                            onClick={() => onAction("resend_verification")}
                          >
                            <MailIcon className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipWrapper>
                      </div>
                    )}
                  </InfoRow>
                </div>
              );
            }}
          />
        </div>
      </SectionCard>
    );
  }

  // grid layout
  return (
    <SectionCard title={section.title} icon={section.icon}>
      <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
        <Each
          of={visibleFields}
          keyExtractor={(f: FieldConfig) => f.key}
          render={(field: FieldConfig) => {
            const raw = resolveFieldValue(field.path, student, profile);
            const display = field.format ? field.format(raw, scopeType) : raw;
            const isEmailRow = field.key === "email" && !isVerified;

            return (
              <div
                key={field.key}
                className={field.fullWidth ? "sm:col-span-2" : undefined}
              >
                <InfoRow
                  icon={field.icon}
                  label={field.label}
                  value={display}
                  mono={field.mono}
                >
                  {isEmailRow && onAction && (
                    <div className="flex items-center gap-1">
                      <TooltipWrapper content="Copy Link">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="h-7 w-7 text-primary hover:bg-primary/10"
                          onClick={() => onAction("copy_link")}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipWrapper>
                      <TooltipWrapper content="Resend">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="h-7 w-7 text-primary hover:bg-primary/10"
                          onClick={() => onAction("resend_verification")}
                        >
                          <MailIcon className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipWrapper>
                    </div>
                  )}
                </InfoRow>
              </div>
            );
          }}
        />
      </div>
    </SectionCard>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAddress(addr: Record<string, unknown> | null | undefined): string {
  if (!addr || typeof addr !== "object") return "—";
  const parts = [
    addr.village_mohalla,
    addr.post_office,
    addr.police_station,
    addr.district,
    addr.state,
    addr.pincode,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

// ─── Action handler map ──────────────────────────────────────────────────────

type ActionHandlers = Record<string, () => void>;

// ─── Main page component ────────────────────────────────────────────────────

import { ManageServicesModal } from "./components/ManageServicesModal";

const StudentShow = () => {
  const [servicesModalOpen, setServicesModalOpen] = useState(false);

  const { props } = usePage();
  const id = (props as unknown as { id: string | number }).id;
  const institution = (props as { institution?: { type?: string } }).institution;
  const scopeType = institution?.type ?? null;
  const displayConfig = getStudentProfileDisplayConfig(scopeType);
  const queryClient = useQueryClient();
  const toggleStatusDisclosure = useDisclosure<{ id: number | string; name?: string; status?: number }>();

  // ─── Data fetching ───────────────────────────────────────────────────────
  const { data: student, isLoading, isError } = useQuery({
    queryKey: ["student-show", id],
    queryFn: async () => {
      const res = await StudentApi.getCandidateById(id);
      return res?.data;
    },
    enabled: !!id,
  });

  const auth = props.auth as any;
  const institutionId = student?.institution_id || student?.student_profile?.institution_id || auth.current_institution_id || auth.user?.institution_id;

  // ─── Mutations ───────────────────────────────────────────────────────────
  const toggleStatusMutation = useMutation({
    mutationFn: (userId: number | string) =>
      StudentApi.updateCandidateStatus(userId, { status: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: StudentQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["student-show", id] });
      toggleStatusDisclosure.onClose();
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (userId: number | string) =>
      StudentApi.resendVerificationEmail(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-show", id] });
      toast.success("Verification link sent to the student's email.");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to send verification link."
      );
    },
  });

  const copyLinkMutation = useMutation({
    mutationFn: (userId: number | string) =>
      StudentApi.getVerificationLink(userId) as Promise<any>,
    onSuccess: (res: any) => {
      const url = res?.data?.url || res?.url;
      if (!url) {
        toast.error("Failed to extract verification link.");
        return;
      }
      
      copyToClipboard(url).then((success: boolean) => {
        if (success) {
          toast.success("Verification link copied to clipboard.");
        } else {
          toast.error("Failed to copy link. Please copy it manually.");
        }
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to get verification link.");
    },
  });

  // ─── Derived state ───────────────────────────────────────────────────────
  const profile = student?.student_profile ?? student?.studentProfile;
  const permAddr = profile?.permanent_address ?? profile?.permanentAddress;
  const corrAddr = profile?.correspondence_address ?? profile?.correspondenceAddress;
  const isVerified = student?.effective_email_verified ?? student?.email_verified;

  // ─── Polymorphic configs ─────────────────────────────────────────────────
  const sections = getStudentShowSections(displayConfig);
  const heroPills = getHeroInfoPills(displayConfig);

  // ─── Action handler map (polymorphic dispatch) ───────────────────────────
  const actionHandlers: ActionHandlers = {
    edit: () => {}, // handled via Link
    fee_ledger: () => {}, // handled via Link
    resend_verification: () => student && resendVerificationMutation.mutate(student.id),
    copy_link: () => student && copyLinkMutation.mutate(student.id),
    toggle_status: () =>
      student &&
      toggleStatusDisclosure.onOpen({
        id: student.id,
        name: student.name,
        status: student.status,
      }),
    stop_services: () => setServicesModalOpen(true),
  };

  const actionDisabledMap: Record<string, boolean> = {
    resend_verification: resendVerificationMutation.isPending,
    copy_link: copyLinkMutation.isPending,
  };

  // Link-based actions need href
  const actionHrefs: Record<string, string> = {
    edit: `/students/manage/${id}/edit`,
    fee_ledger: `/accounts/fee-hub/students?student=${id}`,
    readmit: `/admission/readmissions/new/identity?student_id=${profile?.id}&fresh=true`,
  };

  const breadcrumbs = [
    ...STUDENT_SHOW_BREADCRUMBS,
    {
      title: student?.name ? `${student.name} (Details)` : "Details",
      href: `/students/manage/${id}`,
    },
  ];

  // ─── Error / Not Found ───────────────────────────────────────────────────
  if (isError || (id && !isLoading && !student)) {
    return (
      <>
        <Head title="Student not found" />
        <div className="p-4 sm:p-6">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Student not found or you don&apos;t have access.
              <div className="mt-4">
                <Link href="/students/manage">
                  <Button variant="outline">Back to Student List</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // ─── Action button renderer ──────────────────────────────────────────────
  const renderAction = (action: ActionConfig) => {
    // Filter unverified-only actions
    if (action.showWhenUnverified && isVerified) return null;
    // Filter verified-only actions
    if (action.showWhenVerified && !isVerified) return null;
    // Generic condition
    if (action.showWhen && !action.showWhen(student, profile)) return null;

    const btn = (
      <Button
        size="sm"
        variant={action.variant}
        className={cn(
          action.tier === "primary" && "h-9 px-4 rounded-lg",
          action.tier === "secondary" && "h-8 text-xs text-muted-foreground hover:text-foreground",
          action.className
        )}
        onClick={actionHandlers[action.key]}
        disabled={actionDisabledMap[action.key]}
      >
        <action.icon className={cn("mr-1.5", action.tier === "primary" ? "h-4 w-4" : "h-3.5 w-3.5")} />
        {action.key === "toggle_status"
          ? student?.status
            ? "Deactivate"
            : "Activate"
          : action.label}
      </Button>
    );

    // Wrap in permission gate if needed
    const gated = action.permission ? (
      <PermissionGate can={action.permission}>{btn}</PermissionGate>
    ) : (
      btn
    );

    // Wrap link-based actions
    if (actionHrefs[action.key]) {
      return (
        <Link href={actionHrefs[action.key]} key={action.key}>
          {gated}
        </Link>
      );
    }

    return <span key={action.key}>{gated}</span>;
  };

  const primaryActions = STUDENT_SHOW_ACTIONS.filter((a) => a.tier === "primary");
  const secondaryActions = STUDENT_SHOW_ACTIONS.filter((a) => a.tier === "secondary");

  // Separate sections into layout groups
  const pairedSections = sections.filter((s) => !s.gridSpan || s.gridSpan === 1);
  const fullWidthSections = sections.filter((s) => s.gridSpan === 2);
  const addressSections = sections.filter((s) => s.layout === "address");
  const topPairedSections = pairedSections.filter((s) => s.layout !== "address");

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <Head title={student?.name ? `${student.name} – Student` : "Student Details"} />

      <ConfirmDialog
        open={toggleStatusDisclosure.isOpen}
        onOpenChange={toggleStatusDisclosure.onClose}
        title={
          toggleStatusDisclosure.data?.status === 0
            ? "Activate Account"
            : "Deactivate Account"
        }
        description={`Are you sure you want to ${
          toggleStatusDisclosure.data?.status === 0 ? "activate" : "deactivate"
        } the account for "${toggleStatusDisclosure.data?.name}"?`}
        onConfirm={() => {
          const data = toggleStatusDisclosure.data;
          if (data?.id != null) toggleStatusMutation.mutate(data.id);
        }}
        isLoading={toggleStatusMutation.isPending}
        variant={
          toggleStatusDisclosure.data?.status === 0 ? "info" : "warning"
        }
        confirmText={
          toggleStatusDisclosure.data?.status === 0 ? "Activate" : "Deactivate"
        }
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ─── Profile Header Card ─────────────────────────────────── */}
            <Card className="overflow-hidden border-border/50">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Avatar */}
                  <div className="flex shrink-0 items-start justify-center sm:justify-start">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20">
                        <span className="text-3xl font-black text-primary">
                          {student?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <StatusBadge status={student?.status ? "active" : "inactive"} />
                      </div>
                    </div>
                  </div>

                  {/* Identity + Actions */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Name row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                            {student?.name}
                          </h1>
                          <StatusBadge
                            status={isVerified ? "verified" : "unverified"}
                          />
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {student?.primary_email ?? student?.contact_email ?? student?.email ?? "No email"}
                        </p>
                      </div>

                      {/* Primary actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Each
                          of={primaryActions}
                          keyExtractor={(a: ActionConfig) => a.key}
                          render={renderAction}
                        />
                      </div>
                    </div>

                    {/* Info pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Each
                        of={heroPills}
                        keyExtractor={(p: HeroInfoPill) => p.key}
                        render={(pill: HeroInfoPill) => {
                          const value = resolveFieldValue(pill.path, student, profile);
                          return <HeroPill pill={pill} value={value} />;
                        }}
                      />
                    </div>

                    {/* Secondary actions toolbar */}
                    <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-border/50">
                      <Each
                        of={secondaryActions}
                        keyExtractor={(a: ActionConfig) => a.key}
                        render={renderAction}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ─── Content sections (config-driven) ────────────────────── */}
            {/* Top paired sections (Contact & Academic) */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Each
                of={topPairedSections}
                keyExtractor={(s: SectionConfig) => s.key}
                render={(section: SectionConfig) => (
                  <ConfigDrivenSection
                    section={section}
                    student={student}
                    profile={profile}
                    scopeType={scopeType}
                    permAddr={permAddr}
                    corrAddr={corrAddr}
                    onAction={(key) => (actionHandlers as Record<string, () => void>)[key]?.()}
                    isVerified={isVerified}
                  />
                )}
              />
            </div>

            {/* Full-width sections (Personal, Guardian) */}
            <Each
              of={fullWidthSections}
              keyExtractor={(s: SectionConfig) => s.key}
              render={(section: SectionConfig) => (
                <ConfigDrivenSection
                  section={section}
                  student={student}
                  profile={profile}
                  scopeType={scopeType}
                  permAddr={permAddr}
                  corrAddr={corrAddr}
                  onAction={(key) => (actionHandlers as Record<string, () => void>)[key]?.()}
                  isVerified={isVerified}
                />
              )}
            />

            {/* Address sections */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Each
                of={addressSections}
                keyExtractor={(s: SectionConfig) => s.key}
                render={(section: SectionConfig) => (
                  <ConfigDrivenSection
                    section={section}
                    student={student}
                    profile={profile}
                    scopeType={scopeType}
                    permAddr={permAddr}
                    corrAddr={corrAddr}
                    onAction={(key) => (actionHandlers as Record<string, () => void>)[key]?.()}
                    isVerified={isVerified}
                  />
                )}
              />
            </div>

            {/* Documents section */}
            <div className="grid gap-6 grid-cols-1">
              <VerifiedDocumentsCard
                documents={student?.documents || []}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>

      {student && (
        <ManageServicesModal
          isOpen={servicesModalOpen}
          onClose={() => setServicesModalOpen(false)}
          student={student}
          institutionId={institutionId}
        />
      )}
    </>
  );
};

StudentShow.layoutProps = {
  backHref: "/students/manage",
  backLabel: "Back to Student List",
};

export default StudentShow;
