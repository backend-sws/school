<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('fee_regulation_profiles', function (Blueprint $table) {
            $table->string('profile_type', 30)->nullable();
            $table->string('gender', 20)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('fee_regulation_profiles', function (Blueprint $table) {
            $table->dropColumn(['profile_type', 'gender']);
        });
    }
};
