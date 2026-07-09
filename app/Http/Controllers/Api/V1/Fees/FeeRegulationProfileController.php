<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Enums\FeeSlot;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\FeeRegulationProfile;
use App\Models\FeeRegulationProfileItem;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeeRegulationProfileController extends BaseController
{
    use BelongsToDefaultInstitution;

    /**
     * List fee regulation profiles for the active institution (paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $query = FeeRegulationProfile::where('institution_id', $institutionId)
            ->with('items.feeType');

        // Search — supports targeted search_by or blanket search
        if ($search = $request->input('search')) {
            $searchBy = $request->input('search_by', '');
            $query->where(function ($q) use ($search, $searchBy) {
                match ($searchBy) {
                    'name'        => $q->where('name', 'like', "%{$search}%"),
                    'description' => $q->where('description', 'like', "%{$search}%"),
                    default       => $q->where('name', 'like', "%{$search}%")
                                       ->orWhere('description', 'like', "%{$search}%"),
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
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedWithMap($paginator, 'fee_profile_index');
    }

    /**
     * Create a fee regulation profile with items.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'profile_type' => 'nullable|string|max:30|in:' . implode(',', array_map(fn($p) => $p->value, FeeSlot::profileTypes())),
            'gender' => 'nullable|string|max:20|in:' . implode(',', array_map(fn($g) => $g->value, FeeSlot::genders())),
            'category' => 'nullable|string|max:30|in:' . implode(',', array_map(fn($c) => $c->value, FeeSlot::categories())),
            'description' => 'nullable|string',
            'is_default' => 'boolean',
            'fee_collection_frequency' => 'nullable|string|in:monthly,quarterly,half-yearly,yearly,one-time',
            'items' => 'required|array|min:1',
            'items.*.fee_type_id' => 'required|integer|exists:fee_types,id',
            'items.*.amount' => 'required|numeric|min:0',
        ]);

        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $isDefault = $validated['is_default'] ?? false;

        // Begin a database transaction to ensure data integrity
        DB::beginTransaction();

        try {
            // If the new profile is marked as default, remove the default status from all existing profiles
            if ($isDefault) {
                FeeRegulationProfile::where('institution_id', $institutionId)
                    ->update(['is_default' => false]);
            }

            // Create the new fee regulation profile
            $profile = FeeRegulationProfile::create([
                'institution_id' => $institutionId,
                'name' => $validated['name'],
                'profile_type' => $validated['profile_type'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'category' => $validated['category'] ?? null,
                'description' => $validated['description'] ?? null,
                'is_default' => $isDefault,
                'fee_collection_frequency' => $validated['fee_collection_frequency'] ?? null,
            ]);

            // Create the associated fee items for this profile
            foreach ($validated['items'] as $item) {
                FeeRegulationProfileItem::create([
                    'profile_id' => $profile->id,
                    'fee_type_id' => (int) $item['fee_type_id'],
                    'amount' => $item['amount'],
                ]);
            }

            DB::commit();

        } catch (\Exception $e) {

            DB::rollBack();
            return $this->error('Something went wrong while creating the profile.', 500);
        }

        // Load the relationship before returning the response
        $profile->load('items.feeType');

        return $this->created($profile, 'Fee profile created successfully');
    }

    /**
     * Show a fee regulation profile with items (lean response).
     */
    public function show(Request $request, $id): JsonResponse
    {
        $fee_regulation_profile = FeeRegulationProfile::findOrFail($id);
        
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId || (int) $fee_regulation_profile->institution_id !== (int) $institutionId) {
            return $this->error('Not found.', 404);
        }

        $fee_regulation_profile->load('items.feeType');

        return $this->success([
            'id' => $fee_regulation_profile->id,
            'name' => $fee_regulation_profile->name,
            'profile_type' => $fee_regulation_profile->profile_type,
            'gender' => $fee_regulation_profile->gender,
            'category' => $fee_regulation_profile->category,
            'description' => $fee_regulation_profile->description,
            'is_default' => $fee_regulation_profile->is_default,
            'fee_collection_frequency' => $fee_regulation_profile->fee_collection_frequency,
            'items' => $fee_regulation_profile->items->map(fn($item) => [
                'fee_type_id' => $item->fee_type_id,
                'amount' => $item->amount,
                'fee_type' => [
                    'id' => $item->feeType?->id,
                    'name' => $item->feeType?->name,
                    'category' => $item->feeType?->category?->value ?? $item->feeType?->category,
                ],
            ])->values(),
        ]);
    }

    /**
     * Update a fee regulation profile and its items.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $fee_regulation_profile = FeeRegulationProfile::findOrFail($id);
        $institutionId = self::getActiveInstitutionId($request->user());

        // Check authorization and context
        if (!$institutionId || (int) $fee_regulation_profile->institution_id !== (int) $institutionId) {
            return $this->error('Not found.', 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:200',
            'profile_type' => 'nullable|string|max:30|in:' . implode(',', array_map(fn($p) => $p->value, FeeSlot::profileTypes())),
            'gender' => 'nullable|string|max:20|in:' . implode(',', array_map(fn($g) => $g->value, FeeSlot::genders())),
            'category' => 'nullable|string|max:30|in:' . implode(',', array_map(fn($c) => $c->value, FeeSlot::categories())),
            'description' => 'nullable|string',
            'is_default' => 'boolean',
            'fee_collection_frequency' => 'nullable|string|in:monthly,quarterly,half-yearly,yearly,one-time',
            'items' => 'sometimes|array|min:1',
            'items.*.fee_type_id' => 'required_with:items|integer|exists:fee_types,id',
            'items.*.amount' => 'required_with:items|numeric|min:0',
        ]);

        // Determine what the new default status will be (either from request or keeping the old one)
        $isDefault = array_key_exists('is_default', $validated) ? $validated['is_default'] : $fee_regulation_profile->is_default;

        // Begin a database transaction to ensure data integrity
        DB::beginTransaction();

        try {
            // If this profile is being set as the default, remove default status from all OTHER profiles
            if ($isDefault) {
                FeeRegulationProfile::where('institution_id', $institutionId)
                    ->where('id', '!=', $fee_regulation_profile->id) // Ignore the current profile
                    ->update(['is_default' => false]);
            }

            // Update the current fee regulation profile
            $fee_regulation_profile->update([
                'name' => $validated['name'] ?? $fee_regulation_profile->name,
                'profile_type' => array_key_exists('profile_type', $validated) ? $validated['profile_type'] : $fee_regulation_profile->profile_type,
                'gender' => array_key_exists('gender', $validated) ? $validated['gender'] : $fee_regulation_profile->gender,
                'category' => array_key_exists('category', $validated) ? $validated['category'] : $fee_regulation_profile->category,
                'description' => array_key_exists('description', $validated) ? $validated['description'] : $fee_regulation_profile->description,
                'is_default' => $isDefault,
                'fee_collection_frequency' => array_key_exists('fee_collection_frequency', $validated) ? $validated['fee_collection_frequency'] : $fee_regulation_profile->fee_collection_frequency,
            ]);

            // If items are provided in the request, replace the old items with the new ones
            if (isset($validated['items'])) {
                $fee_regulation_profile->items()->delete();

                foreach ($validated['items'] as $item) {
                    FeeRegulationProfileItem::create([
                        'profile_id' => $fee_regulation_profile->id,
                        'fee_type_id' => (int) $item['fee_type_id'],
                        'amount' => $item['amount'],
                    ]);
                }
            }

            // Commit the transaction to save all changes
            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Something went wrong while updating the profile.', 500);
        }

        // Load relationships before returning the updated model
        $fee_regulation_profile->load('items.feeType');

        return $this->successWithMap($fee_regulation_profile->fresh(), 'passthrough', 'Fee profile updated successfully');
    }

    /**
     * Delete a fee regulation profile.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $fee_regulation_profile = FeeRegulationProfile::findOrFail($id);
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId || (int) $fee_regulation_profile->institution_id !== (int) $institutionId) {
            return $this->error('Not found.', 404);
        }

        $fee_regulation_profile->delete();

        return $this->success(null, 'Fee profile deleted successfully');
    }
}
