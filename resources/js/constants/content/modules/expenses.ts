/**
 * Expenses content module — expense categories, expense logging, approval workflows, budgeting and analytics.
 */

export interface ExpensesContentKeys {
  // --- Expense Categories ---
  expense_categories_title: string;
  expense_categories_subtitle: string;
  expense_categories_guidance: string[];
  expense_categories_add_btn: string;
  expense_categories_empty_title: string;
  expense_categories_empty_desc: string;

  // --- Expenses Logging/Records ---
  expenses_records_title: string;
  expenses_records_subtitle: string;
  expenses_records_guidance: string[];
  expenses_records_add_btn: string;
  expenses_records_empty_title: string;
  expenses_records_empty_desc: string;

  // --- Expense Budgets ---
  expense_budgets_title: string;
  expense_budgets_subtitle: string;
  expense_budgets_guidance: string[];
  expense_budgets_add_btn: string;
  expense_budgets_empty_title: string;
  expense_budgets_empty_desc: string;

  // --- Dashboard & Analytics ---
  expenses_dashboard_title: string;
  expenses_dashboard_subtitle: string;
}

const school: ExpensesContentKeys = {
  expense_categories_title: "School Expense Categories",
  expense_categories_subtitle: "Configure categories to classify school-wide expenses (e.g., Staff Salary, Utilities, Library Books).",
  expense_categories_guidance: [
    "Expense categories help you analyze where school funds are allocated.",
    "Ensure status is active to log expenses under a category.",
  ],
  expense_categories_add_btn: "New Category",
  expense_categories_empty_title: "No Categories Found",
  expense_categories_empty_desc: "Get started by creating your first school expense category.",

  expenses_records_title: "School Expenses & Approvals",
  expenses_records_subtitle: "Log daily outflows, upload receipts, and manage multi-level approval workflows.",
  expenses_records_guidance: [
    "Logged expenses remain as Pending until reviewed and approved by an Administrator.",
    "Attachments like invoice copies can be uploaded for financial audits.",
  ],
  expenses_records_add_btn: "Log Expense",
  expenses_records_empty_title: "No Expenses Logged",
  expenses_records_empty_desc: "Record your daily school expenses to track outflow history.",

  expense_budgets_title: "School Expense Budgets",
  expense_budgets_subtitle: "Allocate budget limits for expense categories per academic session.",
  expense_budgets_guidance: [
    "Defining budgets helps in monitoring financial health and flags high expenditures.",
    "Warnings are triggered on logging if a category expense exceeds its alert threshold.",
  ],
  expense_budgets_add_btn: "Set Budget",
  expense_budgets_empty_title: "No Budgets Configured",
  expense_budgets_empty_desc: "Set budget limits for this academic session to avoid over-expenditure.",

  expenses_dashboard_title: "School Expenses Dashboard",
  expenses_dashboard_subtitle: "Visual analysis of school expense categories, monthly trend analysis, and budget utilization.",
};

const college: ExpensesContentKeys = {
  expense_categories_title: "College Expense Categories",
  expense_categories_subtitle: "Configure categories to classify college-wide expenses (e.g., Faculty Salary, Lab Equipment, Marketing).",
  expense_categories_guidance: [
    "Expense categories help you analyze where college funds are allocated.",
    "Ensure status is active to log expenses under a category.",
  ],
  expense_categories_add_btn: "New Category",
  expense_categories_empty_title: "No Categories Found",
  expense_categories_empty_desc: "Get started by creating your first college expense category.",

  expenses_records_title: "College Expenses & Approvals",
  expenses_records_subtitle: "Log daily outflows, upload receipts, and manage multi-level approval workflows.",
  expenses_records_guidance: [
    "Logged expenses remain as Pending until reviewed and approved by an Administrator.",
    "Attachments like invoice copies can be uploaded for financial audits.",
  ],
  expenses_records_add_btn: "Log Expense",
  expenses_records_empty_title: "No Expenses Logged",
  expenses_records_empty_desc: "Record your daily college expenses to track outflow history.",

  expense_budgets_title: "College Expense Budgets",
  expense_budgets_subtitle: "Allocate budget limits for expense categories per academic session.",
  expense_budgets_guidance: [
    "Defining budgets helps in monitoring financial health and flags high expenditures.",
    "Warnings are triggered on logging if a category expense exceeds its alert threshold.",
  ],
  expense_budgets_add_btn: "Set Budget",
  expense_budgets_empty_title: "No Budgets Configured",
  expense_budgets_empty_desc: "Set budget limits for this academic session to avoid over-expenditure.",

  expenses_dashboard_title: "College Expenses Dashboard",
  expenses_dashboard_subtitle: "Visual analysis of college expense categories, monthly trend analysis, and budget utilization.",
};

// Default mappings
export const expensesContent: Record<string, ExpensesContentKeys> = {
  school,
  college,
  coaching: college, // falls back to college vocabulary
  university: college,
};
