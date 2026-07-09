<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;

class WebsiteSectionOrder extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'page_slug',
        'section_id',
        'sort_order',
        'is_visible',
        'custom_props',
    ];

    protected $casts = [
        'is_visible'   => 'boolean',
        'custom_props' => 'array',
    ];
}
