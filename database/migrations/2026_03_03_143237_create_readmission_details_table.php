<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('readmission_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admission_application_id')->nullable()->constrained()->nullOnDelete();
            $table->text('dropout_reason')->nullable();
            $table->unsignedSmallInteger('gap_duration_months')->nullable();
            $table->string('previous_enrollment_status')->nullable(); // what they were before leaving
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('readmission_details');
    }
};
