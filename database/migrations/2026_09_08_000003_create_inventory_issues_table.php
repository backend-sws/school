<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->decimal('quantity', 12, 3);
            $table->decimal('quantity_after', 12, 3)->nullable(); // stock after this issue
            // Who received the item
            $table->unsignedBigInteger('issued_to_user_id')->nullable();   // FK to users (staff), nullable
            $table->foreign('issued_to_user_id')->references('id')->on('users')->nullOnDelete();
            $table->string('issued_to_name', 200)->nullable();    // free-text fallback if no user
            $table->string('department', 150)->nullable();         // Sports, Mess, Lab, etc.
            $table->string('purpose', 300)->nullable();            // what it's used for
            // Returns tracking
            $table->decimal('returned_quantity', 12, 3)->default(0);
            // Who issued it (store manager)
            $table->foreignId('issued_by')->constrained('users')->cascadeOnDelete();
            $table->date('issued_at');
            $table->text('remarks')->nullable();
            // Back-reference to the auto-created inventory movement (issue)
            $table->unsignedBigInteger('movement_id')->nullable();
            $table->foreign('movement_id')->references('id')->on('inventory_movements')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['institution_id']);
            $table->index(['inventory_item_id']);
            $table->index(['issued_to_user_id']);
            $table->index(['issued_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_issues');
    }
};
