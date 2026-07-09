<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\Auditable;

class Department extends Model
{
    use Auditable;

    use HasFactory, BelongsToDefaultInstitution;

    public $timestamps = false;
    protected $fillable = [
        'institution_id',
        'name',
        'code',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function streams(): HasMany
    {
        return $this->hasMany(Stream::class);
    }
}
