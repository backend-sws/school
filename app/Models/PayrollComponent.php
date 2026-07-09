<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollComponent extends Model
{
    use HasFactory, BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'type',
        'is_taxable'
    ];

    protected $casts = [
        'is_taxable' => 'boolean',
    ];
}
