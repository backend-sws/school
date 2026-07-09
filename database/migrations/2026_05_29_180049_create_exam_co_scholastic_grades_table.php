<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_co_scholastic_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lms_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_co_scholastic_id')->constrained()->cascadeOnDelete();
            $table->string('grade', 10);
            $table->string('remarks')->nullable();
            $table->timestamps();
            
            $table->unique(['exam_id', 'student_profile_id', 'exam_co_scholastic_id'], 'exam_co_scholastic_grades_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_co_scholastic_grades');
    }
};
