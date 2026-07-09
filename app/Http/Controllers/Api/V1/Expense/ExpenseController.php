<?php

namespace App\Http\Controllers\Api\V1\Expense;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\ExpenseBudget;
use App\Models\Session as AcademicSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_expenses')) {
            return $this->forbidden('You do not have permission to view expenses.');
        }

        $query = Expense::with(['category', 'recordedBy', 'approvedBy']);

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(COALESCE(payee, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->filled('expense_category_id')) {
            $query->where('expense_category_id', $request->expense_category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_mode')) {
            $query->where('payment_mode', $request->payment_mode);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('date', '<=', $request->end_date);
        }

        return $this->paginatedWithMap(
            $query->orderBy('date', 'desc')->paginate($request->input('per_page', 15)),
            'expense_index'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('create_expenses')) {
            return $this->forbidden('You do not have permission to create expenses.');
        }

        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'title' => 'required|string|max:200',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'payment_mode' => 'required|string|max:50',
            'reference_no' => 'nullable|string|max:100',
            'payee' => 'nullable|string|max:150',
            'description' => 'nullable|string',
            'attachment' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:draft,pending',
        ]);

        $validated['recorded_by'] = $request->user()->id;
        if (!isset($validated['status'])) {
            $validated['status'] = 'pending';
        }

        // Optional Budget validation: check if the expense exceeds the set budget for the current session
        $currentSessionId = AcademicSession::where('is_current', true)->value('id');
        $warning = null;
        if ($currentSessionId) {
            $budget = ExpenseBudget::where('expense_category_id', $validated['expense_category_id'])
                ->where('session_id', $currentSessionId)
                ->first();

            if ($budget) {
                $alreadySpent = Expense::where('expense_category_id', $validated['expense_category_id'])
                    ->where('status', 'approved')
                    ->whereYear('date', date('Y', strtotime($validated['date']))) // basic session year estimate
                    ->sum('amount');

                if (($alreadySpent + $validated['amount']) > $budget->amount) {
                    $warning = "Warning: This expense exceeds the budget limit of " . number_format($budget->amount, 2) . " for this category.";
                }
            }
        }

        $expense = Expense::create($validated);
        $expense->load(['category', 'recordedBy']);

        return $this->created([
            'expense' => $expense,
            'warning' => $warning
        ], 'Expense logged successfully');
    }

    public function show(Request $request, Expense $expense): JsonResponse
    {
        if (!$request->user()->hasAbility('view_expenses')) {
            return $this->forbidden('You do not have permission to view expenses.');
        }

        return $this->successWithMap($expense->load(['category', 'recordedBy', 'approvedBy']), 'expense_index');
    }

    public function update(Request $request, Expense $expense): JsonResponse
    {
        if (!$request->user()->hasAbility('update_expenses')) {
            return $this->forbidden('You do not have permission to update expenses.');
        }

        if (in_array($expense->status, ['approved', 'rejected'])) {
            return $this->error('Cannot update an expense that has already been approved or rejected.', 422);
        }

        $validated = $request->validate([
            'expense_category_id' => 'sometimes|required|exists:expense_categories,id',
            'title' => 'sometimes|required|string|max:200',
            'amount' => 'sometimes|required|numeric|min:0.01',
            'date' => 'sometimes|required|date',
            'payment_mode' => 'sometimes|required|string|max:50',
            'reference_no' => 'nullable|string|max:100',
            'payee' => 'nullable|string|max:150',
            'description' => 'nullable|string',
            'attachment' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:draft,pending',
        ]);

        $expense->update($validated);
        return $this->successWithMap($expense->load(['category', 'recordedBy']), 'expense_index', 'Expense updated successfully');
    }

    public function destroy(Request $request, Expense $expense): JsonResponse
    {
        if (!$request->user()->hasAbility('delete_expenses')) {
            return $this->forbidden('You do not have permission to delete expenses.');
        }

        if ($expense->status === 'approved') {
            return $this->error('Cannot delete an approved expense.', 422);
        }

        $expense->delete();
        return $this->success(null, 'Expense deleted successfully');
    }

    public function approve(Request $request, Expense $expense): JsonResponse
    {
        if (!$request->user()->hasAbility('approve_expenses')) {
            return $this->forbidden('You do not have permission to approve expenses.');
        }

        if ($expense->status === 'approved') {
            return $this->error('Expense is already approved.', 422);
        }

        $expense->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'rejection_reason' => null
        ]);

        return $this->successWithMap($expense->load(['category', 'recordedBy', 'approvedBy']), 'expense_index', 'Expense approved successfully');
    }

    public function reject(Request $request, Expense $expense): JsonResponse
    {
        if (!$request->user()->hasAbility('approve_expenses')) {
            return $this->forbidden('You do not have permission to reject expenses.');
        }

        if ($expense->status === 'approved') {
            return $this->error('Cannot reject an already approved expense.', 422);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000'
        ]);

        $expense->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'rejection_reason' => $validated['rejection_reason']
        ]);

        return $this->successWithMap($expense->load(['category', 'recordedBy', 'approvedBy']), 'expense_index', 'Expense rejected successfully');
    }

    public function analytics(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_expenses')) {
            return $this->forbidden('You do not have permission to view expense analytics.');
        }

        $sessionId = $request->input('session_id') ?? AcademicSession::where('is_current', true)->value('id');
        if (!$sessionId) {
            $sessionId = AcademicSession::orderBy('start_year', 'desc')->value('id');
        }

        // 1. KPI Summaries
        $totalApproved = Expense::where('status', 'approved')->sum('amount');
        $totalPending = Expense::where('status', 'pending')->sum('amount');
        $totalDraft = Expense::where('status', 'draft')->sum('amount');

        // 2. Category distribution (all-time approved)
        $categorySums = DB::table('expenses')
            ->join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->select('expense_categories.name as category', DB::raw('SUM(expenses.amount) as total'))
            ->where('expenses.status', 'approved')
            ->groupBy('expense_categories.name')
            ->get();

        $isPgsql = DB::connection()->getDriverName() === 'pgsql';
        $dateExpression = $isPgsql ? "TO_CHAR(date, 'YYYY-MM')" : "DATE_FORMAT(date, '%Y-%m')";

        // 3. Monthly Trends (approved, last 12 months)
        $monthlyTrends = DB::table('expenses')
            ->select(
                DB::raw("{$dateExpression} as month"),
                DB::raw('SUM(amount) as total')
            )
            ->where('status', 'approved')
            ->where('date', '>=', now()->subMonths(11)->startOfMonth())
            ->groupByRaw($dateExpression)
            ->orderBy('month', 'asc')
            ->get();

        // 4. Budget vs Actuals for selected session
        $budgets = ExpenseBudget::with('category')
            ->where('session_id', $sessionId)
            ->get();

        // Approximate session dates for expense summing
        $session = AcademicSession::find($sessionId);
        $startDate = $session ? $session->start_year . '-04-01' : date('Y') . '-04-01'; // typical financial year start
        $endDate = $session ? $session->end_year . '-03-31' : (date('Y') + 1) . '-03-31';

        $budgetReport = $budgets->map(function ($budget) use ($startDate, $endDate) {
            $actual = Expense::where('expense_category_id', $budget->expense_category_id)
                ->where('status', 'approved')
                ->whereBetween('date', [$startDate, $endDate])
                ->sum('amount');

            return [
                'id' => $budget->id,
                'category_id' => $budget->expense_category_id,
                'category_name' => $budget->category->name ?? 'Unknown',
                'budgeted' => (float)$budget->amount,
                'actual' => (float)$actual,
                'percentage' => $budget->amount > 0 ? round(($actual / $budget->amount) * 100, 2) : 0,
                'alert_threshold' => (float)$budget->alert_threshold,
            ];
        });

        return response()->json([
            'kpis' => [
                'total_approved' => (float)$totalApproved,
                'total_pending' => (float)$totalPending,
                'total_draft' => (float)$totalDraft,
            ],
            'category_distribution' => $categorySums,
            'monthly_trends' => $monthlyTrends,
            'budget_report' => $budgetReport,
            'session' => $session
        ]);
    }
}
