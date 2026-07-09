<?php

namespace App\Services;

use App\Enums\FeeCategory;
use App\Enums\FeeSlot;
use App\Models\FeeRegulationProfile;
use App\Models\FeeRegulationProfileItem;
use App\Models\FeeStructureRule;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * FeeCalculationEngine — Single Source of Truth
 *
 * Every fee calculation in the system flows through this service.
 * No inline math anywhere else. One engine, one formula, one path.
 *
 * Usage:
 *   $engine = app(FeeCalculationEngine::class);
 *   $breakdown = $engine->calculateAdmissionFee($institutionId, $admissionHeadId, 'sc', 'female');
 *   $due       = $engine->calculateDue($breakdown['net'], 0, $paid);
 */
class FeeCalculationEngine
{
    // ═══════════════════════════════════════════════════════════════════
    //  DUE AMOUNT — Universal Formula (ONE place, called everywhere)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Calculate the amount still owed.
     *
     * due = max(0, totalFee − totalDiscount − totalPaid)
     *
     * This is the ONLY place this formula exists in the entire codebase.
     */
    public function calculateDue(float $totalFee, float $totalDiscount, float $totalPaid): float
    {
        return round(max(0, $totalFee - $totalDiscount - $totalPaid), 2);
    }

    // ═══════════════════════════════════════════════════════════════════
    //  ADMISSION FEE — Itemized Breakdown
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Calculate the full admission fee for a student profile.
     *
     * Resolution order:
     * 1. Find FeeRegulationProfile match (exact → partial → default)
     * 2. If no profile, fall back to FeeStructureRule (scope=admission_head)
     * 3. Returns itemized breakdown with gross, discount, net
     *
     * @return array{items: array, gross: float, discount: float, net: float, profile_id: int|null}
     */
    public function calculateAdmissionFee(
        int $institutionId,
        int $admissionHeadId,
        ?string $category = null,
        ?string $gender = null,
        ?string $profileType = null,
        ?int $profileId = null,
    ): array {
        // 1. Try to resolve a matching FeeRegulationProfile
        if ($profileId) {
            $profile = FeeRegulationProfile::with('items.feeType')->find($profileId);
        } else {
            $profile = $this->resolveProfile($institutionId, $profileType, $category, $gender);
        }

        if ($profile) {
            return $this->buildBreakdownFromProfile($profile);
        }

        // 2. Fall back to FeeStructureRule for admission_head scope
        $studentSlots = $this->resolveStudentSlots($category, $gender);
        $scopes = [
            ['type' => FeeStructureRule::SCOPE_INSTITUTION, 'id' => $institutionId],
            ['type' => FeeStructureRule::SCOPE_ADMISSION_HEAD, 'id' => $admissionHeadId],
        ];

        $rules = $this->resolveEffectiveRules($scopes, $studentSlots);
        return $this->buildBreakdownFromRules($rules, null);
    }

    // ═══════════════════════════════════════════════════════════════════
    //  RECURRING FEE — Per-Period Breakdown
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Calculate per-period recurring fee for a student.
     *
     * Resolves the scope chain: Institution → Stream → Class
     * Applies FeeRegulationProfile override if matched.
     *
     * @return array{items: array, gross: float, discount: float, net: float, profile_id: int|null, one_time_charges: array}
     */
    protected static array $recurringFeeCache = [];

    public function calculateRecurringFee(
        int $institutionId,
        ?int $streamId = null,
        ?int $classId = null,
        ?string $category = null,
        ?string $gender = null,
        ?string $profileType = null,
        ?int $profileId = null,
    ): array {
        $cacheKey = implode('_', [
            $institutionId,
            $streamId ?? 'null',
            $classId ?? 'null',
            $category ?? 'null',
            $gender ?? 'null',
            $profileType ?? 'null',
            $profileId ?? 'null',
        ]);

        if (isset(self::$recurringFeeCache[$cacheKey])) {
            return self::$recurringFeeCache[$cacheKey];
        }

        $result = $this->executeCalculateRecurringFee(
            $institutionId,
            $streamId,
            $classId,
            $category,
            $gender,
            $profileType,
            $profileId
        );

        self::$recurringFeeCache[$cacheKey] = $result;
        return $result;
    }

