<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('agent_type', 50);
            $table->string('endpoint', 100);
            $table->string('prompt_preview', 500)->nullable();
            $table->unsignedInteger('tokens_used')->default(0);
            $table->string('model_used', 50)->nullable();
            $table->string('response_status', 20)->default('ok');
            $table->unsignedInteger('latency_ms')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['institution_id', 'created_at'], 'idx_institution_month');
            $table->index('user_id', 'idx_user');
            $table->index('agent_type', 'idx_agent_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_usage_logs');
    }
};
