<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fix historically imported students who were marked as email-verified
     * despite having no email address (bug in createUserForImport).
     */
    public function up(): void
    {
        DB::table('users')
            ->whereNull('email')
            ->whereNotNull('email_verified_at')
            ->update(['email_verified_at' => null]);

        // Also fix users with empty string email
        DB::table('users')
            ->where('email', '')
            ->whereNotNull('email_verified_at')
            ->update(['email_verified_at' => null]);
    }

    /**
     * Reverse is not meaningful — we can't know which users were
     * incorrectly verified vs intentionally unverified.
     */
    public function down(): void
    {
        // No rollback possible for data fix
    }
};
