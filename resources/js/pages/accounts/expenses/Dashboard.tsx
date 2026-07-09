import React, { useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { usePageConfig } from "@/hooks/usePageConfig";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { parsePaginatedResponse } from "@/lib/utils";
import expenseApi from "@/lib/api/expenseApi";
import api from "@/lib/api/api";
import { ExpenseQueryKeys } from "@/lib/querykey/expense";
import {
  BUDGET_PERMISSIONS,
  BUDGET_FORM_FIELDS,
  getBudgetColumns,
  getExpensesBreadcrumbs,
} from "@/constants/expenses/formConfig";
import { expenseBudgetSchema } from "@/lib/validations/expense";
import { ExpenseBudgetDialog } from "@/components/admin/expenseBudgetDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filter-bar";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  IndianRupee,
  Layers,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  Pencil,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const budgetFormDisclosure = useDisclosure<any>();
  const deleteBudgetDisclosure = useDisclosure<any>();

  const { content: CONTENT, breadcrumbs: BREADCRUMBS, columns: COLUMNS, canCreate, canEdit, canDelete } =
    usePageConfig({
      permissions: BUDGET_PERMISSIONS,
      formFields: BUDGET_FORM_FIELDS as any,
      schema: expenseBudgetSchema,
      getContent: (c) => ({
        pageTitle: c.expenses_dashboard_title,
        pageSubtitle: c.expenses_dashboard_subtitle,
        guidance: c.expense_budgets_guidance,
        addBtn: c.expense_budgets_add_btn,
        emptyTitle: c.expense_budgets_empty_title,
        emptyDesc: c.expense_budgets_empty_desc,
      }),
      getBreadcrumbs: getExpensesBreadcrumbs,
      getColumns: getBudgetColumns,
    });

  // Current session/filter state
  const { filter, handleFilter } = useSearchFilter({
    session_id: "",
  });

  // Fetch public sessions
  const { data: sessionsResponse } = useQuery({
    queryKey: ["academic-sessions-public"],
    queryFn: () => api.get("/public/sessions"),
  });
  const sessions = sessionsResponse?.data || [];

  // Determine active session
  const activeSessionId = useMemo(() => {
    if (filter.session_id) return filter.session_id;
    const current = sessions.find((s: any) => s.is_current);
    return current ? String(current.id) : sessions[0] ? String(sessions[0].id) : "";
  }, [filter.session_id, sessions]);

  // Fetch analytics data
  const { data: analyticsResponse, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["expenses-analytics", activeSessionId],
    queryFn: () => expenseApi.expensesAnalytics({ session_id: activeSessionId }),
    enabled: !!activeSessionId,
  });

  const kpis = analyticsResponse?.kpis || { total_approved: 0, total_pending: 0, total_draft: 0 };
  const categoriesDist = analyticsResponse?.category_distribution || [];
  const monthlyTrends = analyticsResponse?.monthly_trends || [];
  const budgetsReport = analyticsResponse?.budget_report || [];

  const deleteBudgetMutation = useMutation({
    mutationFn: (id: number) => expenseApi.budgetsDestroy(id),
    onSuccess: () => {
      toast.success("Budget limit deleted");
      queryClient.invalidateQueries({ queryKey: ["expenses-analytics"] });
      deleteBudgetDisclosure.onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete budget limit");
      deleteBudgetDisclosure.onClose();
    },
  });

  const handleDeleteBudgetConfirm = () => {
    if (deleteBudgetDisclosure.data?.id) {
      deleteBudgetMutation.mutate(deleteBudgetDisclosure.data.id);
    }
  };

  // KPI calculations
  const totalBudgeted = useMemo(() => {
    return budgetsReport.reduce((sum: number, b: any) => sum + b.budgeted, 0);
  }, [budgetsReport]);

  const activeBudgetUtilization = useMemo(() => {
    return totalBudgeted > 0 ? (kpis.total_approved / totalBudgeted) * 100 : 0;
  }, [totalBudgeted, kpis.total_approved]);

  // SVG Chart Computations (Donut Pie Chart)
  const donutChartSegments = useMemo(() => {
    const total = categoriesDist.reduce((sum: number, c: any) => sum + parseFloat(c.total), 0);
    let cumulativePercent = 0;
    const colors = [
      "#6366f1", // indigo
      "#3b82f6", // blue
      "#10b981", // emerald
      "#f59e0b", // amber
      "#ef4444", // red
      "#ec4899", // pink
      "#8b5cf6", // violet
    ];

    return categoriesDist.map((c: any, index: number) => {
      const val = parseFloat(c.total);
      const percent = total > 0 ? (val / total) * 100 : 0;
      const strokeDashoffset = 251.2 - (251.2 * cumulativePercent) / 100;
      cumulativePercent += percent;
      return {
        category: c.category,
        total: val,
        percent,
        color: colors[index % colors.length],
        strokeDashoffset,
        strokeDasharray: `${(251.2 * percent) / 100} 251.2`,
      };
    });
  }, [categoriesDist]);

  // SVG Bar Chart Computations
  const barChartData = useMemo(() => {
    const maxVal = monthlyTrends.reduce((max: number, t: any) => Math.max(max, parseFloat(t.total)), 0) || 1;
    return monthlyTrends.map((t: any) => ({
      month: t.month,
      total: parseFloat(t.total),
      heightPercent: (parseFloat(t.total) / maxVal) * 80, // scale to max 80% height
    }));
  }, [monthlyTrends]);

  return (
    <>
      <Head title={CONTENT.pageTitle} />

      <ExpenseBudgetDialog
        open={budgetFormDisclosure.isOpen}
        onClose={budgetFormDisclosure.onClose}
        budget={budgetFormDisclosure.data}
      />

      <ConfirmDialog
        open={deleteBudgetDisclosure.isOpen}
        onClose={deleteBudgetDisclosure.onClose}
        onConfirm={handleDeleteBudgetConfirm}
        title="Delete Budget Limit"
        description="Are you sure you want to delete this budget limit? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteBudgetMutation.isPending}
      />

      <div className="space-y-6">
          <MainPageHeader
            title={CONTENT.pageTitle}
            subtitle={CONTENT.pageSubtitle}
            guidance={CONTENT.guidance}
          />

          {/* Action Row & Session Switcher */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <select
                className="bg-transparent text-sm font-semibold border-none focus:ring-0 cursor-pointer outline-none text-foreground"
                value={activeSessionId}
                onChange={(e) => handleFilter({ session_id: e.target.value })}
              >
                {sessions.map((s: any) => (
                  <option key={s.id} value={String(s.id)}>
                    Session Year: {s.name} {s.is_current ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/accounts/expenses/records">
                  View Log Records <ArrowRight className="size-4" />
                </Link>
              </Button>
              {canCreate && (
                <Button size="sm" onClick={() => budgetFormDisclosure.onOpen(null)} className="gap-1">
                  <Plus className="size-4" /> {CONTENT.addBtn}
                </Button>
              )}
            </div>
          </div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-indigo-500/5 border-indigo-500/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Total Session Budget</p>
                  <h3 className="text-2xl font-bold text-indigo-600 mt-1">₹{totalBudgeted.toLocaleString('en-IN')}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600">
                  <Layers className="size-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-500/5 border-emerald-500/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Approved Expenses</p>
                  <h3 className="text-2xl font-bold text-emerald-600 mt-1">₹{kpis.total_approved.toLocaleString('en-IN')}</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                  <TrendingUp className="size-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-500/5 border-amber-500/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Pending Expenses</p>
                  <h3 className="text-2xl font-bold text-amber-600 mt-1">₹{kpis.total_pending.toLocaleString('en-IN')}</h3>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
                  <AlertTriangle className="size-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-pink-500/5 border-pink-500/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Budget Utilization</p>
                  <h3 className="text-2xl font-bold text-pink-600 mt-1">{activeBudgetUtilization.toFixed(1)}%</h3>
                </div>
                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-600">
                  <TrendingDown className="size-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphical Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Donut Chart Category Wise */}
            <Card className="lg:col-span-5 h-[400px] flex flex-col justify-between">
              <CardHeader className="pb-2">
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  <PieIcon className="size-5 text-indigo-500" /> Outflow Distribution
                </h3>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
                {donutChartSegments.length > 0 ? (
                  <>
                    <div className="relative size-40 shrink-0">
                      <svg viewBox="0 0 100 100" className="rotate-[-90deg] size-full">
                        {donutChartSegments.map((segment: any, index: number) => (
                          <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth="8"
                            strokeDasharray={segment.strokeDasharray}
                            strokeDashoffset={segment.strokeDashoffset}
                            className="transition-all duration-500"
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">₹{kpis.total_approved > 100000 ? `${(kpis.total_approved / 1000).toFixed(1)}K` : kpis.total_approved.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Approved</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 w-full max-h-[220px] overflow-y-auto pr-1">
                      {donutChartSegments.map((segment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                            <span className="truncate text-muted-foreground" title={segment.category}>
                              {segment.category}
                            </span>
                          </div>
                          <span className="font-semibold text-foreground shrink-0">{segment.percent.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <PieIcon className="size-12 text-muted-foreground/30 mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">No approved expense data for chart</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Trend Bar Chart */}
            <Card className="lg:col-span-7 h-[400px] flex flex-col justify-between">
              <CardHeader className="pb-2">
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  <TrendingUp className="size-5 text-emerald-500" /> Monthly Expense Trend
                </h3>
              </CardHeader>
              <CardContent className="flex-1 flex items-end justify-between gap-2 pt-6 h-[280px]">
                {barChartData.length > 0 ? (
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="flex-1 w-full flex items-end justify-between px-2 gap-3 relative">
                      {/* Bar columns */}
                      {barChartData.map((bar: any, index: number) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded shadow z-10 font-bold whitespace-nowrap">
                            ₹{bar.total.toLocaleString()}
                          </div>
                          <div
                            className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-md group-hover:from-indigo-600 group-hover:to-indigo-500 transition-all duration-300 shadow-sm"
                            style={{ height: `${bar.heightPercent}%` }}
                          />
                          <span className="text-[10px] text-muted-foreground font-semibold">{bar.month.split("-")[1]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 flex justify-between text-[10px] text-muted-foreground px-4">
                      <span>Past 12 Months Outflows</span>
                      <span>(Month Code)</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full text-center py-20">
                    <TrendingUp className="size-12 text-muted-foreground/30 mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">No monthly outflow records found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Budgets Tracking Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="size-5 text-amber-500" /> Session Budget Limits & Alert Tracking
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgetsReport.length > 0 ? (
                <Each
                  of={budgetsReport}
                  render={(budget: any) => {
                    const isExceeded = budget.actual > budget.budgeted;
                    const isWarning = !isExceeded && budget.percentage >= budget.alert_threshold;

                    return (
                      <Card className="border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <CardContent className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-base text-foreground">{budget.category_name}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">Budget Alert Threshold: {budget.alert_threshold}%</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {canEdit && (
                                <button
                                  onClick={() => budgetFormDisclosure.onOpen(budget)}
                                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                >
                                  <Pencil className="size-4" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => deleteBudgetDisclosure.onOpen(budget)}
                                  className="p-1 hover:bg-muted rounded text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Actual Outflow: <strong className="text-foreground">₹{budget.actual.toLocaleString()}</strong></span>
                              <span>Limit: ₹{budget.budgeted.toLocaleString()}</span>
                            </div>

                            {/* Custom progress track bar */}
                            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border shadow-inner">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isExceeded
                                    ? "bg-red-500"
                                    : isWarning
                                    ? "bg-amber-500"
                                    : "bg-indigo-500"
                                }`}
                                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                              />
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-semibold mt-1">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  isExceeded
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : isWarning
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                                }`}
                              >
                                {budget.percentage.toFixed(0)}% Utilized
                              </span>

                              {isExceeded && (
                                <span className="text-red-500 flex items-center gap-0.5">
                                  <AlertTriangle className="size-3.5" /> Budget Exceeded!
                                </span>
                              )}
                              {isWarning && (
                                <span className="text-amber-500 flex items-center gap-0.5">
                                  <AlertTriangle className="size-3.5" /> Near Limit Warning
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }}
                />
              ) : (
                <div className="col-span-2 text-center border-2 border-dashed py-14 rounded-xl">
                  <AlertTriangle className="size-10 text-muted-foreground/30 mx-auto" />
                  <h3 className="font-bold text-sm text-foreground mt-2">{CONTENT.emptyTitle}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{CONTENT.emptyDesc}</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
