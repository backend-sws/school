<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffSalaryComponent extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_salary_structure_id',
        'payroll_component_id',
        'amount'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function structure(): BelongsTo
    {
        return $this->belongsTo(StaffSalaryStructure::class, 'staff_salary_structure_id');
    }

    public function payrollComponent(): BelongsTo
    {
        return $this->belongsTo(PayrollComponent::class, 'payroll_component_id');
    }
}
