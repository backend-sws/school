/**
 * Scope-type (institution type) display config.
 *
 * Mirrors config/scope_type_display.php: defines labels and value formatting
 * per scope type (school, college, coaching, university). Use for every API
 * and content so school sees "Class"/"Term", college "Stream"/"Semester".
 */

import type { InstitutionType } from "@/constants/landing/types";
import { getInstitutionContent } from "@/constants/content";
import { includesValue } from "@/lib/helpers";

const SCOPE_TYPES: InstitutionType[] = ["school", "college", "coaching", "university"];

/** Resolve scope type from API/page; default college. */
export function resolveScopeType(scopeType?: string | null): InstitutionType {
  return includesValue(SCOPE_TYPES, (scopeType ?? "") as InstitutionType)
    ? (scopeType as InstitutionType)
    : "college";
}

// ─── Student profile (show page) ───────────────────────────────────────────

export interface ScopeTypeDisplayConfig {
  sectionTitles: { academic: string };
  fieldLabels: {
    stream: string;
    session: string;
    subject: string;
    current_semester: string;
  };
  valueFormat: { current_semester: "term" | "semester" };
}

function buildStudentProfileConfig(type: InstitutionType): ScopeTypeDisplayConfig {
  const content = getInstitutionContent(type);
  const isTermBased = type === "school" || type === "coaching";
  return {
    sectionTitles: { academic: `${content.stream} & session` },
    fieldLabels: {
      stream: content.stream,
      session: "Session",
      subject: "Subject",
      current_semester: content.current_semester,
    },
    valueFormat: { current_semester: isTermBased ? "term" : "semester" },
  };
}

const studentProfileConfigCache: Partial<Record<InstitutionType, ScopeTypeDisplayConfig>> = {};

export function getStudentProfileDisplayConfig(scopeType?: string | null): ScopeTypeDisplayConfig {
  const type = resolveScopeType(scopeType);
  if (!studentProfileConfigCache[type]) {
    studentProfileConfigCache[type] = buildStudentProfileConfig(type);
  }
  return studentProfileConfigCache[type]!;
}

export function formatStudentProfileFieldValue(
  scopeType: string | null | undefined,
  field: keyof ScopeTypeDisplayConfig["valueFormat"],
  value: unknown
): string | null {
  if (value == null || value === "") return null;
  const config = getStudentProfileDisplayConfig(scopeType);
  const content = getInstitutionContent(resolveScopeType(scopeType));
  if (field === "current_semester") {
    const n = Number(value);
    if (Number.isNaN(n)) return null;
    const label = config.valueFormat.current_semester === "term" ? content.semester : "Semester";
    return `${label} ${n}`;
  }
  return null;
}

// ─── Student list (manage page) ────────────────────────────────────────────

export interface StudentListDisplayConfig {
  columnStreamSession: string;
  filterStreamPlaceholder: string;
  filterStreamOptionAll: string;
  guidanceStreamPhrase: string;
}

function buildStudentListConfig(type: InstitutionType): StudentListDisplayConfig {
  const content = getInstitutionContent(type);
  return {
    columnStreamSession: content.stream_slash_session,
    filterStreamPlaceholder: content.stream,
    filterStreamOptionAll: content.all_streams,
    guidanceStreamPhrase: content.stream.toLowerCase(),
  };
}

const studentListConfigCache: Partial<Record<InstitutionType, StudentListDisplayConfig>> = {};

export function getStudentListDisplayConfig(scopeType?: string | null): StudentListDisplayConfig {
  const type = resolveScopeType(scopeType);
  if (!studentListConfigCache[type]) {
    studentListConfigCache[type] = buildStudentListConfig(type);
  }
  return studentListConfigCache[type]!;
}

// ─── Student analytics (index page) ─────────────────────────────────────────

export interface StudentAnalyticsDisplayConfig {
  tableTitleSuffix: string;
  columnMainStream: string;
  columnStreamCourse: string;
}

