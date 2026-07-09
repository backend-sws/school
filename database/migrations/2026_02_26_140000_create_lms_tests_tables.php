<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lms_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('duration_minutes')->nullable();
            $table->unsignedTinyInteger('max_attempts')->default(1);
            $table->timestamp('available_from')->nullable();
            $table->timestamp('available_until')->nullable();
            $table->boolean('shuffle_questions')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['lms_class_id']);
        });

        Schema::create('lms_test_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_test_id')->constrained('lms_tests')->cascadeOnDelete();
            $table->text('question_text');
            $table->string('type', 30)->default('mcq'); // mcq | short_answer | true_false | essay
            $table->json('options')->nullable(); // for MCQ: [{ "key": "A", "text": "..." }, ...]
            $table->string('correct_answer', 500)->nullable();
            $table->decimal('points', 10, 2)->default(1);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['lms_test_id']);
        });

        Schema::create('lms_test_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_test_id')->constrained('lms_tests')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('submitted_at')->nullable();
            $table->decimal('score', 10, 2)->nullable();
            $table->json('answers_snapshot')->nullable();
            $table->string('status', 20)->default('in_progress'); // in_progress | submitted | graded
            $table->timestamps();

            $table->index(['lms_test_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_test_attempts');
        Schema::dropIfExists('lms_test_questions');
        Schema::dropIfExists('lms_tests');
    }
};
