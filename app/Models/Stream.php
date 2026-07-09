<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\Auditable;

class Stream extends Model
{
    use Auditable;

    use HasFactory, BelongsToDefaultInstitution;

    public $timestamps = false;

    protected $fillable = [
        'institution_id',
        'main_stream_id',
        'name',
        'code',
        'duration_years',
        'department_id',
        'status',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function mainStream(): BelongsTo
    {
        return $this->belongsTo(MainStream::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(StudentProfile::class);
    }

    public function admissionHeads(): HasMany
    {
        return $this->hasMany(AdmissionHead::class);
    }


    public function studentProfiles()
    {
        return $this->hasMany(StudentProfile::class, 'stream_id');
    }

    public function lmsClasses(): HasMany
    {
        return $this->hasMany(LmsClass::class, 'stream_id');
    }
}
