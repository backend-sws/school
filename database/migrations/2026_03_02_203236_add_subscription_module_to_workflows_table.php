<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->string('subscription_module')->nullable()
                ->comment('Maps to SubscriptionTier::modules() key (e.g. core, admissions, fee_management)');
            $table->index('subscription_module');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->dropIndex(['subscription_module']);
            $table->dropColumn('subscription_module');
        });
    }
};
