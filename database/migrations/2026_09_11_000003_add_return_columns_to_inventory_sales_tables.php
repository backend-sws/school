<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('inventory_sales', function (Blueprint $table) {
            $table->decimal('refunded_amount', 12, 2)->default(0)->after('total_amount');
        });

        Schema::table('inventory_sale_lines', function (Blueprint $table) {
            $table->decimal('returned_quantity', 12, 3)->default(0)->after('quantity');
        });
    }

    public function down(): void
    {
        Schema::table('inventory_sale_lines', function (Blueprint $table) {
            $table->dropColumn('returned_quantity');
        });

        Schema::table('inventory_sales', function (Blueprint $table) {
            $table->dropColumn('refunded_amount');
        });
    }
};
