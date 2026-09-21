<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportFuelVendor;
use App\Models\TransportFuelVendorSettlement;
use App\Models\TransportVehicleFuel;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransportFuelVendorController extends BaseController
{
    use BelongsToDefaultInstitution;

    // ── List Vendors ──────────────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('Permission denied.');
        }

        $institutionId = self::getActiveInstitutionId($request->user());

        $query = TransportFuelVendor::where('institution_id', $institutionId)
            ->withCount('fuelLogs as total_fuels')
            ->withSum(['fuelLogs as total_fuel_amount' => function ($q) {
                $q->whereIn('payment_status', ['credit', 'settled', 'paid']);
            }], 'total_amount')
            ->withSum(['fuelLogs as credit_amount' => function ($q) {
                $q->where('payment_status', 'credit');
            }], 'total_amount')
            ->withSum('settlements as settled_amount', 'amount');

        if ($request->filled('search')) {
            $s = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(name) LIKE ?', [$s])
                  ->orWhereRaw('LOWER(city) LIKE ?', [$s])
                  ->orWhereRaw('LOWER(contact_name) LIKE ?', [$s]);
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        $vendors = $query->orderBy('name')
            ->paginate($request->input('per_page', 20));

        // Compute outstanding_balance in PHP so we don't need a complex subquery
        $vendors->getCollection()->transform(function ($v) {
            $v->outstanding_balance = max(0, (float) $v->credit_amount - (float) $v->settled_amount);
            return $v;
        });

        return $this->paginatedWithMap($vendors, 'passthrough');
    }

    // ── Create Vendor ─────────────────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_transport_vehicles')) {
            return $this->forbidden('Permission denied.');
        }

        $institutionId = self::getActiveInstitutionId($request->user());

        $validated = $request->validate([
            'name'          => 'required|string|max:200',
            'location'      => 'nullable|string|max:300',
            'city'          => 'nullable|string|max:100',
            'state'         => 'nullable|string|max:100',
            'pincode'       => 'nullable|string|max:20',
            'contact_name'  => 'nullable|string|max:150',
            'contact_phone' => 'nullable|string|max:20',
            'gstin'         => 'nullable|string|max:20',
            'credit_limit'  => 'nullable|numeric|min:0',
            'payment_terms' => 'nullable|string|in:on-demand,weekly,monthly,quarterly',
            'is_active'     => 'nullable|boolean',
            'notes'         => 'nullable|string',
        ]);

        $validated['institution_id'] = $institutionId;
        $validated['created_by']     = $request->user()->id;

        $vendor = TransportFuelVendor::create($validated);

        return $this->created($vendor, 'Fuel vendor created successfully.');
    }

    // ── Show Single Vendor ────────────────────────────────────────────────
    public function show(Request $request, TransportFuelVendor $fuel_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('Permission denied.');
        }

        $fuel_vendor->load(['creator']);
        $fuel_vendor->outstanding_balance = $fuel_vendor->outstanding_balance;
        $fuel_vendor->total_credit        = $fuel_vendor->total_credit;

        return $this->successWithMap($fuel_vendor, 'passthrough');
    }

    // ── Update Vendor ─────────────────────────────────────────────────────
    public function update(Request $request, TransportFuelVendor $fuel_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_vehicles')) {
            return $this->forbidden('Permission denied.');
        }

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:200',
            'location'      => 'nullable|string|max:300',
            'city'          => 'nullable|string|max:100',
            'state'         => 'nullable|string|max:100',
            'pincode'       => 'nullable|string|max:20',
            'contact_name'  => 'nullable|string|max:150',
            'contact_phone' => 'nullable|string|max:20',
            'gstin'         => 'nullable|string|max:20',
            'credit_limit'  => 'nullable|numeric|min:0',
            'payment_terms' => 'nullable|string|in:on-demand,weekly,monthly,quarterly',
            'is_active'     => 'nullable|boolean',
            'notes'         => 'nullable|string',
        ]);

        $fuel_vendor->update($validated);

        return $this->successWithMap($fuel_vendor->fresh(), 'passthrough', 'Vendor updated successfully.');
    }

    // ── Delete Vendor ─────────────────────────────────────────────────────
    public function destroy(Request $request, TransportFuelVendor $fuel_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_transport_vehicles')) {
            return $this->forbidden('Permission denied.');
        }

        if ($fuel_vendor->fuelLogs()->exists()) {
            return $this->error('Cannot delete vendor with existing fuel records.', 422);
        }

        $fuel_vendor->delete();

        return $this->success(null, 'Vendor deleted successfully.');
    }

    // ── Vendor Ledger (credit history + settlements) ──────────────────────
    public function ledger(Request $request, TransportFuelVendor $fuel_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('Permission denied.');
        }

        // Fuel entries for this vendor
        $fuelQuery = TransportVehicleFuel::where('transport_fuel_vendor_id', $fuel_vendor->id)
            ->with(['transportVehicle:id,registration_number,vehicle_type', 'transportDriver:id,name'])
            ->orderBy('fuel_date', 'desc');

        if ($request->filled('payment_status')) {
            $fuelQuery->where('payment_status', $request->payment_status);
        }
        if ($request->filled('from_date')) {
            $fuelQuery->whereDate('fuel_date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $fuelQuery->whereDate('fuel_date', '<=', $request->to_date);
        }

        $fuelLogs = $fuelQuery->get();

        // Settlement history
        $settlements = TransportFuelVendorSettlement::where('transport_fuel_vendor_id', $fuel_vendor->id)
            ->orderBy('settlement_date', 'desc')
            ->get();

        $totalCredit    = $fuelLogs->whereIn('payment_status', ['credit', 'settled'])->sum('total_amount');
        $totalPaid      = $fuelLogs->where('payment_status', 'paid')->sum('total_amount');
        $totalSettled   = $settlements->sum('amount');
        $outstanding    = max(0, (float) $fuelLogs->where('payment_status', 'credit')->sum('total_amount') - (float) $totalSettled);

        return $this->success([
            'vendor'      => $fuel_vendor,
            'fuel_logs'   => $fuelLogs,
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
    public function settle(Request $request, TransportFuelVendor $fuel_vendor): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_vehicles')) {
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

            // Create settlement record
            $settlement = TransportFuelVendorSettlement::create([
                'institution_id'           => $institutionId,
                'transport_fuel_vendor_id' => $fuel_vendor->id,
                'settlement_date'          => $validated['settlement_date'],
                'amount'                   => $validated['amount'],
                'payment_mode'             => $validated['payment_mode'],
                'reference_number'         => $validated['reference_number'] ?? null,
                'notes'                    => $validated['notes'] ?? null,
                'created_by'               => $request->user()->id,
            ]);

            // Mark oldest unpaid credit fuel entries as 'settled' up to the paid amount
            $remaining = (float) $validated['amount'];
            $creditLogs = TransportVehicleFuel::where('transport_fuel_vendor_id', $fuel_vendor->id)
                ->where('payment_status', 'credit')
                ->orderBy('fuel_date', 'asc')
                ->orderBy('id', 'asc')
                ->get();

            foreach ($creditLogs as $log) {
                if ($remaining <= 0) break;
                $log->update([
                    'payment_status'                     => 'settled',
                    'transport_fuel_vendor_settlement_id' => $settlement->id,
                    'settled_at'                         => now(),
                ]);
                $remaining -= (float) $log->total_amount;
            }

            DB::commit();

            return $this->created(
                $settlement->load('vendor'),
                'Settlement recorded. ' . count($creditLogs) . ' fuel entries marked as settled.'
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error('Settlement failed: ' . $e->getMessage(), 500);
        }
    }
}
