<?php

namespace App\Http\Controllers\Api\V1\Expense;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\ExpenseCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseCategoryController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_expense_categories')) {
            return $this->forbidden('You do not have permission to view expense categories.');
        }

        $query = ExpenseCategory::query();

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'expense_category_index'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('create_expense_categories')) {
            return $this->forbidden('You do not have permission to create expense categories.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category = ExpenseCategory::create($validated);
        return $this->created($category, 'Expense category created successfully');
    }

    public function show(Request $request, ExpenseCategory $expense_category): JsonResponse
    {
        if (!$request->user()->hasAbility('view_expense_categories')) {
            return $this->forbidden('You do not have permission to view expense categories.');
        }

        return $this->successWithMap($expense_category, 'expense_category_index');
    }

    public function update(Request $request, ExpenseCategory $expense_category): JsonResponse
    {
        if (!$request->user()->hasAbility('update_expense_categories')) {
            return $this->forbidden('You do not have permission to update expense categories.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $expense_category->update($validated);
        return $this->successWithMap($expense_category, 'expense_category_index', 'Expense category updated successfully');
    }

    public function destroy(Request $request, ExpenseCategory $expense_category): JsonResponse
    {
        if (!$request->user()->hasAbility('delete_expense_categories')) {
            return $this->forbidden('You do not have permission to delete expense categories.');
        }

        if ($expense_category->expenses()->exists()) {
            return $this->error('Cannot delete category that has logged expenses. Remove or reassign expenses first.', 422);
        }

        $expense_category->delete();
        return $this->success(null, 'Expense category deleted successfully');
    }
}
