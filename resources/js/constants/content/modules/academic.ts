/**
 * Academic content module — stream/semester/class/section terminology
 * AND page-level content for Streams page.
 *
 * These are the foundational labels that change by institution type:
 * school = Class/Term, college = Stream/Semester, coaching = Batch/Term, university = Stream/Semester.
 */

import type { InstitutionType } from "@/constants/landing/types";

export interface AcademicContentKeys {
  // ── Core terminology ────────────────────────────────
  stream: string;
  semester: string;
  main_stream: string;
  current_semester: string;
  streams_and_programs_title: string;
  main_streams_title: string;
  all_streams: string;
  all_main_streams: string;
  stream_slash_course: string;
  stream_slash_session: string;

  // ── Settings navigation ───────────────────────────
  settings_academic_hierarchy_title: string;

  // ── Page: Streams ───────────────────────────────────
  streams_page_title: string;
  streams_page_subtitle: string;
  streams_guidance: string[];
  streams_add_btn: string;
  streams_create_title: string;
  streams_edit_title: string;
  streams_create_btn: string;
  streams_update_btn: string;
  streams_cancel_btn: string;
  streams_empty_title: string;
  streams_empty_desc: string;
  streams_delete_title: string;
  streams_delete_desc: string;
  streams_col_sl: string;
  streams_col_name: string;
  streams_col_code: string;
  streams_col_duration: string;
  streams_col_main_stream: string;
  streams_col_status: string;
  streams_col_actions: string;
  streams_filter_main_stream_placeholder: string;
  streams_filter_main_stream_all: string;
  streams_search_placeholder: string;
  // Form field labels (scope-aware)
  streams_field_name_label: string;
  streams_field_name_placeholder: string;
  streams_field_name_tooltip: string;
  streams_field_code_label: string;
  streams_field_code_placeholder: string;
  streams_field_code_tooltip: string;
  streams_field_duration_label: string;
  streams_field_duration_placeholder: string;
  streams_field_duration_tooltip: string;
  streams_field_main_stream_label: string;
  streams_field_main_stream_placeholder: string;
  streams_field_main_stream_tooltip: string;
  // Breadcrumbs
  streams_breadcrumb_parent: string;
  streams_breadcrumb_self: string;
  streams_tip: string;

  // ── Page: Subjects ──────────────────────────────────
  subjects_page_title: string;
  subjects_page_subtitle: string;
  subjects_guidance: string[];
  subjects_add_btn: string;
  subjects_create_title: string;
  subjects_edit_title: string;
  subjects_create_btn: string;
  subjects_update_btn: string;
  subjects_cancel_btn: string;
  subjects_empty_title: string;
  subjects_empty_desc: string;
  subjects_delete_title: string;
  subjects_delete_desc: string;
  subjects_col_sl: string;
  subjects_col_name: string;
  subjects_col_code: string;
  subjects_col_stream: string;
  subjects_col_status: string;
  subjects_col_practical: string;
  subjects_col_actions: string;
  subjects_filter_stream_placeholder: string;
  subjects_filter_stream_all: string;
  subjects_filter_group_placeholder: string;
  subjects_filter_group_all: string;
  subjects_search_placeholder: string;
  subjects_breadcrumb_parent: string;
  subjects_breadcrumb_self: string;
  subjects_tip: string;
  // Form field labels
  subjects_field_name_label: string;
  subjects_field_name_placeholder: string;
  subjects_field_name_tooltip: string;
  subjects_field_code_label: string;
  subjects_field_code_placeholder: string;
  subjects_field_code_tooltip: string;
  subjects_field_stream_label: string;
  subjects_field_stream_placeholder: string;
  subjects_field_stream_tooltip: string;
  subjects_field_is_practical_label: string;
  subjects_field_is_practical_tooltip: string;

  // ── Page: LMS Classrooms ────────────────────────────
  lms_classes_page_title: string;
  lms_classes_page_subtitle: string;
  lms_classes_guidance: string[];
  lms_classes_search_placeholder: string;
  lms_classes_session_label: string;
  lms_classes_empty_title: string;
  lms_classes_empty_desc: string;
  lms_classes_classroom_count_label: string;
  lms_classes_duration_label: string;
  lms_classes_breadcrumb_self: string;

  // ── Page: LMS Stream Detail (classrooms under a stream) ──
  lms_stream_detail_section_title: string;
  lms_stream_detail_search_placeholder: string;
  lms_stream_detail_add_label: string;
  lms_stream_detail_add_desc: string;
  lms_stream_detail_student_label: string;
  lms_stream_detail_back_label: string;
  lms_stream_detail_empty_title: string;
  lms_stream_detail_empty_desc: string;

  // Guide: LMS Sections (stream detail page)
  lms_sections_guide_title: string;
  lms_sections_guide_subtitle: string;
  lms_sections_guide_guidance: string[];
  lms_sections_guide_tip: string;

  // ── Page: LMS Class Detail (subjects under a class) ──
  lms_class_detail_subjects_title: string;
  lms_class_detail_subjects_desc: string;
  lms_class_detail_search_placeholder: string;
  lms_class_detail_add_subject_label: string;
  lms_class_detail_add_subject_desc: string;
  lms_class_detail_edit_btn: string;
  lms_class_detail_back_label: string;
  lms_class_detail_not_found_title: string;
  lms_class_detail_not_found_desc: string;
  lms_class_detail_guidance: string[];

