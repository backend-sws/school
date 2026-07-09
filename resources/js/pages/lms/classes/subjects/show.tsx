import React, { useState, useMemo, useRef } from "react";
import { isSameDay, startOfDay } from "date-fns";

import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Each from "@/components/Each";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  Film,
  Hash,
  Layers,
  Megaphone,
  Paperclip,
  Pencil,
  Play,
  User2,
  Users,
  Video,
  BookOpen,
  X,
  Calendar as CalendarIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@/hooks/useDisclosure";
import lmsApi from "@/lib/api/lmsApi";
import { LMS_SUBJECT_DETAIL_TABS } from "@/constants/page/admin/lms";
import { PermissionGate } from "@/components/PermissionGate";
import { useCan } from "@/hooks/use-can";
import { LmsAssignmentDialog } from "@/components/admin/lmsAssignmentDialog";
import { LmsTestDialog } from "@/components/admin/lmsTestDialog";
import { LmsLiveSessionDialog } from "@/components/admin/lmsLiveSessionDialog";
import { LmsSubjectInstructorDialog } from "@/components/admin/lmsSubjectInstructorDialog";
import { LmsAnnouncementDialog } from "@/components/admin/lmsAnnouncementDialog";
import { LmsMaterialDialog } from "@/components/admin/lmsMaterialDialog";
import { LmsRecordingDialog } from "@/components/admin/lmsRecordingDialog";
import { LmsTestQuestionManager } from "@/components/admin/lmsTestQuestionManager";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { FilterBar } from "@/components/filter-bar";
import useSearchFilter from "@/hooks/useSearchfilter";
import { DashedCard } from "@/components/shared/DashedCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LmsVideoPlayerEngine } from "@/components/shared/LmsVideoPlayerEngine";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import {
  LMS_CLASSES_PERMISSIONS,
  getLmsSubjectDetailContent,
  getLmsSubjectDetailBreadcrumbs,
} from "@/constants/lmsClasses/formConfig";

const STUDENT_MY_CLASSES_BREADCRUMBS = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "My Classes", href: "/student-portal/my-classes" },
];

type ClassDetail = {
  id: number;
  name: string;
  code?: string | null;
  stream?: { id: number; name: string } | null;
  stream_id?: number | null;
  session?: { id: number; name: string } | null;
};

type AllocationItem = {
  id: number;
  subject: { id: number; name: string; code?: string | null } | null;
  instructor: { id: number; name: string } | null;
};

type AssignmentRow = { id: number; title: string; type: string; due_at?: string | null; max_score?: number | string | null };
type TestRow = { id: number; title: string; duration_minutes?: number | null; max_attempts?: number; questions_count?: number; available_from?: string | null };
type LiveSessionRow = { id: number; title: string; scheduled_at?: string | null; meeting_url?: string | null };
type RecordingRow = { id: number; title: string; video_url?: string | null; file_path?: string | null; published_at?: string | null };
type AnnouncementRow = { id: number; title: string; body?: string | null; published_at?: string | null };
type MaterialRow = { id: number; title: string; file_path: string };

type TabId = "announcements" | "curriculum" | "assessments" | "sessions" | "recordings" | "resources" | "students";

