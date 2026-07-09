import { Head, Link, usePage } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, FileText, ClipboardList, Video, Megaphone, Paperclip, Send, Play, ChevronLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import lmsApi from "@/lib/api/lmsApi";
import { PermissionGate } from "@/components/PermissionGate";
import { LMS_CLASSES_BREADCRUMBS } from "@/constants/page/admin/lms";
import { LmsAssignmentDialog } from "@/components/admin/lmsAssignmentDialog";
import { LmsTestDialog } from "@/components/admin/lmsTestDialog";
import { LmsLiveSessionDialog } from "@/components/admin/lmsLiveSessionDialog";
import { LmsAttendanceDialog } from "@/components/admin/lmsAttendanceDialog";
import { ModalDialog } from "@/components/shared/Modal";
import { LmsTestTakingView } from "@/components/student/lmsTestTakingView";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import Each from "@/components/Each";
import attendanceApi from "@/lib/api/attendanceApi";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck } from "lucide-react";

const STUDENT_MY_CLASSES_BREADCRUMBS = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "My Classes", href: "/student-portal/my-classes" },
];

const submitSchema = z.object({
  feedback: z.string().optional(),
});
type SubmitFormValues = z.infer<typeof submitSchema>;

type ClassDetail = {
  id: number;
  name: string;
  code?: string | null;
  status: number;
  lms_course?: { id: number; title: string; slug?: string } | null;
  session?: { id: number; name: string } | null;
  class_subject_allocation?: unknown;
};

type AllocationItem = {
  id: number;
  subject: { id: number; name: string; code?: string | null } | null;
};

type AssignmentRow = {
  id: number;
  title: string;
  type: string;
  due_at?: string | null;
  max_score?: number | string | null;
  allow_late?: boolean;
};

type TestRow = {
  id: number;
  title: string;
  duration_minutes?: number | null;
  max_attempts?: number;
  questions_count?: number;
};

type LiveSessionRow = {
  id: number;
  title: string;
  scheduled_at?: string | null;
  meeting_url?: string | null;
  status?: string;
};

type RecordingRow = { id: number; title: string; video_url?: string | null };
type AnnouncementRow = { id: number; title: string; body?: string; published_at?: string | null };
type MaterialRow = { id: number; title: string; file_path: string };

type PageProps = { id: number; roomId: string; portal?: "admin" | "student" };

