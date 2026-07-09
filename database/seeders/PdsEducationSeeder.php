<?php

namespace Database\Seeders;

use App\Enums\SubscriptionTier;
use App\Models\CertificateHead;
use App\Models\ClassSubjectAllocation;
use App\Models\Department;
use App\Models\FeeRegulationProfile;
use App\Models\FeeStructureRule;
use App\Models\FeeType;
use App\Models\Institution;
use App\Models\InstitutionDomain;
use App\Models\LmsClass;
use App\Models\MainStream;
use App\Models\Organization;
use App\Models\PeriodSlot;
use App\Models\Role;
use App\Models\Room;
use App\Models\Session;
use App\Models\Setting;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\SubjectCategory;
use App\Models\SubjectGroup;
use App\Models\TimetableTemplate;
use App\Models\User;
use App\Http\Middleware\ShareSeoSettings;
use App\Services\OnboardingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * PDS Education — Self-contained single-institution seeder.
 *
 * Designed for standalone VPS deployment. Seeds everything from scratch:
 * Organization → Institution → Users/Roles → Academics → Fees → Certificates → Timetable.
 *
 * Run:
 *   php artisan db:seed --class=PdsEducationSeeder
 */
class PdsEducationSeeder extends Seeder
{
    private string $dataDir;
    private int $institutionId;
    private string $institutionType;

    public function run(): void
    {
        $this->dataDir = __DIR__ . '/data/inst/pds-education';

        // 1. Organization → Institution → Domain
        $institution = $this->seedOrganisationAndInstitution();
        $this->institutionId = $institution->id;
        $this->institutionType = $institution->type?->value ?? config('ems.default_institution_type');

        // 2. Settings & Landing
        $this->seedInstitutionSettings();
        $this->seedSeoAndLanding();

        // 3. Users & Staff
        $this->seedUsers();
        $this->seedStaff($institution);

        // 3b. Subscription & Workflows (permissions for sidebar menus)
        $this->seedSubscription($institution);
        $this->seedWorkflows($institution);

        // 4. Academics
        $this->seedDepartments();
        $this->seedAcademicsAndClassrooms();

        // 5. Finance
        $this->seedFinances();
        $this->seedFeeStructureRules();
        $this->seedFeeRegulationProfiles();

        // 6. Certificates & Timetable
        $this->seedCertificates();
        $this->seedTimetable();

        $this->command->info('PDS Education seeding completed successfully!');
    }

    // ── 1. Organisation & Institution ────────────────────────────────────

