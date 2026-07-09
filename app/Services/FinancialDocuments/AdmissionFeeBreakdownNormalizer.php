<?php

namespace App\Services\FinancialDocuments;

use App\Models\FeeType;

final class AdmissionFeeBreakdownNormalizer
{
    /**
     * Normalize fallback admission fees[] rows into canonical fee_breakdown shape.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    public function normalize(array $rows): array
    {
        $feeTypeIds = collect($rows)
            ->map(function (array $row) {
                $rawId = $row['fee_type_id'] ?? $row['fee_particular_id'] ?? null;

                return is_numeric($rawId) ? (int) $rawId : null;
            })
            ->filter(fn (?int $id) => $id !== null && $id > 0)
            ->unique()
            ->values()
            ->all();

        $feeTypeMap = [];
        if ($feeTypeIds !== []) {
            $feeTypeMap = FeeType::withoutGlobalScope('institution_scope')
                ->whereIn('id', $feeTypeIds)
                ->get(['id', 'name', 'category'])
                ->keyBy('id');
        }

        return collect($rows)
            ->map(function (array $row) use ($feeTypeMap) {
                $rawId = $row['fee_type_id'] ?? $row['fee_particular_id'] ?? null;
                $feeTypeId = is_numeric($rawId) ? (int) $rawId : null;
                $feeType = $feeTypeId ? ($feeTypeMap[$feeTypeId] ?? null) : null;

                $resolvedLabel = trim((string) (
                    $row['name']
                    ?? $row['head_name']
                    ?? $row['fee_name']
                    ?? $row['fee_type']
                    ?? $row['label']
                    ?? $feeType?->name
                    ?? 'Fee'
                ));

                $resolvedType = strtolower((string) ($row['type'] ?? 'charge'));
                if ($resolvedType === '') {
                    $resolvedType = 'charge';
                }

                return [
                    'fee_type_id' => $feeTypeId,
                    'name' => $resolvedLabel !== '' ? $resolvedLabel : 'Fee',
                    'amount' => (float) ($row['amount'] ?? 0),
                    'type' => $resolvedType,
                    'category' => $row['category'] ?? $feeType?->category,
                ];
            })
            ->values()
            ->all();
    }
}