const LmsClassRoomShow = () => {
  const { props } = usePage<PageProps>();
  const { id: classId, roomId, portal = "admin" } = props;
  const queryClient = useQueryClient();
  const assignmentDialog = useDisclosure<boolean>();
  const testDialog = useDisclosure<boolean>();
  const liveSessionDialog = useDisclosure<boolean>();
  const attendanceDialog = useDisclosure<boolean>();
  const submitDisclosure = useDisclosure<{ assignmentId: number }>();
  const testTakingDisclosure = useDisclosure<{ testId: number }>();
  const [assignmentTypeFilter, setAssignmentTypeFilter] = useState<string>("");

  const { handleSubmit, control, reset } = useForm<SubmitFormValues>({
    resolver: zodResolver(submitSchema),
    defaultValues: { feedback: "" },
    mode: "onChange",
  });

  const submitMutation = useMutation({
    mutationFn: ({ assignmentId, payload }: { assignmentId: number; payload: SubmitFormValues }) =>
      lmsApi.assignmentSubmissions.store(classId, assignmentId, {
        feedback: payload.feedback || undefined,
        status: "submitted",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lms-class-assignments", classId] });
      reset();
      submitDisclosure.onClose();
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["lms-class", classId],
    queryFn: () => lmsApi.classes.show(classId),
    enabled: !!classId,
  });

  const { data: allocationsRes } = useQuery({
    queryKey: ["lms-class-allocations", classId],
    queryFn: () => lmsApi.classes.allocations(classId),
    enabled: !!classId && roomId !== "general",
  });

  const allocations = ((allocationsRes as { data?: AllocationItem[] })?.data ?? []) as AllocationItem[];
  const currentRoom = roomId === "general"
    ? null
    : allocations.find((a) => String(a.id) === roomId);
  const roomLabel = currentRoom ? (currentRoom.subject?.name ?? "Subject") : "General";

  const allocationId = roomId !== "general" ? Number(roomId) : undefined;
  const allocationParams = allocationId != null ? { allocation_id: allocationId } : {};

  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["lms-class-assignments", classId, assignmentTypeFilter, allocationId ?? "all"],
    queryFn: () => lmsApi.assignments.index(classId, { per_page: 50, ...allocationParams, ...(assignmentTypeFilter ? { type: assignmentTypeFilter } : {}) }),
    enabled: !!classId,
  });

  const { data: testsData, isLoading: testsLoading } = useQuery({
    queryKey: ["lms-class-tests", classId, allocationId ?? "all"],
    queryFn: () => lmsApi.tests.index(classId, { per_page: 50, ...allocationParams }),
    enabled: !!classId,
  });

  const { data: liveSessionsData } = useQuery({
    queryKey: ["lms-class-live-sessions", classId, allocationId ?? "all"],
    queryFn: () => lmsApi.liveSessions.index(classId, { per_page: 20, ...allocationParams }),
    enabled: !!classId,
  });

  const { data: recordingsData } = useQuery({
    queryKey: ["lms-class-recordings", classId, allocationId ?? "all"],
    queryFn: () => lmsApi.recordings.index(classId, { per_page: 20, ...allocationParams }),
    enabled: !!classId,
  });

  const { data: announcementsData } = useQuery({
    queryKey: ["lms-class-announcements", classId, allocationId ?? "all"],
    queryFn: () => lmsApi.announcements.index(classId, { per_page: 20, ...allocationParams }),
    enabled: !!classId,
  });

  const { data: materialsData } = useQuery({
    queryKey: ["lms-class-materials", classId, allocationId ?? "all"],
    queryFn: () => lmsApi.materials.index(classId, { per_page: 20, ...allocationParams }),
    enabled: !!classId,
  });

  const { data: attendanceRes } = useQuery({
    queryKey: ["lms-class-attendance-summary", classId, allocationId],
    queryFn: () => attendanceApi.reports.summary({
      lms_class_id: classId,
      ...(allocationId ? { class_subject_allocation_id: allocationId, level: "subject" } : { level: "class" }),
      from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10), // Start of month
      to_date: new Date().toISOString().slice(0, 10),
    }),
    enabled: !!classId,
  });

  const classDetail = (data as { data?: ClassDetail })?.data as ClassDetail | undefined;
  const assignments = ((assignmentsData as { data?: AssignmentRow[] })?.data ?? []) as AssignmentRow[];
  const tests = ((testsData as { data?: TestRow[] })?.data ?? []) as TestRow[];
  const liveSessions = ((liveSessionsData as { data?: LiveSessionRow[] })?.data ?? []) as LiveSessionRow[];
  const recordings = ((recordingsData as { data?: RecordingRow[] })?.data ?? []) as RecordingRow[];
  const announcements = ((announcementsData as { data?: AnnouncementRow[] })?.data ?? []) as AnnouncementRow[];
  const materials = ((materialsData as { data?: MaterialRow[] })?.data ?? []) as MaterialRow[];

  const isStudentPortal = portal === "student";
  const classHref = isStudentPortal ? `/student-portal/my-classes/${classId}` : `/lms/classes/${classId}`;
  const breadcrumbsBase = isStudentPortal ? STUDENT_MY_CLASSES_BREADCRUMBS : LMS_CLASSES_BREADCRUMBS;
  const breadcrumbs = [
    ...breadcrumbsBase,
    { title: classDetail?.name ?? "Class", href: classHref },
    { title: roomLabel, href: isStudentPortal ? `/student-portal/my-classes/${classId}/rooms/${roomId}` : `/lms/classes/${classId}/rooms/${roomId}` },
  ];

  return (
    <>
      <Head title={classDetail?.name ? `${classDetail.name} – ${roomLabel}` : "LMS Class"} />
      {classId && (
        <>
          <LmsAssignmentDialog open={assignmentDialog.isOpen} onClose={() => assignmentDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsTestDialog open={testDialog.isOpen} onClose={() => testDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsLiveSessionDialog open={liveSessionDialog.isOpen} onClose={() => liveSessionDialog.onClose()} classId={classId} allocationId={allocationId} />
          <LmsAttendanceDialog open={attendanceDialog.isOpen} onClose={() => attendanceDialog.onClose()} classId={classId} allocationId={allocationId} />
        </>
      )}
      <PermissionGate can="view_my_lms_classes">
        <ModalDialog
          title="Submit assignment"
          open={submitDisclosure.isOpen}
          onClose={() => submitDisclosure.onClose()}
          handleSubmit={handleSubmit((data) => {
            if (submitDisclosure.data?.assignmentId != null) {
              submitMutation.mutate({ assignmentId: submitDisclosure.data.assignmentId, payload: data });
            }
          })}
          isLoading={submitMutation.isPending}
        >
          <div className="grid gap-4">
            <ControlledFormComponent
              name="feedback"
              label="Feedback / Notes (optional)"
              type={FORM_TYPE.TEXTAREA}
              control={control}
              placeholder="Add any notes with your submission"
              rows={3}
            />
          </div>
        </ModalDialog>
      </PermissionGate>
      {testTakingDisclosure.isOpen && testTakingDisclosure.data && (
        <LmsTestTakingView
          open={testTakingDisclosure.isOpen}
          onClose={() => testTakingDisclosure.onClose()}
          classId={classId}
          testId={testTakingDisclosure.data.testId}
        />
      )}
      <div className="space-y-6">
        <Link
          href={classHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground mb-2"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to class
        </Link>
        <MainPageHeader
          breadcrumbs={[]}
          icon={Users}
          title={roomLabel}
          subtitle={classDetail?.name ? `${classDetail.name}${classDetail.code ? ` (${classDetail.code})` : ""}` : undefined}
        />
        {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
        {!isLoading && classDetail && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Course</p>
                  <p className="text-foreground">{classDetail.lms_course?.title ?? "—"}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Session</p>
                  <p className="text-foreground">{classDetail.session?.name ?? "—"}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Room</p>
                  <p className="text-foreground">{currentRoom?.subject?.name ?? "—"}</p>
                </CardContent>
              </Card>
              <Card className="border border-border/60 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ClipboardCheck className="size-16" />
                </div>
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Attendance Rate</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black tracking-tighter text-foreground">
                          {attendanceRes?.data?.summary?.percentage_present ?? 0}%
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">THIS MONTH</span>
                      </div>
                    </div>
                    <PermissionGate can="view_attendance">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl font-bold text-xs"
                        onClick={() => attendanceDialog.onOpen(true)}
                      >
                        Manage
                      </Button>
                    </PermissionGate>
                  </div>
                  <Progress value={attendanceRes?.data?.summary?.percentage_present ?? 0} className="h-2 rounded-full bg-primary/10" />
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Assignments & Homework</h2>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={assignmentTypeFilter}
                    onChange={(e) => setAssignmentTypeFilter(e.target.value)}
                    aria-label="Filter by type"
                  >
                    <option value="">All</option>
                    <option value="assignment">Assignment</option>
                    <option value="homework">Homework</option>
                    <option value="project">Project</option>
                  </select>
                  <PermissionGate can="create_lms_classes">
                    <Button size="sm" onClick={() => assignmentDialog.onOpen(true)}>
                      <Plus className="size-4" />
                      Add Assignment
                    </Button>
                  </PermissionGate>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {assignmentsLoading && <p className="text-muted-foreground text-sm">Loading assignments...</p>}
                {!assignmentsLoading && (
                  <Each
                    of={assignments}
                    keyExtractor={(a: AssignmentRow) => a.id}
                    nodatafound={<p className="text-muted-foreground text-sm py-4">No assignments yet. Add one to get started.</p>}
                    render={(a: AssignmentRow) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between py-2 border-b border-border/60 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{a.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {a.type} {a.due_at ? ` · Due ${new Date(a.due_at).toLocaleDateString()}` : ""} {a.max_score != null ? ` · ${a.max_score} pts` : ""}
                          </p>
                        </div>
                        <PermissionGate can="view_my_lms_classes">
                          <Button size="sm" variant="outline" onClick={() => submitDisclosure.onOpen({ assignmentId: a.id })}>
                            <Send className="size-4 mr-1" />
                            Submit
                          </Button>
                        </PermissionGate>
                      </div>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="size-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Tests</h2>
                </div>
                <PermissionGate can="create_lms_classes">
                  <Button size="sm" onClick={() => testDialog.onOpen(true)}>
                    <Plus className="size-4" />
                    Add Test
                  </Button>
                </PermissionGate>
              </CardHeader>
              <CardContent className="pt-0">
                {testsLoading && <p className="text-muted-foreground text-sm">Loading tests...</p>}
                {!testsLoading && (
                  <Each
                    of={tests}
                    keyExtractor={(t: TestRow) => t.id}
                    nodatafound={<p className="text-muted-foreground text-sm py-4">No tests yet. Add one to get started.</p>}
                    render={(t: TestRow) => (
                      <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
                        <div>
                          <p className="font-medium">{t.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {t.duration_minutes != null ? `${t.duration_minutes} min` : ""} {t.max_attempts != null ? ` · ${t.max_attempts} attempt(s)` : ""} {t.questions_count != null ? ` · ${t.questions_count} question(s)` : ""}
                          </p>
                        </div>
                        <PermissionGate can="view_my_lms_classes">
                          <Button size="sm" variant="outline" onClick={() => testTakingDisclosure.onOpen({ testId: t.id })}>
                            <Play className="size-4 mr-1" />
                            Start Test
                          </Button>
                        </PermissionGate>
                      </div>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Video className="size-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Live Sessions</h2>
                </div>
                <PermissionGate can="create_lms_classes">
                  <Button size="sm" onClick={() => liveSessionDialog.onOpen(true)}>
                    <Plus className="size-4" />
                    Add Live Session
                  </Button>
                </PermissionGate>
              </CardHeader>
              <CardContent className="pt-0">
                <Each
                  of={liveSessions}
                  keyExtractor={(s: LiveSessionRow) => s.id}
                  nodatafound={<p className="text-muted-foreground text-sm py-4">No live sessions yet.</p>}
                  render={(s: LiveSessionRow) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {s.scheduled_at ? new Date(s.scheduled_at).toLocaleString() : ""} {s.meeting_url && " · "}
                          {s.meeting_url && (
                            <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Join
                            </a>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Paperclip className="size-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Recordings</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Each
                  of={recordings}
                  keyExtractor={(r: RecordingRow) => r.id}
                  nodatafound={<p className="text-muted-foreground text-sm py-4">No recordings yet.</p>}
                  render={(r: RecordingRow) => (
                    <div key={r.id} className="py-2 border-b border-border/60 last:border-0">
                      <p className="font-medium">{r.title}</p>
                      {r.video_url && (
                        <a href={r.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          Watch
                        </a>
                      )}
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="size-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Announcements</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Each
                  of={announcements}
                  keyExtractor={(a: AnnouncementRow) => a.id}
                  nodatafound={<p className="text-muted-foreground text-sm py-4">No announcements yet.</p>}
                  render={(a: AnnouncementRow) => (
                    <div key={a.id} className="py-2 border-b border-border/60 last:border-0">
                      <p className="font-medium">{a.title}</p>
                      {a.published_at && <p className="text-xs text-muted-foreground">{new Date(a.published_at).toLocaleDateString()}</p>}
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Paperclip className="size-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Materials</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Each
                  of={materials}
                  keyExtractor={(m: MaterialRow) => m.id}
                  nodatafound={<p className="text-muted-foreground text-sm py-4">No materials yet.</p>}
                  render={(m: MaterialRow) => (
                    <div key={m.id} className="py-2 border-b border-border/60 last:border-0">
                      <p className="font-medium">{m.title}</p>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </>
        )}
        {!isLoading && !classDetail && classId && (
          <p className="text-muted-foreground">Class not found.</p>
        )}
      </div>
    </>
  );
};

export default LmsClassRoomShow;
