import React, { useMemo } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Each from "@/components/Each";
import { toast } from "sonner";
import {
  BookOpen,
  ArrowRight,
  Calendar,
  Pencil,
  User2,
  School,
  ClipboardCheck,
  Users,
  UserCheck,
  UserX,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { PageContainer } from "@/components/shared/page/PageContainer";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@/hooks/useDisclosure";
import lmsApi from "@/lib/api/lmsApi";
import { LmsClassDialog, type LmsClassDialogData } from "@/components/admin/lmsClassDialog";
import { LmsClassTeacherDialog } from "@/components/admin/lmsClassTeacherDialog";
import { PermissionGate } from "@/components/PermissionGate";
import { ActionsDropdown, type ActionItem } from "@/components/shared/ActionsDropdown";
import { FilterBar } from "@/components/filter-bar";
import useSearchFilter from "@/hooks/useSearchfilter";
import type { BreadcrumbItem } from "@/types";
import { AttendanceSheet } from "@/components/admin/attendanceSheet";
import { SubjectTeacherSheet } from "@/components/admin/SubjectTeacherSheet";
import { CardGridSkeleton } from "@/components/shared/CardGridStates";
import { usePageConfig } from "@/hooks/usePageConfig";
import {
  getLmsClassDetailContent,
  getLmsClassDetailBreadcrumbs,
  LMS_CLASSES_PERMISSIONS,
} from "@/constants/lmsClasses/formConfig";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import attendanceApi from "@/lib/api/attendanceApi";

const STUDENT_MY_CLASSES_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "My Classes", href: "/student-portal/my-classes" },
];

export type LmsClassPageLayoutConfig = {
  Layout: React.ComponentType<{ breadcrumbs: BreadcrumbItem[]; backHref?: string; backLabel?: string; children: React.ReactNode }>;
  layoutProps: { breadcrumbs: BreadcrumbItem[]; backHref?: string; backLabel?: string };
  getSubjectHref: (allocationId: number) => string;
  showBackLinkInContent: boolean;
  backLink: { href: string; label: string } | null;
};

const LmsClassLayoutConfigContext = React.createContext<LmsClassPageLayoutConfig | null>(null);

function useLmsClassLayoutConfig(): LmsClassPageLayoutConfig {
  const config = React.useContext(LmsClassLayoutConfigContext);
  if (!config) throw new Error("LmsClassPageContent must be used inside LmsClassLayoutConfigProvider");
  return config;
}

type ClassDetail = {
  id: number;
  name: string;
  code?: string | null;
  stream_id?: number | null;
  section?: string | null;
  stream?: { id: number; name: string; code?: string | null } | null;
  session?: { id: number; name: string } | null;
  lms_course?: { id: number; title: string; slug?: string } | null;
  class_teacher?: { id: number; name: string; email?: string } | null;
  class_teacher_id?: number | null;
  enrollments_count?: number;
  fee_collection_frequency?: string | null;
};

type AllocationItem = {
  id: number;
  subject: { id: number; name: string; code?: string | null } | null;
  instructor: { id: number; name: string } | null;
};

type EnrollmentItem = {
  id: number;
  user_id: number;
  user: { id: number; name: string; email?: string } | null;
  role: string;
  status: string;
};

