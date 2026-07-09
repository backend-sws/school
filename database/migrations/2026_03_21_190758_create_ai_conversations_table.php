<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('sutra_conversation_id');
            $table->string('agent_type', 50);
            $table->string('title', 255)->nullable();
            $table->string('context_type', 50)->nullable();
            $table->unsignedBigInteger('context_id')->nullable();
            $table->unsignedInteger('message_count')->default(0);
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'user_id'], 'idx_institution_user');
            $table->index(['context_type', 'context_id'], 'idx_context');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_conversations');
    }
};
