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
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->foreignId('fee_regulation_profile_id')->nullable()->constrained('fee_regulation_profiles')->nullOnDelete();
        });
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->foreignId('fee_regulation_profile_id')->nullable()->constrained('fee_regulation_profiles')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropForeign(['fee_regulation_profile_id']);
            $table->dropColumn('fee_regulation_profile_id');
        });
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropForeign(['fee_regulation_profile_id']);
            $table->dropColumn('fee_regulation_profile_id');
        });
    }
};
