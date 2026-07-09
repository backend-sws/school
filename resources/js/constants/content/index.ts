export {
  INSTITUTION_CONTENT,
  getInstitutionContent,
  type InstitutionContentKey,
  type InstitutionContentMap,
} from "./institutionContent";

// Re-export module interfaces for direct typing if needed
export type { AcademicContentKeys } from "./modules/academic";
export type { AdmissionContentKeys } from "./modules/admission";
export type { FeesContentKeys } from "./modules/fees";
export type { StudentsContentKeys } from "./modules/students";
