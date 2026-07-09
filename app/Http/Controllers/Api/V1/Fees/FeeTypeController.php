<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Enums\FeeCategory;
use App\Enums\FeeSlot;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\FeeType;
use App\Services\OnboardingDataSeederService;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeeTypeController extends BaseController
{
    use BelongsToDefaultInstitution;

    /**
     * List fee types for the active institution (paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $query = FeeType::where('institution_id', $institutionId);

        // Search — supports targeted search_by or blanket search
        if ($search = $request->input('search')) {
            $searchBy = $request->input('search_by', '');
            $query->where(function ($q) use ($search, $searchBy) {
                match ($searchBy) {
                    'name'        => $q->where('name', 'like', "%{$search}%"),
                    'description' => $q->where('category', 'like', "%{$search}%"),
                    default       => $q->where('name', 'like', "%{$search}%")
                                       ->orWhere('category', 'like', "%{$search}%"),
                };
            });
        }

        // Sidebar filters
        if ($profileType = $request->input('profile_type')) {
            if ($profileType !== 'all') {
                $query->where('profile_type', $profileType);
            }
        }

        $paginator = $query
            ->orderBy('name')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedWithMap($paginator, 'fee_type_index');
    }

    /**
     * Create a fee type.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'category' => 'nullable|string|max:50|in:recurring,one_time,variable,mandatory,optional,refundable,fine,discount',
            'profile_type' => 'nullable|string|max:30|in:' . implode(',', array_map(fn($p) => $p->value, FeeSlot::profileTypes())),
            'reservation_category' => 'nullable|string|max:30|in:' . implode(',', array_map(fn($c) => $c->value, FeeSlot::categories())),
            'gender' => 'nullable|string|max:20|in:' . implode(',', array_map(fn($g) => $g->value, FeeSlot::genders())),
            'display_order' => 'nullable|integer|min:0',
        ]);

        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $validated['institution_id'] = $institutionId;
        $validated['category'] = $validated['category'] ?? 'recurring';

        $feeType = FeeType::create($validated);

        return $this->created($feeType, 'Fee type created successfully');
    }

    /**
     * Show a fee type.
     */
    public function show(Request $request, FeeType $fee_type): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId || (int) $fee_type->institution_id !== (int) $institutionId) {
            return $this->error('Not found.', 404);
        }

        return $this->successWithMap($fee_type, 'passthrough');
    }

    /**
     * Update a fee type.
     */
    public function update(Request $request, FeeType $fee_type): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId || (int) $fee_type->institution_id !== (int) $institutionId) {
            return $this->error('Not found.', 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:200',
            'category' => 'nullable|string|max:50|in:recurring,one_time,variable,mandatory,optional,refundable,fine,discount',
            'profile_type' => 'nullable|string|max:30|in:' . implode(',', array_map(fn($p) => $p->value, FeeSlot::profileTypes())),
            'reservation_category' => 'nullable|string|max:30|in:' . implode(',', array_map(fn($c) => $c->value, FeeSlot::categories())),
            'gender' => 'nullable|string|max:20|in:' . implode(',', array_map(fn($g) => $g->value, FeeSlot::genders())),
            'display_order' => 'nullable|integer|min:0',
        ]);

        $fee_type->update($validated);

        return $this->successWithMap($fee_type->fresh(), 'passthrough', 'Fee type updated successfully');
    }

    /**
     * Delete a fee type.
     */
    public function destroy(Request $request, FeeType $fee_type): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId || (int) $fee_type->institution_id !== (int) $institutionId) {
            return $this->error('Not found.', 404);
        }

        $fee_type->delete();

        return $this->success(null, 'Fee type deleted successfully');
    }

    /**
     * Restore default fee types for the active institution (by institution type).
     * Idempotent: only creates fee types that don't already exist by name.
     */
    public function restoreDefaults(Request $request): JsonResponse
    {
        $user = $request->user();
        $institutionId = self::getActiveInstitutionId($user);
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $institution = \App\Models\Institution::find($institutionId);
        if (!$institution) {
            return $this->error('Institution not found.', 404);
        }

        $created = app(OnboardingDataSeederService::class)->seed('fee-types', $institution);

        return $this->success(
            ['created' => $created],
            $created > 0
            ? "{$created} default fee type(s) added for your institution type."
            : 'No new fee types to add; defaults already present.'
        );
    }
}
