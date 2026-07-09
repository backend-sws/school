<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->string('apaar_id', 12)->nullable();
            $table->string('disability_type', 50)->nullable();
            $table->boolean('minority_status')->default(false);
            $table->string('transport_mode', 30)->nullable();
            $table->boolean('free_textbook')->default(false);
            $table->boolean('midday_meal_beneficiary')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'apaar_id',
                'disability_type',
                'minority_status',
                'transport_mode',
                'free_textbook',
                'midday_meal_beneficiary',
            ]);
        });
    }
};
