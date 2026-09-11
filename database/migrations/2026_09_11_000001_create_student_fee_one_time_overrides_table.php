<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_fee_one_time_overrides', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('fee_type_id');
            $table->decimal('original_amount', 10, 2);
            $table->decimal('overridden_amount', 10, 2);
            $table->string('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->unique(['institution_id', 'user_id', 'fee_type_id'], 'student_fee_onetime_override_unique');
            $table->index(['institution_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_fee_one_time_overrides');
    }
};
