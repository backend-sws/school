<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;

class SubjectCategoryMapping extends Model
{
    use Auditable;

    protected $table = 'subject_category_mapping';

    protected $fillable = ['subject_id', 'subject_category_id'];    
}