  // ── Page: LMS Subject Detail (single allocation) ──
  lms_subject_detail_class_label: string;
  lms_subject_detail_instructor_label: string;
  lms_subject_detail_units_label: string;
  lms_subject_detail_students_label: string;
  lms_subject_detail_change_teacher_btn: string;
  lms_subject_detail_assign_instructor_btn: string;
  lms_subject_detail_schedule_btn: string;
  lms_subject_detail_calendar_title: string;
  // Tab: Announcements
  lms_subject_detail_post_announcement_label: string;
  lms_subject_detail_post_announcement_desc: string;
  lms_subject_detail_no_announcements: string;
  // Tab: Curriculum
  lms_subject_detail_add_curriculum_label: string;
  lms_subject_detail_add_curriculum_desc: string;
  lms_subject_detail_no_curriculum: string;
  lms_subject_detail_view_submissions_btn: string;
  // Tab: Assessments
  lms_subject_detail_create_test_label: string;
  lms_subject_detail_create_test_desc: string;
  lms_subject_detail_no_tests: string;
  lms_subject_detail_manage_questions_btn: string;
  // Tab: Sessions
  lms_subject_detail_schedule_live_label: string;
  lms_subject_detail_schedule_live_desc: string;
  lms_subject_detail_no_sessions: string;
  lms_subject_detail_join_btn: string;
  // Tab: Recordings
  lms_subject_detail_upload_recording_label: string;
  lms_subject_detail_upload_recording_desc: string;
  lms_subject_detail_no_recordings: string;
  // Tab: Resources
  lms_subject_detail_upload_file_label: string;
  lms_subject_detail_upload_file_desc: string;
  lms_subject_detail_no_resources: string;
  // Tab: Students
  lms_subject_detail_no_students: string;
  lms_subject_detail_students_count: string;
}

