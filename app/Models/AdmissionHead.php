<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\Auditable;

class AdmissionHead extends Model
{
    use Auditable;

    use HasFactory, BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'title',
        'course_for',
        'main_stream_id',
        'stream_id',
        'session_id',
        'board_criteria',
        'gender_criteria',
        'last_date',
        'payment_gateway',
        'created_by',
        'status',
        'category_criteria',
        'is_enabled',
        'allow_subject_paper_selection',
        'has_application_fees',
        'application_fees',
        'total_admission_fees',
        'updated_at',
        'created_at',
        'subject_id',
        'subject_category_id',
        'max_credits',
        'min_credits',
        'major_subject_id',
        'semester',

    ];

    protected $casts = [
        'last_date' => 'date',
        'status' => 'integer',
        'board_criteria' => 'array',
        'gender_criteria' => 'array',
        'category_criteria' => 'array',
        'is_enabled' => 'boolean',
        'allow_subject_paper_selection' => 'boolean',
        'has_application_fees' => 'boolean',
        'application_fees' => 'float',
        'total_admission_fees' => 'float',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function mainStream(): BelongsTo
    {
        return $this->belongsTo(MainStream::class);
    }

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function feeStructures(): HasMany
    {
        return $this->hasMany(FeeStructureRule::class, 'scope_id')
            ->where('scope_type', FeeStructureRule::SCOPE_ADMISSION_HEAD);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(AdmissionApplication::class);
    }



    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function papers(): HasMany
    {
        return $this->hasMany(AdmissionHeadPaper::class);
    }

    public function majorSubject()
    {
        return $this->belongsTo(Subject::class, 'major_subject_id');
    }

    public function category()
    {
        return $this->belongsTo(SubjectCategory::class, 'subject_category_id');
    }
}


