<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/**
 * Move brand tokens (brand_theme, brand_font, brand_color) from
 * the institutions table to the settings table (group: website_branding).
 *
 * Single source of truth is now the settings table, matching the pattern
 * used by WebsiteBuilderService for nav config (setting_group = website_nav).
 */
return new class extends Migration
{
    private const BRANDING_GROUP = 'website_branding';
    private const KEYS = ['brand_theme', 'brand_font', 'brand_color'];

    public function up(): void
    {
        // 1. Copy existing values from institution → settings
        $institutionId = config('ems.default_institution_id');
        if ($institutionId) {
            $institution = DB::table('institutions')->find($institutionId);
            if ($institution) {
                foreach (self::KEYS as $key) {
                    $value = $institution->{$key} ?? null;
                    if ($value) {
                        DB::table('settings')->updateOrInsert(
                            [
                                'setting_group' => self::BRANDING_GROUP,
                                'setting_key'   => $key,
                            ],
                            [
                                'setting_value'  => $value,
                                'institution_id' => $institutionId,
                            ]
                        );
                    }
                }
            }
        }

        // 2. Drop the columns from institutions
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropColumn(self::KEYS);
        });

        // 3. Clear stale institution profile cache
        if ($institutionId) {
            Cache::forget('institution_profile_' . (int) $institutionId);
        }
    }

    public function down(): void
    {
        // 1. Re-add the columns
        Schema::table('institutions', function (Blueprint $table) {
            $table->string('brand_theme', 32)->nullable();
            $table->string('brand_font', 32)->nullable();
            $table->string('brand_color', 32)->nullable();
        });

        // 2. Copy values back from settings → institution
        $institutionId = config('ems.default_institution_id');
        if ($institutionId) {
            $settings = DB::table('settings')
                ->where('setting_group', self::BRANDING_GROUP)
                ->whereIn('setting_key', self::KEYS)
                ->pluck('setting_value', 'setting_key')
                ->toArray();

            if (!empty($settings)) {
                DB::table('institutions')
                    ->where('id', $institutionId)
                    ->update($settings);
            }
        }
    }
};
