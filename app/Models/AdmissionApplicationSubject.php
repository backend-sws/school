<?php

namespace App\Models;

use App\Models\AdmissionApplication;
use Illuminate\Database\Eloquent\Model;

class AdmissionApplicationSubject extends Model
{
    protected $table = 'admission_application_subjects';

    protected $fillable = [
        'admission_application_id',
        'subject_id',
        'subject_category_id',
        'subject_name',
        'subject_code',
    ];

   public function application()
    {
        return $this->belongsTo(AdmissionApplication::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
