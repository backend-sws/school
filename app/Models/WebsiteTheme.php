<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteTheme extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'category',
        'description',
        'preview_colors',
        'preview_image',
        'is_system',
    ];

    protected $casts = [
        'preview_colors' => 'array',
        'is_system'      => 'boolean',
    ];
}
