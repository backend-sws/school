<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_fee_monthly_overrides', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('session_id')->nullable();
            $table->string('for_month', 7)->nullable()->comment('YYYY-MM or null for entire session');
            $table->string('fee_name')->default('Monthly Fee');
            $table->decimal('original_amount', 10, 2);
            $table->decimal('overridden_amount', 10, 2);
            $table->string('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'user_id', 'for_month'], 'idx_fee_monthly_inst_user_month');
            $table->index(['institution_id', 'user_id', 'session_id'], 'idx_fee_monthly_inst_user_session');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_fee_monthly_overrides');
    }
};
