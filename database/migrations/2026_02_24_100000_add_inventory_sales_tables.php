<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->decimal('selling_price', 12, 2)->nullable()->after('is_active');
        });

        Schema::create('inventory_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('fee_payment_id')->nullable()->constrained('fee_payments')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('buyer_type', 20);
            $table->string('buyer_name', 200)->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->string('payment_status', 20)->default('pending');
            $table->foreignId('collected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('remarks')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['institution_id']);
            $table->index(['fee_payment_id']);
            $table->index(['user_id']);
            $table->index(['created_at']);
            $table->index(['payment_status']);
        });

        Schema::create('inventory_sale_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_sale_id')->constrained()->cascadeOnDelete();
            $table->foreignId('inventory_item_id')->constrained()->cascadeOnDelete();
            $table->decimal('quantity', 12, 3);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('amount', 12, 2);

            $table->index(['inventory_sale_id']);
            $table->index(['inventory_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_sale_lines');
        Schema::dropIfExists('inventory_sales');
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn('selling_price');
        });
    }
};
