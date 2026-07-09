<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;

class SubjectGroup extends Model
{
    use Auditable;

    use HasFactory, BelongsToDefaultInstitution;

    protected $table = 'subject_groups';

    protected $fillable = ['name', 'code', 'status', 'institution_id'];

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }
}
