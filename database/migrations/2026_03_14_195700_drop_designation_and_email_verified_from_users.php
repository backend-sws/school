<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 1. Drop users.designation (belongs on staff_profiles, not users).
     * 2. Drop users.email_verified boolean (duplicates email_verified_at timestamp).
     *    Migrate email_verified=true → email_verified_at=now() where email_verified_at is null.
     */
    public function up(): void
    {
        // Migrate email_verified=true to email_verified_at where timestamp is null
        DB::table('users')
            ->where('email_verified', true)
            ->whereNull('email_verified_at')
            ->update(['email_verified_at' => now()]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['designation', 'email_verified']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('designation', 100)->nullable()->after('reg_no');
            $table->boolean('email_verified')->default(false)->after('status');
        });

        // Restore email_verified from email_verified_at
        DB::table('users')
            ->whereNotNull('email_verified_at')
            ->update(['email_verified' => true]);
    }
};
