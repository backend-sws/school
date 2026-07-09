<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('timetables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->foreignId('session_id')->constrained('academic_sessions')->cascadeOnDelete();
            $table->nullableMorphs('scheduleable'); // e.g., CourseSection, Stream, or null for Institution-wide
            $table->foreignId('timetable_template_id')->constrained('timetable_templates')->cascadeOnDelete();
            $table->string('status')->default('draft')->comment('draft, published, archived');
            $table->date('effective_from')->nullable();
            $table->timestamps();
        });

        Schema::create('timetable_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('timetable_id')->constrained('timetables')->cascadeOnDelete();
            $table->foreignId('period_slot_id')->constrained('period_slots')->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week')->comment('1-7 (Mon-Sun)');
            $table->foreignId('room_id')->nullable()->constrained('rooms')->nullOnDelete();
            $table->nullableMorphs('activity'); // e.g., Subject + Teacher (via ClassSubjectAllocation) or Event
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['timetable_id', 'day_of_week', 'period_slot_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetable_entries');
        Schema::dropIfExists('timetables');
    }
};
