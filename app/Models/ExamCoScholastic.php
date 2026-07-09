<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;

class ExamCoScholastic extends Model
{
    use HasFactory, BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'name',
        'description',
        'status',
    ];

    public function grades()
    {
        return $this->hasMany(ExamCoScholasticGrade::class);
    }
}
