import { FORM_TYPE } from "@/constants/shared/form";
import type { AsyncSelectConfig } from "@/types";
import feeTypesApi from "@/lib/api/feeTypesApi";
import { FeeTypeQueryKeys } from "@/lib/querykey/feeType";
import {
    FEE_SLOT_PROFILE_TYPES,
    FEE_SLOT_CATEGORIES,
    FEE_SLOT_GENDERS,
} from "@/constants/feeSlot";
import type { FormFieldConfig } from "@/types/formTypes";
import type { InstitutionContentMap } from "@/constants/content";

// ─── Options ─────────────────────────────────────────────
const NONE_OPTION = { key: "_none", value: "_none", text: "— None —" };

const PROFILE_TYPE_OPTIONS = FEE_SLOT_PROFILE_TYPES.map((o) => ({ ...o }));
const CATEGORY_OPTIONS = [NONE_OPTION, ...FEE_SLOT_CATEGORIES.map((o) => ({ ...o }))];
const GENDER_OPTIONS = [NONE_OPTION, ...FEE_SLOT_GENDERS.map((o) => ({ ...o }))];
const FREQUENCY_OPTIONS = [
    NONE_OPTION,
    { key: "monthly", value: "monthly", text: "Monthly" },
    // { key: "quarterly", value: "quarterly", text: "Quarterly" },
    // { key: "half-yearly", value: "half-yearly", text: "Half-Yearly" },
    // { key: "yearly", value: "yearly", text: "Yearly" },
    // { key: "one-time", value: "one-time", text: "One-Time" },
];

// ─── Form Fields Config ──────────────────────────────────
export const FEE_PROFILE_FORM_FIELDS: readonly FormFieldConfig[] = [
    {
        name: "name",
        label: "Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Standard Annual Fees, Admission 2024",
        required: true,
        tooltip: "Enter a descriptive name to identify this fee profile",
        permission: "field_fee_profile_name",
    },
    {
        name: "profile_type",
        label: "Type",
        type: FORM_TYPE.SELECT,
        placeholder: "Select profile type",
        options: PROFILE_TYPE_OPTIONS,
        tooltip: "The profile type determines the context and lifecycle of these fees",
        permission: "field_fee_profile_type",
    },
    {
        name: "category",
        label: "Category",
        type: FORM_TYPE.SELECT,
        placeholder: "Select category (Optional)",
        options: CATEGORY_OPTIONS,
        tooltip: "Target this profile to a specific reservation or social category",
        permission: "field_fee_profile_category",
    },
    {
        name: "gender",
        label: "Gender",
        type: FORM_TYPE.SELECT,
        placeholder: "Select gender (Optional)",
        options: GENDER_OPTIONS,
        tooltip: "Target this profile to a specific gender if applicable",
        permission: "field_fee_profile_gender",
    },
    {
        name: "fee_collection_frequency",
        label: "Fee Collection Frequency",
        type: FORM_TYPE.SELECT,
        placeholder: "Inherit from Class/Institution",
        options: FREQUENCY_OPTIONS,
        tooltip: "Override the class frequency for this profile. If None, it inherits.",
    },
    {
        name: "description",
        label: "Description",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "Provide additional context for this profile...",
        tooltip: "Optional internal notes or details about the fee profile",
        permission: "field_fee_profile_description",
    },
] as const;

// ─── Fee Items Repeater Config ───────────────────────────
export const FEE_PROFILE_ITEMS_REPEATER = {
    name: "items",
    label: "Fee Items (type + amount)",
    type: FORM_TYPE.REPEATER,
    addLabel: "+ Add Row",
    fields: [
        {
            name: "fee_type_id",
            label: "Fee Type",
            type: FORM_TYPE.ASYNC_SELECT,
            placeholder: "Search and select fee type...",
            required: true,
            tooltip: "Choose the specific fee head to include in this profile",
            asyncConfig: {
                queryFn: (params: Record<string, any>) => feeTypesApi.index(params),
                queryKey: FeeTypeQueryKeys.all,
                labelKey: "name",
                valueKey: "id",
            } as AsyncSelectConfig,
        },
        {
            name: "amount",
            label: "Amount",
            type: FORM_TYPE.NUMBER,
            placeholder: "Enter amount (e.g. 5000)",
            required: true,
            defaultValue: "",
            tooltip: "Specify the exact amount for this fee type",
        },
    ],
};

// ─── Default Values ──────────────────────────────────────
export const FEE_PROFILE_DEFAULT_VALUES = {
    name: "",
    profile_type: "standard",
    category: "_none",
    gender: "_none",
    fee_collection_frequency: "_none",
    description: "",
    is_default: false,
    items: [{ fee_type_id: "", amount: "" }],
};

// ─── Content (scope-type-aware) ──────────────────────────
export function getFeeProfileContent(c: InstitutionContentMap) {
    return {
        pageTitle: c.fee_profiles_page_title,
        pageSubtitle: c.fee_profiles_page_subtitle,
        guidance: c.fee_profiles_guidance,
        addBtn: c.fee_profiles_add_btn,
        createTitle: c.fee_profiles_create_title,
        editTitle: c.fee_profiles_edit_title,
        createBtn: c.fee_profiles_create_btn,
        updateBtn: c.fee_profiles_update_btn,
        cancelBtn: c.fee_profiles_cancel_btn,
        emptyTitle: c.fee_profiles_empty_title,
        emptyDescription: c.fee_profiles_empty_desc,
        sectionGenderCategory: c.fee_profiles_section_gender_category,
        itemsLabel: c.fee_profiles_items_label,
        itemsFeeType: c.fee_profiles_items_fee_type,
        itemsAmount: c.fee_profiles_items_amount,
        itemsAddRow: c.fee_profiles_items_add_row,
        defaultLabel: c.fee_profiles_default_label,
        deleteTitle: c.fee_profiles_delete_title,
        deleteDesc: c.fee_profiles_delete_desc,
        deleteBtn: c.fee_profiles_delete_btn,
    };
}

// ─── Breadcrumbs ─────────────────────────────────────────
export function getFeeProfileBreadcrumbs(c: InstitutionContentMap) {
    return [
        { title: c.fee_hub_breadcrumb, href: "/accounts/fee-hub" },
        { title: c.fee_profiles_page_title, href: "/accounts/fee-hub/profiles" },
    ];
}

// ─── Table Columns ───────────────────────────────────────
export function getFeeProfileColumns(c: InstitutionContentMap) {
    return [
        { key: "sl_no", label: "Sl No." },
        { key: "name", label: c.fee_profiles_col_name },
        { key: "type", label: c.fee_profiles_col_type },
        { key: "category", label: c.fee_profiles_col_category },
        { key: "gender", label: c.fee_profiles_col_gender },
        { key: "description", label: c.fee_profiles_col_description },
        { key: "items", label: c.fee_profiles_col_items },
        { key: "actions", label: c.fee_profiles_col_actions },
    ];
}
