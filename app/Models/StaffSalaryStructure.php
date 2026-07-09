<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StaffSalaryStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'basic_salary',
        'effective_from'
    ];

    protected $casts = [
        'effective_from' => 'date',
        'basic_salary' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function components(): HasMany
    {
        return $this->hasMany(StaffSalaryComponent::class);
    }
}