// ────────────────────────────────────────────────────────
// School
// ────────────────────────────────────────────────────────
const school: AcademicContentKeys = {
  // Core terminology
  stream: "Class",
  semester: "Term",
  main_stream: "Level",
  current_semester: "Current Term",
  streams_and_programs_title: "Classes",
  main_streams_title: "Levels",
  all_streams: "All Classes",
  all_main_streams: "All Levels",
  stream_slash_course: "Class / Course",
  stream_slash_session: "Class / Session",
  settings_academic_hierarchy_title: "Class Hierarchy",

  // Page: Streams (school = "Classes")
  streams_page_title: "Classes",
  streams_page_subtitle: "Manage classes, sections, and their academic configurations.",
  streams_guidance: [
    "Classes are the primary academic groupings for students (e.g. Nursery, LKG, Class I).",
    "Each class belongs to a Level (e.g. Pre-Primary, Primary). A code is auto-generated from the name.",
    "Use the filter to narrow by level when managing many classes.",
  ],
  streams_add_btn: "Add Class",
  streams_create_title: "Add Class",
  streams_edit_title: "Edit Class",
  streams_create_btn: "Create",
  streams_update_btn: "Update",
  streams_cancel_btn: "Cancel",
  streams_empty_title: "No classes found",
  streams_empty_desc: "Add classes to organise students by level and section.",
  streams_delete_title: "Delete class",
  streams_delete_desc: "Are you sure you want to delete this class? This cannot be undone.",
  streams_col_sl: "#",
  streams_col_name: "Name",
  streams_col_code: "Code",
  streams_col_duration: "Duration",
  streams_col_main_stream: "Level",
  streams_col_status: "Status",
  streams_col_actions: "Actions",
  streams_filter_main_stream_placeholder: "Filter by Level",
  streams_filter_main_stream_all: "All Levels",
  streams_search_placeholder: "Search classes...",
  // Form fields
  streams_field_name_label: "Class Name",
  streams_field_name_placeholder: "e.g. Nursery - A, Class I - A",
  streams_field_name_tooltip: "Name of the class section. Used for enrollment and roll numbers.",
  streams_field_code_label: "Code",
  streams_field_code_placeholder: "e.g. NUR-A, CLS-1-A",
  streams_field_code_tooltip: "Short unique code for this class. Auto-generated from the name.",
  streams_field_duration_label: "Duration (in Years)",
  streams_field_duration_placeholder: "e.g. 1",
  streams_field_duration_tooltip: "Class duration. Usually 1 year for schools.",
  streams_field_main_stream_label: "Level",
  streams_field_main_stream_placeholder: "e.g. Pre-Primary, Primary",
  streams_field_main_stream_tooltip: "Parent level this class belongs to.",
  // Breadcrumbs
  streams_breadcrumb_parent: "Academic Setup",
  streams_breadcrumb_self: "Classes",
  streams_tip: "Define structured academic tracks to enable organized enrollment and progress tracking.",

  // Page: Subjects (school)
  subjects_page_title: "Subjects",
  subjects_page_subtitle: "Maintain a central catalog of all academic subjects, credits, and practical requirements.",
  subjects_guidance: [
    "Create subjects that can be assigned to classes and classrooms for timetabling.",
    "Set subject codes, credit hours, and practical status for curriculum management.",
    "Group related subjects using Subject Groups for streamlined assignment.",
  ],
  subjects_add_btn: "Register New Subject",
  subjects_create_title: "Add Subject",
  subjects_edit_title: "Edit Subject",
  subjects_create_btn: "Create",
  subjects_update_btn: "Update",
  subjects_cancel_btn: "Cancel",
  subjects_empty_title: "No subjects found",
  subjects_empty_desc: "Register subjects to build your curriculum and timetable.",
  subjects_delete_title: "Delete subject",
  subjects_delete_desc: "Are you sure you want to delete this subject? This cannot be undone.",
  subjects_col_sl: "#",
  subjects_col_name: "Name",
  subjects_col_code: "Code",
  subjects_col_stream: "Class",
  subjects_col_status: "Status",
  subjects_col_practical: "Practical",
  subjects_col_actions: "Actions",
  subjects_filter_stream_placeholder: "Filter by Class",
  subjects_filter_stream_all: "All Classes",
  subjects_filter_group_placeholder: "Filter by Subject Group",
  subjects_filter_group_all: "All Groups",
  subjects_search_placeholder: "Search subjects...",
  subjects_breadcrumb_parent: "Academic Setup",
  subjects_breadcrumb_self: "Subjects",
  subjects_tip: "Standardize your curriculum by centralizing subjects and practical requirements for consistent academic auditing.",
  subjects_field_name_label: "Name",
  subjects_field_name_placeholder: "e.g. Geography, Introduction to Programming",
  subjects_field_name_tooltip: "Full subject name. These are the credit-bearing units in the curriculum.",
  subjects_field_code_label: "Code",
  subjects_field_code_placeholder: "e.g. GEO-101, CS101",
  subjects_field_code_tooltip: "Short unique code for the subject. Used in timetables and result processing.",
  subjects_field_stream_label: "Class",
  subjects_field_stream_placeholder: "e.g. Class I, LKG",
  subjects_field_stream_tooltip: "Class this subject belongs to. Filters by level when applicable.",
  subjects_field_is_practical_label: "Is Practical",
  subjects_field_is_practical_tooltip: "Whether this subject has a practical/lab component. Affects fee and scheduling.",

  // LMS Classrooms (school)
  lms_classes_page_title: "Classrooms",
  lms_classes_page_subtitle: "Select a class to view its classrooms (sections) and subjects.",
  lms_classes_guidance: [
    "Classrooms are running sections (e.g. Section A, B) under a class and session.",
    "Each classroom can have many subjects and content (assignments, tests, live sessions, recordings).",
    "Select a class to see its classrooms; open a classroom to manage subjects, class teacher, students, and activities.",
  ],
  lms_classes_search_placeholder: "Search classes...",
  lms_classes_session_label: "Academic Session",
  lms_classes_empty_title: "No classes found",
  lms_classes_empty_desc: "Add a classroom and link it to a class and session to see it here.",
  lms_classes_classroom_count_label: "Classrooms",
  lms_classes_duration_label: "Years",
  lms_classes_breadcrumb_self: "Classrooms",

  // LMS Stream Detail (school)
  lms_stream_detail_section_title: "Active Sections",
  lms_stream_detail_search_placeholder: "Search sections...",
  lms_stream_detail_add_label: "Add New Section",
  lms_stream_detail_add_desc: "Create a new classroom under this class",
  lms_stream_detail_student_label: "Students",
  lms_stream_detail_back_label: "Back to Classrooms",
  lms_stream_detail_empty_title: "No sections yet",
  lms_stream_detail_empty_desc: "Add a section to get started.",

  // Guide: LMS Sections (school)
  lms_sections_guide_title: "Sections",
  lms_sections_guide_subtitle: "View and manage sections (e.g. Section A, B) under this class.",
  lms_sections_guide_guidance: [
    "Each section represents an active classroom under a class and session.",
    "Assign a class teacher, enroll students, and manage timetable for each section.",
    "Click a section card to open its subjects, attendance, and content management.",
  ],
  lms_sections_guide_tip: "Ensure each section has a class teacher assigned for attendance and communication features.",

  // Class Detail (school)
  lms_class_detail_subjects_title: "Class Subjects",
  lms_class_detail_subjects_desc: "Allocated subjects and instructors for this class section.",
  lms_class_detail_search_placeholder: "Search subjects...",
  lms_class_detail_add_subject_label: "Add Subject",
  lms_class_detail_add_subject_desc: "Assign a new subject/teacher",
  lms_class_detail_edit_btn: "Edit Class",
  lms_class_detail_back_label: "Back to class",
  lms_class_detail_not_found_title: "Class not found",
  lms_class_detail_not_found_desc: "The class you're looking for might have been removed or doesn't exist.",
  lms_class_detail_guidance: [
    "Manage subjects, class teacher, students, and activities for this section.",
    "Allocate subjects and assign instructors. Open a subject to manage assignments, tests, and sessions.",
  ],

  // Subject Detail (school)
  lms_subject_detail_class_label: "Class Subject",
  lms_subject_detail_instructor_label: "Instructor",
  lms_subject_detail_units_label: "Units",
  lms_subject_detail_students_label: "Students",
  lms_subject_detail_change_teacher_btn: "Change Teacher",
  lms_subject_detail_assign_instructor_btn: "Assign Instructor",
  lms_subject_detail_schedule_btn: "Schedule",
  lms_subject_detail_calendar_title: "Study Calendar",
  lms_subject_detail_post_announcement_label: "Post Announcement",
  lms_subject_detail_post_announcement_desc: "Share an update or reminder",
  lms_subject_detail_no_announcements: "No announcements yet",
  lms_subject_detail_add_curriculum_label: "Add Curriculum Item",
  lms_subject_detail_add_curriculum_desc: "Task or activity for this curriculum",
  lms_subject_detail_no_curriculum: "No curriculum posted",
  lms_subject_detail_view_submissions_btn: "View Submissions",
  lms_subject_detail_create_test_label: "Create Test",
  lms_subject_detail_create_test_desc: "Set up a new assessment",
  lms_subject_detail_no_tests: "No tests created",
  lms_subject_detail_manage_questions_btn: "Manage Questions",
  lms_subject_detail_schedule_live_label: "Schedule Live",
  lms_subject_detail_schedule_live_desc: "Start a new online lesson",
  lms_subject_detail_no_sessions: "No live sessions",
  lms_subject_detail_join_btn: "Join Now",
  lms_subject_detail_upload_recording_label: "Upload Recording",
  lms_subject_detail_upload_recording_desc: "Add video link or recording file",
  lms_subject_detail_no_recordings: "No recordings yet",
  lms_subject_detail_upload_file_label: "Upload File",
  lms_subject_detail_upload_file_desc: "Add documents or links",
  lms_subject_detail_no_resources: "No resources uploaded",
  lms_subject_detail_no_students: "No students enrolled",
  lms_subject_detail_students_count: "students",
};

