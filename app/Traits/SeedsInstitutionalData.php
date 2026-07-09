<?php

namespace App\Traits;

use App\Models\Institution;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

trait SeedsInstitutionalData
{
    /**
     * Seeds institutional settings for a specific college.
     */
    protected function seedSettings(int $collegeId, array $settings): void
    {
        foreach ($settings as $setting) {
            Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $collegeId, 'setting_key' => $setting['setting_key']],
                [
                    'setting_group' => $setting['setting_group'],
                    'setting_value' => is_array($setting['setting_value'])
                        ? json_encode($setting['setting_value'])
                        : $setting['setting_value']
                ]
            );
        }
    }

    /**
     * Seeds users and assigns their roles with college scope.
     */
    protected function seedUsers(int $collegeId, array $users): void
    {
        $institutionType = Institution::find($collegeId)?->type?->value ?? config('ems.default_institution_type');
        foreach ($users as $row) {
            $user = User::updateOrCreate(
                ['email' => $row['email']],
                [
                    'name' => $row['name'],
                    'password' => Hash::make($row['password'] ?? 'password'),
                    'email_verified_at' => now(),
                    'status' => 1,
                ]
            );

            $role = Role::withoutGlobalScope('institution_scope')->where('key', $row['role'])->first();
            if ($role) {
                DB::table('user_roles')->updateOrInsert(
                    [
                        'user_id' => $user->id,
                        'role_id' => $role->id,
                        'institution_id' => $collegeId,
                    ],
                    ['assigned_at' => now()]
                );
            }

            if (!empty($row['student_profile']) && $row['role'] === 'student') {
                $this->ensureStudentProfile($user->id, $collegeId);
            }
        }
    }

    /**
     * Ensures a student profile exists for the user.
     */
    protected function ensureStudentProfile(int $userId, int $collegeId): void
    {
        $streamId = \App\Models\Stream::where('institution_id', $collegeId)->value('id');
        $sessionId = \App\Models\Session::where('institution_id', $collegeId)->value('id');

        if (!$streamId || !$sessionId) {
            return;
        }

        \App\Models\StudentProfile::updateOrCreate(
            ['user_id' => $userId],
            [
                'institution_id' => $collegeId,
                'stream_id' => $streamId,
                'session_id' => $sessionId,
                'reg_no' => 'REG-' . $collegeId . '-' . str_pad((string) $userId, 4, '0', STR_PAD_LEFT),
                'roll_no' => 'ROLL-' . $userId,
                'father_name' => 'Demo Father',
                'mother_name' => 'Demo Mother',
                'dob' => '2005-01-01',
                'gender' => 'Male',
                'category' => 'General',
                'verified' => true,
                'verified_at' => now(),
            ]
        );
    }
}
