<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lms_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->string('file_path', 500)->nullable();
            $table->string('type', 30)->default('assignment'); // assignment | homework | project
            $table->timestamp('due_at')->nullable();
            $table->decimal('max_score', 10, 2)->nullable();
            $table->boolean('allow_late')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['lms_class_id']);
        });

        Schema::create('lms_assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_assignment_id')->constrained('lms_assignments')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->decimal('score', 10, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->string('file_path', 500)->nullable();
            $table->string('status', 20)->default('draft'); // draft | submitted | graded
            $table->timestamps();

            $table->unique(['lms_assignment_id', 'user_id']);
            $table->index(['user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_assignment_submissions');
        Schema::dropIfExists('lms_assignments');
    }
};