// ────────────────────────────────────────────────────────
// College
// ────────────────────────────────────────────────────────
const college: AcademicContentKeys = {
  stream: "Stream",
  semester: "Semester",
  main_stream: "Main Stream",
  current_semester: "Current Semester",
  streams_and_programs_title: "Streams & Programs",
  main_streams_title: "Main Course Streams",
  all_streams: "All Streams",
  all_main_streams: "All Main Streams",
  stream_slash_course: "Stream / Course",
  stream_slash_session: "Stream / Session",
  settings_academic_hierarchy_title: "Stream Hierarchy",

  streams_page_title: "Streams & Programs",
  streams_page_subtitle: "Configure specific academic courses, their durations, and branch specializations.",
  streams_guidance: [
    "Program streams are specific academic tracks (e.g. B.Sc. Honours, B.A. General) under a main course stream.",
    "The program duration dictates the multi-year session mapping for enrolled students.",
    "Streams must be accurately mapped to main course streams for unified institutional auditing.",
  ],
  streams_add_btn: "Define Program Stream",
  streams_create_title: "Add Stream",
  streams_edit_title: "Edit Stream",
  streams_create_btn: "Create",
  streams_update_btn: "Update",
  streams_cancel_btn: "Cancel",
  streams_empty_title: "No streams found",
  streams_empty_desc: "Define program streams to organise academic courses and enrollments.",
  streams_delete_title: "Delete stream",
  streams_delete_desc: "Are you sure you want to delete this stream? This cannot be undone.",
  streams_col_sl: "#",
  streams_col_name: "Name",
  streams_col_code: "Code",
  streams_col_duration: "Duration",
  streams_col_main_stream: "Main Stream",
  streams_col_status: "Status",
  streams_col_actions: "Actions",
  streams_filter_main_stream_placeholder: "Filter by Main Stream",
  streams_filter_main_stream_all: "All Main Streams",
  streams_search_placeholder: "Search streams...",
  streams_field_name_label: "Name",
  streams_field_name_placeholder: "e.g. B.Sc. Honours, B.A. General",
  streams_field_name_tooltip: "Program or stream name under the main course. Used for enrollment and roll numbers.",
  streams_field_code_label: "Code",
  streams_field_code_placeholder: "e.g. BSC-H, BA-G",
  streams_field_code_tooltip: "Short unique code for this program. Used in subject codes and reporting.",
  streams_field_duration_label: "Duration (in Years)",
  streams_field_duration_placeholder: "e.g. 3",
  streams_field_duration_tooltip: "Program duration in years. Determines session mapping for enrolled students.",
  streams_field_main_stream_label: "Main Stream",
  streams_field_main_stream_placeholder: "e.g. Undergraduate, Postgraduate",
  streams_field_main_stream_tooltip: "Parent course stream this program belongs to (e.g. UG, PG).",
  streams_breadcrumb_parent: "Academic Setup",
  streams_breadcrumb_self: "Streams & Programs",
  streams_tip: "Define structured academic tracks to enable organized enrollment and progress tracking.",

  // Page: Subjects (college)
  subjects_page_title: "Subjects",
  subjects_page_subtitle: "Maintain a central catalog of all academic subjects, credits, and practical requirements.",
  subjects_guidance: [
    "Create subjects that can be assigned to streams and classrooms for timetabling.",
    "Set subject codes, credit hours, and elective status for curriculum management.",
    "Group related subjects using Subject Groups for streamlined assignment.",
  ],
  subjects_add_btn: "Register New Subject",
  subjects_create_title: "Add Subject",
  subjects_edit_title: "Edit Subject",
  subjects_create_btn: "Create",
  subjects_update_btn: "Update",
  subjects_cancel_btn: "Cancel",
  subjects_empty_title: "No subjects found",
  subjects_empty_desc: "Register subjects to build your curriculum and timetable.",
  subjects_delete_title: "Delete subject",
  subjects_delete_desc: "Are you sure you want to delete this subject? This cannot be undone.",
  subjects_col_sl: "#",
  subjects_col_name: "Name",
  subjects_col_code: "Code",
  subjects_col_stream: "Stream",
  subjects_col_status: "Status",
  subjects_col_practical: "Practical",
  subjects_col_actions: "Actions",
  subjects_filter_stream_placeholder: "Filter by Stream",
  subjects_filter_stream_all: "All Streams",
  subjects_filter_group_placeholder: "Filter by Subject Group",
  subjects_filter_group_all: "All Groups",
  subjects_search_placeholder: "Search subjects...",
  subjects_breadcrumb_parent: "Academic Setup",
  subjects_breadcrumb_self: "Subjects",
  subjects_tip: "Standardize your curriculum by centralizing subjects and practical requirements for consistent academic auditing.",
  subjects_field_name_label: "Name",
  subjects_field_name_placeholder: "e.g. Geography, Introduction to Programming",
  subjects_field_name_tooltip: "Full subject name. These are the credit-bearing units in the curriculum.",
  subjects_field_code_label: "Code",
  subjects_field_code_placeholder: "e.g. GEO-101, CS101",
  subjects_field_code_tooltip: "Short unique code for the subject. Used in timetables and result processing.",
  subjects_field_stream_label: "Stream",
  subjects_field_stream_placeholder: "e.g. B.Sc. Honours",
  subjects_field_stream_tooltip: "Program or stream this subject belongs to. Filters by main stream when applicable.",
  subjects_field_is_practical_label: "Is Practical",
  subjects_field_is_practical_tooltip: "Whether this subject has a practical/lab component. Affects fee and scheduling.",

  // LMS Classrooms (college)
  lms_classes_page_title: "Classrooms",
  lms_classes_page_subtitle: "Select a stream to view its classrooms (sections) and subjects.",
  lms_classes_guidance: [
    "Classrooms are running sections (e.g. Section A, B) under a stream and session.",
    "Each classroom can have many subjects and content (assignments, tests, live sessions, recordings).",
    "Select a stream to see its classrooms; open a classroom to manage subjects, class teacher, students, and activities.",
  ],
  lms_classes_search_placeholder: "Search streams...",
  lms_classes_session_label: "Academic Session",
  lms_classes_empty_title: "No streams found",
  lms_classes_empty_desc: "Add a classroom and link it to a stream and session to see it here.",
  lms_classes_classroom_count_label: "Classrooms",
  lms_classes_duration_label: "Years",
  lms_classes_breadcrumb_self: "Classrooms",

  // LMS Stream Detail (college)
  lms_stream_detail_section_title: "Active Sections",
  lms_stream_detail_search_placeholder: "Search sections...",
  lms_stream_detail_add_label: "Add New Section",
  lms_stream_detail_add_desc: "Create a new classroom under this stream",
  lms_stream_detail_student_label: "Students",
  lms_stream_detail_back_label: "Back to Classrooms",
  lms_stream_detail_empty_title: "No sections yet",
  lms_stream_detail_empty_desc: "Add a section to get started.",

  // Guide: LMS Sections (college)
  lms_sections_guide_title: "Sections",
  lms_sections_guide_subtitle: "View and manage sections under this stream.",
  lms_sections_guide_guidance: [
    "Each section represents an active classroom under a stream and session.",
    "Assign a class teacher, enroll students, and manage timetable for each section.",
    "Click a section card to open its subjects, attendance, and content management.",
  ],
  lms_sections_guide_tip: "Ensure each section has a class teacher assigned for attendance and communication features.",

  // Class Detail (college)
  lms_class_detail_subjects_title: "Class Subjects",
  lms_class_detail_subjects_desc: "Allocated subjects and instructors for this class section.",
  lms_class_detail_search_placeholder: "Search subjects...",
  lms_class_detail_add_subject_label: "Add Subject",
  lms_class_detail_add_subject_desc: "Assign a new subject/teacher",
  lms_class_detail_edit_btn: "Edit Class",
  lms_class_detail_back_label: "Back to stream",
  lms_class_detail_not_found_title: "Class not found",
  lms_class_detail_not_found_desc: "The class you're looking for might have been removed or doesn't exist.",
  lms_class_detail_guidance: [
    "Manage subjects, class teacher, students, and activities for this section.",
    "Allocate subjects and assign instructors. Open a subject to manage assignments, tests, and sessions.",
  ],

  // Subject Detail (college)
  lms_subject_detail_class_label: "Class Subject",
  lms_subject_detail_instructor_label: "Instructor",
  lms_subject_detail_units_label: "Units",
  lms_subject_detail_students_label: "Students",
  lms_subject_detail_change_teacher_btn: "Change Teacher",
  lms_subject_detail_assign_instructor_btn: "Assign Instructor",
  lms_subject_detail_schedule_btn: "Schedule",
  lms_subject_detail_calendar_title: "Study Calendar",
  lms_subject_detail_post_announcement_label: "Post Announcement",
  lms_subject_detail_post_announcement_desc: "Share an update or reminder",
  lms_subject_detail_no_announcements: "No announcements yet",
  lms_subject_detail_add_curriculum_label: "Add Curriculum Item",
  lms_subject_detail_add_curriculum_desc: "Task or activity for this curriculum",
  lms_subject_detail_no_curriculum: "No curriculum posted",
  lms_subject_detail_view_submissions_btn: "View Submissions",
  lms_subject_detail_create_test_label: "Create Test",
  lms_subject_detail_create_test_desc: "Set up a new assessment",
  lms_subject_detail_no_tests: "No tests created",
  lms_subject_detail_manage_questions_btn: "Manage Questions",
  lms_subject_detail_schedule_live_label: "Schedule Live",
  lms_subject_detail_schedule_live_desc: "Start a new online lesson",
  lms_subject_detail_no_sessions: "No live sessions",
  lms_subject_detail_join_btn: "Join Now",
  lms_subject_detail_upload_recording_label: "Upload Recording",
  lms_subject_detail_upload_recording_desc: "Add video link or recording file",
  lms_subject_detail_no_recordings: "No recordings yet",
  lms_subject_detail_upload_file_label: "Upload File",
  lms_subject_detail_upload_file_desc: "Add documents or links",
  lms_subject_detail_no_resources: "No resources uploaded",
  lms_subject_detail_no_students: "No students enrolled",
  lms_subject_detail_students_count: "students",
};
// ────────────────────────────────────────────────────────
// Coaching
// ────────────────────────────────────────────────────────
const coaching: AcademicContentKeys = {
  stream: "Batch",
  semester: "Term",
  main_stream: "Main Batch",
  current_semester: "Current Term",
  streams_and_programs_title: "Batches & Programs",
  main_streams_title: "Main Batches",
  all_streams: "All Batches",
  all_main_streams: "All Main Batches",
  stream_slash_course: "Batch / Course",
  stream_slash_session: "Batch / Session",
  settings_academic_hierarchy_title: "Batch Hierarchy",

  streams_page_title: "Batches & Programs",
  streams_page_subtitle: "Configure specific batches, their durations, and specializations.",
  streams_guidance: [
    "Batches are specific academic tracks (e.g. JEE Main, NEET Dropper) under a main batch group.",
    "The batch duration dictates session mapping for enrolled students.",
    "Batches must be mapped to main batch groups for unified auditing.",
  ],
  streams_add_btn: "Add Batch",
  streams_create_title: "Add Batch",
  streams_edit_title: "Edit Batch",
  streams_create_btn: "Create",
  streams_update_btn: "Update",
  streams_cancel_btn: "Cancel",
  streams_empty_title: "No batches found",
  streams_empty_desc: "Define batches to organise enrollments and sessions.",
  streams_delete_title: "Delete batch",
  streams_delete_desc: "Are you sure you want to delete this batch? This cannot be undone.",
  streams_col_sl: "#",
  streams_col_name: "Name",
  streams_col_code: "Code",
  streams_col_duration: "Duration",
  streams_col_main_stream: "Main Batch",
  streams_col_status: "Status",
  streams_col_actions: "Actions",
  streams_filter_main_stream_placeholder: "Filter by Main Batch",
  streams_filter_main_stream_all: "All Main Batches",
  streams_search_placeholder: "Search batches...",
  streams_field_name_label: "Batch Name",
  streams_field_name_placeholder: "e.g. JEE Main 2025, NEET Dropper",
  streams_field_name_tooltip: "Batch name. Used for enrollment and roll numbers.",
  streams_field_code_label: "Code",
  streams_field_code_placeholder: "e.g. JEE-25, NEET-D",
  streams_field_code_tooltip: "Short unique code for this batch.",
  streams_field_duration_label: "Duration (in Years)",
  streams_field_duration_placeholder: "e.g. 2",
  streams_field_duration_tooltip: "Batch duration in years.",
  streams_field_main_stream_label: "Main Batch",
  streams_field_main_stream_placeholder: "e.g. Engineering, Medical",
  streams_field_main_stream_tooltip: "Parent batch group this batch belongs to.",
  streams_breadcrumb_parent: "Academic Setup",
  streams_breadcrumb_self: "Batches & Programs",
  streams_tip: "Define structured batches to enable organized enrollment and multi-year session progression.",

  // Page: Subjects (coaching)
  subjects_page_title: "Subjects",
  subjects_page_subtitle: "Maintain a central catalog of all subjects, test series, and practical components.",
  subjects_guidance: [
    "Create subjects that can be assigned to batches and classrooms for scheduling.",
    "Set subject codes and practical designations for curriculum management.",
    "Group related subjects using Subject Groups for streamlined assignment.",
  ],
  subjects_add_btn: "Register New Subject",
  subjects_create_title: "Add Subject",
  subjects_edit_title: "Edit Subject",
  subjects_create_btn: "Create",
  subjects_update_btn: "Update",
  subjects_cancel_btn: "Cancel",
  subjects_empty_title: "No subjects found",
  subjects_empty_desc: "Register subjects to build your curriculum.",
  subjects_delete_title: "Delete subject",
  subjects_delete_desc: "Are you sure you want to delete this subject? This cannot be undone.",
  subjects_col_sl: "#",
  subjects_col_name: "Name",
  subjects_col_code: "Code",
  subjects_col_stream: "Batch",
  subjects_col_status: "Status",
  subjects_col_practical: "Practical",
  subjects_col_actions: "Actions",
  subjects_filter_stream_placeholder: "Filter by Batch",
  subjects_filter_stream_all: "All Batches",
  subjects_filter_group_placeholder: "Filter by Subject Group",
  subjects_filter_group_all: "All Groups",
  subjects_search_placeholder: "Search subjects...",
  subjects_breadcrumb_parent: "Academic Setup",
  subjects_breadcrumb_self: "Subjects",
  subjects_tip: "Standardize your curriculum by centralizing subjects and practical requirements for consistent academic auditing.",
  subjects_field_name_label: "Name",
  subjects_field_name_placeholder: "e.g. Physics, Mathematics",
  subjects_field_name_tooltip: "Full subject name.",
  subjects_field_code_label: "Code",
  subjects_field_code_placeholder: "e.g. PHY-101, MATH-201",
  subjects_field_code_tooltip: "Short unique code for the subject.",
  subjects_field_stream_label: "Batch",
  subjects_field_stream_placeholder: "e.g. JEE Main 2025",
  subjects_field_stream_tooltip: "Batch this subject belongs to.",
  subjects_field_is_practical_label: "Is Practical",
  subjects_field_is_practical_tooltip: "Whether this subject has a practical/lab component.",

  // LMS Classrooms (coaching)
  lms_classes_page_title: "Classrooms",
  lms_classes_page_subtitle: "Select a batch to view its classrooms (sections) and subjects.",
  lms_classes_guidance: [
    "Classrooms are running sections under a batch and session.",
    "Each classroom can have many subjects and content (assignments, tests, live sessions, recordings).",
    "Select a batch to see its classrooms; open a classroom to manage subjects, instructor, students, and activities.",
  ],
  lms_classes_search_placeholder: "Search batches...",
  lms_classes_session_label: "Academic Session",
  lms_classes_empty_title: "No batches found",
  lms_classes_empty_desc: "Add a classroom and link it to a batch and session to see it here.",
  lms_classes_classroom_count_label: "Classrooms",
  lms_classes_duration_label: "Years",
  lms_classes_breadcrumb_self: "Classrooms",

  // LMS Stream Detail (coaching)
  lms_stream_detail_section_title: "Active Sections",
  lms_stream_detail_search_placeholder: "Search sections...",
  lms_stream_detail_add_label: "Add New Section",
  lms_stream_detail_add_desc: "Create a new classroom under this batch",
  lms_stream_detail_student_label: "Students",
  lms_stream_detail_back_label: "Back to Classrooms",
  lms_stream_detail_empty_title: "No sections yet",
  lms_stream_detail_empty_desc: "Add a section to get started.",

  // Guide: LMS Sections (coaching)
  lms_sections_guide_title: "Sections",
  lms_sections_guide_subtitle: "View and manage sections under this batch.",
  lms_sections_guide_guidance: [
    "Each section represents an active classroom under a batch and session.",
    "Assign a class teacher, enroll students, and manage timetable for each section.",
    "Click a section card to open its subjects, attendance, and content management.",
  ],
  lms_sections_guide_tip: "Ensure each section has a class teacher assigned for attendance and communication features.",

  // Class Detail (coaching)
  lms_class_detail_subjects_title: "Batch Subjects",
  lms_class_detail_subjects_desc: "Allocated subjects and instructors for this batch section.",
  lms_class_detail_search_placeholder: "Search subjects...",
  lms_class_detail_add_subject_label: "Add Subject",
  lms_class_detail_add_subject_desc: "Assign a new subject/teacher",
  lms_class_detail_edit_btn: "Edit Batch",
  lms_class_detail_back_label: "Back to batch",
  lms_class_detail_not_found_title: "Batch not found",
  lms_class_detail_not_found_desc: "The batch you're looking for might have been removed or doesn't exist.",
  lms_class_detail_guidance: [
    "Manage subjects, batch teacher, students, and activities for this section.",
    "Allocate subjects and assign instructors. Open a subject to manage assignments, tests, and sessions.",
  ],

  // Subject Detail (coaching)
  lms_subject_detail_class_label: "Batch Subject",
  lms_subject_detail_instructor_label: "Instructor",
  lms_subject_detail_units_label: "Units",
  lms_subject_detail_students_label: "Students",
  lms_subject_detail_change_teacher_btn: "Change Teacher",
  lms_subject_detail_assign_instructor_btn: "Assign Instructor",
  lms_subject_detail_schedule_btn: "Schedule",
  lms_subject_detail_calendar_title: "Study Calendar",
  lms_subject_detail_post_announcement_label: "Post Announcement",
  lms_subject_detail_post_announcement_desc: "Share an update or reminder",
  lms_subject_detail_no_announcements: "No announcements yet",
  lms_subject_detail_add_curriculum_label: "Add Curriculum Item",
  lms_subject_detail_add_curriculum_desc: "Task or activity for this curriculum",
  lms_subject_detail_no_curriculum: "No curriculum posted",
  lms_subject_detail_view_submissions_btn: "View Submissions",
  lms_subject_detail_create_test_label: "Create Test",
  lms_subject_detail_create_test_desc: "Set up a new assessment",
  lms_subject_detail_no_tests: "No tests created",
  lms_subject_detail_manage_questions_btn: "Manage Questions",
  lms_subject_detail_schedule_live_label: "Schedule Live",
  lms_subject_detail_schedule_live_desc: "Start a new online lesson",
  lms_subject_detail_no_sessions: "No live sessions",
  lms_subject_detail_join_btn: "Join Now",
  lms_subject_detail_upload_recording_label: "Upload Recording",
  lms_subject_detail_upload_recording_desc: "Add video link or recording file",
  lms_subject_detail_no_recordings: "No recordings yet",
  lms_subject_detail_upload_file_label: "Upload File",
  lms_subject_detail_upload_file_desc: "Add documents or links",
  lms_subject_detail_no_resources: "No resources uploaded",
  lms_subject_detail_no_students: "No students enrolled",
  lms_subject_detail_students_count: "students",
};
// ────────────────────────────────────────────────────────
// University
// ────────────────────────────────────────────────────────
const university: AcademicContentKeys = {
  stream: "Stream",
  semester: "Semester",
  main_stream: "Main Stream",
  current_semester: "Current Semester",
  streams_and_programs_title: "Streams & Programs",
  main_streams_title: "Main Course Streams",
  all_streams: "All Streams",
  all_main_streams: "All Main Streams",
  stream_slash_course: "Stream / Course",
  stream_slash_session: "Stream / Session",
  settings_academic_hierarchy_title: "Stream Hierarchy",

  streams_page_title: "Streams & Programs",
  streams_page_subtitle: "Configure specific academic programs, their durations, and branch specializations.",
  streams_guidance: [
    "Program streams are specific academic tracks (e.g. M.Sc. Physics, MBA Finance) under a main course stream.",
    "The program duration dictates the multi-year session mapping for enrolled students.",
    "Streams must be mapped to main course streams for unified institutional auditing.",
  ],
  streams_add_btn: "Define Program Stream",
  streams_create_title: "Add Stream",
  streams_edit_title: "Edit Stream",
  streams_create_btn: "Create",
  streams_update_btn: "Update",
  streams_cancel_btn: "Cancel",
  streams_empty_title: "No streams found",
  streams_empty_desc: "Define program streams to organise academic programs and enrollments.",
  streams_delete_title: "Delete stream",
  streams_delete_desc: "Are you sure you want to delete this stream? This cannot be undone.",
  streams_col_sl: "#",
  streams_col_name: "Name",
  streams_col_code: "Code",
  streams_col_duration: "Duration",
  streams_col_main_stream: "Main Stream",
  streams_col_status: "Status",
  streams_col_actions: "Actions",
  streams_filter_main_stream_placeholder: "Filter by Main Stream",
  streams_filter_main_stream_all: "All Main Streams",
  streams_search_placeholder: "Search streams...",
  streams_field_name_label: "Name",
  streams_field_name_placeholder: "e.g. M.Sc. Physics, MBA Finance",
  streams_field_name_tooltip: "Program or stream name. Used for enrollment and roll numbers.",
  streams_field_code_label: "Code",
  streams_field_code_placeholder: "e.g. MSC-PHY, MBA-FIN",
  streams_field_code_tooltip: "Short unique code for this program. Used in subject codes and reporting.",
  streams_field_duration_label: "Duration (in Years)",
  streams_field_duration_placeholder: "e.g. 2",
  streams_field_duration_tooltip: "Program duration in years. Determines session mapping for enrolled students.",
  streams_field_main_stream_label: "Main Stream",
  streams_field_main_stream_placeholder: "e.g. Postgraduate, Doctoral",
  streams_field_main_stream_tooltip: "Parent course stream this program belongs to.",
  streams_breadcrumb_parent: "Academic Setup",
  streams_breadcrumb_self: "Streams & Programs",
  streams_tip: "Define structured academic programs to enable organized enrollment and multi-year session progression.",

  // Page: Subjects (university)
  subjects_page_title: "Subjects",
  subjects_page_subtitle: "Maintain a central catalog of all academic subjects, credits, and practical requirements.",
  subjects_guidance: [
    "Create subjects that can be assigned to streams and classrooms for timetabling.",
    "Set subject codes, credit hours, and elective status for curriculum management.",
    "Group related subjects using Subject Groups for streamlined assignment.",
  ],
  subjects_add_btn: "Register New Subject",
  subjects_create_title: "Add Subject",
  subjects_edit_title: "Edit Subject",
  subjects_create_btn: "Create",
  subjects_update_btn: "Update",
  subjects_cancel_btn: "Cancel",
  subjects_empty_title: "No subjects found",
  subjects_empty_desc: "Register subjects to build your curriculum and timetable.",
  subjects_delete_title: "Delete subject",
  subjects_delete_desc: "Are you sure you want to delete this subject? This cannot be undone.",
  subjects_col_sl: "#",
  subjects_col_name: "Name",
  subjects_col_code: "Code",
  subjects_col_stream: "Stream",
  subjects_col_status: "Status",
  subjects_col_practical: "Practical",
  subjects_col_actions: "Actions",
  subjects_filter_stream_placeholder: "Filter by Stream",
  subjects_filter_stream_all: "All Streams",
  subjects_filter_group_placeholder: "Filter by Subject Group",
  subjects_filter_group_all: "All Groups",
  subjects_search_placeholder: "Search subjects...",
  subjects_breadcrumb_parent: "Academic Setup",
  subjects_breadcrumb_self: "Subjects",
  subjects_tip: "Standardize your curriculum by centralizing subjects and practical requirements for consistent academic auditing.",
  subjects_field_name_label: "Name",
  subjects_field_name_placeholder: "e.g. Quantum Physics, Corporate Finance",
  subjects_field_name_tooltip: "Full subject name. Used in transcripts and grade sheets.",
  subjects_field_code_label: "Code",
  subjects_field_code_placeholder: "e.g. QP-501, CF-301",
  subjects_field_code_tooltip: "Short unique code for the subject. Used in timetables and result processing.",
  subjects_field_stream_label: "Stream",
  subjects_field_stream_placeholder: "e.g. M.Sc. Physics, MBA Finance",
  subjects_field_stream_tooltip: "Program or stream this subject belongs to.",
  subjects_field_is_practical_label: "Is Practical",
  subjects_field_is_practical_tooltip: "Whether this subject has a practical/lab component. Affects fee and scheduling.",

  // LMS Classrooms (university)
  lms_classes_page_title: "Classrooms",
  lms_classes_page_subtitle: "Select a stream to view its classrooms (sections) and subjects.",
  lms_classes_guidance: [
    "Classrooms are running sections (e.g. Section A, B) under a stream and session.",
    "Each classroom can have many subjects and content (assignments, tests, live sessions, recordings).",
    "Select a stream to see its classrooms; open a classroom to manage subjects, class teacher, students, and activities.",
  ],
  lms_classes_search_placeholder: "Search streams...",
  lms_classes_session_label: "Academic Session",
  lms_classes_empty_title: "No streams found",
  lms_classes_empty_desc: "Add a classroom and link it to a stream and session to see it here.",
  lms_classes_classroom_count_label: "Classrooms",
  lms_classes_duration_label: "Years",
  lms_classes_breadcrumb_self: "Classrooms",

  // LMS Stream Detail (university)
  lms_stream_detail_section_title: "Active Sections",
  lms_stream_detail_search_placeholder: "Search sections...",
  lms_stream_detail_add_label: "Add New Section",
  lms_stream_detail_add_desc: "Create a new classroom under this stream",
  lms_stream_detail_student_label: "Students",
  lms_stream_detail_back_label: "Back to Classrooms",
  lms_stream_detail_empty_title: "No sections yet",
  lms_stream_detail_empty_desc: "Add a section to get started.",

  // Guide: LMS Sections (university)
  lms_sections_guide_title: "Sections",
  lms_sections_guide_subtitle: "View and manage sections under this stream.",
  lms_sections_guide_guidance: [
    "Each section represents an active classroom under a stream and session.",
    "Assign a class teacher, enroll students, and manage timetable for each section.",
    "Click a section card to open its subjects, attendance, and content management.",
  ],
  lms_sections_guide_tip: "Ensure each section has a class teacher assigned for attendance and communication features.",

  // Class Detail (university)
  lms_class_detail_subjects_title: "Class Subjects",
  lms_class_detail_subjects_desc: "Allocated subjects and instructors for this class section.",
  lms_class_detail_search_placeholder: "Search subjects...",
  lms_class_detail_add_subject_label: "Add Subject",
  lms_class_detail_add_subject_desc: "Assign a new subject/teacher",
  lms_class_detail_edit_btn: "Edit Class",
  lms_class_detail_back_label: "Back to stream",
  lms_class_detail_not_found_title: "Class not found",
  lms_class_detail_not_found_desc: "The class you're looking for might have been removed or doesn't exist.",
  lms_class_detail_guidance: [
    "Manage subjects, class teacher, students, and activities for this section.",
    "Allocate subjects and assign instructors. Open a subject to manage assignments, tests, and sessions.",
  ],

  // Subject Detail (university)
  lms_subject_detail_class_label: "Class Subject",
  lms_subject_detail_instructor_label: "Instructor",
  lms_subject_detail_units_label: "Units",
  lms_subject_detail_students_label: "Students",
  lms_subject_detail_change_teacher_btn: "Change Teacher",
  lms_subject_detail_assign_instructor_btn: "Assign Instructor",
  lms_subject_detail_schedule_btn: "Schedule",
  lms_subject_detail_calendar_title: "Study Calendar",
  lms_subject_detail_post_announcement_label: "Post Announcement",
  lms_subject_detail_post_announcement_desc: "Share an update or reminder",
  lms_subject_detail_no_announcements: "No announcements yet",
  lms_subject_detail_add_curriculum_label: "Add Curriculum Item",
  lms_subject_detail_add_curriculum_desc: "Task or activity for this curriculum",
  lms_subject_detail_no_curriculum: "No curriculum posted",
  lms_subject_detail_view_submissions_btn: "View Submissions",
  lms_subject_detail_create_test_label: "Create Test",
  lms_subject_detail_create_test_desc: "Set up a new assessment",
  lms_subject_detail_no_tests: "No tests created",
  lms_subject_detail_manage_questions_btn: "Manage Questions",
  lms_subject_detail_schedule_live_label: "Schedule Live",
  lms_subject_detail_schedule_live_desc: "Start a new online lesson",
  lms_subject_detail_no_sessions: "No live sessions",
  lms_subject_detail_join_btn: "Join Now",
  lms_subject_detail_upload_recording_label: "Upload Recording",
  lms_subject_detail_upload_recording_desc: "Add video link or recording file",
  lms_subject_detail_no_recordings: "No recordings yet",
  lms_subject_detail_upload_file_label: "Upload File",
  lms_subject_detail_upload_file_desc: "Add documents or links",
  lms_subject_detail_no_resources: "No resources uploaded",
  lms_subject_detail_no_students: "No students enrolled",
  lms_subject_detail_students_count: "students",
};

export const academicContent: Record<InstitutionType, AcademicContentKeys> = {
  school,
  college,
  coaching,
  university,
};
