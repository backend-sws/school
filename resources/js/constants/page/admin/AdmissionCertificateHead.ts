import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import { disable } from "@/routes/two-factor";

export const ADDMISSION_CERTIFICATE_INITIAL_DATA = {};

export const ADDMISSION_CERTIFICATE_FORM_LAYOUT = [
  {
    name: "file",
    label: "Upload Image",
    type: FORM_TYPE.FILE,
    placeholder: "e.g. Select certificate or document image",
    tooltip: "Upload the certificate or document image. Single file; use a clear, readable scan or photo.",
    options: {
      fileMode: "single",
    },
  },
];
