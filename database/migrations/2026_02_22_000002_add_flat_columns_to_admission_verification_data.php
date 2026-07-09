<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Add flat columns used by StudentAuthController and AdmissionVerificationData model/factory.
 * Keeps existing EAV columns (field_key, field_value) for flexibility; application_id stored as admission_id for lookup.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('admission_verification_data', function (Blueprint $table) {
            $table->string('admission_id', 50)->nullable();
            $table->string('student_name', 150)->nullable();
            $table->string('fathers_name', 150)->nullable();
            $table->date('dob')->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('category', 30)->nullable();
            $table->string('mobile_number', 15)->nullable();
            $table->string('email', 150)->nullable();
            $table->index('admission_id');
        });

        // Allow rows with only admission_id (e.g. from Excel) without admission_application_id
        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE admission_verification_data ALTER COLUMN admission_application_id DROP NOT NULL');
        } else {
            Schema::table('admission_verification_data', function (Blueprint $table) {
                $table->foreignId('admission_application_id')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('admission_verification_data', function (Blueprint $table) {
            $table->dropIndex(['admission_id']);
            $table->dropColumn([
                'admission_id', 'student_name', 'fathers_name', 'dob',
                'gender', 'category', 'mobile_number', 'email',
            ]);
        });
    }
};
