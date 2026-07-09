<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_fee_period_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('session_id')->constrained('academic_sessions')->cascadeOnDelete();
            $table->string('period_key', 10);
            $table->decimal('opening_balance', 12, 2)->default(0);
            $table->decimal('period_fee', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('late_fee', 12, 2)->default(0);
            $table->decimal('total_payable', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('closing_balance', 12, 2)->default(0);
            $table->string('frequency', 20)->default('monthly');
            $table->string('version_hash', 64)->nullable();
            $table->timestamps();

            $table->unique(['institution_id', 'user_id', 'session_id', 'period_key'], 'student_fee_period_unique');
            $table->index(['institution_id', 'period_key']);
            $table->index(['user_id', 'period_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_fee_period_balances');
    }
};
