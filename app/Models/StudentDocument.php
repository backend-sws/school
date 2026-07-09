<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentDocument extends Model
{
    use BelongsToDefaultInstitution;

    protected $table = 'student_documents';
    protected $fillable = [
        'user_id',
        'institution_id',
        'doc_type',
        'doc_path',
        'document_type',
        'file_url',
        'status',
        'reject_remark',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

}
