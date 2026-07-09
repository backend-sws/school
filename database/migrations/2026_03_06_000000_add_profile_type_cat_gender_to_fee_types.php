<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('fee_types', function (Blueprint $table) {
            $table->string('profile_type', 30)->nullable();
            $table->string('reservation_category', 30)->nullable();
            $table->string('gender', 20)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('fee_types', function (Blueprint $table) {
            $table->dropColumn(['profile_type', 'reservation_category', 'gender']);
        });
    }
};
