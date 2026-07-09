<?php

namespace App\Http\Controllers\Api\V1\Settings;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Middleware\ShareSeoSettings;
use App\Models\AuditLog;
use App\Models\Institution;
use App\Models\Setting;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Settings keys that map to columns on the institutions table.
 * When these are updated in settings, we sync to institutions table too.
 *
 * Grouped by settings group for easy lookup in getByGroup overrides.
 */
const COLLEGE_TABLE_SYNC_MAP = [
    // general group (college.tsx)
    'college_name' => 'name',
    'college_code' => 'code',
    'college_logo' => 'logo_url',
    // social group (digital-presence.tsx)
    'contact_email' => 'email',
    'contact_phone' => 'phone',
    'full_address' => 'address',
    'college_website' => 'website',
];

/**
 * @OA\Schema(
 *     schema="Setting",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="institution_id", type="integer"),
 *     @OA\Property(property="key", type="string"),
 *     @OA\Property(property="value", type="string"),
 *     @OA\Property(property="type", type="string"),
 *     @OA\Property(property="group", type="string")
 * )
 */
class SettingController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/settings",
     *     summary="List settings",
     *     tags={"Settings"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="group", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="List of settings")
     * )
     */
    /**
     * List settings (scoped by institution via BelongsToDefaultInstitution trait).
     * institution_id is resolved server-side (single-institution UI with multi-tenant backend).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Setting::query();
        if ($request->has('group')) {
            $query->where('setting_group', $request->group);
        }
        return $this->success($query->get());
    }

    // create a new setting
    /**
     * @OA\Post(
     *     path="/settings",
     *     summary="Create a new setting",
     *     tags={"Settings"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"setting_key", "value"},
     *             @OA\Property(property="setting_key", type="string"),
     *             @OA\Property(property="value", type="string"),
     *             @OA\Property(property="setting_group", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Setting created successfully")
     * )
     *
     *
     */


    public function store(Request $request): JsonResponse
    {
        $validator = \Validator::make($request->all(), [
            'setting_key' => 'required|string|max:255|unique:settings,setting_key',
            'value' => 'required|string',
            'setting_group' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors(), 422);
        }

        $setting = Setting::create($validator->validated());
        return $this->successWithMap($setting, 'passthrough');
    }

    /**
     * @OA\Get(
     *     path="/settings/{key}",
     *     summary="Get setting by key",
     *     tags={"Settings"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="key", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Setting value")
     * )
     */
    public function show(Request $request, string $key): JsonResponse
    {

        $setting = Setting::where('setting_key', $key)->first();
        if (!$setting) {
            return $this->error('Setting not found', 404);
        }
        return $this->successWithMap($setting, 'passthrough');
    }



    /**
     * Get settings by group (e.g. general, social, landing_page, admission).
     * Scoped by college via BelongsToDefaultInstitution trait.
     */

    /**
     * @OA\Get(
     * path="/settings/group/{group}",
     * summary="Get settings by group name",
     * description="Retrieves all settings belonging to a specific group (e.g., general, admission, social).",
     * tags={"Settings"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="group",
     * in="path",
     * required=true,
     * description="Group name of the settings",
     * @OA\Schema(type="string", example="admission")
     * ),
     * @OA\Response(
     * response=200,
     * description="List of settings in the group",
     * @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Setting"))
     * ),
     * @OA\Response(response=404, description="Group not found")
     * )
     */
    public function getByGroup(string $group): JsonResponse
    {
        $settings = Setting::where('setting_group', $group)->get();

        // Override any synced fields with the institutions table (source of truth).
        $syncMap = COLLEGE_TABLE_SYNC_MAP;
        $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user())
            ?? config('ems.default_institution_id');
        $college = $collegeId ? Institution::find($collegeId) : null;

        if ($college) {
            foreach ($settings as $setting) {
                $col = $syncMap[$setting->setting_key] ?? null;
                if ($col && $college->{$col} !== null) {
                    $setting->setting_value = $college->{$col};
                }
            }
        }

        return $this->success($settings);
    }

    /**
     * Bulk update settings for a group.
     * institution_id is resolved by BelongsToDefaultInstitution trait (not exposed to client).
     */

    /**
     * @OA\Put(
     * path="/settings/group/{group}",
     * summary="Bulk update settings for a specific group",
     * description="Updates multiple settings at once while enforcing they belong to the specified group.",
     * tags={"Settings"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="group",
     * in="path",
     * required=true,
     * description="Group name to update settings for",
     * @OA\Schema(type="string", example="admission")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"settings"},
     * @OA\Property(
     * property="settings",
     * type="array",
     * @OA\Items(
     * required={"setting_key", "value"},
     * @OA\Property(property="setting_key", type="string", example="admission_open"),
     * @OA\Property(property="value", type="string", example="yes"),
     * @OA\Property(property="group", type="string", example="admission")
     * )
     * )
     * )
     * ),
     * @OA\Response(response=200, description="Settings updated successfully"),
     * @OA\Response(response=422, description="Validation failed")
     * )
     */
    public function updateByGroup(Request $request, string $group): JsonResponse
    {
        $validator = \Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.setting_key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.group' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $collegeSyncData = [];
        $updatedKeys = [];

        foreach ($request->settings as $setting) {
            Setting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                [
                    'setting_value' => $setting['value'] ?? '',
                    'setting_group' => $setting['group'] ?? $group,
                    'updated_by' => auth()->id(),
                ]
            );
            $updatedKeys[] = $setting['setting_key'];

            // Collect fields that need syncing to the institutions table
            $col = COLLEGE_TABLE_SYNC_MAP[$setting['setting_key']] ?? null;
            if ($col && !empty($setting['value'])) {
                $collegeSyncData[$col] = $setting['value'];
            }
        }

        // One audit log for the whole bulk update (one user action = one log)
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'updated',
            'entity_type' => 'Setting',
            'entity_id' => null,
            'old_values' => null,
            'new_values' => [
                'group' => $group,
                'updated_keys' => $updatedKeys,
                'count' => count($updatedKeys),
            ],
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ]);

        // Sync collected changes to the institutions table
        if (!empty($collegeSyncData)) {
            $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user())
                ?? config('ems.default_institution_id');

            if ($collegeId) {
                Institution::where('id', $collegeId)->update($collegeSyncData);
            }
        }

        // Clear SEO cache when SEO settings are updated
        if ($group === 'seo') {
            $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user())
                ?? (int) config('ems.default_institution_id', 1);
            ShareSeoSettings::clearCache($collegeId);
        }

        $cacheInstitutionId = InstitutionContext::getActiveInstitutionId(auth()->user())
            ?? config('ems.default_institution_id');
        Cache::forget('institution_profile_' . $cacheInstitutionId);

        return $this->success(null, 'Settings updated');
    }

    /**
     * @OA\Put(
     * path="/settings",
     * summary="Bulk update settings",
     * description="Updates multiple settings at once using an array of setting objects.",
     * tags={"Settings"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"settings"},
     * @OA\Property(
     * property="settings",
     * type="array",
     * @OA\Items(
     * required={"setting_key", "value"},
     * @OA\Property(property="setting_key", type="string", example="site_name"),
     * @OA\Property(property="value", type="string", example="G.D. College"),
     * @OA\Property(property="group", type="string", example="general")
     * )
     * )
     * )
     * ),
     * @OA\Response(response=200, description="Settings updated successfully"),
     * @OA\Response(response=422, description="Validation Error")
     * )
     */

    public function update(Request $request): JsonResponse
    {
        $validator = \Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.setting_key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.group' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors(), 422);
        }

        $collegeSyncData = [];
        $updatedKeys = [];

        foreach ($request->settings as $setting) {
            Setting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                [
                    'setting_value' => $setting['value'] ?? '',
                    'setting_group' => $setting['group'] ?? null,
                    'updated_by' => auth()->id()
                ]
            );
            $updatedKeys[] = $setting['setting_key'];

            // Collect fields that need syncing to the institutions table
            $col = COLLEGE_TABLE_SYNC_MAP[$setting['setting_key']] ?? null;
            if ($col && !empty($setting['value'])) {
                $collegeSyncData[$col] = $setting['value'];
            }
        }

        // One audit log for the whole bulk update (one user action = one log)
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'updated',
            'entity_type' => 'Setting',
            'entity_id' => null,
            'old_values' => null,
            'new_values' => [
                'updated_keys' => $updatedKeys,
                'count' => count($updatedKeys),
            ],
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ]);

        // Sync collected changes to the institutions table
        if (!empty($collegeSyncData)) {
            $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user())
                ?? config('ems.default_institution_id');

            if ($collegeId) {
                Institution::where('id', $collegeId)->update($collegeSyncData);
            }
        }

        $cacheInstitutionId = InstitutionContext::getActiveInstitutionId(auth()->user())
            ?? config('ems.default_institution_id');
        Cache::forget('institution_profile_' . $cacheInstitutionId);

        return $this->success(null, 'Settings updated');
    }
}
