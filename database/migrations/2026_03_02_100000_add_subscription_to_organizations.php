<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            // Subscription tier
            $table->string('subscription_tier', 20)->default('starter');

            // Limits (overridable — defaults come from SubscriptionTier enum)
            $table->integer('max_institutions')->default(1);
            $table->integer('max_users')->default(200);
            $table->integer('max_staff')->default(5);
            $table->integer('max_emails_per_month')->default(1000);
            $table->integer('storage_quota_gb')->default(2);

            // Billing
            $table->string('billing_cycle', 10)->default('monthly');
            $table->timestamp('subscription_start')->nullable();
            $table->timestamp('subscription_end')->nullable();
            $table->timestamp('trial_ends_at')->nullable();

            // Add-ons (JSON array of strings, e.g. ["sms","payment_gateway","extra_storage"])
            $table->jsonb('add_ons')->default('[]');

            // Usage tracking
            $table->integer('emails_sent_this_month')->default(0);
            $table->integer('storage_used_mb')->default(0);

            // Index for quick lookups
            $table->index('subscription_tier');
        });
    }

    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropIndex(['subscription_tier']);
            $table->dropColumn([
                'subscription_tier',
                'max_institutions',
                'max_users',
                'max_staff',
                'max_emails_per_month',
                'storage_quota_gb',
                'billing_cycle',
                'subscription_start',
                'subscription_end',
                'trial_ends_at',
                'add_ons',
                'emails_sent_this_month',
                'storage_used_mb',
            ]);
        });
    }
};
