<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\InventorySale;
use App\Services\FinancialDocuments\AssembleInventoryReceipt;
use App\Services\FinancialDocuments\FinancialPdfRenderer;
use App\Services\InventorySaleService;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class InventorySaleController extends BaseController
{
    public function __construct(
        protected InventorySaleService $saleService,
        protected \App\Services\InstitutionBrandingService $brandingService,
        protected AssembleInventoryReceipt $assembleInventoryReceipt,
        protected FinancialPdfRenderer $financialPdfRenderer,
    ) {}

    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_sales')) {
            return $this->forbidden('You do not have permission to view inventory sales.');
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId === null) {
            return $this->error('Active institution context is required.', 400);
        }

        $query = InventorySale::query()
            ->with(['lines.item', 'feePayment', 'user'])
            ->where('institution_id', $institutionId);

        // 1. Payment Status
        if ($request->filled('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // 2. Buyer Type
        if ($request->filled('buyer_type') && $request->buyer_type !== 'all') {
            $query->where('buyer_type', $request->buyer_type);
        }

        // 3. User ID
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // 4. Date Range
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // 5. Amount range
        if ($request->filled('min_amount')) {
            $query->where('total_amount', '>=', $request->min_amount);
        }
        if ($request->filled('max_amount')) {
            $query->where('total_amount', '<=', $request->max_amount);
        }

        // 6. Specific Item ID
        if ($request->filled('inventory_item_id') && $request->inventory_item_id !== 'all') {
            $itemId = $request->inventory_item_id;
            $query->whereHas('lines', function($q) use ($itemId) {
                $q->where('inventory_item_id', $itemId);
            });
        }

        // 7. Search Group (Search by buyer name or student user name)
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(buyer_name) LIKE ?', [$search])
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->whereRaw('LOWER(name) LIKE ?', [$search]);
                  });
            });
        }

        // Calculate dynamic stats before pagination
        $statsQuery = clone $query;
        $totalSales = $statsQuery->count();
        $totalRevenue = $statsQuery->sum('total_amount');
        
        $paidQuery = clone $query;
        $totalPaid = $paidQuery->where('payment_status', 'paid')->sum('total_amount');
        
        $pendingQuery = clone $query;
        $totalPending = $pendingQuery->where('payment_status', 'pending')->sum('total_amount');

        $stats = [
            'total_sales_count' => (int) $totalSales,
            'total_revenue' => (float) $totalRevenue,
            'total_paid' => (float) $totalPaid,
            'total_pending' => (float) $totalPending,
        ];

        $paginator = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'stats' => $stats,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_sales')) {
            return $this->forbidden('You do not have permission to create inventory sales.');
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId === null) {
            return $this->error('Active institution context is required.', 400);
        }

        $validated = $request->validate([
            'buyer_type' => 'required|string|in:student,parent,other',
            'user_id' => 'nullable|integer|exists:users,id',
            'buyer_name' => 'nullable|string|max:200',
            'lines' => 'required|array|min:1',
            'lines.*.inventory_item_id' => 'required|integer',
            'lines.*.quantity' => 'required|numeric|min:0.001',
            'lines.*.unit_price' => 'required|numeric|min:0',
            'remarks' => 'nullable|string|max:500',
        ]);

        try {
            $sale = $this->saleService->createSale(
                $validated['lines'],
                $validated['buyer_type'],
                $validated['user_id'] ?? null,
                $validated['buyer_name'] ?? null,
                $validated['remarks'] ?? null,
                $institutionId,
                $request->user()->id
            );
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        return $this->created([
            'sale' => $sale,
            'fee_payment_id' => $sale->fee_payment_id,
        ], 'Sale created. Collect payment to complete.');
    }

    public function show(Request $request, InventorySale $inventory_sale): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_sales')) {
            return $this->forbidden('You do not have permission to view inventory sales.');
        }

        $inventory_sale->load(['lines.item', 'feePayment', 'user', 'collectedBy']);

        return $this->successWithMap($inventory_sale, 'passthrough');
    }

    public function confirm(Request $request, InventorySale $inventory_sale): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_sales')) {
            return $this->forbidden('You do not have permission to confirm sales.');
        }

        $feePayment = $inventory_sale->feePayment;
        if (! $feePayment) {
            return $this->error('Sale has no linked payment.', 400);
        }

        if ($feePayment->payment_status !== 'paid') {
            $request->validate([
                'payment_mode' => 'nullable|string|max:50',
                'transaction_id' => 'nullable|string|max:100',
                'amount' => 'required|numeric|min:0.01',
                'cash_amount' => 'nullable|numeric|min:0',
                'online_amount' => 'nullable|numeric|min:0',
            ]);

            $payAmount = (float) $request->input('amount');
            $saleTotal = (float) $inventory_sale->total_amount;

            // Optional: validate it matches the sale total exactly, or at least doesn't exceed it.
            // Since it's a direct POS sale, we expect full payment.
            if (round($payAmount, 2) > round($saleTotal, 2)) {
                return $this->error('Payment amount cannot be greater than the sale total amount.', 422);
            }
            if (round($payAmount, 2) < round($saleTotal, 2)) {
                return $this->error('Partial payments are not supported for inventory sales. Please pay the full amount.', 422);
            }

            $feePayment->update([
                'payment_status' => 'paid',
                'payment_date' => now(),
                'collected_by' => $request->user()->id,
                'transaction_id' => $request->input('transaction_id', 'CASH-' . time()),
                'payment_mode' => $request->input('payment_mode', 'cash'),
                'amount' => $payAmount,
                'cash_amount' => $request->input('cash_amount', 0),
                'online_amount' => $request->input('online_amount', 0),
            ]);
        }

        $updated = $this->saleService->confirmPayment($feePayment);

        return $this->successWithMap($updated ?? $inventory_sale->fresh(['lines.item', 'feePayment', 'user']), 'passthrough', 'Sale confirmed and stock updated.');
    }

    public function receipt(Request $request, InventorySale $inventory_sale): Response|JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_sales')) {
            return $this->forbidden('You do not have permission to view this receipt.');
        }

        try {
            $inventory_sale->load(['lines.item', 'feePayment', 'user', 'collectedBy']);

            $branding = $this->brandingService->resolve($inventory_sale->institution_id);

            // Buyer Name resolution
            $buyerName = $inventory_sale->buyer_name
                ?? ($inventory_sale->user ? $inventory_sale->user->name : 'Walk-in Customer');

            $document = $this->assembleInventoryReceipt->assemble($inventory_sale, $buyerName);

            $fileName = 'Sale_Receipt_' . $inventory_sale->id . '.pdf';
            if ($inventory_sale->feePayment && $inventory_sale->feePayment->receipt_no) {
                $fileName = 'Receipt_' . $inventory_sale->feePayment->receipt_no . '.pdf';
            }

            return $this->financialPdfRenderer->renderInline($document, $branding, $fileName);

        } catch (\Throwable $e) {
            \Log::error('Inventory sale receipt PDF error: ' . $e->getMessage());
            return $this->error('Unable to generate receipt PDF: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine(), 500);
        }
    }
}
