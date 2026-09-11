<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentFeeOneTimeOverride extends Model
{
    protected $table = 'student_fee_one_time_overrides';

    protected $fillable = [
        'institution_id',
        'user_id',
        'fee_type_id',
        'charge_name',
        'original_amount',
        'overridden_amount',
        'remarks',
        'created_by',
    ];

    protected $casts = [
        'original_amount'   => 'decimal:2',
        'overridden_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function feeType(): BelongsTo
    {
        return $this->belongsTo(FeeType::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
