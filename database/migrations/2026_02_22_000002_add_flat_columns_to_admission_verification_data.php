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
            $table->string('admission_id', 50)->nullable()->after('institution_id');
            $table->string('student_name', 150)->nullable()->after('admission_id');
            $table->string('fathers_name', 150)->nullable()->after('student_name');
            $table->date('dob')->nullable()->after('fathers_name');
            $table->string('gender', 20)->nullable()->after('dob');
            $table->string('category', 30)->nullable()->after('gender');
            $table->string('mobile_number', 15)->nullable()->after('category');
            $table->string('email', 150)->nullable()->after('mobile_number');
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
