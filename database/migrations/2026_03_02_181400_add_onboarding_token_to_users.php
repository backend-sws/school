<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('onboarding_token', 64)->nullable();
            $table->json('onboarding_data')->nullable();
            $table->index('onboarding_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['onboarding_token']);
            $table->dropColumn('onboarding_token');
        });
    }
};
