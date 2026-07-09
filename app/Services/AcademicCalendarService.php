<?php

namespace App\Services;

use App\Models\Session;
use App\Models\Setting;
use Carbon\Carbon;

class AcademicCalendarService
{
    public const SETTING_GROUP = 'academic_calendar';

    public const KEY_START_MONTH = 'session_start_month';

    public const DEFAULT_START_MONTH = 4;

    private const MONTH_NAMES = [
        1 => 'January',
        2 => 'February',
        3 => 'March',
        4 => 'April',
        5 => 'May',
        6 => 'June',
        7 => 'July',
        8 => 'August',
        9 => 'September',
        10 => 'October',
        11 => 'November',
        12 => 'December',
    ];

    public function getStartMonth(int $institutionId): int
    {
        $value = Setting::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institutionId)
            ->where('setting_group', self::SETTING_GROUP)
            ->where('setting_key', self::KEY_START_MONTH)
            ->value('setting_value');

        $month = (int) ($value ?: self::DEFAULT_START_MONTH);

        return ($month >= 1 && $month <= 12) ? $month : self::DEFAULT_START_MONTH;
    }

    /**
     * @return array{session_start_month: int, start_month_label: string, expected_session: array{start_year: int, end_year: int, name: string}}
     */
    public function getSettings(int $institutionId, int $durationYears = 1): array
    {
        $startMonth = $this->getStartMonth($institutionId);
        $expected = $this->resolveExpectedSessionYears($institutionId, null, $durationYears);

        return [
            'session_start_month' => $startMonth,
            'start_month_label' => self::MONTH_NAMES[$startMonth],
            'expected_session' => [
                'start_year' => $expected['start_year'],
                'end_year' => $expected['end_year'],
                'name' => "{$expected['start_year']}-{$expected['end_year']}",
            ],
        ];
    }

    public function updateStartMonth(int $institutionId, int $startMonth): void
    {
        Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
            [
                'institution_id' => $institutionId,
                'setting_key' => self::KEY_START_MONTH,
            ],
            [
                'setting_value' => (string) $startMonth,
                'setting_group' => self::SETTING_GROUP,
            ]
        );
    }

    /**
     * @return array{start_year: int, end_year: int}
     */
    public function resolveExpectedSessionYears(
        int $institutionId,
        ?Carbon $date = null,
        int $durationYears = 1
    ): array {
        $date = $date ?? now();
        $startMonth = $this->getStartMonth($institutionId);
        $durationYears = max(1, $durationYears);

        $startYear = $date->month < $startMonth ? $date->year - 1 : $date->year;

        return [
            'start_year' => $startYear,
            'end_year' => $startYear + $durationYears,
        ];
    }

    public function suggestSessionForDuration(int $institutionId, int $durationYears = 1): array
    {
        $years = $this->resolveExpectedSessionYears($institutionId, null, $durationYears);

        return [
            ...$years,
            'name' => "{$years['start_year']}-{$years['end_year']}",
            'session_start_month' => $this->getStartMonth($institutionId),
            'start_month_label' => self::MONTH_NAMES[$this->getStartMonth($institutionId)],
        ];
    }

    public function resolveCurrentSession(int $institutionId, int $durationYears = 1): ?Session
    {
        $baseQuery = Session::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institutionId)
            ->where('status', 1);

        // 1. Prioritize manually flagged current session (active in settings)
        $flagged = (clone $baseQuery)
            ->where('is_current', true)
            ->first();

        if ($flagged) {
            return $flagged;
        }

        // 2. Fall back to dynamic calendar calculation based on current date
        $years = $this->resolveExpectedSessionYears($institutionId, null, $durationYears);

        $exact = (clone $baseQuery)
            ->where('start_year', $years['start_year'])
            ->where('end_year', $years['end_year'])
            ->first();

        if ($exact) {
            return $exact;
        }

        $byStartYear = (clone $baseQuery)
            ->where('start_year', $years['start_year'])
            ->orderByDesc('end_year')
            ->first();

        if ($byStartYear) {
            return $byStartYear;
        }

        return (clone $baseQuery)->orderByDesc('start_year')->first();
    }

    public function syncCurrentFlag(int $institutionId, int $durationYears = 1): ?Session
    {
        $session = $this->resolveCurrentSession($institutionId, $durationYears);

        if (!$session) {
            return null;
        }

        Session::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institutionId)
            ->where('id', '!=', $session->id)
            ->update(['is_current' => false]);

        if (!$session->is_current) {
            $session->update(['is_current' => true]);
            $session->refresh();
        }

        return $session;
    }

    public static function monthLabel(int $month): string
    {
        return self::MONTH_NAMES[$month] ?? self::MONTH_NAMES[self::DEFAULT_START_MONTH];
    }
}
