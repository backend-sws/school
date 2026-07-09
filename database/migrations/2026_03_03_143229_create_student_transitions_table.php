<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_transitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('type'); // promotion, readmission, transfer, dropout

            $table->foreignId('from_session_id')->nullable()->constrained('academic_sessions')->nullOnDelete();
            $table->foreignId('to_session_id')->nullable()->constrained('academic_sessions')->nullOnDelete();
            $table->unsignedSmallInteger('from_semester')->nullable();
            $table->unsignedSmallInteger('to_semester')->nullable();
            $table->foreignId('from_class_id')->nullable()->constrained('lms_classes')->nullOnDelete();
            $table->foreignId('to_class_id')->nullable()->constrained('lms_classes')->nullOnDelete();
            $table->unsignedBigInteger('from_section_id')->nullable();
            $table->unsignedBigInteger('to_section_id')->nullable();

            $table->string('status')->default('pending'); // pending, approved, rolled_back

            // Polymorphic detail
            $table->nullableMorphs('transitionable');

            $table->text('remarks')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'type']);
            $table->index(['student_profile_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_transitions');
    }
};
