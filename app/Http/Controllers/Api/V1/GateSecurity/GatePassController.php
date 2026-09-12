<?php

namespace App\Http\Controllers\Api\V1\GateSecurity;

use App\Exports\GatePassExport;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\GatePass;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class GatePassController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_gate_passes')) {
            return $this->forbidden('You do not have permission to view gate passes.');
        }

        $query = GatePass::query()->with([
            'staff:id,name,email',
            'studentUser:id,name',
            'securityGuard:id,name',
            'exitGuard:id,name',
        ]);

        // Status Filter
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'overstayed' || $request->boolean('overstayed')) {
                $query->overstayed();
            } elseif ($request->status === 'inside' || $request->status === 'inside_campus') {
                $query->insideCampus();
            } elseif ($request->status === 'checked_out') {
                $query->checkedOut();
            } else {
                $query->where('status', $request->status);
            }
        } elseif ($request->boolean('overstayed')) {
            $query->overstayed();
        }

        // Visitor Type Filter
        if ($request->filled('visitor_type') && $request->visitor_type !== 'all') {
            $query->where('visitor_type', $request->visitor_type);
        }

        // Gate Name Filter
        if ($request->filled('gate_name') && $request->gate_name !== 'all') {
            $query->where('gate_name', $request->gate_name);
        }

        // Date Range
        if ($request->filled('from_date')) {
            $query->whereDate('check_in_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('check_in_at', '<=', $request->to_date);
        }

        // Search
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(visitor_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(pass_number) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(purpose) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(vehicle_number) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(student_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(person_to_meet_custom) LIKE ?', [$search])
                    ->orWhereHas('staff', function ($sq) use ($search) {
                        $sq->whereRaw('LOWER(name) LIKE ?', [$search]);
                    });
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('check_in_at', 'desc')->orderBy('id', 'desc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_gate_passes')) {
            return $this->forbidden('You do not have permission to create gate passes.');
        }

        $validated = $request->validate([
            'visitor_name' => 'required|string|max:150',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string|max:255',
            'id_proof_type' => 'nullable|string|max:50',
            'id_proof_number' => 'nullable|string|max:50',
            'visitor_type' => 'required|string|max:50',
            'accompanying_count' => 'nullable|integer|min:0',
            'purpose' => 'required|string|max:255',
            'department' => 'nullable|string|max:100',
            'staff_id' => 'nullable|exists:users,id',
            'student_user_id' => 'nullable|exists:users,id',
            'student_name' => 'nullable|string|max:150',
            'person_to_meet_custom' => 'nullable|string|max:150',
            'gate_name' => 'nullable|string|max:50',
            'vehicle_type' => 'nullable|string|max:50',
            'vehicle_number' => 'nullable|string|max:30',
            'belongings' => 'nullable|string',
            'belongings_declared' => 'nullable|string',
            'entry_time' => 'nullable|date',
            'notes' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        if (!empty($validated['belongings_declared']) && empty($validated['belongings'])) {
            $validated['belongings'] = $validated['belongings_declared'];
        }
        unset($validated['belongings_declared']);

        if (!empty($validated['entry_time'])) {
            $validated['check_in_at'] = $validated['entry_time'];
        }
        unset($validated['entry_time']);

        if ($request->hasFile('photo')) {
            $disk = config('filesystems.disks.r2.key') ? 'r2' : 'public';
            $path = $request->file('photo')->store('uploads/gate_passes/photos', $disk);
            $validated['photo_url'] = Storage::disk($disk)->url($path);
        }
        unset($validated['photo']);

        $pass = GatePass::create($validated);

        return $this->successWithMap(
            $pass->fresh(['staff:id,name,email', 'studentUser:id,name', 'securityGuard:id,name']),
            'passthrough',
            'Visitor checked in successfully. Pass: ' . $pass->pass_number
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('view_gate_passes')) {
            return $this->forbidden('You do not have permission to view this gate pass.');
        }

        $pass = GatePass::with([
            'staff:id,name,email,mobile',
            'studentUser:id,name',
            'securityGuard:id,name',
            'exitGuard:id,name',
            'creator:id,name',
        ])->findOrFail($id);

        return $this->success($pass);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('update_gate_passes')) {
            return $this->forbidden('You do not have permission to update gate passes.');
        }

        $pass = GatePass::findOrFail($id);

        $validated = $request->validate([
            'visitor_name' => 'required|string|max:150',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string|max:255',
            'id_proof_type' => 'nullable|string|max:50',
            'id_proof_number' => 'nullable|string|max:50',
            'visitor_type' => 'required|string|max:50',
            'accompanying_count' => 'nullable|integer|min:0',
            'purpose' => 'required|string|max:255',
            'department' => 'nullable|string|max:100',
            'staff_id' => 'nullable|exists:users,id',
            'student_user_id' => 'nullable|exists:users,id',
            'student_name' => 'nullable|string|max:150',
            'person_to_meet_custom' => 'nullable|string|max:150',
            'gate_name' => 'nullable|string|max:50',
            'vehicle_type' => 'nullable|string|max:50',
            'vehicle_number' => 'nullable|string|max:30',
            'belongings' => 'nullable|string',
            'belongings_declared' => 'nullable|string',
            'exit_remarks' => 'nullable|string',
            'is_blocked' => 'nullable|boolean',
            'block_reason' => 'nullable|string',
            'notes' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        if (!empty($validated['belongings_declared'])) {
            $validated['belongings'] = $validated['belongings_declared'];
        }
        unset($validated['belongings_declared']);

        if ($request->hasFile('photo')) {
            $disk = config('filesystems.disks.r2.key') ? 'r2' : 'public';
            $path = $request->file('photo')->store('uploads/gate_passes/photos', $disk);
            $validated['photo_url'] = Storage::disk($disk)->url($path);
        }
        unset($validated['photo']);

        $pass->update($validated);

        return $this->successWithMap(
            $pass->fresh(['staff:id,name,email', 'studentUser:id,name', 'securityGuard:id,name', 'exitGuard:id,name']),
            'passthrough',
            'Gate pass updated successfully'
        );
    }

    public function checkout(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('checkout_gate_passes') && ! $request->user()->hasAbility('update_gate_passes')) {
            return $this->forbidden('You do not have permission to check out visitors.');
        }

        $pass = GatePass::findOrFail($id);

        if ($pass->status === 'checked_out') {
            return $this->error('Visitor has already been checked out.');
        }

        $remarks = $request->input('exit_remarks', 'Left Campus');
        $pass->markExit($remarks, auth()->id());

        return $this->successWithMap(
            $pass->fresh(['staff:id,name,email', 'studentUser:id,name', 'securityGuard:id,name', 'exitGuard:id,name']),
            'passthrough',
            "Visitor {$pass->visitor_name} checked out successfully. Duration: {$pass->duration_minutes} minutes."
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_gate_passes')) {
            return $this->forbidden('You do not have permission to delete gate passes.');
        }

        $pass = GatePass::findOrFail($id);
        $pass->delete();

        return $this->success(null, 'Gate pass deleted successfully.');
    }

    /**
     * Instant visitor auto-lookup by phone for fast re-entry autofill.
     */
    public function lookup(Request $request): JsonResponse
    {
        $phone = trim($request->input('phone', ''));

        if (strlen($phone) < 4) {
            return $this->success(null);
        }

        $recent = GatePass::where('phone', $phone)
            ->orderBy('id', 'desc')
            ->first();

        if (! $recent) {
            return $this->success(null);
        }

        return $this->success([
            'visitor_name' => $recent->visitor_name,
            'phone' => $recent->phone,
            'email' => $recent->email,
            'address' => $recent->address,
            'id_proof_type' => $recent->id_proof_type,
            'id_proof_number' => $recent->id_proof_number,
            'visitor_type' => $recent->visitor_type,
            'vehicle_type' => $recent->vehicle_type,
            'vehicle_number' => $recent->vehicle_number,
            'photo_url' => $recent->photo_url,
            'is_blocked' => $recent->is_blocked,
            'block_reason' => $recent->block_reason,
            'last_visit_at' => $recent->check_in_at ? Carbon::parse($recent->check_in_at)->toDateString() : null,
            'total_past_visits' => GatePass::where('phone', $phone)->count(),
        ]);
    }

    /**
     * Real-time campus counters & security analytics.
     */
    public function analytics(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_gate_passes')) {
            return $this->forbidden('You do not have permission to view gate analytics.');
        }

        $today = Carbon::today();

        $currentlyInside = GatePass::insideCampus()->count();
        $todayEntries = GatePass::whereDate('check_in_at', $today)->count();
        $todayExits = GatePass::whereDate('check_out_at', $today)->count();
        $overstayedCount = GatePass::overstayed(3)->count();
        $vehiclesInside = GatePass::insideCampus()
            ->whereNotNull('vehicle_type')
            ->where('vehicle_type', '!=', 'none')
            ->count();
        $totalPasses = GatePass::count();

        // Recent 5 active visitors
        $recentActive = GatePass::insideCampus()
            ->with(['staff:id,name', 'securityGuard:id,name'])
            ->orderBy('check_in_at', 'desc')
            ->take(5)
            ->get();

        return $this->success([
            'inside_campus' => $currentlyInside,
            'today_entries' => $todayEntries,
            'today_exits' => $todayExits,
            'overstayed_count' => $overstayedCount,
            'vehicles_inside' => $vehiclesInside,
            'total_passes' => $totalPasses,
            'kpis' => [
                'currently_inside' => $currentlyInside,
                'today_entries' => $todayEntries,
                'today_exits' => $todayExits,
                'overstayed_count' => $overstayedCount,
                'vehicles_inside' => $vehiclesInside,
                'total_passes' => $totalPasses,
            ],
            'recent_active' => $recentActive,
        ]);
    }

    public function export(Request $request)
    {
        if (! $request->user()->hasAbility('view_gate_passes')) {
            return $this->forbidden('You do not have permission to export gate passes.');
        }

        return Excel::download(
            new GatePassExport($request->all()),
            'gate_register_' . now()->format('Y-m-d') . '.xlsx'
        );
    }
}
