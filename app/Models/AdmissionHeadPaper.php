<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;

class AdmissionHeadPaper extends Model
{
    use BelongsToDefaultInstitution;

    protected $table = 'admission_head_papers';

    protected $fillable = ['institution_id', 'admission_head_id', 'subject_category_id', 'paper_limit', 'sort_order', 'is_compulsory'];

    public function admissionHead()
    {
        return $this->belongsTo(AdmissionHead::class);
    }

    // public function subjectCategory()
    // {
    //     return $this->belongsTo(SubjectCategory::class);
    // }

    public function category()
    {
        return $this->belongsTo(SubjectCategory::class, 'subject_category_id');
    }
}
