<?php

use App\Enums\SubscriptionTier;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Extract subscription columns from organizations into a dedicated subscriptions table.
     * Migrate existing data. Then drop subscription columns from organizations.
     */
    public function up(): void
    {
        // 1. Create subscriptions table
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('tier', 30)->default(SubscriptionTier::STARTER->value);
            $table->string('billing_cycle', 20)->default('monthly');
            $table->integer('max_institutions')->default(1);
            $table->integer('max_users')->default(100);
            $table->integer('max_staff')->default(5);
            $table->integer('max_emails_per_month')->default(500);
            $table->integer('storage_quota_gb')->default(1);
            $table->timestamp('subscription_start')->nullable();
            $table->timestamp('subscription_end')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->jsonb('add_ons')->nullable();
            $table->integer('emails_sent_this_month')->default(0);
            $table->integer('storage_used_mb')->default(0);
            $table->timestamps();
        });

        // 2. Migrate existing data from organizations → subscriptions
        $orgs = DB::table('organizations')->select([
            'id',
            'subscription_tier',
            'billing_cycle',
            'max_institutions',
            'max_users',
            'max_staff',
            'max_emails_per_month',
            'storage_quota_gb',
            'subscription_start',
            'subscription_end',
            'trial_ends_at',
            'add_ons',
            'emails_sent_this_month',
            'storage_used_mb',
        ])->get();

        foreach ($orgs as $org) {
            DB::table('subscriptions')->insert([
                'organization_id' => $org->id,
                'tier' => $org->subscription_tier ?? SubscriptionTier::STARTER->value,
                'billing_cycle' => $org->billing_cycle ?? 'monthly',
                'max_institutions' => $org->max_institutions ?? 1,
                'max_users' => $org->max_users ?? 100,
                'max_staff' => $org->max_staff ?? 5,
                'max_emails_per_month' => $org->max_emails_per_month ?? 500,
                'storage_quota_gb' => $org->storage_quota_gb ?? 1,
                'subscription_start' => $org->subscription_start,
                'subscription_end' => $org->subscription_end,
                'trial_ends_at' => $org->trial_ends_at,
                'add_ons' => $org->add_ons,
                'emails_sent_this_month' => $org->emails_sent_this_month ?? 0,
                'storage_used_mb' => $org->storage_used_mb ?? 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Drop subscription columns from organizations
        Schema::table('organizations', function (Blueprint $table) {
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

    public function down(): void
    {
        // Restore columns to organizations
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('subscription_tier', 30)->default('starter');
            $table->integer('max_institutions')->default(1);
            $table->integer('max_users')->default(100);
            $table->integer('max_staff')->default(5);
            $table->integer('max_emails_per_month')->default(500);
            $table->integer('storage_quota_gb')->default(1);
            $table->string('billing_cycle', 20)->default('monthly');
            $table->timestamp('subscription_start')->nullable();
            $table->timestamp('subscription_end')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->jsonb('add_ons')->nullable();
            $table->integer('emails_sent_this_month')->default(0);
            $table->integer('storage_used_mb')->default(0);
        });

        // Migrate data back from subscriptions → organizations
        $subs = DB::table('subscriptions')->get();
        foreach ($subs as $sub) {
            DB::table('organizations')->where('id', $sub->organization_id)->update([
                'subscription_tier' => $sub->tier,
                'billing_cycle' => $sub->billing_cycle,
                'max_institutions' => $sub->max_institutions,
                'max_users' => $sub->max_users,
                'max_staff' => $sub->max_staff,
                'max_emails_per_month' => $sub->max_emails_per_month,
                'storage_quota_gb' => $sub->storage_quota_gb,
                'subscription_start' => $sub->subscription_start,
                'subscription_end' => $sub->subscription_end,
                'trial_ends_at' => $sub->trial_ends_at,
                'add_ons' => $sub->add_ons,
                'emails_sent_this_month' => $sub->emails_sent_this_month,
                'storage_used_mb' => $sub->storage_used_mb,
            ]);
        }

        Schema::dropIfExists('subscriptions');
    }
};
