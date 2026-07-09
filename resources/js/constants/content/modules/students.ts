/**
 * Students content module — student analytics, list, profile, edit labels.
 *
 * Covers table columns, filter labels, and page titles that vary by scope type
 * (e.g. "Main Stream" vs "Main Class" in analytics, "Stream / Session" vs "Class / Session" in manage).
 */

import type { InstitutionType } from "@/constants/landing/types";

export interface StudentsContentKeys {
  // ── Student Analytics (index page) ──────────────────
  students_analytics_table_title_suffix: string;
  students_analytics_col_main_stream: string;
  students_analytics_col_stream_course: string;
  students_analytics_empty_title: string;
  students_analytics_empty_desc: string;

  // ── Student Manage (list page) ──────────────────────
  students_manage_col_stream_session: string;
  students_manage_filter_stream_placeholder: string;
  students_manage_filter_stream_all: string;
  students_manage_guidance_stream: string;

  // ── Student Profile (show page) ─────────────────────
  students_profile_section_academic: string;
  students_profile_label_stream: string;
  students_profile_label_session: string;
  students_profile_label_subject: string;
  students_profile_label_current_semester: string;

  // ── Student Edit Form ───────────────────────────────
  students_edit_label_main_stream: string;
  students_edit_label_stream: string;
  students_edit_label_session: string;
  students_edit_label_subject: string;
  students_edit_label_current_semester: string;

  // ── Certificate Heads (stream filter) ───────────────
  certificates_filter_stream_all: string;
  certificates_filter_main_stream_all: string;
}

const school: StudentsContentKeys = {
  students_analytics_table_title_suffix: "Class / Course",
  students_analytics_col_main_stream: "Level",
  students_analytics_col_stream_course: "Class / Course",
  students_analytics_empty_title: "No class data available",
  students_analytics_empty_desc: "No student enrollment data found for the selected year",

  students_manage_col_stream_session: "Class / Session",
  students_manage_filter_stream_placeholder: "Class",
  students_manage_filter_stream_all: "All Classes",
  students_manage_guidance_stream: "class",

  students_profile_section_academic: "Class & session",
  students_profile_label_stream: "Class",
  students_profile_label_session: "Session",
  students_profile_label_subject: "Subject",
  students_profile_label_current_semester: "Current Term",

  students_edit_label_main_stream: "Level",
  students_edit_label_stream: "Class",
  students_edit_label_session: "Session",
  students_edit_label_subject: "Subject",
  students_edit_label_current_semester: "Current Term",

  certificates_filter_stream_all: "All Classes",
  certificates_filter_main_stream_all: "All Levels",
};

const college: StudentsContentKeys = {
  students_analytics_table_title_suffix: "Stream / Course",
  students_analytics_col_main_stream: "Main Stream",
  students_analytics_col_stream_course: "Stream / Course",
  students_analytics_empty_title: "No stream data available",
  students_analytics_empty_desc: "No student enrollment data found for the selected year",

  students_manage_col_stream_session: "Stream / Session",
  students_manage_filter_stream_placeholder: "Stream",
  students_manage_filter_stream_all: "All Streams",
  students_manage_guidance_stream: "stream",

  students_profile_section_academic: "Stream & session",
  students_profile_label_stream: "Stream",
  students_profile_label_session: "Session",
  students_profile_label_subject: "Subject",
  students_profile_label_current_semester: "Current Semester",

  students_edit_label_main_stream: "Main Stream",
  students_edit_label_stream: "Stream",
  students_edit_label_session: "Session",
  students_edit_label_subject: "Subject",
  students_edit_label_current_semester: "Current Semester",

  certificates_filter_stream_all: "All Streams",
  certificates_filter_main_stream_all: "All Main Streams",
};

const coaching: StudentsContentKeys = {
  students_analytics_table_title_suffix: "Batch / Course",
  students_analytics_col_main_stream: "Main Batch",
  students_analytics_col_stream_course: "Batch / Course",
  students_analytics_empty_title: "No batch data available",
  students_analytics_empty_desc: "No student enrollment data found for the selected year",

  students_manage_col_stream_session: "Batch / Session",
  students_manage_filter_stream_placeholder: "Batch",
  students_manage_filter_stream_all: "All Batches",
  students_manage_guidance_stream: "batch",

  students_profile_section_academic: "Batch & session",
  students_profile_label_stream: "Batch",
  students_profile_label_session: "Session",
  students_profile_label_subject: "Subject",
  students_profile_label_current_semester: "Current Term",

  students_edit_label_main_stream: "Main Batch",
  students_edit_label_stream: "Batch",
  students_edit_label_session: "Session",
  students_edit_label_subject: "Subject",
  students_edit_label_current_semester: "Current Term",

  certificates_filter_stream_all: "All Batches",
  certificates_filter_main_stream_all: "All Main Batches",
};

const university: StudentsContentKeys = {
  students_analytics_table_title_suffix: "Stream / Course",
  students_analytics_col_main_stream: "Main Stream",
  students_analytics_col_stream_course: "Stream / Course",
  students_analytics_empty_title: "No stream data available",
  students_analytics_empty_desc: "No student enrollment data found for the selected year",

  students_manage_col_stream_session: "Stream / Session",
  students_manage_filter_stream_placeholder: "Stream",
  students_manage_filter_stream_all: "All Streams",
  students_manage_guidance_stream: "stream",

  students_profile_section_academic: "Stream & session",
  students_profile_label_stream: "Stream",
  students_profile_label_session: "Session",
  students_profile_label_subject: "Subject",
  students_profile_label_current_semester: "Current Semester",

  students_edit_label_main_stream: "Main Stream",
  students_edit_label_stream: "Stream",
  students_edit_label_session: "Session",
  students_edit_label_subject: "Subject",
  students_edit_label_current_semester: "Current Semester",

  certificates_filter_stream_all: "All Streams",
  certificates_filter_main_stream_all: "All Main Streams",
};

export const studentsContent: Record<InstitutionType, StudentsContentKeys> = {
  school,
  college,
  coaching,
  university,
};
