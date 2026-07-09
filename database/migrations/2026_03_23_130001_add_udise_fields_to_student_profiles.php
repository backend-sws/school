<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->string('apaar_id', 12)->nullable()->after('abc_id');
            $table->string('disability_type', 50)->nullable()->after('is_differently_abled');
            $table->boolean('minority_status')->default(false)->after('religion');
            $table->string('transport_mode', 30)->nullable()->after('marital_status');
            $table->boolean('free_textbook')->default(false)->after('transport_mode');
            $table->boolean('midday_meal_beneficiary')->default(false)->after('free_textbook');
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
