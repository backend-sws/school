<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Make institution_id and user_id nullable on ai_usage_logs.
 * Public/unauthenticated AI usage (landing page chatbot) has no institution or user.
 *
 * Uses raw SQL to avoid doctrine/dbal dependency.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Drop FK constraints first
        DB::statement('ALTER TABLE ai_usage_logs DROP CONSTRAINT IF EXISTS ai_usage_logs_institution_id_foreign');
        DB::statement('ALTER TABLE ai_usage_logs DROP CONSTRAINT IF EXISTS ai_usage_logs_user_id_foreign');

        // Make columns nullable
        DB::statement('ALTER TABLE ai_usage_logs ALTER COLUMN institution_id DROP NOT NULL');
        DB::statement('ALTER TABLE ai_usage_logs ALTER COLUMN user_id DROP NOT NULL');

        // Re-add FK constraints (nullable-safe)
        DB::statement('ALTER TABLE ai_usage_logs ADD CONSTRAINT ai_usage_logs_institution_id_foreign FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE');
        DB::statement('ALTER TABLE ai_usage_logs ADD CONSTRAINT ai_usage_logs_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE ai_usage_logs ALTER COLUMN institution_id SET NOT NULL');
        DB::statement('ALTER TABLE ai_usage_logs ALTER COLUMN user_id SET NOT NULL');
    }
};
