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
        Schema::table('users', function (Blueprint $table) {
            $table->string('card_last_four', 4)->nullable()->after('onboarding_data');
            $table->string('card_holder_name', 50)->nullable()->after('card_last_four');
            $table->text('card_expiry_encrypted')->nullable()->after('card_holder_name');
            $table->text('card_token_encrypted')->nullable()->after('card_expiry_encrypted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'card_last_four',
                'card_holder_name',
                'card_expiry_encrypted',
                'card_token_encrypted',
            ]);
        });
    }
};
