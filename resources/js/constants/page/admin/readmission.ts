import { FORM_TYPE } from "@/constants/shared/form";

/**
 * Form config for the admin re-admission processing dialog.
 * Session, stream, class options are injected dynamically.
 */

export interface ReadmissionSessionOption {
  key: string;
  value: string;
  text: string;
}

export const getReadmissionProcessFormFields = (
  sessionOptions: ReadmissionSessionOption[],
  semesterLabel: string,
  hasSemester: boolean,
  streamOptions: ReadmissionSessionOption[] = [],
  classOptions: ReadmissionSessionOption[] = [],
) => {
  const fields = [
    {
      name: "to_session_id",
      label: "Target Session",
      type: FORM_TYPE.DROPDOWN,
      placeholder: "Select session",
      required: true,
      options: sessionOptions,
    },
    ...(streamOptions.length > 0
      ? [
          {
            name: "to_stream_id",
            label: "Target Stream / Class",
            type: FORM_TYPE.DROPDOWN,
            placeholder: "Select stream",
            options: streamOptions,
          },
        ]
      : []),
    ...(classOptions.length > 0
      ? [
          {
            name: "to_class_id",
            label: "Target Section",
            type: FORM_TYPE.DROPDOWN,
            placeholder: "Select section",
            options: classOptions,
          },
        ]
      : []),
    ...(hasSemester
      ? [
          {
            name: "to_semester",
            label: `Target ${semesterLabel}`,
            type: FORM_TYPE.DROPDOWN,
            placeholder: `Select ${semesterLabel.toLowerCase()}`,
            options: Array.from({ length: 10 }, (_, i) => ({
              key: String(i + 1),
              value: String(i + 1),
              text: `${semesterLabel} ${i + 1}`,
            })),
          },
        ]
      : []),
    {
      name: "gap_duration_months",
      label: "Gap Duration (months)",
      type: FORM_TYPE.NUMBER_TEXT,
      placeholder: "e.g. 12",
    },
    {
      name: "dropout_reason",
      label: "Dropout Reason",
      type: FORM_TYPE.TEXT,
      placeholder: "Reason for leaving",
    },
    {
      name: "remarks",
      label: "Remarks",
      type: FORM_TYPE.TEXTAREA,
      placeholder: "Additional notes...",
    },
  ];

  return fields;
};

export const getBulkReadmissionFormFields = (
  sessionOptions: ReadmissionSessionOption[],
  semesterLabel: string,
  hasSemester: boolean,
  streamOptions: ReadmissionSessionOption[] = [],
) => {
  return [
    {
      name: "from_session_id",
      label: "From Session",
      type: FORM_TYPE.DROPDOWN,
      placeholder: "Select current session",
      required: true,
      options: sessionOptions,
    },
    {
      name: "to_session_id",
      label: "To Session",
      type: FORM_TYPE.DROPDOWN,
      placeholder: "Select target session",
      required: true,
      options: sessionOptions,
    },
    ...(streamOptions.length > 0
      ? [
          {
            name: "stream_id",
            label: "Filter by Stream",
            type: FORM_TYPE.DROPDOWN,
            placeholder: "All streams",
            options: streamOptions,
          },
        ]
      : []),
    ...(hasSemester
      ? [
          {
            name: "to_semester",
            label: `Target ${semesterLabel}`,
            type: FORM_TYPE.DROPDOWN,
            placeholder: `Select ${semesterLabel.toLowerCase()}`,
            options: Array.from({ length: 10 }, (_, i) => ({
              key: String(i + 1),
              value: String(i + 1),
              text: `${semesterLabel} ${i + 1}`,
            })),
          },
        ]
      : []),
  ];
};

export const READMISSION_BREADCRUMBS = [
  { title: "Admission Cell", href: "/admission/applications" },
  { title: "Re-Admissions", href: "/admission/readmissions" },
];

export const NEW_READMISSION_BREADCRUMBS = [
  ...READMISSION_BREADCRUMBS,
  { title: "New Re-Admission", href: "" },
];

