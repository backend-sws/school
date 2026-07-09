/**
 * Fee structure slot options for applicability (profile type, category, gender).
 * Matches backend App\Enums\FeeSlot.
 */

export const FEE_SLOT_DEFAULT = "default";

/** Profile type slots */
export const FEE_SLOT_PROFILE_TYPES = [
    { key: "default", value: "default", text: "Default" },
    { key: "standard", value: "standard", text: "Standard" },
    { key: "waiver", value: "waiver", text: "Waiver" },
] as const;

/** Category (reservation/social) slots */
export const FEE_SLOT_CATEGORIES = [
    { key: "general", value: "general", text: "General" },
    { key: "obc", value: "obc", text: "OBC" },
    { key: "sc", value: "sc", text: "SC" },
    { key: "st", value: "st", text: "ST" },
    { key: "ews", value: "ews", text: "EWS" },
    { key: "rte", value: "rte", text: "RTE" },
] as const;

/** Gender slots */
export const FEE_SLOT_GENDERS = [
    { key: "male", value: "male", text: "Male" },
    { key: "female", value: "female", text: "Female" },
    { key: "other", value: "other", text: "Other" },
] as const;

/** All options in one list: Profile type, then Category, then Gender (for single dropdown). */
export const FEE_SLOT_OPTIONS = [
    ...FEE_SLOT_PROFILE_TYPES,
    ...FEE_SLOT_CATEGORIES,
    ...FEE_SLOT_GENDERS,
];

/** Grouped for dropdown with section labels (Profile type, Category, Gender). */
export const FEE_SLOT_OPTIONS_GROUPED = [
    { label: "Profile type", options: [...FEE_SLOT_PROFILE_TYPES] },
    { label: "Category", options: [...FEE_SLOT_CATEGORIES] },
    { label: "Gender", options: [...FEE_SLOT_GENDERS] },
];