const LmsSubjectShow = () => {
  const { props } = usePage();
  const classId = (props as { id?: number }).id as number;
  const allocationId = (props as { allocationId?: number }).allocationId as number;

  // ─── Content Engine ──────────────────────────────────
  const contentMap = useInstitutionContent();
  const CONTENT = useMemo(() => getLmsSubjectDetailContent(contentMap), [contentMap]);

  const assignmentDialog = useDisclosure<boolean>();
  const testDialog = useDisclosure<boolean>();
  const liveSessionDialog = useDisclosure<boolean>();
  const announcementPostDialog = useDisclosure<boolean>();
  const materialDialog = useDisclosure<boolean>();
  const recordingDialog = useDisclosure<boolean>();
  const questionManagerDisclosure = useDisclosure<{ testId: number; testTitle: string }>();
  const { filter, handleFilterBykey } = useSearchFilter({
    type: "all",
    search: "",
  });

  const [assigningInstructor, setAssigningInstructor] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("announcements");
  const canSeeStudentsTab = useCan("create_lms_classes");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const calendarRef = useRef<HTMLDivElement>(null);

  // ─── Queries (centralized keys) ──────────────────────
  const { data: classData, isLoading } = useQuery({
    queryKey: LmsClassesQueryKeys.detail(classId),
    queryFn: () => lmsApi.classes.show(classId),
    enabled: !!classId,
  });

  const { data: enrollmentData } = useQuery({
    queryKey: LmsClassesQueryKeys.enrollments(classId),
    queryFn: () => lmsApi.classes.enrollments(classId),
    enabled: !!classId,
  });

  const students = enrollmentData?.data ?? [];

  const { data: allocationsRes } = useQuery({
    queryKey: LmsClassesQueryKeys.allocations(classId),
    queryFn: () => lmsApi.classes.allocations(classId),
    enabled: !!classId,
  });


  const classDetail = (classData as { data?: ClassDetail })?.data as ClassDetail | undefined;
  const allocations = ((allocationsRes as { data?: AllocationItem[] })?.data ?? []) as AllocationItem[];
  const currentAllocation = allocations.find((a) => a.id === allocationId);
  const subjectName = currentAllocation?.subject?.name || "Subject Details";

  const allocationParams = { allocation_id: allocationId };

  const { data: assignmentsRes } = useQuery({
    queryKey: LmsClassesQueryKeys.assignments(classId, allocationParams),
    queryFn: () => lmsApi.assignments.index(classId, allocationParams),
  });

  const { data: testsRes } = useQuery({
    queryKey: LmsClassesQueryKeys.tests(classId, allocationParams),
    queryFn: () => lmsApi.tests.index(classId, allocationParams),
  });

  const { data: liveSessionsRes } = useQuery({
    queryKey: LmsClassesQueryKeys.liveSessions(classId, allocationParams),
    queryFn: () => lmsApi.liveSessions.index(classId, allocationParams),
  });

  const { data: recordingsRes } = useQuery({
    queryKey: LmsClassesQueryKeys.recordings(classId, allocationParams),
    queryFn: () => lmsApi.recordings.index(classId, allocationParams),
  });

  const { data: announcementsRes } = useQuery({
    queryKey: LmsClassesQueryKeys.announcements(classId, allocationParams),
    queryFn: () => lmsApi.announcements.index(classId, allocationParams),
  });

  const { data: materialsRes } = useQuery({
    queryKey: LmsClassesQueryKeys.materials(classId, allocationParams),
    queryFn: () => lmsApi.materials.index(classId, allocationParams),
  });

  const assignments = ((assignmentsRes as { data?: AssignmentRow[] })?.data ?? []) as AssignmentRow[];
  const tests = ((testsRes as { data?: TestRow[] })?.data ?? []) as TestRow[];
  const liveSessions = ((liveSessionsRes as { data?: LiveSessionRow[] })?.data ?? []) as LiveSessionRow[];
  const recordings = ((recordingsRes as { data?: RecordingRow[] })?.data ?? []) as RecordingRow[];
  const announcements = ((announcementsRes as { data?: AnnouncementRow[] })?.data ?? []) as AnnouncementRow[];
  const materials = ((materialsRes as { data?: MaterialRow[] })?.data ?? []) as MaterialRow[];

  // --- Filtering Logic ---
  const filteredAnnouncements = useMemo(() => {
    if (!selectedDate) return announcements;
    return announcements.filter(a => a.published_at && isSameDay(new Date(a.published_at), selectedDate));
  }, [announcements, selectedDate]);

  const filteredAssignments = useMemo(() => {
    let list = assignments;
    if (selectedDate) {
      list = list.filter(a => a.due_at && isSameDay(new Date(a.due_at), selectedDate));
    }
    const typeFilter = filter.type;
    if (typeFilter && typeFilter !== "all") {
      list = list.filter(a => a.type === typeFilter);
    }
    return list;
  }, [assignments, selectedDate, filter.type]);

  const filteredTests = useMemo(() => {
    if (!selectedDate) return tests;
    return tests.filter(t => t.available_from && isSameDay(new Date(t.available_from), selectedDate));
  }, [tests, selectedDate]);

  const filteredLiveSessions = useMemo(() => {
    if (!selectedDate) return liveSessions;
    return liveSessions.filter(s => s.scheduled_at && isSameDay(new Date(s.scheduled_at), selectedDate));
  }, [liveSessions, selectedDate]);

  // Dates that have any subject activity (for calendar indicators)
  const datesWithEvents = useMemo(() => {
    const set = new Set<string>();
    [...assignments.map((a) => a.due_at), tests.map((t) => t.available_from), liveSessions.map((s) => s.scheduled_at), announcements.map((a) => a.published_at)]
      .flat()
      .filter(Boolean)
      .forEach((iso) => {
        if (iso) set.add(startOfDay(new Date(iso)).toISOString());
      });
    return Array.from(set).map((iso) => new Date(iso));
  }, [assignments, tests, liveSessions, announcements]);

  // ─── Breadcrumbs (content engine) ────────────────────
  const isStudentPortal = useCan("portal");
  const breadcrumbs = useMemo(() => {
    if (isStudentPortal) {
      return [
        ...STUDENT_MY_CLASSES_BREADCRUMBS,
        { title: classDetail?.name ?? "Class", href: `/student-portal/my-classes/${classId}` },
        { title: subjectName, href: `/lms/classes/${classId}/subjects/${allocationId}` },
      ];
    }
    return getLmsSubjectDetailBreadcrumbs(
      contentMap,
      classDetail?.stream?.name,
      classDetail?.stream_id,
      classDetail?.name,
      classId,
      subjectName,
      allocationId,
    );
  }, [isStudentPortal, contentMap, classDetail, classId, subjectName, allocationId]);

  const backHref = isStudentPortal ? `/student-portal/my-classes/${classId}` : `/lms/classes/${classId}`;
  const backLabel = isStudentPortal ? "Back to My Classes" : "Back to class";

  return (
    <>
      <Head title={classDetail?.name ? `${classDetail.name} – ${subjectName}` : "Subject"} />
      {classId && (
        <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
          <LmsAssignmentDialog open={assignmentDialog.isOpen} onClose={() => assignmentDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsTestDialog open={testDialog.isOpen} onClose={() => testDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsLiveSessionDialog open={liveSessionDialog.isOpen} onClose={() => liveSessionDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsSubjectInstructorDialog open={assigningInstructor} onClose={() => setAssigningInstructor(false)} allocationId={allocationId} classId={classId} currentInstructorId={currentAllocation?.instructor?.id} />
          <LmsAnnouncementDialog open={announcementPostDialog.isOpen} onClose={() => announcementPostDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsMaterialDialog open={materialDialog.isOpen} onClose={() => materialDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsRecordingDialog open={recordingDialog.isOpen} onClose={() => recordingDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsTestQuestionManager
            open={questionManagerDisclosure.isOpen}
            onClose={() => questionManagerDisclosure.onClose()}
            classId={classId}
            testId={questionManagerDisclosure.data?.testId ?? 0}
            testTitle={questionManagerDisclosure.data?.testTitle ?? ""}
          />
        </PermissionGate>
      )}
      <PageContainer maxWidth="2xl" className="space-y-8">
        {isLoading && (
          <div className="h-64 rounded-3xl bg-muted/40 animate-pulse border border-border/40 -mx-4 sm:mx-0 rounded-none sm:rounded-3xl" />
        )}

        {!isLoading && classDetail && (
          <div className="-mx-4 sm:mx-0 rounded-none sm:rounded-2xl lg:rounded-3xl">
            <div className="relative overflow-hidden rounded-none sm:rounded-2xl lg:rounded-3xl bg-primary text-primary-foreground shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_70%)]" />

              <div className="relative flex flex-col lg:flex-row lg:items-stretch">
                {/* Left: Info */}
                <div className="flex-1 min-w-0 space-y-5 p-5 sm:p-7 lg:p-8">
                  {/* Identity */}
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 sm:size-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
                      <Layers className="size-7 sm:size-8 text-white" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight capitalize truncate">
                          {subjectName}
                        </h2>
                        <Badge className="bg-white/20 text-white border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                          {classDetail.code || "LMS"}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60">{classDetail.name} • {CONTENT.classLabel}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-3">
                    {currentAllocation?.instructor && (
                      <div className="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                        <Avatar className="size-7 border border-white/20">
                          <AvatarFallback className="bg-white/20 text-white text-[9px] font-bold">
                            {currentAllocation.instructor.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">{CONTENT.instructorLabel}</p>
                          <p className="text-xs font-bold text-white truncate">{currentAllocation.instructor.name}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/10 px-4 py-2">
                      <div className="text-center">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">{CONTENT.unitsLabel}</p>
                        <p className="text-lg font-bold text-white leading-none">{assignments.length}</p>
                      </div>
                      <div className="w-px h-5 bg-white/15" />
                      <div className="text-center">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">{CONTENT.studentsLabel}</p>
                        <p className="text-lg font-bold text-white leading-none">{students.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 text-xs font-bold px-4"
                        onClick={() => setAssigningInstructor(true)}
                      >
                        {currentAllocation?.instructor ? <Pencil className="size-3.5 mr-1.5" /> : <User2 className="size-3.5 mr-1.5" />}
                        {currentAllocation?.instructor ? CONTENT.changeTeacherBtn : CONTENT.assignInstructorBtn}
                      </Button>
                    </PermissionGate>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 text-xs font-bold px-4 gap-1.5"
                      onClick={() => calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    >
                      <CalendarIcon className="size-3.5 shrink-0" />
                      <span>
                        {selectedDate
                          ? selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                          : CONTENT.scheduleBtn}
                      </span>
                      {selectedDate && !isSameDay(selectedDate, new Date()) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(new Date());
                          }}
                          className="ml-0.5 size-5 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors shrink-0 p-0"
                          aria-label="Reset to today"
                        >
                          <X className="size-3" />
                        </Button>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Right: Study Calendar */}
                <div
                  ref={calendarRef}
                  className="shrink-0 w-full lg:w-72 border-t border-white/10 lg:border-t-0 lg:border-l bg-white/[0.05]"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                        {CONTENT.calendarTitle}
                      </span>
                      {selectedDate && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setSelectedDate(undefined)}
                          className="size-6 rounded text-white/40 hover:text-white hover:bg-white/10"
                          aria-label="Clear date filter"
                        >
                          <X className="size-3" />
                        </Button>
                      )}
                    </div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date: Date | undefined) => setSelectedDate(date)}
                      className="p-0 w-full min-w-0"
                      modifiers={{ hasEvent: datesWithEvents }}
                      modifiersClassNames={{
                        hasEvent:
                          "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:size-1.5 after:rounded-full after:bg-white/90 after:content-['']",
                      }}
                      classNames={{
                        months: "w-full",
                        month: "w-full space-y-2",
                        month_caption: "flex items-center justify-between w-full mb-2",
                        caption_label: "text-xs font-semibold text-white/90",
                        nav: "flex items-center gap-1",
                        button_previous:
                          "size-6 rounded text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center",
                        button_next:
                          "size-6 rounded text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center",
                        month_grid: "w-full",
                        weekdays: "grid grid-cols-7 w-full",
                        weekday: "text-white/40 text-[10px] font-medium text-center py-1",
                        week: "grid grid-cols-7 w-full",
                        day: "flex items-center justify-center size-8",
                        day_button:
                          "size-8 w-full p-0 rounded-full text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors",
                        selected:
                          "!bg-white shadow-sm [&>button]:!text-zinc-900 [&>button]:hover:!text-zinc-900",
                        today: "ring-1 ring-white/50 text-white font-semibold bg-white/10",
                        outside: "text-white/30 opacity-60",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Managed Activity Tabs --- */}
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as TabId)} className="space-y-6">
          <div className="flex items-center gap-3 overflow-x-auto border-b border-border/40 pb-0 scrollbar-none">
            <TabsList className="bg-transparent border-none h-auto p-0 gap-1 sm:gap-4 flex-nowrap">
              <Each
                of={LMS_SUBJECT_DETAIL_TABS.filter(
                  (tab) => !tab.permissionRequired || (tab.permissionRequired === "create_lms_classes" && canSeeStudentsTab)
                )}
                keyExtractor={(tab) => tab.id}
                render={(tab) => (
                  <TabsTrigger
                    value={tab.id}
                    className="relative h-10 shrink-0 rounded-none border-b-2 border-transparent px-2 sm:px-3 pb-2.5 pt-2 text-xs sm:text-sm font-bold text-muted-foreground whitespace-nowrap transition-all data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    <tab.icon className="size-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                )}
              />
            </TabsList>
          </div>

          <div className="grid gap-8">

            {/* Tab Content Rendering */}
            <div className="min-h-[400px]">
              <TabsContent value="announcements" className="m-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                    <DashedCard
                      label={CONTENT.postAnnouncementLabel}
                      description={CONTENT.postAnnouncementDesc}
                      onClick={() => announcementPostDialog.onOpen(true)}
                      className="min-h-[7.5rem] border-amber-200 hover:border-amber-500 rounded-2xl [&>div]:rounded-2xl"
                    />
                  </PermissionGate>
                  <Each
                    of={filteredAnnouncements}
                    keyExtractor={(a) => a.id}
                    nodatafound={
                      <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border/40 min-h-[14rem] sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4">
                        <Megaphone className="size-10 text-muted-foreground/30 mb-3" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                          {CONTENT.noAnnouncements}
                        </p>
                      </div>
                    }
                    render={(a) => (
                      <Card className="rounded-2xl border-border/40 bg-white/50 backdrop-blur-sm p-5 hover:border-amber-500/20 transition-all min-h-[7.5rem] flex flex-col">
                        <div className="flex gap-4 flex-1 min-h-0">
                          <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                            <Megaphone className="size-5" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h4 className="font-bold text-lg leading-tight line-clamp-2">{a.title}</h4>
                              {a.published_at && (
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                                  {new Date(a.published_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </p>
                              )}
                            </div>
                            {a.body && (
                              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                                {a.body}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="m-0 focus-visible:ring-0">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <FilterBar
                      values={filter}
                      onChange={(updates) => {
                        Object.entries(updates).forEach(([key, value]) => {
                          handleFilterBykey(key as any, value);
                        });
                      }}
                      className="border-none p-0 inline-flex w-auto"
                    >
                      <FilterBar.Renderer config={{ filters: [{ name: "type", type: "select", label: "Type", placeholder: "Type", options: [{ label: "All Types", value: "all" }, { label: "Assignment", value: "assignment" }, { label: "Homework", value: "homework" }, { label: "Project", value: "project" }] }] }} />
                    </FilterBar>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                      <DashedCard
                        label={CONTENT.addCurriculumLabel}
                        description={CONTENT.addCurriculumDesc}
                        onClick={() => assignmentDialog.onOpen(true)}
                        className="min-h-[7.5rem] rounded-2xl [&>div]:rounded-2xl"
                      />
                    </PermissionGate>
                    <Each
                      of={filteredAssignments}
                      keyExtractor={(a) => a.id}
                      nodatafound={
                        <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border/40 min-h-[14rem] sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4">
                          <ClipboardList className="size-10 text-muted-foreground/30 mb-3" />
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                            {CONTENT.noCurriculum}
                          </p>
                        </div>
                      }
                      render={(a) => (
                        <Card className="group relative overflow-hidden rounded-2xl border-border/40 bg-white/50 backdrop-blur-sm p-5 hover:border-primary/20 transition-all min-h-[7.5rem] flex flex-col">
                          <div className="flex flex-col gap-3 flex-1 min-h-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                <FileText className="size-5" />
                              </div>
                              <Badge variant="outline" className="rounded-xl border-border/60 bg-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 shrink-0">
                                {a.type}
                              </Badge>
                            </div>
                            <h4 className="text-lg font-bold tracking-tight line-clamp-2">{a.title}</h4>
                            <div className="flex items-center gap-2 text-muted-foreground/80">
                              <CalendarIcon className="size-3.5 shrink-0" />
                              <span className="text-xs font-bold uppercase tracking-tighter">Due: {a.due_at ? new Date(a.due_at).toLocaleDateString() : "No date"}</span>
                            </div>
                            {a.max_score != null && String(a.max_score).trim() !== "" && (
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max {a.max_score} pts</p>
                            )}
                            <div className="pt-1 mt-auto">
                              <Button variant="ghost" size="sm" className="w-full justify-between rounded-xl hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-widest transition-all">
                                {CONTENT.viewSubmissionsBtn}
                                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="assessments" className="m-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                    <DashedCard
                      label={CONTENT.createTestLabel}
                      description={CONTENT.createTestDesc}
                      onClick={() => testDialog.onOpen(true)}
                      className="min-h-[7.5rem] rounded-2xl [&>div]:rounded-2xl"
                    />
                  </PermissionGate>
                  <Each
                    of={filteredTests}
                    keyExtractor={(t) => t.id}
                    nodatafound={
                      <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border/40 min-h-[14rem] sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4">
                        <BookOpen className="size-10 text-muted-foreground/30 mb-3" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                          {CONTENT.noTests}
                        </p>
                      </div>
                    }
                    render={(t) => (
                      <Card className="group overflow-hidden rounded-2xl border-border/40 bg-white/50 backdrop-blur-sm p-5 hover:border-indigo-500/20 transition-all min-h-[7.5rem] flex flex-col">
                        <div className="flex flex-col gap-3 flex-1 min-h-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="size-10 rounded-xl bg-indigo-500/5 flex items-center justify-center text-indigo-600 shrink-0">
                              <FileText className="size-5" />
                            </div>
                            <Badge className="rounded-xl bg-indigo-500/10 text-indigo-700 border-none font-black uppercase tracking-widest text-[9px] shrink-0">
                              {t.duration_minutes ?? 0} min
                            </Badge>
                          </div>
                          <h4 className="text-lg font-bold tracking-tight line-clamp-2">{t.title}</h4>
                          <div className="flex items-center gap-4 text-muted-foreground/70">
                            <span className="text-[10px] font-black uppercase tracking-widest">Questions: {t.questions_count ?? 0}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Attempts: {t.max_attempts ?? 0}</span>
                          </div>
                          <div className="pt-2 mt-auto">
                            <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-between rounded-xl hover:bg-indigo-500/5 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-all"
                                onClick={() => questionManagerDisclosure.onOpen({ testId: t.id, testTitle: t.title })}
                              >
                                {CONTENT.manageQuestionsBtn}
                                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                              </Button>
                            </PermissionGate>
                          </div>
                        </div>
                      </Card>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="m-0 focus-visible:ring-0">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                      <DashedCard
                        label={CONTENT.scheduleLiveLabel}
                        description={CONTENT.scheduleLiveDesc}
                        onClick={() => liveSessionDialog.onOpen(true)}
                        className="min-h-[7.5rem] rounded-2xl [&>div]:rounded-2xl"
                      />
                    </PermissionGate>
                    <Each
                      of={filteredLiveSessions}
                      keyExtractor={(s) => s.id}
                      nodatafound={
                        <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border/40 min-h-[14rem] sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4">
                          <Video className="size-10 text-muted-foreground/30 mb-3" />
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                            {CONTENT.noSessions}
                          </p>
                        </div>
                      }
                      render={(s) => (
                        <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border-border/40 bg-white/50 backdrop-blur-sm p-5 hover:border-sky-500/20 transition-all min-h-[7.5rem]">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
                                <Video className="size-5" />
                              </div>
                              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            </div>
                            <h4 className="font-bold tracking-tight line-clamp-2">{s.title}</h4>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                              {s.scheduled_at ? new Date(s.scheduled_at).toLocaleString() : "TBD"}
                            </p>
                          </div>
                          <Button variant="outline" className="mt-4 rounded-2xl border-sky-500/20 bg-sky-500/5 text-sky-700 hover:bg-sky-500 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-all">
                            {CONTENT.joinBtn}
                          </Button>
                        </Card>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recordings" className="m-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                    <DashedCard
                      label={CONTENT.uploadRecordingLabel}
                      description={CONTENT.uploadRecordingDesc}
                      onClick={() => recordingDialog.onOpen(true)}
                      className="min-h-[7.5rem] rounded-2xl [&>div]:rounded-2xl"
                    />
                  </PermissionGate>
                  <Each
                    of={recordings}
                    keyExtractor={(r) => r.id}
                    nodatafound={
                      <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border/40 min-h-[14rem] sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4">
                        <Play className="size-10 text-muted-foreground/30 mb-3" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{CONTENT.noRecordings}</p>
                      </div>
                    }
                    render={(r) => (
                      <Card className="group overflow-hidden rounded-2xl border-border/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:border-slate-500/20 transition-all flex flex-col">
                        <LmsVideoPlayerEngine
                          videoUrl={r.video_url}
                          filePath={r.file_path}
                          title={r.title}
                          compact
                          className="rounded-t-2xl rounded-b-none"
                        />
                        <div className="p-4 pt-3 flex-1">
                          <h4 className="font-bold tracking-tight text-sm line-clamp-2">{r.title}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                            {r.published_at ? new Date(r.published_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "Recording"}
                          </p>
                        </div>
                      </Card>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="resources" className="m-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                    <DashedCard
                      label={CONTENT.uploadFileLabel}
                      description={CONTENT.uploadFileDesc}
                      onClick={() => materialDialog.onOpen(true)}
                      className="min-h-[7.5rem] rounded-2xl [&>div]:rounded-2xl"
                    />
                  </PermissionGate>
                  <Each
                    of={materials}
                    keyExtractor={(m) => m.id}
                    nodatafound={
                      <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border/40 min-h-[14rem] sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4">
                        <Paperclip className="size-10 text-muted-foreground/30 mb-3" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{CONTENT.noResources}</p>
                      </div>
                    }
                    render={(m) => (
                      <Card className="group overflow-hidden rounded-2xl border-border/40 bg-white/50 backdrop-blur-sm p-5 hover:border-primary/20 transition-all min-h-[7.5rem] flex flex-col">
                        <div className="flex items-center gap-4 flex-1 min-h-0">
                          <div className="size-10 flex-shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                            <Hash className="size-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm tracking-tight truncate">{m.title}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">File</p>
                          </div>
                        </div>
                      </Card>
                    )}
                  />
                </div>
              </TabsContent>

              <PermissionGate can={LMS_CLASSES_PERMISSIONS.create}>
                <TabsContent value="students" className="m-0 focus-visible:ring-0">
                  <div className="space-y-4">
                    {students.length > 0 && (
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{students.length} {CONTENT.studentsCount}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Each
                        of={students}
                        keyExtractor={(enrollment: { id: number }) => enrollment.id}
                        nodatafound={
                          <div className="sm:col-span-2 flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-dashed border-border/40 min-h-[7.5rem]">
                            <Users className="size-8 text-muted-foreground/30 mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{CONTENT.noStudents}</p>
                          </div>
                        }
                        render={(enrollment: { id: number; user?: { name?: string; email?: string } }) => (
                          <div className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-white/50 backdrop-blur-sm p-5 hover:border-primary/20 transition-all hover:bg-white/80 min-h-[7.5rem]">
                            <Avatar className="h-12 w-12 border-2 border-primary/10 shrink-0 transition-transform group-hover:scale-105">
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-black uppercase">
                                {enrollment.user?.name?.split(" ").map((n: string) => n[0]).join("") ?? "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold tracking-tight truncate">{enrollment.user?.name}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{enrollment.user?.email}</p>
                            </div>
                            <Button variant="ghost" size="icon-sm" className="rounded-xl shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                              <ArrowRight className="size-4 text-muted-foreground" />
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </PermissionGate>
            </div>
          </div>
        </Tabs>

      </PageContainer>
    </>
  );
};

export default LmsSubjectShow;
