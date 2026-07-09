<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmissionVerificationData extends Model
{
    use HasFactory, BelongsToDefaultInstitution;

    protected $table = 'admission_verification_data';

    protected $fillable = [
        'institution_id',
        'admission_application_id',
        'admission_id',
        'student_name',
        'category',
        'gender',
        'dob',
        'fathers_name',
        'mobile_number',
        'email',
        'field_key',
        'field_type',
        'field_value',
        'file_url',
    ];

}
