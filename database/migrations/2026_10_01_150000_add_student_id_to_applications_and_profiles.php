<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('admission_applications') && !Schema::hasColumn('admission_applications', 'student_id')) {
            Schema::table('admission_applications', function (Blueprint $table) {
                $table->string('student_id', 100)->nullable()->after('application_id')->index();
            });
        }

        if (Schema::hasTable('student_profiles') && !Schema::hasColumn('student_profiles', 'student_id')) {
            Schema::table('student_profiles', function (Blueprint $table) {
                $table->string('student_id', 100)->nullable()->after('reg_no')->index();
            });
        }

        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'student_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('student_id', 100)->nullable()->after('reg_no')->index();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('admission_applications') && Schema::hasColumn('admission_applications', 'student_id')) {
            Schema::table('admission_applications', function (Blueprint $table) {
                $table->dropColumn('student_id');
            });
        }

        if (Schema::hasTable('student_profiles') && Schema::hasColumn('student_profiles', 'student_id')) {
            Schema::table('student_profiles', function (Blueprint $table) {
                $table->dropColumn('student_id');
            });
        }

        if (Schema::hasTable('users') && Schema::hasColumn('users', 'student_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('student_id');
            });
        }
    }
};
