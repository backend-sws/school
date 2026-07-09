/**
 * Institution-type-aware content registry.
 *
 * Single source of truth for UI strings that vary by institution type
 * (school, college, coaching, university).
 *
 * Use via useInstitutionContent() so forms, tables, steps, page headers,
 * guidance, columns, and empty states show the right labels.
 *
 * Architecture: per-module content files in ./modules/ are merged here.
 * To add new content, create or edit a module file — this file auto-merges.
 */

import type { InstitutionType } from "@/constants/landing/types";
import { academicContent, type AcademicContentKeys } from "./modules/academic";
import { admissionContent, type AdmissionContentKeys } from "./modules/admission";
import { feesContent, type FeesContentKeys } from "./modules/fees";
import { studentsContent, type StudentsContentKeys } from "./modules/students";
import { idCardContent, type IdCardContentKeys } from "./modules/idCard";
import { expensesContent, type ExpensesContentKeys } from "./modules/expenses";

// ────────────────────────────────────────────────────────
// Union type: auto-derived from all module interfaces
// ────────────────────────────────────────────────────────

/** All content keys across every module. */
export type InstitutionContentKey =
  | keyof AcademicContentKeys
  | keyof AdmissionContentKeys
  | keyof FeesContentKeys
  | keyof StudentsContentKeys
  | keyof IdCardContentKeys
  | keyof ExpensesContentKeys;

/**
 * Complete content map — values are `string` or `string[]` (for guidance arrays).
 * Consumers should use type narrowing or cast when accessing array-type keys.
 */
export type InstitutionContentMap =
  AcademicContentKeys &
  AdmissionContentKeys &
  FeesContentKeys &
  StudentsContentKeys &
  IdCardContentKeys &
  ExpensesContentKeys;

// ────────────────────────────────────────────────────────
// Builder: merge all modules per institution type
// ────────────────────────────────────────────────────────

function buildContent(type: InstitutionType): InstitutionContentMap {
  return {
    ...academicContent[type],
    ...admissionContent[type],
    ...feesContent[type],
    ...studentsContent[type],
    ...idCardContent[type],
    ...expensesContent[type],
  } as InstitutionContentMap;
}

/** Prebuilt cache — one per type. */
const CACHE: Partial<Record<InstitutionType, InstitutionContentMap>> = {};

/** Content registry: institution type → content map. */
export const INSTITUTION_CONTENT: Record<InstitutionType, InstitutionContentMap> = {
  school: buildContent("school"),
  college: buildContent("college"),
  coaching: buildContent("coaching"),
  university: buildContent("university"),
};

const VALID_TYPES: InstitutionType[] = ["school", "college", "coaching", "university"];

/**
 * Resolve content map for the given institution type.
 * Use in React via useInstitutionContent(); use this in non-React code or tests.
 *
 * - Valid institution types resolve directly.
 * - "brand" (main domain, super-admin, no institution) → college labels (expected state).
 * - Unknown / missing types:
 *     DEV  → throws (surfaces pipeline bugs immediately)
 *     PROD → console.warn + college fallback (graceful degradation)
 */
export function getInstitutionContent(type?: string | null): InstitutionContentMap {
  // "brand" is a valid system state (no institution), not a bug
  if (type === "brand") {
    return INSTITUTION_CONTENT["school"];
  }

  if (!type || !VALID_TYPES.includes(type as InstitutionType)) {
    const msg = `[ContentEngine] Invalid or missing institution type: "${type}". Expected one of: ${VALID_TYPES.join(", ")}. Check that the middleware sets ems.default_institution_id for authenticated users.`;

    if (import.meta.env.DEV) {
      throw new Error(msg);
    }

    console.warn(msg);
    return INSTITUTION_CONTENT["college"];
  }

  const resolved = type as InstitutionType;
  if (!CACHE[resolved]) {
    CACHE[resolved] = INSTITUTION_CONTENT[resolved];
  }
  return CACHE[resolved]!;
}
