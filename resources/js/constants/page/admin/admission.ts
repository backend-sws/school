import { BreadcrumbItem } from "@/types";

export const ADMISSION_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Admission Cell", href: "/admission/applications" },
  { title: "Application Desk", href: "/admission/applications" },
];

export const NEW_APPLICATION_BREADCRUMBS: BreadcrumbItem[] = [
  ...ADMISSION_BREADCRUMBS,
  { title: "New application", href: "/admission/applications/new" },
];

export const STUDENT_ADMISSION_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "My Portal", href: "/dashboard" },
  { title: "My Applications", href: "/admission/applications" },
];

export const APPLICATIONS_GUIDELINES = [
  "Admission applications represent the first step for new students onboarding the institution.",
  "Track application lifecycle from submission through document verification to approval and fee payment.",
  "Approved applications automatically trigger profile creation and session enrollment.",
];

export const APPLICATIONS_TIP = "Export application data to CSV to perform external audits or bulk-verify contact details during peak admission seasons.";

export const STUDENT_APPLICATIONS_GUIDELINES = [
  "Track your admission applications. View your status, download receipts, or proceed to payment.",
];

export const STUDENT_APPLICATIONS_TIP = "Ensure all uploaded documents are clear and legible to avoid delays in the verification process.";
