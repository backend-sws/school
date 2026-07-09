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
        Schema::create('exam_grading_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_grading_scale_id')->constrained()->cascadeOnDelete();
            $table->string('grade', 10); // e.g. "A1", "A+"
            $table->decimal('min_percentage', 5, 2); // e.g. 91.00
            $table->decimal('max_percentage', 5, 2); // e.g. 100.00
            $table->decimal('grade_point', 4, 2)->nullable(); // e.g. 10.0
            $table->string('description')->nullable(); // e.g. "Outstanding"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_grading_rules');
    }
};
