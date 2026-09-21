<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fee_regulation_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('fee_regulation_profiles', 'session_id')) {
                $table->foreignId('session_id')
                    ->nullable()
                    ->after('institution_id')
                    ->constrained('academic_sessions')
                    ->nullOnDelete();
                $table->index(['institution_id', 'session_id']);
            }
        });

        // Backward-compatible backfill: link existing profiles to the academic session where students are enrolled,
        // or fallback to session matching 2025-2026 / current session.
        $profiles = DB::table('fee_regulation_profiles')->whereNull('session_id')->get();
        foreach ($profiles as $profile) {
            $sessionId = DB::table('student_profiles')
                ->where('fee_regulation_profile_id', $profile->id)
                ->whereNotNull('session_id')
                ->value('session_id');

            if (!$sessionId) {
                $sessionId = DB::table('academic_sessions')
                    ->where('institution_id', $profile->institution_id)
                    ->where('name', 'like', '%2025-2026%')
                    ->value('id');
            }

            if (!$sessionId) {
                $sessionId = DB::table('academic_sessions')
                    ->where('institution_id', $profile->institution_id)
                    ->where('is_current', true)
                    ->value('id');
            }

            if ($sessionId) {
                DB::table('fee_regulation_profiles')
                    ->where('id', $profile->id)
                    ->update(['session_id' => $sessionId]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('fee_regulation_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('fee_regulation_profiles', 'session_id')) {
                $table->dropForeign(['session_id']);
                $table->dropIndex(['institution_id', 'session_id']);
                $table->dropColumn('session_id');
            }
        });
    }
};
