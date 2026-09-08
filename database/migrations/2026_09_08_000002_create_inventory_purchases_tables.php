<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Purchase header — ek shopping trip / bill
        Schema::create('inventory_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('bill_no', 100)->nullable();          // Invoice / bill number
            $table->string('supplier_name', 200)->nullable();    // Market / shop name
            $table->date('purchased_at');                        // Date of purchase
            $table->decimal('total_cost', 14, 2)->default(0);   // Sum of all lines
            $table->string('payment_mode', 50)->default('cash'); // cash, upi, bank
            $table->foreignId('purchased_by')->constrained('users')->cascadeOnDelete(); // staff who purchased
            $table->text('remarks')->nullable();
            // Expense link — auto-created expense entry
            $table->unsignedBigInteger('expense_id')->nullable();
            $table->foreign('expense_id')->references('id')->on('expenses')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['purchased_at']);
            $table->index(['purchased_by']);
        });

        // Purchase lines — each item in the purchase
        Schema::create('inventory_purchase_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_purchase_id')->constrained('inventory_purchases')->cascadeOnDelete();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->decimal('quantity', 12, 3);
            $table->decimal('unit_cost', 12, 2)->default(0);   // price per unit
            $table->decimal('amount', 14, 2)->default(0);       // quantity * unit_cost
            // Back-reference to the auto-created inventory movement (receive)
            $table->unsignedBigInteger('movement_id')->nullable();
            $table->foreign('movement_id')->references('id')->on('inventory_movements')->nullOnDelete();

            $table->index(['inventory_purchase_id']);
            $table->index(['inventory_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_purchase_lines');
        Schema::dropIfExists('inventory_purchases');
    }
};
