export const ExpenseQueryKeys = {
  categoriesAll: ["expense-categories"] as const,
  categoriesList: (filters?: Record<string, unknown>) => ["expense-categories", filters] as const,
  categoriesDetail: (id: number) => ["expense-categories", id] as const,

  expensesAll: ["expenses"] as const,
  expensesList: (filters?: Record<string, unknown>) => ["expenses", filters] as const,
  expensesDetail: (id: number) => ["expenses", id] as const,
  expensesAnalytics: (filters?: Record<string, unknown>) => ["expenses-analytics", filters] as const,

  budgetsAll: ["expense-budgets"] as const,
  budgetsList: (filters?: Record<string, unknown>) => ["expense-budgets", filters] as const,
  budgetsDetail: (id: number) => ["expense-budgets", id] as const,
};
