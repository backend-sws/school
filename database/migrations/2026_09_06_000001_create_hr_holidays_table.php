<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hr_holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name');                         // e.g. "Diwali", "Independence Day"
            $table->date('date');
            $table->year('year');                           // Redundant but handy for fast filtering
            $table->boolean('is_recurring')->default(false); // Har saal same date pe ho
            $table->string('description')->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'year']);
            $table->unique(['institution_id', 'date']);     // Ek din me ek hi holiday
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hr_holidays');
    }
};
