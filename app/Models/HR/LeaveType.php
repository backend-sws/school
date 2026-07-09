<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    use HasFactory;

    protected $table = 'hr_leave_types';

    protected $fillable = [
        'institution_id',
        'name',
        'days_allowed',
        'is_paid_leave',
    ];

    protected $casts = [
        'is_paid_leave' => 'boolean',
        'days_allowed' => 'integer',
    ];
}
