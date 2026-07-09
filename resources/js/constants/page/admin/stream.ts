import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import { Search } from "lucide-react";

export const STREAM_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/organization/sessions" },
  { title: "Streams & Programs", href: "/organization/streams" },
];

export const StreamTable = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "duration_years", label: "Duration" },
  { key: "main_stream", label: "Main Stream" },
  { key: "status", label: "Status" },
  //   { key: "created_at", label: "Created On" },
  { key: "action", label: "Actions" },
];

export const INITIAL_STREAM_FILTERS = {
  main_stream_id: null,
  search: "",
  per_page: 10,
};

export const STREAM_FORM_INITIAL_DATA = {
  name: "",
  code: "",
  duration_years: "",
  main_stream_id: "",
};

export const STREAM_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. B.Sc. Honors, B.A. General",
    tooltip: "Program or stream name under the main course. Used for enrollment and roll numbers.",
    required: true,
    maxLength: 100,
    className: "uppercase",
    lowercase: true,
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. BSC-H, BA-G",
    tooltip: "Short unique code for this program. Used in subject codes and reporting.",
    className: "uppercase",
    lowercase: true,
    required: true,
    maxLength: 20,
  },
  {
    name: "duration_years",
    label: "Duration (in Years)",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. 3",
    tooltip: "Program duration in years. Determines session mapping for enrolled students.",
    required: true,
    options: [
      { key: "1", value: "1", text: "1" },
      { key: "2", value: "2", text: "2" },
      { key: "3", value: "3", text: "3" },
      { key: "4", value: "4", text: "4" },
      { key: "5", value: "5", text: "5" },
    ],
  },
  {
    name: "main_stream_id",
    label: "Main Stream",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "main_streams",
    placeholder: "e.g. Undergraduate, Postgraduate",
    tooltip: "Parent course stream this program belongs to (e.g. UG, PG).",
    required: true,
  },
];

export const STREAM_GUIDELINES = [
  "Program streams are specific academic tracks (e.g., Honors, Vocational) under a larger course.",
  "The program duration dictates the multi-year session mapping for enrolled students.",
  "Streams must be accurately mapped to course streams for unified institutional auditing.",
];

export const STREAM_TIP = "Assign accurate 'Duration' to each stream to ensure students are correctly mapped across consecutive sessions until graduation.";
