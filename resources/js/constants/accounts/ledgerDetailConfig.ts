import { LucideIcon, Users, GraduationCap, Mail, User, Calendar, Printer, Download, Receipt, CreditCard, Send } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HeroPillConfig {
    key: string;
    label: string;
    /** Dot-path to resolve value from student/classInfo objects */
    valuePath: string;
    /** Fallback dot-paths tried in order */
    fallbackPaths?: string[];
    icon?: LucideIcon;
    /** If true, pill only shows when value is truthy */
    conditional?: boolean;
    variant?: "default" | "primary";
}

export interface ContextCardConfig {
    key: string;
    label: string;
    icon: LucideIcon;
    valuePath: string;
    fallbackPaths?: string[];
    /** Custom format function for compound values */
    format?: "truncate" | "mono";
    /** Dynamic label that depends on scope type */
    dynamicLabel?: (labels: any) => string;
}

export interface AdmissionMetricConfig {
    key: string;
    label: string;
    field: string;
    /** Only show this metric if value > 0 */
    conditionalOnPositive?: boolean;
    colorClass?: string;
    prefix?: string;
}

export interface HeroActionConfig {
    key: string;
    label: string;
    icon: LucideIcon;
    variant: "outline";
}

export interface MatrixColumnConfig {
    key: string;
    label: string;
    align: "left" | "right" | "center";
    bgClass?: string;
    textClass?: string;
    /** For static columns */
    type: "static" | "dynamic";
    /** Dot path to resolve value from row */
    rowField?: string;
    /** Format function */
    format?: "currency" | "currency-positive" | "text";
}

// ─── Hero Info Pills ─────────────────────────────────────────────────────────

export const LEDGER_HERO_PILLS: HeroPillConfig[] = [
    {
        key: "reg",
        label: "Reg",
        valuePath: "student_profile.reg_no",
        fallbackPaths: ["reg_no"],
        variant: "default",
    },
    {
        key: "roll",
        label: "Roll",
        valuePath: "student_profile.roll_no",
        variant: "default",
    },
    {
        key: "stream",
        label: "",
        valuePath: "student_profile.stream.name",
        icon: GraduationCap,
        conditional: true,
        variant: "primary",
    },
    {
        key: "session",
        label: "",
        valuePath: "student_profile.session.name",
        icon: Calendar,
        variant: "primary",
    },
];

// ─── Context Cards ───────────────────────────────────────────────────────────

export const getContextCards = (labels: any): ContextCardConfig[] => [
    {
        key: "parent",
        label: "Parent's Name",
        icon: Users,
        valuePath: "student_profile.father_name",
    },
    {
        key: "class",
        label: `${labels.streamLabel} & Context`,
        icon: GraduationCap,
        valuePath: "student_profile.stream.name",
        fallbackPaths: ["__classInfo.name"],
    },
    {
        key: "email",
        label: "Email",
        icon: Mail,
        valuePath: "email",
        format: "truncate",
    },
    {
        key: "mobile",
        label: "Mobile",
        icon: User,
        valuePath: "mobile",
        fallbackPaths: ["student_profile.mobile"],
        format: "mono",
    },
];

// ─── Admission Summary Metrics ───────────────────────────────────────────────

export const ADMISSION_METRICS: AdmissionMetricConfig[] = [
    { key: "total", label: "Total Fee", field: "total_amount" },
    { key: "transport", label: "Transport", field: "transport_amount", conditionalOnPositive: true },
    { key: "hostel", label: "Hostel", field: "hostel_amount", conditionalOnPositive: true },
    { key: "discount", label: "Discount", field: "discount_amount", conditionalOnPositive: true, colorClass: "text-emerald-600", prefix: "−" },
    { key: "paid", label: "Paid", field: "paid_amount", colorClass: "text-emerald-600" },
    { key: "due", label: "Due", field: "due_amount" },
];

// ─── Hero Actions ────────────────────────────────────────────────────────────

