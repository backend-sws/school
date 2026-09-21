<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\InventoryPurchase;
use App\Models\InventoryVendor;
use App\Models\InventoryVendorSettlement;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryVendorController extends BaseController
{
    use BelongsToDefaultInstitution;

    // ── List Vendors ──────────────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('Permission denied.');
        }

        $institutionId = self::getActiveInstitutionId($request->user());

        $query = InventoryVendor::where('institution_id', $institutionId)
            ->withCount('purchases as total_purchases')
            ->withSum(['purchases as total_purchases_amount' => function ($q) {
                $q->whereIn('payment_status', ['credit', 'settled', 'paid']);
            }], 'total_cost')
            ->withSum(['purchases as credit_amount' => function ($q) {
                $q->where('payment_status', 'credit');
            }], 'total_cost')
            ->withSum('settlements as settled_amount', 'amount');

        if ($request->filled('search')) {
            $s = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(name) LIKE ?', [$s])
                  ->orWhereRaw('LOWER(city) LIKE ?', [$s])
                  ->orWhereRaw('LOWER(contact_name) LIKE ?', [$s])
                  ->orWhereRaw('LOWER(contact_phone) LIKE ?', [$s]);
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        $vendors = $query->orderBy('name')
            ->paginate($request->input('per_page', 20));

        // Compute outstanding_balance in PHP
        $vendors->getCollection()->transform(function ($v) {
            $v->outstanding_balance = max(0, (float) $v->credit_amount - (float) $v->settled_amount);
            return $v;
        });

        return $this->paginatedWithMap($vendors, 'passthrough');
    }

    // ── Create Vendor ─────────────────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_items')) {
            return $this->forbidden('Permission denied.');
        }

        $institutionId = self::getActiveInstitutionId($request->user());

        $validated = $request->validate([
            'name'            => 'required|string|max:200',
            'contact_name'    => 'nullable|string|max:150',
            'contact_phone'   => 'nullable|string|max:50',
            'contact_email'   => 'nullable|email|max:100',
            'location'        => 'nullable|string|max:300',
            'city'            => 'nullable|string|max:100',
            'state'           => 'nullable|string|max:100',
            'pincode'         => 'nullable|string|max:20',
            'gstin'           => 'nullable|string|max:50',
            'pan'             => 'nullable|string|max:50',
            'bank_name'       => 'nullable|string|max:150',
            'bank_account_no' => 'nullable|string|max:100',
            'bank_ifsc'       => 'nullable|string|max:50',
            'credit_limit'    => 'nullable|numeric|min:0',
            'payment_terms'   => 'nullable|string|max:50',
            'is_active'       => 'nullable|boolean',
            'notes'           => 'nullable|string',
        ]);

        $validated['institution_id'] = $institutionId;
        $validated['created_by']     = $request->user()->id;

        $vendor = InventoryVendor::create($validated);

        return $this->created($vendor, 'Inventory supplier created successfully.');
    }

    // ── Show Single Vendor ────────────────────────────────────────────────
    public function show(Request $request, InventoryVendor $inventory_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('Permission denied.');
        }

        $inventory_vendor->load(['creator']);
        $inventory_vendor->outstanding_balance = $inventory_vendor->outstanding_balance;
        $inventory_vendor->total_credit        = $inventory_vendor->total_credit;
        $inventory_vendor->total_purchases_amount = $inventory_vendor->total_purchases_amount;

        return $this->successWithMap($inventory_vendor, 'passthrough');
    }

    // ── Update Vendor ─────────────────────────────────────────────────────
    public function update(Request $request, InventoryVendor $inventory_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_items') && ! $request->user()->hasAbility('update_inventory_items')) {
            return $this->forbidden('Permission denied.');
        }

        $validated = $request->validate([
            'name'            => 'sometimes|required|string|max:200',
            'contact_name'    => 'nullable|string|max:150',
            'contact_phone'   => 'nullable|string|max:50',
            'contact_email'   => 'nullable|email|max:100',
            'location'        => 'nullable|string|max:300',
            'city'            => 'nullable|string|max:100',
            'state'           => 'nullable|string|max:100',
            'pincode'         => 'nullable|string|max:20',
            'gstin'           => 'nullable|string|max:50',
            'pan'             => 'nullable|string|max:50',
            'bank_name'       => 'nullable|string|max:150',
            'bank_account_no' => 'nullable|string|max:100',
            'bank_ifsc'       => 'nullable|string|max:50',
            'credit_limit'    => 'nullable|numeric|min:0',
            'payment_terms'   => 'nullable|string|max:50',
            'is_active'       => 'nullable|boolean',
            'notes'           => 'nullable|string',
        ]);

        $inventory_vendor->update($validated);

        return $this->successWithMap($inventory_vendor->fresh(), 'passthrough', 'Supplier updated successfully.');
    }

    // ── Delete Vendor ─────────────────────────────────────────────────────
    public function destroy(Request $request, InventoryVendor $inventory_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_inventory_items')) {
            return $this->forbidden('Permission denied.');
        }

        if ($inventory_vendor->purchases()->exists()) {
            return $this->error('Cannot delete supplier with existing purchase records.', 422);
        }

        $inventory_vendor->delete();

        return $this->success(null, 'Supplier deleted successfully.');
    }

    // ── Vendor Ledger (Credit Purchases + Settlements) ────────────────────
    public function ledger(Request $request, InventoryVendor $inventory_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('Permission denied.');
        }

        // Purchases from this vendor
        $purchaseQuery = InventoryPurchase::where('inventory_vendor_id', $inventory_vendor->id)
            ->with(['purchasedBy:id,name', 'lines.item:id,name,code,unit'])
            ->orderBy('purchased_at', 'desc')
            ->orderBy('id', 'desc');

        if ($request->filled('payment_status')) {
            $purchaseQuery->where('payment_status', $request->payment_status);
        }
        if ($request->filled('from_date')) {
            $purchaseQuery->whereDate('purchased_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $purchaseQuery->whereDate('purchased_at', '<=', $request->to_date);
        }

        $purchases = $purchaseQuery->get();

        // Settlement history
        $settlements = InventoryVendorSettlement::where('inventory_vendor_id', $inventory_vendor->id)
            ->with(['creator:id,name'])
            ->orderBy('settlement_date', 'desc')
            ->get();

        $totalCredit    = $purchases->whereIn('payment_status', ['credit', 'settled'])->sum('total_cost');
        $totalPaid      = $purchases->where('payment_status', 'paid')->sum('total_cost');
        $totalSettled   = $settlements->sum('amount');
        $outstanding    = max(0, (float) $purchases->where('payment_status', 'credit')->sum('total_cost') - (float) $totalSettled);

        return $this->success([
            'vendor'      => $inventory_vendor,
            'purchases'   => $purchases,
            'settlements' => $settlements,
            'summary'     => [
                'total_credit'      => round($totalCredit, 2),
                'total_paid_direct' => round($totalPaid, 2),
                'total_settled'     => round($totalSettled, 2),
                'outstanding'       => round($outstanding, 2),
            ],
        ], 'Ledger loaded.');
    }

    // ── Record a Settlement Payment ───────────────────────────────────────
    public function settle(Request $request, InventoryVendor $inventory_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_items') && ! $request->user()->hasAbility('update_inventory_items')) {
            return $this->forbidden('Permission denied.');
        }

        $validated = $request->validate([
            'settlement_date'  => 'required|date',
            'amount'           => 'required|numeric|gt:0',
            'payment_mode'     => 'required|string|in:cash,upi,bank_transfer,cheque,neft,rtgs',
            'reference_number' => 'nullable|string|max:100',
            'notes'            => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $institutionId = self::getActiveInstitutionId($request->user());

            // 1. Auto-create Expense entry for actual cash/bank outflow
            $expenseId = null;
            $expenseCat = $this->getOrCreateInventoryExpenseCategory($institutionId);
            if ($expenseCat && $validated['amount'] > 0) {
                $expense = Expense::create([
                    'institution_id'      => $institutionId,
                    'expense_category_id' => $expenseCat->id,
                    'title'               => "Inventory Supplier Settlement — {$inventory_vendor->name}",
                    'amount'              => $validated['amount'],
                    'date'                => $validated['settlement_date'],
                    'payment_mode'        => $validated['payment_mode'],
                    'reference_no'        => $validated['reference_number'] ?? null,
                    'payee'               => $inventory_vendor->name,
                    'description'         => $validated['notes'] ?? "Credit purchase settlement for {$inventory_vendor->name}",
                    'status'              => 'approved',
                    'recorded_by'         => $request->user()->id,
                ]);
                $expenseId = $expense->id;
            }

            // 2. Create settlement record
            $settlement = InventoryVendorSettlement::create([
                'institution_id'      => $institutionId,
                'inventory_vendor_id' => $inventory_vendor->id,
                'settlement_date'     => $validated['settlement_date'],
                'amount'              => $validated['amount'],
                'payment_mode'        => $validated['payment_mode'],
                'reference_number'    => $validated['reference_number'] ?? null,
                'notes'               => $validated['notes'] ?? null,
                'created_by'          => $request->user()->id,
                'expense_id'          => $expenseId,
            ]);

            // 3. Mark oldest unpaid credit purchases as 'settled' up to the paid amount
            $remaining = (float) $validated['amount'];
            $creditPurchases = InventoryPurchase::where('inventory_vendor_id', $inventory_vendor->id)
                ->where('payment_status', 'credit')
                ->orderBy('purchased_at', 'asc')
                ->orderBy('id', 'asc')
                ->get();

            $markedCount = 0;
            foreach ($creditPurchases as $purchase) {
                if ($remaining <= 0) break;
                $purchase->update([
                    'payment_status'                  => 'settled',
                    'inventory_vendor_settlement_id' => $settlement->id,
                    'settled_at'                      => now(),
                ]);
                $remaining -= (float) $purchase->total_cost;
                $markedCount++;
            }

            DB::commit();

            return $this->created(
                $settlement->load('vendor'),
                "Settlement recorded successfully. {$markedCount} purchase bill(s) marked as settled."
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error('Settlement failed: ' . $e->getMessage(), 500);
        }
    }

    private function getOrCreateInventoryExpenseCategory(int $institutionId): ?ExpenseCategory
    {
        $cat = ExpenseCategory::where('institution_id', $institutionId)
            ->whereRaw('LOWER(name) = ?', ['inventory'])
            ->first();

        if (! $cat) {
            $cat = ExpenseCategory::firstOrCreate(
                ['institution_id' => $institutionId, 'name' => 'Inventory'],
                ['description' => 'Inventory items purchase and procurement expenses']
            );
        }

        return $cat;
    }
}
