<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;

    protected $table = 'hr_holidays';

    protected $fillable = [
        'institution_id',
        'name',
        'date',
        'year',
        'is_recurring',
        'description',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'is_recurring' => 'boolean',
    ];
}
