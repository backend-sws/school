import type { InstitutionContentMap } from "@/constants/content";
import type { BreadcrumbItem } from "@/types";

// ── Permissions ──────────────────────────────────────────────────────────────
export const LMS_CLASSES_PERMISSIONS = {
  view: "view_lms_classes",
  create: "create_lms_classes",
  edit: "update_lms_classes",
  delete: "delete_lms_classes",
} as const;

// ── Content (from content engine) ────────────────────────────────────────────
export function getLmsClassesContent(c: InstitutionContentMap) {
  return {
    pageTitle: c.lms_classes_page_title,
    pageSubtitle: c.lms_classes_page_subtitle,
    guidance: c.lms_classes_guidance,
    searchPlaceholder: c.lms_classes_search_placeholder,
    sessionLabel: c.lms_classes_session_label,
    emptyTitle: c.lms_classes_empty_title,
    emptyDesc: c.lms_classes_empty_desc,
    classroomCountLabel: c.lms_classes_classroom_count_label,
    durationLabel: c.lms_classes_duration_label,
  };
}

// ── Breadcrumbs ──────────────────────────────────────────────────────────────
export function getLmsClassesBreadcrumbs(c: InstitutionContentMap): BreadcrumbItem[] {
  return [
    { title: "Academic Setup", href: "/lms" },
    { title: c.lms_classes_breadcrumb_self, href: "/lms/classes" },
  ];
}

// ── Stream Detail Content (from content engine) ──────────────────────────────
export function getLmsStreamDetailContent(c: InstitutionContentMap) {
  return {
    sectionTitle: c.lms_stream_detail_section_title,
    searchPlaceholder: c.lms_stream_detail_search_placeholder,
    addLabel: c.lms_stream_detail_add_label,
    addDesc: c.lms_stream_detail_add_desc,
    studentLabel: c.lms_stream_detail_student_label,
    backLabel: c.lms_stream_detail_back_label,
    emptyTitle: c.lms_stream_detail_empty_title,
    emptyDesc: c.lms_stream_detail_empty_desc,
    // Also include parent page content for breadcrumbs
    breadcrumbSelf: c.lms_classes_breadcrumb_self,
  };
}

// ── Stream Detail Breadcrumbs ────────────────────────────────────────────────
export function getLmsStreamDetailBreadcrumbs(
  c: InstitutionContentMap,
  streamName?: string | null,
  streamId?: number | null,
): BreadcrumbItem[] {
  return [
    { title: "Academic Setup", href: "/lms" },
    { title: c.lms_classes_breadcrumb_self, href: "/lms/classes" },
    { title: streamName ?? "Stream", href: `/lms/classes/stream/${streamId}` },
  ];
}

// ── Class Detail Content (from content engine) ───────────────────────────────
export function getLmsClassDetailContent(c: InstitutionContentMap) {
  return {
    subjectsTitle: c.lms_class_detail_subjects_title,
    subjectsDesc: c.lms_class_detail_subjects_desc,
    searchPlaceholder: c.lms_class_detail_search_placeholder,
    addSubjectLabel: c.lms_class_detail_add_subject_label,
    addSubjectDesc: c.lms_class_detail_add_subject_desc,
    editBtn: c.lms_class_detail_edit_btn,
    backLabel: c.lms_class_detail_back_label,
    notFoundTitle: c.lms_class_detail_not_found_title,
    notFoundDesc: c.lms_class_detail_not_found_desc,
    guidance: c.lms_class_detail_guidance,
    // Also include parent page content for breadcrumbs
    breadcrumbSelf: c.lms_classes_breadcrumb_self,
  };
}

// ── Class Detail Breadcrumbs ─────────────────────────────────────────────────
export function getLmsClassDetailBreadcrumbs(
  c: InstitutionContentMap,
  streamName?: string | null,
  streamId?: number | null,
  className?: string | null,
  classId?: number | null,
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { title: "Academic Setup", href: "/lms" },
    { title: c.lms_classes_breadcrumb_self, href: "/lms/classes" },
  ];
  if (streamName && streamId) {
    crumbs.push({ title: streamName, href: `/lms/classes/stream/${streamId}` });
  }
  crumbs.push({ title: className ?? "Class", href: `/lms/classes/${classId}` });
  return crumbs;
}

// ── Subject Detail Content (from content engine) ─────────────────────────────
export function getLmsSubjectDetailContent(c: InstitutionContentMap) {
  return {
    classLabel: c.lms_subject_detail_class_label,
    instructorLabel: c.lms_subject_detail_instructor_label,
    unitsLabel: c.lms_subject_detail_units_label,
    studentsLabel: c.lms_subject_detail_students_label,
    changeTeacherBtn: c.lms_subject_detail_change_teacher_btn,
    assignInstructorBtn: c.lms_subject_detail_assign_instructor_btn,
    scheduleBtn: c.lms_subject_detail_schedule_btn,
    calendarTitle: c.lms_subject_detail_calendar_title,
    // Announcements
    postAnnouncementLabel: c.lms_subject_detail_post_announcement_label,
    postAnnouncementDesc: c.lms_subject_detail_post_announcement_desc,
    noAnnouncements: c.lms_subject_detail_no_announcements,
    // Curriculum
    addCurriculumLabel: c.lms_subject_detail_add_curriculum_label,
    addCurriculumDesc: c.lms_subject_detail_add_curriculum_desc,
    noCurriculum: c.lms_subject_detail_no_curriculum,
    viewSubmissionsBtn: c.lms_subject_detail_view_submissions_btn,
    // Assessments
    createTestLabel: c.lms_subject_detail_create_test_label,
    createTestDesc: c.lms_subject_detail_create_test_desc,
    noTests: c.lms_subject_detail_no_tests,
    manageQuestionsBtn: c.lms_subject_detail_manage_questions_btn,
    // Sessions
    scheduleLiveLabel: c.lms_subject_detail_schedule_live_label,
    scheduleLiveDesc: c.lms_subject_detail_schedule_live_desc,
    noSessions: c.lms_subject_detail_no_sessions,
    joinBtn: c.lms_subject_detail_join_btn,
    // Recordings
    uploadRecordingLabel: c.lms_subject_detail_upload_recording_label,
    uploadRecordingDesc: c.lms_subject_detail_upload_recording_desc,
    noRecordings: c.lms_subject_detail_no_recordings,
    // Resources
    uploadFileLabel: c.lms_subject_detail_upload_file_label,
    uploadFileDesc: c.lms_subject_detail_upload_file_desc,
    noResources: c.lms_subject_detail_no_resources,
    // Students
    noStudents: c.lms_subject_detail_no_students,
    studentsCount: c.lms_subject_detail_students_count,
  };
}

// ── Subject Detail Breadcrumbs ───────────────────────────────────────────────
export function getLmsSubjectDetailBreadcrumbs(
  c: InstitutionContentMap,
  streamName?: string | null,
  streamId?: number | null,
  className?: string | null,
  classId?: number | null,
  subjectName?: string | null,
  allocationId?: number | null,
): BreadcrumbItem[] {
  const crumbs = getLmsClassDetailBreadcrumbs(c, streamName, streamId, className, classId);
  crumbs.push({ title: subjectName ?? "Subject", href: `/lms/classes/${classId}/subjects/${allocationId}` });
  return crumbs;
}
