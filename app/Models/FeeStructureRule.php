<?php

namespace App\Models;

use App\Enums\FeeSlot;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeStructureRule extends Model
{
    use BelongsToDefaultInstitution;

    public const SCOPE_CLASS = 'class';

    public const SCOPE_STREAM = 'stream';

    public const SCOPE_ADMISSION_HEAD = 'admission_head';

    public const SCOPE_INSTITUTION = 'institution';

    protected $table = 'fee_structures';

    protected $fillable = [
        'institution_id',
        'fee_type_id',
        'amount',
        'scope_type',
        'scope_id',
        'fee_slot',
        'effective_from',
        'effective_to',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'effective_from' => 'date',
        'effective_to' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function feeType(): BelongsTo
    {
        return $this->belongsTo(FeeType::class);
    }

    public function lmsClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'scope_id', 'id');
    }

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class, 'scope_id', 'id');
    }

    public function admissionHead(): BelongsTo
    {
        return $this->belongsTo(AdmissionHead::class, 'scope_id', 'id');
    }
}