function buildStudentAnalyticsConfig(type: InstitutionType): StudentAnalyticsDisplayConfig {
  const content = getInstitutionContent(type);
  return {
    tableTitleSuffix: content.stream_slash_course,
    columnMainStream: content.main_stream,
    columnStreamCourse: content.stream_slash_course,
  };
}

const studentAnalyticsConfigCache: Partial<Record<InstitutionType, StudentAnalyticsDisplayConfig>> = {};

export function getStudentAnalyticsDisplayConfig(
  scopeType?: string | null
): StudentAnalyticsDisplayConfig {
  const type = resolveScopeType(scopeType);
  if (!studentAnalyticsConfigCache[type]) {
    studentAnalyticsConfigCache[type] = buildStudentAnalyticsConfig(type);
  }
  return studentAnalyticsConfigCache[type]!;
}

// ─── Certificate heads (stream filter) ─────────────────────────────────────

export interface CertificateHeadsDisplayConfig {
  filterStreamOptionAll: string;
  filterMainStreamOptionAll: string;
}

function buildCertificateHeadsConfig(type: InstitutionType): CertificateHeadsDisplayConfig {
  const content = getInstitutionContent(type);
  return {
    filterStreamOptionAll: content.all_streams,
    filterMainStreamOptionAll: content.all_main_streams,
  };
}

const certificateHeadsConfigCache: Partial<Record<InstitutionType, CertificateHeadsDisplayConfig>> = {};

export function getCertificateHeadsDisplayConfig(
  scopeType?: string | null
): CertificateHeadsDisplayConfig {
  const type = resolveScopeType(scopeType);
  if (!certificateHeadsConfigCache[type]) {
    certificateHeadsConfigCache[type] = buildCertificateHeadsConfig(type);
  }
  return certificateHeadsConfigCache[type]!;
}

// ─── Student edit form (field labels; payload shape in student const) ────────

export interface StudentEditFormDisplayConfig {
  fieldLabels: {
    main_stream_id: string;
    stream_id: string;
    session_id: string;
    subject_id: string;
    current_semester: string;
  };
}

function buildStudentEditFormConfig(type: InstitutionType): StudentEditFormDisplayConfig {
  const content = getInstitutionContent(type);
  return {
    fieldLabels: {
      main_stream_id: content.main_stream,
      stream_id: content.stream,
      session_id: "Session",
      subject_id: "Subject",
      current_semester: content.current_semester,
    },
  };
}

const studentEditFormConfigCache: Partial<Record<InstitutionType, StudentEditFormDisplayConfig>> = {};

export function getStudentEditFormDisplayConfig(
  scopeType?: string | null
): StudentEditFormDisplayConfig {
  const type = resolveScopeType(scopeType);
  if (!studentEditFormConfigCache[type]) {
    studentEditFormConfigCache[type] = buildStudentEditFormConfig(type);
  }
  return studentEditFormConfigCache[type]!;
}

// ─── Institution labels (sidebar, nav, and any non–student-specific UI) ─────

export interface InstitutionLabels {
  streamLabel: string;
  semesterLabel: string;
  mainStreamLabel: string;
  currentSemesterLabel: string;
  streamsAndProgramsTitle: string;
  mainStreamsTitle: string;
  allStreamsLabel: string;
  allMainStreamsLabel: string;
  streamSlashCourse: string;
  streamSlashSession: string;
}

/**
 * Returns scope-type-aware labels for nav, sidebar, and generic UI.
 * Use everywhere that shows Stream/Class/Batch, Semester/Term, etc. (not just students).
 */
export function getInstitutionLabels(scopeType?: string | null): InstitutionLabels {
  const content = getInstitutionContent(resolveScopeType(scopeType));
  return {
    streamLabel: content.stream,
    semesterLabel: content.semester,
    mainStreamLabel: content.main_stream,
    currentSemesterLabel: content.current_semester,
    streamsAndProgramsTitle: content.streams_and_programs_title,
    mainStreamsTitle: content.main_streams_title,
    allStreamsLabel: content.all_streams,
    allMainStreamsLabel: content.all_main_streams,
    streamSlashCourse: content.stream_slash_course,
    streamSlashSession: content.stream_slash_session,
  };
}
