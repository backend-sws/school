import { BreadcrumbItem } from "@/types";

/* ─── Breadcrumbs ─────────────────────────────────────────────────── */

export const APPLICATION_SHOW_BREADCRUMBS = (
  id: number | string,
  applicationId?: string,
): BreadcrumbItem[] => [
  { title: "Admission Cell", href: "/admission/applications" },
  { title: "Applications", href: "/admission/applications" },
  {
    title: applicationId ? String(applicationId) : "Details",
    href: `/admission/applications/${id}`,
  },
];

export const APPLICATION_PAY_BREADCRUMBS = (
  id: number | string,
  applicationId?: string,
): BreadcrumbItem[] => [
  { title: "Applications", href: "/admission/applications" },
  {
    title: applicationId ?? "Application",
    href: `/admission/applications/${id}`,
  },
  { title: "Payment Portal", href: "" },
];

/* ─── Status / Payment Color Maps ─────────────────────────────────── */

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  approved: "text-green-700 bg-green-50 border-green-200",
  rejected: "text-red-700 bg-red-50 border-red-200",
  pending: "text-amber-700 bg-amber-50 border-amber-200",
};

export const APPLICATION_STATUS_DOT_COLORS: Record<string, string> = {
  approved: "bg-green-500",
  rejected: "bg-red-500",
  pending: "bg-amber-500",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  paid: "text-green-700 bg-green-50 border-green-200",
  success: "text-green-700 bg-green-50 border-green-200",
  failed: "text-red-700 bg-red-50 border-red-200",
  pending: "text-slate-600 bg-slate-50 border-slate-200",
};

export const PAYMENT_STATUS_DOT_COLORS: Record<string, string> = {
  paid: "bg-green-500",
  success: "bg-green-500",
  failed: "bg-red-500",
  pending: "bg-slate-400",
};
