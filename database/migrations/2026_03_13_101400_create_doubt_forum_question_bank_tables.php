<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phase 2: Doubt Forum & Question Bank
 *
 * doubt_threads              — subject-wise doubt posts
 * doubt_replies              — threaded replies (faculty answers)
 * question_bank_categories   — hierarchical categories
 * question_bank_questions    — categorised questions with practice mode support
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Doubt Forum ────────────────────────────────────────────
        Schema::create('doubt_threads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('lms_class_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('class_subject_allocation_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->text('body');
            $table->string('status')->default('open'); // open, answered, resolved, closed
            $table->integer('upvotes')->default(0);
            $table->integer('reply_count')->default(0);
            $table->boolean('is_pinned')->default(false);
            $table->string('tags')->nullable(); // comma-separated tags
            $table->timestamps();

            $table->index(['institution_id', 'status']);
            $table->index(['institution_id', 'lms_class_id']);
        });

        Schema::create('doubt_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doubt_thread_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('body');
            $table->boolean('is_accepted')->default(false);
            $table->integer('upvotes')->default(0);
            $table->timestamps();

            $table->index(['doubt_thread_id', 'is_accepted']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doubt_replies');
        Schema::dropIfExists('doubt_threads');
    }
};
