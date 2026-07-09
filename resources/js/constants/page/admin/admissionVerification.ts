import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import { disable } from "@/routes/two-factor";

export const ADMISSION_VERIFICATION_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "main_stream_name", label: "Main Stream Name" },
  { key: "is_enabled", label: "Is enabled?" },
  { key: "last_uploaded_at", label: "Last Updated" },
  { key: "is_database_attached", label: "Is database Attached" },
  { key: "action", label: "Actions" },
];

export const ADMISSION_VERIFICATION_INITIAL_DATA = {
  title: "",
  description: "",
  streamId: "",
};

export const ADMISSION_VERIFICATION_FORM_LAYOUT = [
  {
    name: "streamId",
    label: "Main Stream",
    type: FORM_TYPE.DROPDOWN,
    disabled: true,
    placeholder: "e.g. Main stream (read-only)",
    tooltip: "Main stream for which admission verification data is being uploaded. Set by context.",
  },
  {
    name: "file",
    label: "Upload Excel",
    type: FORM_TYPE.FILE_SELECT,
    placeholder: "e.g. Select .xlsx or .xls file",
    tooltip: "Excel file with admission/verification records. Ensure columns match the expected template.",
  },
];
