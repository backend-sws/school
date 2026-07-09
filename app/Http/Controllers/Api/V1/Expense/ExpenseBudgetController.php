<?php

namespace App\Http\Controllers\Api\V1\Expense;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\ExpenseBudget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseBudgetController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_expense_budgets')) {
            return $this->forbidden('You do not have permission to view expense budgets.');
        }

        $query = ExpenseBudget::with(['category', 'session']);

        if ($request->filled('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        if ($request->filled('expense_category_id')) {
            $query->where('expense_category_id', $request->expense_category_id);
        }

        return $this->paginatedWithMap(
            $query->orderBy('id', 'desc')->paginate($request->input('per_page', 15)),
            'expense_budget_index'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('create_expense_budgets')) {
            return $this->forbidden('You do not have permission to create expense budgets.');
        }

        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'session_id' => 'required|exists:academic_sessions,id',
            'amount' => 'required|numeric|min:0.01',
            'alert_threshold' => 'nullable|numeric|min:1|max:100',
        ]);

        // Check uniqueness for (institution_id, expense_category_id, session_id)
        $exists = ExpenseBudget::where('expense_category_id', $validated['expense_category_id'])
            ->where('session_id', $validated['session_id'])
            ->exists();

        if ($exists) {
            return $this->error('A budget for this category and session already exists. Use update instead.', 422);
        }

        $budget = ExpenseBudget::create($validated);
        return $this->created($budget->load(['category', 'session']), 'Budget allocated successfully');
    }

    public function show(Request $request, ExpenseBudget $expense_budget): JsonResponse
    {
        if (!$request->user()->hasAbility('view_expense_budgets')) {
            return $this->forbidden('You do not have permission to view expense budgets.');
        }

        return $this->successWithMap($expense_budget->load(['category', 'session']), 'expense_budget_index');
    }

    public function update(Request $request, ExpenseBudget $expense_budget): JsonResponse
    {
        if (!$request->user()->hasAbility('update_expense_budgets')) {
            return $this->forbidden('You do not have permission to update expense budgets.');
        }

        $validated = $request->validate([
            'expense_category_id' => 'sometimes|required|exists:expense_categories,id',
            'session_id' => 'sometimes|required|exists:academic_sessions,id',
            'amount' => 'sometimes|required|numeric|min:0.01',
            'alert_threshold' => 'nullable|numeric|min:1|max:100',
        ]);

        // Check unique constraint if changing session or category
        $catId = $validated['expense_category_id'] ?? $expense_budget->expense_category_id;
        $sessId = $validated['session_id'] ?? $expense_budget->session_id;

        if ($catId != $expense_budget->expense_category_id || $sessId != $expense_budget->session_id) {
            $exists = ExpenseBudget::where('expense_category_id', $catId)
                ->where('session_id', $sessId)
                ->where('id', '!=', $expense_budget->id)
                ->exists();

            if ($exists) {
                return $this->error('A budget for this category and session already exists.', 422);
            }
        }

        $expense_budget->update($validated);
        return $this->successWithMap($expense_budget->load(['category', 'session']), 'expense_budget_index', 'Budget updated successfully');
    }

    public function destroy(Request $request, ExpenseBudget $expense_budget): JsonResponse
    {
        if (!$request->user()->hasAbility('delete_expense_budgets')) {
            return $this->forbidden('You do not have permission to delete expense budgets.');
        }

        $expense_budget->delete();
        return $this->success(null, 'Budget allocation deleted successfully');
    }
}
