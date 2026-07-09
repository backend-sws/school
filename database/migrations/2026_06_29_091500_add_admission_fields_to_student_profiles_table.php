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
            $table->text('medical_condition')->nullable();
            $table->text('allergy')->nullable();
            $table->string('previous_school_name')->nullable();
            $table->string('previous_roll_no')->nullable();
            $table->string('previous_board')->nullable();
            $table->decimal('previous_marks', 5, 2)->nullable();
            $table->boolean('has_tc')->default(false);
            $table->boolean('has_government_portal')->default(false);
            $table->string('government_portal_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'medical_condition',
                'allergy',
                'previous_school_name',
                'previous_roll_no',
                'previous_board',
                'previous_marks',
                'has_tc',
                'has_government_portal',
                'government_portal_name',
            ]);
        });
    }
};