const getSubjectColor = (name: string) => {
  const colors = [
    { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-200", icon: "bg-blue-100" },
    { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-200", icon: "bg-purple-100" },
    { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-200", icon: "bg-emerald-100" },
    { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-200", icon: "bg-rose-100" },
    { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-200", icon: "bg-amber-100" },
    { bg: "bg-indigo-500/10", text: "text-indigo-600", border: "border-indigo-200", icon: "bg-indigo-100" },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

function toDialogData(c: ClassDetail | undefined): LmsClassDialogData {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    code: c.code ?? null,
    stream_id: c.stream_id ?? c.stream?.id ?? null,
    session_id: c.session?.id ?? null,
    section: c.section ?? null,
    lms_course_id: c.lms_course?.id ?? null,
    fee_collection_frequency: c.fee_collection_frequency ?? null,
    class_subject_allocation_id: null,
    status: 1,
  };
}

type PageProps = { id: number };

const LmsClassSubjects = () => {
  const { props } = usePage<PageProps>();
  const classId = Number(props.id);
  const queryClient = useQueryClient();
  const editDialogDisclosure = useDisclosure<boolean>();
  const teacherDialogDisclosure = useDisclosure<boolean>();
  const attendanceDisclosure = useDisclosure<{ classId: number; allocationId?: number; mode?: "marking" | "reporting" }>();
  const subjectTeacherDisclosure = useDisclosure<boolean>();

  const handleExportMonthly = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
    const start = `${year}-${month}-01`;
    const end = `${year}-${month}-${String(daysInMonth).padStart(2, '0')}`;
    window.open(`/api/v1/reports/attendance-analytics/export?start_date=${start}&end_date=${end}&class_id=${classId}`, "_blank");
  };

  const { filter, handleFilterBykey } = useSearchFilter({
    search: "",
  });

  // ─── Single source of truth (usePageConfig) ────────
  const {
    content: CONTENT,
    contentMap,
  } = usePageConfig({
    permissions: LMS_CLASSES_PERMISSIONS,
    formFields: [],
    schema: {} as any, // no form on this detail page
    getContent: getLmsClassDetailContent,
    getBreadcrumbs: (c) => getLmsClassDetailBreadcrumbs(c),
    getColumns: () => [] as never[],
  });

  const searchQuery = filter.search;

  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: LmsClassesQueryKeys.detail(classId),
    queryFn: () => lmsApi.classes.show(classId),
    enabled: !!classId,
  });

  const { data: allocationsRes, isLoading: allocationsLoading } = useQuery({
    queryKey: LmsClassesQueryKeys.allocations(classId),
    queryFn: () => lmsApi.classes.allocations(classId),
    enabled: !!classId,
  });

  const classDetail = (classData as { data?: ClassDetail })?.data as ClassDetail | undefined;
  const { props: pageProps } = usePage<any>();
  const canViewAttendance = pageProps.auth?.permissions?.includes("view_attendance") ?? false;

  // ─── Today's attendance summary ─────────────────────
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const { data: attendanceData } = useQuery({
    queryKey: ["lms-class-attendance-today", classId, todayStr],
    queryFn: () => attendanceApi.getDaily({ lms_class_id: classId, date: todayStr }),
    enabled: !!classId && !!classDetail && canViewAttendance,
  });
  const attendanceRaw = attendanceData as { data?: { summary?: { present: number; absent: number; total: number } } } | undefined;
  const attendanceSummary = attendanceRaw?.data?.summary;

  const allocations = useMemo(() => ((allocationsRes as { data?: AllocationItem[] })?.data ?? []) as AllocationItem[], [allocationsRes]);
  const filteredAllocations = useMemo(() => {
    if (!searchQuery) return allocations;
    return allocations.filter((a) =>
      a.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject?.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allocations, searchQuery]);

  const adminConfig = useMemo((): LmsClassPageLayoutConfig => {
    const breadcrumbs = getLmsClassDetailBreadcrumbs(
      contentMap,
      classDetail?.stream?.name,
      classDetail?.stream_id,
      classDetail?.name,
      classId,
    );
    return {
      Layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      layoutProps: { breadcrumbs },
      getSubjectHref: (allocationId: number) => `/lms/classes/${classId}/subjects/${allocationId}`,
      showBackLinkInContent: false,
      backLink: null,
    };
  }, [classDetail, classId, contentMap]);

  const studentConfig = useMemo((): LmsClassPageLayoutConfig => {
    const breadcrumbs: BreadcrumbItem[] = [
      ...STUDENT_MY_CLASSES_BREADCRUMBS,
      { title: classDetail?.name ?? "Class", href: `/student-portal/my-classes/${classId}` },
    ];
    return {
      Layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      layoutProps: {
        breadcrumbs,
      },
      getSubjectHref: (allocationId: number) => `/student-portal/my-classes/${classId}/subjects/${allocationId}`,
      showBackLinkInContent: false,
      backLink: null,
    };
  }, [classDetail, classId]);

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.detail(classId) });
    queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.allocations(classId) });
    editDialogDisclosure.onClose();
  };

  const handleTeacherSuccess = () => {
    queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.detail(classId) });
    teacherDialogDisclosure.onClose();
    toast.success("Class teacher updated successfully");
  };

  function LmsClassPageContent() {
    const config = useLmsClassLayoutConfig();
    const { Layout, layoutProps, getSubjectHref, showBackLinkInContent, backLink } = config;

    return (
      <Layout {...layoutProps}>
        <Head title={classDetail?.name ? `${classDetail.name} – ${classDetail.section}` : "LMS Class"} />
        <PermissionGate can="create_lms_classes">
          <LmsClassDialog
            open={editDialogDisclosure.isOpen}
            onClose={() => editDialogDisclosure.onClose()}
            data={editDialogDisclosure.data ? toDialogData(classDetail) : undefined}
            onSuccess={handleEditSuccess}
          />
          <LmsClassTeacherDialog
            open={teacherDialogDisclosure.isOpen}
            onClose={() => teacherDialogDisclosure.onClose()}
            classId={classId}
            currentTeacherId={classDetail?.class_teacher_id ?? undefined}
            onSuccess={handleTeacherSuccess}
          />
        </PermissionGate>

        <AttendanceSheet
          key={attendanceDisclosure.isOpen ? `atnd-${attendanceDisclosure.data?.classId}-${attendanceDisclosure.data?.allocationId}-${attendanceDisclosure.data?.mode}` : 'atnd-closed'}
          open={attendanceDisclosure.isOpen}
          onClose={() => attendanceDisclosure.onClose()}
          initialClassId={attendanceDisclosure.data?.classId}
          initialAllocationId={attendanceDisclosure.data?.allocationId}
          mode={attendanceDisclosure.data?.mode}
        />

        <SubjectTeacherSheet
          open={subjectTeacherDisclosure.isOpen}
          onClose={() => subjectTeacherDisclosure.onClose()}
          classId={classId}
        />

        <PageContainer maxWidth="6xl" className="">
          {showBackLinkInContent && backLink && (
            <Link
              href={backLink.href}
              className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              {backLink.label}
            </Link>
          )}
          <MainPageHeader
            breadcrumbs={layoutProps.breadcrumbs}
            icon={School}
            title={classDetail?.name ?? "—"}
            subtitle={classDetail?.section ? `Section ${classDetail.section}` : undefined}
          >
            <FilterBar values={filter} onChange={(updates) => {
              if (updates.search !== undefined) handleFilterBykey("search", updates.search);
            }}>
              <FilterBar.Renderer config={{ filters: [], search: { name: "search", placeholder: CONTENT.searchPlaceholder as string } }} />
            </FilterBar>
            <ActionsDropdown
              permission="create_lms_classes"
              actions={[
                { label: CONTENT.editBtn as string, icon: Pencil, onClick: () => editDialogDisclosure.onOpen(true) },
                { label: "Assign Class Teacher", icon: User2, onClick: () => teacherDialogDisclosure.onOpen(true) },
                { label: "Assign Subject Teachers", icon: Users, onClick: () => subjectTeacherDisclosure.onOpen(true), separator: true },
                { label: "Mark Attendance", icon: ClipboardCheck, onClick: () => attendanceDisclosure.onOpen({ classId, mode: "marking" }), permission: "mark_attendance", separator: true },
                { label: "Daily Register", icon: Calendar, onClick: () => attendanceDisclosure.onOpen({ classId, mode: "reporting" }), permission: "view_attendance" },
                { label: "Monthly Register (Excel)", icon: Download, onClick: handleExportMonthly, permission: "view_attendance" },
              ]}
            />
          </MainPageHeader>

          {/* ── Class Info Bar ────────────────────────── */}
          {classDetail && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <User2 className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Class Teacher</p>
                  <p className="truncate text-sm font-semibold text-foreground">{classDetail.class_teacher?.name ?? "Not Assigned"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                  <Users className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Students</p>
                  <p className="text-sm font-semibold text-foreground">{classDetail.enrollments_count ?? 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <UserCheck className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Present Today</p>
                  <p className="text-sm font-semibold text-foreground">{attendanceSummary?.present ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                  <UserX className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Absent Today</p>
                  <p className="text-sm font-semibold text-foreground">{attendanceSummary?.absent ?? "—"}</p>
                </div>
              </div>
            </div>
          )}

          {classLoading && (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/5">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="font-medium">Loading class details...</p>
              </div>
            </div>
          )}

          {!classLoading && classDetail && (
            <div className="space-y-12">

              {/* --- Subject Cards --- */}
              <section className="space-y-8">

                {allocationsLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <CardGridSkeleton count={4} height="h-48" />
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                    <Each
                      of={filteredAllocations}
                      keyExtractor={(alloc: AllocationItem) => alloc.id}
                      render={(alloc: AllocationItem, index: number) => {
                        const href = getSubjectHref(alloc.id);
                        const color = getSubjectColor(alloc.subject?.name ?? "");
                        return (
                          <Card
                            variant="metrics"
                            delay={0.2 + (index * 0.05)}
                            hoverable
                            className={cn(
                              "group relative h-full rounded-3xl",
                              color.bg
                            )}
                          >
                            <CardContent className="flex h-full flex-col p-6">
                              <div className="flex items-start justify-between">
                                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm border", color.icon, color.border)}>
                                  <BookOpen className={cn("size-6", color.text)} />
                                </div>
                              </div>

                              <Link href={href} className="mt-6 flex flex-1 flex-col">
                                <div className="space-y-1">
                                  <h3 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {alloc.subject?.name ?? "Untitled Subject"}
                                  </h3>
                                  {alloc.subject?.code && (
                                    <Badge variant="secondary" className="bg-background/80 text-[10px] uppercase tracking-wider font-bold h-5">
                                      {alloc.subject.code}
                                    </Badge>
                                  )}
                                </div>

                                <div className="mt-auto pt-6">
                                  <div className="flex items-center justify-between border-t border-border/20 pt-4">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background border border-border/60">
                                        <User2 className="size-3.5 text-muted-foreground" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/60 leading-none">Instructor</p>
                                        <p className="truncate text-xs font-bold text-foreground">
                                          {alloc.instructor?.name ?? "TBA"}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.visit(href);
                                      }}
                                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background border border-border/60 shadow-sm transition-transform cursor-pointer group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary h-8 w-8"
                                    >
                                      <ArrowRight className="size-4" />
                                    </Button>
                                  </div>
                                </div>
                              </Link>
                            </CardContent>
                          </Card>
                        );
                      }}
                    />
                  </div>
                )}
              </section>
            </div>
          )}

          {!classLoading && !classDetail && classId && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/5 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mb-4">
                <School className="size-8" />
              </div>
              <h3 className="text-xl font-bold">{CONTENT.notFoundTitle}</h3>
              <p className="text-muted-foreground mt-1">
                {CONTENT.notFoundDesc}
              </p>
              <Button variant="outline" onClick={() => window.history.back()} className="mt-6 rounded-xl">
                Return to Dashboard
              </Button>
            </div>
          )}
        </PageContainer>
      </Layout>
    );
  }

  return (
    <PermissionGate can="portal" fallback={
      <LmsClassLayoutConfigContext.Provider value={adminConfig}>
        <LmsClassPageContent />
      </LmsClassLayoutConfigContext.Provider>
    }>
      <LmsClassLayoutConfigContext.Provider value={studentConfig}>
        <LmsClassPageContent />
      </LmsClassLayoutConfigContext.Provider>
    </PermissionGate>
  );
};

export default LmsClassSubjects;
