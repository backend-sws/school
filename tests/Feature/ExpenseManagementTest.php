<?php

namespace Tests\Feature;

use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\ExpenseBudget;
use App\Models\Session as AcademicSession;
use App\Models\User;
use App\Models\Workflow;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class ExpenseManagementTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    protected $admin;
    protected $clerk;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();

        $institutionId = $this->defaultInstitutionId();

        // Admin has super-set of abilities
        $this->admin = $this->createUserWithRole('institution_admin');
        $this->admin->update([
            'institution_id' => $institutionId,
            'status' => 1,
        ]);

        // Clerk has staff role scoped to the institution
        $this->clerk = $this->createUserWithRole('staff');
        $this->clerk->update([
            'institution_id' => $institutionId,
            'status' => 1,
        ]);

        // Attach the expense_tracker workflow to both users for the institution
        $workflow = Workflow::withoutGlobalScope('institution_scope')
            ->where('key', 'expense_tracker')
            ->firstOrFail();

        $this->admin->workflows()->attach($workflow->id, [
            'institution_id' => $institutionId,
        ]);

        $this->clerk->workflows()->attach($workflow->id, [
            'institution_id' => $institutionId,
        ]);

        // Grant clerk view_dashboard to satisfy the parent Route::middleware('ensure-permission-group:admin_desk') group
        $dashboardPerm = \App\Models\Permission::where('key', 'view_dashboard')->firstOrFail();
        $this->clerk->permissionOverrides()->attach($dashboardPerm->id, [
            'granted' => true,
            'institution_id' => $institutionId,
        ]);
    }

    #[Test]
    public function admin_can_manage_expense_categories()
    {
        // 1. Create category
        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/expense-categories', [
                'name' => 'Utilities Payment',
                'code' => 'UTIL',
                'description' => 'Electricity and Water bills',
                'is_active' => true,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Utilities Payment');

        $categoryId = $response->json('data.id');

        // 2. List categories
        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/expense-categories');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // 3. Update category
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/expense-categories/{$categoryId}", [
                'name' => 'Utilities Updated',
                'is_active' => true,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Utilities Updated');
    }

    #[Test]
    public function user_can_log_expense_and_admin_can_approve()
    {
        $institutionId = $this->defaultInstitutionId();

        // Setup category
        $category = ExpenseCategory::create([
            'institution_id' => $institutionId,
            'name' => 'IT Support',
            'code' => 'IT',
            'is_active' => true,
        ]);

        // 1. Log expense (starts as pending)
        $response = $this->actingAs($this->clerk)
            ->postJson('/api/v1/expenses', [
                'expense_category_id' => $category->id,
                'title' => 'Software License Subscription',
                'amount' => 1500.00,
                'date' => '2026-07-08',
                'payment_mode' => 'Bank Transfer',
                'payee' => 'Microsoft Corp',
            ]);

        $response->assertStatus(201);
        $expenseId = $response->json('data.expense.id');
        $this->assertEquals('pending', $response->json('data.expense.status'));

        // 2. Approve expense
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/expenses/{$expenseId}/approve");

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'approved')
            ->assertJsonPath('data.approved_by.id', $this->admin->id);
    }

    #[Test]
    public function budget_exceeded_warning_returns_on_store()
    {
        $institutionId = $this->defaultInstitutionId();

        // 1. Setup Session
        $session = AcademicSession::create([
            'institution_id' => $institutionId,
            'name' => '2026-2027',
            'start_year' => 2026,
            'end_year' => 2027,
            'is_current' => true,
            'status' => 1,
        ]);

        // 2. Setup Category
        $category = ExpenseCategory::create([
            'institution_id' => $institutionId,
            'name' => 'Lab Supplies',
            'code' => 'LAB',
            'is_active' => true,
        ]);

        // 3. Setup Budget Limit
        ExpenseBudget::create([
            'institution_id' => $institutionId,
            'expense_category_id' => $category->id,
            'session_id' => $session->id,
            'amount' => 1000.00,
            'alert_threshold' => 90.00,
        ]);

        // 4. Create an expense exceeding budget limit
        $response = $this->actingAs($this->clerk)
            ->postJson('/api/v1/expenses', [
                'expense_category_id' => $category->id,
                'title' => 'Chemistry Chemicals Purchase',
                'amount' => 1200.00, // Exceeds budget of 1000
                'date' => '2026-07-08',
                'payment_mode' => 'Cash',
            ]);

        $response->assertStatus(201);
        $this->assertNotNull($response->json('data.warning'));
        $this->assertStringContainsString('exceeds the budget limit', $response->json('data.warning'));
    }
}
