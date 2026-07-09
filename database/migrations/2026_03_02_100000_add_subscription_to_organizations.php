<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            // Subscription tier
            $table->string('subscription_tier', 20)->default('starter')->after('status');

            // Limits (overridable — defaults come from SubscriptionTier enum)
            $table->integer('max_institutions')->default(1)->after('subscription_tier');
            $table->integer('max_users')->default(200)->after('max_institutions');
            $table->integer('max_staff')->default(5)->after('max_users');
            $table->integer('max_emails_per_month')->default(1000)->after('max_staff');
            $table->integer('storage_quota_gb')->default(2)->after('max_emails_per_month');

            // Billing
            $table->string('billing_cycle', 10)->default('monthly')->after('storage_quota_gb');
            $table->timestamp('subscription_start')->nullable()->after('billing_cycle');
            $table->timestamp('subscription_end')->nullable()->after('subscription_start');
            $table->timestamp('trial_ends_at')->nullable()->after('subscription_end');

            // Add-ons (JSON array of strings, e.g. ["sms","payment_gateway","extra_storage"])
            $table->jsonb('add_ons')->default('[]')->after('trial_ends_at');

            // Usage tracking
            $table->integer('emails_sent_this_month')->default(0)->after('add_ons');
            $table->integer('storage_used_mb')->default(0)->after('emails_sent_this_month');

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
