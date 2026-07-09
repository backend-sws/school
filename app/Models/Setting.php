<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;

/**
 * Setting does not use Auditable: bulk updates (e.g. save entire settings group)
 * are logged once per request in SettingController to avoid one action → many logs.
 */
class Setting extends Model
{
    use BelongsToDefaultInstitution;

    public $timestamps = false;
    protected $table = 'settings';

    protected $fillable = ['setting_key', 'setting_value',  'setting_group', 'institution_id', 'updated_by'];

    protected $casts = [
       'updated_by' => 'integer'
    ];

    // ─── Website Branding Helpers ────────────────────────────────

    private const BRANDING_GROUP = 'website_branding';

    /**
     * Read a single branding setting (brand_theme, brand_font, brand_color).
     */
    public static function getBranding(string $key): ?string
    {
        return static::where('setting_group', self::BRANDING_GROUP)
            ->where('setting_key', $key)
            ->value('setting_value');
    }

    /**
     * Write a single branding setting.
     */
    public static function setBranding(string $key, string $value): void
    {
        static::updateOrCreate(
            [
                'setting_key'   => $key,
            ],
            [
                'setting_group' => self::BRANDING_GROUP,
                'setting_value' => $value,
            ]
        );
    }
}
