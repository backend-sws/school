import { FORM_TYPE } from "@/constants/shared/form";
import type { FormFieldConfig } from "@/types/formTypes";
import type { InstitutionContentMap } from "@/constants/content";

// ─── Permissions ─────────────────────────────────────────────────────────────
export const CATEGORY_PERMISSIONS = {
  view: "view_expense_categories",
  create: "create_expense_categories",
  edit: "update_expense_categories",
  delete: "delete_expense_categories",
} as const;

export const EXPENSE_PERMISSIONS = {
  view: "view_expenses",
  create: "create_expenses",
  edit: "update_expenses",
  delete: "delete_expenses",
  approve: "approve_expenses",
} as const;

export const BUDGET_PERMISSIONS = {
  view: "view_expense_budgets",
  create: "create_expense_budgets",
  edit: "update_expense_budgets",
  delete: "delete_expense_budgets",
} as const;

// ─── Payment Mode Options ──────────────────────────────────────────────────
export const PAYMENT_MODE_OPTIONS = [
  { key: "cash", value: "Cash", text: "Cash" },
  { key: "bank_transfer", value: "Bank Transfer", text: "Bank Transfer" },
  { key: "cheque", value: "Cheque", text: "Cheque" },
  { key: "upi", value: "UPI/Digital", text: "UPI / Digital" },
  { key: "card", value: "Credit/Debit Card", text: "Credit / Debit Card" },
];

// ─── Category Form Fields ────────────────────────────────────────────────────
export const CATEGORY_FORM_FIELDS: readonly FormFieldConfig[] = [
  {
    name: "name",
    label: "Category Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Electricity Bill, Staff Salary",
    required: true,
    tooltip: "Enter a unique name for the expense category",
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. UTIL, SALARY",
    required: false,
    tooltip: "Short identifier code for the category",
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Write details about this category...",
    required: false,
  },
  {
    name: "is_active",
    label: "Status",
    type: FORM_TYPE.SELECT,
    options: [
      { key: "active", value: "true", text: "Active" },
      { key: "inactive", value: "false", text: "Inactive" },
    ],
    required: true,
  },
] as const;

// ─── Expense Form Fields ─────────────────────────────────────────────────────
export const EXPENSE_FORM_FIELDS: readonly FormFieldConfig[] = [
  {
    name: "expense_category_id",
    label: "Expense Category",
    type: FORM_TYPE.SELECT,
    placeholder: "Select Category",
    required: true,
    options: [], // Injected dynamically in Dialog
  },
  {
    name: "title",
    label: "Expense Title / Purpose",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Purchased Science Lab Test Tubes",
    required: true,
  },
  {
    name: "amount",
    label: "Amount (₹)",
    type: FORM_TYPE.CURRENCY,
    placeholder: "0.00",
    required: true,
  },
  {
    name: "date",
    label: "Expense Date",
    type: FORM_TYPE.DATE,
    required: true,
  },
  {
    name: "payment_mode",
    label: "Payment Mode",
    type: FORM_TYPE.SELECT,
    placeholder: "Select payment mode",
    options: PAYMENT_MODE_OPTIONS,
    required: true,
  },
  {
    name: "reference_no",
    label: "Reference / Transaction No.",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Cheque no, Transaction ID",
    required: false,
  },
  {
    name: "payee",
    label: "Payee / Vendor",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. XYZ Stationery Supplies",
    required: false,
  },
  {
    name: "description",
    label: "Description / Notes",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Additional details about this transaction...",
    required: false,
  },
  {
    name: "attachment",
    label: "Attachment / Invoice Link",
    type: FORM_TYPE.TEXT, // Usually handled by upload trigger in dialog, saves path as string
    placeholder: "Invoice path or upload link",
    required: false,
    tooltip: "Upload receipt or invoice copy to store",
  },
] as const;

// ─── Budget Form Fields ──────────────────────────────────────────────────────
export const BUDGET_FORM_FIELDS: readonly FormFieldConfig[] = [
  {
    name: "session_id",
    label: "Academic Session",
    type: FORM_TYPE.SELECT,
    placeholder: "Select Session",
    required: true,
    options: [], // Injected dynamically
  },
  {
    name: "expense_category_id",
    label: "Expense Category",
    type: FORM_TYPE.SELECT,
    placeholder: "Select Category",
    required: true,
    options: [], // Injected dynamically
  },
  {
    name: "amount",
    label: "Allocated Budget (₹)",
    type: FORM_TYPE.CURRENCY,
    placeholder: "0.00",
    required: true,
  },
  {
    name: "alert_threshold",
    label: "Alert Warning Threshold (%)",
    type: FORM_TYPE.PERCENTAGE,
    placeholder: "90",
    required: true,
    tooltip: "Warn user when expense usage reaches this percentage (e.g. 90%)",
  },
] as const;

// ─── Default Values ──────────────────────────────────────────────────────────
export const CATEGORY_DEFAULT_VALUES = {
  name: "",
  code: "",
  description: "",
  is_active: "true",
};

export const EXPENSE_DEFAULT_VALUES = {
  expense_category_id: "",
  title: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  payment_mode: "Cash",
  reference_no: "",
  payee: "",
  description: "",
  attachment: "",
};

export const BUDGET_DEFAULT_VALUES = {
  session_id: "",
  expense_category_id: "",
  amount: "",
  alert_threshold: "90",
};

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────
export function getExpensesBreadcrumbs(c: InstitutionContentMap) {
  return [
    { title: "Treasury & Fees", href: "/accounts/fee-hub/fee-types" },
    { title: "Expenses Tracker", href: "/accounts/expenses" },
  ];
}

// ─── Table Columns ───────────────────────────────────────────────────────────
export function getCategoryColumns() {
  return [
    { key: "sl_no", label: "S.No." },
    { key: "name", label: "Category Name" },
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
    { key: "is_active", label: "Status" },
    { key: "actions", label: "Actions" },
  ];
}

export function getExpenseColumns() {
  return [
    { key: "sl_no", label: "S.No." },
    { key: "date", label: "Date" },
    { key: "category", label: "Category" },
    { key: "title", label: "Title/Purpose" },
    { key: "amount", label: "Amount (₹)" },
    { key: "payee", label: "Payee/Vendor" },
    { key: "payment_mode", label: "Payment Mode" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];
}

export function getBudgetColumns() {
  return [
    { key: "sl_no", label: "S.No." },
    { key: "category", label: "Expense Category" },
    { key: "session", label: "Session" },
    { key: "amount", label: "Allocated Budget (₹)" },
    { key: "alert_threshold", label: "Threshold (%)" },
    { key: "actions", label: "Actions" },
  ];
}
