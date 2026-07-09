import { FilterOption } from "@/components/filter-bar";
import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const NOTICE_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Website & PR", href: "/website/sliders" },
  { title: "Notice Desk", href: "/notice-management" },
];

export const INITIAL_NOTICE_FILTERS = {
  page: 1,
  per_page: 10,
  target_type: "all",
  search: "",
  search_by: "title",
};

export const NOTICE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "notice_for", label: "Target" },
  { key: "published_on", label: "Published" },
  { key: "action", label: "Actions" },
];

export const TARGET_TYPE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Notices" },
  { value: "selective", label: "Selective" },
];

export const NOTICE_FORM_INITIAL_DATA = {
  title: "",
  description: "",
  target_type: "all" as "all" | "selective",
  is_published: true,
  scheduled_at: "",
  expired_at: "",
  combos: [],
};

export const NOTICE_DIALOG_FORM_LAYOUT = [
  {
    name: "title",
    label: "Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Exam schedule for semester 1",
    tooltip: "Short, clear title for the notice. Used in lists and notifications.",
    required: true,
    maxLength: 255,
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "e.g. Detailed instructions and dates...",
    tooltip: "Full notice content. Include dates, venue, and any attachments or links.",
    maxLength: 5000,
  },
  {
    name: "target_type",
    label: "Target Audience",
    type: FORM_TYPE.RADIO,
    options: [
      { key: "all", text: "All Students", value: "all" },
      { key: "selective", text: "Selective", value: "selective" },
    ],
    tooltip: "All: visible to every student. Selective: choose specific streams/sessions.",
  },
  {
    name: "is_published",
    label: "Publish Options",
    type: FORM_TYPE.RADIO,
    options: [
      { key: "now", text: "Publish Now", value: true },
      { key: "later", text: "Schedule for Later", value: false },
    ],
    tooltip: "Publish immediately or set a future date/time for automatic publishing.",
  },
];

export const NOTICE_CONDITIONAL_FORM_LAYOUT = [
  {
    name: "scheduled_at",
    label: "Schedule At",
    type: FORM_TYPE.DATETIME,
    placeholder: "e.g. 15 Mar 2025, 10:00 AM",
    tooltip: "Date and time when this notice will be published. Leave empty if publishing now.",
  },
];

export const NOTICE_CONDITIONAL_FORM_LAYOUT_SELECTIVE = [
  {
    name: "combos",
    label: "Streams / Sessions",
    type: FORM_TYPE.MULTI_SELECT,
    optionsKey: "streams",
    valueKey: "id",
    placeholder: "e.g. Select streams or sessions",
    tooltip: "Only students in the selected stream-session combinations will see this notice.",
  },
];

export const NOTICE_GUIDELINES = [
  "Broadcast important announcements to the entire institution or specific groups.",
  "Use 'Selective' targeting to send notices only to relevant streams or semesters.",
  "Schedule notices in advance to ensure timely delivery of exam or event updates.",
];

export const NOTICE_TIP = "Use the 'Scheduled' feature to prepare notices over the weekend for automatic publishing during the busy week.";
