<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class Subject extends Model
{
    use Auditable;

    use HasFactory, BelongsToDefaultInstitution;
    protected $fillable = ['stream_id', 'parent_id', 'name', 'code', 'status', 'subject_group_id', 'is_practical', 'institution_id'];

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class);
    }

    // // Recursion for sub-subjects
    // public function parent(): BelongsTo
    // {
    //     return $this->belongsTo(Subject::class, 'parent_id');
    // }



    public function studentProfiles(): HasMany
    {
        return $this->hasMany(StudentProfile::class);
    }
    public function categories()
    {
        return $this->belongsToMany(SubjectCategory::class, 'subject_category_mappings');
    }

    public function subjectGroup(): BelongsTo
    {
        return $this->belongsTo(SubjectGroup::class);
    }
}


