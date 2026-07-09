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
        Schema::create('timetable_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('academic')->comment('academic, exam, holiday, special');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('period_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('timetable_template_id')->constrained('timetable_templates')->cascadeOnDelete();
            $table->string('name')->comment('e.g., Period 1, Break, Lunch');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('type')->default('class')->comment('class, break, assembly, other');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('period_slots');
        Schema::dropIfExists('timetable_templates');
    }
};
