<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 50)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['is_active']);
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('expense_category_id')->constrained('expense_categories')->cascadeOnDelete();
            $table->string('title', 200);
            $table->decimal('amount', 12, 2);
            $table->date('date');
            $table->string('payment_mode', 50); // Cash, Bank Transfer, Cheque, UPI, Card
            $table->string('reference_no', 100)->nullable(); // transaction id, cheque number, etc.
            $table->string('payee', 150)->nullable();
            $table->text('description')->nullable();
            $table->string('attachment', 255)->nullable();
            $table->string('status', 30)->default('pending'); // draft, pending, approved, rejected
            $table->foreignId('recorded_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['expense_category_id']);
            $table->index(['status']);
            $table->index(['date']);
        });

        Schema::create('expense_budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('expense_category_id')->constrained('expense_categories')->cascadeOnDelete();
            $table->foreignId('session_id')->constrained('academic_sessions')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->decimal('alert_threshold', 5, 2)->default(90.00); // usage percentage warning
            $table->timestamps();

            $table->unique(['institution_id', 'expense_category_id', 'session_id'], 'expense_budgets_unique_key');
            $table->index(['institution_id']);
            $table->index(['expense_category_id']);
            $table->index(['session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_budgets');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('expense_categories');
    }
};
