<?php

namespace App\Models;

use App\Enums\LmsScopeType;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class LmsCourse extends Model
{
    use BelongsToDefaultInstitution;

    protected $table = 'lms_courses';

    protected $fillable = [
        'institution_id',
        'scope_type',
        'scope_id',
        'stream_id',
        'subject_id',
        'session_id',
        'title',
        'slug',
        'description',
        'status',
        'instructor_id',
        'created_by',
    ];

    protected $casts = [
        'scope_type' => 'string',
        'scope_id' => 'integer',
        'status' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (LmsCourse $model) {
            if (empty($model->slug) && ! empty($model->title)) {
                $model->slug = Str::slug($model->title);
            }
            if (empty($model->scope_type)) {
                $model->scope_type = LmsScopeType::GLOBAL->value;
            }
        });
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(CourseSection::class, 'lms_course_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class, 'lms_course_id');
    }
}
