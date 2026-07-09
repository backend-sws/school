<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\Auditable;

class MainStream extends Model
{
    use Auditable;

    use HasFactory, BelongsToDefaultInstitution;
    protected $fillable = [
        'name',
        'code',
        'status',
        'institution_id',
    ];

    protected $casts = [
        'status' => 'integer',

    ];

    public $timestamps = false;
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_at = $model->freshTimestamp();
        });
    }

    public function streams(): HasMany
    {
        return $this->hasMany(Stream::class);
    }
}
