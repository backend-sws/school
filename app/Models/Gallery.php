<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\Auditable;

class Gallery extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    public $timestamps = false;

    protected $table = 'image_galleries';
    protected $fillable = [
        'institution_id',
        'title',
        'description',
        'created_at',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function images(): HasMany
    {
        return $this->hasMany(GalleryImage::class);
    }
}
