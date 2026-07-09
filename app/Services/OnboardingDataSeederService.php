<?php

namespace App\Services;

use Database\Seeders\FeeRegulationProfileSeeder;

use App\Models\CertificateHead;
use App\Models\Department;
use App\Models\FeeType;
use App\Models\Institution;
use App\Models\LmsClass;
use App\Models\MainStream;
use App\Models\Room;
use App\Models\Session;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\SubjectGroup;

/**
 * Polymorphic onboarding data seeder.
 *
 * Uses a CATEGORY_META map to drive generic seeding.
 * Data is scope-type-aware: school gets different defaults than college.
 * All methods are idempotent — they skip records that already exist.
 */
class OnboardingDataSeederService
{
    /**
     * Polymorphic category metadata.
     * Simple categories use seedSimple(). Custom categories use dedicated methods.
     *
     * Keys:
     *   model     — Eloquent model class
     *   configKey — key in config/onboarding_defaults.php
     *   nameField — field used for idempotency check
     *   fields    — fields to extract from config data
     *   csvHeaders — column headers for CSV template download
     *   defaults  — extra default values to merge on create
     */
    private const CATEGORY_META = [
        'fee-types' => [
            'model'      => FeeType::class,
            'configKey'  => 'fee_types',
            'nameField'  => 'name',
            'fields'     => ['name', 'category'],
            'csvHeaders' => ['name', 'category'],
            'defaults'   => [],
        ],
        'streams' => [
            'model'      => MainStream::class,
            'configKey'  => 'streams',
            'nameField'  => 'name',
            'fields'     => ['name', 'code'],
            'csvHeaders' => ['name', 'code'],
            'defaults'   => ['status' => 1],
        ],
        'departments' => [
            'model'      => Department::class,
            'configKey'  => 'departments',
            'nameField'  => 'name',
            'fields'     => ['name', 'code'],
            'csvHeaders' => ['name', 'code'],
            'defaults'   => ['status' => 1],
        ],
        'certificate-heads' => [
            'model'      => CertificateHead::class,
            'configKey'  => 'certificate_heads',
            'nameField'  => 'title',
            'fields'     => ['title', 'description', 'fee_amount', 'processing_days'],
            'csvHeaders' => ['title', 'description', 'fee_amount', 'processing_days'],
            'defaults'   => ['status' => 1],
        ],
        'subject-groups' => [
            'model'      => SubjectGroup::class,
            'configKey'  => 'subject_groups',
            'nameField'  => 'name',
            'fields'     => ['name', 'code'],
            'csvHeaders' => ['name', 'code'],
            'defaults'   => ['status' => 1],
        ],
        'rooms' => [
            'model'      => Room::class,
            'configKey'  => 'rooms',
            'nameField'  => 'name',
            'fields'     => ['name', 'code', 'building', 'floor', 'capacity', 'type'],
            'csvHeaders' => ['name', 'code', 'building', 'floor', 'capacity', 'type'],
            'defaults'   => ['is_active' => true],
        ],
    ];

    /**
     * Categories with custom seed logic (not handled by seedSimple).
     * Maps category slug → method name.
     */
    private const CUSTOM_SEEDERS = [
        'classes'      => 'seedClasses',
        'subjects'     => 'seedSubjects',
        'sessions'     => 'seedSessions',
        'lms-classes'  => 'seedLmsClasses',
        'fee-profiles' => 'seedFeeProfiles',
    ];

    /**
     * CSV headers for custom categories (not in CATEGORY_META).
     */
    private const CUSTOM_CSV_HEADERS = [
        'classes'  => ['name', 'code', 'main_stream'],
        'subjects' => ['name', 'code', 'type'],
        'sessions' => ['name', 'start_year', 'end_year', 'is_current'],
    ];

    /**
     * Mandatory seeders that auto-run during Platform Setup.
     * Order matters: dependencies first (streams → classes → subjects).
     */
    private const MANDATORY_SEEDERS = [
        'fee-types',
        'fee-profiles',
        'sessions',
        'streams',
        'classes',
        'subjects',
        'lms-classes',
        'certificate-heads',
    ];

    // ─── Public API ──────────────────────────────────────────────────

    /**
     * Seed a category for the given institution.
     *
     * @throws \InvalidArgumentException if category is unknown
     */
    public function seed(string $category, Institution $institution): int
    {
        // Simple categories
        if (isset(self::CATEGORY_META[$category])) {
            return $this->seedSimple($category, $institution);
        }

        // Custom categories
        $method = self::CUSTOM_SEEDERS[$category] ?? null;
        if ($method && method_exists($this, $method)) {
            return $this->{$method}($institution);
        }

        throw new \InvalidArgumentException("Unknown seed category: {$category}");
    }

