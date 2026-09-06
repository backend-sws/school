<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffProfile extends Model
{
    use HasFactory, BelongsToDefaultInstitution;

    protected $table = 'staff_profiles';

    protected $fillable = [
        'user_id',
        'institution_id',
        'category',
        'employee_id',
        'aadhaar_no',
        'designation',
        'gender',
        'dob',
        'joining_date',
        'qualification',
        'professional_qualification',
        'appointment_type',
        'trained_status',
        'bio',
        'photo_url',
        'status',
    ];

    protected $casts = [
        'joining_date' => 'date',
        'dob' => 'date',
        'status' => 'integer',
        'category' => 'integer',
        'trained_status' => 'boolean',
    ];

    /** User relationship */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Institution relationship */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    // ─── Status Helpers ─────────────────────────────────────────────────

    public function isActive(): bool { return (int) $this->status === 1; }

    public function isInactive(): bool { return (int) $this->status === 0; }

    protected static function booted(): void
    {
        static::creating(function (StaffProfile $profile) {
            if (empty(trim($profile->employee_id ?? '')) && !empty($profile->institution_id)) {
                $profile->employee_id = static::generateNextEmployeeId((int) $profile->institution_id);
            }
        });
    }

    public static function generateNextEmployeeId(int $institutionId): string
    {
        $allIds = static::withoutGlobalScopes()
            ->where('institution_id', $institutionId)
            ->whereNotNull('employee_id')
            ->where('employee_id', 'LIKE', 'EMP-%')
            ->pluck('employee_id');

        $maxNumber = 0;
        foreach ($allIds as $idStr) {
            if (preg_match('/EMP-(\d+)/i', $idStr, $m)) {
                $num = (int) $m[1];
                if ($num > $maxNumber) {
                    $maxNumber = $num;
                }
            }
        }

        return sprintf('EMP-%03d', $maxNumber + 1);
    }
}

