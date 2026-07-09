import { FORM_TYPE } from "@/constants/shared/form";
import type { FormFieldConfig } from "@/types/formTypes";
import type { InstitutionContentMap } from "@/constants/content";

// ─── Permissions ─────────────────────────────────────────────────────────────
export const STREAM_PERMISSIONS = {
  view: "view_streams",
  create: "create_streams",
  edit: "update_streams",
  delete: "delete_streams",
} as const;

// ─── Form Fields ─────────────────────────────────────────────────────────────
// Labels/placeholders/tooltips are resolved at runtime via content engine,
// so we use placeholder strings here and override in useStreamPage.
export const STREAM_FORM_FIELDS: readonly FormFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "",
    required: true,
    maxLength: 100,
    permission: "field_stream_name",
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "",
    required: true,
    maxLength: 20,
    permission: "field_stream_code",
  },
  {
    name: "duration_years",
    label: "Duration (in Years)",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "",
    required: true,
    options: [
      { key: "1", value: "1", text: "1" },
      { key: "2", value: "2", text: "2" },
      { key: "3", value: "3", text: "3" },
      { key: "4", value: "4", text: "4" },
      { key: "5", value: "5", text: "5" },
    ],
    permission: "field_stream_duration_years",
  },
  {
    name: "main_stream_id",
    label: "Main Stream",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "",
    required: true,
    permission: "field_stream_main_stream_id",
  },
] as const;

// ─── Default Values ──────────────────────────────────────────────────────────
export const STREAM_DEFAULT_VALUES = {
  name: "",
  code: "",
  duration_years: "1",
  main_stream_id: "",
};

// ─── Content (scope-type-aware: resolved from content engine) ────────────────
export function getStreamContent(c: InstitutionContentMap) {
  return {
    pageTitle: c.streams_page_title,
    pageSubtitle: c.streams_page_subtitle,
    guidance: c.streams_guidance,
    addBtn: c.streams_add_btn,
    createTitle: c.streams_create_title,
    editTitle: c.streams_edit_title,
    createBtn: c.streams_create_btn,
    updateBtn: c.streams_update_btn,
    cancelBtn: c.streams_cancel_btn,
    emptyTitle: c.streams_empty_title,
    emptyDescription: c.streams_empty_desc,
    deleteTitle: c.streams_delete_title,
    deleteDesc: c.streams_delete_desc,
    filterPlaceholder: c.streams_filter_main_stream_placeholder,
    filterAll: c.streams_filter_main_stream_all,
    searchPlaceholder: c.streams_search_placeholder,
    tip: c.streams_tip,
  };
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────
export function getStreamBreadcrumbs(c: InstitutionContentMap) {
  return [
    { title: c.streams_breadcrumb_parent, href: "/organization/sessions" },
    { title: c.streams_breadcrumb_self, href: "/organization/streams" },
  ];
}

// ─── Table Columns (scope-type-aware) ────────────────────────────────────────
export function getStreamColumns(c: InstitutionContentMap) {
  return [
    { key: "sl_no", label: c.streams_col_sl },
    { key: "name", label: c.streams_col_name },
    { key: "code", label: c.streams_col_code },
    { key: "duration", label: c.streams_col_duration },
    { key: "main_stream", label: c.streams_col_main_stream },
    { key: "status", label: c.streams_col_status },
    { key: "actions", label: c.streams_col_actions },
  ];
}

// ─── Resolve form field labels from content engine ───────────────────────────
export function getStreamFormFields(
  c: InstitutionContentMap,
  baseFields: readonly FormFieldConfig[],
): FormFieldConfig[] {
  const labelMap: Record<string, { label: string; placeholder: string; tooltip: string }> = {
    name: {
      label: c.streams_field_name_label,
      placeholder: c.streams_field_name_placeholder,
      tooltip: c.streams_field_name_tooltip,
    },
    code: {
      label: c.streams_field_code_label,
      placeholder: c.streams_field_code_placeholder,
      tooltip: c.streams_field_code_tooltip,
    },
    duration_years: {
      label: c.streams_field_duration_label,
      placeholder: c.streams_field_duration_placeholder,
      tooltip: c.streams_field_duration_tooltip,
    },
    main_stream_id: {
      label: c.streams_field_main_stream_label,
      placeholder: c.streams_field_main_stream_placeholder,
      tooltip: c.streams_field_main_stream_tooltip,
    },
  };

  return baseFields.map((field) => {
    const overrides = labelMap[field.name];
    return overrides ? { ...field, ...overrides } : field;
  });
}