    /**
     * Seed all categories for an institution.
     */
    public function seedAll(Institution $institution): array
    {
        $results = [];
        foreach ($this->allCategories() as $category) {
            try {
                $results[$category] = $this->seed($category, $institution);
            } catch (\Throwable $e) {
                $results[$category] = 0;
            }
        }
        return $results;
    }

    /**
     * Seed only the mandatory categories (auto-run during Platform Setup).
     */
    public function seedMandatory(Institution $institution): array
    {
        $results = [];
        foreach (self::MANDATORY_SEEDERS as $category) {
            try {
                $results[$category] = $this->seed($category, $institution);
            } catch (\Throwable $e) {
                $results[$category] = 0;
            }
        }
        return $results;
    }

    /**
     * Get all available category keys.
     */
    public static function categories(): array
    {
        return array_unique(array_merge(
            array_keys(self::CATEGORY_META),
            array_keys(self::CUSTOM_SEEDERS)
        ));
    }

    /**
     * Get CSV column headers for a category.
     */
    public static function csvHeaders(string $category): ?array
    {
        if (isset(self::CATEGORY_META[$category])) {
            return self::CATEGORY_META[$category]['csvHeaders'];
        }
        return self::CUSTOM_CSV_HEADERS[$category] ?? null;
    }

    /**
     * Get sample CSV data rows for a category and institution type.
     */
    public function csvSampleData(string $category, string $type): array
    {
        if ($category === 'sessions') {
            $currentYear = (int) date('Y');
            return [
                ['name' => ($currentYear - 1) . '-' . substr($currentYear, 2),     'start_year' => $currentYear - 1, 'end_year' => $currentYear,     'is_current' => 'no'],
                ['name' => $currentYear . '-' . substr($currentYear + 1, 2),       'start_year' => $currentYear,     'end_year' => $currentYear + 1, 'is_current' => 'yes'],
                ['name' => ($currentYear + 1) . '-' . substr($currentYear + 2, 2), 'start_year' => $currentYear + 1, 'end_year' => $currentYear + 2, 'is_current' => 'no'],
            ];
        }

        $configKey = self::CATEGORY_META[$category]['configKey']
            ?? str_replace('-', '_', $category);

        return $this->getDefaultData($configKey, $type);
    }

    // ─── Generic Seeder (handles all simple categories) ──────────────

    /**
     * Generic seed method driven by CATEGORY_META.
     * Handles: fee-types, streams (MainStream), departments, certificate-heads, subject-groups, rooms.
     */
    private function seedSimple(string $category, Institution $institution): int
    {
        $meta = self::CATEGORY_META[$category];
        $type = $this->resolveType($institution);
        $data = $this->getDefaultData($meta['configKey'], $type);
        $model = $meta['model'];
        $nameField = $meta['nameField'];

        $existing = $model::where('institution_id', $institution->id)
            ->pluck($nameField)
            ->map(fn ($n) => strtolower($n))
            ->flip();

        $created = 0;
        foreach ($data as $item) {
            if ($existing->has(strtolower($item[$nameField] ?? ''))) continue;

            $model::create(array_merge(
                ['institution_id' => $institution->id],
                $meta['defaults'],
                array_intersect_key($item, array_flip($meta['fields']))
            ));
            $created++;
        }
        return $created;
    }

    // ─── Custom Seeders (complex logic that can't be generic) ────────

    /**
     * Seed classes (Stream model). Needs main_stream_id resolution.
     */
    private function seedClasses(Institution $institution): int
    {
        $type = $this->resolveType($institution);
        $data = $this->getDefaultData('classes', $type);
        $existing = Stream::where('institution_id', $institution->id)
            ->pluck('name')->map(fn ($n) => strtolower($n))->flip();

        $created = 0;
        foreach ($data as $item) {
            if ($existing->has(strtolower($item['name']))) continue;

            $mainStream = null;
            if (!empty($item['main_stream'])) {
                $mainStream = MainStream::where('institution_id', $institution->id)
                    ->where('name', $item['main_stream'])->first();
            }

            Stream::create([
                'institution_id' => $institution->id,
                'main_stream_id' => $mainStream?->id,
                'name'           => $item['name'],
                'code'           => $item['code'] ?? null,
                'status'         => 1,
            ]);
            $created++;
        }
        return $created;
    }

