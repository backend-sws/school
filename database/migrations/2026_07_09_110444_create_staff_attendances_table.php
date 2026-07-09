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
        Schema::create('hr_staff_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'half_day', 'on_leave'])->default('present');
            $table->foreignId('leave_type_id')->nullable()->constrained('hr_leave_types')->nullOnDelete();
            $table->string('remarks')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'date']);
            $table->index(['institution_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hr_staff_attendances');
    }
};
