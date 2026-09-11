<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Controller;
use App\Models\StudentAdHocCharge;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdHocChargeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'target_type' => 'nullable|string|in:class,all',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
            'name' => 'required|string|max:150',
            'amount'  => 'required|numeric',
            'for_month' => 'required|date_format:Y-m',
            'remarks' => 'nullable|string',
        ]);

        $userIds = $validated['user_ids'] ?? [];

        // If target_type is 'all' and no user_ids explicitly passed, fetch all active students of the institution
        if (($validated['target_type'] ?? '') === 'all' && empty($userIds)) {
            $userIds = User::whereHas('roles', function ($q) use ($validated) {
                $q->where('roles.key', 'student')
                  ->where('user_roles.institution_id', $validated['institution_id']);
            })->where('status', 1)->pluck('id')->toArray();
        }

        if (empty($userIds)) {
            return response()->json([
                'message' => 'No eligible students selected or found to assign charges.',
            ], 422);
        }

        $now = now();
        $authUserId = $request->user()->id;
        $institutionId = $validated['institution_id'];
        $name = $validated['name'];
        $amount = $validated['amount'];
        $forMonth = $validated['for_month'];
        $remarks = $validated['remarks'] ?? null;

        $charges = [];
        foreach ($userIds as $userId) {
            $charges[] = [
                'institution_id' => $institutionId,
                'user_id' => $userId,
                'name' => $name,
                'amount' => $amount,
                'for_month' => $forMonth,
                'remarks' => $remarks,
                'created_by' => $authUserId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::transaction(function () use ($charges) {
            foreach (array_chunk($charges, 250) as $chunk) {
                StudentAdHocCharge::insert($chunk);
            }
        });

        return response()->json([
            'message' => count($charges) . ' ad-hoc charges assigned successfully.',
        ], 201);
    }

    public function batches(Request $request)
    {
        $institutionId = $request->input('institution_id')
            ?? \App\Support\InstitutionContext::getActiveInstitutionId($request->user());

        if (!$institutionId) {
            return response()->json(['message' => 'Institution context required.'], 422);
        }

        $batches = StudentAdHocCharge::query()
            ->where('institution_id', $institutionId)
            ->selectRaw('
                name,
                amount,
                for_month,
                DATE(created_at) as assignment_date,
                created_by,
                COUNT(*) as student_count,
                SUM(amount) as total_amount,
                MIN(created_at) as created_at
            ')
            ->groupBy('name', 'amount', 'for_month', 'assignment_date', 'created_by')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($b) {
                $creator = $b->created_by ? User::find($b->created_by) : null;
                return [
                    'name' => $b->name,
                    'amount' => (float) $b->amount,
                    'for_month' => $b->for_month,
                    'assignment_date' => $b->assignment_date,
                    'student_count' => (int) $b->student_count,
                    'total_amount' => (float) $b->total_amount,
                    'created_at' => $b->created_at,
                    'creator_name' => $creator?->name ?? 'Admin',
                ];
            });

        $chargeNames = StudentAdHocCharge::where('institution_id', $institutionId)
            ->distinct()
            ->pluck('name')
            ->filter()
            ->values();

        return response()->json([
            'batches' => $batches,
            'charge_names' => $chargeNames,
        ]);
    }

    public function index(Request $request)
    {
        $institutionId = $request->input('institution_id')
            ?? \App\Support\InstitutionContext::getActiveInstitutionId($request->user());

        if (!$institutionId) {
            return response()->json(['message' => 'Institution context required.'], 422);
        }
        
        $query = StudentAdHocCharge::with([
            'user:id,name,email',
            'user.studentProfile:id,user_id,reg_no,roll_no,stream_id',
            'user.studentProfile.stream:id,name',
            'creator:id,name'
        ])->where('institution_id', $institutionId);

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->whereRaw('LOWER(name) LIKE ?', [$search]);
                  })
                  ->orWhereHas('user.studentProfile', function ($sq) use ($search) {
                      $sq->whereRaw('LOWER(reg_no) LIKE ?', [$search]);
                  });
            });
        }

        if ($request->filled('name')) {
            $query->where('name', $request->name);
        }

        if ($request->filled('amount')) {
            $query->where('amount', $request->amount);
        }

        if ($request->filled('lms_class_id')) {
            $query->whereIn('user_id', function ($q) use ($request) {
                $q->select('user_id')
                  ->from('lms_class_enrollments')
                  ->where('lms_class_id', $request->lms_class_id)
                  ->where('role', 'student')
                  ->where('status', 'active');
            });
        }

        if ($request->filled('session_id') && $request->session_id !== 'all') {
            $query->whereHas('user.studentProfile', function ($sq) use ($request) {
                $sq->where('session_id', $request->session_id);
            });
        }

        if ($request->filled('for_month')) {
            $query->where('for_month', $request->for_month);
        }

        $charges = $query->orderBy('created_at', 'desc')
                         ->paginate($request->per_page ?? 20);

        return response()->json($charges);
    }

    public function update(Request $request, $id)
    {
        $charge = StudentAdHocCharge::findOrFail($id);

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId && $charge->institution_id != $institutionId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name'    => 'required|string|max:150',
            'amount'  => 'required|numeric',
            'remarks' => 'nullable|string',
        ]);

        $charge->update($validated);

        return response()->json([
            'message' => 'Ad-hoc charge updated successfully.',
            'charge'  => $charge->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $charge = StudentAdHocCharge::findOrFail($id);
        
        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId && $charge->institution_id != $institutionId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $charge->delete();

        return response()->json(['message' => 'Ad-hoc charge reverted successfully.']);
    }

    /**
     * Revert / bulk delete ad-hoc charges by IDs or by batch criteria.
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'nullable|array',
            'ids.*' => 'integer',
            'name' => 'nullable|string|max:150',
            'amount' => 'nullable|numeric',
            'for_month' => 'nullable|string|date_format:Y-m',
        ]);

        $institutionId = $request->input('institution_id')
            ?? \App\Support\InstitutionContext::getActiveInstitutionId($request->user());
        $query = StudentAdHocCharge::query();
        if ($institutionId) {
            $query->where('institution_id', $institutionId);
        }

        if (!empty($validated['ids'])) {
            $query->whereIn('id', $validated['ids']);
        } elseif (!empty($validated['name']) && !empty($validated['for_month'])) {
            $query->where('name', $validated['name'])
                  ->where('for_month', $validated['for_month']);
            if (!empty($validated['amount'])) {
                $query->where('amount', $validated['amount']);
            }
        } elseif (!empty($validated['name'])) {
            $query->where('name', $validated['name']);
        } else {
            return response()->json(['message' => 'No charges selected for reversion.'], 422);
        }

        $count = $query->delete();

        return response()->json([
            'message' => "{$count} ad-hoc charge(s) reverted successfully.",
            'count' => $count,
        ]);
    }
}
