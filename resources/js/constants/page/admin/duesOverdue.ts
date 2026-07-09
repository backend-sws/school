import type { BreadcrumbItem } from "@/types";

export const DUES_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Treasury & Fees", href: "/accounts/fee-hub" },
    { title: "Dues & overdue", href: "/accounts/fee-hub/dues" },
];

export const DUES_GUIDANCE = [
    "Review fee dues for students across different classes and periods.",
    "Send automated reminders to guardians for upcoming or overdue payments.",
    "Click 'View ledger' to see individual student payment history and detailed breakdowns.",
];

export const DUES_COLUMNS = [
    { key: "sr", label: "#" },
    { key: "student", label: "Student" },
    { key: "class", label: "Class" },
    { key: "due_date", label: "Due date" },
    { key: "expected", label: "Expected" },
    { key: "paid", label: "Paid" },
    { key: "balance", label: "Balance" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
];

export const DUES_STATUS_COLOR: Record<string, string> = {
    paid: "bg-green-500/10 text-green-700 border-green-500/20",
    partial: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    overdue: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    due_soon: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    upcoming: "bg-muted text-muted-foreground",
};

export const DUES_STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "overdue", label: "Overdue" },
    { value: "due_soon", label: "Due soon" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" },
    { value: "upcoming", label: "Upcoming" },
];

export function getMonthOptions() {
    const out: { value: string; label: string }[] = [];
    const now = new Date();
    for (let i = -2; i <= 2; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
        out.push({ value, label });
    }
    return out;
}

export const MONTH_OPTIONS = getMonthOptions();

export const CURRENT_PERIOD = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
