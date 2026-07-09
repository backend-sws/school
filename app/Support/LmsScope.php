<?php

namespace App\Support;

use App\Enums\LmsScopeType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Resolve current LMS context scope and apply visibility to course queries.
 * Active institution always from InstitutionContext; optional scope_type/scope_id from request/session.
 */
class LmsScope
{
    public static function currentScope(?Request $request = null): array
    {
        $request = $request ?? request();
        $scopeType = $request->query('scope_type') ?? $request->session()->get('lms_scope_type');
        $scopeId = $request->query('scope_id');
        if ($scopeId !== null) {
            $scopeId = is_numeric($scopeId) ? (int) $scopeId : null;
        } else {
            $scopeId = $request->session()->get('lms_scope_id');
        }
        return [
            'scope_type' => $scopeType && in_array($scopeType, LmsScopeType::values(), true) ? $scopeType : null,
            'scope_id' => $scopeId,
        ];
    }

    /**
     * Apply visibility filter to an lms_courses query: institution_id already applied by model scope;
     * optionally filter by context scope (show global or matching scope_type/scope_id).
     */
    public static function applyScope(Builder $query, string $table = 'lms_courses'): Builder
    {
        $scope = self::currentScope();
        if ($scope['scope_type'] === null || $scope['scope_id'] === null) {
            return $query;
        }
        $query->where(function (Builder $q) use ($table, $scope) {
            $q->where($table . '.scope_type', LmsScopeType::GLOBAL->value)
                ->whereNull($table . '.scope_id')
                ->orWhere(function (Builder $q2) use ($table, $scope) {
                    $q2->where($table . '.scope_type', $scope['scope_type'])
                        ->where($table . '.scope_id', $scope['scope_id']);
                });
        });
        return $query;
    }

    /** Validate that scope_id belongs to active institution (for create/update). */
    public static function validateScopeId(string $scopeType, ?int $scopeId, int $institutionId): bool
    {
        if ($scopeType === LmsScopeType::GLOBAL->value) {
            return $scopeId === null;
        }
        if ($scopeId === null) {
            return false;
        }
        return match ($scopeType) {
            LmsScopeType::STREAM->value => \App\Models\Stream::where('id', $scopeId)->where('institution_id', $institutionId)->exists(),
            LmsScopeType::DEPARTMENT->value => \App\Models\Department::where('id', $scopeId)->where('institution_id', $institutionId)->exists(),
            LmsScopeType::SESSION->value => \App\Models\Session::where('id', $scopeId)->where('institution_id', $institutionId)->exists(),
            default => false,
        };
    }
}
