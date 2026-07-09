<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;

class StudentVerificationData extends Model
{
    use BelongsToDefaultInstitution;
    protected $table = 'student_verification_data';

    protected $fillable = [
       'institution_id', 'main_stream_id', 'registration_no', 'student_name'
    ];

    public function mainStream()
    {
        return $this->belongsTo(Stream::class, 'main_stream_id');
    }


   
}