    private function seedOrganisationAndInstitution(): Institution
    {
        $orgData = require $this->dataDir . '/organisation.php';
        $org = Organization::updateOrCreate(
            ['code' => $orgData['code']],
            $orgData
        );

        $instData = require $this->dataDir . '/institute.php';
        $domain = $instData['domain'] ?? null;
        unset($instData['domain']);

        // Brand tokens moved to settings table in migration 2026_03_20_230000
        $brandTokens = [
            'brand_theme' => $instData['brand_theme'] ?? 'pdseducation',
            'brand_font'  => $instData['brand_font'] ?? 'serif',
            'brand_color' => $instData['brand_color'] ?? '#D32F2F',
        ];
        unset($instData['brand_theme'], $instData['brand_font'], $instData['brand_color']);

        $institution = Institution::withoutGlobalScopes()->updateOrCreate(
            ['code' => $instData['code']],
            array_merge($instData, ['organization_id' => $org->id])
        );

        foreach ($brandTokens as $key => $value) {
            Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $institution->id, 'setting_key' => $key],
                ['setting_group' => 'brand', 'setting_value' => $value]
            );
        }

        if ($domain) {
            InstitutionDomain::updateOrCreate(
                ['domain' => $domain],
                ['institution_id' => $institution->id]
            );
        }

        return $institution;
    }

    // ── 2. Settings ─────────────────────────────────────────────────────

    private function seedInstitutionSettings(): void
    {
        $settings = require $this->dataDir . '/settings.php';
        foreach ($settings as $setting) {
            Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'setting_key' => $setting['setting_key']],
                [
                    'setting_group' => $setting['setting_group'],
                    'setting_value' => is_array($setting['setting_value'])
                        ? json_encode($setting['setting_value'])
                        : $setting['setting_value'],
                ]
            );
        }

        $feeCollectionSettings = require __DIR__ . '/data/fee_collection_settings.php';
        foreach ($feeCollectionSettings as $setting) {
            Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'setting_key' => $setting['setting_key']],
                [
                    'setting_group' => $setting['setting_group'],
                    'setting_value' => is_array($setting['setting_value'])
                        ? json_encode($setting['setting_value'])
                        : $setting['setting_value'],
                ]
            );
        }

        $academicCalendarSettings = require __DIR__ . '/data/academic_calendar_settings.php';
        foreach ($academicCalendarSettings as $setting) {
            Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'setting_key' => $setting['setting_key']],
                [
                    'setting_group' => $setting['setting_group'],
                    'setting_value' => $setting['setting_value'],
                ]
            );
        }
    }

    private function seedSeoAndLanding(): void
    {
        $seo = require $this->dataDir . '/seo.php';
        foreach ($seo as $key => $value) {
            Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'setting_key' => $key],
                ['setting_group' => 'seo', 'setting_value' => is_string($value) ? $value : (string) $value]
            );
        }
        ShareSeoSettings::clearCache($this->institutionId);

        $landingPage = require $this->dataDir . '/landing_page.php';
        foreach ($landingPage as $key => $value) {
            $settingValue = is_array($value) ? json_encode($value) : (string) $value;
            Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'setting_key' => $key],
                ['setting_group' => 'landing_page', 'setting_value' => $settingValue]
            );
        }
    }

    // ── 3. Users & Staff ────────────────────────────────────────────────

    private function seedUsers(): void
    {
        $allUsers = array_merge(
            require $this->dataDir . '/users.php',
            require $this->dataDir . '/students.php',
            require $this->dataDir . '/candidates.php',
        );

        foreach ($allUsers as $row) {
            $user = User::updateOrCreate(
                ['email' => $row['email']],
                [
                    'name'                      => $row['name'],
                    'institution_id'            => $this->institutionId,
                    'password'                  => Hash::make($row['password'] ?? 'password'),
                    'system_generated_password' => $row['system_generated_password'] ?? false,
                    'email_verified_at'         => now(),
                    'status'                    => 1,
                ]
            );

            $role = Role::withoutGlobalScope('institution_scope')
                ->where('key', $row['role'])
                ->first();

            if ($role) {
                DB::table('user_roles')->updateOrInsert(
                    [
                        'user_id'        => $user->id,
                        'role_id'        => $role->id,
                        'institution_id' => $this->institutionId,
                    ],
                    ['assigned_at' => now()]
                );
            }
        }
    }

    private function seedStaff(Institution $institution): void
    {
        $staff = require $this->dataDir . '/staff.php';
        if (empty($staff)) {
            return;
        }

        $staffSeeder = new StaffDirectorySeeder();
        $staffSeeder->setCommand($this->command);
        $staffSeeder->seedForInstitution($institution, $staff);
    }

    // ── 4. Academics ────────────────────────────────────────────────────

    private function seedDepartments(): void
    {
        $departments = require $this->dataDir . '/departments.php';
        foreach ($departments as $dept) {
            Department::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'code' => $dept['code'] ?? null],
                ['name' => $dept['name'], 'status' => 1]
            );
        }
    }

    private function seedAcademicsAndClassrooms(): void
    {
        $academics = require $this->dataDir . '/academics.php';
        $this->seedAcademicData($academics);
        $this->seedClassroomData($academics);
    }

    private function seedAcademicData(array $data): void
    {
        $id = $this->institutionId;

        foreach ($data['sessions'] as $sess) {
            DB::table('academic_sessions')->updateOrInsert(
                ['institution_id' => $id, 'start_year' => $sess['start_year'], 'end_year' => $sess['end_year']],
                ['name' => $sess['name'], 'is_current' => $sess['is_current']]
            );
        }

        foreach ($data['main_streams'] as $ms) {
            MainStream::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $id, 'code' => $ms['code']],
                ['name' => $ms['name'], 'status' => 1]
            );
        }

        foreach ($data['streams'] as $s) {
            $ms = MainStream::withoutGlobalScope('institution_scope')
                ->where('code', $s['main_stream_code'])
                ->where('institution_id', $id)
                ->first();
            if ($ms) {
                Stream::withoutGlobalScope('institution_scope')->updateOrCreate(
                    ['institution_id' => $id, 'code' => $s['code']],
                    ['main_stream_id' => $ms->id, 'name' => $s['name'], 'duration_years' => $s['duration'], 'status' => 1]
                );
            }
        }

        $groupModels = [];
        $categoryModels = [];
        foreach ($data['groups'] as $groupData) {
            $groupModels[$groupData['code']] = SubjectGroup::withoutGlobalScope('institution_scope')->firstOrCreate(
                ['code' => $groupData['code'], 'institution_id' => $id],
                ['name' => strtolower($groupData['name']), 'status' => 1]
            );
            $categoryModels[$groupData['code']] = SubjectCategory::withoutGlobalScope('institution_scope')->firstOrCreate(
                ['code' => $groupData['code'], 'institution_id' => $id],
                ['name' => strtoupper($groupData['name'])]
            );
        }

        $coreGroup = $groupModels['CORE'] ?? null;
        $coreCategory = $categoryModels['CORE'] ?? null;

        foreach ($data['subjects'] as $streamCode => $subs) {
            $streamId = Stream::withoutGlobalScope('institution_scope')
                ->where('code', $streamCode)
                ->where('institution_id', $id)
                ->value('id');
            if (!$streamId) {
                continue;
            }
            if ($coreGroup) {
                foreach ($subs as $name) {
                    $subject = Subject::withoutGlobalScope('institution_scope')->updateOrCreate(
                        [
                            'stream_id'        => $streamId,
                            'code'             => strtoupper(substr($name, 0, 3)) . '-' . $streamCode,
                            'subject_group_id' => $coreGroup->id,
                            'institution_id'   => $id,
                        ],
                        ['name' => strtolower($name), 'status' => 1]
                    );
                    if ($coreCategory) {
                        $subject->categories()->syncWithoutDetaching([$coreCategory->id]);
                    }
                }
            }
        }
    }

    private function seedClassroomData(array $data): void
    {
        $id = $this->institutionId;
        $sessions = Session::withoutGlobalScopes()->where('institution_id', $id)->orderByDesc('start_year')->limit(5)->get();
        $streams = Stream::withoutGlobalScopes()->where('institution_id', $id)->where('status', 1)->orderBy('name')->get();

        if ($sessions->isEmpty() || $streams->isEmpty()) {
            return;
        }

        $streamByCode = $streams->keyBy('code');
        $sections = $data['classrooms'] ?? $data['lms_sections'] ?? null;

        foreach ($sessions as $session) {
            if (is_array($sections)) {
                foreach ($sections as $row) {
                    $streamCode = $row['stream_code'] ?? null;
                    $section = $row['section'] ?? 'A';
                    if (!$streamCode) {
                        continue;
                    }
                    $stream = $streamByCode->get($streamCode);
                    if (!$stream) {
                        continue;
                    }
                    $this->createLmsClassIfMissing($id, $stream->id, $session->id, $section, $stream->name . ' – Section ' . $section);
                }
            } else {
                foreach ($streams as $stream) {
                    $this->createLmsClassIfMissing($id, $stream->id, $session->id, 'A', $stream->name . ' – Section A');
                }
            }
        }
    }

    private function createLmsClassIfMissing(int $institutionId, int $streamId, int $sessionId, string $section, string $name): void
    {
        $exists = LmsClass::withoutGlobalScopes()
            ->where('institution_id', $institutionId)
            ->where('stream_id', $streamId)
            ->where('session_id', $sessionId)
            ->where('section', $section)
            ->first();

        if (!$exists) {
            $words = preg_split('/\s+/', trim($name), -1, PREG_SPLIT_NO_EMPTY);
            $code = count($words) === 1
                ? strtoupper(mb_substr($words[0], 0, 3))
                : strtoupper(implode('', array_map(fn(string $w) => mb_substr($w, 0, 1), $words)));

            LmsClass::withoutGlobalScopes()->create([
                'institution_id' => $institutionId,
                'stream_id'      => $streamId,
                'session_id'     => $sessionId,
                'section'        => $section,
                'name'           => $name,
                'code'           => $code,
                'status'         => 1,
            ]);
        }

        // Auto-allocate subjects to this class
        $existingSubjectIds = ClassSubjectAllocation::withoutGlobalScopes()
            ->where('stream_id', $streamId)
            ->where('session_id', $sessionId)
            ->where('institution_id', $institutionId)
            ->pluck('subject_id');

        $missingSubjectIds = Subject::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institutionId)
            ->where('stream_id', $streamId)
            ->where('status', 1)
            ->whereNotIn('id', $existingSubjectIds)
            ->pluck('id');

        $rows = $missingSubjectIds->map(fn($subjectId) => [
            'institution_id' => $institutionId,
            'stream_id'      => $streamId,
            'session_id'     => $sessionId,
            'subject_id'     => $subjectId,
            'instructor_id'  => null,
            'created_at'     => now(),
            'updated_at'     => now(),
        ])->toArray();

        if (!empty($rows)) {
            ClassSubjectAllocation::withoutGlobalScopes()->insert($rows);
        }
    }

    // ── 5. Finance ──────────────────────────────────────────────────────

    private function seedFinances(): void
    {
        $feeParticulars = require $this->dataDir . '/fee_particulars.php';
        $categoryMap = ['variable' => 'variable', 'one_time' => 'one_time', 'one-time' => 'one_time'];

        foreach ($feeParticulars as $i => $fp) {
            $category = $categoryMap[strtolower($fp['type'] ?? '')] ?? 'recurring';
            FeeType::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'name' => $fp['name']],
                ['category' => $category, 'display_order' => $i]
            );
        }
    }

    private function seedFeeStructureRules(): void
    {
        $feeStructureFile = $this->dataDir . '/fee_structure.php';
        if (!file_exists($feeStructureFile)) {
            return;
        }

        $feeData = require $feeStructureFile;
        $classFees = $feeData['class_fees'] ?? [];

        $feeTypeIds = FeeType::withoutGlobalScope('institution_scope')
            ->where('institution_id', $this->institutionId)
            ->pluck('id', 'name');

        $currentSession = Session::withoutGlobalScopes()
            ->where('institution_id', $this->institutionId)
            ->where('is_current', true)
            ->first();

        if (!$currentSession) {
            return;
        }

        $streamIds = Stream::withoutGlobalScopes()
            ->where('institution_id', $this->institutionId)
            ->pluck('id', 'code');

        foreach ($classFees as $streamCode => $fees) {
            $streamId = $streamIds[$streamCode] ?? null;
            if (!$streamId) {
                continue;
            }

            $lmsClass = LmsClass::withoutGlobalScopes()
                ->where('institution_id', $this->institutionId)
                ->where('stream_id', $streamId)
                ->where('session_id', $currentSession->id)
                ->first();

            if (!$lmsClass) {
                continue;
            }

            foreach ($fees as $feeName => $amount) {
                $feeTypeId = $feeTypeIds[$feeName] ?? null;
                if (!$feeTypeId || $amount <= 0) {
                    continue;
                }

                FeeStructureRule::withoutGlobalScope('institution_scope')->updateOrCreate(
                    [
                        'institution_id' => $this->institutionId,
                        'fee_type_id'    => $feeTypeId,
                        'scope_type'     => FeeStructureRule::SCOPE_CLASS,
                        'scope_id'       => $lmsClass->id,
                    ],
                    ['amount' => $amount]
                );
            }
        }
    }

    private function seedFeeRegulationProfiles(): void
    {
        $profileFile = $this->dataDir . '/fee_profiles.php';
        if (!file_exists($profileFile)) {
            return;
        }

        $profileDefs = require $profileFile;

        $feeTypes = FeeType::withoutGlobalScope('institution_scope')
            ->where('institution_id', $this->institutionId)
            ->get()
            ->keyBy('name');

        foreach ($profileDefs as $profileData) {
            $items = $profileData['items'];
            unset($profileData['items']);

            $profile = FeeRegulationProfile::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'name' => $profileData['name']],
                [
                    'profile_type' => 'standard',
                    'gender'       => null,
                    'category'     => $profileData['category'] ?? null,
                    'description'  => $profileData['description'] ?? null,
                    'is_default'   => $profileData['is_default'] ?? false,
                ]
            );

            foreach ($items as $itemData) {
                $feeType = $feeTypes->get($itemData['name']);

                if (!$feeType) {
                    $feeType = FeeType::withoutGlobalScope('institution_scope')->create([
                        'institution_id' => $this->institutionId,
                        'name'           => $itemData['name'],
                        'category'       => $itemData['category'] ?? 'recurring',
                    ]);
                    $feeTypes->put($itemData['name'], $feeType);
                }

                $profile->items()->updateOrCreate(
                    ['fee_type_id' => $feeType->id],
                    ['amount' => $itemData['amount']]
                );
            }
        }
    }

    // ── 6. Certificates ─────────────────────────────────────────────────

    private function seedCertificates(): void
    {
        $certificateHeads = require $this->dataDir . '/certificate_heads.php';
        foreach ($certificateHeads as $ch) {
            CertificateHead::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $this->institutionId, 'title' => $ch['title']],
                [
                    'description'    => $ch['description'] ?? null,
                    'fee_amount'     => $ch['fee_amount'] ?? 0,
                    'processing_days' => $ch['processing_days'] ?? 7,
                    'status'         => 1,
                ]
            );
        }
    }

    // ── 7. Timetable ────────────────────────────────────────────────────

    private function seedTimetable(): void
    {
        $timetableFile = $this->dataDir . '/timetable.php';
        if (!file_exists($timetableFile)) {
            return;
        }

        $data = require $timetableFile;

        if (isset($data['rooms'])) {
            foreach ($data['rooms'] as $room) {
                Room::withoutGlobalScope('institution_scope')->updateOrCreate(
                    ['institution_id' => $this->institutionId, 'code' => $room['code']],
                    [
                        'name'     => $room['name'],
                        'capacity' => $room['capacity'] ?? null,
                        'type'     => $room['type'] ?? 'Classroom',
                        'is_active' => $room['is_active'] ?? true,
                    ]
                );
            }
        }

        if (isset($data['templates'])) {
            foreach ($data['templates'] as $templateData) {
                $template = TimetableTemplate::withoutGlobalScope('institution_scope')->updateOrCreate(
                    ['institution_id' => $this->institutionId, 'name' => $templateData['name']],
                    [
                        'type'       => $templateData['type'] ?? 'Academic',
                        'is_active'  => $templateData['is_active'] ?? true,
                        'is_default' => $templateData['is_default'] ?? false,
                    ]
                );

                if (isset($templateData['periods'])) {
                    foreach ($templateData['periods'] as $slotData) {
                        PeriodSlot::withoutGlobalScope('institution_scope')->updateOrCreate(
                            [
                                'timetable_template_id' => $template->id,
                                'name'                  => $slotData['name'],
                            ],
                            [
                                'start_time'  => $slotData['start_time'],
                                'end_time'    => $slotData['end_time'],
                                'type'        => $slotData['type'] ?? 'Class',
                                'sort_order'  => $slotData['sort_order'] ?? 0,
                            ]
                        );
                    }
                }
            }
        }
    }

    // ── 8. Subscription & Workflows ─────────────────────────────────────

    /**
     * Create a PLUS-tier subscription so all modules/features are unlocked.
     */
    private function seedSubscription(Institution $institution): void
    {
        $tier = SubscriptionTier::PLUS;
        $org  = $institution->organization;
        $cap  = fn($v) => min($v, 2147483647);

        $org->subscription()->updateOrCreate(
            ['organization_id' => $org->id],
            [
                'tier'                 => $tier->value,
                'billing_cycle'        => 'annual',
                'max_institutions'     => $cap($tier->maxInstitutions()),
                'max_users'            => $cap($tier->maxUsers()),
                'max_staff'            => $cap($tier->maxStaff()),
                'max_emails_per_month' => $cap($tier->maxEmailsPerMonth()),
                'storage_quota_gb'     => $cap($tier->storageQuotaGb()),
                'subscription_start'   => now(),
            ]
        );
    }

    /**
     * Activate all tier-based workflows for institution_admin users.
     * This grants the permissions that sidebar PermissionGate checks.
     */
    private function seedWorkflows(Institution $institution): void
    {
        $tier       = SubscriptionTier::PLUS;
        $onboarding = app(OnboardingService::class);

        $adminRole = Role::withoutGlobalScope('institution_scope')
            ->where('key', 'institution_admin')
            ->first();

        if (!$adminRole) {
            return;
        }

        $adminUserIds = DB::table('user_roles')
            ->where('role_id', $adminRole->id)
            ->where('institution_id', $institution->id)
            ->pluck('user_id');

        foreach ($adminUserIds as $userId) {
            $user = User::find($userId);
            if ($user) {
                // Detach existing workflows for this institution to avoid duplicates on re-seed
                $user->workflows()
                    ->wherePivot('institution_id', $institution->id)
                    ->detach();

                $onboarding->activateWorkflows($user, $institution, $tier);
            }
        }
    }
}
