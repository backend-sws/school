<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\Session;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\DB;

class StudentIdentifierService
{
    /**
     * Generate a unique Registration Number.
     * Format: {INST_CODE}{YEAR}{SEQ6} e.g. PDSEDU2025000001
     */
    public function generateRegNumber(int $institutionId, int $sessionId): string
    {
        $rows = \App\Models\Setting::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institutionId)
            ->where('setting_group', 'admission')
            ->pluck('setting_value', 'setting_key');

        $customPrefix = $rows->get('reg_no_prefix');
        $includeYear = filter_var($rows->get('reg_no_include_year', '1'), FILTER_VALIDATE_BOOLEAN);
        $padding = (int) $rows->get('reg_no_sequence_padding', 6);
        if ($padding < 3 || $padding > 10) {
            $padding = 6;
        }

        if (is_null($customPrefix) || $customPrefix === '') {
            $institution = Institution::find($institutionId);
            $code = $this->resolveInstitutionCode($institution);
        } else {
            $code = $customPrefix;
        }
        
        if ($includeYear) {
            $session = Session::withoutGlobalScopes()->find($sessionId);
            $year = $session?->start_year ?? now()->year;
            $prefix = $code . $year;
        } else {
            $prefix = $code;
        }

        $lastRegNo = StudentProfile::where('institution_id', $institutionId)
            ->where('reg_no', 'like', $prefix . '%')
            ->orderByRaw('LENGTH(reg_no) DESC')
            ->orderBy('reg_no', 'desc')
            ->value('reg_no');

        if ($lastRegNo) {
            $lastSequence = (int) str_replace($prefix, '', $lastRegNo);
            $nextSequence = $lastSequence + 1;
        } else {
            $nextSequence = 1;
        }

        return $prefix . str_pad($nextSequence, $padding, '0', STR_PAD_LEFT);
    }

    /**
     * Generate a sequential Roll Number.
     * Uses numeric casting to ensure correct ordering (e.g., 10 > 9).
     */
    public function generateRollNumber(int $institutionId, int $sessionId, ?int $streamId = null): string
    {
        $query = StudentProfile::where('institution_id', $institutionId)
            ->where('session_id', $sessionId);

        if ($streamId) {
            $query->where('stream_id', $streamId);
        } else {
            $query->whereNull('stream_id');
        }

        $lastRoll = $query->selectRaw('MAX(CAST(NULLIF(roll_no, \'\') AS INTEGER)) as max_roll')->value('max_roll');
        
        $nextRoll = $lastRoll ? (int)$lastRoll + 1 : 1;
        
        return (string) $nextRoll;
    }

    /**
     * Resolve institution code or generate from name if missing.
     */
    protected function resolveInstitutionCode(?Institution $institution): string
    {
        $code = $institution?->code;

        if (empty($code)) {
            $words = preg_split('/[\s\-_]+/', trim($institution?->name ?? 'INST'));
            $code = collect($words)
                ->filter(fn($w) => strlen($w) > 0)
                ->map(fn($w) => strtoupper(mb_substr($w, 0, 1)))
                ->implode('');
        }

        return strtoupper($code);
    }
}
