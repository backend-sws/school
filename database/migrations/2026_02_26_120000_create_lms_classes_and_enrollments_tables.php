<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lms_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->foreignId('lms_course_id')->nullable()->constrained('lms_courses')->nullOnDelete();
            $table->foreignId('class_subject_allocation_id')->nullable()->constrained('class_subject_allocations')->nullOnDelete();
            $table->foreignId('classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
            $table->foreignId('session_id')->nullable()->constrained('academic_sessions')->nullOnDelete();
            $table->string('name', 200);
            $table->string('code', 50)->nullable();
            $table->unsignedTinyInteger('status')->default(1);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['lms_course_id']);
            $table->index(['class_subject_allocation_id']);
            $table->index(['session_id']);
        });

        Schema::create('lms_class_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('enrolled_at')->useCurrent();
            $table->string('role', 20)->default('student');
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->unique(['lms_class_id', 'user_id']);
            $table->index(['user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_class_enrollments');
        Schema::dropIfExists('lms_classes');
    }
};
