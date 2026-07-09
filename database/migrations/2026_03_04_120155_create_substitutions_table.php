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
        Schema::create('substitutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('timetable_entry_id')->constrained('timetable_entries')->cascadeOnDelete();
            $table->date('date');
            $table->foreignId('original_teacher_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('substitute_teacher_id')->constrained('users')->cascadeOnDelete();
            $table->string('reason')->nullable();
            $table->string('status')->default('pending')->comment('pending, confirmed, completed, cancelled');
            $table->timestamps();

            $table->unique(['timetable_entry_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('substitutions');
    }
};