    /**
     * Seed subjects per-stream. Each class gets its own set of subjects.
     */
    private function seedSubjects(Institution $institution): int
    {
        $type = $this->resolveType($institution);
        $data = $this->getDefaultData('subjects', $type);

        $streams = Stream::where('institution_id', $institution->id)
            ->where('status', 1)->get();

        if ($streams->isEmpty()) {
            return 0;
        }

        // Build existing lookup: "stream_id:lowered_name" → true
        $existing = Subject::where('institution_id', $institution->id)
            ->get(['stream_id', 'name'])
            ->mapWithKeys(fn ($s) => [$s->stream_id . ':' . strtolower($s->name) => true]);

        $created = 0;
        foreach ($streams as $stream) {
            foreach ($data as $item) {
                $key = $stream->id . ':' . strtolower($item['name']);
                if ($existing->has($key)) continue;

                Subject::create([
                    'institution_id' => $institution->id,
                    'stream_id'      => $stream->id,
                    'name'           => $item['name'],
                    'code'           => $item['code'] ?? null,
                    'is_practical'   => ($item['type'] ?? 'theory') === 'practical',
                    'status'         => 1,
                ]);
                $created++;
            }
        }
        return $created;
    }

    /**
     * Seed LMS classes: one per Stream + current Session.
     * Bridges the gap between academic Streams and the LMS classrooms page.
     */
    private function seedLmsClasses(Institution $institution): int
    {
        $currentSession = Session::where('institution_id', $institution->id)
            ->where('is_current', true)->first();

        if (!$currentSession) {
            return 0;
        }

        $streams = Stream::where('institution_id', $institution->id)
            ->where('status', 1)->get();

        if ($streams->isEmpty()) {
            return 0;
        }

        // Existing LMS classes for this session: "stream_id" => true
        $existing = LmsClass::where('institution_id', $institution->id)
            ->where('session_id', $currentSession->id)
            ->pluck('stream_id')
            ->flip();

        $created = 0;
        foreach ($streams as $stream) {
            if ($existing->has($stream->id)) continue;

            LmsClass::create([
                'institution_id' => $institution->id,
                'stream_id'      => $stream->id,
                'session_id'     => $currentSession->id,
                'name'           => $stream->name,
                'code'           => $stream->code,
                'section'        => 'A',
                'status'         => 1,
            ]);
            $created++;
        }
        return $created;
    }

    /**
     * Seed academic sessions. Dynamic year-based data.
     */
    private function seedSessions(Institution $institution): int
    {
        $currentYear = (int) date('Y');
        $data = [
            ['name' => ($currentYear - 1) . '-' . substr($currentYear, 2),     'start_year' => $currentYear - 1, 'end_year' => $currentYear,     'is_current' => false],
            ['name' => $currentYear . '-' . substr($currentYear + 1, 2),       'start_year' => $currentYear,     'end_year' => $currentYear + 1, 'is_current' => true],
            ['name' => ($currentYear + 1) . '-' . substr($currentYear + 2, 2), 'start_year' => $currentYear + 1, 'end_year' => $currentYear + 2, 'is_current' => false],
        ];

        $existing = Session::where('institution_id', $institution->id)
            ->pluck('name')->map(fn ($n) => strtolower($n))->flip();

        $created = 0;
        foreach ($data as $item) {
            if ($existing->has(strtolower($item['name']))) continue;
            Session::create([
                'institution_id' => $institution->id,
                'name'           => $item['name'],
                'start_year'     => $item['start_year'],
                'end_year'       => $item['end_year'],
                'is_current'     => $item['is_current'],
                'status'         => 1,
            ]);
            $created++;
        }
        return $created;
    }

    /**
     * Seed fee regulation profiles for an institution.
     * Delegates to the existing FeeRegulationProfileSeeder which has
     * comprehensive per-institution-type profile data.
     */
    private function seedFeeProfiles(Institution $institution): int
    {
        $allProfileData = require database_path('seeders/data/fee_profiles.php');
        $type = $this->resolveType($institution);
        $profileDefs = $allProfileData[$type] ?? $allProfileData['school'] ?? [];

        $existingCount = \App\Models\FeeRegulationProfile::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institution->id)->count();

        (new FeeRegulationProfileSeeder())->seedForInstitution($institution, $profileDefs);

        $newCount = \App\Models\FeeRegulationProfile::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institution->id)->count();

        return $newCount - $existingCount;
    }

    // ─── Helpers ──────────────────────────────────────────────────────

    private function resolveType(Institution $institution): string
    {
        return $institution->type?->value ?? config('ems.default_institution_type', 'school');
    }

    private function getDefaultData(string $configKey, string $type): array
    {
        $all = config("onboarding_defaults.{$configKey}", []);
        return $all[$type] ?? $all['school'] ?? [];
    }

    /**
     * Internal: all registered category keys.
     */
    private function allCategories(): array
    {
        return array_unique(array_merge(
            array_keys(self::CATEGORY_META),
            array_keys(self::CUSTOM_SEEDERS)
        ));
    }
}