    private function executeCalculateRecurringFee(
        int $institutionId,
        ?int $streamId = null,
        ?int $classId = null,
        ?string $category = null,
        ?string $gender = null,
        ?string $profileType = null,
        ?int $profileId = null,
    ): array {
        // 1. Try profile match first
        if ($profileId) {
            $profile = FeeRegulationProfile::with('items.feeType')->find($profileId);
        } else {
            $profile = $this->resolveProfile($institutionId, $profileType, $category, $gender);
        }

        if ($profile) {
            $recurringCategories = [FeeCategory::RECURRING->value];

            $recurringItems = $profile->items->filter(
                fn($item) => in_array($item->feeType?->category, $recurringCategories, true)
                    || $item->feeType?->category === null
            );
            $oneTimeItems = $profile->items->filter(
                fn($item) => $item->feeType?->category !== null
                    && !in_array($item->feeType?->category, $recurringCategories, true)
            );

            $breakdown = $this->buildBreakdownFromProfileItems($recurringItems, $profile->id);
            $breakdown['one_time_charges'] = $oneTimeItems->map(function($item) {
                $isDiscount = $item->feeType?->category === FeeCategory::DISCOUNT->value;
                $amount = abs((float) $item->amount);
                if ($isDiscount) {
                    $amount = -$amount;
                }
                return [
                    'fee_type_id' => $item->fee_type_id,
                    'name'        => $item->feeType?->name ?? 'Fee',
                    'amount'      => $amount,
                    'category'    => $item->feeType?->category,
                ];
            })->values()->all();

            return $breakdown;
        }

        // 2. Multi-scope rule resolution
        $studentSlots = $this->resolveStudentSlots($category, $gender);
        $scopes = [['type' => FeeStructureRule::SCOPE_INSTITUTION, 'id' => $institutionId]];

        if ($streamId) {
            $scopes[] = ['type' => FeeStructureRule::SCOPE_STREAM, 'id' => $streamId];
        }
        if ($classId) {
            $scopes[] = ['type' => FeeStructureRule::SCOPE_CLASS, 'id' => $classId];
        }

        $rules = $this->resolveEffectiveRules($scopes, $studentSlots);

        // Separate recurring vs one-time
        $recurringCategories = [FeeCategory::RECURRING->value];

        $recurringRules = $rules->filter(
            fn($r) => in_array($r->feeType?->category, $recurringCategories, true)
                || $r->feeType?->category === null
        );
        $oneTimeRules = $rules->filter(
            fn($r) => $r->feeType?->category !== null
                && !in_array($r->feeType?->category, $recurringCategories, true)
        );

        $breakdown = $this->buildBreakdownFromRules($recurringRules, null);
        $breakdown['one_time_charges'] = $oneTimeRules->values()->map(function($s) {
            $isDiscount = $s->feeType?->category === FeeCategory::DISCOUNT->value;
            $amount = abs((float) $s->amount);
            if ($isDiscount) {
                $amount = -$amount;
            }
            return [
                'fee_type_id' => $s->fee_type_id,
                'name'        => $s->feeType?->name ?? 'Fee',
                'amount'      => $amount,
                'category'    => $s->feeType?->category,
            ];
        })->values()->all();

        return $breakdown;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  LATE FEE
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Calculate late fee: fixed amount or percentage of base.
     */
    public function calculateLateFee(array $settings, float $baseAmount): float
    {
        if (!($settings['late_fee_enabled'] ?? false) || ($settings['late_fee_value'] ?? 0) <= 0) {
            return 0.0;
        }

        return ($settings['late_fee_type'] ?? 'fixed') === 'percent'
            ? round($baseAmount * $settings['late_fee_value'] / 100, 2)
            : (float) $settings['late_fee_value'];
    }

   

    // ═══════════════════════════════════════════════════════════════════
    //  CONCESSION / DISCOUNT NORMALIZATION
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Normalize incoming request data: map concession → discount.
     * Call this at the controller layer before processing.
     *
     * @return array Validated data with concession mapped to discount
     */
    public function normalizeDiscount(array $data): array
    {
        // concession_amount → discount_amount (if discount not already set)
        if (isset($data['concession_amount']) && !isset($data['discount_amount'])) {
            $data['discount_amount'] = $data['concession_amount'];
        }
        if (isset($data['concession_reason']) && !isset($data['discount_reason'])) {
            $data['discount_reason'] = $data['concession_reason'];
        }

        // Clean up legacy keys
        unset($data['concession_amount'], $data['concession_reason']);

        return $data;
    }


     // ═══════════════════════════════════════════════════════════════════
    //  INVENTORY SALE — Standardized Calculation
    // ═══════════════════════════════════════════════════════════════════
    
    /**
     * Calculate total for inventory sales.
     * Centralizes the qty * price rounding logic.
     *
     * @param  array<int, array{quantity: float, unit_price: float, name?: string}> $lines
     */
    public function calculateInventorySaleFee(array $lines): array
    {
        $gross = 0.0;
        $items = [];

        foreach ($lines as $line) {
            $qty = (float) ($line['quantity'] ?? 0);
            $price = (float) ($line['unit_price'] ?? 0);
            $amount = round($qty * $price, 2);
            $gross += $amount;

            $items[] = [
                'name'       => $line['name'] ?? 'Item',
                'quantity'   => $qty,
                'unit_price' => $price,
                'amount'     => $amount,
                'type'       => 'charge',
            ];
        }

        return [
            'items'    => $items,
            'gross'    => round($gross, 2),
            'discount' => 0.0,
            'net'      => round($gross, 2),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════
    //  PROFILE RESOLUTION
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Find the best-matching FeeRegulationProfile for a student.
     *
     * Priority:
     * 1. Exact match: profile_type + category + gender
     * 2. profile_type + category (any gender)
     * 3. profile_type + gender (any category)
     * 4. profile_type only
     * 5. Default profile (is_default = true)
     * 6. null (fall through to FeeStructureRule amounts)
     */
    public function resolveProfile(
        int $institutionId,
        ?string $profileType = null,
        ?string $category = null,
        ?string $gender = null,
    ): ?FeeRegulationProfile {
        $profiles = FeeRegulationProfile::where('institution_id', $institutionId)
            ->with('items.feeType')
            ->get();

        if ($profiles->isEmpty()) {
            return null;
        }

        // Score each profile: higher = better match
        $scored = $profiles->map(function ($p) use ($profileType, $category, $gender) {
            $score = 0;
            $matches = 0;

            // Profile type match
            if ($p->profile_type !== null && $profileType !== null) {
                if (strtolower($p->profile_type) === strtolower($profileType)) {
                    $score += 4;
                    $matches++;
                } else {
                    return ['profile' => $p, 'score' => -1]; // Mismatch = disqualified
                }
            }

            // Category match
            if ($p->category !== null && $category !== null) {
                if (strtolower($p->category) === strtolower($category)) {
                    $score += 2;
                    $matches++;
                } else {
                    return ['profile' => $p, 'score' => -1]; // Mismatch = disqualified
                }
            }

            // Gender match
            if ($p->gender !== null && $gender !== null) {
                if (strtolower($p->gender) === strtolower($gender)) {
                    $score += 1;
                    $matches++;
                } else {
                    return ['profile' => $p, 'score' => -1]; // Mismatch = disqualified
                }
            }

            // Default profile as last resort
            if ($matches === 0 && $p->is_default) {
                $score = 0; // Valid but lowest priority
            } elseif ($matches === 0 && !$p->is_default) {
                $score = -1; // No match criteria and not default
            }

            return ['profile' => $p, 'score' => $score];
        });

        // Pick highest scoring, non-disqualified profile
        $best = $scored->filter(fn($s) => $s['score'] >= 0)
            ->sortByDesc('score')
            ->first();

        return $best ? $best['profile'] : null;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  EFFECTIVE RULES (Scope Override Chain)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Override-merge fee rules: narrower scopes replace broader ones for the same fee_type_id.
     * Institution → Stream → Class (Class wins over Stream wins over Institution).
     * Also filters by student's FeeSlot and effective date range.
     */
    public function resolveEffectiveRules(array $scopes, array $studentSlots): Collection
    {
        $today = now()->startOfDay();
        $mergedRules = collect();

        foreach ($scopes as $scope) {
            $rules = FeeStructureRule::where('scope_type', $scope['type'])
                ->where('scope_id', $scope['id'])
                ->whereHas('feeType') // Exclude orphaned rules whose FeeType was deleted
                ->where(function ($q) use ($studentSlots) {
                    $q->whereNull('fee_slot')
                      ->orWhereIn('fee_slot', $studentSlots);
                })
                ->where(function ($q) use ($today) {
                    $q->where(function ($inner) use ($today) {
                        $inner->whereNull('effective_from')
                              ->orWhere('effective_from', '<=', $today);
                    })->where(function ($inner) use ($today) {
                        $inner->whereNull('effective_to')
                              ->orWhere('effective_to', '>=', $today);
                    });
                })
                ->with('feeType')
                ->get();

            // Narrower scope overrides broader for the same fee_type_id
            foreach ($rules as $rule) {
                if ($rule->fee_type_id) {
                    $mergedRules[$rule->fee_type_id] = $rule;
                }
            }
        }

        return $mergedRules->values();
    }

    // ═══════════════════════════════════════════════════════════════════
    //  STUDENT SLOTS (FeeSlot Resolution)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Resolve the applicable FeeSlot values for a student profile.
     * Returns an array of slot strings (always includes null/default).
     */
    public function resolveStudentSlots(?string $category = null, ?string $gender = null): array
    {
        $slots = [null, FeeSlot::DEFAULT->value];

        $categorySlot = FeeSlot::resolveFromProfile($category);
        if ($categorySlot) {
            $slots[] = $categorySlot->value;
        }

        $genderSlot = FeeSlot::resolveFromGender($gender);
        if ($genderSlot) {
            $slots[] = $genderSlot->value;
        }

        return $slots;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  PRIVATE BUILDERS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Build a standardized breakdown from a FeeRegulationProfile.
     */
    private function buildBreakdownFromProfile(FeeRegulationProfile $profile): array
    {
        return $this->buildBreakdownFromProfileItems($profile->items, $profile->id);
    }

    /**
     * Build a standardized breakdown from a Collection of FeeRegulationProfileItems.
     */
    private function buildBreakdownFromProfileItems(Collection $items, ?int $profileId): array
    {
        $gross = 0.0;
        $discount = 0.0;

        $mappedItems = $items
            ->filter(fn(FeeRegulationProfileItem $item) => $item->feeType !== null) // Skip items whose FeeType was deleted
            ->map(function (FeeRegulationProfileItem $item) use (&$gross, &$discount) {
                $amount = abs((float) $item->amount);
                $isDiscount = $item->feeType?->category === FeeCategory::DISCOUNT->value;

                if ($isDiscount) {
                    $discount += $amount;
                } else {
                    $gross += $amount;
                }

                return [
                    'fee_type_id' => $item->fee_type_id,
                    'name'        => $item->feeType?->name ?? 'Fee',
                    'amount'      => $amount,
                    'type'        => $isDiscount ? 'discount' : 'charge',
                    'category'    => $item->feeType?->category,
                ];
            })->values()->all();

        return [
            'items'      => $mappedItems,
            'gross'      => round($gross, 2),
            'discount'   => round($discount, 2),
            'net'        => round($gross - $discount, 2),
            'profile_id' => $profileId,
        ];
    }

    /**
     * Build a standardized breakdown from FeeStructureRules.
     */
    private function buildBreakdownFromRules(Collection $rules, ?int $profileId): array
    {
        $gross = 0.0;
        $discount = 0.0;

        $items = $rules
            ->filter(fn(FeeStructureRule $rule) => $rule->feeType !== null) // Skip rules whose FeeType was deleted
            ->map(function (FeeStructureRule $rule) use (&$gross, &$discount) {
                $amount = abs((float) $rule->amount);
                $isDiscount = $rule->feeType?->category === FeeCategory::DISCOUNT->value;

                if ($isDiscount) {
                    $discount += $amount;
                } else {
                    $gross += $amount;
                }

                return [
                    'fee_type_id' => $rule->fee_type_id,
                    'name'        => $rule->feeType?->name ?? 'Fee',
                    'amount'      => $amount,
                    'type'        => $isDiscount ? 'discount' : 'charge',
                    'category'    => $rule->feeType?->category,
                ];
            })->values()->all();

        return [
            'items'      => $items,
            'gross'      => round($gross, 2),
            'discount'   => round($discount, 2),
            'net'        => round($gross - $discount, 2),
            'profile_id' => $profileId,
        ];
    }
}
