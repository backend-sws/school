/**
 * Shared type for all form field configs across the app.
 * Used by `usePermittedFields` and `ControlledFormComponent` rendering loops.
 *
 * EVERY field MUST have a `permission` key — it is the single source of truth.
 * No field renders without a matching DB permission.
 */
export interface FormFieldConfig {
    /** Field name (maps to react-hook-form path) */
    name: string;
    /** Display label */
    label: string;
    /** FORM_TYPE constant (text, select, etc.) */
    type: string;
    /** Placeholder text */
    placeholder?: string;
    /** Is the field required? */
    required?: boolean;
    /** Options for select/dropdown fields */
    options?: readonly { key: string; value: string | boolean; text: string }[];
    /** Tooltip text */
    tooltip?: string;
    /** Permission key (REQUIRED) — field hidden if user lacks this permission. DB is single source of truth. */
    permission: string;
    /** Feature/module key — field hidden if subscription lacks this feature. */
    feature?: string;
    /** Visual section header (used by admission forms) */
    section?: string;
    /** Layout hint for grid positioning */
    layout?: "full" | "half";
    /** Max character length for text inputs */
    maxLength?: number;
}