export const LEDGER_HERO_ACTIONS: HeroActionConfig[] = [
    { key: "remind", label: "Remind", icon: Send, variant: "outline" },
    { key: "print", label: "Print", icon: Printer, variant: "outline" },
    { key: "export", label: "Export", icon: Download, variant: "outline" },
];

// ─── Matrix Static Columns ───────────────────────────────────────────────────

export const MATRIX_STATIC_COLUMNS: MatrixColumnConfig[] = [
    { key: "month", label: "Month", align: "left", type: "static" },
    { key: "prev_dues", label: "Prev. Dues", align: "right", bgClass: "bg-amber-500/5", type: "static", rowField: "previous_dues", format: "currency" },
];

export const MATRIX_ADMISSION_COLUMNS: MatrixColumnConfig[] = [
    { key: "admission_fee", label: "Admission", align: "right", type: "static", rowField: "admission_fee", format: "currency-positive" },
    { key: "transport_fee", label: "Transport", align: "right", type: "static", rowField: "transport_fee", format: "currency-positive" },
    { key: "hostel_fee", label: "Hostel", align: "right", type: "static", rowField: "hostel_fee", format: "currency-positive" },
    { key: "other_fees", label: "Other", align: "right", type: "static", rowField: "other_fees", format: "currency-positive" },
];

export const MATRIX_SUMMARY_COLUMNS: MatrixColumnConfig[] = [
    { key: "late_fee", label: "Late Fee", align: "right", type: "static", rowField: "late_fee", format: "currency-positive", textClass: "text-amber-600" },
    { key: "discount", label: "Discount", align: "right", type: "static", rowField: "discount", format: "currency-positive", textClass: "text-green-600", bgClass: "bg-green-500/5" },
    { key: "total_dues", label: "Total Dues", align: "right", bgClass: "bg-primary/5", type: "static", rowField: "total_payable", format: "currency" },
    { key: "paid", label: "Paid", align: "right", type: "static", rowField: "paid_amount", format: "currency-positive", textClass: "text-emerald-600" },
    { key: "arrears", label: "Arrears", align: "right", bgClass: "bg-rose-500/5", textClass: "text-rose-600", type: "static", rowField: "balance", format: "currency-positive" },
    { key: "receipt_no", label: "Receipt No", align: "center", type: "static", rowField: "receipt_no", format: "text" },
    { key: "payment_mode", label: "Mode", align: "center", type: "static", rowField: "payment_mode", format: "text" },
    { key: "payment_date", label: "Pay Date", align: "center", type: "static", rowField: "payment_date", format: "text" },
    { key: "receipts", label: "Receipt/Reminders", align: "center", type: "static" },
    { key: "action", label: "Action", align: "center", type: "static" },
];

// ─── One-Time Charges Table Columns ──────────────────────────────────────────

export const ONE_TIME_COLUMNS = [
    { key: "name", label: "Fee Type", align: "left" as const },
    { key: "category", label: "Category", align: "right" as const },
    { key: "amount", label: "Amount", align: "right" as const },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolve a dot-path value from an object, with fallback paths.
 */
export function resolveValue(obj: any, path: string, fallbackPaths?: string[]): any {
    const get = (o: any, p: string) => p.split(".").reduce((acc, key) => acc?.[key], o);
    const val = get(obj, path);
    if (val !== undefined && val !== null && val !== "") return val;
    if (fallbackPaths) {
        for (const fp of fallbackPaths) {
            const fv = get(obj, fp);
            if (fv !== undefined && fv !== null && fv !== "") return fv;
        }
    }
    return null;
}

/**
 * Format a currency value.
 */
export function formatCurrency(value: any, onlyPositive = false): string {
    const num = Number(value);
    if (onlyPositive && num <= 0) return "—";
    return num < 0 ? `-₹${Math.abs(num).toLocaleString()}` : `₹${num.toLocaleString()}`;
}
