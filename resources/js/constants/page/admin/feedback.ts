import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const FEEDBACK_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Redressal Cell", href: "/grievances" },
  { title: "Feedback Desk", href: "/grievances/feedback" },
];

export const INITIAL_FEEDBACK_FILTERS = {
  page: 1,
  per_page: 15,
  status: null,
  ticket_no: null,
  search: "",
  search_by: "name",
  is_read: null,
};

export const FEEDBACK_COLUMNS = [
  { key: "serial", label: "#" }, // Serial number
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Phone" },
  { key: "subject", label: "Subject" },
  { key: "message", label: "Message" },
  { key: "is_read", label: "Status" },
  { key: "created_at", label: "Posted on" },
  { key: "action", label: "Actions" },
];

// export const FEEDBACK_FORM_INITIAL_DATA = {
//   resolution: "",
//   status: "",
// };

// export const FEEDBACK_DIALOG_FORM_LAYOUT = [
//   {
//     name: "resolution",
//     label: "Resolution",
//     type: FORM_TYPE.TEXT,

//     placeholder: "Enter Resolution Text.",
//     // required: true,
//   },

//   {
//     name: "status",
//     label: "Status",
//     type: FORM_TYPE.DROPDOWN,
//     required: true,
//     options: [
//       {
//         key: "closed",
//         value: "closed",
//         text: "Closed",
//       },

//       {
//         key: "resolved",
//         value: "resolved",
//         text: "Resolved",
//       },
//     ],
//   },
// ];
