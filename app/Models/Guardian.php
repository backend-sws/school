<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Guardian (parent) model: one parent can have multiple students.
 *
 * - One Guardian has many students (Users) via guardian_students.
 * - Optional user_id: when set, this User is the parent's login; one parent User can have many Guardian records (e.g. per institution), each with many students.
 */
class Guardian extends Model
{
    protected $table = 'guardians';

    protected $fillable = [
        'institution_id',
        'name',
        'email',
        'mobile',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'institution_id' => 'integer',
        ];
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /** Parent login account (nullable until parent links/registers). */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Students linked to this guardian (one parent → many students). */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'guardian_students', 'guardian_id', 'user_id')
            ->withPivot(['relation', 'is_primary'])
            ->withTimestamps();
    }
}
