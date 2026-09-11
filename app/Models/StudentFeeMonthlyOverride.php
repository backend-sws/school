<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentFeeMonthlyOverride extends Model
{
    protected $table = 'student_fee_monthly_overrides';

    protected $fillable = [
        'institution_id',
        'user_id',
        'session_id',
        'for_month',
        'fee_name',
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

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
