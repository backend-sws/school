import { FORM_TYPE } from "@/constants/shared/form";
import type { FormFieldConfig } from "@/types/formTypes";
import type { InstitutionContentMap } from "@/constants/content";

// ─── Permissions ─────────────────────────────────────────────────────────────
export const SUBJECT_PERMISSIONS = {
  view: "view_subjects",
  create: "create_subjects",
  edit: "update_subjects",
  delete: "delete_subjects",
} as const;

// ─── Form Fields ─────────────────────────────────────────────────────────────
export const SUBJECT_FORM_FIELDS: readonly FormFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "",
    required: true,
    maxLength: 150,
    permission: "field_subject_name",
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "",
    required: true,
    maxLength: 30,
    permission: "field_subject_code",
  },
  {
    name: "stream_id",
    label: "Stream",
    type: FORM_TYPE.MULTI_SELECT,
    placeholder: "",
    required: true,
    permission: "field_subject_stream_id",
  },
  {
    name: "is_practical",
    label: "Is Practical",
    type: FORM_TYPE.RADIO,
    options: [
      { key: "true", text: "Yes", value: true },
      { key: "false", text: "No", value: false },
    ],
    permission: "field_subject_is_practical",
  },
] as const;

// ─── Default Values ──────────────────────────────────────────────────────────
export const SUBJECT_DEFAULT_VALUES = {
  name: "",
  code: "",
  stream_id: [],
  is_practical: false,
};

// ─── Content (scope-type-aware: resolved from content engine) ────────────────
export function getSubjectContent(c: InstitutionContentMap) {
  return {
    pageTitle: c.subjects_page_title,
    pageSubtitle: c.subjects_page_subtitle,
    guidance: c.subjects_guidance,
    addBtn: c.subjects_add_btn,
    createTitle: c.subjects_create_title,
    editTitle: c.subjects_edit_title,
    createBtn: c.subjects_create_btn,
    updateBtn: c.subjects_update_btn,
    cancelBtn: c.subjects_cancel_btn,
    emptyTitle: c.subjects_empty_title,
    emptyDescription: c.subjects_empty_desc,
    deleteTitle: c.subjects_delete_title,
    deleteDesc: c.subjects_delete_desc,
    filterStreamPlaceholder: c.subjects_filter_stream_placeholder,
    filterStreamAll: c.subjects_filter_stream_all,
    filterGroupPlaceholder: c.subjects_filter_group_placeholder,
    filterGroupAll: c.subjects_filter_group_all,
    searchPlaceholder: c.subjects_search_placeholder,
    tip: c.subjects_tip,
  };
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────
export function getSubjectBreadcrumbs(c: InstitutionContentMap) {
  return [
    { title: c.subjects_breadcrumb_parent, href: "/organization/sessions" },
    { title: c.subjects_breadcrumb_self, href: "/organization/subject" },
  ];
}

// ─── Table Columns (scope-type-aware) ────────────────────────────────────────
export function getSubjectColumns(c: InstitutionContentMap) {
  return [
    { key: "serial", label: c.subjects_col_sl },
    { key: "name", label: c.subjects_col_name },
    { key: "code", label: c.subjects_col_code },
    { key: "stream", label: c.subjects_col_stream },
    { key: "status", label: c.subjects_col_status },
    { key: "is_practical", label: c.subjects_col_practical },
    { key: "action", label: c.subjects_col_actions },
  ];
}

// ─── Resolve form field labels from content engine ───────────────────────────
export function getSubjectFormFields(
  c: InstitutionContentMap,
  baseFields: readonly FormFieldConfig[],
): FormFieldConfig[] {
  const labelMap: Record<string, { label: string; placeholder: string; tooltip: string }> = {
    name: {
      label: c.subjects_field_name_label,
      placeholder: c.subjects_field_name_placeholder,
      tooltip: c.subjects_field_name_tooltip,
    },
    code: {
      label: c.subjects_field_code_label,
      placeholder: c.subjects_field_code_placeholder,
      tooltip: c.subjects_field_code_tooltip,
    },
    stream_id: {
      label: c.subjects_field_stream_label,
      placeholder: c.subjects_field_stream_placeholder,
      tooltip: c.subjects_field_stream_tooltip,
    },
    is_practical: {
      label: c.subjects_field_is_practical_label,
      placeholder: "",
      tooltip: c.subjects_field_is_practical_tooltip,
    },
  };

  return baseFields.map((field) => {
    const overrides = labelMap[field.name];
    return overrides ? { ...field, ...overrides } : field;
  });
}
