import { FORM_TYPE } from "@/constants/shared/form";
import { FeeCategory } from "@/constants/feeCategory";
import { FEE_SLOT_PROFILE_TYPES, FEE_SLOT_CATEGORIES, FEE_SLOT_GENDERS } from "@/constants/feeSlot";
import type { FormFieldConfig } from "@/types/formTypes";
import type { InstitutionContentMap } from "@/constants/content";

// ─── Options ─────────────────────────────────────────────────────────────────
const NONE_OPTION = { key: "_none", value: "_none", text: "—" };

const CATEGORY_OPTIONS = Object.entries(FeeCategory).map(([key, value]) => ({
    key,
    value,
    text: value.replace("_", " "),
}));

const PROFILE_TYPE_OPTIONS = [NONE_OPTION, ...FEE_SLOT_PROFILE_TYPES.map((o) => ({ ...o }))];
const RESERVATION_CATEGORY_OPTIONS = [NONE_OPTION, ...FEE_SLOT_CATEGORIES.map((o) => ({ ...o }))];
const GENDER_OPTIONS = [NONE_OPTION, ...FEE_SLOT_GENDERS.map((o) => ({ ...o }))];

// ─── Form fields config ──────────────────────────────────────────────────────
export const FEE_TYPE_FORM_FIELDS: readonly FormFieldConfig[] = [
    {
        name: "name",
        label: "Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Tuition Fee",
        required: true,
        tooltip: "Name of the fee type (e.g. Tuition Fee, Lab Fee)",
        permission: "field_fee_type_name",
    },
    {
        name: "category",
        label: "Type",
        type: FORM_TYPE.SELECT,
        placeholder: "Select category",
        required: true,
        options: CATEGORY_OPTIONS,
        tooltip: "Mandatory = every student must pay. Optional = only if applicable.",
        permission: "field_fee_type_category",
    },
    {
        name: "profile_type",
        label: "Profile type",
        type: FORM_TYPE.SELECT,
        placeholder: "Select profile type",
        options: PROFILE_TYPE_OPTIONS,
        tooltip: "Applies to a specific profile type only",
        permission: "field_fee_type_profile_type",
    },
    {
        name: "reservation_category",
        label: "Category",
        type: FORM_TYPE.SELECT,
        placeholder: "General, OBC, SC, ST, etc.",
        options: RESERVATION_CATEGORY_OPTIONS,
        tooltip: "Applies to a specific reservation/social category only",
        permission: "field_fee_type_reservation_category",
    },
    {
        name: "gender",
        label: "Gender",
        type: FORM_TYPE.SELECT,
        placeholder: "Male, Female, Other",
        options: GENDER_OPTIONS,
        tooltip: "Applies to a specific gender only",
        permission: "field_fee_type_gender",
    },
] as const;

// ─── Default values ──────────────────────────────────────────────────────────
export const FEE_TYPE_DEFAULT_VALUES = {
    name: "",
    category: "recurring",
    profile_type: "_none",
    reservation_category: "_none",
    gender: "_none",
};

// ─── Content (scope-type-aware: resolved from content engine) ────────────────
/** Build fee type content from the institution content map. */
export function getFeeTypeContent(c: InstitutionContentMap) {
    return {
        pageTitle: c.fee_types_page_title,
        pageSubtitle: c.fee_types_page_subtitle,
        guidance: c.fee_types_guidance,
        addBtn: c.fee_types_add_btn,
        restoreBtn: c.fee_types_restore_btn,
        createTitle: c.fee_types_create_title,
        editTitle: c.fee_types_edit_title,
        createBtn: c.fee_types_create_btn,
        updateBtn: c.fee_types_update_btn,
        cancelBtn: c.fee_types_cancel_btn,
        emptyTitle: c.fee_types_empty_title,
        emptyDescription: c.fee_types_empty_desc,
    };
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────
export function getFeeTypeBreadcrumbs(c: InstitutionContentMap) {
    return [
        { title: c.fee_hub_breadcrumb, href: "/accounts/fee-hub" },
        { title: c.fee_types_page_title, href: "/accounts/fee-hub/fee-types" },
    ];
}

// ─── Table columns (scope-type-aware) ────────────────────────────────────────
export function getFeeTypeColumns(c: InstitutionContentMap) {
    return [
        { key: "sl_no", label: c.fee_types_col_sl },
        { key: "name", label: c.fee_types_col_name },
        { key: "category", label: c.fee_types_col_category },
        { key: "actions", label: c.fee_types_col_actions },
    ];
}
