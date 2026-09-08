<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\InventoryItem;
use App\Models\InventoryIssue;
use App\Models\InventoryMovement;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryIssueController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_movements')) {
            return $this->forbidden('You do not have permission to view issues.');
        }

        $query = InventoryIssue::query()
            ->with(['item', 'issuedToUser', 'issuedBy'])
            ->orderBy('issued_at', 'desc')
            ->orderBy('id', 'desc');

        // Filter by item
        if ($request->filled('item_id')) {
            $query->where('inventory_item_id', $request->item_id);
        }

        // Filter by staff (issued_to)
        if ($request->filled('issued_to_user_id')) {
            $query->where('issued_to_user_id', $request->issued_to_user_id);
        }

        // Filter by department
        if ($request->filled('department')) {
            $query->where('department', 'like', '%' . $request->department . '%');
        }

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('issued_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('issued_at', '<=', $request->to_date);
        }

        // Search by issued_to_name or purpose
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(COALESCE(issued_to_name, \'\')) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(COALESCE(purpose, \'\')) LIKE ?', [$search])
                  ->orWhereHas('issuedToUser', fn($uq) => $uq->whereRaw('LOWER(name) LIKE ?', [$search]));
            });
        }

        // Stats
        $statsQuery = (clone $query)->reorder();
        $totalIssues = (clone $statsQuery)->count();
        $totalQtyIssued = (float) ((clone $statsQuery)->sum('quantity') ?? 0);
        $totalOutstanding = (float) ((clone $statsQuery)->selectRaw('COALESCE(SUM(quantity - returned_quantity), 0) as outstanding')->value('outstanding') ?? 0);

        $paginator = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'stats' => [
                    'total_issues' => $totalIssues,
                    'total_qty_issued' => round($totalQtyIssued, 3),
                    'total_outstanding' => round($totalOutstanding ?? 0, 3),
                ],
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_movements')) {
            return $this->forbidden('You do not have permission to issue items.');
        }

        $validated = $request->validate([
            'inventory_item_id'   => 'required|exists:inventory_items,id',
            'quantity'            => 'required|numeric|min:0.001',
            'issued_to_user_id'   => 'nullable|exists:users,id',
            'issued_to_name'      => 'nullable|string|max:200',
            'department'          => 'nullable|string|max:150',
            'purpose'             => 'nullable|string|max:300',
            'issued_at'           => 'required|date',
            'remarks'             => 'nullable|string',
        ]);

        // Must have at least one recipient identifier
        if (empty($validated['issued_to_user_id']) && empty($validated['issued_to_name'])) {
            return $this->validationError(['issued_to_name' => ['Either staff selection or name is required.']]);
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId === null) {
            return $this->error('Active institution context is required.', 400);
        }

        $issue = DB::transaction(function () use ($validated, $institutionId) {
            $item = InventoryItem::lockForUpdate()->findOrFail($validated['inventory_item_id']);
            $qty = (float) $validated['quantity'];

            // Check stock availability
            if ((float) $item->current_quantity < $qty) {
                abort(422, "Insufficient stock. Available: {$item->current_quantity}, Requested: {$qty}");
            }

            // Decrement stock
            $item->decrement('current_quantity', $qty);
            $newQty = (float) $item->fresh()->current_quantity;

            // Create inventory movement (issue)
            $movement = InventoryMovement::create([
                'institution_id'    => $institutionId,
                'inventory_item_id' => $item->id,
                'type'              => 'issue',
                'quantity'          => $qty,
                'quantity_after'    => $newQty,
                'reference_type'    => 'issue',
                'performed_by'      => auth()->id(),
                'remarks'           => $validated['remarks'] ?? null,
            ]);

            // Create issue record
            $issue = InventoryIssue::create([
                'institution_id'    => $institutionId,
                'inventory_item_id' => $item->id,
                'quantity'          => $qty,
                'quantity_after'    => $newQty,
                'issued_to_user_id' => $validated['issued_to_user_id'] ?? null,
                'issued_to_name'    => $validated['issued_to_name'] ?? null,
                'department'        => $validated['department'] ?? null,
                'purpose'           => $validated['purpose'] ?? null,
                'returned_quantity' => 0,
                'issued_by'         => auth()->id(),
                'issued_at'         => $validated['issued_at'],
                'remarks'           => $validated['remarks'] ?? null,
                'movement_id'       => $movement->id,
            ]);

            // Back-link movement to this issue
            $movement->update(['reference_id' => $issue->id]);

            return $issue;
        });

        return $this->created(
            $issue->load(['item', 'issuedToUser', 'issuedBy']),
            'Item issued successfully'
        );
    }

    public function show(Request $request, InventoryIssue $inventory_issue): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_movements')) {
            return $this->forbidden('You do not have permission to view issues.');
        }

        return $this->success(
            $inventory_issue->load(['item', 'issuedToUser', 'issuedBy']),
            'Success'
        );
    }

    /**
     * Record a partial or full return of an issue
     */
    public function recordReturn(Request $request, InventoryIssue $inventory_issue): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_movements')) {
            return $this->forbidden('You do not have permission to record returns.');
        }

        $request->validate([
            'returned_quantity' => 'required|numeric|min:0.001',
            'remarks'           => 'nullable|string',
        ]);

        $returnQty = (float) $request->returned_quantity;
        $outstanding = (float) $inventory_issue->quantity - (float) $inventory_issue->returned_quantity;

        if ($returnQty > $outstanding) {
            return $this->validationError([
                'returned_quantity' => ["Cannot return {$returnQty}. Only {$outstanding} is outstanding."]
            ]);
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());

        DB::transaction(function () use ($inventory_issue, $returnQty, $institutionId, $request) {
            $item = InventoryItem::lockForUpdate()->findOrFail($inventory_issue->inventory_item_id);

            // Increase stock back (return movement)
            $item->increment('current_quantity', $returnQty);
            $newQty = (float) $item->fresh()->current_quantity;

            InventoryMovement::create([
                'institution_id'    => $institutionId,
                'inventory_item_id' => $item->id,
                'type'              => 'return',
                'quantity'          => $returnQty,
                'quantity_after'    => $newQty,
                'reference_type'    => 'issue',
                'reference_id'      => $inventory_issue->id,
                'performed_by'      => auth()->id(),
                'remarks'           => $request->remarks ?? "Return for Issue #{$inventory_issue->id}",
            ]);

            $inventory_issue->increment('returned_quantity', $returnQty);
        });

        return $this->success(
            $inventory_issue->fresh(['item', 'issuedToUser', 'issuedBy']),
            'Return recorded successfully'
        );
    }
}
