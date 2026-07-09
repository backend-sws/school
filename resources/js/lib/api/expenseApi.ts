import api from "./api";
import type { ExpenseCategoryFormData, ExpenseFormData, ExpenseBudgetFormData } from "@/lib/validations/expense";

const expenseApi = {
  // Categories
  categoriesIndex: (params?: Record<string, unknown>) => api.get("/expense-categories", { params }),
  categoriesShow: (id: number) => api.get(`/expense-categories/${id}`),
  categoriesStore: (data: ExpenseCategoryFormData) => api.post("/expense-categories", data),
  categoriesUpdate: (id: number, data: ExpenseCategoryFormData) => api.put(`/expense-categories/${id}`, data),
  categoriesDestroy: (id: number) => api.delete(`/expense-categories/${id}`),

  // Expenses
  expensesIndex: (params?: Record<string, unknown>) => api.get("/expenses", { params }),
  expensesShow: (id: number) => api.get(`/expenses/${id}`),
  expensesStore: (data: ExpenseFormData) => api.post("/expenses", data),
  expensesUpdate: (id: number, data: ExpenseFormData) => api.put(`/expenses/${id}`, data),
  expensesDestroy: (id: number) => api.delete(`/expenses/${id}`),
  expensesApprove: (id: number) => api.post(`/expenses/${id}/approve`),
  expensesReject: (id: number, reason: string) => api.post(`/expenses/${id}/reject`, { rejection_reason: reason }),
  expensesAnalytics: (params?: Record<string, unknown>) => api.get("/expenses/analytics", { params }),

  // Budgets
  budgetsIndex: (params?: Record<string, unknown>) => api.get("/expense-budgets", { params }),
  budgetsShow: (id: number) => api.get(`/expense-budgets/${id}`),
  budgetsStore: (data: ExpenseBudgetFormData) => api.post("/expense-budgets", data),
  budgetsUpdate: (id: number, data: ExpenseBudgetFormData) => api.put(`/expense-budgets/${id}`, data),
  budgetsDestroy: (id: number) => api.delete(`/expense-budgets/${id}`),
};

export default expenseApi;
