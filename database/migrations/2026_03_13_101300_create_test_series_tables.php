<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phase 1: Test Series & Performance Analytics
 *
 * test_series         — curated grouping of tests (e.g., "JEE Main Mock Series")
 * test_series_tests   — pivot linking test_series ↔ lms_tests
 * test_series_results — aggregated student performance per series
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_series', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('slug')->index();
            $table->string('category')->nullable(); // JEE, NEET, Board, Custom
            $table->string('difficulty')->nullable(); // easy, medium, hard
            $table->boolean('is_published')->default(false);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->integer('sort_order')->default(0);
            $table->jsonb('metadata')->default('{}');
            $table->timestamps();

            $table->unique(['institution_id', 'slug']);
        });

        Schema::create('test_series_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_series_id')->constrained()->onDelete('cascade');
            $table->foreignId('lms_test_id')->constrained()->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['test_series_id', 'lms_test_id']);
        });

        Schema::create('test_series_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_series_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('tests_completed')->default(0);
            $table->integer('total_tests')->default(0);
            $table->decimal('average_score', 5, 2)->default(0);
            $table->decimal('best_score', 5, 2)->default(0);
            $table->decimal('worst_score', 5, 2)->default(0);
            $table->integer('total_time_seconds')->default(0);
            $table->integer('rank')->nullable();
            $table->jsonb('subject_scores')->default('{}'); // {math: 85, physics: 72}
            $table->jsonb('performance_trend')->default('[]'); // [{test_id: 1, score: 80}, ...]
            $table->timestamps();

            $table->unique(['test_series_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_series_results');
        Schema::dropIfExists('test_series_tests');
        Schema::dropIfExists('test_series');
    }
};
