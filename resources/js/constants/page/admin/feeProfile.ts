/**
 * Constants for Fee Profile (fee regulation profile) CRUD.
 * Type = profile type; Category = reservation (General, OBC, etc.); Gender = applicability.
 */

/** Profile type (replaces old "Category" meaning). */
export const FEE_PROFILE_TYPE_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "standard", label: "Standard" },
  { value: "waiver", label: "Waiver" },
] as const;

/** Reservation/social category: General, OBC, etc. */
export const FEE_PROFILE_CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
  { value: "rte", label: "RTE" },
] as const;

/** Gender applicability. */
export const FEE_PROFILE_GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;
